import PostCardSkeleton from '@/components/PostCardSkeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-wrap px-5 py-14 sm:px-8">
      <div className="mb-10 max-w-2xl">
        <div className="h-4 w-28 rounded shimmer" />
        <div className="mt-4 h-10 w-3/4 rounded shimmer" />
        <div className="mt-4 h-5 w-full rounded shimmer" />
      </div>
      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
