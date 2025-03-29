/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['osvhpquyijykncwsxhum.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'osvhpquyijykncwsxhum.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
    missingSuspenseWithCSRBailout: false,
  },
  // Ensure compatibility with Netlify deployment
  output: 'standalone',
}

module.exports = nextConfig 