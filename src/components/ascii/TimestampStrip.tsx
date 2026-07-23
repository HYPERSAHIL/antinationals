import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface TimestampStripProps {
  className?: string;
  prefix?: string;
}

/**
 * TimestampStrip — CCTV-style live UTC clock. Updates once per second.
 * Pauses when the tab is hidden. Formatted as: YYYY-MM-DD HH:MM:SS UTC
 */
export const TimestampStrip = ({ className, prefix = "REC" }: TimestampStripProps) => {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    let id: number | undefined;
    const start = () => { id = window.setInterval(() => setNow(new Date()), 1000); };
    const stop = () => { if (id) window.clearInterval(id); id = undefined; };
    const onVis = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVis);
    return () => { stop(); document.removeEventListener("visibilitychange", onVis); };
  }, []);
  const iso = now.toISOString().replace("T", " ").slice(0, 19);
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
        <span className="h-1.5 w-1.5 bg-accent motion-safe:animate-pulse" aria-hidden />
        <span className="text-accent">{prefix}</span>
      </span>
      <span className="text-foreground">{iso} UTC</span>
    </div>
  );
};
