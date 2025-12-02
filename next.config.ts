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
      { source: '/root_accounts/:path*', destination: '/root-accounts/:path*', permanent: true },
      // profiles → user-profiles へのリダイレクト（URL設計書対応）
      { source: '/profiles', destination: '/user-profiles', permanent: true },
      { source: '/profiles/:path*', destination: '/user-profiles/:path*', permanent: true },
      // organizations → groups へのリダイレクト（URL設計書対応）
      { source: '/organizations', destination: '/groups', permanent: true },
      { source: '/organizations/:path*', destination: '/groups/:path*', permanent: true },
      // support → help, inquiry → help/contact へのリダイレクト
      { source: '/support', destination: '/help', permanent: true },
      { source: '/inquiry', destination: '/help/contact', permanent: true },
      // faq → help/faq へのリダイレクト
      { source: '/faq', destination: '/help/faq', permanent: true },
    ]
  },
  // 本番ビルドから開発用ページを除外
  ...(process.env.NODE_ENV === 'production' && {
    async rewrites() {
      return {
        beforeFiles: [
          // playground と prototype へのアクセスを 404 にリライト
          { source: '/playground/:path*', destination: '/404' },
          { source: '/playground-github-copilot/:path*', destination: '/404' },
        ],
        afterFiles: [],
        fallback: [],
      }
    },
  }),
};

export default nextConfig;
