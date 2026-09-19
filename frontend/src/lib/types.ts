export type ProjectStatus = "live" | "in-progress" | "archived" | "research" | "completed";
export type ModelStatus = "published" | "training" | "experimental" | "deprecated";

export interface Link {
  label: string;
  url: string;
}

export interface SkillGroup {
  area: string;
  items: string[];
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  location: string;
  summary: string;
  focus: string[];
  skills: SkillGroup[];
  interests: string[];
  goals: string[];
  links: Link[];
  resume_url: string | null;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  tech: string[];
  status: ProjectStatus;
  year: number | null;
  repo_url: string | null;
  demo_url: string | null;
  image: string | null;
  featured: boolean;
}

export interface Achievement {
  title: string;
  issuer: string;
  kind: "certification" | "award" | "research" | "internship" | "milestone";
  date: string;
  detail: string | null;
  url: string | null;
}

export interface PostSummary {
  slug: string;
  title: string;
  summary: string;
  topic: string;
  published: string;
  reading_minutes: number;
  tags: string[];
}

export interface Post extends PostSummary {
  body: string;
}

export interface Metric {
  label: string;
  value: string;
}

export interface AIModel {
  slug: string;
  name: string;
  description: string;
  problem: string;
  architecture: string;
  dataset: string | null;
  metrics: Metric[];
  tech: string[];
  status: ModelStatus;
  repo_url: string | null;
  hub_url: string | null;
  demo_url: string | null;
}
