import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const requestConfig = "./i18n/request.ts";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Do not import next-intl/plugin. It loads @swc/core on startup, and the
  // native SWC binary is blocked on some company PCs. This alias is the part
  // of that plugin the app actually needs.
  turbopack: {
    resolveAlias: {
      "next-intl/config": requestConfig,
    },
  },
  webpack: (config) => {
    config.resolve.alias["next-intl/config"] = path.join(
      root,
      "i18n",
      "request.ts",
    );
    return config;
  },
};

export default nextConfig;
