import type { NextRequest } from 'next/server';
import { authenticateAPI, requireRole } from '@/lib/apiAuth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { supportTicketSchema } from '@/lib/validation';
import SupportTicket from '@/lib/models/Support';
import connectDB from '@/lib/mongoose';
import { recordAudit } from '@/services/auditService';

export async function GET(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return errorResponse({ message: 'Unauthorized', status: 401 });
    }

    if (!requireRole(user, 'admin', 'Super Admin', 'Support Engineer')) {
      return errorResponse({ message: 'Forbidden', status: 403 });
    }

    await connectDB();
    const tickets = await SupportTicket.find().sort({ createdAt: -1 });
    return successResponse({ message: 'Support tickets retrieved successfully', data: tickets });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return errorResponse({ message: 'Internal Server Error', status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = supportTicketSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse({
        message: 'Invalid support ticket payload',
        status: 400,
        error: parsed.error.issues.map((issue) => issue.message).join(', ')
      });
    }

    const user = authenticateAPI(request);

    await connectDB();
    const ticket = new SupportTicket({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
      priority: parsed.data.priority || 'medium'
    });

    await ticket.save();

    if (user) {
      await recordAudit({
        actorId: user.id,
        action: 'create-support-ticket',
        targetType: 'SupportTicket',
        targetId: ticket._id,
        details: `Submitted support ticket: ${ticket.subject}`
      });
    }

    return successResponse({ message: 'Support ticket submitted successfully', data: ticket, status: 201 });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    return errorResponse({ message: 'Internal Server Error', status: 500 });
  }
}
