import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken, isAdmin, isClient, isLearner } from '@/lib/guards';

const excludedPaths = [
  '/_next',
  '/api',
  '/admin',
  '/client',
  '/dashboard',
  '/learner',
  '/auth',
  '/login',
  '/forgot-password',
  '/pre-launch',
  '/favicon.ico',
  '/logo.ico',
  '/robots.txt',
  '/sitemap.xml',
];

function isExcludedPath(pathname: string) {
  return excludedPaths.some((segment) => pathname === segment || pathname.startsWith(`${segment}/`));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const preLaunchMode = process.env.PRE_LAUNCH_MODE === 'true';

  if (preLaunchMode && !isExcludedPath(pathname)) {
    return NextResponse.rewrite(new URL('/pre-launch', request.url));
  }

  const isAdminRoute = pathname.startsWith('/admin');
  const isAdminLogin = pathname === '/admin/login';
  const isClientRoute = pathname.startsWith('/client');
  const isLearnerRoute = pathname.startsWith('/learner');
  const isLearnerAuthPath = [
    '/learner/login',
    '/learner/register',
    '/learner/forgot-password',
    '/learner/reset-password',
    '/learner/verify-email',
  ].includes(pathname);
  const isLearnerPublicPath = isLearnerAuthPath || pathname.startsWith('/learner/courses') || pathname.startsWith('/learner/resources') || pathname.startsWith('/learner/community');

  if (isAdminRoute && !isAdminLogin) {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const decoded = await verifyToken(token);
    if (!decoded || !isAdmin(decoded)) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return NextResponse.next();
  }

  if (isClientRoute) {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const decoded = await verifyToken(token);
    if (!decoded || !isClient(decoded)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  }

  if (isLearnerRoute && !isLearnerPublicPath) {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.redirect(new URL('/learner/login', request.url));
    }

    const decoded = await verifyToken(token);
    if (!decoded || !isLearner(decoded)) {
      return NextResponse.redirect(new URL('/learner/login', request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};
