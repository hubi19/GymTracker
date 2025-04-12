import type { NextConfig } from 'next';
import withPWA from 'next-pwa';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // wymagane przy 'output: export'
  },
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: isDev, // wyłącz PWA w trybie dev
})(nextConfig);
