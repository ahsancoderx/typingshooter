'use client';
import { useEffect, useRef, useState } from 'react';
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
  const box = useRef(null);
  useEffect(() => {
    box.current?.focus();
  }, []);
  const r = s.result;
  const passed = !!r && r.completed && r.acc >= lesson.minAcc && r.wpm >= (lesson.minWpm ?? 0);
  return (
    <>
      <div className="stat-row">
        <StatCard label="Accuracy" value={`${s.live.acc}%`} />
        <StatCard label="WPM" value={s.live.wpm} />
        <StatCard label="Errors in text" value={s.live.wrong} />
      </div>
      <TypingPassage
        text={lesson.drill}
        typed={s.typed}
        reduced={reduced}
        onKeyDown={s.handleKey}
        boxRef={box}
      />
      {r ? (
        <div className={`panel result-${passed ? 'pass' : 'fail'}`} role="status">
          <h3>{passed ? 'Lesson complete' : 'Not yet - try again'}</h3>
          <p className="muted">
            You scored {r.acc}% accuracy at {r.wpm} WPM.{' '}
            {passed
              ? 'Your progress is saved in this browser.'
              : `You need at least ${lesson.minAcc}% accuracy${lesson.minWpm ? ` and ${lesson.minWpm} WPM` : ''}. Slow down and aim for clean keystrokes.`}
          </p>
          <div className="btn-row">
            <Button variant={passed ? 'outlined' : 'contained'} onClick={onRetry}>
              Try again
            </Button>
            {nextHref ? (
              <LinkButton href={nextHref} variant={passed ? 'contained' : 'outlined'}>
                Next lesson
              </LinkButton>
            ) : null}
          </div>
        </div>
      ) : (
        <p className="muted note">Click the text and start typing. Backspace corrects mistakes.</p>
      )}
    </>
  );
}
export default function TypingExercise({ lesson, nextHref }) {
  const { lessons, settings } = useAppData();
  const [attempt, setAttempt] = useState(0);
  const rec = lessons[lesson.slug];
  return (
    <section className="panel" aria-labelledby="ex-h">
      <h2 id="ex-h">Practice exercise</h2>
      <p className="muted">
        To complete this lesson, type the whole text with at least {lesson.minAcc}% accuracy
        {lesson.minWpm ? ` and ${lesson.minWpm} WPM` : ''}.
        {rec
          ? ` Attempts: ${rec.attempts}. Best accuracy: ${rec.bestAcc}%.${rec.done ? ' Completed.' : ''}`
          : ''}
      </p>
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
