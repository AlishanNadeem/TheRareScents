const TIERS = [
  { key: "top", label: "Top Notes", widthClass: "max-w-[70%]" },
  { key: "middle", label: "Middle Notes", widthClass: "max-w-[85%]" },
  { key: "base", label: "Base Notes", widthClass: "max-w-full" },
];

export function hasFragranceNotes(notes) {
  if (!notes) return false;
  return TIERS.some((tier) => (notes[tier.key] ?? []).length > 0);
}

export default function NotesPyramid({ notes }) {
  if (!hasFragranceNotes(notes)) return null;

  return (
    <div className="space-y-4">
      {TIERS.map((tier) => {
        const items = notes[tier.key] ?? [];
        if (!items.length) return null;

        return (
          <div
            key={tier.key}
            className={`mx-auto text-center ${tier.widthClass}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">
              {tier.label}
            </p>
            <ul className="mt-2 flex flex-wrap justify-center gap-2">
              {items.map((note) => (
                <li
                  key={note}
                  className="rounded-full border border-ink/15 bg-ink/5 px-3 py-1 text-xs text-ink"
                >
                  {note}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
