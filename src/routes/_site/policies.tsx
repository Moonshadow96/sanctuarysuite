import { createFileRoute } from "@tanstack/react-router";

import { PageHero, Section } from "@/components/site/Section";
import { images } from "@/lib/hotel-data";

export const Route = createFileRoute("/_site/policies")({
  head: () => ({
    meta: [
      { title: "Policies — The Splendid Sanctuary" },
      { name: "description", content: "Privacy policy, terms and conditions and booking policy for The Splendid Sanctuary." },
      { property: "og:title", content: "Policies — The Splendid Sanctuary" },
      { property: "og:description", content: "Privacy, terms and booking policies." },
    ],
  }),
  component: PoliciesPage,
});

const sections = [
  {
    id: "privacy",
    title: "Privacy Policy",
    body: "We collect only the information needed to manage your reservation and stay: your name, contact details, stay dates and any preferences you share. We never sell guest data. Payment details are processed by our payment provider and are not stored on our systems.",
  },
  {
    id: "terms",
    title: "Terms & Conditions",
    body: "Use of this website and our services is subject to Nigerian law. Rates are quoted per room per night and include applicable taxes unless stated otherwise. The Splendid Sanctuary reserves the right to refuse service in cases of unlawful or unsafe conduct.",
  },
  {
    id: "booking",
    title: "Booking Policy",
    body: "Check-in from 14:00, check-out by 12:00. Reservations may be cancelled free of charge up to 48 hours before arrival; later cancellations are charged one night. Early departures are charged for the full confirmed stay unless agreed with reception.",
  },
];

function PoliciesPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Policies" image={images.deluxe} />
      <Section>
        <div className="mx-auto max-w-3xl space-y-12">
          {sections.map((s) => (
            <article key={s.id} id={s.id} className="scroll-mt-28">
              <h2 className="font-display text-3xl">{s.title}</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{s.body}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
