import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authenticateAPI, requireRole } from '@/lib/apiAuth';
import User from '@/lib/models/User';
import connectDB from '@/lib/mongoose';
import { getUsers, updateUserRole, updateUserStatus, deleteUser } from '@/services/userService';
import { createAuditLog } from '@/services/auditLogService';
import { errorResponse } from '@/lib/apiResponse';
import { sendNotificationEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const user = authenticateAPI(request);
    if (!user) {
      return errorResponse({ message: 'Unauthorized', status: 401 });
    }

    if (!requireRole(user, 'admin', 'Super Admin', 'Support Engineer')) {
      return errorResponse({ message: 'Forbidden - Admin access required', status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const role = searchParams.get('role') || undefined;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const result = await getUsers({ page, limit, role, status, search });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return errorResponse({ message: 'Internal Server Error', status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { fullname, email, phone, password, role } = body;

    if (!fullname || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const user = new User({
      fullname,
      email,
      phone,
      password,
      role: role || 'client',
      status: role === 'learner' ? 'pending' : 'approved'
    });

    await user.save();

    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      { message: 'User created successfully', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!requireRole(user, 'admin', 'Super Admin')) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { userId, role, status } = body;
    
    if (!userId || (!role && !status)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let updatedUser: any = null;
    if (role) {
      const validRoles = ['admin', 'client', 'learner', 'Super Admin', 'Support Engineer', 'Client/User'];
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { error: 'Invalid role' },
          { status: 400 }
        );
      }
      updatedUser = await updateUserRole(userId, role);
      await createAuditLog({
        actorId: user.id,
        action: 'update_role',
        targetType: 'User',
        targetId: userId,
        details: `Role changed to ${role}`
      });
    }

    if (status) {
      const validStatuses = ['pending', 'approved', 'rejected'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        );
      }
      updatedUser = await updateUserStatus(userId, status);
      await createAuditLog({
        actorId: user.id,
        action: 'update_status',
        targetType: 'User',
        targetId: userId,
        details: `Status changed to ${status}`
      });
    }

    if (updatedUser) {
      try {
        // Notify the user about status change via email (non-blocking)
        await sendNotificationEmail(
          { email: updatedUser.email, fullname: updatedUser.fullname },
          `Account ${status?.charAt(0).toUpperCase() + status?.slice(1)}`,
          `Hello ${updatedUser.fullname},\n\nYour account status has been updated to ${status}.\n\nBest regards,\nSynapseCore Team`
        );
      } catch (notifyErr) {
        console.warn('Failed to send status update email:', notifyErr);
      }
    }
    
    return NextResponse.json(
      { message: 'User updated successfully', user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user role:', error);
    if (error instanceof Error && error.message === 'User not found') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!requireRole(user, 'admin', 'Super Admin')) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required parameter' },
        { status: 400 }
      );
    }
    
    const result = await deleteUser(userId);
    await createAuditLog({
      actorId: user.id,
      action: 'delete_user',
      targetType: 'User',
      targetId: userId,
      details: 'User removed by admin'
    });
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error instanceof Error && error.message === 'User not found') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
