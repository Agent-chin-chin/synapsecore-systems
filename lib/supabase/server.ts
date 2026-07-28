import { createServerClient } from '@supabase/ssr';
import type { NextRequest, NextResponse } from 'next/server';
import config from '../config';

function createServerSupabaseClient(request: NextRequest, response: NextResponse) {
  if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
    throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY are required for server-side Supabase clients');
  }

  const cookies = {
    getAll: () => request.cookies.getAll().map((cookie) => ({
      name: cookie.name,
      value: cookie.value,
    })),
    setAll: (cookiesToSet: Array<{
      name: string;
      value: string;
      path?: string;
      domain?: string;
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: string;
      maxAge?: number;
      expires?: Date;
    }>) => {
      cookiesToSet.forEach((cookie) => {
        response.cookies.set({
          name: cookie.name,
          value: cookie.value,
          path: cookie.path,
          domain: cookie.domain,
          secure: cookie.secure,
          httpOnly: cookie.httpOnly,
          sameSite: cookie.sameSite as 'lax' | 'strict' | 'none' | undefined,
          maxAge: cookie.maxAge,
          expires: cookie.expires,
        });
      });
    },
  };

  return createServerClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY, {
    cookies,
    cookieOptions: {
      name: 'sb-auth',
      path: '/',
      sameSite: 'lax',
    },
  });
}

export { createServerSupabaseClient };
