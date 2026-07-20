import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
const integrationService = require('@/services/integrationService');

export async function GET() {
  await dbConnect();
  const integrations = await integrationService.getIntegrations();
  return NextResponse.json({ integrations });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { name, type, config, createdBy } = await req.json();
  const integration = await integrationService.createIntegration({ name, type, config, createdBy });
  return NextResponse.json({ integration });
}
