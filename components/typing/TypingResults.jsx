'use client';
import { Button } from '@mui/material';
import LinkButton from '@/components/ui/LinkButton';
import StatCard from '@/components/ui/StatCard';
import LineChart from '@/components/ui/LineChart';
export default function TypingResults({ result, onRetry }) {
  return (
    <section className="panel" aria-labelledby="results-h">
      <h2 id="results-h">Results</h2>
      <div className="stat-row">
        <StatCard label="WPM (correct chars)" value={result.wpm} />
        <StatCard label="Raw WPM (all chars)" value={result.raw} />
        <StatCard label="Accuracy" value={`${result.acc}%`} />
        <StatCard label="Correct characters" value={result.correct} />
        <StatCard label="Incorrect characters" value={result.wrong} />
        <StatCard label="Duration" value={`${result.duration}s`} />
      </div>
      <div className="chart-wrap">
        {result.samples.length >= 2 ? (
          <LineChart
            points={result.samples.map((s) => ({ x: s.t, y: s.wpm }))}
            xLabel="Time (seconds)"
            yLabel="WPM"
            ariaLabel="WPM over time during the test"
          />
        ) : (
          <p className="muted">Not enough time passed to draw a WPM-over-time graph. Try a longer test.</p>
        )}
      </div>
      <p className="muted note">Your result was saved in this browser.</p>
      <div className="btn-row">
        <Button variant="contained" onClick={onRetry}>
          Retry
        </Button>
        <LinkButton href="/learn/identifying-weak-keys" variant="outlined">
          Practice weak areas
        </LinkButton>
      </div>
    </section>
  );
}
