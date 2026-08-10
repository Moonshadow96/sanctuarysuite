import { createFileRoute } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { useHotel } from "@/lib/hotel-store";

export const Route = createFileRoute("/management/staff")({
  component: Staff,
});

function Staff() {
  const { staff } = useHotel();

  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl">Staff & rotas</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {staff.map((s) => (
          <div key={s.id} className="rounded-lg border border-border/70 bg-card p-5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium">{s.name}</p>
                <p className="truncate text-xs text-muted-foreground">{s.role} · {s.department}</p>
              </div>
              <Badge variant="secondary" className="capitalize">{s.status}</Badge>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Shift: {s.shift}</p>
            <p className="text-xs text-muted-foreground">{s.contact}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
