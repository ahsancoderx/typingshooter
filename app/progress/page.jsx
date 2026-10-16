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
    <PageContainer className="page">
      <div className="page-head">
        <h1>Your typing progress</h1>
        <p className="muted">
          Everything here is calculated from your own saved sessions. It is stored in this browser and is not
          shared.
        </p>
      </div>
      <ProgressDashboard />
    </PageContainer>
  );
}
