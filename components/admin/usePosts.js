'use client';

import { useEffect, useState, useCallback } from 'react';

// Fetches the post list from the admin API once and exposes refresh().
export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [githubReady, setGithubReady] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/posts', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load posts.');
      setPosts(data.posts || []);
      setGithubReady(data.githubReady !== false);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { posts, loading, error, githubReady, refresh: load };
}
