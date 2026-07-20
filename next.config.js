/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.s3.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: 'example.com'
      }
    ]
  },
  async redirects() {
    return [
      // Legacy route redirects for SEO preservation
      {
        source: '/ai-assistant',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/webhooks',
        destination: '/developers/webhooks',
        permanent: true,
      },
      {
        source: '/newsletter',
        destination: '/',
        permanent: false,
      },
    ];
  },
  async headers() {
    const baseHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' }
    ];

    if (process.env.NODE_ENV === 'production') {
      baseHeaders.push({
        key: 'Content-Security-Policy',
        value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; font-src 'self' data:; frame-ancestors 'none'; base-uri 'self';"
      });
    }

    return [
      {
        source: '/:path*',
        headers: baseHeaders
      }
    ];
  }
};

module.exports = nextConfig;
