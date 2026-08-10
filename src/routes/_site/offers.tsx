import { Link, createFileRoute } from "@tanstack/react-router";

import { PageHero, Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { images, offers } from "@/lib/hotel-data";

export const Route = createFileRoute("/_site/offers")({
  head: () => ({
    meta: [
      { title: "Special Offers & Packages — The Splendid Sanctuary" },
      {
        name: "description",
        content: "Weekend Escape, Romantic Getaway, Family Retreat and Extended Stay packages at The Splendid Sanctuary.",
      },
      { property: "og:title", content: "Make Your Stay Even More Special" },
      { property: "og:description", content: "Seasonal packages and direct-booking benefits." },
    ],
  }),
  component: OffersPage,
});

function OffersPage() {
  return (
    <>
      <PageHero eyebrow="Offers" title="Make your stay even more special" image={images.executive} />
      <Section>
        <div className="grid gap-8 sm:grid-cols-2">
          {offers.map((o) => (
            <article key={o.id} className="grid overflow-hidden rounded-lg border border-border/70 bg-card sm:grid-cols-2">
              <img src={o.image} alt={o.title} loading="lazy" className="h-full min-h-48 w-full object-cover" />
              <div className="p-6">
                <h2 className="font-display text-2xl">{o.title}</h2>
                <p className="eyebrow mt-1 text-gold">{o.strapline}</p>
                <p className="mt-3 text-sm text-muted-foreground">{o.description}</p>
                <dl className="mt-4 space-y-1 text-xs text-muted-foreground">
                  <div>
                    <dt className="inline font-medium text-foreground">Eligibility: </dt>
                    <dd className="inline">{o.eligibility}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-foreground">Valid: </dt>
                    <dd className="inline">{o.validity}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-foreground">Benefit: </dt>
                    <dd className="inline">{o.discount}</dd>
                  </div>
                </dl>
                <Button asChild className="mt-5 text-xs tracking-widest uppercase">
                  <Link to="/book">Explore offer</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
