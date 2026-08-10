import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { images } from "@/lib/hotel-data";
import { useHotel } from "@/lib/hotel-store";

export const Route = createFileRoute("/_site/events")({
  head: () => ({
    meta: [
      { title: "Events & Celebrations — The Splendid Sanctuary" },
      {
        name: "description",
        content:
          "Weddings, birthdays, conferences and private dinners at The Splendid Sanctuary. Send an event inquiry and our team will respond.",
      },
      { property: "og:title", content: "Celebrate Something Special" },
      { property: "og:description", content: "An elegant setting for life's special moments." },
    ],
  }),
  component: EventsPage,
});

const schema = z.object({
  type: z.string().trim().min(2, "Tell us the event type").max(80),
  date: z.string().min(1, "Choose a date"),
  guests: z.coerce.number().min(1, "At least one guest").max(1000),
  space: z.string().min(1),
  catering: z.string().min(1),
  services: z.string().max(300).optional(),
  client: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(6, "Enter a phone number").max(30),
  message: z.string().max(1000).optional(),
});

const spaces = ["Crescent Hall", "Sanctuary Garden", "Private Dining Room", "Poolside Terrace"];
const eventTypes = ["Wedding", "Birthday", "Anniversary", "Corporate event", "Meeting", "Conference", "Private dinner", "Social gathering"];

function EventsPage() {
  const { addEventInquiry } = useHotel();
  const [form, setForm] = useState({
    type: eventTypes[0]!,
    date: "",
    guests: "50",
    space: spaces[0]!,
    catering: "Full service",
    services: "",
    client: "",
    email: "",
    phone: "",
    message: "",
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Celebrate something special"
        copy="From intimate gatherings to memorable celebrations, The Splendid Sanctuary provides an elegant setting for life's special moments."
        image={images.presidential}
      />

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {eventTypes.map((e) => (
            <div key={e} className="rounded-lg border border-border/70 bg-card px-5 py-6 text-center">
              <p className="font-display text-xl">{e}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-secondary/50">
        <SectionHeading eyebrow="Plan your event" title="Send an inquiry" copy="Share a few details and our events team will be in touch within one business day." />
        <form
          className="mt-12 grid gap-5 rounded-lg border border-border/70 bg-card p-7 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const parsed = schema.safeParse(form);
            if (!parsed.success) {
              toast.error(parsed.error.issues[0]?.message ?? "Please check the form.");
              return;
            }
            const d = parsed.data;
            addEventInquiry({
              client: d.client,
              email: d.email,
              phone: d.phone,
              type: d.type,
              date: d.date,
              guests: d.guests,
              space: d.space,
              catering: d.catering,
              services: d.services,
              message: d.message,
            });
            toast.success("Inquiry received — our events team will contact you shortly.");
            setForm({ ...form, client: "", email: "", phone: "", message: "", services: "" });
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="ev-type">Event type</Label>
            <select id="ev-type" value={form.type} onChange={(e) => set("type", e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
              {eventTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ev-date">Date</Label>
            <Input id="ev-date" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ev-guests">Number of guests</Label>
            <Input id="ev-guests" type="number" min={1} max={1000} value={form.guests} onChange={(e) => set("guests", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ev-space">Preferred space</Label>
            <select id="ev-space" value={form.space} onChange={(e) => set("space", e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
              {spaces.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ev-catering">Catering requirements</Label>
            <select id="ev-catering" value={form.catering} onChange={(e) => set("catering", e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
              {["Full service", "Buffet", "Set menu", "Canapés only", "No catering"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ev-services">Additional services</Label>
            <Input id="ev-services" maxLength={300} value={form.services} onChange={(e) => set("services", e.target.value)} placeholder="AV, décor, accommodation…" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ev-name">Full name</Label>
            <Input id="ev-name" maxLength={100} value={form.client} onChange={(e) => set("client", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ev-email">Email</Label>
            <Input id="ev-email" type="email" maxLength={255} value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ev-phone">Phone</Label>
            <Input id="ev-phone" maxLength={30} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="ev-message">Message</Label>
            <Textarea id="ev-message" maxLength={1000} rows={4} value={form.message} onChange={(e) => set("message", e.target.value)} />
          </div>
          <Button type="submit" className="tracking-[0.18em] uppercase sm:col-span-2">
            Plan your event
          </Button>
        </form>
      </Section>
    </>
  );
}
