import { Link } from "@tanstack/react-router";
import { BedDouble, Maximize, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { money, type RoomType } from "@/lib/hotel-data";

export function RoomCard({ room }: { room: RoomType }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border/70 bg-card shadow-soft transition-shadow hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={room.image}
          alt={`${room.name} at The Splendid Sanctuary`}
          loading="lazy"
          width={1200}
          height={900}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl">{room.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{room.short}</p>

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-gold" /> Up to {room.capacity}
          </li>
          <li className="flex items-center gap-1.5">
            <BedDouble className="h-3.5 w-3.5 text-gold" /> {room.bed}
          </li>
          <li className="flex items-center gap-1.5">
            <Maximize className="h-3.5 w-3.5 text-gold" /> {room.size}
          </li>
        </ul>

        <ul className="mt-4 flex flex-wrap gap-2">
          {room.amenities.slice(0, 4).map((a) => (
            <li key={a} className="rounded-full bg-secondary px-3 py-1 text-[0.7rem] text-secondary-foreground">
              {a}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-border/70 pt-5">
          <p className="text-sm text-muted-foreground">
            <span className="font-display text-2xl text-foreground">{money(room.price)}</span> / night
          </p>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="text-[0.7rem] tracking-widest uppercase">
              <Link to="/stay/$slug" params={{ slug: room.slug }}>
                View
              </Link>
            </Button>
            <Button asChild size="sm" className="text-[0.7rem] tracking-widest uppercase">
              <Link to="/book" search={{ type: room.id }}>
                Book now
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
