import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
const customerStoryService = require('@/services/customerStoryService');

export async function GET() {
  await dbConnect();
  const stories = await customerStoryService.getCustomerStories();
  return NextResponse.json({ stories });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { customerName, story, logoUrl } = await req.json();
  const cs = await customerStoryService.createCustomerStory({ customerName, story, logoUrl });
  return NextResponse.json({ story: cs });
}
