import type { MetadataRoute } from "next";
import { LEGAL_SLUGS } from "@/i18n/legal";
import { absoluteUrl } from "@/lib/site";

/** Sitemap estático: se genera en el build y viaja con el export a Pages. */
export const dynamic = "force-static";

// Sin lastModified a propósito: con `new Date()` del build, TODAS las URLs
// decían "modificado hoy" en cada despliegue — una señal ruidosa que enseña al
// crawler a ignorar el dato. Mejor no declararlo que declararlo mal.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/precios"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/contacto"), changeFrequency: "monthly", priority: 0.8 },
    ...LEGAL_SLUGS.map((slug) => ({
      url: absoluteUrl(`/legal/${slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
