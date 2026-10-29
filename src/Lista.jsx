import { useEffect, useState, useCallback } from 'react';
import { CATEGORIES, GIFTS } from './data/gifts';
import { RollingNumber } from '@/components/ui/rolling-number';
import GiftIcon from './components/GiftIcon';
import styles from './Lista.module.css';

function pct(n, d) {
  return d > 0 ? Math.round((n / d) * 100) : 0;
}

// Panel para los papás: cuántas personas eligieron cada regalo.
export default function Lista() {
  const [counts,  setCounts]  = useState({});
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const [updated, setUpdated] = useState(null);
  const [view,    setView]    = useState('all');

  const fetchCounts = useCallback(async () => {
    try {
      const res  = await fetch('/api/gifts');
      const data = await res.json();
      setCounts(data.counts || {});
      setUpdated(new Date());
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
    const id = setInterval(fetchCounts, 20_000);
    return () => clearInterval(id);
  }, [fetchCounts]);

  const rows = GIFTS.map(g => {
    const count = counts[g.id] || 0;
    const state = g.max == null ? 'open'
      : count >= g.max ? 'full'
      : count > 0 ? 'partial' : 'empty';
    return { ...g, count, state };
  });

  const limited      = rows.filter(r => r.max != null);
  const totalChosen  = rows.reduce((s, r) => s + r.count, 0);
  const totalSlots   = limited.reduce((s, r) => s + r.max, 0);
  const slotsTaken   = limited.reduce((s, r) => s + Math.min(r.count, r.max), 0);
  const fullCount    = limited.filter(r => r.state === 'full').length;
  const emptyCount   = limited.filter(r => r.state === 'empty').length;
  const originals    = rows.filter(r => r.max == null).reduce((s, r) => s + r.count, 0);

  const byCategory = CATEGORIES.map(c => {
    const items  = rows.filter(r => r.category === c.id);
    const chosen = items.reduce((s, r) => s + r.count, 0);
    const slots  = items.reduce((s, r) => s + (r.max ?? 0), 0);
    return { ...c, items, chosen, slots };
  });

  const filterRow = r =>
    view === 'all' ? true
    : view === 'chosen' ? r.count > 0
    : view === 'missing' ? r.state === 'empty' || r.state === 'partial'
    : r.state === 'full';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>Baby Shower de Matheo</p>
        <h1 className={styles.title}>Métricas de regalos</h1>
        <p className={styles.sub}>
          {updated
            ? `Actualizado ${updated.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} · se refresca solo cada 20 segundos`
            : 'Cargando…'}
          <button className={styles.refresh} onClick={fetchCounts}>Actualizar</button>
        </p>
      </header>

      {error && (
        <p className={styles.error}>No se pudo conectar al servidor. Mostrando los últimos datos cargados.</p>
      )}

      {loading ? (
        <div className={styles.spinner} role="status" aria-label="Cargando" />
      ) : (
        <main className={styles.main}>
          <section className={styles.stats}>
            <Stat label="Regalos elegidos" value={totalChosen} note="personas que ya eligieron" />
            <Stat label="Cupos cubiertos" value={slotsTaken} total={totalSlots} note={`${pct(slotsTaken, totalSlots)}% de la lista`} />
            <Stat label="Regalos completos" value={fullCount} total={limited.length} note="llegaron a su cupo" />
            <Stat label="Sin elegir todavía" value={emptyCount} note="nadie los eligió" />
            <Stat label="Regalos originales" value={originals} note="elegidos (sin límite)" />
          </section>

          <section className={styles.card}>
            <h2 className={styles.h2}>Avance general</h2>
            <Bar value={slotsTaken} max={totalSlots} color="var(--honey-deep)" big />
          </section>

          <section className={styles.card}>
            <h2 className={styles.h2}>Por categoría</h2>
            <div className={styles.catList}>
              {byCategory.map(c => (
                <div key={c.id} className={styles.catRow}>
                  <div className={styles.catName}>
                    <GiftIcon category={c.id} color={c.color} size={28} />
                    <span>{c.name}</span>
                  </div>
                  {c.slots > 0
                    ? <Bar value={Math.min(c.chosen, c.slots)} max={c.slots} color={c.color} />
                    : <span className={styles.openCount}><Num value={c.chosen} /> elegidos</span>}
                </div>
              ))}
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.tableHead}>
              <h2 className={styles.h2}>Detalle de todos los regalos</h2>
              <div className={styles.tabs} role="tablist">
                {[
                  ['all', 'Todos'],
                  ['chosen', 'Elegidos'],
                  ['missing', 'Faltan'],
                  ['full', 'Completos'],
                ].map(([id, label]) => (
                  <button key={id} role="tab" aria-selected={view === id}
                    className={`${styles.tab} ${view === id ? styles.tabOn : ''}`}
                    onClick={() => setView(id)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {byCategory.map(c => {
              const items = c.items.filter(filterRow);
              if (!items.length) return null;
              return (
                <div key={c.id} className={styles.group}>
                  <h3 className={styles.groupTitle} style={{ borderColor: c.color }}>{c.name}</h3>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Regalo</th>
                        <th className={styles.num}>Elegido</th>
                        <th className={styles.num}>Cupo</th>
                        <th className={styles.num}>Faltan</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(r => (
                        <tr key={r.id}>
                          <td>
                            <span className={styles.giftName}>{r.name}</span>
                            {r.detail && <span className={styles.detail}>{r.detail}</span>}
                          </td>
                          <td className={styles.num}><strong><Num value={r.count} /></strong></td>
                          <td className={styles.num}>{r.max ?? 'Libre'}</td>
                          <td className={styles.num}>{r.max == null ? '-' : Math.max(r.max - r.count, 0)}</td>
                          <td><StateBadge state={r.state} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </section>
        </main>
      )}
    </div>
  );
}

function Num({ value }) {
  return <RollingNumber value={value} from={0} />;
}

function Stat({ label, value, total, note }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>{label}</span>
      <strong className={styles.statValue}>
        <Num value={value} />{total != null && ` / ${total}`}
      </strong>
      <span className={styles.statNote}>{note}</span>
    </div>
  );
}

function Bar({ value, max, color, big }) {
  const p = pct(value, max);
  return (
    <div className={styles.barWrap}>
      <div className={`${styles.bar} ${big ? styles.barBig : ''}`}>
        <div className={styles.barFill} style={{ width: `${p}%`, background: color }} />
      </div>
      <span className={styles.barText}><Num value={value} /> / {max} · <Num value={p} />%</span>
    </div>
  );
}

const STATE_LABELS = {
  full:    'Completo',
  partial: 'En curso',
  empty:   'Sin elegir',
  open:    'Sin límite',
};

function StateBadge({ state }) {
  return <span className={`${styles.badge} ${styles[`badge_${state}`]}`}>{STATE_LABELS[state]}</span>;
}
