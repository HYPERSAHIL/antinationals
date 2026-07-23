import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface TimestampStripProps {
  className?: string;
  /** Left-side prefix. Defaults to REC. */
  prefix?: string;
  /**
   * Contextual record metadata. When provided, the strip communicates
   * archive context (e.g. "ARCHIVE / PUBLIC INDEX", "INC-00031 / CHRONOLOGY")
   * instead of being a decorative live clock.
   */
  context?: string;
  /** Show live UTC clock. Off by default when `context` is provided. */
  showClock?: boolean;
}

/**
 * TimestampStrip — archival record-metadata strip. Can render either:
 *  - a contextual record label (default when `context` is set), or
 *  - a subtle live UTC clock (legacy behavior when no context).
 * Clock pauses when the tab is hidden.
 */
export const TimestampStrip = ({
  className,
  prefix = "REC",
  context,
  showClock,
}: TimestampStripProps) => {
  const shouldTick = showClock ?? !context;
  const [now, setNow] = useState<Date | null>(() => (shouldTick ? new Date() : null));

  useEffect(() => {
    if (!shouldTick) return;
    let id: number | undefined;
    const start = () => { id = window.setInterval(() => setNow(new Date()), 1000); };
    const stop = () => { if (id) window.clearInterval(id); id = undefined; };
    const onVis = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVis);
    return () => { stop(); document.removeEventListener("visibilitychange", onVis); };
  }, [shouldTick]);

  const iso = now ? now.toISOString().replace("T", " ").slice(0, 19) + " UTC" : null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em]",
        "border border-rule bg-surface-1 px-2.5 py-1 text-muted-foreground",
        className,
      )}
      aria-live="off"
    >
      <span className="inline-flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 bg-accent" aria-hidden />
        <span className="text-accent">{prefix}</span>
      </span>
      {context && <span className="text-foreground">{context}</span>}
      {iso && (
        <span className={cn(context ? "text-muted-foreground" : "text-foreground")}>
          {iso}
        </span>
      )}
    </div>
  );
};
