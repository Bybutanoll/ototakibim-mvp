/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Netlify Configuration
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // PWA Configuration - Static export için kaldırıldı
}

module.exports = nextConfig