import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HOTEL, images } from "@/lib/hotel-data";

export const Route = createFileRoute("/_site/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Location — The Splendid Sanctuary" },
      { name: "description", content: `Reach The Splendid Sanctuary at ${HOTEL.address}. Phone, email, directions and reception hours.` },
      { property: "og:title", content: "Your Sanctuary Awaits — Contact Us" },
      { property: "og:description", content: "Address, phone, email and directions." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  message: z.string().trim().min(5, "Please add a short message").max(1000),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <>
      <PageHero eyebrow="Contact" title="Your sanctuary awaits" image={images.hero} />
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Get in touch" title="We're here around the clock" />
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
            <Button asChild variant="outline" className="mt-8 tracking-[0.18em] uppercase">
              <a href={`https://maps.google.com/?q=${encodeURIComponent(HOTEL.address)}`} target="_blank" rel="noreferrer noopener">
                Get directions
              </a>
            </Button>
            <div className="mt-8 overflow-hidden rounded-lg border border-border/70">
              <iframe
                title="Map showing The Splendid Sanctuary"
                src={`https://www.google.com/maps?q=${encodeURIComponent(HOTEL.address)}&output=embed`}
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <form
            className="space-y-5 rounded-lg border border-border/70 bg-card p-7"
            onSubmit={(e) => {
              e.preventDefault();
              const parsed = schema.safeParse(form);
              if (!parsed.success) {
                toast.error(parsed.error.issues[0]?.message ?? "Please check the form.");
                return;
              }
              toast.success("Message sent — we'll reply shortly.");
              setForm({ name: "", email: "", message: "" });
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="c-name">Name</Label>
              <Input id="c-name" maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-email">Email</Label>
              <Input id="c-email" type="email" maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-message">Message</Label>
              <Textarea id="c-message" rows={6} maxLength={1000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            <Button type="submit" className="w-full tracking-[0.18em] uppercase">
              Send message
            </Button>
          </form>
        </div>
      </Section>
    </>
  );
}
