'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, LinearProgress, ToggleButton, ToggleButtonGroup } from '@mui/material';
import DifficultySelector from '@/components/ui/DifficultySelector';
import DurationSelector from '@/components/ui/DurationSelector';
import StatCard from '@/components/ui/StatCard';
import TypingPassage from '@/components/typing/TypingPassage';
import TypingResults from '@/components/typing/TypingResults';
import { useTypingSession } from '@/hooks/useTypingSession';
import { generateText } from '@/lib/textGenerator';
import { addResult, newId, useAppData } from '@/lib/storage';
import { playSound } from '@/lib/sound';
const CATS = [
  ['words', 'Common Words'],
  ['paragraphs', 'Paragraphs'],
  ['quotes', 'Quotes'],
  ['code', 'Programming'],
];
function TestSession({ cat, diff, dur, seed, sound, reduced, onCat, onDiff, onDur, onRestart }) {
  const text = useMemo(() => generateText(cat, diff, dur, seed), [cat, diff, dur, seed]);
  const s = useTypingSession(
    text,
    dur,
    (r) =>
      addResult({
        id: newId(),
        at: Date.now(),
        kind: 'test',
        wpm: r.wpm,
        raw: r.raw,
        acc: r.acc,
        correct: r.correct,
        wrong: r.wrong,
        duration: r.duration,
        difficulty: diff,
        label: cat,
        missed: r.missed,
      }),
    () => {
      if (sound) playSound('wrong');
    },
  );
  const box = useRef(null);
  useEffect(() => {
    box.current?.focus();
  }, []);
  const locked = s.status === 'running';
  const left = s.status === 'idle' ? dur : Math.max(0, Math.ceil(dur - s.elapsed));
  return (
    <>
      <div className="controls">
        <DifficultySelector value={diff} onChange={onDiff} disabled={locked} />
        <DurationSelector value={dur} onChange={onDur} disabled={locked} />
        <ToggleButtonGroup
          exclusive
          size="small"
          color="primary"
          value={cat}
          disabled={locked}
          aria-label="Text category"
          onChange={(_, v) => {
            if (v) onCat(v);
          }}
        >
          {CATS.map(([v, l]) => (
            <ToggleButton key={v} value={v}>
              {l}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Button variant="outlined" onClick={onRestart}>
          Restart test
        </Button>
      </div>

      <div className="stat-row">
        <StatCard label="WPM" value={s.live.wpm} />
        <StatCard label="Raw WPM" value={s.live.raw} />
        <StatCard label="Accuracy" value={`${s.live.acc}%`} />
        <StatCard label="Correct" value={s.live.correct} />
        <StatCard label="Incorrect" value={s.live.wrong} />
        <StatCard label="Time left" value={`${left}s`} />
      </div>
      <LinearProgress
        variant="determinate"
        value={Math.min(100, (s.typed.length / text.length) * 100)}
        aria-label="Progress through the passage"
        sx={{ mb: 2 }}
      />

      <TypingPassage text={text} typed={s.typed} reduced={reduced} onKeyDown={s.handleKey} boxRef={box} />
      <p className="muted note">
        {s.status === 'idle'
          ? 'The timer starts on your first keystroke. A physical keyboard is recommended.'
          : s.status === 'running'
            ? 'Backspace corrects mistakes. Settings are locked while the test runs.'
            : 'Test finished.'}
      </p>
      {s.result ? <TypingResults result={s.result} onRetry={onRestart} /> : null}
    </>
  );
}
export default function TypingTest() {
  const { settings } = useAppData();
  const [diffO, setDiff] = useState(null);
  const [durO, setDur] = useState(null);
  const [cat, setCat] = useState('words');
  const [seed, setSeed] = useState(1);
  const diff = diffO ?? settings.difficulty,
    dur = durO ?? settings.duration;
  return (
    <TestSession
      key={`${seed}-${cat}-${diff}-${dur}`}
      cat={cat}
      diff={diff}
      dur={dur}
      seed={seed}
      sound={settings.sound}
      reduced={settings.reducedMotion}
      onCat={setCat}
      onDiff={setDiff}
      onDur={setDur}
      onRestart={() => setSeed(Date.now())}
    />
  );
}
