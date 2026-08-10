import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HOTEL } from "@/lib/hotel-data";

const nav = [
  { to: "/stay", label: "Stay" },
  { to: "/dine", label: "Dine" },
  { to: "/experience", label: "Experience" },
  { to: "/events", label: "Events" },
  { to: "/offers", label: "Offers" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteFooter() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl tracking-[0.2em] uppercase">The Splendid</p>
            <p className="font-display text-2xl tracking-[0.2em] text-gold uppercase">Sanctuary</p>
            <p className="mt-4 max-w-xs text-sm text-primary-foreground/70">{HOTEL.tagline}</p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={["Instagram", "Facebook", "Twitter"][i]}
                  className="grid h-9 w-9 place-items-center rounded-full border border-primary-foreground/25 transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="eyebrow text-gold">Explore</h3>
            <ul className="mt-5 grid grid-cols-2 gap-2 text-sm">
              {nav.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-primary-foreground/75 transition-colors hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow text-gold">Contact</h3>
            <ul className="mt-5 space-y-3 text-sm text-primary-foreground/75">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {HOTEL.address}
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {HOTEL.phone}
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {HOTEL.email}
              </li>
              <li className="text-primary-foreground/60">{HOTEL.hours}</li>
            </ul>
          </div>

          <div>
            <h3 className="eyebrow text-gold">Newsletter</h3>
            <p className="mt-5 text-sm text-primary-foreground/70">
              Seasonal offers and news from the Sanctuary, occasionally.
            </p>
            <form
              className="mt-4 flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
                  toast.error("Please enter a valid email address.");
                  return;
                }
                toast.success("Thank you — you're on the list.");
                setEmail("");
              }}
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <Input
                id="newsletter-email"
                type="email"
                value={email}
                maxLength={255}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="border-primary-foreground/25 bg-transparent text-primary-foreground placeholder:text-primary-foreground/40"
              />
              <Button type="submit" variant="secondary" className="shrink-0 text-xs tracking-widest uppercase">
                Join
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 The Splendid Sanctuary. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <Link to="/policies" hash="privacy" className="hover:text-gold">
              Privacy Policy
            </Link>
            <Link to="/policies" hash="terms" className="hover:text-gold">
              Terms &amp; Conditions
            </Link>
            <Link to="/policies" hash="booking" className="hover:text-gold">
              Booking Policy
            </Link>
            <Link to="/management" className="hover:text-gold">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
