import PageContainer from '@/components/layout/PageContainer';
import GameLoader from '@/components/game/GameLoader';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'TypeBlaster - Free Typing Shooter Game Online',
  description: 'Play a free 3D typing shooter game. Type the letters and words on falling bubbles to fire your cannon, with Easy, Medium, and Hard difficulty.',
  path: '/game',
});

export default function GamePage() {
  return (
    <PageContainer className="page">
      <div className="page-head">
        <h1>TypeBlaster typing game</h1>
        <p className="muted">Bubbles fall toward the red danger line. Type the letters or word on a bubble and your cannon fires at it. Every bubble that gets through costs a life.</p>
      </div>
      <GameLoader />
      <section className="prose">
        <h2>How the game works</h2>
        <p>Type the first letter of a word to lock on, then finish the word to pop the bubble. Typing the wrong letter resets your combo. Harder levels move faster, use longer words, show more bubbles at once, and give fewer lives. Your result is saved in this browser and appears on the Progress page.</p>
      </section>
    </PageContainer>
  );
}
