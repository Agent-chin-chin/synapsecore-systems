import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { User } from './types';

export interface AuthenticatedRequest extends NextRequest {
  user?: User;
}

/**
 * Verify JWT token from request cookies
 * Returns decoded user data if valid, null if invalid
 */
export function verifyToken(request: NextRequest): User | null {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as any;
    return {
      _id: decoded.id,
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
  } catch (error) {
    return null;
  }
}

/**
 * Middleware to protect API routes - requires authentication
 * Usage: 
 *   const user = authenticateAPI(request);
 *   if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 */
export function authenticateAPI(request: NextRequest): User | null {
  return verifyToken(request);
}

/**
 * Middleware to protect API routes - requires specific role
 * Usage:
 *   const user = authenticateAPI(request);
 *   if (!user || user.role !== 'Super Admin') {
 *     return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
 *   }
 */
export function requireRole(user: User | null, ...allowedRoles: string[]): boolean {
  return user !== null && allowedRoles.includes(user.role);
}

/**
 * Wrapper to protect API routes with authentication
 * Returns error response if not authenticated
 */
export function withAuth(
  handler: (req: NextRequest, user: User) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    try {
      const user = authenticateAPI(request);
      if (!user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      return await handler(request, user);
    } catch (error) {
      console.error('API error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Wrapper to protect API routes with authentication and role check
 */
export function withRoleAuth(
  handler: (req: NextRequest, user: User) => Promise<NextResponse>,
  ...allowedRoles: string[]
) {
  return async (request: NextRequest) => {
    try {
      const user = authenticateAPI(request);
      if (!user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      if (!requireRole(user, ...allowedRoles)) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        );
      }
      return await handler(request, user);
    } catch (error) {
      console.error('API error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  };
}
