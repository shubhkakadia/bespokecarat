/** @type {import('next').NextConfig} */
const nextConfig = {
<<<<<<< Updated upstream
  images: {
    domains: ["4cs.gia.edu", "localhost"],
  },
=======
>>>>>>> Stashed changes
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
