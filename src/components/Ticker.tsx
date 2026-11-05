import { TICKER_ITEMS } from "../data/content";

export default function Ticker() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-line bg-[rgba(255,255,255,0.4)] py-3.5"
    >
      <div className="ticker-track">
        {[0, 1].map((i) => (
          <span
            key={i}
            className="whitespace-nowrap font-mono text-xs tracking-[0.24em] text-ink-faint"
          >
            {TICKER_ITEMS.replaceAll(" · ", "\u00a0·\u00a0")}
          </span>
        ))}
      </div>
    </div>
  );
}
