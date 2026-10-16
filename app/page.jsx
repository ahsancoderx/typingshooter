import Link from 'next/link';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeading from '@/components/ui/SectionHeading';
import LinkButton from '@/components/ui/LinkButton';
import { buildMetadata, SITE_URL, SITE_NAME } from '@/lib/seo';
export const metadata = buildMetadata({
  title: 'Free Typing Games and Typing Practice',
  description:
    'Practice typing for free with a speed test, beginner lessons, and a 3D typing shooter game. Track your WPM and accuracy in your browser.',
  path: '/',
});
const FEATURES = [
  [
    'Free typing speed test',
    'Timed tests with WPM, raw WPM, and accuracy, using passages that match your chosen difficulty.',
  ],
  [
    '3D bubble-shooting game',
    'Type the letters and words on falling bubbles to fire your cannon before they reach the danger line.',
  ],
  [
    'Beginner-to-advanced lessons',
    'A 20-lesson course from home row keys to programming text, each with a practice exercise.',
  ],
  [
    'WPM and accuracy analytics',
    'Charts built from your own results, plus weak-key analysis once you have enough data.',
  ],
  [
    'Saved practice history',
    'Results are stored in your browser, so you can pick up where you left off without an account.',
  ],
  [
    'Difficulty and duration controls',
    'Choose Easy, Medium, or Hard and 15 to 120 seconds. Difficulty changes speed, word length, and lives.',
  ],
];
const STEPS = [
  ['Choose a typing mode', 'Take a timed typing test, play the 3D game, or follow a lesson.'],
  [
    'Type accurately or shoot matching bubbles',
    'Correct keystrokes turn blue. In the game, a finished word fires the cannon and pops the bubble.',
  ],
  [
    'Review results and practice what is weak',
    'See your WPM, accuracy, and trouble keys, then run a targeted lesson.',
  ],
];
const BENCH = [
  ['Under 30 WPM', 'Beginner', 'Focus on accuracy and correct finger placement.'],
  ['30–50 WPM', 'Developing', 'Typical for casual typists. Consistency matters most.'],
  ['50–70 WPM', 'Proficient', 'Comfortable for most office work.'],
  ['70+ WPM', 'Advanced', 'Usually reached with regular practice and high accuracy.'],
];
const LESSONS = [
  [
    'Understanding the keyboard',
    '/learn/understanding-the-keyboard',
    'Learn the layout and where each key lives.',
  ],
  [
    'Home row keys: ASDF and JKL;',
    '/learn/home-row-keys',
    'Anchor your fingers and learn to return to base.',
  ],
  [
    'Accuracy before speed',
    '/learn/accuracy-before-speed',
    'Build clean habits that make speed easier later.',
  ],
];
const FAQ = [
  [
    'What is WPM?',
    'WPM means words per minute. Typing tests count a "word" as five characters, so spaces and punctuation are included.',
  ],
  [
    'How is typing speed calculated?',
    'WPM = correctly typed characters ÷ 5 ÷ elapsed minutes. Raw WPM uses all typed characters, including mistakes.',
  ],
  [
    'What is a good typing speed for beginners?',
    'Many beginners start below 30 WPM. Aim for steady accuracy first, because speed usually follows with practice.',
  ],
  [
    'How can I improve my typing accuracy?',
    'Slow down until you make few errors, keep your fingers on the home row, and practice the keys you miss most.',
  ],
  [
    'How does the TypeBlaster game work?',
    'Bubbles with letters or words fall toward a danger line. Type the target and your cannon fires at it. You lose a life when a bubble gets through.',
  ],
  ['Is TypeBlaster free?', 'Yes. Every feature works without registering or paying.'],
  [
    'Where is my practice progress stored?',
    'In your current browser using localStorage. It is not synced across devices, and clearing browser data removes it.',
  ],
  [
    'Can I use TypeBlaster on mobile?',
    'You can browse the site, but typing practice and the game work best with a physical keyboard.',
  ],
];
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  ],
};
function HeroPreview() {
  return (
    <div
      className="arena"
      role="img"
      aria-label="Example of the typing view: typed letters in blue, a mistake in red, and the current letter marked by a cursor"
    >
      <div className="arena-bar">
        <span>word mode</span>
        <span>example</span>
      </div>
      <p className="arena-text" aria-hidden="true">
        <span className="t-ok">Type the wo</span>
        <span className="t-bad">e</span>
        <span className="t-cur">d</span>
        <span> then pop the bubble.</span>
      </p>
      <div className="arena-line">danger line</div>
    </div>
  );
}
export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageContainer as="section" className="hero">
        <div>
          <h1>Improve Your Typing Speed. Master Every Keystroke.</h1>
          <p className="lead muted">
            Take a free typing speed test, follow structured touch-typing lessons, and play a 3D typing
            shooter game. No account needed.
          </p>
          <div className="btn-row">
            <LinkButton href="/game" variant="contained" size="large">
              Play TypeBlaster
            </LinkButton>
            <LinkButton href="/typing-test" variant="outlined" size="large">
              Start Typing Test
            </LinkButton>
          </div>
        </div>
        <HeroPreview />
      </PageContainer>

      <section className="section" aria-labelledby="features">
        <PageContainer>
          <SectionHeading id="features" title="Everything you need to practice typing">
            Tests, a game, lessons, and analytics in one place.
          </SectionHeading>
          <div className="grid grid-3">
            {FEATURES.map(([t, d]) => (
              <div className="feature" key={t}>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      <section className="section" aria-labelledby="how">
        <PageContainer>
          <SectionHeading id="how" title="How it works" />
          <ol className="steps">
            {STEPS.map(([t, d], i) => (
              <li key={t}>
                <span className="n" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </PageContainer>
      </section>

      <section className="section" aria-labelledby="bench">
        <PageContainer>
          <SectionHeading id="bench" title="Typing speed benchmarks">
            Rough guide to where you stand. Compare your accuracy as well as your speed.
          </SectionHeading>
          <table className="bench">
            <caption className="sr-only">Typing speed ranges</caption>
            <thead>
              <tr>
                <th scope="col">Speed</th>
                <th scope="col">Level</th>
                <th scope="col">What to focus on</th>
              </tr>
            </thead>
            <tbody>
              {BENCH.map(([s, l, f]) => (
                <tr key={s}>
                  <td>{s}</td>
                  <td>{l}</td>
                  <td className="muted">{f}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="muted note">
            Ranges are general guidelines. Sources vary, and results depend on the text being typed.
          </p>
        </PageContainer>
      </section>

      <section className="section" aria-labelledby="lessons">
        <PageContainer>
          <SectionHeading id="lessons" title="Start with these lessons">
            The full course has 20 lessons across beginner, intermediate, and advanced tracks.
          </SectionHeading>
          <div className="grid grid-3">
            {LESSONS.map(([t, href, d]) => (
              <Link key={href} href={href} className="lesson-link">
                <strong>{t}</strong>
                <span>{d}</span>
              </Link>
            ))}
          </div>
        </PageContainer>
      </section>

      <section className="section" aria-labelledby="progress">
        <PageContainer className="split">
          <SectionHeading id="progress" title="See your own progress">
            Your dashboard is built only from the tests and games you complete.
          </SectionHeading>
          <div>
            <ul className="checks">
              <li>Best and average WPM</li>
              <li>Accuracy and WPM trends over time</li>
              <li>Practice streak and total practice time</li>
              <li>Weak-key analysis once you have enough data</li>
            </ul>
            <div className="btn-row" style={{ marginTop: 20 }}>
              <LinkButton href="/progress" variant="outlined">
                View progress
              </LinkButton>
            </div>
          </div>
        </PageContainer>
      </section>

      <section className="section" aria-labelledby="faq">
        <PageContainer>
          <SectionHeading id="faq" title="Frequently asked questions" />
          <div className="faq">
            {FAQ.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </PageContainer>
      </section>

      <section className="section cta" aria-labelledby="cta">
        <PageContainer>
          <h2 id="cta">Ready to type faster?</h2>
          <p className="muted">Pick a mode and start. Your results are saved in this browser.</p>
          <div className="btn-row">
            <LinkButton href="/game" variant="contained" size="large">
              Play TypeBlaster
            </LinkButton>
            <LinkButton href="/learn" variant="outlined" size="large">
              Start Learning
            </LinkButton>
          </div>
        </PageContainer>
      </section>
    </>
  );
}
