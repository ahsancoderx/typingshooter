'use client';
import { useMemo, useState, useSyncExternalStore } from 'react';
import LinkButton from '@/components/ui/LinkButton';
import EmptyState from '@/components/ui/EmptyState';
import StatCard from '@/components/ui/StatCard';
import LineChart from '@/components/ui/LineChart';
import ComboChart from '@/components/ui/ComboChart';
import { useAppData } from '@/lib/storage';
import { practiceStreak } from '@/lib/dateUtils';
import { formatDuration } from '@/lib/typingMetrics';

const DIFFS = ['easy', 'medium', 'hard'];
const TABS = [
  ['speed', 'Speed and mistakes'],
  ['accuracy', 'Accuracy'],
  ['keys', 'Mistakes by key'],
  ['history', 'History'],
  ['levels', 'By difficulty'],
];
const noop = () => () => {};
/** Current time in whole minutes; 0 during server render so prerender never reads the clock. */
const useNow = () =>
  useSyncExternalStore(
    noop,
    () => Math.floor(Date.now() / 60000) * 60000,
    () => 0,
  );

export default function ProgressDashboard() {
  const { results } = useAppData();
  const now = useNow();
  const [tab, setTab] = useState('speed');
  const d = useMemo(() => {
    const n = results.length;
    const missed = {};
    results.forEach((r) =>
      Object.entries(r.missed ?? {}).forEach(([k, v]) => {
        missed[k] = (missed[k] ?? 0) + v;
      }),
    );
    const keys = Object.entries(missed)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
    return {
      n,
      best: n ? Math.max(...results.map((r) => r.wpm)) : 0,
      avg: n ? Math.round(results.reduce((s, r) => s + r.wpm, 0) / n) : 0,
      time: results.reduce((s, r) => s + r.duration, 0),
      streak: practiceStreak(
        results.map((r) => r.at),
        now,
      ),
      keys,
      keyTotal: Object.values(missed).reduce((s, v) => s + v, 0),
    };
  }, [results, now]);

  if (!d.n) {
    return (
      <div className="fit-empty">
        <EmptyState
          title="No practice history yet"
          action={
            <LinkButton href="/typing-test" variant="contained">
              Take your first typing test
            </LinkButton>
          }
        >
          Complete a typing test, a lesson, or a game and your WPM, accuracy, mistakes, and trends will appear
          here. Nothing is shown until you have real results.
        </EmptyState>
      </div>
    );
  }
  const recent = results.slice(-30);
  const base = results.length - recent.length;
  const last = results[results.length - 1];
  const maxKey = d.keys.length ? d.keys[0][1] : 1;

  let body;
  if (tab === 'speed') {
    body = (
      <div className="tab-body chart-fill">
        <ComboChart
          points={recent.map((r, i) => ({ x: base + i + 1, line: r.wpm, bar: r.wrong ?? 0 }))}
          xLabel="Session (oldest to newest)"
          lineLabel="WPM"
          barLabel="Mistakes"
          ariaLabel="WPM and mistakes for each session"
        />
      </div>
    );
  } else if (tab === 'accuracy') {
    body = (
      <div className="tab-body chart-fill">
        <LineChart
          points={recent.map((r, i) => ({ x: base + i + 1, y: r.acc }))}
          xLabel="Session (oldest to newest)"
          yLabel="Accuracy (%)"
          yMax={100}
          ariaLabel="Accuracy for each session"
        />
      </div>
    );
  } else if (tab === 'keys') {
    body = (
      <div className="tab-body scroll">
        {d.keyTotal >= 10 ? (
          <>
            <p className="muted note" style={{ marginBottom: 12 }}>
              The keys you missed most often across tests and lessons (number of misses).
            </p>
            <div className="keybars">
              {d.keys.map(([k, v]) => (
                <div className="keybar" key={k}>
                  <kbd>{k === ' ' ? 'Space' : k}</kbd>
                  <i style={{ width: `${Math.max(6, (v / maxKey) * 100)}%` }} />
                  <b>{v}</b>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <LinkButton href="/learn/identifying-weak-keys" variant="outlined" size="small">
                Practice weak keys
              </LinkButton>
            </div>
          </>
        ) : (
          <p className="muted">
            Not enough data yet. Mistakes by key appear after at least 10 missed keystrokes in tests or
            lessons.
          </p>
        )}
      </div>
    );
  } else if (tab === 'history') {
    body = (
      <div className="tab-body scroll">
        <table className="bench data">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Type</th>
              <th scope="col">Level</th>
              <th scope="col">WPM</th>
              <th scope="col">Accuracy</th>
              <th scope="col">Mistakes</th>
              <th scope="col">Time</th>
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
                  <td>{r.wrong ?? 0}</td>
                  <td>{r.duration}s</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  } else {
    body = (
      <div className="tab-body scroll">
        <table className="bench data">
          <thead>
            <tr>
              <th scope="col">Level</th>
              <th scope="col">Sessions</th>
              <th scope="col">Average WPM</th>
              <th scope="col">Average accuracy</th>
              <th scope="col">Mistakes</th>
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
                  <td>{l.reduce((s, r) => s + (r.wrong ?? 0), 0)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="dash">
      <div className="stat-row compact">
        <StatCard label="Completed sessions" value={d.n} />
        <StatCard label="Best WPM" value={d.best} />
        <StatCard label="Average WPM" value={d.avg} />
        <StatCard label="Latest accuracy" value={`${last.acc}%`} />
        <StatCard label="Practice time" value={formatDuration(d.time)} />
        <StatCard label="Day streak" value={d.streak} />
      </div>
      <section className="panel dash-main" aria-label="Progress charts">
        <div className="tabs" role="tablist" aria-label="Progress views">
          {TABS.map(([id, label]) => (
            <button
              key={id}
              id={`tab-${id}`}
              type="button"
              role="tab"
              className="tab"
              aria-selected={tab === id}
              aria-controls="tab-panel"
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <div id="tab-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="dash-panel-body">
          {body}
        </div>
      </section>
    </div>
  );
}
