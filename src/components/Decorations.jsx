import styles from './Decorations.module.css';

function hexPoints(cx, cy, r) {
  return [0,1,2,3,4,5].map(i => {
    const a = (i * 60) * Math.PI / 180;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(' ');
}

function HexSVG({ size, color, opacity, filled }) {
  const r  = size / 2 - 1;
  const cx = size / 2;
  const cy = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <polygon
        points={hexPoints(cx, cy, r)}
        fill={filled ? color : 'none'}
        stroke={filled ? 'none' : color}
        strokeWidth="2"
        opacity={opacity}
      />
    </svg>
  );
}

function BeeSVG({ size }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg" opacity="0.22">
      {/* Alas */}
      <ellipse cx="13" cy="18" rx="12" ry="7" fill="rgba(255,255,255,0.8)" stroke="#d97706" strokeWidth="1"/>
      <ellipse cx="27" cy="18" rx="12" ry="7" fill="rgba(255,255,255,0.8)" stroke="#d97706" strokeWidth="1"/>
      {/* Cuerpo */}
      <ellipse cx="20" cy="36" rx="9" ry="12" fill="#fbbf24" stroke="#d97706" strokeWidth="1"/>
      {/* Rayas */}
      <rect x="11" y="31" width="18" height="4" rx="1.5" fill="#92400e" opacity="0.8"/>
      <rect x="11" y="38" width="18" height="4" rx="1.5" fill="#92400e" opacity="0.8"/>
      {/* Cabeza */}
      <circle cx="20" cy="21" r="8" fill="#fbbf24" stroke="#d97706" strokeWidth="1"/>
      {/* Ojos */}
      <circle cx="17" cy="20" r="1.5" fill="#1c1917"/>
      <circle cx="23" cy="20" r="1.5" fill="#1c1917"/>
      {/* Antenas */}
      <line x1="18" y1="14" x2="13" y2="6" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="22" y1="14" x2="27" y2="6" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="13" cy="5" r="2.5" fill="#d97706"/>
      <circle cx="27" cy="5" r="2.5" fill="#d97706"/>
    </svg>
  );
}

const ITEMS = [
  { type: 'hex',    size: 32, color: '#fbbf24', opacity: 0.35, filled: true  },
  { type: 'hex',    size: 28, color: '#d97706', opacity: 0.25, filled: false },
  { type: 'bee',    size: 40 },
  { type: 'hex',    size: 20, color: '#fcd34d', opacity: 0.40, filled: true  },
  { type: 'hex',    size: 36, color: '#d97706', opacity: 0.20, filled: false },
  { type: 'bee',    size: 36 },
  { type: 'hex',    size: 24, color: '#f59e0b', opacity: 0.30, filled: true  },
  { type: 'hex',    size: 16, color: '#fbbf24', opacity: 0.45, filled: true  },
  { type: 'bee',    size: 32 },
  { type: 'hex',    size: 30, color: '#fde68a', opacity: 0.38, filled: true  },
  { type: 'hex',    size: 22, color: '#f59e0b', opacity: 0.22, filled: false },
  { type: 'bee',    size: 44 },
];

export default function Decorations() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      {ITEMS.map((item, i) => (
        <div
          key={i}
          className={styles.item}
          style={{
            left: `${(i * 8.7 + 4) % 100}%`,
            animationDuration: `${22 + i * 2.1}s`,
            animationDelay: `${-(i * 1.9)}s`,
          }}
        >
          {item.type === 'bee'
            ? <BeeSVG size={item.size} />
            : <HexSVG {...item} />}
        </div>
      ))}
    </div>
  );
}
