'use client';

// A lightweight, responsive multi-series line/area chart drawn as inline SVG.
// No dependencies. Scales via viewBox so it stays crisp at any width.
export default function AreaChart({ labels = [], series = [], height = 240, area = true }) {
  const W = 720;
  const H = height;
  const padX = 34;
  const padY = 24;
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;

  const allValues = series.flatMap((s) => s.values);
  const max = Math.max(1, ...allValues);
  const n = labels.length;

  const x = (i) => padX + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const y = (v) => padY + innerH - (v / max) * innerH;

  const linePath = (values) =>
    values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const areaPath = (values) =>
    `${linePath(values)} L ${x(n - 1).toFixed(1)} ${y(0).toFixed(1)} L ${x(0).toFixed(1)} ${y(0).toFixed(1)} Z`;

  const gridLines = 4;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[520px]" role="img" aria-label="Chart">
        <defs>
          {series.map((s, i) => (
            <linearGradient key={i} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.22" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {/* horizontal grid */}
        {Array.from({ length: gridLines + 1 }).map((_, i) => {
          const gy = padY + (i / gridLines) * innerH;
          return (
            <line
              key={i}
              x1={padX}
              x2={W - padX}
              y1={gy}
              y2={gy}
              className="stroke-gray-200 dark:stroke-zinc-800"
              strokeWidth="1"
            />
          );
        })}

        {series.map((s, i) => (
          <g key={i}>
            {area && i === 0 && <path d={areaPath(s.values)} fill={`url(#grad-${i})`} />}
            <path d={linePath(s.values)} fill="none" stroke={s.color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            {s.values.map((v, j) => (
              <circle key={j} cx={x(j)} cy={y(v)} r="2.6" fill={s.color} />
            ))}
          </g>
        ))}

        {/* x labels */}
        {labels.map((lab, i) => (
          <text
            key={i}
            x={x(i)}
            y={H - 6}
            textAnchor="middle"
            className="fill-gray-400 text-[11px] dark:fill-zinc-500"
          >
            {lab}
          </text>
        ))}
      </svg>
    </div>
  );
}
