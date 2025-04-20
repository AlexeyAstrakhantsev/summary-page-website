/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone', // Оптимизирует сборку для Docker
    reactStrictMode: true,
    swcMinify: true,
    images: {
      // domains: ['placeholder.svg'], // deprecated, удалено
      unoptimized: process.env.NODE_ENV === 'development',
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
      ],
      dangerouslyAllowSVG: true, // разрешить SVG (если нужен placeholder.svg)
    },
    env: {
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
    },
  };
  
  module.exports = nextConfig;