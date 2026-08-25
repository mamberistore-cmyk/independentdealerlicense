import Avatar from '@/components/Avatar';
import Link from 'next/link';
import { siteConfig } from '@/lib/config';

export const metadata = {
  title: 'About',
  description:
    'Who writes Independent Dealer License, and why. Nine years behind a state licensing counter, then a small used-car lot of my own.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author.name,
    description: siteConfig.author.bio,
    jobTitle: siteConfig.author.role,
    url: `${siteConfig.url}/about`,
    image: siteConfig.author.avatar,
    knowsAbout: [
      'independent dealer license',
      'used car dealership',
      'surety bonds',
      'dealer insurance',
    ],
  };

  return (
    <div className="mx-auto max-w-prose px-5 py-16 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <span className="eyebrow">About</span>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink">
        I’ve stamped the applications. Then I filed my own.
      </h1>

      <div className="mt-8 flex items-center gap-4 border-y border-cream-300/70 py-6">
        <Avatar size={64} showMeta meta={siteConfig.author.role} />
      </div>

      <div className="article-prose mt-10">
        <p>
          Hi — I’m Marcus. For the better part of a decade I worked the licensing
          window at a state motor vehicle office. If you ever mailed in a dealer
          application and got it bounced back with a sticky note about a missing
          signature, there’s a real chance it crossed my desk. I saw thousands of
          applications. I saw the same five mistakes over and over.
        </p>
        <p>
          Then in 2019 I did the thing I’d spent years watching other people do: I
          quit, leased a gravel corner lot with a double-wide office trailer, and
          applied for my own independent dealer license. Suddenly I was on the
          other side of the glass, and let me tell you — knowing the rules and
          <em> living</em> the rules are two very different things.
        </p>
        <p>
          This blog is where those two perspectives meet. I write the guides I
          wish someone had handed me: what the fees actually add up to, which
          “required” insurance is really required, how the surety bond works when
          you’ve never bought one, and why the inspector cares so much about your
          signage.
        </p>

        <h2>What you won’t find here</h2>
        <p>
          I’m not selling a $997 course. I’m not going to funnel you toward one
          bonding company because they pay me a kickback. When I recommend
          something, it’s because it saved me time or money, and I’ll tell you
          when I’m guessing. This site keeps the lights on through modest display
          ads, and that’s it.
        </p>

        <h2>A small, honest disclaimer</h2>
        <p>
          Licensing rules change, and they’re different in every state — sometimes
          in every county. Everything here is general information from my own
          experience, not legal advice. Before you write a check or sign a lease,
          confirm the current requirements with your state’s motor vehicle
          department. I’ll try to keep things current, but you’re the one signing.
        </p>
      </div>

      <div className="mt-12 rounded-xl2 bg-navy px-8 py-10 text-cream-50">
        <h2 className="font-serif text-xl font-semibold">Got a question I haven’t covered?</h2>
        <p className="mt-3 text-cream-200/90">
          I read everything that comes through the contact page and turn the good
          questions into full guides.
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-flex rounded-full bg-cream-50 px-6 py-3 text-sm font-semibold text-navy transition-transform hover:-translate-y-0.5"
        >
          Send me a note
        </Link>
      </div>
    </div>
  );
}
