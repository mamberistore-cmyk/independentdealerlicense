export default function Loading() {
  return (
    <div className="mx-auto max-w-prose px-5 py-14 sm:px-6">
      <div className="h-3 w-40 rounded shimmer" />
      <div className="mt-6 flex gap-2">
        <div className="h-5 w-16 rounded-full shimmer" />
        <div className="h-5 w-16 rounded-full shimmer" />
      </div>
      <div className="mt-5 h-11 w-full rounded shimmer" />
      <div className="mt-3 h-11 w-2/3 rounded shimmer" />
      <div className="mt-8 h-64 w-full rounded-xl2 shimmer" />
      <div className="mt-10 space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`h-4 rounded shimmer ${i % 3 === 2 ? 'w-4/5' : 'w-full'}`} />
        ))}
      </div>
    </div>
  );
}
