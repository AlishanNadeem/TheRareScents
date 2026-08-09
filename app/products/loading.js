export default function ProductsLoading() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:py-16">
        <div
          className="animate-pulse"
          role="status"
          aria-label="Loading fragrances"
        >
          <div className="flex flex-col items-center text-center">
            <div className="h-8 w-64 rounded-full bg-ink/10 sm:h-10 sm:w-80" />
            <div className="mt-4 h-4 w-72 rounded-full bg-ink/10 sm:w-96" />
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-8 w-20 rounded-full bg-ink/10" />
              ))}
            </div>
            <div className="h-8 w-40 rounded-full bg-ink/10" />
          </div>

          <div className="mt-4 flex justify-center">
            <div className="h-3 w-20 rounded-full bg-ink/10" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-ink/10 bg-white"
              >
                <div className="aspect-[3/4] w-full bg-neutral-200" />
                <div className="space-y-2 p-4">
                  <div className="h-3 w-16 rounded-full bg-neutral-200" />
                  <div className="h-4 w-3/4 rounded-full bg-neutral-200" />
                  <div className="h-3 w-full rounded-full bg-neutral-200" />
                  <div className="h-3 w-1/2 rounded-full bg-neutral-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
