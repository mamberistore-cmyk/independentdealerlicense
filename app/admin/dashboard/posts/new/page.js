'use client';

import PostEditor from '@/components/admin/PostEditor';
import { usePosts } from '@/components/admin/usePosts';

export default function NewPostPage() {
  const { posts } = usePosts();
  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));
  return <PostEditor mode="new" categories={categories} />;
}
