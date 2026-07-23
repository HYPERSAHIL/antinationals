import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { AsciiScene } from "./AsciiScene";

const FRAMES = [
  "  .  ▂  ▃  ▂  ▄  ▃  ▂  ▅  ▂  ▃  ▄  ▂  ▃  .   ",
  "  ▂  ▃  ▄  ▂  ▃  ▅  ▂  ▄  ▃  ▂  ▄  ▃  ▂  ▃   ",
  "  ▃  ▄  ▂  ▅  ▂  ▄  ▃  ▂  ▄  ▃  ▂  ▅  ▂  ▃   ",
  "  ▄  ▂  ▃  ▂  ▄  ▃  ▂  ▅  ▂  ▄  ▂  ▃  ▄  ▂   ",
];

/**
 * AsciiCrowd — evocative crowd silhouette strip. Cycles frames slowly
 * (400ms) using a single interval. Pauses when tab is hidden. Fully
 * decorative — never implies identity of any specific person.
 */
export const AsciiCrowd = ({ className }: { className?: string }) => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let id: number | undefined;
    const start = () => { id = window.setInterval(() => setI((n) => (n + 1) % FRAMES.length), 420); };
    const stop = () => { if (id) window.clearInterval(id); id = undefined; };
    const onVis = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVis);
    return () => { stop(); document.removeEventListener("visibilitychange", onVis); };
  }, []);
  return (
    <AsciiScene className={cn("ascii-muted", className)}>
      {FRAMES[i]}
    </AsciiScene>
  );
};
