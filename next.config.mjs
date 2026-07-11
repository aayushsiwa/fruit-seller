/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  //  add image from image.pexels.com
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
};

export default nextConfig;
