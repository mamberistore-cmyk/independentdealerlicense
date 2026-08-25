export default function PostCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl2 border border-cream-300/70 bg-cream-50 shadow-soft">
      <div className="aspect-[16/10] shimmer" />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="h-3 w-28 rounded shimmer" />
        <div className="h-5 w-full rounded shimmer" />
        <div className="h-5 w-3/4 rounded shimmer" />
        <div className="mt-1 h-3 w-full rounded shimmer" />
        <div className="h-3 w-5/6 rounded shimmer" />
        <div className="mt-auto flex gap-2 pt-3">
          <div className="h-5 w-14 rounded-full shimmer" />
          <div className="h-5 w-14 rounded-full shimmer" />
        </div>
      </div>
    </div>
  );
}
