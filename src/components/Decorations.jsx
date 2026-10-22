import styles from './Decorations.module.css';

const SHAPES = [
  { type: 'circle', size: 28, color: '#38bdf8', opacity: 0.18 },
  { type: 'ring',   size: 36, color: '#818cf8', opacity: 0.15 },
  { type: 'star4',  size: 22, color: '#7dd3fc', opacity: 0.20 },
  { type: 'circle', size: 18, color: '#c7d2fe', opacity: 0.22 },
  { type: 'star4',  size: 30, color: '#0ea5e9', opacity: 0.14 },
  { type: 'ring',   size: 24, color: '#93c5fd', opacity: 0.18 },
  { type: 'circle', size: 40, color: '#a5f3fc', opacity: 0.14 },
  { type: 'star4',  size: 18, color: '#818cf8', opacity: 0.18 },
  { type: 'ring',   size: 32, color: '#38bdf8', opacity: 0.13 },
  { type: 'circle', size: 22, color: '#cffafe', opacity: 0.25 },
  { type: 'star4',  size: 26, color: '#93c5fd', opacity: 0.16 },
  { type: 'circle', size: 16, color: '#0ea5e9', opacity: 0.20 },
];

function ShapeSVG({ type, size, color, opacity }) {
  const cx = size / 2;
  const cy = size / 2;
  const r  = size / 2;

  if (type === 'circle') {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
        <circle cx={cx} cy={cy} r={r - 1} fill={color} opacity={opacity} />
      </svg>
    );
  }

  if (type === 'ring') {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
        <circle cx={cx} cy={cy} r={r - 2} fill="none" stroke={color} strokeWidth="2.5" opacity={opacity} />
      </svg>
    );
  }

  if (type === 'star4') {
    const outer = r - 1;
    const inner = r * 0.42;
    const pts = [0, 1, 2, 3].map(i => {
      const oa = (i * 90 - 90) * (Math.PI / 180);
      const ia = (i * 90 - 45) * (Math.PI / 180);
      return [
        `${cx + outer * Math.cos(oa)},${cy + outer * Math.sin(oa)}`,
        `${cx + inner * Math.cos(ia)},${cy + inner * Math.sin(ia)}`,
      ];
    }).flat().join(' ');
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
        <polygon points={pts} fill={color} opacity={opacity} />
      </svg>
    );
  }

  return null;
}

export default function Decorations() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      {SHAPES.map((shape, i) => (
        <div
          key={i}
          className={styles.item}
          style={{
            left: `${(i * 8.7 + 4) % 100}%`,
            animationDuration: `${22 + i * 2.1}s`,
            animationDelay: `${-(i * 1.9)}s`,
          }}
        >
          <ShapeSVG {...shape} />
        </div>
      ))}
    </div>
  );
}
