'use client';

import { useEffect, useState, useCallback } from 'react';

// Persists a small JSON config in localStorage (per-browser). Used for admin
// preferences that don't have a server backend yet (redirects, ad placements).
export function useLocalConfig(key, initial) {
  const [value, setValue] = useState(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch (e) {}
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const save = useCallback(
    (next) => {
      setValue(next);
      try { localStorage.setItem(key, JSON.stringify(next)); } catch (e) {}
    },
    [key]
  );

  return [value, save, loaded];
}
