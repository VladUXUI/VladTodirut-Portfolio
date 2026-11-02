import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/* Open to search engines and AI crawlers alike; only the internal styleguide is kept out */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/styleguide" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
