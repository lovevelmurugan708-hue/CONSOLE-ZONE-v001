import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/selling',
        permanent: true,
      },
      {
        source: '/admin/dashboard',
        destination: '/admin/selling',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
