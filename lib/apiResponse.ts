import { NextResponse } from 'next/server';

export function successResponse<T = unknown>({ message = 'OK', data = null, status = 200 }: { message?: string; data?: T | null; status?: number }) {
  return NextResponse.json(
    { success: true, message, data: data ?? null, error: null },
    { status }
  );
}

export function errorResponse({ message = 'Error', status = 400, error = null }: { message?: string; status?: number; error?: string | string[] | null }) {
  return NextResponse.json(
    { success: false, message, data: null, error: error || message },
    { status }
  );
}
