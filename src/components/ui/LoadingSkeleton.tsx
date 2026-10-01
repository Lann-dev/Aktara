export function LoadingSkeleton() {
  return (
    <section className="space-y-5" role="status" aria-live="polite" aria-label="Memuat data AKTARA">
      <span className="sr-only">Memuat data...</span>
      <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-5">
        <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
        <div className="h-6 w-2/3 max-w-md animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-full max-w-xl animate-pulse rounded bg-slate-100" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
            <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
            <div className="h-7 w-16 animate-pulse rounded bg-slate-200" />
            <div className="h-2 w-full animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
      <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
        <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
        <div className="h-10 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-10 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-10 w-full animate-pulse rounded bg-slate-100" />
      </div>
    </section>
  );
}