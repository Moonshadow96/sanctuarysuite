import { createFileRoute } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { roomTypeById } from "@/lib/hotel-data";
import { useHotel } from "@/lib/hotel-store";

export const Route = createFileRoute("/management/housekeeping")({
  component: Housekeeping,
});

const flows = ["dirty", "cleaning", "inspected", "ready", "maintenance"] as const;

function Housekeeping() {
  const { rooms, setHousekeeping, setRoomStatus } = useHotel();

  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl">Housekeeping</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <div key={room.id} className="rounded-lg border border-border/70 bg-card p-5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <p className="font-display text-2xl">Room {room.number}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {roomTypeById(room.typeId)?.name} · Floor {room.floor}
                </p>
              </div>
              <Badge variant="secondary" className="capitalize">{room.status}</Badge>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Housekeeping: <span className="capitalize">{room.housekeeping}</span>
              {room.assignedTo ? ` · ${room.assignedTo}` : ""}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {flows.map((f) => (
                <Button
                  key={f}
                  size="sm"
                  variant={room.housekeeping === f ? "default" : "outline"}
                  className="capitalize"
                  onClick={() => {
                    setHousekeeping(room.id, f);
                    if (f === "ready") setRoomStatus(room.id, "available");
                    if (f === "cleaning") setRoomStatus(room.id, "cleaning");
                    if (f === "maintenance") setRoomStatus(room.id, "maintenance");
                  }}
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
