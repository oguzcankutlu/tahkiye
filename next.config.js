/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        serverActions: true, // Enable Server Actions for Next.js 13.5.6
    },
}

module.exports = nextConfig
