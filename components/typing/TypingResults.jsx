'use client';
import { Button } from '@mui/material';
import LinkButton from '@/components/ui/LinkButton';
import StatCard from '@/components/ui/StatCard';
import ComboChart from '@/components/ui/ComboChart';

export default function TypingResults({ result, onRetry }) {
  const points = result.samples.map((s, i, a) => ({
    x: s.t,
    line: s.wpm,
    bar: s.errors - (i ? a[i - 1].errors : 0),
  }));
  return (
    <section className="results-fill" aria-labelledby="results-h">
      <div className="results-head">
        <h2 id="results-h">Results</h2>
        <div className="btn-row">
          <Button variant="contained" onClick={onRetry}>
            Retry
          </Button>
          <LinkButton href="/learn/identifying-weak-keys" variant="outlined">
            Practice weak areas
          </LinkButton>
          <LinkButton href="/progress" variant="text">
            All progress
          </LinkButton>
        </div>
      </div>
      <div className="stat-row compact">
        <StatCard label="WPM (correct chars)" value={result.wpm} />
        <StatCard label="Raw WPM (all chars)" value={result.raw} />
        <StatCard label="Accuracy" value={`${result.acc}%`} />
        <StatCard label="Correct characters" value={result.correct} />
        <StatCard label="Incorrect characters" value={result.wrong} />
        <StatCard label="Duration" value={`${result.duration}s`} />
      </div>
      <div className="chart-fill">
        {points.length >= 2 ? (
          <ComboChart
            points={points}
            xLabel="Time (seconds)"
            lineLabel="WPM"
            barLabel="Mistakes"
            ariaLabel="WPM and mistakes per second during the test"
          />
        ) : (
          <p className="muted note" style={{ padding: 16 }}>
            Not enough time passed to draw a graph. Try a longer test.
          </p>
        )}
      </div>
      <p className="muted note">Your result was saved in this browser.</p>
    </section>
  );
}
