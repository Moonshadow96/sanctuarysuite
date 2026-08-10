import { createFileRoute } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { money } from "@/lib/hotel-data";
import { useHotel } from "@/lib/hotel-store";
import { wineStockLabel } from "@/lib/wine-data";

export const Route = createFileRoute("/management/cellar")({
  component: CellarManagement,
});

function CellarManagement() {
  const { wines, adjustWineStock } = useHotel();
  const low = wines.filter((w) => w.quantity <= w.reorderAt);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl">Wine cellar</h2>

      {low.length ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-5">
          <p className="eyebrow text-destructive">Low stock</p>
          <p className="mt-2 text-sm">
            {low.map((w) => `${w.producer} ${w.vintage} (${w.quantity})`).join(" · ")}
          </p>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-border/70 bg-card">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="border-b border-border/70 text-left text-xs tracking-widest uppercase text-muted-foreground">
            <tr>
              <th className="p-4">Wine</th>
              <th className="p-4">Region</th>
              <th className="p-4">Bottle</th>
              <th className="p-4">Cost</th>
              <th className="p-4">Sell</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Storage</th>
              <th className="p-4">Supplier</th>
              <th className="p-4">Adjust</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {wines.map((w) => {
              const stock = wineStockLabel(w.quantity, w.reorderAt);
              return (
                <tr key={w.id}>
                  <td className="p-4">
                    <div className="font-medium">{w.producer}</div>
                    <div className="text-xs text-muted-foreground">
                      {w.name} · {w.vintage}
                      {w.collector ? " · Collector" : ""}
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{w.region}</td>
                  <td className="p-4">{w.bottleSize}</td>
                  <td className="p-4">{money(w.costPrice)}</td>
                  <td className="p-4">{money(w.price)}</td>
                  <td className="p-4">
                    <Badge variant={stock === "In stock" ? "secondary" : "outline"}>
                      {w.quantity} · {stock}
                    </Badge>
                  </td>
                  <td className="p-4 text-muted-foreground">{w.storage}</td>
                  <td className="p-4 text-muted-foreground">{w.supplier}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => adjustWineStock(w.id, -1)}>−</Button>
                      <Button size="sm" variant="outline" onClick={() => adjustWineStock(w.id, 1)}>+</Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
