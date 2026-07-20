import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authenticateAPI } from '@/lib/apiAuth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { incidentCreateSchema } from '@/lib/validation';
import { getIncidents, createIncident } from '@/services/incidentService';

export async function GET(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return errorResponse({ message: 'Unauthorized', status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const incidentType = searchParams.get('incidentType') || undefined;
    const priority = searchParams.get('priority') || undefined;
    const severity = searchParams.get('severity') || undefined;
    const assignedTo = searchParams.get('assignedTo') || undefined;
    const assignedToName = searchParams.get('assignedToName') || undefined;
    const search = searchParams.get('search') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const incidents = await getIncidents(
      { status, incidentType, priority, severity, assignedTo, assignedToName, search, page, limit },
      user
    );

    return successResponse({ message: 'Incidents retrieved successfully', data: incidents });
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return errorResponse({ message: 'Internal Server Error', status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return errorResponse({ message: 'Unauthorized', status: 401 });
    }

    const body = await request.json();
    const parsed = incidentCreateSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse({
        message: 'Invalid incident payload',
        status: 400,
        error: parsed.error.issues.map((issue) => issue.message).join(', ')
      });
    }

    const incident = await createIncident(parsed.data, user);
    return successResponse({ message: 'Incident reported successfully', data: incident, status: 201 });
  } catch (error: any) {
    console.error('Error creating incident:', error);
    if (error.code === 'VALIDATION_ERROR') {
      return errorResponse({ message: error.message, status: 400 });
    }
    return errorResponse({ message: 'Internal Server Error', status: 500 });
  }
}
