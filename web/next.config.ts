import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
            protocol: "https",
            hostname: "*.cloudfront.net",
            port: "",
            pathname: "**",
        },
        {
            protocol: "https",
            hostname: "images.unsplash.com",
            port: "",
            pathname: "**",
        }
    ]
  }
};

export default nextConfig;
