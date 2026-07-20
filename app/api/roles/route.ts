import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { authenticateAPI, requireRole } from '@/lib/apiAuth';
const roleService = require('@/services/roleService');
const auditLogService = require('@/services/auditLogService');

async function authorize(request: NextRequest) {
  const user = authenticateAPI(request);
  if (!user) {
    return null;
  }
  if (!requireRole(user, 'admin', 'Super Admin', 'Support Engineer')) {
    return null;
  }
  return user;
}

export async function GET(request: NextRequest) {
  await dbConnect();
  const user = await authorize(request);
  if (!user) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const roles = await roleService.getRoles();
  return NextResponse.json({ roles });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const user = await authorize(req);
  if (!user) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { name, permissions } = await req.json();
  if (!name || !Array.isArray(permissions)) {
    return NextResponse.json({ error: 'Name and permissions are required' }, { status: 400 });
  }

  const role = await roleService.createRole({ name, permissions });
  await auditLogService.createAuditLog({
    actorId: user._id,
    action: 'create_role',
    targetType: 'Role',
    targetId: role._id,
    details: `Created role ${role.name}`
  });

  return NextResponse.json({ role }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  const user = await authorize(req);
  if (!user) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { roleId, name, permissions } = await req.json();
  if (!roleId || !name || !Array.isArray(permissions)) {
    return NextResponse.json({ error: 'roleId, name, and permissions are required' }, { status: 400 });
  }

  const role = await roleService.updateRole(roleId, { name, permissions });
  await auditLogService.createAuditLog({
    actorId: user._id,
    action: 'update_role',
    targetType: 'Role',
    targetId: role._id,
    details: `Updated role ${role.name}`
  });

  return NextResponse.json({ role });
}

export async function DELETE(request: NextRequest) {
  await dbConnect();
  const user = await authorize(request);
  if (!user) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const roleId = searchParams.get('roleId');
  if (!roleId) {
    return NextResponse.json({ error: 'roleId is required' }, { status: 400 });
  }

  const role = await roleService.deleteRole(roleId);
  await auditLogService.createAuditLog({
    actorId: user._id,
    action: 'delete_role',
    targetType: 'Role',
    targetId: role._id,
    details: `Deleted role ${role.name}`
  });

  return NextResponse.json({ message: 'Role deleted successfully' });
}
