import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HOTEL } from "@/lib/hotel-data";
import { HotelProvider, useHotel } from "@/lib/hotel-store";

export const Route = createFileRoute("/management")({
  head: () => ({
    meta: [
      { title: "Operations Portal — The Splendid Sanctuary" },
      { name: "description", content: "Staff operations portal for front desk, housekeeping, food & beverage, events and inventory." },
      { property: "og:title", content: "Operations Portal — The Splendid Sanctuary" },
      { property: "og:description", content: "Internal hotel management platform." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ManagementLayout,
});

function ManagementLayout() {
  return (
    <HotelProvider>
      <Gate />
    </HotelProvider>
  );
}

function Gate() {
  const { session, signIn, signOut } = useHotel();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <form
          className="w-full max-w-sm rounded-lg border border-border/70 bg-card p-8"
          onSubmit={(e) => {
            e.preventDefault();
            const res = signIn(email, password);
            if (!res.ok) toast.error(res.error ?? "Unable to sign in.");
            else toast.success("Welcome back.");
          }}
        >
          <p className="eyebrow text-gold">{HOTEL.name}</p>
          <h1 className="mt-2 font-display text-3xl">Operations portal</h1>
          <p className="mt-2 text-xs text-muted-foreground">
            Demo access: any @splendidsanctuary.com email with a 6+ character password.
          </p>
          <div className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="m-email">Staff email</Label>
              <Input id="m-email" type="email" maxLength={255} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="front.desk@splendidsanctuary.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="m-pass">Password</Label>
              <Input id="m-pass" type="password" maxLength={72} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full tracking-[0.18em] uppercase">Sign in</Button>
            <Button asChild variant="ghost" className="w-full"><Link to="/">Back to website</Link></Button>
          </div>
        </form>
      </div>
    );
  }

  const tabs = [
    { to: "/management", label: "Dashboard", exact: true },
    { to: "/management/front-desk", label: "Front desk" },
    { to: "/management/housekeeping", label: "Housekeeping" },
    { to: "/management/dining", label: "Food & beverage" },
    { to: "/management/cellar", label: "Cellar" },
    { to: "/management/events", label: "Events" },
    { to: "/management/inventory", label: "Inventory" },
    { to: "/management/staff", label: "Staff" },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/70 bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4">
          <div className="min-w-0">
            <p className="eyebrow text-gold">Operations</p>
            <h1 className="truncate font-display text-2xl">{HOTEL.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:block">
              {session.name} · {session.role}
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 pb-3 text-xs">
          {tabs.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              activeOptions={{ exact: "exact" in t }}
              className="rounded-full px-4 py-1.5 tracking-widest whitespace-nowrap uppercase text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-gold data-[status=active]:text-gold-foreground"
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8">
        <Outlet />
      </main>
    </div>
  );
}
