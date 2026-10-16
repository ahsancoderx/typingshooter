'use client';
import dynamic from 'next/dynamic';
import { CircularProgress } from '@mui/material';
const GameCanvas = dynamic(() => import('@/components/game/GameCanvas'), {
  ssr: false,
  loading: () => (
    <div className="panel empty" role="status">
      <CircularProgress size={28} />
      <p className="muted">Loading the 3D arena...</p>
    </div>
  ),
});
export default function GameLoader() {
  return <GameCanvas />;
}
