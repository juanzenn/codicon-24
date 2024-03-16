/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        hostname: "utsf.io",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
