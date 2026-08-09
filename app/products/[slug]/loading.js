export default function ProductDetailLoading() {
  return (
    <article className="bg-paper">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div
          className="animate-pulse"
          role="status"
          aria-label="Loading fragrance details"
        >
          <div className="mb-6 h-4 w-40 rounded-full bg-ink/10" />

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <div className="aspect-[3/4] w-full rounded-xl bg-neutral-200" />
              <div className="mt-4 flex gap-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-20 w-16 shrink-0 rounded-lg bg-neutral-200"
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="h-3 w-20 rounded-full bg-ink/10" />
              <div className="mt-3 h-8 w-3/4 rounded-full bg-ink/10" />
              <div className="mt-3 h-4 w-full rounded-full bg-ink/10" />
              <div className="mt-5 h-5 w-32 rounded-full bg-ink/10" />

              <div className="mt-4 space-y-2">
                <div className="h-3 w-full rounded-full bg-ink/10" />
                <div className="h-3 w-full rounded-full bg-ink/10" />
                <div className="h-3 w-2/3 rounded-full bg-ink/10" />
              </div>

              <div className="mt-4 h-4 w-20 rounded-full bg-ink/10" />

              <div className="mt-8 space-y-4 rounded-xl bg-ink/5 p-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="mx-auto flex justify-center gap-2"
                  >
                    <div className="h-6 w-16 rounded-full bg-ink/10" />
                    <div className="h-6 w-16 rounded-full bg-ink/10" />
                    <div className="h-6 w-16 rounded-full bg-ink/10" />
                  </div>
                ))}
              </div>

              <div className="mt-8 h-12 w-full rounded-full bg-ink/10 sm:w-48" />
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-md">
            <div className="rounded-xl border border-ink/10 bg-white p-6">
              <div className="h-5 w-32 rounded-full bg-neutral-200" />
              <div className="mt-4 space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index}>
                    <div className="h-3 w-20 rounded-full bg-neutral-200" />
                    <div className="mt-2 h-9 w-full rounded-lg bg-neutral-100" />
                  </div>
                ))}
              </div>
              <div className="mt-4 h-10 w-full rounded-full bg-neutral-200" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
