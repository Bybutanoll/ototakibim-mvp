/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Netlify Configuration
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig