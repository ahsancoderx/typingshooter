'use client';
import { useEffect, useRef } from 'react';
export default function TypingPassage({ text, typed, reduced, onKeyDown, boxRef }) {
  const inner = useRef(null);
  useEffect(() => {
    const box = inner.current,
      cur = box?.querySelector('[data-cur]');
    if (box && cur) box.scrollTop = Math.max(0, cur.offsetTop - box.clientHeight / 3);
  }, [typed.length]);
  return (
    <div
      ref={boxRef}
      className={`passage-wrap${reduced ? ' reduced' : ''}`}
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label="Typing area. Click here and start typing the text shown."
    >
      <div ref={inner} className="passage">
        {text.split('').map((ch, i) => {
          const cls =
            i < typed.length ? (typed[i] === ch ? 't-ok' : 't-bad') : i === typed.length ? 't-cur' : 'c';
          return (
            <span key={i} className={cls} data-cur={i === typed.length ? '' : undefined}>
              {ch}
            </span>
          );
        })}
      </div>
    </div>
  );
}
