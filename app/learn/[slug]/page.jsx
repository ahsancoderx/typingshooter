import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageContainer from '@/components/layout/PageContainer';
import TypingExercise from '@/components/learn/TypingExercise';
import { LESSONS, getLesson } from '@/data/lessons';
import { buildMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return LESSONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }) {
  const lesson = getLesson((await params).slug);
  if (!lesson) return {};
  return buildMetadata({
    title: `${lesson.title} - Touch Typing Lesson`,
    description: lesson.summary,
    path: `/learn/${lesson.slug}`,
  });
}

export default async function LessonPage({ params }) {
  const { slug } = await params;
  const index = LESSONS.findIndex((l) => l.slug === slug);
  if (index < 0) notFound();
  const lesson = LESSONS[index];
  const next = LESSONS[index + 1];
  return (
    <PageContainer className="fit-screen">
      <nav aria-label="Breadcrumb" className="muted note">
        <Link href="/learn">Learn</Link> / {lesson.track} / Lesson {index + 1} of {LESSONS.length}
      </nav>
      <div className="lesson-layout">
        <article className="panel lesson-info">
          <h1>{lesson.title}</h1>
          <p className="muted">{lesson.summary}</p>
          <h2>What you will learn</h2>
          <ul>
            {lesson.objectives.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
          <h2>The idea</h2>
          <p>{lesson.explanation}</p>
          <h2>Steps</h2>
          <ol>
            {lesson.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <p className="note muted">
            {next ? (
              <>
                Next: <Link href={`/learn/${next.slug}`}>{next.title}</Link>.{' '}
              </>
            ) : (
              'This is the final lesson. '
            )}
            More practice: <Link href="/typing-test">typing test</Link> or{' '}
            <Link href="/game">typing game</Link>.
          </p>
        </article>
        <TypingExercise lesson={lesson} nextHref={next ? `/learn/${next.slug}` : null} />
      </div>
    </PageContainer>
  );
}
