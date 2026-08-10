import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { money, roomTypeById } from "@/lib/hotel-data";
import { useHotel } from "@/lib/hotel-store";

export const Route = createFileRoute("/_site/account")({
  head: () => ({
    meta: [
      { title: "My Stay — The Splendid Sanctuary" },
      { name: "description", content: "View your reservation, charges and quick actions during your stay at The Splendid Sanctuary." },
      { property: "og:title", content: "My Stay — The Splendid Sanctuary" },
      { property: "og:description", content: "Guest portal for reservations and services." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { reservations, guestReference, setGuestReference } = useHotel();
  const [input, setInput] = useState(guestReference ?? "");
  const reservation = reservations.find((r) => r.reference === guestReference);

  return (
    <div className="pt-28">
      <Section className="py-12">
        <p className="eyebrow text-gold">Guest portal</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">My stay</h1>

        <form
          className="mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            setGuestReference(input.trim().toUpperCase());
          }}
        >
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="ref">Booking reference</Label>
            <Input id="ref" value={input} maxLength={20} onChange={(e) => setInput(e.target.value)} placeholder="SS-2026-00842" />
          </div>
          <Button type="submit" className="tracking-[0.18em] uppercase">Find</Button>
        </form>

        {!reservation ? (
          <p className="mt-10 text-sm text-muted-foreground">
            Enter the reference from your confirmation email to view your reservation.
          </p>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-lg border border-border/70 bg-card p-7">
              <h2 className="font-display text-2xl">Upcoming stay</h2>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2 text-sm">
                <div><dt className="eyebrow">Room</dt><dd className="mt-1">{roomTypeById(reservation.roomTypeId)?.name}{reservation.roomNumber ? ` · Room ${reservation.roomNumber}` : ""}</dd></div>
                <div><dt className="eyebrow">Dates</dt><dd className="mt-1">{reservation.checkIn} → {reservation.checkOut}</dd></div>
                <div><dt className="eyebrow">Reference</dt><dd className="mt-1">{reservation.reference}</dd></div>
                <div><dt className="eyebrow">Payment</dt><dd className="mt-1 capitalize">{reservation.payment}</dd></div>
                <div><dt className="eyebrow">Status</dt><dd className="mt-1 capitalize">{reservation.status}</dd></div>
                <div><dt className="eyebrow">Total</dt><dd className="mt-1">{money(reservation.total)}</dd></div>
              </dl>

              <h3 className="mt-8 font-display text-xl">Your bill</h3>
              <ul className="mt-3 divide-y divide-border/70 text-sm">
                {reservation.charges.map((c) => (
                  <li key={c.id} className="flex justify-between gap-4 py-2">
                    <span className="min-w-0">{c.label}</span>
                    <span>{money(c.amount)}</span>
                  </li>
                ))}
                <li className="flex justify-between gap-4 py-2 font-medium">
                  <span>Balance</span>
                  <span>{money(reservation.charges.reduce((s, c) => s + c.amount, 0))}</span>
                </li>
              </ul>
            </div>

            <aside className="rounded-lg border border-border/70 bg-secondary/50 p-6">
              <h2 className="font-display text-2xl">Quick actions</h2>
              <div className="mt-5 grid gap-3">
                <Button asChild variant="outline"><Link to="/dine">Request room service</Link></Button>
                <Button asChild variant="outline"><Link to="/experience">Book an experience</Link></Button>
                <Button asChild variant="outline"><Link to="/events">Plan a celebration</Link></Button>
                <Button asChild variant="outline"><Link to="/contact">Contact the hotel</Link></Button>
              </div>
            </aside>
          </div>
        )}
      </Section>
    </div>
  );
}
