import { GIFTS } from './data/gifts';
import { useGiftRegistry } from './hooks/useGiftRegistry';
import GiftCard from './components/GiftCard';
import Decorations from './components/Decorations';
import Confetti, { useConfetti } from './components/Confetti';
import styles from './App.module.css';

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
          <span className={styles.headerIcons}>🍼 👶 🎀</span>
          <h1 className={styles.title}>Baby Shower de Matheo</h1>
          <p className={styles.subtitle}>¡Elegí tu regalo y ayudanos a celebrar su llegada!</p>
          <p className={styles.hint}>Seleccioná lo que querés traer para que no se repitan 💕</p>
          {totalPicks > 0 && (
            <div className={styles.badge} key={totalPicks}>
              🎁 ¡Elegiste {totalPicks} regalo{totalPicks > 1 ? 's' : ''}!
            </div>
          )}
        </header>

        {loading ? (
          <div className={styles.loadingWrap}>
            <span className={styles.loadingSpinner}>🍼</span>
            <p className={styles.loadingText}>Cargando regalos…</p>
          </div>
        ) : error ? (
          <div className={styles.errorWrap}>
            <p>⚠️ No se pudo conectar al servidor. Revisá tu conexión.</p>
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

        <footer className={styles.footer}>Hecho con 💕 para el Baby Shower de Matheo</footer>
      </div>
    </>
  );
}
