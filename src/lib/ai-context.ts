import { HOTEL, menuItems, money, roomTypes } from "@/lib/hotel-data";
import type { Wine } from "@/lib/wine-data";
import { wineStockLabel } from "@/lib/wine-data";

/** Builds the grounding context handed to Sanctuary AI. Never include guest PII. */
export function buildGuestContext(wines: Wine[], availableByType: Record<string, number>) {
  const rooms = roomTypes
    .map(
      (r) =>
        `- ${r.name} (${r.slug}): ${money(r.price)}/night, sleeps ${r.capacity}, ${r.size}, ${r.bed}. ${r.short} Amenities: ${r.amenities.join(", ")}. Rooms free tonight: ${availableByType[r.id] ?? 0}.`,
    )
    .join("\n");

  const menu = menuItems
    .map((m) => `- ${m.name} (${m.category}) ${money(m.price)} — ${m.description}${m.available ? "" : " [unavailable]"}`)
    .join("\n");

  const cellar = wines
    .map(
      (w) =>
        `- ${w.producer} ${w.name} ${w.vintage} · ${w.region}, ${w.country} · ${w.grape} · ${w.bottleSize} · ${money(w.price)} · ${wineStockLabel(w.quantity, w.reorderAt)} (${w.quantity} bottles)${w.collector ? " [Collector's selection — subject to availability and vintage verification]" : ""}. Pairing: ${w.pairing}. Tasting: ${w.tasting}.`,
    )
    .join("\n");

  return `HOTEL: ${HOTEL.name} — ${HOTEL.tagline}
ADDRESS: ${HOTEL.address}
PHONE: ${HOTEL.phone} · EMAIL: ${HOTEL.email}
HOURS: ${HOTEL.hours}

ACCOMMODATION:
${rooms}

RESTAURANT MENU:
${menu}

THE SANCTUARY CELLAR:
${cellar}

FACILITIES: Swimming pool (07:00–21:00), Snooker lounge (12:00–23:00, ${money(8000)}/hour), Table tennis (09:00–21:00, complimentary), Fitness & wellness studio (06:00–22:00, complimentary for in-house guests).
EVENTS: Weddings, corporate events, private celebrations, meetings, social gatherings and executive functions — enquiries via /events.
PAGES: /stay, /dine, /cellar, /experience, /events, /offers, /gallery, /about, /contact, /book.`;
}
