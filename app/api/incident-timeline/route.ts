import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
const incidentTimelineService = require('@/services/incidentTimelineService');

export async function GET() {
  await dbConnect();
  const timelines = await incidentTimelineService.getIncidentTimelines();
  return NextResponse.json({ timelines });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { incidentId, event, details, timestamp, createdBy } = await req.json();
  const t = await incidentTimelineService.createIncidentTimeline({ incidentId, event, details, timestamp, createdBy });
  return NextResponse.json({ timeline: t });
}
