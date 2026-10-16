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
/** Same inputs always give the same text, so the target never changes while typing. */
export function generateText(cat, diff, durationSec, seed) {
  const rnd = mulberry32(seed);
  const target = Math.max(160, durationSec * 8);
  const out = [];
  let len = 0;
  if (cat === 'words') {
    const pool = WORD_POOLS[diff];
    while (len < target) {
      let w = pool[Math.floor(rnd() * pool.length)];
      if (diff === 'hard') {
        // hard adds capitals and punctuation
        if (rnd() < 0.2) w = w[0].toUpperCase() + w.slice(1);
        if (rnd() < 0.15) w += rnd() < 0.5 ? ',' : '.';
      }
      out.push(w);
      len += w.length + 1;
    }
    return out.join(' ');
  }
  const list = [...PASSAGES[cat][diff]];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  for (let i = 0; len < target; i++) {
    const p = list[i % list.length];
    out.push(p);
    len += p.length + 1;
  }
  return out.join(' ');
}
