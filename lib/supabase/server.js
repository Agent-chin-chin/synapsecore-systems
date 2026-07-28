/* eslint-disable @typescript-eslint/no-require-imports */
const { createServerClient } = require('@supabase/ssr');
const config = require('../config');

function createServerSupabaseClient(request, response) {
  if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
    throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY are required for server-side Supabase clients');
  }

  const cookies = {
    getAll: () => request.cookies.getAll().map((cookie) => ({
      name: cookie.name,
      value: cookie.value,
      path: cookie.path ?? '/',
      domain: cookie.domain,
      secure: cookie.secure,
      httpOnly: cookie.httpOnly,
      sameSite: cookie.sameSite,
      maxAge: cookie.maxAge,
      expires: cookie.expires,
    })),
    setAll: (cookiesToSet) => {
      cookiesToSet.forEach((cookie) => {
        response.cookies.set({
          name: cookie.name,
          value: cookie.value,
          path: cookie.path,
          domain: cookie.domain,
          secure: cookie.secure,
          httpOnly: cookie.httpOnly,
          sameSite: cookie.sameSite,
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

module.exports = {
  createServerSupabaseClient,
};

module.exports.default = module.exports;
