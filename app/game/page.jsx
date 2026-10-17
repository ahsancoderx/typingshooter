import PageContainer from '@/components/layout/PageContainer';
import GameLoader from '@/components/game/GameLoader';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'TypeBlaster - Free Typing Shooter Game Online',
  description:
    'Play a free 3D typing shooter game. Type the letters and words on falling bubbles to fire your cannon, with Easy, Medium, and Hard difficulty.',
  path: '/game',
});

export default function GamePage() {
  return (
    <PageContainer className="fit-screen">
      <h1 className="sr-only">TypeBlaster typing game</h1>
      <GameLoader />
      <details className="info">
        <summary>How the game works</summary>
        <p>
          Bubbles fall toward the red danger line. Type the first letter of a word to lock on, then finish the
          word to pop the bubble. A wrong letter resets your combo, and every bubble that gets through costs a
          life. Harder levels move faster, use longer words, show more bubbles at once, and give fewer lives.
          Your result is saved in this browser and appears on the Progress page.
        </p>
      </details>
    </PageContainer>
  );
}
