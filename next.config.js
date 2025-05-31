/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用严格的代码质量检查
  eslint: {
    ignoreDuringBuilds: false, // 启用ESLint检查
    dirs: ['app', 'components', 'lib', 'hooks', 'contexts'], // 指定检查目录
  },
  typescript: {
    ignoreBuildErrors: false, // 启用TypeScript类型检查
  },
  // 启用图片优化
  images: {
    unoptimized: false, // 启用Next.js图片优化
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fastly.jsdelivr.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    // 图片优化配置
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // 优化中国区域的访问速度
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  // CDN配置 - 仅在生产环境启用
  assetPrefix: process.env.NODE_ENV === "production" ? process.env.CDN_URL : undefined,
  // 安全和性能配置
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  // 安全头配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  },
  
  // 开发体验优化
  devIndicators: {
    position: 'bottom-right',
  },
  
  // 跨域请求配置
  ...(process.env.NODE_ENV === 'development' && {
    allowedDevOrigins: ['172.24.32.1:3000', '172.24.32.1:3001', '172.24.32.1:3002'],
  }),
  
  // 生产优化
  ...(process.env.NODE_ENV === 'production' && {
    compiler: {
      removeConsole: {
        exclude: ['error', 'warn'],
      },
    },
  }),
}

module.exports = nextConfig
