const MESSAGES = [
  "Cash on Delivery Across Pakistan",
  "100% Original & Authentic Fragrances",
  "Order via WhatsApp — Fast Response",
  "New Arrivals Every Month",
];

// Repeat the set so each half of the track is wider than typical desktops —
// keeps the infinite loop seamless on large screens.
const SET_REPEATS = 4;

function MessageSequence({ ariaHidden = false }) {
  const items = Array.from({ length: SET_REPEATS }, () => MESSAGES).flat();

  return (
    <ul
      className="flex shrink-0 items-center"
      aria-hidden={ariaHidden ? "true" : undefined}
    >
      {items.map((message, index) => (
        <li
          key={`${message}-${index}`}
          className="flex shrink-0 items-center whitespace-nowrap px-4 text-[11px] font-medium uppercase tracking-[0.18em] text-paper sm:text-xs"
        >
          <span className="mr-4 text-gold" aria-hidden="true">
            •
          </span>
          {message}
        </li>
      ))}
    </ul>
  );
}

/**
 * Thin premium ticker strip for the homepage — sits under the navbar.
 * Scrolls continuously via CSS; pauses on hover; static under
 * prefers-reduced-motion.
 */
export default function AnnouncementStrip() {
  return (
    <aside
      aria-label="Announcements"
      className="border-b border-gold/15 bg-ink"
    >
      {/* Animated ticker (default) */}
      <div className="announcement-animated overflow-hidden py-2.5">
        <div className="announcement-track flex w-max">
          <MessageSequence />
          <MessageSequence ariaHidden />
        </div>
      </div>

      {/* Static fallback for reduced-motion users */}
      <div className="announcement-static hidden overflow-x-auto py-2.5">
        <ul className="mx-auto flex w-max max-w-full items-center px-4">
          {MESSAGES.map((message) => (
            <li
              key={message}
              className="flex shrink-0 items-center whitespace-nowrap px-3 text-[11px] font-medium uppercase tracking-[0.18em] text-paper sm:text-xs"
            >
              <span className="mr-3 text-gold" aria-hidden="true">
                •
              </span>
              {message}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
