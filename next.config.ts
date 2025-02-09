import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
