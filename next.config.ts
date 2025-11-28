import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    reactCompiler: true,
  },
  async redirects(){
    return [
      // keep backward-compatibility for underscored routes -> redirect to kebab-case
      { source: '/root_accounts', destination: '/root-accounts', permanent: true },
      { source: '/root_accounts/:path*', destination: '/root-accounts/:path*', permanent: true }
    ]
  }
};

export default nextConfig;
