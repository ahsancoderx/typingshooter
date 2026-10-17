'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

export const LINE_H = 46;

// Splits the text into word and space tokens so words never break across lines.
function tokenize(text) {
  const out = [];
  let i = 0;
  while (i < text.length) {
    const space = text[i] === ' ';
    let j = i;
    while (j < text.length && (text[j] === ' ') === space) j++;
    out.push({ start: i, end: j, space });
    i = j;
  }
  return out;
}

/**
 * Monkeytype-style passage: dim untyped text, blue correct text, red mistakes, a smooth gliding caret,
 * and lines that scroll up smoothly as you type. Focus it to type.
 */
export default function TypingPassage({ text, typed, reduced, onKeyDown, lines = 3 }) {
  const root = useRef(null);
  const words = useRef(null);
  const caret = useRef(null);
  const [focused, setFocused] = useState(false);
  const tokens = useMemo(() => tokenize(text), [text]);

  useEffect(() => {
    root.current?.focus();
  }, []);

  useEffect(() => {
    const onWindowKey = (e) => {
      if (e.target === document.body && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey)
        root.current?.focus();
    };
    window.addEventListener('keydown', onWindowKey);
    return () => window.removeEventListener('keydown', onWindowKey);
  }, []);

  useEffect(() => {
    const box = words.current;
    const c = caret.current;
    if (!box || !c) return undefined;
    const place = () => {
      const n = typed.length;
      const el = box.querySelector(`[data-i="${Math.min(n, text.length - 1)}"]`);
      const first = box.querySelector('[data-i="0"]');
      if (!el || !first) return;
      const x = el.offsetLeft + (n >= text.length ? el.offsetWidth : 0);
      const y = el.offsetTop;
      const line = Math.round((y - first.offsetTop) / LINE_H);
      box.style.transform = `translateY(${-Math.max(0, line - 1) * LINE_H}px)`;
      c.style.transform = `translate(${x}px, ${y}px)`;
      c.style.height = `${el.offsetHeight}px`;
    };
    place();
    c.classList.add('moving'); // solid while typing, blinks when idle
    const t = setTimeout(() => c.classList.remove('moving'), 700);
    window.addEventListener('resize', place);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', place);
    };
  }, [typed.length, text]);

  return (
    <div
      ref={root}
      className={`passage-wrap${reduced ? ' reduced' : ''}${focused ? '' : ' blurred'}`}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      aria-label="Typing area. Start typing the text shown."
      style={{ '--lh': `${LINE_H}px`, height: LINE_H * lines + 34 }}
    >
      <div className="passage-view">
        <div ref={words} className="words">
          <span ref={caret} className="caret" aria-hidden="true" />
          {tokens.map((tk) => (
            <span key={tk.start} className={tk.space ? 'sp' : 'word'}>
              {Array.from({ length: tk.end - tk.start }, (_, k) => {
                const i = tk.start + k;
                const state = i < typed.length ? (typed[i] === text[i] ? 'ok' : 'bad') : '';
                return (
                  <span key={i} data-i={i} className={`ch ${state}`}>
                    {text[i]}
                  </span>
                );
              })}
            </span>
          ))}
        </div>
      </div>
      {focused ? null : <div className="focus-hint">Click here or press any key to start typing</div>}
    </div>
  );
}
