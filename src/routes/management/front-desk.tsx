import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { money, roomTypeById } from "@/lib/hotel-data";
import { useHotel } from "@/lib/hotel-store";

export const Route = createFileRoute("/management/front-desk")({
  component: FrontDesk,
});

function FrontDesk() {
  const { reservations, rooms, checkIn, checkOut, cancelReservation, assignRoom } = useHotel();

  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl">Front desk</h2>
      <div className="overflow-x-auto rounded-lg border border-border/70 bg-card">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-border/70 text-left text-xs tracking-widest uppercase text-muted-foreground">
            <tr>
              <th className="p-4">Guest</th>
              <th className="p-4">Room</th>
              <th className="p-4">Dates</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {reservations.map((r) => (
              <tr key={r.id}>
                <td className="p-4">
                  <div className="font-medium">{r.guestName}</div>
                  <div className="text-xs text-muted-foreground">{r.reference}</div>
                </td>
                <td className="p-4">
                  <div>{roomTypeById(r.roomTypeId)?.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.roomNumber ? `Room ${r.roomNumber}` : "Unassigned"}
                  </div>
                </td>
                <td className="p-4 whitespace-nowrap">{r.checkIn} → {r.checkOut}</td>
                <td className="p-4 whitespace-nowrap">{money(r.total)}</td>
                <td className="p-4"><Badge variant="secondary" className="capitalize">{r.status}</Badge></td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {!r.roomNumber ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const free = rooms.find(
                            (room) => room.typeId === r.roomTypeId && room.status === "available",
                          );
                          if (!free) {
                            toast.error("No available room of this type.");
                            return;
                          }
                          assignRoom(r.id, free.number);
                          toast.success(`Room ${free.number} assigned.`);
                        }}
                      >
                        Assign room
                      </Button>
                    ) : null}
                    {r.status === "confirmed" ? (
                      <Button size="sm" onClick={() => checkIn(r.id)}>Check in</Button>
                    ) : null}
                    {r.status === "checked-in" ? (
                      <Button size="sm" onClick={() => checkOut(r.id)}>Check out</Button>
                    ) : null}
                    {r.status === "confirmed" || r.status === "pending" ? (
                      <Button size="sm" variant="ghost" onClick={() => cancelReservation(r.id)}>
                        Cancel
                      </Button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
