'use client';
import { useEffect, useRef, useState } from 'react';

const niceMax = (v) => Math.max(5, Math.ceil(v / 5) * 5);

/** 2D chart: a line (e.g. WPM) over bars (e.g. mistakes), with two labelled axes. Fills its container. */
export default function ComboChart({ points, xLabel, lineLabel, barLabel, ariaLabel, lineMax }) {
  const box = useRef(null);
  const [size, setSize] = useState({ w: 700, h: 320 });
  useEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  if (!points.length) return null;
  const { w: W, h: H } = size;
  const compact = H < 200; // short charts (inside result panels) use fewer ticks and tighter margins
  const L = 64,
    R = 64,
    T = compact ? 30 : 40,
    B = compact ? 40 : 54;
  const plotW = W - L - R,
    plotH = H - T - B;
  const lMax = lineMax ?? niceMax(Math.max(...points.map((p) => p.line)));
  const bMax = niceMax(Math.max(...points.map((p) => p.bar)));
  const slot = plotW / points.length;
  const bw = Math.min(28, slot * 0.55);
  const cx = (i) => L + slot * (i + 0.5);
  const ly = (v) => T + plotH * (1 - v / lMax);
  const by = (v) => T + plotH * (1 - v / bMax);
  const step = Math.max(1, Math.ceil(points.length / Math.max(2, Math.floor(plotW / 48))));
  const ticks = compact ? [0, 2, 4] : [0, 1, 2, 3, 4];
  return (
    <div ref={box} className="chart-box">
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel}>
        <rect x="12" y="10" width="14" height="14" rx="3" fill="#E9695C" stroke="#16201E" strokeWidth="2" />
        <text className="legend" x="32" y="22">
          {barLabel}
        </text>
        <line x1="150" x2="178" y1="17" y2="17" stroke="#1B6FA8" strokeWidth="3.5" />
        <circle cx="164" cy="17" r="5" fill="#F7C948" stroke="#16201E" strokeWidth="2" />
        <text className="legend" x="186" y="22">
          {lineLabel}
        </text>
        {ticks.map((i) => (
          <g key={i}>
            <line
              x1={L}
              x2={W - R}
              y1={T + (plotH / 4) * (4 - i)}
              y2={T + (plotH / 4) * (4 - i)}
              stroke="rgba(22,32,30,.14)"
            />
            <text x={L - 8} y={T + (plotH / 4) * (4 - i) + 4} textAnchor="end">
              {Math.round((lMax / 4) * i)}
            </text>
            <text x={W - R + 8} y={T + (plotH / 4) * (4 - i) + 4}>
              {Math.round((bMax / 4) * i)}
            </text>
          </g>
        ))}
        {points.map((p, i) => (
          <rect
            key={`b${i}`}
            x={cx(i) - bw / 2}
            y={by(p.bar)}
            width={bw}
            height={Math.max(0, T + plotH - by(p.bar))}
            fill="#E9695C"
            stroke="#16201E"
            strokeWidth="2"
            rx="2"
          />
        ))}
        {points.map((p, i) =>
          i % step === 0 ? (
            <text key={`x${i}`} x={cx(i)} y={H - B + 18} textAnchor="middle">
              {p.x}
            </text>
          ) : null,
        )}
        <polyline
          fill="none"
          stroke="#1B6FA8"
          strokeWidth="3.5"
          strokeLinejoin="round"
          points={points.map((p, i) => `${cx(i)},${ly(p.line)}`).join(' ')}
        />
        {points.map((p, i) => (
          <circle
            key={`c${i}`}
            cx={cx(i)}
            cy={ly(p.line)}
            r="5"
            fill="#F7C948"
            stroke="#16201E"
            strokeWidth="2"
          />
        ))}
        <text x={(L + W - R) / 2} y={H - 10} textAnchor="middle">
          {xLabel}
        </text>
        <text transform={`translate(16 ${(T + H - B) / 2}) rotate(-90)`} textAnchor="middle">
          {lineLabel}
        </text>
        <text transform={`translate(${W - 10} ${(T + H - B) / 2}) rotate(90)`} textAnchor="middle">
          {barLabel}
        </text>
      </svg>
    </div>
  );
}
