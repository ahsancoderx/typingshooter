export default function LineChart({ points, xLabel, yLabel, yMax, ariaLabel }) {
  if (!points.length) return null;
  const W = 600,
    H = 260,
    L = 52,
    R = 16,
    T = 12,
    B = 44;
  const ys = points.map((p) => p.y),
    xs = points.map((p) => p.x);
  const top = yMax ?? Math.max(10, Math.ceil(Math.max(...ys) / 10) * 10);
  const minX = Math.min(...xs),
    maxX = Math.max(...xs);
  const sx = (x) => L + (maxX === minX ? (W - L - R) / 2 : ((x - minX) / (maxX - minX)) * (W - L - R));
  const sy = (v) => T + (H - T - B) * (1 - v / top);
  const yTicks = [0, 1, 2, 3, 4].map((i) => (top / 4) * i);
  const step = Math.max(1, Math.ceil(points.length / 6));
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel}>
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={L} x2={W - R} y1={sy(v)} y2={sy(v)} stroke="rgba(130,160,255,.16)" />
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
        stroke="#3d8bff"
        strokeWidth="2.5"
        points={points.map((p) => `${sx(p.x)},${sy(p.y)}`).join(' ')}
      />
      {points.map((p, i) => (
        <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r="3.5" fill="#8b6cff" />
      ))}
      <text x={(L + W - R) / 2} y={H - 6} textAnchor="middle">
        {xLabel}
      </text>
      <text transform={`translate(12 ${(T + H - B) / 2}) rotate(-90)`} textAnchor="middle">
        {yLabel}
      </text>
    </svg>
  );
}
