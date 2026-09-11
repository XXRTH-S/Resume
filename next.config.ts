import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  // Vercel creates its own function bundles; standalone is only for Docker.
  ...(process.env.VERCEL ? {} : { output: 'standalone' as const }),
  images: { unoptimized: true },
};
export default nextConfig;
