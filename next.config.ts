import type { NextConfig } from "next";
import path from "path";

// En GitHub Pages el sitio se sirve bajo /<repo>/ — el workflow define
// NEXT_PUBLIC_BASE_PATH; en local queda vacío.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
