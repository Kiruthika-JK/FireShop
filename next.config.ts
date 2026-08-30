import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/ganishkha-crackers-store.firebasestorage.app/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'project-i4vs6.vercel.app' }],
        destination: 'https://www.ganishkhasricrackers.in/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
