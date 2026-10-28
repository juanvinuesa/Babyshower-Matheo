import { useState, useEffect, useCallback } from 'react';
import { GIFTS_BY_ID } from '../data/gifts';

const STORAGE_KEY = 'matheo-regalo';

function loadMyPick() {
  try {
    const id = localStorage.getItem(STORAGE_KEY);
    return id && GIFTS_BY_ID[id] ? id : null;
  } catch { return null; }
}

function bump(counts, id, delta) {
  if (!id) return counts;
  return { ...counts, [id]: Math.max(0, (counts[id] || 0) + delta) };
}

// Cada invitado elige un solo regalo. Varios invitados pueden elegir
// el mismo, hasta el cupo (`max`) que controla el servidor.
export function useGiftRegistry() {
  const [counts,  setCounts]  = useState({});
  const [myPick,  setMyPick]  = useState(loadMyPick);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const [notice,  setNotice]  = useState(null);
  const [busy,    setBusy]    = useState(false);

  const fetchCounts = useCallback(async () => {
    try {
      const res  = await fetch('/api/gifts');
      const data = await res.json();
      setCounts(data.counts || {});
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial + polling cada 20s para ver cambios de otros invitados
  useEffect(() => {
    fetchCounts();
    const id = setInterval(fetchCounts, 20_000);
    return () => clearInterval(id);
  }, [fetchCounts]);

  useEffect(() => {
    try {
      if (myPick) localStorage.setItem(STORAGE_KEY, myPick);
      else localStorage.removeItem(STORAGE_KEY);
    } catch { /* sin almacenamiento: la elección vale solo en esta visita */ }
  }, [myPick]);

  // `id` null cancela la elección actual.
  const choose = useCallback(async (id) => {
    if (busy) return false;
    const previous = myPick;
    if (id === previous) return false;

    setBusy(true);
    setNotice(null);
    setMyPick(id);
    setCounts(prev => bump(bump(prev, previous, -1), id, 1));

    try {
      const res = await fetch('/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pick: id ?? '', release: previous ?? '' }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'No se pudo guardar tu elección');
      }
      return true;
    } catch (err) {
      setMyPick(previous);
      setNotice(err.message);
      return false;
    } finally {
      setBusy(false);
      fetchCounts();
    }
  }, [busy, myPick, fetchCounts]);

  return {
    counts, myPick, choose, busy, loading, error, notice,
    dismissNotice: () => setNotice(null),
  };
}
