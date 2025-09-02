/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["4cs.gia.edu", "localhost"],
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
