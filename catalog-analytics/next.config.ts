import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: "/analytics",
  trailingSlash: true,
};

export default nextConfig;
