import type { Link as ProfileLink } from "@/lib/types";

export default function SiteFooter({ name, links }: { name: string; links: ProfileLink[] }) {
  return (
    <footer className="mt-24 border-t border-line-soft">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-sm text-faint">
          {name}, {new Date().getFullYear()}
        </p>
        <ul className="flex flex-wrap gap-6">
          {links.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
