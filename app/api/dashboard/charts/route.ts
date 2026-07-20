import type { NextRequest } from 'next/server';
import { authenticateAPI, requireRole } from '@/lib/apiAuth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import connectDB from '@/lib/mongoose';
import Incident from '@/lib/models/Incident';

export async function GET(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return errorResponse({ message: 'Unauthorized', status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('range') || '30d';

    const now = new Date();
    let startDate;
    switch (timeRange) {
      case '7d': startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
      case '90d': startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); break;
      case '1y': startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); break;
      default: startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // For clients/learners, only show their own data
    const queryFilter = ['Super Admin', 'Support Engineer', 'admin'].includes(user.role)
      ? { createdAt: { $gte: startDate } }
      : { userId: user.id, createdAt: { $gte: startDate } };

    const incidents = await Incident.find(queryFilter).lean();

    const severityCounts: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 };
    const statusCounts: Record<string, number> = { open: 0, investigating: 0, assigned: 0, resolved: 0, closed: 0 };
    const trendData: Record<string, number> = {};

    (incidents as any[]).forEach((incident) => {
      if (incident.severity && (incident.severity as string) in severityCounts) {
        severityCounts[incident.severity]++;
      }
      if (incident.status && (incident.status as string) in statusCounts) {
        statusCounts[incident.status]++;
      }
      const weekStart = new Date(incident.createdAt);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      trendData[weekKey] = (trendData[weekKey] || 0) + 1;
    });

    const trendArray = Object.entries(trendData)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return successResponse({
      message: 'Chart data retrieved successfully',
      data: {
        severity: Object.entries(severityCounts).map(([severity, count]) => ({ severity, count })),
        status: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
        trend: trendArray
      }
    });
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return errorResponse({ message: 'Internal Server Error', status: 500 });
  }
}