/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  async redirects() {
    if (process.env.NODE_ENV === 'development') {
      return [];
    }
    return [
      {
        source: '/login',
        destination: 'https://auth.arkvoid.com/login',
        permanent: false,
      },
      {
        source: '/signup',
        destination: 'https://auth.arkvoid.com/signup',
        permanent: false,
      },
      {
        source: '/app',
        destination: 'https://app.arkvoid.com',
        permanent: false,
      },
      {
        source: '/dashboard',
        destination: 'https://app.arkvoid.com',
        permanent: false,
      },
      {
        source: '/docs',
        destination: 'https://docs.arkvoid.com',
        permanent: false,
      },
    ]
  },
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/login',
          destination: 'http://127.0.0.1:3001/login',
        },
        {
          source: '/signup',
          destination: 'http://127.0.0.1:3001/signup',
        },
        {
          source: '/forgot-password',
          destination: 'http://127.0.0.1:3001/forgot-password',
        },
        {
          source: '/reset-password',
          destination: 'http://127.0.0.1:3001/reset-password',
        },
        {
          source: '/auth/:path*',
          destination: 'http://127.0.0.1:3001/auth/:path*',
        },
        {
          source: '/onboarding',
          destination: 'http://127.0.0.1:3002/onboarding',
        },
        {
          source: '/api-keys',
          destination: 'http://127.0.0.1:3002/api-keys',
        },
        {
          source: '/decisions',
          destination: 'http://127.0.0.1:3002/decisions',
        },
        {
          source: '/decisions/:path*',
          destination: 'http://127.0.0.1:3002/decisions/:path*',
        },
        {
          source: '/governance',
          destination: 'http://127.0.0.1:3002/governance',
        },
        {
          source: '/settings',
          destination: 'http://127.0.0.1:3002/settings',
        },
        {
          source: '/app/:path*',
          destination: 'http://127.0.0.1:3002/:path*',
        },
      ];
    }
    return [];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
