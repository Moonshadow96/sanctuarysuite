import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Star, MapPin, Phone, Mail } from "lucide-react";

import { BookingWidget } from "@/components/site/BookingWidget";
import { RoomCard } from "@/components/site/RoomCard";
import { Section, SectionHeading } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { HOTEL, images, offers, reviews, roomTypes, facilities } from "@/lib/hotel-data";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: "The Splendid Sanctuary — Luxury Hotel in Ikoyi, Lagos" },
      {
        name: "description",
        content:
          "Book refined rooms and suites, dining, pool, snooker and events at The Splendid Sanctuary, Park View. Direct booking with best available rates.",
      },
      { property: "og:title", content: "The Splendid Sanctuary — Where Luxury Meets Tranquility" },
      {
        property: "og:description",
        content:
          "Refined accommodation, exceptional dining and unforgettable leisure experiences designed around your comfort.",
      },
      { property: "og:url", content: "https://sanctuarysuite.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://sanctuarysuite.lovable.app/" }],
  }),

  component: Home,
});

const pillars = [
  { title: "Stay", copy: "Luxury accommodation and lodging.", to: "/stay" },
  { title: "Dine", copy: "Restaurant, lounge, wine and beverages.", to: "/dine" },
  { title: "Experience", copy: "Pool, snooker, table tennis and fitness.", to: "/experience" },
  { title: "Celebrate", copy: "Events, meetings and private gatherings.", to: "/events" },
] as const;

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden">
        <img
          src={images.hero}
          alt="The Splendid Sanctuary illuminated at dusk beside its reflecting pool"
          width={1920}
          height={1088}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/70 via-ink/45 to-ink/85" />

        <div className="mx-auto w-full max-w-7xl px-4 pt-32 pb-48 sm:px-6 lg:px-8">
          <div className="fade-up max-w-3xl">
            <p className="eyebrow text-gold">{HOTEL.address}</p>
            <h1 className="mt-5 font-display text-5xl leading-[1.02] text-balance text-primary-foreground sm:text-6xl lg:text-7xl">
              The Splendid Sanctuary — Luxury Hotel &amp; Suites in Ikoyi, Lagos
            </h1>

            <p className="mt-4 font-display text-2xl text-gold italic sm:text-3xl">
              {HOTEL.tagline}
            </p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/80">
              Discover refined accommodation, exceptional dining and unforgettable leisure
              experiences in a place designed around your comfort.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" className="tracking-[0.18em] uppercase">
                <Link to="/book">Book your stay</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 bg-transparent tracking-[0.18em] text-primary-foreground uppercase hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/experience">Explore the Sanctuary</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 translate-y-1/2 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <BookingWidget />
          </div>
        </div>
      </section>

      {/* WELCOME */}
      <Section className="pt-56 lg:pt-64">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative">
            <img
              src={images.welcome}
              alt="The lobby lounge at The Splendid Sanctuary"
              loading="lazy"
              width={1200}
              height={1400}
              className="aspect-[4/5] w-full rounded-lg object-cover shadow-lift"
            />
            <div className="absolute -right-4 -bottom-6 hidden rounded-lg bg-primary px-8 py-6 text-primary-foreground sm:block">
              <p className="font-display text-4xl text-gold">12</p>
              <p className="eyebrow mt-1 text-primary-foreground/70">Years of hospitality</p>
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow="Welcome"
              title="Welcome to The Splendid Sanctuary"
              copy="More than a place to stay, The Splendid Sanctuary is a destination created for comfort, relaxation and memorable experiences."
            />
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Our philosophy is simple: quiet luxury, delivered with genuine warmth. Every room,
              every plate and every conversation is arranged around how you want to spend your
              time — whether that is a long weekend by the pool, a family celebration or a week of
              focused work.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {pillars.map((p) => (
                <Link
                  key={p.title}
                  to={p.to}
                  className="group rounded-lg border border-border/70 bg-card p-5 transition-colors hover:border-gold"
                >
                  <p className="font-display text-xl">{p.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{p.copy}</p>
                  <ArrowRight className="mt-3 h-4 w-4 text-gold transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
            <Button asChild variant="link" className="mt-6 px-0 tracking-[0.18em] uppercase">
              <Link to="/about">
                Discover our story <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* ACCOMMODATION */}
      <Section className="bg-secondary/50">
        <SectionHeading
          eyebrow="Accommodation"
          title="Find your perfect stay"
          copy="Thoughtfully designed rooms and suites offering comfort, privacy and everything you need for a memorable stay."
          align="center"
        />
        <div className="mt-14 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {roomTypes.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="tracking-[0.18em] uppercase">
            <Link to="/stay">Explore all accommodation</Link>
          </Button>
        </div>
      </Section>

      {/* DINING */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <SectionHeading
            eyebrow="Dining"
            title="Dine, unwind & indulge"
            copy="From delicious meals to relaxed evenings, every dining experience at The Splendid Sanctuary is designed to be enjoyed."
          />
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { name: "The Sanctuary Restaurant", copy: "Breakfast, lunch and dinner, served in a calm, light-filled room." },
              { name: "The Sanctuary Lounge", copy: "A relaxed social space for coffee, conversation and slow evenings." },
              { name: "Wine & Beverages", copy: "A curated cellar alongside signature mocktails and fresh juices." },
            ].map((d) => (
              <div key={d.name} className="rounded-lg border border-border/70 bg-card p-6">
                <h3 className="font-display text-xl">{d.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d.copy}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10">
          <Button asChild className="tracking-[0.18em] uppercase">
            <Link to="/dine">Explore dining</Link>
          </Button>
        </div>
      </Section>

      {/* EXPERIENCE */}
      <Section className="bg-primary text-primary-foreground">
        <SectionHeading
          eyebrow="Leisure"
          title="Experience the Sanctuary"
          copy="Your time at The Splendid Sanctuary should be as enjoyable outside your room as it is inside."
          invert
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {facilities.map((f) => (
            <div
              key={f.id}
              className="flex flex-col rounded-lg border border-primary-foreground/15 p-6 transition-colors hover:border-gold"
            >
              <h3 className="font-display text-2xl">{f.name}</h3>
              <p className="mt-3 flex-1 text-sm text-primary-foreground/70">{f.blurb}</p>
              <p className="eyebrow mt-5 text-gold">{f.hours}</p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Button
            asChild
            variant="outline"
            className="border-primary-foreground/40 bg-transparent tracking-[0.18em] text-primary-foreground uppercase hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <Link to="/experience">Explore experiences</Link>
          </Button>
        </div>
      </Section>

      {/* EVENTS */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Events"
            title="Celebrate something special"
            copy="From intimate gatherings to memorable celebrations, The Splendid Sanctuary provides an elegant setting for life's special moments."
          />
          <div>
            <ul className="grid grid-cols-2 gap-3 text-sm">
              {["Weddings", "Birthdays", "Anniversaries", "Corporate events", "Meetings", "Conferences", "Private dinners", "Social gatherings"].map((e) => (
                <li key={e} className="rounded-md border border-border/70 bg-card px-4 py-3">
                  {e}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8 tracking-[0.18em] uppercase">
              <Link to="/events">Plan your event</Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* OFFERS */}
      <Section className="bg-secondary/50">
        <SectionHeading
          eyebrow="Offers"
          title="Make your stay even more special"
          align="center"
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {offers.map((o) => (
            <article key={o.id} className="group overflow-hidden rounded-lg bg-card shadow-soft">
              <img
                src={o.image}
                alt={o.title}
                loading="lazy"
                width={1200}
                height={900}
                className="aspect-[3/2] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="p-5">
                <h3 className="font-display text-xl">{o.title}</h3>
                <p className="eyebrow mt-1 text-gold">{o.strapline}</p>
                <p className="mt-3 text-sm text-muted-foreground">{o.description}</p>
                <Button asChild variant="link" className="mt-3 px-0 text-xs tracking-widest uppercase">
                  <Link to="/offers">Explore offer</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* REVIEWS */}
      <Section>
        <SectionHeading
          eyebrow="Guest reviews"
          title="Experiences that speak for themselves"
          align="center"
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r) => (
            <figure key={r.id} className="flex h-full flex-col rounded-lg border border-border/70 bg-card p-6">
              <div className="flex gap-1" aria-label={`${r.rating} out of 5 stars`}>
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                “{r.body}”
              </blockquote>
              <figcaption className="mt-5 border-t border-border/70 pt-4">
                <p className="font-medium">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.stayType}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* LOCATION */}
      <Section className="bg-secondary/50">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading eyebrow="Location" title="Your sanctuary awaits" />
            <ul className="mt-8 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {HOTEL.address}
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {HOTEL.phone}
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {HOTEL.email}
              </li>
              <li className="text-muted-foreground">{HOTEL.hours}</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="outline" className="tracking-[0.18em] uppercase">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(HOTEL.address)}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Get directions
                </a>
              </Button>
              <Button asChild className="tracking-[0.18em] uppercase">
                <Link to="/contact">Contact us</Link>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-border/70">
            <iframe
              title="Map showing The Splendid Sanctuary"
              src={`https://www.google.com/maps?q=${encodeURIComponent(HOTEL.address)}&output=embed`}
              className="h-[360px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Section>

      {/* FINAL CTA */}
      <section className="relative isolate overflow-hidden px-4 py-28 text-center sm:px-6 lg:px-8">
        <img
          src={images.hero}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-ink/75" />
        <h2 className="mx-auto max-w-3xl font-display text-3xl text-balance text-primary-foreground sm:text-5xl">
          Ready to experience The Splendid Sanctuary?
        </h2>
        <p className="mt-4 text-primary-foreground/75">Your next memorable stay begins here.</p>
        <Button asChild size="lg" className="mt-8 tracking-[0.18em] uppercase">
          <Link to="/book">Book your stay</Link>
        </Button>
      </section>
    </>
  );
}
