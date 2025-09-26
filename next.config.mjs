/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/app/stock',
  experimental: {
    instrumentationHook: true,
  },

};

export default nextConfig;
