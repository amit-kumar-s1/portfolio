"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";
import type { Profile } from "@/lib/types";

interface Props {
  profile: Profile;
  counts: { projects: number; models: number; posts: number };
}

export default function Hero({ profile, counts }: Props) {
  const surface = useRef<HTMLDivElement>(null);

  // Pointer-driven only: nothing moves unless the visitor moves.
  const track = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const node = surface.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--x", `${event.clientX - rect.left}px`);
    node.style.setProperty("--y", `${event.clientY - rect.top}px`);
  }, []);

  return (
    <section
      onPointerMove={track}
      className="relative overflow-hidden border-b border-line-soft"
    >
      <div ref={surface} className="spotlight pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-5xl px-5 py-24 sm:px-8 sm:py-36">
        <p className="enter text-sm text-muted">
          {profile.name}, {profile.role.toLowerCase()} in {profile.location}
        </p>

        <h1
          className="enter mt-6 max-w-3xl text-4xl font-medium leading-[1.12] sm:text-6xl"
          style={{ animationDelay: "80ms" }}
        >
          {profile.tagline}
        </h1>

        <div
          className="enter mt-10 flex flex-wrap items-center gap-3"
          style={{ animationDelay: "160ms" }}
        >
          <Link
            href="#projects"
            className="rounded-full bg-violet px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet/85"
          >
            See what I&apos;ve built
          </Link>
          <Link
            href="#contact"
            className="rounded-full border border-line px-5 py-2.5 text-sm text-ink transition-colors hover:border-cyan hover:text-cyan"
          >
            Start a conversation
          </Link>
        </div>

        <dl
          className="enter mt-16 flex flex-wrap gap-x-10 gap-y-4 border-t border-line-soft pt-6 text-sm"
          style={{ animationDelay: "240ms" }}
        >
          <div className="flex items-baseline gap-2">
            <dt className="text-muted">Projects</dt>
            <dd className="font-display text-ink">{counts.projects}</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-muted">Models published</dt>
            <dd className="font-display text-ink">{counts.models}</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-muted">Written pieces</dt>
            <dd className="font-display text-ink">{counts.posts}</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-muted">Working on</dt>
            <dd className="text-ink">{profile.focus[0] ?? "new things"}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
