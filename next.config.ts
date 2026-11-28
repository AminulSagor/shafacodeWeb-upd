import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    // Report-only first; enforce once the reports are clean.
    key: 'Content-Security-Policy-Report-Only',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.supabase.co https://i.ytimg.com",
      "font-src 'self'",
      "connect-src 'self' https://*.supabase.co",
      "frame-src https://www.youtube-nocookie.com https://www.youtube.com",
      "media-src 'self' https://*.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL('https://ocectkchrhtbvthhwbtc.supabase.co/storage/v1/object/public/**'),
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: '/terms-and-conditions', destination: '/terms', permanent: true },
      // Old admin routes
      { source: '/admin/job-applications/:id', destination: '/admin/applications/:id', permanent: false },
      { source: '/admin/job-applications', destination: '/admin/applications', permanent: false },
      { source: '/admin/dashboard', destination: '/admin', permanent: false },
      { source: '/admin/projects/:path*', destination: '/admin/case-studies', permanent: false },
      { source: '/admin/blogs/create', destination: '/admin/blogs/new', permanent: false },
      { source: '/admin/blogs/:id/edit', destination: '/admin/blogs/:id', permanent: false },
    ];
  },
};

export default nextConfig;
