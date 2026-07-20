import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authenticateAPI, requireRole } from '@/lib/apiAuth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { incidentStatusUpdateSchema, addNoteSchema } from '@/lib/validation';
import {
  getIncidentById,
  updateIncidentStatus,
  assignIncident,
  addResponseNote
} from '@/services/incidentService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return errorResponse({ message: 'Unauthorized', status: 401 });
    }

    const { id } = await params;
    const incident = await getIncidentById(id, user);
    return successResponse({ message: 'Incident retrieved successfully', data: incident });
  } catch (error: any) {
    console.error('Error fetching incident:', error);
    if (error.code === 'NOT_FOUND') {
      return errorResponse({ message: 'Incident not found', status: 404 });
    }
    if (error.code === 'FORBIDDEN') {
      return errorResponse({ message: 'Access denied', status: 403 });
    }
    return errorResponse({ message: 'Internal Server Error', status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return errorResponse({ message: 'Unauthorized', status: 401 });
    }

    if (!requireRole(user, 'Super Admin', 'Support Engineer')) {
      return errorResponse({ message: 'Forbidden', status: 403 });
    }

    const body = await request.json();
    const parsed = incidentStatusUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse({
        message: 'Invalid incident update payload',
        status: 400,
        error: parsed.error.issues.map((issue) => issue.message).join(', ')
      });
    }

    const { id } = await params;
    const { action, status, engineerId, notes } = parsed.data;
    let updatedIncident;

    if (action === 'update-status') {
      updatedIncident = await updateIncidentStatus(id, status!, user._id, notes);
    } else {
      updatedIncident = await assignIncident(id, engineerId!);
    }

    return successResponse({ message: 'Incident updated successfully', data: updatedIncident });
  } catch (error) {
    console.error('Error updating incident:', error);
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = (error as { code?: string }).code;
      if (code === 'NOT_FOUND') {
        return errorResponse({ message: 'Incident not found', status: 404 });
      }
      if (code === 'VALIDATION_ERROR') {
        return errorResponse({ message: (error as { message?: string }).message || 'Validation error', status: 400 });
      }
    }
    return errorResponse({ message: 'Internal Server Error', status: 500 });
  }
}

// POST: Add response notes to incident
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return errorResponse({ message: 'Unauthorized', status: 401 });
    }

    if (!requireRole(user, 'Super Admin', 'Support Engineer')) {
      return errorResponse({ message: 'Forbidden', status: 403 });
    }

    const body = await request.json();
    const parsed = addNoteSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse({
        message: 'Invalid note payload',
        status: 400,
        error: parsed.error.issues.map((issue) => issue.message).join(', ')
      });
    }

    const { id } = await params;
    const { note, isInternal } = parsed.data;
    const updatedIncident = await addResponseNote(id, user._id, note, isInternal !== false);

    return successResponse({ message: 'Note added successfully', data: updatedIncident });
  } catch (error) {
    console.error('Error adding note:', error);
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'NOT_FOUND') {
      return errorResponse({ message: 'Incident not found', status: 404 });
    }
    return errorResponse({ message: 'Internal Server Error', status: 500 });
  }
}
