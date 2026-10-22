'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Alert, Button } from '@mui/material';
import GameScene from '@/components/game/GameScene';
import DifficultySelector from '@/components/ui/DifficultySelector';
import StatCard from '@/components/ui/StatCard';
import ComboChart from '@/components/ui/ComboChart';
import LinkButton from '@/components/ui/LinkButton';
import { GameEngine } from '@/lib/gameEngine';
import { GAME_CONFIG } from '@/lib/gameConfig';
import { addResult, newId, soundEnabled, updateSettings, useAppData } from '@/lib/storage';
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
  samples: [...e.samples],
  target: e.active ? { text: e.active.text, progress: e.active.progress } : null,
});

const rating = (wpm, acc) => {
  if (wpm >= 60 && acc >= 95) return 'Typing Master';
  if (wpm >= 40 && acc >= 90) return 'Fast Typist';
  if (wpm >= 25 && acc >= 80) return 'Solid Typist';
  return 'Keep practicing';
};

export default function GameCanvas() {
  const { settings } = useAppData();
  const [diffO, setDiff] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle | playing | paused | over
  const [engine, setEngine] = useState(null);
  const [hud, setHud] = useState(null);
  const diff = diffO ?? settings.difficulty;

  // fullscreen
  const boxRef = useRef(null);
  const [full, setFull] = useState(false);

  useEffect(() => {
    const on = () => setFull(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', on);
    return () => document.removeEventListener('fullscreenchange', on);
  }, []);

  const toggleFull = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      boxRef.current?.requestFullscreen?.();
    }
  };

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
    const eng = new GameEngine(
      diff,
      reduced,
      (ev) => {
        if (soundEnabled()) playSound(ev);
      },
      () => finish(eng),
    );
    eng.setRunning(true);
    setEngine(eng);
    setHud(snap(eng));
    setPhase('playing');
  };

  useEffect(() => {
    if (phase !== 'playing' || !engine) return undefined;
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

  const pause = () => {
    if (engine) engine.setRunning(false);
    setPhase('paused');
  };
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
        <Link href="/learn">lessons</Link>.
      </Alert>
    );
  }

  const idle = phase === 'idle' || !hud;

  const stats = idle
    ? []
    : [
        ['Score', hud.score],
        ['Lives', hud.lives],
        ['Accuracy', `${hud.acc}%`],
        ['WPM', hud.wpm],
        ['Combo', `x${hud.combo}`],
        ['Missed', hud.missed],
      ];
  const points = idle
    ? []
    : hud.samples.map((s, i, a) => ({
        x: s.t,
        line: s.wpm,
        bar: s.errors - (i ? a[i - 1].errors : 0),
      }));

  // One single wrapper div for every phase, so fullscreen stays active when the game starts/restarts/ends.
  return (
    <div className={idle ? 'game-box idle' : 'game-box'} ref={boxRef}>
      {idle ? (
        <section className="panel game-menu">
          <span className="tag">TypeBlaster</span>
          <h2>Choose a difficulty</h2>
          <div className="controls">
            <DifficultySelector value={diff} onChange={setDiff} />
          </div>
          <p className="muted">{GAME_CONFIG[diff].blurb}</p>
          <p className="muted note">
            A physical keyboard is recommended. Type the letters or words on the bubbles. Esc pauses.
          </p>
          <div className="btn-row">
            <Button variant="contained" size="large" onClick={start}>
              Start game
            </Button>
            <Button variant="outlined" size="large" onClick={toggleFull}>
              {full ? 'Exit fullscreen' : 'Fullscreen'}
            </Button>
          </div>
        </section>
      ) : (
        <>
          {engine ? <GameScene engine={engine} /> : null}
          <div className="game-hud">
            <div className="hud-stats">
              {stats.map(([l, v]) => (
                <div className="hud-stat" key={l}>
                  <b>{v}</b>
                  <span>{l}</span>
                </div>
              ))}
            </div>
            <div className="hud-actions">
              {phase === 'playing' ? (
                <Button size="small" variant="outlined" onClick={pause}>
                  Pause
                </Button>
              ) : null}
              <Button size="small" variant="outlined" onClick={start}>
                Restart
              </Button>
              <Button size="small" variant="outlined" onClick={() => updateSettings({ sound: !settings.sound })}>
                Sound: {settings.sound ? 'On' : 'Off'}
              </Button>
              <Button size="small" variant="outlined" onClick={toggleFull}>
                {full ? 'Exit full' : 'Fullscreen'}
              </Button>
            </div>
          </div>
          <div className="game-target">
            {hud.target ? (
              <>
                <span className="hit">{hud.target.text.slice(0, hud.target.progress)}</span>
                {hud.target.text.slice(hud.target.progress)}
              </>
            ) : (
              'Type a letter to lock on'
            )}
          </div>

          {phase === 'paused' ? (
            <div className="overlay-panel">
              <div className="panel">
                <h2>Paused</h2>
                <Button variant="contained" onClick={resume}>
                  Resume
                </Button>
              </div>
            </div>
          ) : null}

          {phase === 'over' ? (
            <div className="overlay-panel">
              <div className="panel result-panel">
                <span className="tag">Game over</span>
                <h2>{rating(hud.wpm, hud.acc)}</h2>
                <div className="stat-row compact">
                  <StatCard label="Final score" value={hud.score} />
                  <StatCard label="Accuracy" value={`${hud.acc}%`} />
                  <StatCard label="WPM" value={hud.wpm} />
                  <StatCard label="Bubbles popped" value={hud.popped} />
                  <StatCard label="Missed bubbles" value={hud.missed} />
                  <StatCard label="Correct characters" value={hud.correct} />
                  <StatCard label="Incorrect keystrokes" value={hud.wrong} />
                  <StatCard label="Survived" value={`${hud.time}s`} />
                </div>
                {points.length >= 2 ? (
                  <div className="chart-fill mini">
                    <ComboChart
                      points={points}
                      xLabel="Time (seconds)"
                      lineLabel="WPM"
                      barLabel="Mistakes"
                      ariaLabel="WPM and mistakes per second in this game"
                    />
                  </div>
                ) : (
                  <p className="muted note">You survived less than 2 seconds, so there is no graph yet.</p>
                )}
                <div className="btn-row" style={{ justifyContent: 'center' }}>
                  <Button variant="contained" onClick={start}>
                    Play again
                  </Button>
                  <Button variant="outlined" onClick={() => setPhase('idle')}>
                    Change difficulty
                  </Button>
                  <Button variant="outlined" onClick={toggleFull}>
                    {full ? 'Exit fullscreen' : 'Fullscreen'}
                  </Button>
                  <LinkButton href="/progress" variant="outlined">
                    All progress
                  </LinkButton>
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}