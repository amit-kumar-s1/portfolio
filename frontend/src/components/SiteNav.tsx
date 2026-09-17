"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// The whole site lives on one scrolling page now, so every route below is an
// in-page section anchor. The leading "/" makes each link resolve correctly
// from any page (including an individual article at /writing/[slug]).
const routes = [
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/#models", label: "AI models" },
  { href: "/#writing", label: "Writing" },
  { href: "/#achievements", label: "Achievements" },
  { href: "/#contact", label: "Contact" },
];

export default function SiteNav({ name }: { name: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line-soft bg-void/80 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4 sm:px-8"
      >
        <Link href="/" className="font-display text-sm font-medium tracking-tight text-ink">
          {name}
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {routes.map((route) => (
            <li key={route.href}>
              <Link href={route.href} className="text-sm text-muted transition-colors hover:text-ink">
                {route.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="rounded-md border border-line px-3 py-1.5 text-sm text-muted md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open ? (
        <ul id="mobile-menu" className="border-t border-line-soft px-5 pb-4 md:hidden">
          {routes.map((route) => (
            <li key={route.href}>
              <Link
                href={route.href}
                className="block border-b border-line-soft py-3 text-sm text-muted"
              >
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </header>
  );
}
