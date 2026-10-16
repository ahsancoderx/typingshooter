let ctx = null;
const P = {
  shoot: [620, 180, 'square', 0.04, 0.1],
  pop: [420, 70, 'sawtooth', 0.06, 0.22],
  wrong: [140, 90, 'sawtooth', 0.06, 0.14],
  miss: [200, 60, 'triangle', 0.08, 0.3],
};
export function playSound(name) {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    const [f1, f2, type, vol, dur] = P[name];
    const t = ctx.currentTime,
      o = ctx.createOscillator(),
      g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f1, t);
    o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(t + dur);
  } catch {
    /* audio unavailable */
  }
}
