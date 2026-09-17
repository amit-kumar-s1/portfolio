"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/types";
import { EmptyState, ExternalLink, StatusBadge, Tag } from "./ui";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group border-b border-line-soft py-8 first:border-t first:border-line-soft">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h3 className="font-display text-xl text-ink">{project.title}</h3>
        <div className="flex items-center gap-4">
          <StatusBadge status={project.status} />
          {project.year ? <span className="text-xs text-faint">{project.year}</span> : null}
        </div>
      </div>

      <p className="mt-3 max-w-2xl text-muted leading-relaxed">{project.summary}</p>

      <details className="mt-3 max-w-2xl">
        <summary className="cursor-pointer text-sm text-cyan/90 hover:text-cyan">
          More about this
        </summary>
        <p className="mt-3 text-sm leading-relaxed text-muted">{project.description}</p>
      </details>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {project.tech.map((item) => (
          <Tag key={item}>{item}</Tag>
        ))}
      </div>

      {project.repo_url || project.demo_url ? (
        <div className="mt-5 flex flex-wrap gap-6">
          {project.repo_url ? <ExternalLink href={project.repo_url}>Source code</ExternalLink> : null}
          {project.demo_url ? <ExternalLink href={project.demo_url}>Live demo</ExternalLink> : null}
        </div>
      ) : null}
    </article>
  );
}

export default function ProjectExplorer({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category))).sort()],
    [projects],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return projects.filter((project) => {
      if (category !== "All" && project.category !== category) return false;
      if (!needle) return true;
      return [project.title, project.summary, project.description, ...project.tech]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [projects, category, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {categories.map((item) => {
            const active = item === category;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={active}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-violet bg-violet/15 text-ink"
                    : "border-line text-muted hover:border-line hover:text-ink"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="sm:w-64">
          <label htmlFor="project-search" className="sr-only">
            Search projects
          </label>
          <input
            id="project-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or tool"
            className="w-full rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink placeholder:text-faint"
          />
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {visible.length} projects shown
      </p>

      {visible.length === 0 ? (
        <EmptyState message="Nothing matches that. Try a different tool or clear the search." />
      ) : (
        visible.map((project) => <ProjectCard key={project.slug} project={project} />)
      )}
    </div>
  );
}
