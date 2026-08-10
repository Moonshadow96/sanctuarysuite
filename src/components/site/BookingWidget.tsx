import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { roomTypes } from "@/lib/hotel-data";
import { cn } from "@/lib/utils";

const addDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export function BookingWidget({ className }: { className?: string }) {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState(addDays(1));
  const [checkOut, setCheckOut] = useState(addDays(3));
  const [guests, setGuests] = useState("2");
  const [type, setType] = useState("any");

  return (
    <form
      className={cn(
        "grid gap-4 rounded-lg border border-border/70 bg-card/95 p-5 shadow-lift backdrop-blur sm:grid-cols-2 lg:grid-cols-5 lg:items-end",
        className,
      )}
      onSubmit={(e) => {
        e.preventDefault();
        if (new Date(checkOut) <= new Date(checkIn)) {
          toast.error("Check-out must be after check-in.");
          return;
        }
        void navigate({
          to: "/book",
          search: { checkIn, checkOut, guests: Number(guests), type },
        });
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="bw-in" className="eyebrow">
          Check-in
        </Label>
        <Input id="bw-in" type="date" value={checkIn} min={addDays(0)} onChange={(e) => setCheckIn(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="bw-out" className="eyebrow">
          Check-out
        </Label>
        <Input id="bw-out" type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="bw-guests" className="eyebrow">
          Guests
        </Label>
        <Select value={guests} onValueChange={setGuests}>
          <SelectTrigger id="bw-guests">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n} {n === 1 ? "guest" : "guests"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="bw-type" className="eyebrow">
          Accommodation
        </Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger id="bw-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any accommodation</SelectItem>
            {roomTypes.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="h-10 w-full tracking-[0.16em] uppercase">
        Search availability
      </Button>
    </form>
  );
}
