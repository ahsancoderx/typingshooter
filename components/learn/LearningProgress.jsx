'use client';
import { LinearProgress } from '@mui/material';
import LinkButton from '@/components/ui/LinkButton';
import StatCard from '@/components/ui/StatCard';
import LessonCard from '@/components/learn/LessonCard';
import { LESSONS } from '@/data/lessons';
import { useAppData } from '@/lib/storage';
import { formatDuration } from '@/lib/typingMetrics';
const TRACKS = ['Beginner', 'Intermediate', 'Advanced'];
export default function LearningProgress() {
  const { lessons } = useAppData();
  const doneCount = LESSONS.filter((l) => lessons[l.slug]?.done).length;
  const next = LESSONS.find((l) => !lessons[l.slug]?.done);
  const seconds = Object.values(lessons).reduce((s, l) => s + l.seconds, 0);
  return (
    <>
      <div className="stat-row">
        <StatCard label="Course completion" value={`${Math.round((doneCount / LESSONS.length) * 100)}%`} />
        <StatCard label="Lessons completed" value={`${doneCount} / ${LESSONS.length}`} />
        <StatCard label="Current level" value={next ? next.track : 'Course complete'} />
        <StatCard label="Practice time" value={formatDuration(seconds)} />
      </div>
      <div className="panel next-up">
        <div>
          <p className="muted">{next ? 'Recommended next lesson' : 'You finished every lesson'}</p>
          <h2>{next ? next.title : 'Keep practicing with the game and typing test'}</h2>
        </div>
        <LinkButton href={next ? `/learn/${next.slug}` : '/typing-test'} variant="contained" size="large">
          {next ? (doneCount ? 'Continue Learning' : 'Start Learning') : 'Take a typing test'}
        </LinkButton>
      </div>
      {TRACKS.map((t) => {
        const list = LESSONS.filter((l) => l.track === t);
        const d = list.filter((l) => lessons[l.slug]?.done).length;
        return (
          <section key={t} className="track" aria-labelledby={`t-${t}`}>
            <div className="track-head">
              <h2 id={`t-${t}`}>{t} track</h2>
              <span className="muted">
                {d} of {list.length} complete
              </span>
            </div>
            <LinearProgress
              variant="determinate"
              value={(d / list.length) * 100}
              aria-label={`${t} track completion`}
              sx={{ mb: 1 }}
            />
            {list.map((l) => (
              <LessonCard
                key={l.slug}
                lesson={l}
                number={LESSONS.indexOf(l) + 1}
                done={!!lessons[l.slug]?.done}
              />
            ))}
          </section>
        );
      })}
    </>
  );
}
