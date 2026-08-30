import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
