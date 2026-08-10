import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { HOTEL } from "@/lib/hotel-data";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/stay", label: "Stay" },
  { to: "/dine", label: "Dine" },
  { to: "/experience", label: "Experience" },
  { to: "/events", label: "Events" },
  { to: "/offers", label: "Offers" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" className="group flex flex-col leading-none" aria-label={`${HOTEL.name} home`}>
      <span
        className={cn(
          "font-display text-lg tracking-[0.22em] uppercase sm:text-xl",
          inverted ? "text-primary-foreground" : "text-foreground",
        )}
      >
        Splendid
      </span>
      <span className="eyebrow mt-1 text-gold">Sanctuary</span>
    </Link>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "bg-background/95 shadow-soft backdrop-blur" : "bg-background/70 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-8">
          <Logo />
          <nav className="hidden min-w-0 items-center gap-6 xl:flex" aria-label="Main">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "text-foreground after:w-full" }}
                className="relative text-[0.8rem] font-medium tracking-wide text-muted-foreground uppercase transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all hover:text-foreground hover:after:w-full"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button asChild variant="ghost" className="hidden text-xs tracking-widest uppercase lg:inline-flex">
            <Link to="/account">My stay</Link>
          </Button>
          <Button asChild className="hidden text-xs tracking-[0.18em] uppercase sm:inline-flex">
            <Link to="/book">Book your stay</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="xl:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex h-full flex-col gap-8 p-6">
                <div className="flex items-center justify-between">
                  <Logo />
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close menu">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="flex flex-col gap-1" aria-label="Mobile">
                  {links.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className="border-b border-border/60 py-3 font-display text-2xl text-foreground"
                    >
                      {l.label}
                    </Link>
                  ))}
                  <Link
                    to="/account"
                    onClick={() => setOpen(false)}
                    className="border-b border-border/60 py-3 font-display text-2xl text-foreground"
                  >
                    My Stay
                  </Link>
                </nav>
                <Button asChild className="mt-auto w-full tracking-[0.18em] uppercase">
                  <Link to="/book" onClick={() => setOpen(false)}>
                    Book your stay
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
