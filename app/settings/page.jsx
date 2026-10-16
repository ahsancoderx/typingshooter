import PageContainer from '@/components/layout/PageContainer';
import SettingsPanel from '@/components/progress/SettingsPanel';
import { buildMetadata } from '@/lib/seo';
export const metadata = buildMetadata({
  title: 'Settings',
  description:
    'Change TypeBlaster difficulty, duration, sound, and motion settings, or reset saved progress.',
  path: '/settings',
  noIndex: true,
});
export default function SettingsPage() {
  return (
    <PageContainer className="page">
      <div className="page-head">
        <h1>Settings</h1>
        <p className="muted">Saved automatically in this browser.</p>
      </div>
      <SettingsPanel />
    </PageContainer>
  );
}
