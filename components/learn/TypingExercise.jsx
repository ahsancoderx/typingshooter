'use client';
import { useState } from 'react';
import { Button } from '@mui/material';
import LinkButton from '@/components/ui/LinkButton';
import StatCard from '@/components/ui/StatCard';
import TypingPassage from '@/components/typing/TypingPassage';
import { useTypingSession } from '@/hooks/useTypingSession';
import { addResult, newId, saveLesson, useAppData } from '@/lib/storage';

function Session({ lesson, nextHref, onRetry, reduced }) {
  const s = useTypingSession(lesson.drill, null, (r) => {
    const passed = r.completed && r.acc >= lesson.minAcc && r.wpm >= (lesson.minWpm ?? 0);
    saveLesson(lesson.slug, { acc: r.acc, wpm: r.wpm, seconds: r.duration, passed });
    addResult({
      id: newId(),
      at: Date.now(),
      kind: 'lesson',
      wpm: r.wpm,
      raw: r.raw,
      acc: r.acc,
      correct: r.correct,
      wrong: r.wrong,
      duration: r.duration,
      difficulty: 'easy',
      label: lesson.slug,
      missed: r.missed,
    });
  });
  const r = s.result;
  const passed = !!r && r.completed && r.acc >= lesson.minAcc && r.wpm >= (lesson.minWpm ?? 0);
  if (r) {
    return (
      <div className={`exercise-result result-${passed ? 'pass' : 'fail'}`} role="status">
        <h3>{passed ? 'Lesson complete' : 'Not yet - try again'}</h3>
        <div className="stat-row compact">
          <StatCard label="Accuracy" value={`${r.acc}%`} />
          <StatCard label="WPM" value={r.wpm} />
          <StatCard label="Time" value={`${r.duration}s`} />
        </div>
        <p className="muted">
          {passed
            ? 'Your progress is saved in this browser.'
            : `You need at least ${lesson.minAcc}% accuracy${lesson.minWpm ? ` and ${lesson.minWpm} WPM` : ''}. Slow down and aim for clean keystrokes.`}
        </p>
        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <Button variant={passed ? 'outlined' : 'contained'} onClick={onRetry}>
            Try again
          </Button>
          {nextHref ? (
            <LinkButton href={nextHref} variant={passed ? 'contained' : 'outlined'}>
              Next lesson
            </LinkButton>
          ) : null}
          <LinkButton href="/progress" variant="text">
            Progress
          </LinkButton>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="stat-row compact">
        <StatCard label="Accuracy" value={`${s.live.acc}%`} />
        <StatCard label="WPM" value={s.live.wpm} />
        <StatCard label="Errors in text" value={s.live.wrong} />
      </div>
      <div className="passage-center">
        <TypingPassage
          text={lesson.drill}
          typed={s.typed}
          reduced={reduced}
          onKeyDown={s.handleKey}
          lines={3}
        />
      </div>
      <p className="muted note center">Click the text and start typing. Backspace corrects mistakes.</p>
    </>
  );
}

export default function TypingExercise({ lesson, nextHref }) {
  const { lessons, settings } = useAppData();
  const [attempt, setAttempt] = useState(0);
  const rec = lessons[lesson.slug];
  return (
    <section className="panel exercise" aria-labelledby="ex-h">
      <div className="exercise-head">
        <h2 id="ex-h">Practice exercise</h2>
        <p className="muted note">
          Complete it with at least {lesson.minAcc}% accuracy
          {lesson.minWpm ? ` and ${lesson.minWpm} WPM` : ''}.
          {rec
            ? ` Attempts: ${rec.attempts}. Best accuracy: ${rec.bestAcc}%.${rec.done ? ' Completed.' : ''}`
            : ''}
        </p>
      </div>
      <Session
        key={attempt}
        lesson={lesson}
        nextHref={nextHref}
        reduced={settings.reducedMotion}
        onRetry={() => setAttempt((a) => a + 1)}
      />
    </section>
  );
}
