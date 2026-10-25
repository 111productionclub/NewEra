import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Статический экспорт не умеет сжимать картинки сам, размеры готовит бэкенд (D-19)
  images: { loader: "custom", loaderFile: "./src/lib/imageLoader.ts" },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
