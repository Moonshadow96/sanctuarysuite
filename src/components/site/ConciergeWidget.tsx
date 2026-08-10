import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildGuestContext } from "@/lib/ai-context";
import { askConcierge } from "@/lib/ai.functions";
import { useHotel } from "@/lib/hotel-store";
import { cn } from "@/lib/utils";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "Which room is best for two people?",
  "Recommend a wine for dinner.",
  "What can I do at the hotel tonight?",
];

export function ConciergeWidget() {
  const { wines, rooms } = useHotel();
  const ask = useServerFn(askConcierge);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Good day, and welcome to The Splendid Sanctuary. I'm Sanctuary AI, your digital concierge — ask me about rooms, dining, the cellar, facilities or events.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, busy]);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const availableByType: Record<string, number> = {};
      for (const room of rooms) {
        if (room.status === "available") {
          availableByType[room.typeId] = (availableByType[room.typeId] ?? 0) + 1;
        }
      }
      const res = await ask({
        data: {
          messages: next.slice(-10).map((m) => ({ role: m.role, content: m.content })),
          context: buildGuestContext(wines, availableByType),
        },
      });
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch (error) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "I couldn't reach the concierge desk just now. Please try again.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close Sanctuary AI" : "Open Sanctuary AI concierge"}
        aria-expanded={open}
        className="fixed right-5 bottom-5 z-50 h-14 w-14 rounded-full shadow-lg"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </Button>

      {open ? (
        <div className="fixed right-4 bottom-24 z-50 flex h-[min(32rem,70vh)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-border/70 bg-card shadow-2xl">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-b border-border/70 px-5 py-4">
            <Sparkles className="h-4 w-4 shrink-0 text-gold" />
            <div className="min-w-0">
              <p className="truncate font-display text-lg">Sanctuary AI</p>
              <p className="truncate text-[0.65rem] tracking-widest uppercase text-muted-foreground">
                Your digital concierge
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-lg px-4 py-2.5 text-sm whitespace-pre-wrap",
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground",
                )}
              >
                {m.content}
              </div>
            ))}
            {busy ? (
              <p className="text-xs text-muted-foreground" aria-live="polite">
                Sanctuary AI is thinking…
              </p>
            ) : null}
            {messages.length === 1 ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-gold hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : null}
            <div ref={endRef} />
          </div>

          <form
            className="flex items-center gap-2 border-t border-border/70 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <label htmlFor="concierge-input" className="sr-only">
              Ask Sanctuary AI
            </label>
            <Input
              id="concierge-input"
              value={input}
              maxLength={500}
              placeholder="Ask about rooms, dining or wine…"
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit" size="icon" disabled={busy || !input.trim()} aria-label="Send">
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="px-4 pb-3 text-[0.65rem] text-muted-foreground">
            AI responses use live hotel information and may need confirmation by reception.
          </p>
        </div>
      ) : null}
    </>
  );
}
