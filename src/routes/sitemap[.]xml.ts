import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { roomTypes } from "@/lib/hotel-data";

const BASE_URL = "https://sanctuarysuite.lovable.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/stay", changefreq: "weekly", priority: "0.9" },
          ...roomTypes.map((room) => ({
            path: `/stay/${room.slug}`,
            changefreq: "monthly" as const,
            priority: "0.8",
          })),
          { path: "/book", changefreq: "monthly", priority: "0.9" },
          { path: "/dine", changefreq: "monthly", priority: "0.8" },
          { path: "/cellar", changefreq: "monthly", priority: "0.7" },
          { path: "/experience", changefreq: "monthly", priority: "0.7" },
          { path: "/events", changefreq: "monthly", priority: "0.7" },
          { path: "/offers", changefreq: "weekly", priority: "0.7" },
          { path: "/gallery", changefreq: "monthly", priority: "0.6" },
          { path: "/about", changefreq: "yearly", priority: "0.5" },
          { path: "/contact", changefreq: "yearly", priority: "0.6" },
          { path: "/policies", changefreq: "yearly", priority: "0.3" },
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
