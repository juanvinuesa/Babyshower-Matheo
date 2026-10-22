import { useState, useEffect, useCallback } from 'react';

function loadMyPicks() {
  try { return JSON.parse(localStorage.getItem('msw-picks') || '{}'); }
  catch { return {}; }
}

export function useGiftRegistry() {
  const [counts,  setCounts]  = useState({});
  const [myPicks, setMyPicks] = useState(loadMyPicks);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

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

  // Carga inicial + polling cada 20s para ver cambios de otros usuarios
  useEffect(() => {
    fetchCounts();
    const id = setInterval(fetchCounts, 20_000);
    return () => clearInterval(id);
  }, [fetchCounts]);

  useEffect(() => {
    localStorage.setItem('msw-picks', JSON.stringify(myPicks));
  }, [myPicks]);

  const toggle = useCallback(async (id) => {
    const wasSelected = !!myPicks[id];
    const delta = wasSelected ? -1 : 1;

    // Actualización optimista inmediata
    setMyPicks(prev => ({ ...prev, [id]: !wasSelected }));
    setCounts(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }));

    try {
      await fetch('/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: String(id), delta }),
      });
    } catch {
      // Rollback si falla
      setMyPicks(prev => ({ ...prev, [id]: wasSelected }));
      setCounts(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) - delta) }));
    }
  }, [myPicks]);

  const totalPicks = Object.values(myPicks).filter(Boolean).length;

  return { counts, myPicks, toggle, totalPicks, loading, error, refresh: fetchCounts };
}
