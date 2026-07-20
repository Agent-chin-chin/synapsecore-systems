import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
const statusService = require('@/services/statusPageService');

export async function GET() {
  await dbConnect();
  const status = await statusService.getStatus();
  return NextResponse.json({ status });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { status, message, updatedBy } = await req.json();
  const newStatus = await statusService.updateStatus({ status, message, updatedBy });
  return NextResponse.json({ status: newStatus });
}
