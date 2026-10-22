import { useState, useCallback } from 'react';
import styles from './Confetti.module.css';

const COLORS = ['#38bdf8','#0ea5e9','#60a5fa','#34d399','#fbbf24','#818cf8','#7dd3fc'];

export function useConfetti() {
  const [pieces, setPieces] = useState([]);

  const launch = useCallback(() => {
    const next = Array.from({ length: 55 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      color: COLORS[i % COLORS.length],
      size: 7 + Math.random() * 8,
      round: Math.random() > 0.5,
      dur: 1.8 + Math.random() * 1.4,
      delay: Math.random() * 0.6,
    }));
    setPieces(next);
    setTimeout(() => setPieces([]), 3500);
  }, []);

  return { pieces, launch };
}

export default function Confetti({ pieces }) {
  return (
    <div className={styles.wrap}>
      {pieces.map(p => (
        <div
          key={p.id}
          className={styles.piece}
          style={{
            left: p.x + '%',
            background: p.color,
            width: p.size + 'px',
            height: p.size + 'px',
            borderRadius: p.round ? '50%' : '2px',
            animationDuration: p.dur + 's',
            animationDelay: p.delay + 's',
          }}
        />
      ))}
    </div>
  );
}
