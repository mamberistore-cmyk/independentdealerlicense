'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PostEditor from '@/components/admin/PostEditor';
import { Button } from '@/components/admin/ui';
import { BASE } from '@/lib/adminNav';

export default function EditPostPage({ params }) {
  const slug = params.slug;
  const [state, setState] = useState({ loading: true, error: '', data: null });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/post?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Could not load this post.');
        if (alive) setState({ loading: false, error: '', data });
      } catch (e) {
        if (alive) setState({ loading: false, error: e.message, data: null });
      }
    })();
    return () => { alive = false; };
  }, [slug]);

  if (state.loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 rounded-lg shimmer" />
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            <div className="h-14 rounded-xl shimmer" />
            <div className="h-10 rounded-lg shimmer" />
            <div className="h-96 rounded-xl shimmer" />
          </div>
          <div className="space-y-4">
            <div className="h-64 rounded-xl shimmer" />
            <div className="h-40 rounded-xl shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-zinc-50">Couldn’t open this post</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">{state.error}</p>
        <div className="mt-6"><Button href={`${BASE}/posts`} variant="secondary">Back to posts</Button></div>
      </div>
    );
  }

  return <PostEditor mode="edit" initial={state.data} />;
}
