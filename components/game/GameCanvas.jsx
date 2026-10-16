'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Alert, Button } from '@mui/material';
import GameScene from '@/components/game/GameScene';
import DifficultySelector from '@/components/ui/DifficultySelector';
import StatCard from '@/components/ui/StatCard';
import { GameEngine } from '@/lib/gameEngine';
import { GAME_CONFIG } from '@/lib/gameConfig';
import { addResult, newId, useAppData } from '@/lib/storage';
import { playSound } from '@/lib/sound';
import { hasWebGL } from '@/lib/webgl';
const snap = (e) => ({
  score: e.score,
  lives: e.lives,
  acc: e.accuracy,
  wpm: e.wpm,
  combo: e.combo,
  missed: e.missed,
  popped: e.popped,
  wrong: e.wrong,
  correct: e.correct,
  time: Math.round(e.time),
});
export default function GameCanvas() {
  const { settings } = useAppData();
  const [diffO, setDiff] = useState(null);
  const [phase, setPhase] = useState('idle');
  const [engine, setEngine] = useState(null);
  const [hud, setHud] = useState(null);
  const diff = diffO ?? settings.difficulty;
  const finish = (e) => {
    addResult({
      id: newId(),
      at: Date.now(),
      kind: 'game',
      wpm: e.wpm,
      raw: e.wpm,
      acc: e.accuracy,
      correct: e.correct,
      wrong: e.wrong,
      duration: Math.round(e.time),
      difficulty: e.diff,
      label: 'game',
    });
    setHud(snap(e));
    setPhase('over');
  };
  const start = () => {
    const reduced = settings.reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sound = settings.sound;
    const eng = new GameEngine(
      diff,
      reduced,
      (ev) => {
        if (sound) playSound(ev);
      },
      () => finish(eng),
    );
    eng.setRunning(true);
    setEngine(eng);
    setHud(snap(eng));
    setPhase('playing');
  };
  useEffect(() => {
    if (phase !== 'playing' || !engine) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        engine.setRunning(false);
        setPhase('paused');
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey || !/^[a-z0-9]$/i.test(e.key)) return;
      e.preventDefault();
      engine.type(e.key.toLowerCase());
    };
    const id = setInterval(() => setHud(snap(engine)), 150);
    window.addEventListener('keydown', onKey);
    return () => {
      clearInterval(id);
      window.removeEventListener('keydown', onKey);
    };
  }, [phase, engine]);
  const resume = () => {
    if (engine) {
      engine.setRunning(true);
      setPhase('playing');
    }
  };
  if (!hasWebGL()) {
    return (
      <Alert severity="warning">
        Your browser could not start WebGL, which the 3D game needs. Try another browser or enable hardware
        acceleration, or use the <Link href="/typing-test">typing test</Link> and{' '}
        <Link href="/learn">lessons</Link>, which work without WebGL.
      </Alert>
    );
  }
  const cfg = GAME_CONFIG[diff];
  return (
    <>
      {phase === 'idle' ? (
        <section className="panel">
          <h2>Choose a difficulty</h2>
          <div className="controls">
            <DifficultySelector value={diff} onChange={setDiff} />
          </div>
          <p className="muted">{cfg.blurb}</p>
          <p className="muted note">
            A physical keyboard is recommended. Type the letters or words on the bubbles. Press Esc to pause.
          </p>
          <Button variant="contained" size="large" onClick={start}>
            Start game
          </Button>
        </section>
      ) : (
        <>
          {hud ? (
            <div className="stat-row">
              <StatCard label="Score" value={hud.score} />
              <StatCard label="Lives" value={hud.lives} />
              <StatCard label="Accuracy" value={`${hud.acc}%`} />
              <StatCard label="WPM" value={hud.wpm} />
              <StatCard label="Combo" value={`x${hud.combo}`} />
              <StatCard label="Missed" value={hud.missed} />
            </div>
          ) : null}
          <div className="game-box">
            {engine ? <GameScene engine={engine} /> : null}
            {phase === 'paused' ? (
              <div className="overlay-panel">
                <div>
                  <h2>Paused</h2>
                  <Button variant="contained" onClick={resume}>
                    Resume
                  </Button>
                </div>
              </div>
            ) : null}
            {phase === 'over' && hud ? (
              <div className="overlay-panel">
                <div className="panel">
                  <h2>Game over</h2>
                  <div className="stat-row">
                    <StatCard label="Final score" value={hud.score} />
                    <StatCard label="Accuracy" value={`${hud.acc}%`} />
                    <StatCard label="WPM" value={hud.wpm} />
                    <StatCard label="Bubbles popped" value={hud.popped} />
                    <StatCard label="Missed" value={hud.missed} />
                    <StatCard label="Survived" value={`${hud.time}s`} />
                  </div>
                  <p className="muted note">Saved in this browser.</p>
                  <div className="btn-row" style={{ justifyContent: 'center' }}>
                    <Button variant="contained" onClick={start}>
                      Play again
                    </Button>
                    <Button variant="outlined" onClick={() => setPhase('idle')}>
                      Change difficulty
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <div className="controls" style={{ marginTop: 12 }}>
            {phase === 'playing' ? (
              <Button
                variant="outlined"
                onClick={() => {
                  if (engine) engine.setRunning(false);
                  setPhase('paused');
                }}
              >
                Pause
              </Button>
            ) : null}
            <Button variant="outlined" onClick={start}>
              Restart
            </Button>
          </div>
        </>
      )}
    </>
  );
}
