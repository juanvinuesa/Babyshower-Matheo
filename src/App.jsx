import { GIFTS } from './data/gifts';
import { useGiftRegistry } from './hooks/useGiftRegistry';
import GiftCard from './components/GiftCard';
import Decorations from './components/Decorations';
import Confetti, { useConfetti } from './components/Confetti';
import styles from './App.module.css';

function HeartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#7dd3fc"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
      style={{ display: 'inline', verticalAlign: 'middle', margin: '0 3px' }}>
      <path d="M20.84 4.61 A5.5 5.5 0 0 0 12 4.61 A5.5 5.5 0 0 0 3.16 4.61 C1.45 6.31 1.45 9.03 3.16 10.73 L12 19.57 L20.84 10.73 C22.55 9.03 22.55 6.31 20.84 4.61 Z" />
    </svg>
  );
}

function GiftBadgeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      stroke="rgba(255,255,255,0.9)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <rect x="1" y="7" width="14" height="8" rx="1" />
      <rect x="4" y="4" width="8" height="3" rx="1" />
      <line x1="8" y1="4" x2="8" y2="15" />
      <path d="M8 4 C8 4 5.5 1.5 5.5 2.8 C5.5 4 8 4 8 4 Z" />
      <path d="M8 4 C8 4 10.5 1.5 10.5 2.8 C10.5 4 8 4 8 4 Z" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86 L1.82 18 A2 2 0 0 0 3.64 21 L20.36 21 A2 2 0 0 0 22.18 18 L13.71 3.86 A2 2 0 0 0 10.29 3.86 Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export default function App() {
  const { counts, myPicks, toggle, totalPicks, loading, error } = useGiftRegistry();
  const { pieces, launch } = useConfetti();

  function handleToggle(id) {
    const wasSelected = !!myPicks[id];
    toggle(id);
    if (!wasSelected) launch();
  }

  return (
    <>
      <Decorations />
      <Confetti pieces={pieces} />

      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerDots} aria-hidden="true">
            <svg width="120" height="32" viewBox="0 0 120 32" xmlns="http://www.w3.org/2000/svg">
              <path d="M20,4 L21.8,9.6 L27.6,9.6 L23,13.2 L24.8,18.8 L20,15.2 L15.2,18.8 L17,13.2 L12.4,9.6 L18.2,9.6 Z"
                fill="#38bdf8" opacity="0.7" />
              <path d="M60,2 L61.4,7 L66.4,7 L62.5,10.1 L63.9,15.1 L60,12 L56.1,15.1 L57.5,10.1 L53.6,7 L58.6,7 Z"
                fill="#818cf8" opacity="0.75" />
              <path d="M100,6 L101.4,11 L106.4,11 L102.5,14.1 L103.9,19.1 L100,16 L96.1,19.1 L97.5,14.1 L93.6,11 L98.6,11 Z"
                fill="#7dd3fc" opacity="0.65" />
              <circle cx="40" cy="12" r="3.5" fill="#93c5fd" opacity="0.55" />
              <circle cx="80" cy="10" r="2.5" fill="#c7d2fe" opacity="0.6" />
              <circle cx="40" cy="24" r="2" fill="#38bdf8" opacity="0.35" />
              <circle cx="80" cy="24" r="2" fill="#818cf8" opacity="0.35" />
            </svg>
          </div>

          <h1 className={styles.title}>Baby Shower de Matheo</h1>
          <p className={styles.subtitle}>Elegí tu regalo y ayudanos a celebrar su llegada</p>
          <p className={styles.hint}>Seleccioná lo que querés traer para que no se repitan</p>

          {totalPicks > 0 && (
            <div className={styles.badge} key={totalPicks}>
              <GiftBadgeIcon />
              Elegiste {totalPicks} regalo{totalPicks > 1 ? 's' : ''}
            </div>
          )}
        </header>

        <div className={styles.heroWave} aria-hidden="true">
          <svg viewBox="0 0 1440 72" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,36 C240,72 480,0 720,36 C960,72 1200,0 1440,36 L1440,72 L0,72 Z" fill="rgba(255,255,255,0.18)" />
            <path d="M0,44 C200,20 440,64 720,44 C1000,24 1240,60 1440,44 L1440,72 L0,72 Z" fill="rgba(255,255,255,0.28)" />
            <path d="M0,56 C180,40 360,68 540,56 C720,44 900,68 1080,56 C1260,44 1380,60 1440,56 L1440,72 L0,72 Z" fill="rgba(255,255,255,0.42)" />
          </svg>
        </div>

        {loading ? (
          <div className={styles.loadingWrap}>
            <div className={styles.loadingSpinner} role="status" aria-label="Cargando regalos" />
            <p className={styles.loadingText}>Cargando regalos…</p>
          </div>
        ) : error ? (
          <div className={styles.errorWrap}>
            <WarningIcon />
            <p>No se pudo conectar al servidor. Revisá tu conexión.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {GIFTS.map(gift => (
              <GiftCard
                key={gift.id}
                gift={gift}
                count={counts[gift.id] || 0}
                isSelected={!!myPicks[gift.id]}
                onToggle={() => handleToggle(gift.id)}
              />
            ))}
          </div>
        )}

        <footer className={styles.footer}>
          Hecho con <HeartIcon /> para el Baby Shower de Matheo
        </footer>
      </div>
    </>
  );
}
