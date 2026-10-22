import styles from './GiftCard.module.css';

function progressGradient(pct) {
  if (pct >= 100) return 'linear-gradient(90deg,#34d399,#10b981)';
  if (pct >= 60)  return 'linear-gradient(90deg,#fbbf24,#f59e0b)';
  return                 'linear-gradient(90deg,#f472b6,#c084fc)';
}

export default function GiftCard({ gift, count, isSelected, onToggle }) {
  const isFull    = count >= gift.max;
  const pct       = Math.min((count / gift.max) * 100, 100);
  const spotsLeft = gift.max - count;

  const cardClass = [
    styles.card,
    isSelected              ? styles.selected : '',
    isFull && !isSelected   ? styles.full     : '',
  ].join(' ');

  return (
    <div className={cardClass}>
      <div className={styles.blob} style={{ background: gift.color }} />

      <span className={styles.emoji}>{gift.emoji}</span>
      <h3 className={styles.name}>{gift.name}</h3>
      <p className={styles.desc}>{gift.desc}</p>

      <div className={styles.progressRow}>
        <span className={styles.progressCount}>👥 {count} de {gift.max} personas</span>
        <span className={`${styles.progressSpots} ${isFull ? styles.done : ''}`}>
          {isFull
            ? '¡Completo! 🎉'
            : `${spotsLeft} lugar${spotsLeft !== 1 ? 'es' : ''} libre${spotsLeft !== 1 ? 's' : ''}`}
        </span>
      </div>

      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${pct}%`, background: progressGradient(pct) }}
        />
      </div>

      {isSelected ? (
        <button className={`${styles.btn} ${styles.btnCancel}`} onClick={onToggle}>
          ✅ ¡Yo lo regalo! · Cancelar
        </button>
      ) : isFull ? (
        <button className={`${styles.btn} ${styles.btnFull}`} disabled>
          🔒 ¡Ya está cubierto!
        </button>
      ) : (
        <button className={`${styles.btn} ${styles.btnPick}`} onClick={onToggle}>
          🎁 ¡Lo voy a regalar!
        </button>
      )}
    </div>
  );
}
