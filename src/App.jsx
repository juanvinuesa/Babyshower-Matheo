import { useState } from 'react';
import { CATEGORIES, GIFTS, GIFTS_BY_ID, TIPS } from './data/gifts';
import { useGiftRegistry } from './hooks/useGiftRegistry';
import { RollingNumber } from '@/components/ui/rolling-number';
import Hero from './components/Hero';
import GiftCard from './components/GiftCard';
import GiftIcon from './components/GiftIcon';
import Decorations from './components/Decorations';
import Confetti, { useConfetti } from './components/Confetti';
import styles from './App.module.css';

function HeartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--pooh-red)" aria-hidden="true"
      style={{ display: 'inline', verticalAlign: 'middle', margin: '0 3px' }}>
      <path d="M20.84 4.61 A5.5 5.5 0 0 0 12 4.61 A5.5 5.5 0 0 0 3.16 4.61 C1.45 6.31 1.45 9.03 3.16 10.73 L12 19.57 L20.84 10.73 C22.55 9.03 22.55 6.31 20.84 4.61 Z" />
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

function HoneyPot() {
  return (
    <svg width="44" height="44" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M10 16 H38 C42 22 42 36 36 41 C31 45 17 45 12 41 C6 36 6 22 10 16 Z" fill="#c9a77c" stroke="#8b6a45" strokeWidth="2" />
      <rect x="9" y="11" width="30" height="7" rx="3.5" fill="#a9875d" stroke="#8b6a45" strokeWidth="2" />
      <path d="M11 15 C14 15 14 24 17 24 C20 24 19 16 23 16 C27 16 26 28 30 28 C33 28 32 15 37 15 Z" fill="#f2b631" />
      <text x="24" y="37" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontWeight="900" fontSize="8" fill="#5b4126">HUNNY</text>
    </svg>
  );
}

export default function App() {
  const { counts, myPick, choose, busy, loading, error, notice, dismissNotice } = useGiftRegistry();
  const { pieces, launch } = useConfetti();
  const [filter, setFilter] = useState('all');

  async function handleChoose(id) {
    const ok = await choose(id);
    if (ok) launch();
  }

  const visible = CATEGORIES.filter(c => filter === 'all' || c.id === filter);

  const limited    = GIFTS.filter(g => g.max != null);
  const totalSlots = limited.reduce((s, g) => s + g.max, 0);
  const slotsTaken = limited.reduce((s, g) => s + Math.min(counts[g.id] || 0, g.max), 0);
  const progress   = totalSlots ? Math.round((slotsTaken / totalSlots) * 100) : 0;

  // Lo disponible primero; los regalos completos van al final
  const isFull = g => g.max != null && (counts[g.id] || 0) >= g.max && myPick !== g.id;
  const myGift = myPick ? GIFTS_BY_ID[myPick] : null;

  return (
    <>
      <Decorations />
      <Confetti pieces={pieces} />

      <div className={styles.page}>
        <Hero />

        <main id="regalos" className={styles.main}>
          <section className={styles.intro}>
            <HoneyPot />
            <div>
              <h2 className={styles.sectionTitle}>Lista de regalos</h2>
              <p className={styles.introText}>
                Cada invitado elige <strong>un regalo</strong>. Varias personas pueden
                regalar lo mismo hasta completar la cantidad que necesitamos: los
                panales de miel muestran cuántos lugares quedan.
              </p>
              {!loading && !error && (
                <div className={styles.progress}>
                  <div className={styles.progressBar} role="progressbar"
                    aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}
                    aria-label="Avance de la lista de regalos">
                    <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                  </div>
                  <span className={styles.progressText}>
                    <strong><RollingNumber value={slotsTaken} from={0} /></strong> de {totalSlots} regalos ya tienen quién los regale
                  </span>
                </div>
              )}
            </div>
          </section>

          <nav className={styles.chips} aria-label="Filtrar por categoría">
            <button
              className={`${styles.chip} ${filter === 'all' ? styles.chipOn : ''}`}
              onClick={() => setFilter('all')}>
              Todos
            </button>
            {CATEGORIES.map(c => (
              <button key={c.id}
                className={`${styles.chip} ${filter === c.id ? styles.chipOn : ''}`}
                onClick={() => setFilter(c.id)}>
                {c.name}
              </button>
            ))}
          </nav>

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
            visible.map(cat => (
              <section key={cat.id} className={styles.category}>
                <h3 className={styles.catTitle}>
                  <GiftIcon category={cat.id} color={cat.color} size={40} />
                  {cat.name}
                </h3>
                {cat.id === 'originales' && (
                  <p className={styles.catNote}>Ideas sin límite de cantidad, por si querés sorprender.</p>
                )}
                <div className={styles.grid}>
                  {GIFTS.filter(g => g.category === cat.id)
                    .sort((a, b) => isFull(a) - isFull(b))
                    .map(gift => (
                    <GiftCard
                      key={gift.id}
                      gift={gift}
                      count={counts[gift.id] || 0}
                      isMine={myPick === gift.id}
                      hasOtherPick={!!myPick && myPick !== gift.id}
                      busy={busy}
                      onChoose={() => handleChoose(gift.id)}
                      onCancel={() => choose(null)}
                    />
                  ))}
                </div>
              </section>
            ))
          )}

          <section className={styles.tips}>
            <h2 className={styles.sectionTitle}>Tips para los invitados</h2>
            <ul>
              {TIPS.map(t => <li key={t}>{t}</li>)}
            </ul>
          </section>
        </main>

        <footer className={styles.footer}>
          Hecho con <HeartIcon /> para el Baby Shower de Matheo
        </footer>
      </div>

      {notice && (
        <div className={styles.toast} role="alert">
          <span>{notice}</span>
          <button onClick={dismissNotice} aria-label="Cerrar aviso">Cerrar</button>
        </div>
      )}

      {myGift && (
        <div className={styles.pickBar} role="status">
          <div>
            <span className={styles.pickLabel}>Tu regalo</span>
            <strong className={styles.pickName}>
              {myGift.name}{myGift.detail ? ` · ${myGift.detail}` : ''}
            </strong>
          </div>
          <button className={styles.pickCancel} onClick={() => choose(null)} disabled={busy}>
            Cancelar
          </button>
        </div>
      )}
    </>
  );
}
