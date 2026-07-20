import type { NextRequest } from 'next/server';
import type { User } from '@/lib/types/user';

export const ROLE_ADMIN = 'admin';
export const ROLE_CLIENT = 'client';
export const ROLE_LEARNER = 'learner';

// Legacy roles (for backward compatibility during transition)
export const ROLE_SUPER_ADMIN = 'Super Admin';
export const ROLE_SUPPORT_ENGINEER = 'Support Engineer';
export const ROLE_CLIENT_LEGACY = 'Client/User';

export function getTokenFromRequest(request: NextRequest) {
  if (!request) return null;

  const cookieToken = request.cookies.get('token')?.value;
  if (cookieToken) return cookieToken;

  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  const match = cookieHeader.match(/(?:^|; )token=([^;]+)/);
  return match ? match[1] : null;
}

function base64UrlDecode(input: string) {
  const pad = '='.repeat((4 - (input.length % 4)) % 4);
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/') + pad;

  if (typeof atob === 'function') {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  if (typeof Buffer !== 'undefined') {
    return Uint8Array.from(Buffer.from(base64, 'base64'));
  }

  throw new Error('Base64 decode is not available in this runtime');
}

function bytesToString(bytes: Uint8Array) {
  return new TextDecoder().decode(bytes);
}

function stringToBytes(value: string) {
  return new TextEncoder().encode(value);
}

async function verifyHmacSha256(secret: string, data: string, signature: Uint8Array) {
  if (!secret) return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (globalThis.crypto?.subtle) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const key = await (globalThis.crypto.subtle as any).importKey(
      'raw',
      new Uint8Array(stringToBytes(secret).buffer),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (globalThis.crypto.subtle as any).verify('HMAC', key, signature, new Uint8Array(stringToBytes(data).buffer));
  }

  if (typeof require !== 'undefined') {
    const { createHmac } = require('crypto');
    const expected = createHmac('sha256', secret).update(data).digest();
    return expected.length === signature.length && expected.every((byte: number, index: number) => byte === signature[index]);
  }

  return false;
}

export async function verifyToken(token: string) {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header64, payload64, signature64] = parts;
  const data = `${header64}.${payload64}`;
  const signature = base64UrlDecode(signature64);
  const isValid = await verifyHmacSha256(process.env.JWT_SECRET || '', data, signature);

  if (!isValid) return null;

  try {
    const payloadJson = bytesToString(base64UrlDecode(payload64));
    const parsed = JSON.parse(payloadJson) as User;

    if (parsed.exp && Date.now() >= parsed.exp * 1000) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function authenticateAPI(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifyToken(token);
}

export function hasRole(user: User | null, ...allowedRoles: string[]) {
  return user && allowedRoles.includes(user.role);
}

export function requireRole(user: User | null, ...allowedRoles: string[]) {
  return hasRole(user, ...allowedRoles);
}

export function isAdmin(user: User | null) {
  return hasRole(user, ROLE_ADMIN, ROLE_SUPER_ADMIN, ROLE_SUPPORT_ENGINEER);
}

export function isClient(user: User | null) {
  return hasRole(user, ROLE_CLIENT);
}

export function isLearner(user: User | null) {
  return hasRole(user, ROLE_LEARNER);
}
