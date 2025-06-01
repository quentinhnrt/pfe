import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;
  
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/settings/",
          "/on-boarding/",
          "/_next/",
          "/tmp/",
          "/*.json$",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/settings/",
          "/on-boarding/",
        ],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/"],
        disallow: [],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}