import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Section, SectionHeading } from "@/components/site/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { money } from "@/lib/hotel-data";
import { useHotel } from "@/lib/hotel-store";
import { wineRegions, wineStockLabel, type Wine } from "@/lib/wine-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/cellar")({
  head: () => ({
    meta: [
      { title: "The Sanctuary Cellar — Fine Wine in Ikoyi, Lagos" },
      {
        name: "description",
        content:
          "A curated collection from Bordeaux, Burgundy, Piedmont, Tuscany, Champagne and Napa Valley, poured at The Splendid Sanctuary.",
      },
      { property: "og:title", content: "The Sanctuary Cellar — The Splendid Sanctuary" },
      {
        property: "og:description",
        content: "Curated fine wine from the world's most celebrated regions, served in Ikoyi, Lagos.",
      },
    ],
  }),
  component: CellarPage,
});

const filters = [
  "All",
  "Bordeaux",
  "Burgundy",
  "Piedmont",
  "Tuscany",
  "Champagne",
  "Napa Valley",
  "Old World",
  "New World",
  "Sommelier's Selection",
  "Collector's Cellar",
] as const;

function CellarPage() {
  const { wines, orderWine, reservations, guestReference } = useHotel();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [selected, setSelected] = useState<Wine | null>(null);
  const [qty, setQty] = useState(1);
  const [guestName, setGuestName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  const activeReservation = useMemo(
    () =>
      reservations.find((r) => r.reference === guestReference && r.status === "checked-in") ??
      reservations.find((r) => r.status === "checked-in" && r.reference === guestReference),
    [reservations, guestReference],
  );

  const shown = wines.filter((w) => {
    if (filter === "All") return true;
    if (w.region === filter) return true;
    return (w.collections as string[]).includes(filter);
  });

  const openWine = (wine: Wine) => {
    setSelected(wine);
    setQty(1);
    setGuestName(activeReservation?.guestName ?? "");
    setRoomNumber(activeReservation?.roomNumber ?? "");
  };

  return (
    <div className="pt-28">
      <Section className="py-12">
        <p className="eyebrow text-gold">The Sanctuary Cellar</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl sm:text-5xl">
          A curated collection from some of the world's most celebrated wine regions
        </h1>
        <p className="mt-5 max-w-2xl text-muted-foreground">
          Our sommelier keeps a deliberately small, deeply considered list. Every bottle below reflects
          the cellar as it stands today — what is poured, what is running low, and what is held as a
          collector's selection.
        </p>
      </Section>

      <Section className="py-4">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs tracking-widest uppercase transition-colors",
                filter === f
                  ? "border-gold bg-gold text-gold-foreground"
                  : "border-border text-muted-foreground hover:border-gold/60 hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </Section>

      <Section className="py-10">
        {shown.length === 0 ? (
          <p className="text-sm text-muted-foreground">No bottles match this selection today.</p>
        ) : (
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((w) => {
              const stock = wineStockLabel(w.quantity, w.reorderAt);
              return (
                <li key={w.id}>
                  <article className="flex h-full flex-col rounded-lg border border-border/70 bg-card p-6">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                      <div className="min-w-0">
                        <p className="eyebrow text-gold">{w.region}</p>
                        <h2 className="mt-2 font-display text-2xl leading-tight">{w.producer}</h2>
                        <p className="text-sm text-muted-foreground">
                          {w.name} · {w.vintage}
                        </p>
                      </div>
                      <Badge variant={stock === "In stock" ? "secondary" : "outline"}>{stock}</Badge>
                    </div>
                    <p className="mt-4 flex-1 text-sm text-muted-foreground">{w.tasting}</p>
                    {w.collector ? (
                      <p className="mt-3 text-xs text-gold">
                        Collector's selection — subject to availability and vintage verification.
                      </p>
                    ) : null}
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span className="text-sm">{money(w.price)}</span>
                      <Button size="sm" variant="outline" onClick={() => openWine(w)}>
                        View bottle
                      </Button>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <Section className="py-14">
        <SectionHeading
          eyebrow="Regions"
          title="How the cellar is organised"
          copy="Six houses of the list, each chosen for the table rather than the label."
        />
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {wineRegions.map((r) => (
            <li key={r.region} className="rounded-lg border border-border/70 p-6">
              <p className="font-display text-2xl">{r.region}</p>
              <p className="mt-2 text-sm text-muted-foreground">{r.blurb}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">
                  {selected.producer} {selected.vintage}
                </DialogTitle>
                <DialogDescription>
                  {selected.name} · {selected.region}, {selected.country}
                </DialogDescription>
              </DialogHeader>

              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div><dt className="eyebrow">Grape</dt><dd className="mt-1">{selected.grape}</dd></div>
                <div><dt className="eyebrow">Bottle</dt><dd className="mt-1">{selected.bottleSize}</dd></div>
                <div><dt className="eyebrow">Price</dt><dd className="mt-1">{money(selected.price)}</dd></div>
                <div>
                  <dt className="eyebrow">Availability</dt>
                  <dd className="mt-1">
                    {wineStockLabel(selected.quantity, selected.reorderAt)} · {selected.quantity} bottle(s)
                  </dd>
                </div>
                <div className="col-span-2"><dt className="eyebrow">Tasting profile</dt><dd className="mt-1 text-muted-foreground">{selected.tasting}</dd></div>
                <div className="col-span-2"><dt className="eyebrow">Food pairing</dt><dd className="mt-1 text-muted-foreground">{selected.pairing}</dd></div>
                <div className="col-span-2"><dt className="eyebrow">Sommelier notes</dt><dd className="mt-1 text-muted-foreground">{selected.sommelier}</dd></div>
                <div className="col-span-2"><dt className="eyebrow">Storage</dt><dd className="mt-1 text-muted-foreground">{selected.storage}</dd></div>
              </dl>

              {selected.quantity > 0 ? (
                <form
                  className="mt-2 grid gap-4 border-t border-border/70 pt-5 sm:grid-cols-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!guestName.trim()) {
                      toast.error("Please enter the guest name.");
                      return;
                    }
                    const res = orderWine({
                      wineId: selected.id,
                      qty,
                      guestName: guestName.trim(),
                      roomNumber: roomNumber.trim() || undefined,
                    });
                    if (!res.ok) {
                      toast.error(res.error ?? "That bottle could not be reserved.");
                      return;
                    }
                    toast.success("The sommelier has been notified.");
                    setSelected(null);
                  }}
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="w-name">Guest name</Label>
                    <Input id="w-name" maxLength={100} value={guestName} onChange={(e) => setGuestName(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="w-room">Room (optional)</Label>
                    <Input id="w-room" maxLength={10} value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="w-qty">Bottles</Label>
                    <Input
                      id="w-qty"
                      type="number"
                      min={1}
                      max={selected.quantity}
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, Math.min(selected.quantity, Number(e.target.value))))}
                    />
                  </div>
                  <Button type="submit" className="sm:col-span-3 tracking-[0.18em] uppercase">
                    Request this bottle
                  </Button>
                  <p className="text-xs text-muted-foreground sm:col-span-3">
                    In-house guests are charged to the room folio; otherwise the sommelier will confirm with you.
                  </p>
                </form>
              ) : (
                <p className="border-t border-border/70 pt-5 text-sm text-muted-foreground">
                  Not currently in the cellar. Collector's selections are subject to availability and
                  vintage verification — the sommelier can advise on sourcing.
                </p>
              )}
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
