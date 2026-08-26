import PostsManager from '@/components/admin/PostsManager';

export const dynamic = 'force-dynamic';

export default function PostsPage({ searchParams }) {
  return <PostsManager initialQuery={searchParams?.q || ''} />;
}
