import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
const customReportService = require('@/services/customReportService');

export async function GET() {
  await dbConnect();
  const reports = await customReportService.getReports();
  return NextResponse.json({ reports });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { title, description, createdBy, filters, data } = await req.json();
  const report = await customReportService.createReport({ title, description, createdBy, filters, data });
  return NextResponse.json({ report });
}
