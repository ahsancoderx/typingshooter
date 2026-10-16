'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { calcMetrics } from '@/lib/typingMetrics';
const K0 = { total: 0, right: 0, missed: {} };
const countCorrect = (typed, text) => {
  let c = 0;
  for (let i = 0; i < typed.length; i++) if (typed[i] === text[i]) c++;
  return c;
};
/** Shared typing engine for the typing test and lesson exercises. Remount (change `key`) to reset. */
export function useTypingSession(text, durationSec, onFinish, onWrong) {
  const [typed, setTyped] = useState('');
  const [k, setK] = useState(K0);
  const [status, setStatus] = useState('idle');
  const [elapsed, setElapsed] = useState(0);
  const [samples, setSamples] = useState([]);
  const [result, setResult] = useState(null);
  const start = useRef(0);
  const done = useRef(false);
  const latest = useRef({ typed, k, samples });
  const cb = useRef({ onFinish, onWrong });
  useEffect(() => {
    latest.current = { typed, k, samples };
    cb.current = { onFinish, onWrong };
  });
  const finish = useCallback(
    (t, kk, secs, smp) => {
      if (done.current) return;
      done.current = true;
      const correct = countCorrect(t, text);
      const m = calcMetrics(correct, kk.total, kk.right, secs);
      const r = {
        ...m,
        correct,
        wrong: t.length - correct,
        duration: Math.round(secs),
        missed: kk.missed,
        samples: smp,
        completed: t.length >= text.length,
      };
      setResult(r);
      setStatus('done');
      setElapsed(secs);
      cb.current.onFinish(r);
    },
    [text],
  );
  useEffect(() => {
    if (status !== 'running') return;
    const id = setInterval(() => {
      const secs = (performance.now() - start.current) / 1000;
      setElapsed(secs);
      const { typed: t, k: kk, samples: smp } = latest.current;
      const sec = Math.floor(secs);
      let current = smp;
      if (sec > smp.length) {
        current = [...smp, { t: sec, wpm: calcMetrics(countCorrect(t, text), kk.total, kk.right, sec).wpm }];
        latest.current.samples = current;
        setSamples(current);
      }
      if (durationSec && secs >= durationSec) finish(t, kk, durationSec, current);
    }, 200);
    return () => clearInterval(id);
  }, [status, durationSec, text, finish]);
  const handleKey = (e) => {
    if (status === 'done' || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (status === 'running') setTyped((t) => t.slice(0, -1));
      return;
    }
    if (e.key.length !== 1) return;
    e.preventDefault();
    const { typed: t, k: kk } = latest.current;
    if (t.length >= text.length) return;
    if (status === 'idle') {
      start.current = performance.now();
      setStatus('running');
    }
    const expected = text[t.length],
      ok = expected === e.key,
      nt = t + e.key;
    const nk = {
      total: kk.total + 1,
      right: kk.right + (ok ? 1 : 0),
      missed: ok ? kk.missed : { ...kk.missed, [expected]: (kk.missed[expected] ?? 0) + 1 },
    };
    latest.current = { ...latest.current, typed: nt, k: nk };
    if (!ok) cb.current.onWrong?.();
    setTyped(nt);
    setK(nk);
    if (nt.length >= text.length)
      finish(nt, nk, (performance.now() - start.current) / 1000, latest.current.samples);
  };
  const correct = countCorrect(typed, text);
  const live = { ...calcMetrics(correct, k.total, k.right, elapsed), correct, wrong: typed.length - correct };
  return { typed, status, elapsed, live, samples, result, handleKey };
}
