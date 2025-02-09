import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "montoran.inklusif.id",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
