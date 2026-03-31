import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/create", "/my-results", "/api/", "/actions/", "/auth/"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://quiz-master.netlify.app"}/sitemap.xml`,
  };
}
