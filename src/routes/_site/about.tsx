import { createFileRoute } from "@tanstack/react-router";

import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { images } from "@/lib/hotel-data";

export const Route = createFileRoute("/_site/about")({
  head: () => ({
    meta: [
      { title: "Our Story — The Splendid Sanctuary" },
      { name: "description", content: "The philosophy, people and place behind The Splendid Sanctuary in Park View." },
      { property: "og:title", content: "Our Story — The Splendid Sanctuary" },
      { property: "og:description", content: "Quiet luxury, delivered with genuine warmth." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About" title="A destination, not simply a place to sleep" image={images.welcome} />
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <SectionHeading eyebrow="Our story" title="Built around how you want to spend your time" copy="The Splendid Sanctuary began with a simple observation: most hotels are designed around operations, not guests." />
          <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
            <p>
              We set out to build the opposite — a property where the pool, the restaurant, the
              lounge and the recreation rooms are as considered as the bedrooms, and where the team
              has the time to notice what each guest actually needs.
            </p>
            <p>
              Twelve years later, that principle still shapes everything: restrained interiors in
              warm, natural materials; menus led by fresh local produce; and a service culture built
              on attentiveness rather than formality.
            </p>
            <p>
              Whether you are here for one night or one month, our promise is the same — comfort,
              privacy and hospitality that feels genuinely personal.
            </p>
          </div>
        </div>
      </Section>
      <Section className="bg-secondary/50">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "Stay", v: "Rooms and suites designed for rest." },
            { k: "Dine", v: "Restaurant, lounge and cellar." },
            { k: "Experience", v: "Pool, snooker, table tennis, fitness." },
            { k: "Celebrate", v: "Events, meetings and private dining." },
          ].map((p) => (
            <div key={p.k} className="rounded-lg border border-border/70 bg-card p-6">
              <p className="font-display text-2xl">{p.k}</p>
              <p className="mt-2 text-sm text-muted-foreground">{p.v}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
