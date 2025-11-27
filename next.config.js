/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'localhost',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Explicitly tell Next.js we're using src directory
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Disable experimental features that might cause issues
  experimental: {
    serverActions: false,
  },
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Fix for CSS modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

module.exports = nextConfig;
