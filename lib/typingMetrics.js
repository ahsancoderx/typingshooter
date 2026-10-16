/**
 * WPM      = correctly typed characters / 5 / elapsed minutes
 * Raw WPM  = all typed characters (including mistakes) / 5 / elapsed minutes
 * Accuracy = correct keystrokes / total keystrokes x 100. Mistakes stay counted
 *            even if you fix them with Backspace (Backspace itself is not counted).
 * Elapsed time is floored at 1 second to avoid spikes and division by zero.
 */
export function calcMetrics(correctChars, totalKeys, correctKeys, seconds) {
  const minutes = Math.max(seconds, 1) / 60;
  return {
    wpm: Math.round(correctChars / 5 / minutes),
    raw: Math.round(totalKeys / 5 / minutes),
    acc: totalKeys > 0 ? Math.round((correctKeys / totalKeys) * 100) : 100,
  };
}
export function formatDuration(sec) {
  const m = Math.floor(sec / 60);
  return m > 0 ? `${m}m ${Math.round(sec % 60)}s` : `${Math.round(sec)}s`;
}
