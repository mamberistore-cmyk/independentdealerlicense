import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contact',
  description:
    'Questions about dealer licensing, a correction, or a guide you’d like written? Send a note.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-prose px-5 py-16 sm:px-6">
      <span className="eyebrow">Contact</span>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink">
        Say hello
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-soft">
        Stuck on a step? Spot something that’s changed in your state? Want me to
        cover a topic? This inbox is where a lot of the articles start.
      </p>

      <div className="mt-10 rounded-xl2 border border-cream-300/70 bg-cream-50 p-6 shadow-soft sm:p-8">
        <ContactForm />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-cream-300/70 bg-cream-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-clay">Response time</p>
          <p className="mt-1 text-sm text-ink-soft">Usually within two or three business days. It’s just me back here.</p>
        </div>
        <div className="rounded-xl border border-cream-300/70 bg-cream-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-clay">Not legal advice</p>
          <p className="mt-1 text-sm text-ink-soft">I can share what worked for me, but confirm specifics with your state DMV.</p>
        </div>
      </div>
    </div>
  );
}
