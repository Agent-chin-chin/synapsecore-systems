import type { NextRequest } from 'next/server';
import { authenticateAPI, requireRole } from '@/lib/apiAuth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import connectDB from '@/lib/mongoose';
import Incident from '@/lib/models/Incident';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return errorResponse({ message: 'Unauthorized', status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // For clients/learners, only show their own incidents
    const queryFilter = ['Super Admin', 'Support Engineer', 'admin'].includes(user.role)
      ? {}
      : { userId: user.id };

    const incidents = await Incident.find(queryFilter)
      .populate('userId', 'fullname email')
      .populate('assignedTo', 'fullname email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean() as any[];

    const activityFeed: any[] = [];

    for (const incident of incidents) {
      activityFeed.push({
        id: `incident-create-${incident._id}`,
        type: 'incident-created',
        timestamp: incident.createdAt,
        description: `New ${incident.incidentType?.replace(/-/g, ' ')} incident reported`,
        actor: incident.userId ? {
          id: incident.userId._id,
          name: incident.userId.fullname,
          email: incident.userId.email
        } : null,
        target: {
          id: incident._id,
          type: 'Incident',
          title: `${incident.incidentType?.replace(/-/g, ' ')} - ${incident.description?.substring(0, 50)}...`
        },
        metadata: {
          incidentId: incident._id,
          incidentType: incident.incidentType,
          severity: incident.severity,
          priority: incident.priority,
          status: incident.status
        }
      });

      if (incident.statusHistory && incident.statusHistory.length > 0) {
        for (const historyEntry of incident.statusHistory) {
          activityFeed.push({
            id: `status-update-${incident._id}-${historyEntry.timestamp?.getTime()}`,
            type: 'status-updated',
            timestamp: historyEntry.timestamp,
            description: `Status changed to ${historyEntry.status}`,
            actor: historyEntry.changedBy ? {
              id: historyEntry.changedBy.toString(),
              name: 'System',
              email: 'system@cyberbugfixer.com'
            } : null,
            target: {
              id: incident._id,
              type: 'Incident',
              title: `${incident.incidentType?.replace(/-/g, ' ')} - ${incident.description?.substring(0, 50)}...`
            },
            metadata: {
              incidentId: incident._id,
              newStatus: historyEntry.status,
              notes: historyEntry.notes
            }
          });
        }
      }

      if (incident.assignedTo) {
        activityFeed.push({
          id: `assignment-${incident._id}`,
          type: 'assigned',
          timestamp: incident.updatedAt,
          description: `Assigned to engineer`,
          actor: { id: 'system', name: 'System', email: 'system@cyberbugfixer.com' },
          target: {
            id: incident._id,
            type: 'Incident',
            title: `${incident.incidentType?.replace(/-/g, ' ')} - ${incident.description?.substring(0, 50)}...`
          },
          metadata: { incidentId: incident._id }
        });
      }
    }

    activityFeed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return successResponse({
      message: 'Activity feed retrieved successfully',
      data: activityFeed.slice(0, limit)
    });
  } catch (error) {
    console.error('Error fetching activity feed:', error);
    return errorResponse({ message: 'Internal Server Error', status: 500 });
  }
}