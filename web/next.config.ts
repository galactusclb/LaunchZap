import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
         protocol: "https",
         hostname: "dtuhk0izzce4l.cloudfront.net",
         port: "",
         pathname: "**",
      }
    ]
  }
};

export default nextConfig;
