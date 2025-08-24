/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.atptour.com'
      },
      {
        protocol: 'https',
        hostname: 'mirankingtenis.com.ar'
      },
      {
        protocol: 'https',
        hostname: 'incor-ranking.s3.us-east-1.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: 'mirankingtenis.s3.us-east-1.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      }
    ],
    // Configuración específica para Cloudinary
    loader: 'custom',
    loaderFile: './src/lib/cloudinary-loader.js',
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Optimizaciones básicas
  reactStrictMode: true,
  
  // Optimización de compilación
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  
  // Experimental features
  experimental: {
    optimizeCss: true,
  },
  
  // Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // Headers básicos para performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
        ],
      },
    ];
  },
};

export default nextConfig;