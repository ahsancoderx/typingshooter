'use client';
import { useMemo, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import LinkButton from '@/components/ui/LinkButton';
import EmptyState from '@/components/ui/EmptyState';
import StatCard from '@/components/ui/StatCard';
import LineChart from '@/components/ui/LineChart';
import { useAppData } from '@/lib/storage';
import { practiceStreak } from '@/lib/dateUtils';
import { formatDuration } from '@/lib/typingMetrics';
const Progress3DChart = dynamic(() => import('@/components/progress/Progress3DChart'), { ssr: false });
const noop = () => () => {};
/** Current time in whole minutes; 0 during server render so prerender never reads the clock. */
const useNow = () =>
  useSyncExternalStore(
    noop,
    () => Math.floor(Date.now() / 60000) * 60000,
    () => 0,
  );
const DIFFS = ['easy', 'medium', 'hard'];
export default function ProgressDashboard() {
  const { results } = useAppData();
  const now = useNow();
  const d = useMemo(() => {
    const n = results.length;
    const missed = {};
    results.forEach((r) =>
      Object.entries(r.missed ?? {}).forEach(([k, v]) => {
        missed[k] = (missed[k] ?? 0) + v;
      }),
    );
    const weak = Object.entries(missed)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
    return {
      n,
      best: n ? Math.max(...results.map((r) => r.wpm)) : 0,
      avg: n ? Math.round(results.reduce((s, r) => s + r.wpm, 0) / n) : 0,
      time: results.reduce((s, r) => s + r.duration, 0),
      streak: practiceStreak(
        results.map((r) => r.at),
        now,
      ),
      weak,
      weakTotal: Object.values(missed).reduce((s, v) => s + v, 0),
    };
  }, [results, now]);
  if (!d.n) {
    return (
      <EmptyState
        title="No practice history yet"
        action={
          <LinkButton href="/typing-test" variant="contained">
            Take your first typing test
          </LinkButton>
        }
      >
        Complete a typing test, a lesson, or a game and your WPM, accuracy, and trends will appear here.
        Nothing is shown until you have real results.
      </EmptyState>
    );
  }
  const recent = results.slice(-30);
  const base = results.length - recent.length;
  const last = results[results.length - 1];
  const bars = results.slice(-12).map((r, i, a) => ({ n: results.length - a.length + i + 1, wpm: r.wpm }));
  return (
    <>
      <div className="stat-row">
        <StatCard label="Completed sessions" value={d.n} />
        <StatCard label="Best WPM" value={d.best} />
        <StatCard label="Average WPM" value={d.avg} />
        <StatCard label="Latest accuracy" value={`${last.acc}%`} />
        <StatCard label="Practice time" value={formatDuration(d.time)} />
        <StatCard label="Day streak" value={d.streak} />
      </div>

      <section className="panel" aria-labelledby="wpm-h">
        <h2 id="wpm-h">WPM trend</h2>
        <LineChart
          points={recent.map((r, i) => ({ x: base + i + 1, y: r.wpm }))}
          xLabel="Session number (oldest to newest)"
          yLabel="WPM"
          ariaLabel="WPM per session"
        />
        <h2>Accuracy trend</h2>
        <LineChart
          points={recent.map((r, i) => ({ x: base + i + 1, y: r.acc }))}
          xLabel="Session number (oldest to newest)"
          yLabel="Accuracy (%)"
          yMax={100}
          ariaLabel="Accuracy per session"
        />
      </section>

      <section className="panel" aria-labelledby="d3-h">
        <h2 id="d3-h">3D view: last {bars.length} sessions</h2>
        <p className="muted note">Drag to rotate. Bar height is WPM. The table below lists the same data.</p>
        <Progress3DChart bars={bars} />
      </section>

      <section className="panel" aria-labelledby="hist-h">
        <h2 id="hist-h">Recent history</h2>
        <div className="table-scroll">
          <table className="bench data">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Type</th>
                <th scope="col">Difficulty</th>
                <th scope="col">WPM</th>
                <th scope="col">Accuracy</th>
                <th scope="col">Duration</th>
              </tr>
            </thead>
            <tbody>
              {results
                .slice(-10)
                .reverse()
                .map((r) => (
                  <tr key={r.id}>
                    <td>{new Date(r.at).toLocaleDateString()}</td>
                    <td>{r.kind}</td>
                    <td>{r.difficulty}</td>
                    <td>{r.wpm}</td>
                    <td>{r.acc}%</td>
                    <td>{r.duration}s</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel" aria-labelledby="diff-h">
        <h2 id="diff-h">Difficulty breakdown</h2>
        <div className="table-scroll">
          <table className="bench data">
            <thead>
              <tr>
                <th scope="col">Difficulty</th>
                <th scope="col">Sessions</th>
                <th scope="col">Average WPM</th>
                <th scope="col">Average accuracy</th>
              </tr>
            </thead>
            <tbody>
              {DIFFS.map((df) => {
                const l = results.filter((r) => r.difficulty === df);
                return (
                  <tr key={df}>
                    <td>{df}</td>
                    <td>{l.length}</td>
                    <td>{l.length ? Math.round(l.reduce((s, r) => s + r.wpm, 0) / l.length) : '-'}</td>
                    <td>{l.length ? `${Math.round(l.reduce((s, r) => s + r.acc, 0) / l.length)}%` : '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel" aria-labelledby="weak-h">
        <h2 id="weak-h">Weak keys</h2>
        {d.weakTotal >= 10 ? (
          <>
            <p className="muted">Keys you missed most often across tests and lessons (times missed):</p>
            <ul className="weak-list">
              {d.weak.map(([k, v]) => (
                <li key={k}>
                  <kbd>{k === ' ' ? 'Space' : k}</kbd> {v}
                </li>
              ))}
            </ul>
            <LinkButton href="/learn/identifying-weak-keys" variant="outlined">
              Practice weak keys
            </LinkButton>
          </>
        ) : (
          <p className="muted">
            Not enough data yet. Weak keys appear after you have missed at least 10 keystrokes in tests or
            lessons.
          </p>
        )}
      </section>
    </>
  );
}
