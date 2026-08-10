import { Sparkles } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { opsInsight } from "@/lib/ai.functions";

export function OpsInsightPanel({ context }: { context: string }) {
  const run = useServerFn(opsInsight);
  const [busy, setBusy] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await run({ data: { context } });
      setInsight(res.reply);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Insight could not be generated.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-lg border border-border/70 bg-card p-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="min-w-0">
          <p className="eyebrow flex items-center gap-2 text-gold">
            <Sparkles className="h-3.5 w-3.5" /> Sanctuary Ops AI
          </p>
          <h2 className="mt-2 font-display text-2xl">Operational insight</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A read of today's occupancy, orders, cellar and stock position. Suggestions only — every
            action stays with management.
          </p>
        </div>
        <Button onClick={() => void generate()} disabled={busy} variant="outline">
          {busy ? "Analysing…" : insight ? "Refresh" : "Generate insight"}
        </Button>
      </div>

      {error ? <p className="mt-5 text-sm text-destructive">{error}</p> : null}
      {insight ? (
        <p className="mt-5 text-sm whitespace-pre-wrap text-muted-foreground">{insight}</p>
      ) : null}
    </section>
  );
}
