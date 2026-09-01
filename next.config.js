/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/problems',
        destination: 'https://sih.gov.in/sih2026PS',
        permanent: false,
      },
      {
        source: '/problem-statements',
        destination: 'https://sih.gov.in/sih2026PS',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
