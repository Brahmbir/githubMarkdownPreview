import { getResourcePath } from "@/utils/PathFunction";
import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  /* config options here */
    output: 'export',
  basePath: getResourcePath(""),
  assetPrefix: `${getResourcePath("")}/`,
};

export default nextConfig;
