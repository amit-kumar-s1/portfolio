import type { ReactNode } from "react";
import type { ModelStatus, ProjectStatus } from "@/lib/types";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-5xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function PageHeader({
  title,
  intro,
}: {
  title: string;
  intro?: string;
}) {
  return (
    <header className="border-b border-line-soft pb-10 pt-14 sm:pt-20">
      <h1 className="text-4xl font-medium sm:text-5xl">{title}</h1>
      {intro ? <p className="mt-4 max-w-2xl text-muted leading-relaxed">{intro}</p> : null}
    </header>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-line-soft bg-surface px-2.5 py-1 text-xs text-muted">
      {children}
    </span>
  );
}

const statusTone: Record<ProjectStatus | ModelStatus, { dot: string; label: string }> = {
  live: { dot: "bg-signal", label: "Live" },
  "in-progress": { dot: "bg-amber", label: "In progress" },
  archived: { dot: "bg-faint", label: "Archived" },
  research: { dot: "bg-cyan", label: "Research" },
  published: { dot: "bg-signal", label: "Published" },
  training: { dot: "bg-amber", label: "Training" },
  experimental: { dot: "bg-cyan", label: "Experimental" },
  deprecated: { dot: "bg-faint", label: "Deprecated" },
};

export function StatusBadge({ status }: { status: ProjectStatus | ModelStatus }) {
  const tone = statusTone[status];
  return (
    <span className="inline-flex items-center gap-2 text-xs text-muted">
      <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} aria-hidden="true" />
      {tone.label}
    </span>
  );
}

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-cyan hover:text-cyan"
    >
      {children}
    </a>
  );
}

/** Shown when the API cannot be reached. Says what happened and what to do. */
export function ApiError({ what }: { what: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-6">
      <p className="text-ink">The {what} could not be loaded.</p>
      <p className="mt-2 text-sm text-muted">
        The content API is not responding. Reload in a moment, or check that the backend is
        running.
      </p>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-dashed border-line py-12 text-center text-sm text-muted">
      {message}
    </p>
  );
}
