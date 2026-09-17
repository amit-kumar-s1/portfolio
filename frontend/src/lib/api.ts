import type { Achievement, AIModel, Post, PostSummary, Profile, Project } from "./types";

const API_URL = process.env.API_URL ?? "http://127.0.0.1:8000";

/** Revalidate window in seconds. Content changes on redeploy, so this can be generous. */
const REVALIDATE = 300;

/**
 * The three outcomes a page needs to tell apart. Collapsing "missing" and
 * "unreachable" into null makes an API outage look like a deleted page.
 */
export type Result<T> =
  | { status: "ok"; data: T }
  | { status: "missing" }
  | { status: "unavailable" };

export async function getResult<T>(path: string): Promise<Result<T>> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      next: { revalidate: REVALIDATE },
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (response.status === 404) return { status: "missing" };
    if (!response.ok) return { status: "unavailable" };
    return { status: "ok", data: (await response.json()) as T };
  } catch {
    // Detail is deliberately not surfaced to the browser.
    return { status: "unavailable" };
  }
}

/**
 * Convenience wrapper for pages that treat any failure the same way. Returns null
 * so a page can render an honest error state rather than a blank 500.
 */
export async function getJson<T>(path: string): Promise<T | null> {
  const result = await getResult<T>(path);
  return result.status === "ok" ? result.data : null;
}

export const getProfile = () => getJson<Profile>("/api/profile");
export const getProjects = () => getJson<Project[]>("/api/projects");
export const getAchievements = () => getJson<Achievement[]>("/api/achievements");
export const getPosts = () => getJson<PostSummary[]>("/api/posts");
export const getPost = (slug: string) =>
  getResult<Post>(`/api/posts/${encodeURIComponent(slug)}`);
export const getModels = () => getJson<AIModel[]>("/api/models");
