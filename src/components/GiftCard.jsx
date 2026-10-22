import styles from './GiftCard.module.css';
import GiftIcon from './GiftIcon';

function progressGradient(pct) {
  if (pct >= 100) return 'linear-gradient(90deg,#34d399,#10b981)';
  if (pct >= 60)  return 'linear-gradient(90deg,#fbbf24,#f59e0b)';
  return                 'linear-gradient(90deg,#38bdf8,#818cf8)';
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="2,8 6,12 14,4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="7" width="10" height="8" rx="1.5" />
      <path d="M5 7 V5 A3 3 0 0 1 11 5 V7" />
    </svg>
  );
}

function GiftBtnIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="7" width="14" height="8" rx="1" />
      <rect x="4" y="4" width="8" height="3" rx="1" />
      <line x1="8" y1="4" x2="8" y2="15" />
      <path d="M8 4 C8 4 5.5 1 5.5 2.5 C5.5 4 8 4 8 4 Z" />
      <path d="M8 4 C8 4 10.5 1 10.5 2.5 C10.5 4 8 4 8 4 Z" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" style={{ verticalAlign: 'middle', marginRight: '3px', flexShrink: 0 }}>
      <path d="M17 21 V19 A4 4 0 0 0 9 19 V21" />
      <circle cx="11" cy="9" r="4" />
      <path d="M23 21 V19 A4 4 0 0 0 19 15.35" />
      <path d="M16 3.13 A4 4 0 0 1 19 7" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" style={{ verticalAlign: 'middle', marginRight: '2px', flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="8,12 11,15 16,9" />
    </svg>
  );
}

export default function GiftCard({ gift, count, isSelected, onToggle }) {
  const isFull    = count >= gift.max;
  const pct       = Math.min((count / gift.max) * 100, 100);
  const spotsLeft = gift.max - count;

  const cardClass = [
    styles.card,
    isSelected            ? styles.selected : '',
    isFull && !isSelected ? styles.full     : '',
  ].join(' ');

  return (
    <div className={cardClass}>
      <div className={styles.blob} style={{ background: gift.color }} />

      <GiftIcon category={gift.category} color={gift.color} />
      <h3 className={styles.name}>{gift.name}</h3>
      <p className={styles.desc}>{gift.desc}</p>

      <div className={styles.progressRow}>
        <span className={styles.progressCount}>
          <PeopleIcon />
          {count} de {gift.max} personas
        </span>
        <span className={`${styles.progressSpots} ${isFull ? styles.done : ''}`}>
          {isFull
            ? <><CheckCircleIcon />Completo</>
            : `${spotsLeft} lugar${spotsLeft !== 1 ? 'es' : ''} libre${spotsLeft !== 1 ? 's' : ''}`}
        </span>
      </div>

      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%`, background: progressGradient(pct) }} />
      </div>

      {isSelected ? (
        <button className={`${styles.btn} ${styles.btnCancel}`} onClick={onToggle}>
          <CheckIcon /> Lo regalo · Cancelar
        </button>
      ) : isFull ? (
        <button className={`${styles.btn} ${styles.btnFull}`} disabled>
          <LockIcon /> Ya está cubierto
        </button>
      ) : (
        <button className={`${styles.btn} ${styles.btnPick}`} onClick={onToggle}>
          <GiftBtnIcon /> Lo voy a regalar
        </button>
      )}
    </div>
  );
}
