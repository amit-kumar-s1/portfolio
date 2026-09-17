import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostBody from "@/components/PostBody";
import { ApiError, Container, Tag } from "@/components/ui";

import { getPost, getPosts } from "@/lib/api";

interface Params {
  params: Promise<{ slug: string }>;
}

/** Pre-renders every article at build time; new ones appear on revalidate. */
export async function generateStaticParams() {
  const posts = await getPosts();
  return (posts ?? []).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPost(slug);
  if (result.status !== "ok") return { title: "Article" };
  return { title: result.data.title, description: result.data.summary };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const result = await getPost(slug);

  // Only a confirmed 404 from the API means the article is gone. An outage gets
  // its own state, so a dead backend never looks like a deleted page.
  if (result.status === "missing") notFound();
  if (result.status === "unavailable") {
    return (
      <Container className="py-24">
        <ApiError what="article" />
      </Container>
    );
  }

  const post = result.data;

  const published = new Date(post.published).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Container className="pb-24">
      <article className="pt-14 sm:pt-20">
        <Link href="/#writing" className="text-sm text-muted hover:text-ink">
          Back to writing
        </Link>

        <h1 className="mt-8 max-w-3xl text-3xl font-medium leading-tight sm:text-4xl">
          {post.title}
        </h1>

        <p className="mt-4 text-sm text-faint">
          {published}, {post.reading_minutes} minute read
        </p>

        <p className="mt-6 max-w-2xl border-l border-violet/60 pl-5 text-lg leading-relaxed text-muted">
          {post.summary}
        </p>

        <div className="mt-12">
          <PostBody body={post.body} />
        </div>

        <div className="mt-12 flex flex-wrap gap-2 border-t border-line-soft pt-8">
          {post.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </article>
    </Container>
  );
}
