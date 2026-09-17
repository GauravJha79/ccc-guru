export default function GlobalLoading() {
  return (
    <div className="container-page py-10 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header skeleton */}
        <div className="space-y-3">
          <div className="h-8 w-64 bg-border/60 rounded-lg skeleton" />
          <div className="h-4 w-96 max-w-full bg-border/40 rounded skeleton" />
        </div>

        {/* Filter tags skeleton */}
        <div className="flex gap-2 flex-wrap">
          <div className="h-7 w-16 bg-border/50 rounded-full skeleton" />
          <div className="h-7 w-24 bg-border/50 rounded-full skeleton" />
          <div className="h-7 w-20 bg-border/50 rounded-full skeleton" />
          <div className="h-7 w-28 bg-border/50 rounded-full skeleton" />
        </div>

        {/* Cards grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-4">
              <div className="aspect-video w-full rounded-lg bg-border/50 skeleton" />
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-border/60 rounded skeleton" />
                <div className="h-3 w-1/2 bg-border/40 rounded skeleton" />
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border-subtle">
                <div className="h-3 w-16 bg-border/40 rounded skeleton" />
                <div className="h-5 w-14 bg-border/50 rounded-full skeleton" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
