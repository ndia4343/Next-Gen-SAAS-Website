import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei", "@react-three/postprocessing"],
  experimental: {
    // Enable modern optimizations
  },
  reactStrictMode: true,
};

export default nextConfig;
