/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "www.atptour.com",
      "mirankingtenis.com.ar",
      "incor-ranking.s3.us-east-1.amazonaws.com",
      "mirankingtenis.s3.us-east-1.amazonaws.com",
      "res.cloudinary.com"
    ],
  },
  
  // Optimizaciones básicas compatibles con Turbopack
  reactStrictMode: true,
  swcMinify: true,
  
  // Optimización de compilación
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  
  // Experimental features optimizadas para Turbopack
  experimental: {
    optimizeCss: true,
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
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