const trimTrailingSlash = (value) => value.replace(/\/+$/, '')
const publicUrl = (key, fallback) => trimTrailingSlash(process.env[key] || fallback)

const authUrl = publicUrl('NEXT_PUBLIC_AUTH_URL', 'https://auth.arkvoid.com')
const appUrl = publicUrl('NEXT_PUBLIC_APP_URL', 'https://app.arkvoid.com')
const docsUrl = publicUrl('NEXT_PUBLIC_DOCS_URL', 'https://docs.arkvoid.com')

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [],
  async redirects() {
    if (process.env.NODE_ENV === 'development') {
      return []
    }
    return [
      {
        source: '/login',
        destination: `${authUrl}/login`,
        permanent: false,
      },
      {
        source: '/signup',
        destination: `${authUrl}/signup`,
        permanent: false,
      },
      {
        source: '/dashboard',
        destination: appUrl,
        permanent: false,
      },
      {
        source: '/app',
        destination: appUrl,
        permanent: false,
      },
      {
        source: '/docs',
        destination: docsUrl,
        permanent: false,
      },
    ]
  },
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        { source: '/login', destination: `${publicUrl('NEXT_PUBLIC_AUTH_URL', 'http://127.0.0.1:3001')}/login` },
        { source: '/signup', destination: `${publicUrl('NEXT_PUBLIC_AUTH_URL', 'http://127.0.0.1:3001')}/signup` },
        { source: '/forgot-password', destination: `${publicUrl('NEXT_PUBLIC_AUTH_URL', 'http://127.0.0.1:3001')}/forgot-password` },
        { source: '/reset-password', destination: `${publicUrl('NEXT_PUBLIC_AUTH_URL', 'http://127.0.0.1:3001')}/reset-password` },
        { source: '/auth/:path*', destination: `${publicUrl('NEXT_PUBLIC_AUTH_URL', 'http://127.0.0.1:3001')}/auth/:path*` },
        { source: '/onboarding', destination: `${publicUrl('NEXT_PUBLIC_APP_URL', 'http://127.0.0.1:3002')}/onboarding` },
        { source: '/api-keys', destination: `${publicUrl('NEXT_PUBLIC_APP_URL', 'http://127.0.0.1:3002')}/api-keys` },
        { source: '/decisions', destination: `${publicUrl('NEXT_PUBLIC_APP_URL', 'http://127.0.0.1:3002')}/decisions` },
        { source: '/decisions/:path*', destination: `${publicUrl('NEXT_PUBLIC_APP_URL', 'http://127.0.0.1:3002')}/decisions/:path*` },
        { source: '/governance', destination: `${publicUrl('NEXT_PUBLIC_APP_URL', 'http://127.0.0.1:3002')}/governance` },
        { source: '/settings', destination: `${publicUrl('NEXT_PUBLIC_APP_URL', 'http://127.0.0.1:3002')}/settings` },
        { source: '/app/:path*', destination: `${publicUrl('NEXT_PUBLIC_APP_URL', 'http://127.0.0.1:3002')}/:path*` },
      ]
    }
    return []
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}

module.exports = nextConfig
