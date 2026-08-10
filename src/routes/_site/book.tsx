import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { bookingExtras, money, roomTypes } from "@/lib/hotel-data";
import { useHotel } from "@/lib/hotel-store";
import { cn } from "@/lib/utils";

const addDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const Route = createFileRoute("/_site/book")({
  validateSearch: (search: Record<string, unknown>) => ({
    checkIn: typeof search["checkIn"] === "string" ? search["checkIn"] : addDays(1),
    checkOut: typeof search["checkOut"] === "string" ? search["checkOut"] : addDays(3),
    guests: Number(search["guests"]) > 0 ? Number(search["guests"]) : 2,
    type: typeof search["type"] === "string" ? search["type"] : "any",
  }),
  head: () => ({
    meta: [
      { title: "Book Your Stay — The Splendid Sanctuary" },
      { name: "description", content: "Reserve a room or suite at The Splendid Sanctuary in six simple steps, with instant confirmation." },
      { property: "og:title", content: "Book Your Stay — The Splendid Sanctuary" },
      { property: "og:description", content: "Direct booking with best available rates." },
    ],
  }),
  component: BookPage,
});

const guestSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().min(6, "Enter a phone number").max(30),
  requests: z.string().max(500).optional(),
});

const steps = ["Dates", "Room", "Extras", "Details", "Payment", "Confirmation"];

