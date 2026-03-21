/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        './public/data/doge-api/**',
      ],
    },
  },
};

export default nextConfig;
