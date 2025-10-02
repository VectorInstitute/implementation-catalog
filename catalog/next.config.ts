import type { NextConfig } from "next";

const isProd = process.env.NEXT_PUBLIC_BASE_PATH === "true";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isProd ? "/implementation-catalog" : "",
  trailingSlash: true,
};

export default nextConfig;
