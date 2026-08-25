'use client';

import { useState } from 'react';

// A no-backend contact form: it composes a mailto link so the visitor's own
// email client sends the message. Keeps us free of any third-party form
// service while still being fully functional.
export default function ContactForm({ to = 'hello@independentdealerlicense.com' }) {
  const [form, setForm] = useState({ name: '', email: '', topic: 'General question', message: '' });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[${form.topic}] from ${form.name || 'a reader'}`);
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name}\n${form.email}`
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  const field =
    'w-full rounded-xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm text-ink shadow-soft outline-none transition-colors placeholder:text-ink-muted focus:border-navy/40';

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">Your name</label>
          <input id="name" required value={form.name} onChange={update('name')} className={field} placeholder="Jordan Reeves" />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">Email</label>
          <input id="email" type="email" required value={form.email} onChange={update('email')} className={field} placeholder="you@example.com" />
        </div>
      </div>

      <div>
        <label htmlFor="topic" className="mb-1.5 block text-sm font-medium text-ink">Topic</label>
        <select id="topic" value={form.topic} onChange={update('topic')} className={field}>
          <option>General question</option>
          <option>Suggest a guide</option>
          <option>Correction / update</option>
          <option>Advertising</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink">Message</label>
        <textarea id="message" required rows={6} value={form.message} onChange={update('message')} className={field} placeholder="What are you stuck on?" />
      </div>

      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-cream-50 shadow-soft transition-colors hover:bg-navy-light"
      >
        Open my email
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <p className="text-xs text-ink-muted">
        This opens your own email app with the message pre-filled — nothing is sent
        or stored on this site.
      </p>
    </form>
  );
}
