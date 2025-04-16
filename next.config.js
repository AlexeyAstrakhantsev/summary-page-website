/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone', // Оптимизирует сборку для Docker
    reactStrictMode: true,
    swcMinify: true,
    images: {
      domains: ['placeholder.svg'], // Добавляем домены для изображений, при необходимости замените на ваши
      unoptimized: process.env.NODE_ENV === 'development',
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
      ],
    },
    env: {
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
    },
  };
  
  module.exports = nextConfig;