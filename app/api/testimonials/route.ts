import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
const testimonialService = require('@/services/testimonialService');

export async function GET() {
  await dbConnect();
  const testimonials = await testimonialService.getTestimonials();
  return NextResponse.json({ testimonials });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { author, content, company } = await req.json();
  const t = await testimonialService.createTestimonial({ author, content, company });
  return NextResponse.json({ testimonial: t });
}
