import { createFileRoute } from "@tanstack/react-router";

import { OpsInsightPanel } from "@/components/management/OpsInsightPanel";
import { money } from "@/lib/hotel-data";
import { useHotel } from "@/lib/hotel-store";

export const Route = createFileRoute("/management/")({
  component: Dashboard,
});

function Dashboard() {
  const { rooms, reservations, orders, events, inventory, notifications, wines } = useHotel();


  const occupied = rooms.filter((r) => r.status === "occupied").length;
  const occupancy = Math.round((occupied / Math.max(1, rooms.length)) * 100);
  const arrivals = reservations.filter((r) => r.status === "confirmed").length;
  const inHouse = reservations.filter((r) => r.status === "checked-in").length;
  const revenue = reservations
    .filter((r) => r.status !== "cancelled")
    .reduce((s, r) => s + r.total, 0);
  const openOrders = orders.filter((o) => o.status !== "delivered").length;
  const lowStock = inventory.filter((i) => i.quantity <= i.reorderAt).length;
  const openEvents = events.filter((e) => e.status === "new" || e.status === "reviewing").length;

  const stats = [
    { label: "Occupancy", value: `${occupancy}%`, note: `${occupied} of ${rooms.length} rooms` },
    { label: "Arrivals due", value: String(arrivals), note: "Confirmed reservations" },
    { label: "In house", value: String(inHouse), note: "Checked-in guests" },
    { label: "Revenue booked", value: money(revenue), note: "All active reservations" },
    { label: "Open orders", value: String(openOrders), note: "Kitchen & room service" },
    { label: "Event enquiries", value: String(openEvents), note: "Awaiting response" },
    { label: "Low stock", value: String(lowStock), note: "Items at reorder level" },
    { label: "Alerts", value: String(notifications.filter((n) => !n.read).length), note: "Unread notifications" },
  ];

  const lowWine = wines.filter((w) => w.quantity <= w.reorderAt);

  const aiContext = [
    `Date: ${new Date().toISOString().slice(0, 10)}`,
    `Occupancy: ${occupancy}% (${occupied} of ${rooms.length} rooms occupied)`,
    `Arrivals due: ${arrivals}. In-house guests: ${inHouse}.`,
    `Revenue booked (active reservations): ${money(revenue)}`,
    `Open food & beverage orders: ${openOrders}`,
    `Open event enquiries: ${openEvents}`,
    `Inventory items at or below reorder level: ${inventory
      .filter((i) => i.quantity <= i.reorderAt)
      .map((i) => `${i.name} (${i.quantity}/${i.reorderAt})`)
      .join(", ") || "none"}`,
    `Cellar bottles at or below reorder level: ${
      lowWine.map((w) => `${w.producer} ${w.vintage} (${w.quantity})`).join(", ") || "none"
    }`,
    `Room status breakdown: ${(["available", "occupied", "cleaning", "maintenance"] as const)
      .map((s) => `${s}: ${rooms.filter((r) => r.status === s).length}`)
      .join(", ")}`,
    `Recent activity: ${notifications.slice(0, 6).map((n) => n.title).join("; ") || "none"}`,
  ].join("\n");

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-display text-3xl">Today at a glance</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg border border-border/70 bg-card p-5">
              <p className="eyebrow text-muted-foreground">{s.label}</p>
              <p className="mt-2 font-display text-3xl">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
            </div>
          ))}
        </div>
      </section>

      <OpsInsightPanel context={aiContext} />

      <section>

        <h2 className="font-display text-2xl">Activity feed</h2>
        <ul className="mt-4 divide-y divide-border/70 rounded-lg border border-border/70 bg-card">
          {notifications.slice(0, 8).map((n) => (
            <li key={n.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 p-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.body}</p>
              </div>
              <span className="text-xs whitespace-nowrap text-muted-foreground">{n.at}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
