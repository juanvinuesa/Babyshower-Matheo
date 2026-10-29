import { useEffect, useState } from 'react';
import styles from './Countdown.module.css';

// Domingo 1 de noviembre, 17:00 hora de Argentina
const EVENT = new Date('2026-11-01T17:00:00-03:00').getTime();

function remaining() {
  const ms = Math.max(EVENT - Date.now(), 0);
  return {
    done:  ms === 0,
    days:  Math.floor(ms / 86_400_000),
    hours: Math.floor(ms / 3_600_000) % 24,
    mins:  Math.floor(ms / 60_000) % 60,
    secs:  Math.floor(ms / 1000) % 60,
  };
}

export default function Countdown() {
  const [t, setT] = useState(remaining);

  useEffect(() => {
    const id = setInterval(() => setT(remaining()), 1000);
    return () => clearInterval(id);
  }, []);

  if (t.done) return <p className={styles.today}>¡Hoy es el gran día!</p>;

  const units = [
    [t.days,  t.days === 1 ? 'día' : 'días'],
    [t.hours, 'horas'],
    [t.mins,  'min'],
    [t.secs,  'seg'],
  ];

  return (
    <div className={styles.wrap} role="timer" aria-label={`Faltan ${t.days} días y ${t.hours} horas`}>
      <span className={styles.label}>Faltan</span>
      <div className={styles.units}>
        {units.map(([value, label]) => (
          <div key={label} className={styles.unit}>
            <span className={styles.value}>{String(value).padStart(2, '0')}</span>
            <span className={styles.unitLabel}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
