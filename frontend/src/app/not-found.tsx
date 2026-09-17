import Link from "next/link";
import { Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-32">
      <h1 className="text-3xl font-medium">That page does not exist</h1>
      <p className="mt-4 max-w-md text-muted">
        The link may be out of date, or the page moved. The projects and writing indexes are
        the best places to pick up the trail.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="rounded-full bg-violet px-5 py-2.5 text-sm font-medium text-white hover:bg-violet/85"
        >
          Back home
        </Link>
        <Link
          href="/#projects"
          className="rounded-full border border-line px-5 py-2.5 text-sm text-ink hover:border-cyan hover:text-cyan"
        >
          Browse projects
        </Link>
      </div>
    </Container>
  );
}
