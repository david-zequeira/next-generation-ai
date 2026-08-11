import type { MetadataRoute } from "next";
import { LEGAL_SLUGS } from "@/i18n/legal";
import { absoluteUrl } from "@/lib/site";

/** Sitemap estático: se genera en el build y viaja con el export a Pages. */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...LEGAL_SLUGS.map((slug) => ({
      url: absoluteUrl(`/legal/${slug}`),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
