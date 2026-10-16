import PageContainer from '@/components/layout/PageContainer';
import LearningProgress from '@/components/learn/LearningProgress';
import { buildMetadata } from '@/lib/seo';
export const metadata = buildMetadata({
  title: 'Learn Touch Typing - Free Typing Lessons for Beginners',
  description:
    'A free 20-lesson touch typing course from home row keys to programming text. Each lesson has a practice exercise, and your progress is saved in your browser.',
  path: '/learn',
});
export default function LearnPage() {
  return (
    <PageContainer className="page">
      <div className="page-head">
        <h1>Learn touch typing</h1>
        <p className="muted">
          Twenty lessons in three tracks. Each one explains a skill and ends with a typing exercise. A lesson
          is marked complete only when you meet its accuracy (and speed, where listed) requirement.
        </p>
      </div>
      <LearningProgress />
    </PageContainer>
  );
}
