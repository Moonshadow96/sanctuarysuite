import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { BedDouble, Check, Maximize, Users } from "lucide-react";

import { RoomCard } from "@/components/site/RoomCard";
import { Section, SectionHeading } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { money, roomTypes } from "@/lib/hotel-data";

export const Route = createFileRoute("/_site/stay/$slug")({
  loader: ({ params }) => {
    const room = roomTypes.find((r) => r.slug === params.slug);
    if (!room) throw notFound();
    return { room };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Room not found — The Splendid Sanctuary" }, { name: "robots", content: "noindex" }] };
    }
    const { room } = loaderData;
    const url = `https://sanctuarysuite.lovable.app/stay/${params.slug}`;
    return {
      meta: [
        { title: `${room.name} — The Splendid Sanctuary` },
        { name: "description", content: room.short },
        { property: "og:title", content: `${room.name} — The Splendid Sanctuary` },
        { property: "og:description", content: room.short },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HotelRoom",
            name: room.name,
            description: room.short,
            url,
            occupancy: { "@type": "QuantitativeValue", maxValue: room.sleeps ?? 2 },
            containedInPlace: {
              "@type": "Hotel",
              name: "The Splendid Sanctuary",
              address: {
                "@type": "PostalAddress",
                streetAddress: "22 Sanctuary Crescent, Park View Estate",
                addressLocality: "Ikoyi",
                addressRegion: "Lagos",
                addressCountry: "NG",
              },
            },
          }),
        },
      ],
    };
  },

  component: RoomDetail,
});

const policies = [
  "Check-in from 14:00 · Check-out by 12:00",
  "Complimentary cancellation up to 48 hours before arrival",
  "Children welcome; cots available on request",
  "A non-smoking property throughout",
];

function RoomDetail() {
  const { room } = Route.useLoaderData();
  const similar = roomTypes.filter((r) => r.id !== room.id).slice(0, 3);

  return (
    <>
      <div className="pt-28">
        <Section className="py-10">
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <img
              src={room.image}
              alt={`${room.name} interior`}
              width={1200}
              height={900}
              className="aspect-[16/10] w-full rounded-lg object-cover"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {roomTypes
                .filter((r) => r.id !== room.id)
                .slice(0, 2)
                .map((r) => (
                  <img
                    key={r.id}
                    src={r.image}
                    alt={`${room.name} detail view`}
                    loading="lazy"
                    className="aspect-[4/3] w-full rounded-lg object-cover"
                  />
                ))}
            </div>
          </div>
        </Section>
      </div>

      <Section className="pt-0">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <p className="eyebrow text-gold">Accommodation</p>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl">{room.name}</h1>
            <p className="mt-5 leading-relaxed text-muted-foreground">{room.description}</p>

            <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: Users, label: "Capacity", value: `${room.capacity} guests` },
                { icon: BedDouble, label: "Bed", value: room.bed },
                { icon: Maximize, label: "Size", value: room.size },
                { icon: Check, label: "Rate", value: `${money(room.price)}/night` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-lg border border-border/70 bg-card p-4">
                  <Icon className="h-4 w-4 text-gold" />
                  <dt className="eyebrow mt-3">{label}</dt>
                  <dd className="mt-1 text-sm font-medium">{value}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-12 font-display text-2xl">Amenities</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {room.amenities.map((a: string) => (
                <li key={a} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 shrink-0 text-gold" /> {a}
                </li>
              ))}
            </ul>

            <h2 className="mt-12 font-display text-2xl">Policies</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {policies.map((p) => (
                <li key={p}>· {p}</li>
              ))}
            </ul>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-lg border border-border/70 bg-card p-6 shadow-soft">
              <p className="eyebrow">From</p>
              <p className="mt-2 font-display text-4xl">
                {money(room.price)}
                <span className="ml-1 text-base text-muted-foreground">/ night</span>
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Includes daily housekeeping, Wi-Fi and access to the pool and fitness studio.
              </p>
              <Button asChild size="lg" className="mt-6 w-full tracking-[0.18em] uppercase">
                <Link to="/book" search={{ type: room.id }}>
                  Check availability
                </Link>
              </Button>
              <Button asChild variant="outline" className="mt-3 w-full tracking-[0.18em] uppercase">
                <Link to="/contact">Ask a question</Link>
              </Button>
            </div>
          </aside>
        </div>
      </Section>

      <Section className="bg-secondary/50">
        <SectionHeading eyebrow="You may also like" title="Similar accommodation" />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((r) => (
            <RoomCard key={r.id} room={r} />
          ))}
        </div>
      </Section>
    </>
  );
}
