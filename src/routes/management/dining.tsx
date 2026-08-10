import { createFileRoute } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { money } from "@/lib/hotel-data";
import { useHotel } from "@/lib/hotel-store";
import type { OrderStatus } from "@/lib/hotel-data";

export const Route = createFileRoute("/management/dining")({
  component: Dining,
});

const next: Record<OrderStatus, OrderStatus | null> = {
  new: "preparing",
  preparing: "ready",
  ready: "delivered",
  delivered: null,
};

function Dining() {
  const { orders, setOrderStatus, menu } = useHotel();

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-display text-3xl">Kitchen board</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((o) => (
            <div key={o.id} className="rounded-lg border border-border/70 bg-card p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{o.guestName}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.source === "room-service" ? `Room ${o.roomNumber ?? "—"}` : `Table ${o.table ?? "—"}`} · {o.placedAt}
                  </p>
                </div>
                <Badge variant="secondary" className="capitalize">{o.status}</Badge>
              </div>
              <ul className="mt-3 space-y-1 text-sm">
                {o.lines.map((l) => (
                  <li key={l.itemId} className="flex justify-between gap-3">
                    <span className="min-w-0 truncate">{l.qty} × {l.name}</span>
                    <span>{money(l.price * l.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-sm font-medium">{money(o.total)}</span>
                {next[o.status] ? (
                  <Button size="sm" onClick={() => setOrderStatus(o.id, next[o.status]!)}>
                    Mark {next[o.status]}
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl">Menu availability</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-border/70 bg-card">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="border-b border-border/70 text-left text-xs tracking-widest uppercase text-muted-foreground">
              <tr><th className="p-4">Item</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {menu.map((m) => (
                <tr key={m.id}>
                  <td className="p-4">{m.name}</td>
                  <td className="p-4 text-muted-foreground">{m.category}</td>
                  <td className="p-4">{money(m.price)}</td>
                  <td className="p-4">{m.available ? "Available" : "86'd"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
