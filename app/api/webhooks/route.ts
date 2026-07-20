import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
const webhookService = require('@/services/webhookService');

export async function GET() {
  await dbConnect();
  const webhooks = await webhookService.getWebhooks();
  return NextResponse.json({ webhooks });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { url, event, secret, createdBy } = await req.json();
  const webhook = await webhookService.createWebhook({ url, event, secret, createdBy });
  return NextResponse.json({ webhook });
}
