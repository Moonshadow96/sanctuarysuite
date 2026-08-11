import { Link, createFileRoute } from "@tanstack/react-router";
import { Check, Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Section } from "@/components/site/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { bookingExtras, extraTotal, HOTEL, money, roomTypes } from "@/lib/hotel-data";
import { useHotel } from "@/lib/hotel-store";
import { cn } from "@/lib/utils";

const addDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

interface BookSearch {
  checkIn?: string | undefined;
  checkOut?: string | undefined;
  guests?: number | undefined;
  type?: string | undefined;
  offer?: string | undefined;
}

export const Route = createFileRoute("/_site/book")({
  validateSearch: (search: Record<string, unknown>): BookSearch => ({
    checkIn: typeof search["checkIn"] === "string" ? search["checkIn"] : undefined,
    checkOut: typeof search["checkOut"] === "string" ? search["checkOut"] : undefined,
    guests: Number(search["guests"]) > 0 ? Number(search["guests"]) : undefined,
    type: typeof search["type"] === "string" ? search["type"] : undefined,
    offer: typeof search["offer"] === "string" ? search["offer"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Book Your Stay — The Splendid Sanctuary" },
      {
        name: "description",
        content:
          "Reserve a room or suite at The Splendid Sanctuary in Ikoyi, Lagos. Live availability, transparent pricing and instant confirmation.",
      },
      { property: "og:title", content: "Book Your Stay — The Splendid Sanctuary" },
      { property: "og:description", content: "Direct booking with best available rates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookPage,
});

const detailsSchema = z.object({
  firstName: z.string().trim().min(2, "Enter your first name").max(60),
  lastName: z.string().trim().min(2, "Enter your last name").max(60),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().min(6, "Enter a valid phone number").max(30),
  country: z.string().trim().min(2, "Select or enter your country").max(60),
  arrival: z.string().max(20).optional(),
  requests: z.string().max(500).optional(),
});

const STEPS = ["Dates", "Rooms", "Extras", "Details", "Payment", "Confirmation"] as const;
const TAX_RATE = 0.075;

const countries = [
  "Nigeria",
  "Ghana",
  "South Africa",
  "United Kingdom",
  "United States",
  "United Arab Emirates",
  "France",
  "Other",
];

function BookPage() {
  const search = Route.useSearch();
  const { createReservation, availabilityFor } = useHotel();

  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [checkIn, setCheckIn] = useState(search.checkIn ?? addDays(1));
  const [checkOut, setCheckOut] = useState(search.checkOut ?? addDays(3));
  const [guests, setGuests] = useState(search.guests ?? 2);
  const [typeId, setTypeId] = useState(search.type && search.type !== "any" ? search.type : "");
  const [extras, setExtras] = useState<Record<string, number>>({});
  const [detailsOpen, setDetailsOpen] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [method, setMethod] = useState("card");
  const [details, setDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "Nigeria",
    arrival: "",
    requests: "",
  });
  const [confirmed, setConfirmed] = useState<{
    reference: string;
    guestName: string;
    roomName: string;
    roomNumber: string | undefined;
    checkIn: string;
    checkOut: string;
    guests: number;
    extras: string[];
    total: number;
  } | null>(null);

  const nights = useMemo(() => {
    const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    if (!Number.isFinite(ms)) return 1;
    return Math.max(1, Math.round(ms / 86_400_000));
  }, [checkIn, checkOut]);

  const availability = availabilityFor(checkIn, checkOut);
  const room = roomTypes.find((r) => r.id === typeId);

  // Dropping the selected room when it no longer fits the dates/guests keeps the summary honest.
  useEffect(() => {
    if (!room) return;
    if (room.capacity < guests || (availability[room.id] ?? 0) === 0) setTypeId("");
  }, [room, guests, availability]);

  const extrasList = bookingExtras
    .map((e) => ({ extra: e, qty: extras[e.id] ?? 0 }))
    .filter((x) => x.qty > 0);
  const extrasTotal = extrasList.reduce((s, x) => s + extraTotal(x.extra, x.qty, nights), 0);
  const roomTotal = (room?.price ?? 0) * nights;
  const taxes = Math.round((roomTotal + extrasTotal) * TAX_RATE);
  const total = roomTotal + extrasTotal + taxes;

  const goTo = (i: number) => {
    if (i <= maxStep && !confirmed) setStep(i);
  };
  const advance = () => {
    setStep((s) => {
      const nextStep = Math.min(STEPS.length - 1, s + 1);
      setMaxStep((m) => Math.max(m, nextStep));
      return nextStep;
    });
  };

  const validateDates = () => {
    const today = addDays(0);
    if (checkIn < today) {
      toast.error("Check-in cannot be in the past.");
      return false;
    }
    if (checkOut <= checkIn) {
      toast.error("Check-out must be after check-in.");
      return false;
    }
    if (guests < 1 || guests > 6) {
      toast.error("Please enter between 1 and 6 guests.");
      return false;
    }
    return true;
  };

  const continueFromDates = () => {
    if (!validateDates()) return;
    setChecking(true);
    window.setTimeout(() => {
      setChecking(false);
      advance();
    }, 350);
  };

  const confirmBooking = () => {
    if (!room) {
      toast.error("Please select a room.");
      return;
    }
    const parsed = detailsSchema.safeParse(details);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details.");
      setStep(3);
      return;
    }
    if ((availability[room.id] ?? 0) === 0) {
      toast.error("The selected room is no longer available for these dates. Please choose another room.");
      setStep(1);
      return;
    }
    setSubmitting(true);
    const guestName = `${details.firstName.trim()} ${details.lastName.trim()}`;
    const extraLabels = extrasList.map((x) =>
      x.extra.quantifiable ? `${x.extra.label} ×${x.qty}` : x.extra.label,
    );
    const res = createReservation({
      guestName,
      email: details.email.trim(),
      phone: details.phone.trim(),
      country: details.country,
      arrival: details.arrival || undefined,
      roomTypeId: room.id,
      checkIn,
      checkOut,
      guests,
      nights,
      extras: extraLabels,
      extrasTotal,
      taxes,
      total,
      requests: details.requests.trim() || undefined,
      payment: "paid",
    });
    setSubmitting(false);
    if (!res.ok || !res.reservation) {
      toast.error(res.error ?? "We couldn't complete your reservation. Please try again.");
      setStep(1);
      return;
    }
    setConfirmed({
      reference: res.reservation.reference,
      guestName,
      roomName: room.name,
      roomNumber: res.reservation.roomNumber,
      checkIn,
      checkOut,
      guests,
      extras: extraLabels,
      total,
    });
    setMaxStep(5);
    setStep(5);
    toast.success("Reservation confirmed.");
  };

  const downloadConfirmation = () => {
    if (!confirmed) return;
    const lines = [
      HOTEL.name,
      HOTEL.address,
      HOTEL.phone,
      "",
      "RESERVATION CONFIRMED",
      `Reference: ${confirmed.reference}`,
      `Guest: ${confirmed.guestName}`,
      `Room: ${confirmed.roomName}${confirmed.roomNumber ? ` (Room ${confirmed.roomNumber})` : ""}`,
      `Check-in: ${confirmed.checkIn}`,
      `Check-out: ${confirmed.checkOut}`,
      `Guests: ${confirmed.guests}`,
      `Extras: ${confirmed.extras.length ? confirmed.extras.join(", ") : "None"}`,
      `Total: ${money(confirmed.total)}`,
      "Payment: Paid (demo payment mode)",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${confirmed.reference}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const detailRoom = roomTypes.find((r) => r.id === detailsOpen);

  return (
    <div className="pt-28">
      <Section className="py-12">
        <p className="eyebrow text-gold">Reservations</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Book your stay</h1>

        <ol className="mt-10 flex flex-wrap gap-2 text-xs" aria-label="Booking steps">
          {STEPS.map((s, i) => {
            const done = i < step;
            const clickable = i <= maxStep && !confirmed;
            return (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  disabled={!clickable}
                  aria-current={i === step ? "step" : undefined}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-4 py-1.5 tracking-widest uppercase transition-colors",
                    i === step
                      ? "border-gold bg-gold text-gold-foreground"
                      : done
                        ? "border-border bg-secondary text-secondary-foreground hover:border-gold"
                        : "border-border text-muted-foreground",
                    clickable ? "cursor-pointer" : "cursor-not-allowed",
                  )}
                >
                  {done ? <Check className="h-3 w-3" aria-hidden /> : <span>{i + 1}.</span>}
                  {s}
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <div className="rounded-lg border border-border/70 bg-card p-6 sm:p-7">
            {step === 0 ? (
              <div className="space-y-6">
                <h2 className="font-display text-2xl">When would you like to stay?</h2>
                <div className="grid gap-5 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="b-in">Check-in</Label>
                    <Input
                      id="b-in"
                      type="date"
                      value={checkIn}
                      min={addDays(0)}
                      onChange={(e) => {
                        setCheckIn(e.target.value);
                        if (checkOut <= e.target.value) {
                          const d = new Date(e.target.value);
                          d.setDate(d.getDate() + 1);
                          setCheckOut(d.toISOString().slice(0, 10));
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="b-out">Check-out</Label>
                    <Input
                      id="b-out"
                      type="date"
                      value={checkOut}
                      min={checkIn}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="b-guests">Guests</Label>
                    <Input
                      id="b-guests"
                      type="number"
                      min={1}
                      max={6}
                      value={guests}
                      onChange={(e) => setGuests(Math.max(1, Math.min(6, Number(e.target.value) || 1)))}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {nights} night{nights > 1 ? "s" : ""} · {guests} guest{guests > 1 ? "s" : ""}
                </p>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="space-y-5">
                <h2 className="font-display text-2xl">Choose your room</h2>
                {roomTypes.filter((r) => r.capacity >= guests).length === 0 ? (
                  <p className="rounded-md border border-border/70 p-6 text-sm text-muted-foreground">
                    No accommodation sleeps {guests} guests. Please reduce the party size or contact
                    us at {HOTEL.phone} for connecting rooms.
                  </p>
                ) : null}
                <div className="grid gap-4">
                  {roomTypes
                    .filter((r) => r.capacity >= guests)
                    .map((r) => {
                      const free = availability[r.id] ?? 0;
                      const soldOut = free === 0;
                      return (
                        <div
                          key={r.id}
                          className={cn(
                            "grid gap-4 rounded-lg border p-4 sm:grid-cols-[10rem_minmax(0,1fr)]",
                            typeId === r.id ? "border-gold bg-secondary/60" : "border-border",
                            soldOut && "opacity-60",
                          )}
                        >
                          <img
                            src={r.image}
                            alt={`${r.name} at The Splendid Sanctuary`}
                            className="h-28 w-full rounded object-cover sm:h-full"
                            loading="lazy"
                          />
                          <div className="min-w-0 space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="font-display text-xl">{r.name}</h3>
                              <Badge variant={soldOut ? "secondary" : "outline"}>
                                {soldOut ? "Not available for these dates" : `${free} available`}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{r.short}</p>
                            <p className="text-xs text-muted-foreground">
                              {r.size} · {r.bed} · sleeps {r.capacity}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">{money(r.price)}</span> / night ·{" "}
                              {money(r.price * nights)} for {nights} night{nights > 1 ? "s" : ""}
                            </p>
                            <div className="flex flex-wrap gap-2 pt-1">
                              <Button variant="outline" size="sm" onClick={() => setDetailsOpen(r.id)}>
                                View details
                              </Button>
                              <Button
                                size="sm"
                                disabled={soldOut}
                                onClick={() => setTypeId(r.id)}
                                className="tracking-[0.14em] uppercase"
                              >
                                {typeId === r.id ? "Selected" : "Select room"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-5">
                <h2 className="font-display text-2xl">Enhance your stay</h2>
                <ul className="space-y-3">
                  {bookingExtras.map((e) => {
                    const qty = extras[e.id] ?? 0;
                    const selected = qty > 0;
                    return (
                      <li
                        key={e.id}
                        className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-border/70 p-4"
                      >
                        <div className="flex min-w-0 items-start gap-3">
                          <Checkbox
                            id={`x-${e.id}`}
                            checked={selected}
                            onCheckedChange={(c) =>
                              setExtras((prev) => ({ ...prev, [e.id]: c ? 1 : 0 }))
                            }
                          />
                          <div className="min-w-0">
                            <Label htmlFor={`x-${e.id}`} className="cursor-pointer">
                              {e.label}
                            </Label>
                            <p className="mt-1 text-xs text-muted-foreground">{e.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {e.quantifiable && selected ? (
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                aria-label={`Remove one ${e.label}`}
                                onClick={() =>
                                  setExtras((p) => ({ ...p, [e.id]: Math.max(0, qty - 1) }))
                                }
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-6 text-center text-sm">{qty}</span>
                              <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                aria-label={`Add one ${e.label}`}
                                onClick={() =>
                                  setExtras((p) => ({ ...p, [e.id]: Math.min(e.maxQty, qty + 1) }))
                                }
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : null}
                          <span className="text-sm whitespace-nowrap">
                            {money(e.price)}
                            {e.per === "night" ? " / night" : ""}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-5">
                <h2 className="font-display text-2xl">Your details</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="g-first">First name</Label>
                    <Input
                      id="g-first"
                      maxLength={60}
                      autoComplete="given-name"
                      value={details.firstName}
                      onChange={(e) => setDetails({ ...details, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="g-last">Last name</Label>
                    <Input
                      id="g-last"
                      maxLength={60}
                      autoComplete="family-name"
                      value={details.lastName}
                      onChange={(e) => setDetails({ ...details, lastName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="g-email">Email</Label>
                    <Input
                      id="g-email"
                      type="email"
                      maxLength={255}
                      autoComplete="email"
                      value={details.email}
                      onChange={(e) => setDetails({ ...details, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="g-phone">Phone</Label>
                    <Input
                      id="g-phone"
                      maxLength={30}
                      autoComplete="tel"
                      value={details.phone}
                      onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="g-country">Country</Label>
                    <Select
                      value={details.country}
                      onValueChange={(v) => setDetails({ ...details, country: v })}
                    >
                      <SelectTrigger id="g-country">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="g-arrival">Estimated arrival time (optional)</Label>
                    <Input
                      id="g-arrival"
                      type="time"
                      value={details.arrival}
                      onChange={(e) => setDetails({ ...details, arrival: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="g-req">
                      Special requests (birthday, anniversary, late arrival, dietary, accessibility)
                    </Label>
                    <Textarea
                      id="g-req"
                      rows={4}
                      maxLength={500}
                      value={details.requests}
                      onChange={(e) => setDetails({ ...details, requests: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Requests are subject to availability.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {step === 4 ? (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-2xl">Secure payment</h2>
                  <Badge variant="secondary" className="tracking-widest uppercase">
                    Demo payment mode
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  No payment provider is connected to this environment, so no card is charged and no
                  money moves. The reservation is created and marked as settled for demonstration.
                </p>
                <fieldset className="space-y-3">
                  <legend className="eyebrow mb-2">Payment method</legend>
                  {[
                    { id: "card", label: "Card (Visa, Mastercard, Verve)" },
                    { id: "transfer", label: "Bank transfer" },
                    { id: "arrival", label: "Pay on arrival" },
                  ].map((m) => (
                    <label
                      key={m.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-md border p-4 text-sm",
                        method === m.id ? "border-gold bg-secondary/60" : "border-border",
                      )}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={m.id}
                        checked={method === m.id}
                        onChange={() => setMethod(m.id)}
                        className="accent-[var(--gold)]"
                      />
                      {m.label}
                    </label>
                  ))}
                </fieldset>
                <dl className="rounded-md border border-border/70 p-4 text-sm">
                  <div className="flex justify-between">
                    <dt>Amount due</dt>
                    <dd className="font-medium">{money(total)}</dd>
                  </div>
                </dl>
              </div>
            ) : null}

            {step === 5 && confirmed ? (
              <div className="space-y-4 print:text-black">
                <h2 className="font-display text-3xl">Reservation confirmed</h2>
                <p className="text-sm text-muted-foreground">
                  Thank you, {confirmed.guestName}. Keep your reference to manage your stay. No
                  confirmation email is sent in this environment.
                </p>
                <dl className="grid gap-3 rounded-lg border border-border/70 p-5 text-sm sm:grid-cols-2">
                  <div><dt className="eyebrow">Reference</dt><dd className="mt-1 font-medium">{confirmed.reference}</dd></div>
                  <div><dt className="eyebrow">Room</dt><dd className="mt-1">{confirmed.roomName}{confirmed.roomNumber ? ` · Room ${confirmed.roomNumber}` : ""}</dd></div>
                  <div><dt className="eyebrow">Check-in</dt><dd className="mt-1">{confirmed.checkIn}</dd></div>
                  <div><dt className="eyebrow">Check-out</dt><dd className="mt-1">{confirmed.checkOut}</dd></div>
                  <div><dt className="eyebrow">Guests</dt><dd className="mt-1">{confirmed.guests}</dd></div>
                  <div><dt className="eyebrow">Extras</dt><dd className="mt-1">{confirmed.extras.length ? confirmed.extras.join(", ") : "None"}</dd></div>
                  <div><dt className="eyebrow">Total</dt><dd className="mt-1">{money(confirmed.total)}</dd></div>
                  <div><dt className="eyebrow">Payment</dt><dd className="mt-1">Paid · demo mode</dd></div>
                </dl>
                <div className="flex flex-wrap gap-3 print:hidden">
                  <Button asChild className="tracking-[0.18em] uppercase">
                    <Link to="/account">View reservation</Link>
                  </Button>
                  <Button variant="outline" onClick={() => window.print()}>
                    Print confirmation
                  </Button>
                  <Button variant="outline" onClick={downloadConfirmation}>
                    Download confirmation
                  </Button>
                  <Button asChild variant="ghost">
                    <Link to="/">Return to hotel</Link>
                  </Button>
                </div>
              </div>
            ) : null}

            {step < 5 ? (
              <div className="mt-8 flex flex-wrap justify-between gap-3 print:hidden">
                <Button
                  variant="outline"
                  disabled={step === 0}
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                >
                  Back
                </Button>
                {step === 0 ? (
                  <Button onClick={continueFromDates} disabled={checking} className="tracking-[0.18em] uppercase">
                    {checking ? "Checking availability…" : "Continue"}
                  </Button>
                ) : null}
                {step === 1 ? (
                  <Button
                    onClick={() => (room ? advance() : toast.error("Please select a room."))}
                    className="tracking-[0.18em] uppercase"
                  >
                    Continue
                  </Button>
                ) : null}
                {step === 2 ? (
                  <Button onClick={advance} className="tracking-[0.18em] uppercase">
                    Continue
                  </Button>
                ) : null}
                {step === 3 ? (
                  <Button
                    onClick={() => {
                      const parsed = detailsSchema.safeParse(details);
                      if (!parsed.success) {
                        toast.error(parsed.error.issues[0]?.message ?? "Please check your details.");
                        return;
                      }
                      advance();
                    }}
                    className="tracking-[0.18em] uppercase"
                  >
                    Continue
                  </Button>
                ) : null}
                {step === 4 ? (
                  <Button onClick={confirmBooking} disabled={submitting} className="tracking-[0.18em] uppercase">
                    {submitting ? "Confirming…" : "Confirm & pay"}
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>

          <aside className="rounded-lg border border-border/70 bg-secondary/50 p-6 lg:sticky lg:top-28">
            <h2 className="font-display text-2xl">Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt>Check-in</dt><dd>{checkIn}</dd></div>
              <div className="flex justify-between"><dt>Check-out</dt><dd>{checkOut}</dd></div>
              <div className="flex justify-between"><dt>Nights</dt><dd>{nights}</dd></div>
              <div className="flex justify-between"><dt>Guests</dt><dd>{guests}</dd></div>
              <div className="flex justify-between"><dt>Accommodation</dt><dd>{room ? room.name : "—"}</dd></div>
              <div className="flex justify-between"><dt>Room total</dt><dd>{money(roomTotal)}</dd></div>
              {extrasList.length ? (
                <ul className="space-y-1 border-t border-border pt-2 text-xs text-muted-foreground">
                  {extrasList.map((x) => (
                    <li key={x.extra.id} className="flex justify-between gap-3">
                      <span>
                        {x.extra.label}
                        {x.extra.quantifiable ? ` ×${x.qty}` : ""}
                      </span>
                      <span>{money(extraTotal(x.extra, x.qty, nights))}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="flex justify-between"><dt>Extras</dt><dd>{money(extrasTotal)}</dd></div>
              <div className="flex justify-between"><dt>Taxes & fees</dt><dd>{money(taxes)}</dd></div>
              <div className="mt-3 flex justify-between border-t border-border pt-3 font-medium"><dt>Total</dt><dd>{money(total)}</dd></div>
            </dl>
          </aside>
        </div>
      </Section>

      <Dialog open={detailsOpen !== null} onOpenChange={(o) => !o && setDetailsOpen(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          {detailRoom ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-3xl">{detailRoom.name}</DialogTitle>
                <DialogDescription>{detailRoom.short}</DialogDescription>
              </DialogHeader>
              <img
                src={detailRoom.image}
                alt={`${detailRoom.name} interior`}
                className="h-56 w-full rounded object-cover"
                loading="lazy"
              />
              <p className="text-sm text-muted-foreground">{detailRoom.description}</p>
              <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                <div><dt className="eyebrow">Size</dt><dd className="mt-1">{detailRoom.size}</dd></div>
                <div><dt className="eyebrow">Bed</dt><dd className="mt-1">{detailRoom.bed}</dd></div>
                <div><dt className="eyebrow">Sleeps</dt><dd className="mt-1">{detailRoom.capacity}</dd></div>
              </dl>
              <div>
                <p className="eyebrow">Amenities</p>
                <ul className="mt-2 flex flex-wrap gap-2 text-xs">
                  {detailRoom.amenities.map((a: string) => (
                    <li key={a} className="rounded-full border border-border px-3 py-1">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm">
                {money(detailRoom.price)} × {nights} night{nights > 1 ? "s" : ""} ={" "}
                <span className="font-medium">{money(detailRoom.price * nights)}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Check-in from 15:00, check-out by 12:00. Free cancellation up to 48 hours before
                arrival.
              </p>
              <Button
                disabled={(availability[detailRoom.id] ?? 0) === 0}
                onClick={() => {
                  setTypeId(detailRoom.id);
                  setDetailsOpen(null);
                }}
                className="tracking-[0.18em] uppercase"
              >
                Select this room
              </Button>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
