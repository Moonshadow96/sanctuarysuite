import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HOTEL, images, menuItems, money } from "@/lib/hotel-data";
import { useHotel } from "@/lib/hotel-store";

export const Route = createFileRoute("/_site/dine")({
  head: () => ({
    meta: [
      { title: "Dining & Room Service — The Splendid Sanctuary" },
      {
        name: "description",
        content:
          "The Sanctuary Restaurant, Lounge and cellar. Browse the menu and order room service during your stay.",
      },
      { property: "og:title", content: "Dine, Unwind & Indulge — The Splendid Sanctuary" },
      { property: "og:description", content: "Restaurant, lounge, wine and beverages at the Sanctuary." },
    ],
  }),
  component: DinePage,
});

function DinePage() {
  const { placeOrder, rooms } = useHotel();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [roomNumber, setRoomNumber] = useState("");
  const [guestName, setGuestName] = useState("");

  const lines = menuItems
    .filter((m) => cart[m.id])
    .map((m) => ({ itemId: m.id, name: m.name, qty: cart[m.id] as number, price: m.price }));
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);

  const add = (id: string, delta: number) =>
    setCart((c) => {
      const next = Math.max(0, (c[id] ?? 0) + delta);
      const copy = { ...c };
      if (next === 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });

  const submit = () => {
    if (!lines.length) return toast.error("Add at least one item to your order.");
    if (!guestName.trim()) return toast.error("Please enter the guest name.");
    if (!rooms.some((r) => r.number === roomNumber.trim())) {
      return toast.error("Enter a valid room number (e.g. 102).");
    }
    placeOrder({ source: "room-service", roomNumber: roomNumber.trim(), guestName: guestName.trim(), lines });
    setCart({});
    toast.success("Order sent to the kitchen — it will appear on your room bill.");
  };

  return (
    <>
      <PageHero
        eyebrow="Dining"
        title="Dine, unwind & indulge"
        copy="From delicious meals to relaxed evenings, every dining experience at The Splendid Sanctuary is designed to be enjoyed."
        image={images.welcome}
      />

      <Section>
        <div className="grid gap-8 lg:grid-cols-3">
          {[
            { name: "The Sanctuary Restaurant", copy: "Breakfast, lunch and dinner in a calm, light-filled dining room.", meta: "07:00 – 23:00 daily" },
            { name: "The Sanctuary Lounge", copy: "Comfortable seating, coffee, conversation and unhurried evenings.", meta: "10:00 – 00:00 daily" },
            { name: "Wine & Beverages", copy: "A curated cellar alongside signature mocktails, juices and refreshments.", meta: "Available with any meal" },
          ].map((d) => (
            <article key={d.name} className="rounded-lg border border-border/70 bg-card p-7">
              <h2 className="font-display text-2xl">{d.name}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{d.copy}</p>
              <p className="eyebrow mt-5 text-gold">{d.meta}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-secondary/50">
        <SectionHeading eyebrow="Menu & room service" title="Order to your room" copy="Select your items, tell us your room and we will deliver. Charges are added to your room bill automatically." />
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-8">
            {["Breakfast", "Mains", "Small Plates", "Desserts", "Beverages"].map((cat) => (
              <div key={cat}>
                <h3 className="eyebrow text-gold">{cat}</h3>
                <ul className="mt-3 divide-y divide-border/70 rounded-lg border border-border/70 bg-card">
                  {menuItems
                    .filter((m) => m.category === cat)
                    .map((m) => (
                      <li key={m.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-4">
                        <div className="min-w-0">
                          <p className="font-medium">{m.name}</p>
                          <p className="text-xs text-muted-foreground">{m.description}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <span className="text-sm">{money(m.price)}</span>
                          <div className="flex items-center gap-1">
                            <Button type="button" size="icon" variant="outline" className="h-8 w-8" onClick={() => add(m.id, -1)} aria-label={`Remove one ${m.name}`}>
                              −
                            </Button>
                            <span className="w-6 text-center text-sm">{cart[m.id] ?? 0}</span>
                            <Button type="button" size="icon" variant="outline" className="h-8 w-8" onClick={() => add(m.id, 1)} aria-label={`Add one ${m.name}`}>
                              +
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-lg border border-border/70 bg-card p-6">
              <h3 className="font-display text-2xl">Your order</h3>
              {lines.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">No items selected yet.</p>
              ) : (
                <ul className="mt-4 space-y-2 text-sm">
                  {lines.map((l) => (
                    <li key={l.itemId} className="flex justify-between gap-3">
                      <span className="min-w-0 truncate">
                        {l.qty} × {l.name}
                      </span>
                      <span>{money(l.qty * l.price)}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4 flex justify-between border-t border-border/70 pt-4 font-medium">
                <span>Total</span>
                <span>{money(total)}</span>
              </div>
              <div className="mt-5 space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="rs-name">Guest name</Label>
                  <Input id="rs-name" value={guestName} maxLength={100} onChange={(e) => setGuestName(e.target.value)} placeholder="Adaeze Okonkwo" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rs-room">Room number</Label>
                  <Input id="rs-room" value={roomNumber} maxLength={5} onChange={(e) => setRoomNumber(e.target.value)} placeholder="102" />
                </div>
              </div>
              <Button className="mt-5 w-full tracking-[0.18em] uppercase" onClick={submit}>
                Submit request
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                Questions? Call reception on {HOTEL.phone}.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
