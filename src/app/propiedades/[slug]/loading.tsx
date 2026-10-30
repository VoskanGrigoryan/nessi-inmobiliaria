function SkeletonBlock({ className }: { className: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded bg-gray-200 motion-reduce:animate-none ${className}`} />;
}

export default function PropertyLoading() {
  return (
    <main role="status" aria-label="Cargando propiedad" aria-busy="true" className="mx-auto w-full max-w-screen-2xl px-4 py-8 sm:px-5 sm:py-12 lg:px-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <SkeletonBlock className="h-10 w-44" />
        <SkeletonBlock className="h-10 w-36" />
      </div>

      <div className="grid gap-3 sm:grid-cols-[1.6fr_1fr]">
        <SkeletonBlock className="aspect-[1.45] sm:aspect-auto sm:min-h-[420px]" />
        <div className="hidden grid-rows-2 gap-3 sm:grid">
          <SkeletonBlock className="min-h-[204px]" />
          <SkeletonBlock className="min-h-[204px]" />
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-6 w-24" />
            <SkeletonBlock className="h-4 w-48" />
          </div>
          <SkeletonBlock className="mt-4 h-10 w-4/5 max-w-2xl" />
          <SkeletonBlock className="mt-4 h-8 w-48" />
          <SkeletonBlock className="mt-2 h-4 w-36" />

          <div className="mt-7 grid grid-cols-2 gap-x-3 gap-y-5 border-y border-navy/10 py-5 sm:grid-cols-3 lg:grid-cols-4">
            {["w-24", "w-28", "w-20", "w-24", "w-28", "w-32", "w-28"].map((width, index) => (
              <div key={index} className="flex items-center gap-2">
                <SkeletonBlock className="size-5 rounded-full" />
                <SkeletonBlock className={`h-4 ${width}`} />
              </div>
            ))}
          </div>

          <section className="mt-8">
            <SkeletonBlock className="h-7 w-36" />
            <div className="mt-3 flex gap-2">
              <SkeletonBlock className="h-9 w-24" />
              <SkeletonBlock className="h-9 w-28" />
              <SkeletonBlock className="h-9 w-20" />
            </div>
          </section>

          <section className="mt-8">
            <SkeletonBlock className="h-7 w-56" />
            <SkeletonBlock className="mt-3 h-4 w-full max-w-3xl" />
            <SkeletonBlock className="mt-2 h-4 w-4/5 max-w-2xl" />
            <SkeletonBlock className="mt-2 h-4 w-2/3 max-w-xl" />
          </section>
        </div>

        <aside className="h-fit space-y-3 rounded-xl border border-navy/10 bg-white p-4">
          <SkeletonBlock className="h-6 w-36" />
          <SkeletonBlock className="h-12 w-full" />
          <SkeletonBlock className="h-12 w-full" />
          <SkeletonBlock className="h-12 w-full" />
          <SkeletonBlock className="h-20 w-full" />
          <SkeletonBlock className="h-12 w-full" />
          <SkeletonBlock className="h-12 w-full" />
        </aside>
      </div>
    </main>
  );
}
