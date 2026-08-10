import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
  invert = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
  invert?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        invert && "text-primary-foreground",
        className,
      )}
    >
      {eyebrow ? <p className={cn("eyebrow", invert && "text-gold")}>{eyebrow}</p> : null}
      <h2
        className={cn(
          "mt-3 font-display text-3xl leading-[1.1] text-balance sm:text-4xl lg:text-5xl",
          invert && "text-primary-foreground",
        )}
      >
        {title}
      </h2>
      {copy ? (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed text-muted-foreground",
            invert && "text-primary-foreground/70",
          )}
        >
          {copy}
        </p>
      ) : null}
    </div>
  );
}

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("px-4 py-20 sm:px-6 lg:px-8 lg:py-28", className)}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function PageHero({
  eyebrow,
  title,
  copy,
  image,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  image: string;
}) {
  return (
    <section className="relative isolate flex min-h-[52vh] items-end overflow-hidden pt-28 pb-14">
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/50 to-ink/25" />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow text-gold">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl text-balance text-primary-foreground sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {copy ? <p className="mt-4 max-w-xl text-primary-foreground/80">{copy}</p> : null}
      </div>
    </section>
  );
}
