import styles from './GiftCard.module.css';

function Hex({ filled, mine }) {
  return (
    <svg viewBox="0 0 24 26" className={styles.hex} aria-hidden="true">
      <polygon
        points="12,1 23,7 23,19 12,25 1,19 1,7"
        className={mine ? styles.hexMine : filled ? styles.hexFilled : styles.hexEmpty}
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
      strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="2,8 6,12 14,4" />
    </svg>
  );
}

export default function GiftCard({ gift, count, isMine, hasOtherPick, busy, onChoose, onCancel }) {
  const limited   = gift.max != null;
  const isFull    = limited && count >= gift.max;
  const spotsLeft = limited ? Math.max(gift.max - count, 0) : null;

  const cardClass = [
    styles.card,
    isMine ? styles.mine : '',
    isFull && !isMine ? styles.full : '',
  ].join(' ');

  let status;
  if (!limited) {
    status = count > 0
      ? `${count} ${count === 1 ? 'persona lo eligió' : 'personas lo eligieron'}`
      : 'Sin límite';
  } else if (isFull) {
    status = 'Completo';
  } else {
    status = `${spotsLeft === 1 ? 'Queda 1 lugar' : `Quedan ${spotsLeft} lugares`} de ${gift.max}`;
  }

  return (
    <article className={cardClass}>
      <div className={styles.body}>
        <h3 className={styles.name}>{gift.name}</h3>
        {gift.detail && <p className={styles.detail}>{gift.detail}</p>}
      </div>

      <div className={styles.meter}>
        {limited && (
          <div className={styles.hexRow} role="img"
            aria-label={`${count} de ${gift.max} lugares ocupados`}>
            {Array.from({ length: gift.max }, (_, i) => (
              <Hex key={i} filled={i < count} mine={isMine && i === count - 1} />
            ))}
          </div>
        )}
        <span className={`${styles.status} ${isFull ? styles.statusFull : ''}`}>{status}</span>
      </div>

      {isMine ? (
        <div className={styles.mineRow}>
          <span className={styles.mineTag}><CheckIcon /> Tu regalo</span>
          <button className={styles.linkBtn} onClick={onCancel} disabled={busy}>Cancelar</button>
        </div>
      ) : isFull ? (
        <button className={`${styles.btn} ${styles.btnFull}`} disabled>Ya está cubierto</button>
      ) : (
        <button className={`${styles.btn} ${hasOtherPick ? styles.btnSwap : styles.btnPick}`}
          onClick={onChoose} disabled={busy}>
          {hasOtherPick ? 'Cambiar por este' : 'Lo regalo yo'}
        </button>
      )}
    </article>
  );
}
