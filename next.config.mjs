/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["4cs.gia.edu", "localhost", "bespokecarat.com"],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: process.env.NEXT_APP_PORT,
        pathname: '/api/media/**',
      },
      {
        protocol: 'https',
        hostname: 'bespokecarat.com',
        pathname: '/api/media/**',
      },
    ],
  },
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
  async rewrites() {
    return [
      {
        source: "/media/:path*",
        destination: "/uploads/:path*", // serve directly
      },
    ];
  },
};

export default nextConfig;
