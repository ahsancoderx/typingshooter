export function dayKey(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
/** Consecutive practice days ending today (or yesterday, so the streak is not lost until a day is skipped). */
export function practiceStreak(timestamps, now) {
  const days = new Set(timestamps.map(dayKey));
  let streak = 0;
  const d = new Date(now);
  if (!days.has(dayKey(d.getTime()))) d.setDate(d.getDate() - 1);
  while (days.has(dayKey(d.getTime()))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}
