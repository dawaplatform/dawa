/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // In dev the Next.js image-optimization proxy fetches remote images
    // server-side.  On machines where outbound HTTPS to Cloudinary / Google
    // times out, this causes 500 after ~7 s.  Disabling optimization in dev
    // serves the original CDN URL directly (Cloudinary already optimizes).
    // Production keeps full optimization (assumes proper outbound access).
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'unsplash.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: 'utfs.io' },
      { protocol: 'https', hostname: 'flagcdn.com' },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: true,
            titleProp: true,
          },
        },
      ],
    });

    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
