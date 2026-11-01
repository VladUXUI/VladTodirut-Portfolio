import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Lets .mdx files be imported as React components (case studies)
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Old Framer URLs, so existing links and search rankings carry over
  async redirects() {
    return [
      { source: "/case-study/sign-tx", destination: "/work/taho", permanent: true },
      { source: "/case-study/:slug(mezo|echoes|subscape)", destination: "/work/:slug", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
