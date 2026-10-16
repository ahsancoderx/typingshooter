import PageContainer from '@/components/layout/PageContainer';
import TypingTest from '@/components/typing/TypingTest';
import { buildMetadata } from '@/lib/seo';
export const metadata = buildMetadata({
  title: 'Free Online Typing Speed Test (WPM and Accuracy)',
  description:
    'Take a free typing speed test with 15 to 120 second timers, Easy to Hard difficulty, and text categories. See your WPM, raw WPM, accuracy, and a WPM graph.',
  path: '/typing-test',
});
export default function TypingTestPage() {
  return (
    <PageContainer className="page">
      <div className="page-head">
        <h1>Typing speed test</h1>
        <p className="muted">
          Pick a duration, difficulty, and text type, then start typing. The timer starts on your first
          keystroke.
        </p>
      </div>
      <TypingTest />
      <section className="prose">
        <h2>How your score is calculated</h2>
        <p>
          <strong>WPM</strong> (words per minute) is correctly typed characters divided by 5, divided by
          minutes elapsed. <strong>Raw WPM</strong> uses every typed character, including mistakes.{' '}
          <strong>Accuracy</strong> is correct keystrokes divided by total keystrokes. Mistakes you fix with
          Backspace still count against accuracy.
        </p>
      </section>
    </PageContainer>
  );
}