function BookPage() {
  const search = Route.useSearch();
  const { createReservation } = useHotel();
  const [step, setStep] = useState(0);
  const [checkIn, setCheckIn] = useState(search.checkIn);
  const [checkOut, setCheckOut] = useState(search.checkOut);
  const [guests, setGuests] = useState(search.guests);
  const [typeId, setTypeId] = useState(search.type !== "any" ? search.type : "");
  const [extras, setExtras] = useState<string[]>([]);
  const [details, setDetails] = useState({ name: "", email: "", phone: "", requests: "" });
  const [reference, setReference] = useState<string | null>(null);

  const nights = useMemo(() => {
    const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(1, Math.round(ms / 86_400_000));
  }, [checkIn, checkOut]);

  const room = roomTypes.find((r) => r.id === typeId);
  const extrasTotal = extras.reduce(
    (s, id) => s + (bookingExtras.find((e) => e.id === id)?.price ?? 0),
    0,
  );
  const roomTotal = (room?.price ?? 0) * nights;
  const taxes = Math.round((roomTotal + extrasTotal) * 0.075);
  const total = roomTotal + extrasTotal + taxes;

  const next = () => {
    if (step === 0 && new Date(checkOut) <= new Date(checkIn)) {
      toast.error("Check-out must be after check-in.");
      return;
    }
    if (step === 1 && !room) {
      toast.error("Please select a room.");
      return;
    }
    if (step === 3) {
      const parsed = guestSchema.safeParse(details);
      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message ?? "Please check your details.");
        return;
      }
    }
    if (step === 4) {
      const res = createReservation({
        guestName: details.name.trim(),
        email: details.email.trim(),
        phone: details.phone.trim(),
        roomTypeId: room!.id,
        checkIn,
        checkOut,
        guests,
        nights,
        extras: extras.map((e) => bookingExtras.find((b) => b.id === e)?.label ?? e),
        total,
        requests: details.requests.trim() || undefined,
      });
      setReference(res?.reference ?? null);
      toast.success("Reservation confirmed.");
    }
    setStep((s) => Math.min(steps.length - 1, s + 1));
  };

  return (
    <div className="pt-28">
      <Section className="py-12">
        <p className="eyebrow text-gold">Reservations</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Book your stay</h1>

        <ol className="mt-10 flex flex-wrap gap-2 text-xs">
          {steps.map((s, i) => (
            <li
              key={s}
              className={cn(
                "rounded-full border px-4 py-1.5 tracking-widest uppercase",
                i === step
                  ? "border-gold bg-gold text-gold-foreground"
                  : i < step
                    ? "border-border bg-secondary text-secondary-foreground"
                    : "border-border text-muted-foreground",
              )}
            >
              {i + 1}. {s}
            </li>
          ))}
        </ol>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <div className="rounded-lg border border-border/70 bg-card p-7">
            {step === 0 ? (
              <div className="grid gap-5 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="b-in">Check-in</Label>
                  <Input id="b-in" type="date" value={checkIn} min={addDays(0)} onChange={(e) => setCheckIn(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="b-out">Check-out</Label>
                  <Input id="b-out" type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="b-guests">Guests</Label>
                  <Input id="b-guests" type="number" min={1} max={6} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
                </div>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="grid gap-4">
                {roomTypes
                  .filter((r) => r.capacity >= guests)
                  .map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setTypeId(r.id)}
                      className={cn(
                        "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-lg border p-4 text-left transition-colors",
                        typeId === r.id ? "border-gold bg-secondary/60" : "border-border hover:border-gold/60",
                      )}
                    >
                      <img src={r.image} alt="" className="h-16 w-24 rounded object-cover" loading="lazy" />
                      <span className="min-w-0">
                        <span className="block font-display text-xl">{r.name}</span>
                        <span className="block text-xs text-muted-foreground">{r.short}</span>
                      </span>
                      <span className="text-sm whitespace-nowrap">{money(r.price)}/night</span>
                    </button>
                  ))}
              </div>
            ) : null}

            {step === 2 ? (
              <ul className="space-y-3">
                {bookingExtras.map((e) => (
                  <li key={e.id} className="flex items-center justify-between gap-4 rounded-md border border-border/70 p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <Checkbox
                        id={`x-${e.id}`}
                        checked={extras.includes(e.id)}
                        onCheckedChange={(c) =>
                          setExtras((prev) => (c ? [...prev, e.id] : prev.filter((p) => p !== e.id)))
                        }
                      />
                      <Label htmlFor={`x-${e.id}`} className="cursor-pointer">
                        {e.label}
                      </Label>
                    </div>
                    <span className="text-sm">{money(e.price)}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {step === 3 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="g-name">Full name</Label>
                  <Input id="g-name" maxLength={100} value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="g-email">Email</Label>
                  <Input id="g-email" type="email" maxLength={255} value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="g-phone">Phone</Label>
                  <Input id="g-phone" maxLength={30} value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="g-req">Special requests</Label>
                  <Textarea id="g-req" rows={4} maxLength={500} value={details.requests} onChange={(e) => setDetails({ ...details, requests: e.target.value })} />
                </div>
              </div>
            ) : null}

            {step === 4 ? (
              <div className="space-y-3 text-sm">
                <h2 className="font-display text-2xl">Review & pay</h2>
                <p className="text-muted-foreground">
                  This demonstration confirms the reservation instantly and marks it as paid; a live
                  payment provider can be connected later.
                </p>
              </div>
            ) : null}

            {step === 5 ? (
              <div className="space-y-4">
                <h2 className="font-display text-3xl">Reservation confirmed</h2>
                <p className="text-sm text-muted-foreground">
                  Thank you, {details.name}. A confirmation has been sent to {details.email}.
                </p>
                <dl className="grid gap-3 rounded-lg border border-border/70 p-5 text-sm sm:grid-cols-2">
                  <div><dt className="eyebrow">Reference</dt><dd className="mt-1 font-medium">{reference}</dd></div>
                  <div><dt className="eyebrow">Room</dt><dd className="mt-1">{room?.name}</dd></div>
                  <div><dt className="eyebrow">Dates</dt><dd className="mt-1">{checkIn} → {checkOut}</dd></div>
                  <div><dt className="eyebrow">Guests</dt><dd className="mt-1">{guests}</dd></div>
                  <div><dt className="eyebrow">Total</dt><dd className="mt-1">{money(total)}</dd></div>
                  <div><dt className="eyebrow">Payment</dt><dd className="mt-1">Paid</dd></div>
                </dl>
                <div className="flex flex-wrap gap-3">
                  <Button asChild className="tracking-[0.18em] uppercase">
                    <Link to="/account">View my stay</Link>
                  </Button>
                  <Button asChild variant="outline" className="tracking-[0.18em] uppercase">
                    <Link to="/">Back to home</Link>
                  </Button>
                </div>
              </div>
            ) : null}

            {step < 5 ? (
              <div className="mt-8 flex justify-between gap-3">
                <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
                  Back
                </Button>
                <Button onClick={next} className="tracking-[0.18em] uppercase">
                  {step === 4 ? "Confirm & pay" : "Continue"}
                </Button>
              </div>
            ) : null}
          </div>

          <aside className="rounded-lg border border-border/70 bg-secondary/50 p-6 lg:sticky lg:top-28">
            <h2 className="font-display text-2xl">Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt>Accommodation</dt><dd>{room ? room.name : "—"}</dd></div>
              <div className="flex justify-between"><dt>Nights</dt><dd>{nights}</dd></div>
              <div className="flex justify-between"><dt>Room total</dt><dd>{money(roomTotal)}</dd></div>
              <div className="flex justify-between"><dt>Extras</dt><dd>{money(extrasTotal)}</dd></div>
              <div className="flex justify-between"><dt>Taxes & fees</dt><dd>{money(taxes)}</dd></div>
              <div className="mt-3 flex justify-between border-t border-border pt-3 font-medium"><dt>Total</dt><dd>{money(total)}</dd></div>
            </dl>
          </aside>
        </div>
      </Section>
    </div>
  );
}
