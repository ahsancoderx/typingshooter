import { GAME_CONFIG, WORLD, POOL } from '@/lib/gameConfig';
import { WORD_POOLS } from '@/data/wordPools';
const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
/** Pure game logic: no React or Three.js. The scene only reads this object each frame. */
export class GameEngine {
  time = 0;
  running = false;
  over = false;
  halfW = 6;
  score = 0;
  correct = 0;
  wrong = 0;
  total = 0;
  popped = 0;
  missed = 0;
  combo = 0;
  bestCombo = 0;
  active = null;
  aim = 0;
  recoil = 0;
  wrongT = 0;
  spawnT = 0.5;
  samples = [];
  sampleT = 0;
  constructor(diff, reduced, onEvent, onOver) {
    this.diff = diff;
    this.reduced = reduced;
    this.onEvent = onEvent;
    this.onOver = onOver;
    this.cfg = GAME_CONFIG[diff];
    this.lives = this.cfg.lives;
    this.pool = WORD_POOLS[diff].filter((w) => w.length >= this.cfg.minLen && w.length <= this.cfg.maxLen);
    this.bubbles = Array.from({ length: POOL.bubbles }, () => ({
      alive: false,
      dying: false,
      text: '',
      x: 0,
      y: 0,
      baseX: 0,
      phase: 0,
      r: 1,
      progress: 0,
      version: 0,
      speed: 1,
    }));
    this.projs = Array.from({ length: POOL.projectiles }, () => ({
      alive: false,
      x: 0,
      y: 0,
      target: null,
      final: false,
    }));
    this.parts = Array.from({ length: POOL.particles }, () => ({
      alive: false,
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      life: 0,
      max: 1,
      col: 0,
    }));
  }
  setRunning(v) {
    this.running = v;
  }
  setHalfW(w) {
    this.halfW = w;
  }
  get accuracy() {
    return this.total ? Math.round((this.correct / this.total) * 100) : 100;
  }
  get wpm() {
    return Math.round(this.correct / 5 / (Math.max(this.time, 1) / 60));
  }
  alive() {
    return this.bubbles.filter((b) => b.alive).length;
  }
  spawn() {
    const b = this.bubbles.find((x) => !x.alive);
    if (!b) return;
    const used = new Set(this.bubbles.filter((x) => x.alive).map((x) => x.text[0]));
    let text = '';
    for (let i = 0; i < 8; i++) {
      text =
        Math.random() < this.cfg.letterChance
          ? LETTERS[Math.floor(Math.random() * 26)]
          : this.pool[Math.floor(Math.random() * this.pool.length)];
      if (!used.has(text[0])) break;
    }
    const r = Math.max(0.75, (text.length * 0.6 * 0.46) / 2 + 0.45);
    let x = 0;
    for (let i = 0; i < 10; i++) {
      x = (Math.random() * 2 - 1) * this.halfW;
      if (!this.bubbles.some((o) => o.alive && o.y > WORLD.top - 3 && Math.abs(o.baseX - x) < o.r + r + 0.2))
        break;
    }
    const v = this.cfg.speedVar;
    Object.assign(b, {
      alive: true,
      dying: false,
      text,
      x,
      baseX: x,
      y: WORLD.top + r,
      phase: Math.random() * 6.28,
      r,
      progress: 0,
      speed: this.cfg.speed * (1 - v / 2 + Math.random() * v),
      version: b.version + 1,
    });
  }
  burst(x, y, n, mode) {
    const count = this.reduced ? Math.ceil(n / 4) : n;
    for (let i = 0, made = 0; i < this.parts.length && made < count; i++) {
      const p = this.parts[i];
      if (p.alive) continue;
      const a = Math.random() * 6.28,
        s = 2 + Math.random() * 5;
      Object.assign(p, {
        alive: true,
        x,
        y,
        z: 0,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        vz: (Math.random() - 0.5) * 3,
        life: 0.6,
        max: 0.6,
        col: mode === 2 ? 2 : mode === 1 ? i % 2 : 0,
      });
      made++;
    }
  }
  shoot(b, final) {
    this.aim = Math.atan2(b.x, b.y - WORLD.cannonY);
    this.recoil = 1;
    const p = this.projs.find((q) => !q.alive);
    if (!p) return;
    Object.assign(p, {
      alive: true,
      x: Math.sin(this.aim) * 1.6,
      y: WORLD.cannonY + Math.cos(this.aim) * 1.6,
      target: b,
      final,
    });
    this.onEvent('shoot');
  }
  hit(b) {
    this.active = b;
    b.progress++;
    b.version++;
    this.correct++;
    this.combo++;
    this.bestCombo = Math.max(this.bestCombo, this.combo);
    const mult = Math.min(1 + Math.floor(this.combo / 10) * 0.5, 3);
    this.score += Math.round(10 * mult);
    const done = b.progress >= b.text.length;
    if (done) {
      b.dying = true;
      this.active = null;
      this.popped++;
      this.score += Math.round(b.text.length * 5 * mult);
    }
    this.shoot(b, done);
  }
  type(k) {
    if (!this.running || this.over) return;
    this.total++;
    const a = this.active;
    if (a && a.alive && !a.dying && a.text[a.progress] === k) {
      this.hit(a);
      return;
    }
    const c = this.bubbles
      .filter((b) => b.alive && !b.dying && b !== a && b.text[0] === k)
      .sort((p, q) => p.y - q.y);
    if (c.length) {
      if (a) {
        a.progress = 0;
        a.version++;
      }
      this.hit(c[0]);
      return;
    }
    this.wrong++;
    this.combo = 0;
    this.wrongT = 0.25;
    this.onEvent('wrong');
  }
  miss(b) {
    b.alive = false;
    if (this.active === b) this.active = null;
    this.lives--;
    this.missed++;
    this.combo = 0;
    this.burst(b.x, b.y, 14, 2);
    this.onEvent('miss');
    if (this.lives <= 0) {
      this.over = true;
      this.running = false;
      this.onOver();
    }
  }
  update(dt) {
    if (!this.running || this.over) return;
    this.time += dt;
    this.sampleT += dt;
    if (this.sampleT >= 1) {
      this.sampleT -= 1;
      this.samples.push({
        t: this.samples.length + 1,
        wpm: this.wpm,
        acc: this.accuracy,
        errors: this.wrong,
      });
    }
    this.recoil = Math.max(0, this.recoil - dt * 4);
    this.wrongT = Math.max(0, this.wrongT - dt);
    const ramp = 1 + Math.min(this.time / 90, 1) * 0.6;
    this.spawnT -= dt;
    if (this.spawnT <= 0) {
      if (this.alive() < this.cfg.max) this.spawn();
      this.spawnT = this.cfg.spawn / ramp;
    }
    for (const b of this.bubbles) {
      if (!b.alive || b.dying) continue;
      b.y -= b.speed * ramp * dt;
      b.x = this.reduced ? b.baseX : b.baseX + Math.sin(this.time * 0.9 + b.phase) * 0.3;
      if (b.y <= WORLD.danger) {
        this.miss(b);
        if (this.over) return;
      }
    }
    for (const p of this.projs) {
      const t = p.target;
      if (!p.alive || !t) continue;
      if (!t.alive) {
        p.alive = false;
        continue;
      }
      const dx = t.x - p.x,
        dy = t.y - p.y,
        d = Math.hypot(dx, dy),
        step = 28 * dt;
      if (d <= step + t.r * 0.6) {
        p.alive = false;
        if (p.final) {
          this.burst(t.x, t.y, 26, 1);
          t.alive = false;
          t.dying = false;
          this.onEvent('pop');
        } else this.burst(p.x, p.y, 6, 0);
      } else {
        p.x += (dx / d) * step;
        p.y += (dy / d) * step;
      }
    }
    for (const p of this.parts) {
      if (!p.alive) continue;
      p.life -= dt;
      if (p.life <= 0) {
        p.alive = false;
        continue;
      }
      p.vy -= 6 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
    }
    const tgt = this.active ?? this.bubbles.filter((b) => b.alive && !b.dying).sort((p, q) => p.y - q.y)[0];
    const want = tgt ? Math.atan2(tgt.x, tgt.y - WORLD.cannonY) : 0;
    this.aim += (want - this.aim) * Math.min(1, dt * 10);
  }
}
