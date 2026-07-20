import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
const resourceService = require('@/services/resourceService');

export async function GET() {
  await dbConnect();
  const resources = await resourceService.getResources();
  return NextResponse.json({ resources });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { title, description, url, type, createdBy } = await req.json();
  const resource = await resourceService.createResource({ title, description, url, type, createdBy });
  return NextResponse.json({ resource });
}
