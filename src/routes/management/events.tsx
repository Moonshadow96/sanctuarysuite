import { createFileRoute } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useHotel } from "@/lib/hotel-store";
import type { EventStatus } from "@/lib/hotel-data";

export const Route = createFileRoute("/management/events")({
  component: EventsBoard,
});

const statuses: EventStatus[] = ["new", "reviewing", "confirmed", "completed", "cancelled"];

function EventsBoard() {
  const { events, setEventStatus, facilityBookings } = useHotel();

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-display text-3xl">Event enquiries</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {events.map((e) => (
            <div key={e.id} className="rounded-lg border border-border/70 bg-card p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{e.client}</p>
                  <p className="text-xs text-muted-foreground">{e.type} · {e.date} · {e.guests} guests</p>
                </div>
                <Badge variant="secondary" className="capitalize">{e.status}</Badge>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {e.space} · {e.catering}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{e.email} · {e.phone}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {statuses.map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={e.status === s ? "default" : "outline"}
                    className="capitalize"
                    onClick={() => setEventStatus(e.id, s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl">Facility bookings</h2>
        <ul className="mt-4 divide-y divide-border/70 rounded-lg border border-border/70 bg-card">
          {facilityBookings.map((f) => (
            <li key={f.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 p-4 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium">{f.facility}</p>
                <p className="text-xs text-muted-foreground">
                  {f.guestName}{f.roomNumber ? ` · Room ${f.roomNumber}` : ""}
                </p>
              </div>
              <span className="text-xs whitespace-nowrap text-muted-foreground">{f.date} · {f.slot}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
