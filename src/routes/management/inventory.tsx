import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { money } from "@/lib/hotel-data";
import { useHotel } from "@/lib/hotel-store";

export const Route = createFileRoute("/management/inventory")({
  component: Inventory,
});

function Inventory() {
  const { inventory, adjustInventory } = useHotel();

  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl">Inventory & supplies</h2>
      <div className="overflow-x-auto rounded-lg border border-border/70 bg-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-border/70 text-left text-xs tracking-widest uppercase text-muted-foreground">
            <tr>
              <th className="p-4">Item</th>
              <th className="p-4">Category</th>
              <th className="p-4">Quantity</th>
              <th className="p-4">Unit price</th>
              <th className="p-4">Supplier</th>
              <th className="p-4">Adjust</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {inventory.map((i) => (
              <tr key={i.id} className={i.quantity <= i.reorderAt ? "bg-destructive/5" : undefined}>
                <td className="p-4">{i.name}</td>
                <td className="p-4 text-muted-foreground">{i.category}</td>
                <td className="p-4">
                  {i.quantity}
                  {i.quantity <= i.reorderAt ? (
                    <span className="ml-2 text-xs text-destructive">reorder</span>
                  ) : null}
                </td>
                <td className="p-4">{money(i.unitPrice)}</td>
                <td className="p-4 text-muted-foreground">{i.supplier}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => adjustInventory(i.id, -1)}>−</Button>
                    <Button size="sm" variant="outline" onClick={() => adjustInventory(i.id, 1)}>+</Button>
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
