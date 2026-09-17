"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

type State = { kind: "idle" | "sending" } | { kind: "sent" | "error"; message: string };

const fieldClass =
  "w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-faint";

export default function ContactForm() {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      subject: String(data.get("subject") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      website: String(data.get("website") ?? ""),
    };

    if (payload.message.length < 20) {
      setState({ kind: "error", message: "Add a little more detail: at least 20 characters." });
      return;
    }

    setState({ kind: "sending" });
    try {
      const response = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 429) {
        setState({
          kind: "error",
          message: "That is a few messages in a short window. Try again in an hour.",
        });
        return;
      }
      if (!response.ok) {
        setState({ kind: "error", message: "The message did not go through. Check the fields and try again." });
        return;
      }

      form.reset();
      setState({ kind: "sent", message: "Message received. I read everything and reply to most of it." });
    } catch {
      setState({ kind: "error", message: "Could not reach the server. Check your connection and retry." });
    }
  }

  const sending = state.kind === "sending";

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm text-muted">
            Name
          </label>
          <input id="name" name="name" required minLength={2} maxLength={80} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-muted">
            Email
          </label>
          <input id="email" name="email" type="email" required className={fieldClass} />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="subject" className="mb-2 block text-sm text-muted">
          Subject
        </label>
        <input id="subject" name="subject" required minLength={3} maxLength={120} className={fieldClass} />
      </div>

      <div className="mt-4">
        <label htmlFor="message" className="mb-2 block text-sm text-muted">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          minLength={20}
          maxLength={4000}
          className={`${fieldClass} resize-y`}
        />
      </div>

      {/* Honeypot: hidden from people and from screen readers, tempting to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="submit"
          disabled={sending}
          className="rounded-full bg-violet px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet/85 disabled:opacity-60"
        >
          {sending ? "Sending" : "Send message"}
        </button>
      </div>

      <p
        aria-live="polite"
        className={`mt-4 text-sm ${state.kind === "error" ? "text-amber" : "text-signal"}`}
      >
        {state.kind === "sent" || state.kind === "error" ? state.message : ""}
      </p>
    </form>
  );
}
