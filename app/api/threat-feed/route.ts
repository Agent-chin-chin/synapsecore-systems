import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
const threatFeedService = require('@/services/threatFeedService');

export async function GET() {
  await dbConnect();
  const feeds = await threatFeedService.getThreatFeeds();
  return NextResponse.json({ feeds });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { title, description, severity, publishedAt, source } = await req.json();
  const t = await threatFeedService.createThreatFeed({ title, description, severity, publishedAt, source });
  return NextResponse.json({ feed: t });
}
