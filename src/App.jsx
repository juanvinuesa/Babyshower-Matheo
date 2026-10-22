import { GIFTS } from './data/gifts';
import { useGiftRegistry } from './hooks/useGiftRegistry';
import GiftCard from './components/GiftCard';
import Decorations from './components/Decorations';
import Confetti, { useConfetti } from './components/Confetti';
import styles from './App.module.css';

function HeartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#d97706"
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
      stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

          {/* Abeja central con panales a los lados */}
          <div className={styles.headerBee} aria-hidden="true">
            <svg width="260" height="80" viewBox="0 0 260 80" xmlns="http://www.w3.org/2000/svg">
              {/* Hexágono izquierdo */}
              <polygon points="32,12 48,12 56,26 48,40 32,40 24,26" fill="#fbbf24" opacity="0.55"/>
              <polygon points="32,12 48,12 56,26 48,40 32,40 24,26" fill="none" stroke="#d97706" strokeWidth="1.5" opacity="0.6"/>
              {/* Hexágono izquierdo pequeño */}
              <polygon points="10,36 20,36 25,45 20,54 10,54 5,45" fill="#fcd34d" opacity="0.4"/>
              {/* Hexágono derecho */}
              <polygon points="212,12 228,12 236,26 228,40 212,40 204,26" fill="#fbbf24" opacity="0.55"/>
              <polygon points="212,12 228,12 236,26 228,40 212,40 204,26" fill="none" stroke="#d97706" strokeWidth="1.5" opacity="0.6"/>
              {/* Hexágono derecho pequeño */}
              <polygon points="240,36 250,36 255,45 250,54 240,54 235,45" fill="#fcd34d" opacity="0.4"/>

              {/* Alas */}
              <ellipse cx="106" cy="30" rx="22" ry="13" fill="rgba(255,255,255,0.72)" stroke="#d97706" strokeWidth="1.2"/>
              <ellipse cx="154" cy="30" rx="22" ry="13" fill="rgba(255,255,255,0.72)" stroke="#d97706" strokeWidth="1.2"/>

              {/* Cuerpo */}
              <ellipse cx="130" cy="60" rx="14" ry="19" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5"/>
              {/* Rayas */}
              <rect x="116" y="52" width="28" height="6" rx="2" fill="#1c1917" opacity="0.75"/>
              <rect x="116" y="62" width="28" height="6" rx="2" fill="#1c1917" opacity="0.75"/>

              {/* Cabeza */}
              <circle cx="130" cy="36" r="13" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5"/>
              {/* Ojos */}
              <circle cx="125" cy="34" r="2.5" fill="#1c1917"/>
              <circle cx="135" cy="34" r="2.5" fill="#1c1917"/>
              {/* Sonrisa */}
              <path d="M125 41 Q130 46 135 41" stroke="#1c1917" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

              {/* Antenas */}
              <line x1="126" y1="24" x2="118" y2="12" stroke="#d97706" strokeWidth="2" strokeLinecap="round"/>
              <line x1="134" y1="24" x2="142" y2="12" stroke="#d97706" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="118" cy="11" r="3.5" fill="#d97706"/>
              <circle cx="142" cy="11" r="3.5" fill="#d97706"/>

              {/* Aguijón */}
              <path d="M127 79 Q130 87 133 79" fill="#d97706"/>
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

        {/* Ola decorativa */}
        <div className={styles.heroWave} aria-hidden="true">
          <svg viewBox="0 0 1440 72" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,36 C240,72 480,0 720,36 C960,72 1200,0 1440,36 L1440,72 L0,72 Z" fill="rgba(255,255,255,0.25)"/>
            <path d="M0,44 C200,20 440,64 720,44 C1000,24 1240,60 1440,44 L1440,72 L0,72 Z" fill="rgba(255,255,255,0.35)"/>
            <path d="M0,56 C180,40 360,68 540,56 C720,44 900,68 1080,56 C1260,44 1380,60 1440,56 L1440,72 L0,72 Z" fill="rgba(255,255,255,0.5)"/>
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
