import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageHero, Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { galleryItems, images } from "@/lib/hotel-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — The Splendid Sanctuary" },
      { name: "description", content: "A glimpse of the rooms, suites, dining, pool, recreation and event spaces at The Splendid Sanctuary." },
      { property: "og:title", content: "A Glimpse of the Sanctuary" },
      { property: "og:description", content: "Photography from across the property." },
    ],
  }),
  component: GalleryPage,
});

const categories = ["All", "Rooms", "Suites", "Dining", "Pool", "Recreation", "Events", "Property"];

function GalleryPage() {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const items = active === "All" ? galleryItems : galleryItems.filter((g) => g.category === active);

  return (
    <>
      <PageHero eyebrow="Gallery" title="A glimpse of the Sanctuary" image={images.welcome} />
      <Section>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Button
              key={c}
              variant={active === c ? "default" : "outline"}
              size="sm"
              className="text-xs tracking-widest uppercase"
              onClick={() => setActive(c)}
            >
              {c}
            </Button>
          ))}
        </div>

        {items.length === 0 ? (
          <p className="mt-14 text-sm text-muted-foreground">No photographs in this category yet.</p>
        ) : (
          <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {items.map((g, i) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setLightbox({ src: g.src, alt: g.alt })}
                className="group block w-full overflow-hidden rounded-lg"
              >
                <img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  className={cn(
                    "w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]",
                    i % 3 === 0 ? "aspect-[3/4]" : "aspect-[4/3]",
                  )}
                />
              </button>
            ))}
          </div>
        )}
      </Section>

      <Dialog open={!!lightbox} onOpenChange={(o) => !o && setLightbox(null)}>
        <DialogContent className="max-w-4xl p-2">
          <DialogTitle className="sr-only">{lightbox?.alt ?? "Photograph"}</DialogTitle>
          {lightbox ? <img src={lightbox.src} alt={lightbox.alt} className="w-full rounded-md object-contain" /> : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
