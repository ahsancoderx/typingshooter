import { PASSAGES } from '@/data/passages';
import { WORD_POOLS } from '@/data/wordPools';

function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Same inputs always give the same text, so the target never changes while typing.
 * Passages are visited in a seed-based order, so consecutive seeds give different passages.
 */
export function generateText(cat, diff, durationSec, seed) {
  const rnd = mulberry32(seed);
  const target = Math.max(160, durationSec * 8);
  const out = [];
  let len = 0;
  if (cat === 'words') {
    const pool = WORD_POOLS[diff];
    let prev = '';
    while (len < target) {
      let w = pool[Math.floor(rnd() * pool.length)];
      if (w === prev) w = pool[(pool.indexOf(w) + 1) % pool.length];
      prev = w;
      if (diff === 'hard') {
        if (rnd() < 0.2) w = w[0].toUpperCase() + w.slice(1);
        if (rnd() < 0.15) w += rnd() < 0.5 ? ',' : '.';
      }
      out.push(w);
      len += w.length + 1;
    }
    return out.join(' ');
  }
  const list = PASSAGES[cat][diff];
  const n = list.length;
  const stride = [7, 5, 3].find((s) => n % s !== 0) ?? 1; // coprime step visits every passage once
  let idx = (Math.abs(seed) * stride) % n;
  for (let i = 0; len < target; i++) {
    const p = list[idx];
    out.push(p);
    len += p.length + 1;
    idx = (idx + stride) % n;
    if (i > 200) break;
  }
  return out.join(' ');
}
