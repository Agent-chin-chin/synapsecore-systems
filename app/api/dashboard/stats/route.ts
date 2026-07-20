import type { NextRequest } from 'next/server';
import { authenticateAPI, requireRole } from '@/lib/apiAuth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import connectDB from '@/lib/mongoose';
import Incident from '@/lib/models/Incident';
import User from '@/lib/models/User';
import SupportTicket from '@/lib/models/Support';

export async function GET(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return errorResponse({ message: 'Unauthorized', status: 401 });
    }

    await connectDB();

    // For clients/learners, only show their own incident stats
    const queryFilter = ['Super Admin', 'Support Engineer', 'admin'].includes(user.role)
      ? {}
      : { userId: user.id };

    const [
      totalIncidents,
      activeIncidents,
      criticalIncidents,
      resolvedIncidents
    ] = await Promise.all([
      Incident.countDocuments(queryFilter),
      Incident.countDocuments({ 
        ...queryFilter,
        status: { $in: ['open', 'investigating', 'assigned'] } 
      }),
      Incident.countDocuments({ 
        ...queryFilter,
        severity: 'critical',
        status: { $nin: ['resolved', 'closed'] }
      }),
      Incident.countDocuments({ 
        ...queryFilter,
        status: { $in: ['resolved', 'closed'] } 
      })
    ]);

    return successResponse({
      message: 'Dashboard stats retrieved successfully',
      data: {
        activeIncidents,
        criticalIncidents,
        resolvedIncidents,
        totalIncidents,
        averageResponseTime: 18,
        assignedEngineers: user.role === 'client' ? 1 : 0
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return errorResponse({ message: 'Internal Server Error', status: 500 });
  }
}