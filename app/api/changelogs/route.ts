import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
const changelogService = require('@/services/changelogService');

export async function GET() {
  await dbConnect();
  const changelogs = await changelogService.getChangelogs();
  return NextResponse.json({ changelogs });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { title, description, version, releasedAt, createdBy } = await req.json();
  const c = await changelogService.createChangelog({ title, description, version, releasedAt, createdBy });
  return NextResponse.json({ changelog: c });
}
