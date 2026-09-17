"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PostSummary } from "@/lib/types";
import { EmptyState, Tag } from "./ui";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default function WritingList({ posts }: { posts: PostSummary[] }) {
  const [topic, setTopic] = useState("All");

  const topics = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((post) => post.topic))).sort()],
    [posts],
  );

  const visible = topic === "All" ? posts : posts.filter((post) => post.topic === topic);

  return (
    <div>
      <div className="flex flex-wrap gap-2 py-8" role="group" aria-label="Filter by topic">
        {topics.map((item) => {
          const active = item === topic;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setTopic(item)}
              aria-pressed={active}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                active ? "border-violet bg-violet/15 text-ink" : "border-line text-muted hover:text-ink"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <EmptyState message="Nothing here on that topic yet." />
      ) : (
        <ul>
          {visible.map((post) => (
            <li key={post.slug} className="border-t border-line-soft last:border-b">
              <Link href={`/writing/${post.slug}`} className="group block py-8">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h2 className="font-display text-xl text-ink group-hover:text-cyan">
                    {post.title}
                  </h2>
                  <span className="text-xs text-faint">{formatDate(post.published)}</span>
                </div>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted">{post.summary}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {post.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                  <span className="text-xs text-faint">{post.reading_minutes} minute read</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
