import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { facilities, images, money } from "@/lib/hotel-data";
import { useHotel } from "@/lib/hotel-store";

export const Route = createFileRoute("/_site/experience")({
  head: () => ({
    meta: [
      { title: "Pool, Snooker & Recreation — The Splendid Sanctuary" },
      {
        name: "description",
        content:
          "Swimming pool, snooker lounge, table tennis, fitness and relaxation spaces. Reserve a session at The Splendid Sanctuary.",
      },
      { property: "og:title", content: "Experience the Sanctuary" },
      { property: "og:description", content: "Pool, snooker, table tennis, fitness and quiet relaxation spaces." },
    ],
  }),
  component: ExperiencePage,
});

const slots = ["08:00 – 09:00", "11:00 – 12:00", "15:00 – 16:00", "19:00 – 20:00"];

function ExperiencePage() {
  const { addFacilityBooking } = useHotel();
  const [facility, setFacility] = useState(facilities[0]!.name);
  const [slot, setSlot] = useState(slots[0]!);
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  return (
    <>
      <PageHero
        eyebrow="Leisure"
        title="Experience the Sanctuary"
        copy="Your time at The Splendid Sanctuary should be as enjoyable outside your room as it is inside."
        image={images.hero}
      />

      <Section>
        <div className="grid gap-8 sm:grid-cols-2">
          {facilities.map((f) => (
            <article key={f.id} className="rounded-lg border border-border/70 bg-card p-7">
              <h2 className="font-display text-2xl">{f.name}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{f.blurb}</p>
              <ul className="mt-5 space-y-1.5 text-sm text-muted-foreground">
                {f.details.map((d) => (
                  <li key={d}>· {d}</li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4 text-xs">
                <span className="eyebrow text-gold">{f.hours}</span>
                <span className="text-muted-foreground">
                  {f.fee === 0 ? "Complimentary for guests" : `${money(f.fee)} per session`}
                </span>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-secondary/50">
        <SectionHeading
          eyebrow="Relaxation spaces"
          title="Gardens, poolside seating and quiet corners"
          copy="Shaded gardens, outdoor seating and calm social spaces across the property — no reservation needed."
        />
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <SectionHeading eyebrow="Reserve" title="Book a facility session" copy="In-house guests can reserve a slot; any fee is added to the room bill." />
          <form
            className="grid gap-4 rounded-lg border border-border/70 bg-card p-6 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) return toast.error("Please enter your name.");
              const selected = facilities.find((f) => f.name === facility)!;
              addFacilityBooking({
                facility,
                guestName: name.trim(),
                roomNumber: room.trim() || undefined,
                date,
                slot,
                guests: 1,
                fee: selected.fee,
              });
              toast.success(`${facility} reserved for ${slot}.`);
              setName("");
              setRoom("");
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="f-facility">Facility</Label>
              <select
                id="f-facility"
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {facilities.map((f) => (
                  <option key={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="f-slot">Time slot</Label>
              <select
                id="f-slot"
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {slots.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="f-date">Date</Label>
              <Input id="f-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="f-room">Room number (optional)</Label>
              <Input id="f-room" value={room} maxLength={5} onChange={(e) => setRoom(e.target.value)} placeholder="204" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="f-name">Your name</Label>
              <Input id="f-name" value={name} maxLength={100} onChange={(e) => setName(e.target.value)} />
            </div>
            <Button type="submit" className="sm:col-span-2 tracking-[0.18em] uppercase">
              Reserve session
            </Button>
          </form>
        </div>
      </Section>
    </>
  );
}
