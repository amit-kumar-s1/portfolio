# Portfolio

A black-themed personal portfolio for security, machine learning and software work.
Next.js frontend, FastAPI backend, no database.

```
portfolio/
├── backend/          FastAPI: serves content and accepts contact messages
└── frontend/         Next.js App Router site
```

## How content works

There is no CMS and no database. All content lives in five JSON files under
`backend/app/content/`, validated against Pydantic schemas at startup, and served
over a read-only API. The frontend fetches it during rendering and pre-renders every
page as static HTML, revalidating every five minutes.

To change the site, edit JSON and restart the backend. Bad data fails loudly at
startup rather than silently on a request.

| File | What it drives |
| --- | --- |
| `profile.json` | Name, tagline, summary, skills, interests, goals, social links |
| `projects.json` | Projects page and the selected work on the home page |
| `achievements.json` | Achievements timeline |
| `posts.json` | Writing index and article pages |
| `models.json` | AI models page |

## Make it yours

Everything ships with placeholder content. Search the content files for `Your Name`,
`your-handle` and `you@example.com` and replace them. The sample projects, articles
and models are there to show the shape of each record — delete them and write your own.

## Running it

Two terminals. The backend first, since the frontend reads from it at build time.

**Backend**

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

**Frontend**

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

The site is on http://localhost:3000, the API on http://127.0.0.1:8000.
Set `DEBUG=true` in the backend `.env` to enable the interactive API docs at `/docs`.

Other commands: `npm run build`, `npm start`, `npm run typecheck`.

## Environment variables

**backend/.env**

| Variable | Purpose |
| --- | --- |
| `DEBUG` | Enables `/docs` and `/openapi.json`. Keep false in production. |
| `CORS_ORIGINS` | Comma-separated exact origins allowed to call the API. Never `*`. |
| `CONTACT_RATE_LIMIT`, `CONTACT_RATE_WINDOW_SECONDS` | Contact throttle, per IP. Defaults to 3 per hour. |
| `SMTP_*` | Optional. Without these, contact messages are only appended to `backend/data/messages.jsonl`. |

**frontend/.env.local**

| Variable | Purpose |
| --- | --- |
| `API_URL` | Read by server components. Can be an internal address. |
| `NEXT_PUBLIC_API_URL` | Read by the contact form in the browser. Must be publicly reachable over HTTPS in production. |

Nothing secret belongs in a `NEXT_PUBLIC_` variable: it is compiled into the bundle.

## Contact form

Submissions are validated twice (browser, then Pydantic), rate limited per IP,
and screened with a hidden honeypot field. Every message is written to disk before
delivery is attempted, so an SMTP outage never loses one. If SMTP is not configured
the endpoint still works and returns `delivered: false` — the message is on disk.

`backend/data/` holds real messages. Keep it out of version control and off any
public path.

## Security notes

Implemented:

- Strict CSP, `X-Frame-Options`, `nosniff`, HSTS and a referrer policy on every
  frontend response; security headers on API responses too.
- Explicit CORS allowlist, no credentials, only the methods actually used.
- Pydantic validation on every input, with control characters stripped and length
  bounds on all text fields.
- Generic error bodies. Stack traces go to logs, never to the client.
- No `dangerouslySetInnerHTML` anywhere. Article bodies are parsed into React
  elements, so stored content cannot introduce script into the page.
- All external links carry `rel="noopener noreferrer"`.

Known trade-off: the CSP includes `'unsafe-inline'` in `script-src`, because Next
injects an inline bootstrap script into statically rendered pages. Removing it means
nonce-based CSP via middleware, which forces every page to render dynamically and
gives up the static output. The site has no user-generated HTML, so the residual risk
is low — but if you later accept untrusted content, switch to the nonce approach.

This has not been penetration tested. Treat the list above as what was built, not as
a guarantee.

## Accessibility

Semantic landmarks, a skip link, visible focus rings on every interactive element,
`aria-pressed` on filters, live regions for filter results and form status, labels on
all inputs, and `prefers-reduced-motion` honoured. The only entrance animation is the
hero load and the achievements timeline, and both are disabled under reduced motion.
Content remains visible when JavaScript is blocked.

## Performance

All nine routes pre-render as static HTML. Shared JavaScript is about 105 kB, and no
page adds more than 6 kB on top. There is no animation library, no state library, and
one webfont family loaded with `preconnect` and `display=swap`. API responses carry
`Cache-Control: public, max-age=300, stale-while-revalidate=86400`.

## Deploying

**Frontend** — any Node host. On Vercel, set `API_URL` and `NEXT_PUBLIC_API_URL` to
the deployed API and deploy from `frontend/`. Redeploy after editing content so pages
rebuild.

**Backend** — any container host (Fly.io, Railway, a VPS):

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
```

Behind a reverse proxy that terminates TLS. Two things to remember:

- Set `CORS_ORIGINS` to your real frontend origin. A wrong value here is the most
  common cause of a working local site and a broken deployed one.
- The rate limiter keeps state in process memory. With more than one worker each
  holds its own counters, so the effective limit multiplies. For a personal site
  that is fine; if it matters, move the counter to Redis.

Persist `backend/data/` with a volume, or configure SMTP so messages are emailed.

## Extending it

- **A real blog**: the article schema already carries body, tags, topic and reading
  time. Swap `posts.json` for Markdown files and parse at startup — the API contract
  does not change.
- **Interactive model demos**: add a POST route per model under `routers/`, keep
  inference in `services/`, and give the model card a demo panel.
- **Project images**: `Project.image` exists and is unused. Put files in
  `frontend/public/`, reference them by path, and render with `next/image`.
