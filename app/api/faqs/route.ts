import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
const faqService = require('@/services/faqService');

export async function GET() {
  await dbConnect();
  const faqs = await faqService.getFaqs();
  return NextResponse.json({ faqs });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { question, answer, createdBy } = await req.json();
  const faq = await faqService.createFaq({ question, answer, createdBy });
  return NextResponse.json({ faq });
}
