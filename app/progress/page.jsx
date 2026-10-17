import PageContainer from '@/components/layout/PageContainer';
import ProgressDashboard from '@/components/progress/ProgressDashboard';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Typing Progress Tracker - WPM and Accuracy Over Time',
  description:
    'Track your typing speed and accuracy over time with charts built from your own saved results. Your data stays in your browser.',
  path: '/progress',
});

export default function ProgressPage() {
  return (
    <PageContainer className="fit-screen">
      <div className="fit-head">
        <h1 className="fit-title">Your typing progress</h1>
        <p className="muted note">Built only from your own saved sessions, stored in this browser.</p>
      </div>
      <ProgressDashboard />
    </PageContainer>
  );
}
