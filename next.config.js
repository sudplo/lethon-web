/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/lethon-web',
  assetPrefix: '/lethon-web/',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
