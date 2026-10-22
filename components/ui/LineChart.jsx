'use client';
import { useEffect, useRef, useState } from 'react';

/** SVG line chart that measures its container so text and lines stay crisp at any size. */
export default function LineChart({ points, xLabel, yLabel, yMax, ariaLabel }) {
  const box = useRef(null);
  const [size, setSize] = useState({ w: 600, h: 260 });

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
  const L = 48,
    R = 14,
    T = 10,
    B = 40;
  const ys = points.map((p) => p.y);
  const xs = points.map((p) => p.x);
  const top = yMax ?? Math.max(10, Math.ceil(Math.max(...ys) / 10) * 10);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const sx = (x) => L + (maxX === minX ? (W - L - R) / 2 : ((x - minX) / (maxX - minX)) * (W - L - R));
  const sy = (v) => T + (H - T - B) * (1 - v / top);
  const yTicks = [0, 1, 2, 3, 4].map((i) => (top / 4) * i);
  const step = Math.max(1, Math.ceil(points.length / Math.max(2, Math.floor((W - L - R) / 60))));
  return (
    <div ref={box} className="chart-box">
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel}>
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={sy(v)} y2={sy(v)} stroke="rgba(22,32,30,.14)" />
            <text x={L - 8} y={sy(v) + 4} textAnchor="end">
              {Math.round(v)}
            </text>
          </g>
        ))}
        {points.map((p, i) =>
          i % step === 0 ? (
            <text key={`x${i}`} x={sx(p.x)} y={H - B + 16} textAnchor="middle">
              {p.x}
            </text>
          ) : null,
        )}
        <polyline
          fill="none"
          stroke="#1B6FA8"
          strokeWidth="3.5"
          points={points.map((p) => `${sx(p.x)},${sy(p.y)}`).join(' ')}
        />
        {points.map((p, i) => (
          <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r="5" fill="#F7C948" stroke="#16201E" strokeWidth="2" />
        ))}
        <text x={(L + W - R) / 2} y={H - 6} textAnchor="middle">
          {xLabel}
        </text>
        <text transform={`translate(12 ${(T + H - B) / 2}) rotate(-90)`} textAnchor="middle">
          {yLabel}
        </text>
      </svg>
    </div>
  );
}
