import Link from "next/link";
import Hero from "@/components/Hero";
import ProjectExplorer from "@/components/ProjectExplorer";
import Reveal from "@/components/Reveal";
import WritingList from "@/components/WritingList";
import ContactForm from "@/components/ContactForm";
import {
  ApiError,
  Container,
  ExternalLink,
  PageHeader,
  StatusBadge,
  Tag,
} from "@/components/ui";
import {
  getAchievements,
  getModels,
  getPosts,
  getProfile,
  getProjects,
} from "@/lib/api";
import type { Achievement } from "@/lib/types";

const kindLabel: Record<Achievement["kind"], string> = {
  certification: "Certification",
  award: "Award",
  research: "Research",
  internship: "Internship",
  milestone: "Milestone",
};

const kindColor: Record<Achievement["kind"], string> = {
  certification: "bg-violet",
  award: "bg-cyan",
  research: "bg-signal",
  internship: "bg-amber",
  milestone: "bg-faint",
};

export default async function HomePage() {
  const [profile, projects, posts, models, achievements] = await Promise.all([
    getProfile(),
    getProjects(),
    getPosts(),
    getModels(),
    getAchievements(),
  ]);

  if (!profile) {
    return (
      <Container className="py-24">
        <ApiError what="site content" />
      </Container>
    );
  }

  const published = (models ?? []).filter((model) => model.status === "published");

  return (
    <>
      <Hero
        profile={profile}
        counts={{
          projects: projects?.length ?? 0,
          models: published.length,
          posts: posts?.length ?? 0,
        }}
      />

      {/* ── About ──────────────────────────────────────────────────────── */}
      <section id="about">
        <Container>
          <PageHeader title="About" intro={profile.role} />

          <div className="grid gap-14 py-14 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="text-lg leading-relaxed text-muted">{profile.summary}</p>

              <h2 className="mt-14 text-xl font-medium">What I am curious about</h2>
              <ul className="mt-5 space-y-3">
                {profile.interests.map((interest) => (
                  <li key={interest} className="border-l border-violet/60 pl-4 text-muted">
                    {interest}
                  </li>
                ))}
              </ul>

              <h2 className="mt-14 text-xl font-medium">Where I am headed</h2>
              <ul className="mt-5 space-y-3">
                {profile.goals.map((goal) => (
                  <li key={goal} className="border-l border-cyan/50 pl-4 text-muted">
                    {goal}
                  </li>
                ))}
              </ul>
            </div>

            <aside>
              <h2 className="text-xl font-medium">Skills</h2>
              {profile.skills.map((group) => (
                <section key={group.area} className="mt-7">
                  <h3 className="text-sm text-ink">{group.area}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <Tag key={item}>{item}</Tag>
                    ))}
                  </div>
                </section>
              ))}

              <h2 className="mt-12 text-xl font-medium">Find me</h2>
              <ul className="mt-4 space-y-2">
                {profile.links.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted hover:text-cyan"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </Container>
      </section>

      {/* ── Projects ───────────────────────────────────────────────────── */}
      <section id="projects">
        <Container className="pb-20">
          <PageHeader
            title="Projects"
            intro="Things I built to answer a question, usually one I could not find a good answer to. Filter by area or search for a tool."
          />
          {projects ? (
            <ProjectExplorer projects={projects} />
          ) : (
            <div className="pt-10">
              <ApiError what="project list" />
            </div>
          )}
        </Container>
      </section>

      {/* ── AI models ──────────────────────────────────────────────────── */}
      <section id="models">
        <Container className="pb-20">
          <PageHeader
            title="AI models"
            intro="Models I trained, what each one is for, and how well it actually performs. Metrics are from held-out evaluation, not the training set."
          />

          {models ? (
            <div className="grid gap-6 pt-12 lg:grid-cols-2">
              {models.map((model) => (
                <article
                  key={model.slug}
                  className="flex flex-col rounded-xl border border-line-soft bg-surface p-7 transition-colors hover:border-line"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="font-display text-xl">{model.name}</h2>
                    <StatusBadge status={model.status} />
                  </div>

                  <p className="mt-3 text-muted">{model.description}</p>

                  <dl className="mt-6 space-y-4 text-sm">
                    <div>
                      <dt className="text-ink">Problem</dt>
                      <dd className="mt-1 leading-relaxed text-muted">{model.problem}</dd>
                    </div>
                    <div>
                      <dt className="text-ink">Architecture</dt>
                      <dd className="mt-1 leading-relaxed text-muted">{model.architecture}</dd>
                    </div>
                    {model.dataset ? (
                      <div>
                        <dt className="text-ink">Data</dt>
                        <dd className="mt-1 leading-relaxed text-muted">{model.dataset}</dd>
                      </div>
                    ) : null}
                  </dl>

                  {model.metrics.length > 0 ? (
                    <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-line-soft pt-5">
                      {model.metrics.map((metric) => (
                        <div key={metric.label}>
                          <dt className="text-xs text-faint">{metric.label}</dt>
                          <dd className="font-display text-ink">{metric.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}

                  <div className="mt-6 flex flex-wrap gap-2">
                    {model.tech.map((item) => (
                      <Tag key={item}>{item}</Tag>
                    ))}
                  </div>

                  <div className="mt-auto flex flex-wrap gap-6 pt-6">
                    {model.repo_url ? <ExternalLink href={model.repo_url}>Code</ExternalLink> : null}
                    {model.hub_url ? <ExternalLink href={model.hub_url}>Weights</ExternalLink> : null}
                    {model.demo_url ? <ExternalLink href={model.demo_url}>Try it</ExternalLink> : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="pt-10">
              <ApiError what="model list" />
            </div>
          )}
        </Container>
      </section>

      {/* ── Writing ────────────────────────────────────────────────────── */}
      <section id="writing">
        <Container className="pb-20">
          <PageHeader
            title="Writing"
            intro="Notes on security work, machine learning, and the things I got wrong before I got them right."
          />
          {posts ? (
            <WritingList posts={posts} />
          ) : (
            <div className="pt-10">
              <ApiError what="article list" />
            </div>
          )}
        </Container>
      </section>

      {/* ── Achievements ───────────────────────────────────────────────── */}
      <section id="achievements">
        <Container className="pb-24">
          <PageHeader
            title="Achievements"
            intro="Certifications, competition results, research and the milestones that changed what I could work on next."
          />

          {achievements ? (
            <ol className="relative mt-14 border-l border-line-soft pl-8 sm:pl-10">
              {achievements.map((item, index) => (
                <li key={`${item.title}-${item.date}`} className="relative pb-12 last:pb-0">
                  <span
                    className={`absolute -left-[41px] top-1.5 h-2.5 w-2.5 rounded-full sm:-left-[49px] ${kindColor[item.kind]}`}
                    aria-hidden="true"
                  />
                  <Reveal delay={Math.min(index, 4) * 60}>
                    <p className="text-xs text-faint">
                      {new Date(item.date).toLocaleDateString("en-GB", {
                        month: "long",
                        year: "numeric",
                      })}
                      , {kindLabel[item.kind]}
                    </p>
                    <h2 className="mt-2 font-display text-xl">{item.title}</h2>
                    <p className="mt-1 text-sm text-muted">{item.issuer}</p>
                    {item.detail ? (
                      <p className="mt-3 max-w-2xl leading-relaxed text-muted">{item.detail}</p>
                    ) : null}
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-sm text-cyan hover:underline"
                      >
                        Verify
                      </a>
                    ) : null}
                  </Reveal>
                </li>
              ))}
            </ol>
          ) : (
            <div className="pt-10">
              <ApiError what="timeline" />
            </div>
          )}
        </Container>
      </section>

      {/* ── Contact ────────────────────────────────────────────────────── */}
      <section id="contact">
        <Container className="pb-24">
          <div className="pb-4">
            <div className="rounded-2xl border border-line bg-surface p-8 sm:p-12">
              <h2 className="max-w-xl text-2xl font-medium leading-snug">
                Working on something at the edge of security and machine learning?
              </h2>
              <p className="mt-3 max-w-xl text-muted">
                I am interested in research collaborations, difficult detection problems and
                teams shipping models into places where mistakes are expensive.
              </p>
              <Link
                href="#contact"
                className="mt-7 inline-block rounded-full bg-violet px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet/85"
              >
                Start a conversation
              </Link>
            </div>
          </div>

          <PageHeader
            title="Contact"
            intro="Collaborations, research questions, or a detection problem you are stuck on. All of it is welcome."
          />

          <div className="grid gap-14 py-14 md:grid-cols-[1.3fr_1fr]">
            <ContactForm />

            <aside>
              <h2 className="text-lg font-medium">Elsewhere</h2>
              <ul className="mt-5 space-y-3">
                {profile.links.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted transition-colors hover:text-cyan"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>

              <p className="mt-10 text-sm leading-relaxed text-faint">
                Messages are rate limited to three per hour from the same address. Nothing you
                send is shared with anyone else.
              </p>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
