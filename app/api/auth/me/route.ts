import type { NextRequest } from 'next/server';
import { authenticateAPI } from '@/lib/apiAuth';
import { getUserById } from '@/services/userService';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return errorResponse({ message: 'Access token required', status: 401 });
    }

    const profile = await getUserById(user.id);
    if (!profile) {
      return errorResponse({ message: 'User not found', status: 404 });
    }

    return successResponse({ message: 'User profile retrieved', data: profile });
  } catch (error) {
    console.error('Error getting current user:', error);
    return errorResponse({ message: 'Invalid or expired token', status: 401 });
  }
}
