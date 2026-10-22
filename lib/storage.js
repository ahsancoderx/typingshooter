import { useSyncExternalStore } from 'react';
const KEY = 'typeblaster:v1';
const MAX_RESULTS = 200;
export const DURATIONS = [15, 30, 60, 120];
export const DEFAULTS = {
  v: 1,
  settings: { difficulty: 'medium', duration: 60, sound: true, reducedMotion: false },
  results: [],
  lessons: {},
};
const isObj = (x) => typeof x === 'object' && x !== null && !Array.isArray(x);
const isDiff = (x) => x === 'easy' || x === 'medium' || x === 'hard';
const num = (x) => typeof x === 'number' && Number.isFinite(x);
// Validates anything read from localStorage so corrupted data can never crash the app.
function sanitize(raw) {
  if (!isObj(raw) || raw.v !== 1) return DEFAULTS;
  const s = isObj(raw.settings) ? raw.settings : {};
  const settings = {
    difficulty: isDiff(s.difficulty) ? s.difficulty : DEFAULTS.settings.difficulty,
    duration: DURATIONS.includes(s.duration) ? s.duration : DEFAULTS.settings.duration,
    sound: typeof s.sound === 'boolean' ? s.sound : true,
    reducedMotion: typeof s.reducedMotion === 'boolean' ? s.reducedMotion : false,
  };
  const results = (Array.isArray(raw.results) ? raw.results : [])
    .filter(
      (r) =>
        isObj(r) &&
        typeof r.id === 'string' &&
        num(r.at) &&
        num(r.wpm) &&
        num(r.acc) &&
        num(r.duration) &&
        isDiff(r.difficulty),
    )
    .slice(-MAX_RESULTS);
  const lessons = {};
  if (isObj(raw.lessons)) {
    for (const [k, v] of Object.entries(raw.lessons)) {
      if (isObj(v) && typeof v.done === 'boolean') {
        lessons[k] = {
          done: v.done,
          attempts: num(v.attempts) ? v.attempts : 0,
          bestAcc: num(v.bestAcc) ? v.bestAcc : 0,
          bestWpm: num(v.bestWpm) ? v.bestWpm : 0,
          seconds: num(v.seconds) ? v.seconds : 0,
        };
      }
    }
  }
  return { v: 1, settings, results, lessons };
}
let cache = null;
const listeners = new Set();
function read() {
  try {
    const s = localStorage.getItem(KEY);
    return s ? sanitize(JSON.parse(s)) : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}
function write(d) {
  cache = d;
  try {
    localStorage.setItem(KEY, JSON.stringify(d));
  } catch {
    /* storage full or blocked */
  }
  listeners.forEach((l) => l());
}
function snapshot() {
  if (typeof window === 'undefined') return DEFAULTS;
  if (!cache) cache = read();
  return cache;
}
function subscribe(l) {
  listeners.add(l);
  const onStorage = (e) => {
    if (e.key === KEY) {
      cache = read();
      l();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener('storage', onStorage);
  };
}
/** Reactive, hydration-safe access to saved data (server render uses defaults). */
export function useAppData() {
  return useSyncExternalStore(subscribe, snapshot, () => DEFAULTS);
}
export function updateSettings(p) {
  const d = snapshot();
  write({ ...d, settings: { ...d.settings, ...p } });
}
export function addResult(r) {
  const d = snapshot();
  if (d.results.some((x) => x.id === r.id)) return; // protects against duplicate saves
  write({ ...d, results: [...d.results, r].slice(-MAX_RESULTS) });
}
export function saveLesson(slug, p) {
  const d = snapshot();
  const o = d.lessons[slug] ?? { done: false, attempts: 0, bestAcc: 0, bestWpm: 0, seconds: 0 };
  write({
    ...d,
    lessons: {
      ...d.lessons,
      [slug]: {
        done: o.done || p.passed,
        attempts: o.attempts + 1,
        bestAcc: Math.max(o.bestAcc, p.acc),
        bestWpm: Math.max(o.bestWpm, p.wpm),
        seconds: o.seconds + p.seconds,
      },
    },
  });
}
export function resetAll() {
  cache = DEFAULTS;
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}
export function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function soundEnabled() {
  return snapshot().settings.sound;
}
