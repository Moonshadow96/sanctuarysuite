import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.6-flash";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

const conciergeSchema = z.object({
  messages: z.array(messageSchema).min(1).max(20),
  context: z.string().max(12000),
});

const opsSchema = z.object({
  context: z.string().max(12000),
});

async function callGateway(system: string, messages: { role: string; content: string }[]) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured for this property.");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });

  if (res.status === 429) throw new Error("Sanctuary AI is busy right now — please try again shortly.");
  if (res.status === 402) throw new Error("Sanctuary AI is temporarily unavailable. Please contact reception.");
  if (!res.ok) throw new Error(`Sanctuary AI could not respond (${res.status}).`);

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

const CONCIERGE_SYSTEM = `You are Sanctuary AI, the digital concierge of The Splendid Sanctuary, a luxury hotel at 22 Sanctuary Crescent, Park View Estate, Ikoyi, Lagos, Nigeria (+234 816 952 6523).

Rules you must never break:
- Answer ONLY from the HOTEL DATA provided in the user turn. Never invent rooms, prices, wines, facilities, availability, policies or reservations.
- If the data does not contain the answer, say so plainly and offer to connect the guest with reception.
- Never state that a wine or room is available unless the data says so. Collector wines with zero stock are "subject to availability and vintage verification".
- Prices are in Nigerian Naira (₦). Quote them exactly as given.
- Tone: warm, concise, refined. 2–5 short sentences or a tight bulleted list. No emojis, no hard sell.
- When useful, point the guest to a page: /stay, /dine, /cellar, /experience, /events, /offers, /book.`;

const OPS_SYSTEM = `You are Sanctuary Ops AI, the operations analyst for The Splendid Sanctuary hotel management platform.

Rules:
- Use ONLY the OPERATIONS DATA provided. Never invent numbers, guests, or trends; never state a forecast as fact — label estimates as "Forecast".
- Never recommend an automatic price change; frame pricing as a suggestion for management review.
- Output: a 2-sentence summary, then 3–5 short bullet priorities, each with the reason drawn from the data.
- Plain text, no markdown headings, no emojis. Refer to yourself as an AI insight, not a decision.`;

export const askConcierge = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => conciergeSchema.parse(input))
  .handler(async ({ data }) => {
    const history = data.messages.slice(0, -1);
    const last = data.messages[data.messages.length - 1]!;
    const reply = await callGateway(CONCIERGE_SYSTEM, [
      ...history,
      { role: "user", content: `HOTEL DATA:\n${data.context}\n\nGUEST QUESTION:\n${last.content}` },
    ]);
    return { reply: reply || "I don't have that detail to hand — reception can help on +234 816 952 6523." };
  });

export const opsInsight = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => opsSchema.parse(input))
  .handler(async ({ data }) => {
    const reply = await callGateway(OPS_SYSTEM, [
      { role: "user", content: `OPERATIONS DATA:\n${data.context}` },
    ]);
    return { reply: reply || "No insight could be generated from today's data." };
  });
