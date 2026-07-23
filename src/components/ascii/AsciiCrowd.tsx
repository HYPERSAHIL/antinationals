import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { AsciiScene } from "./AsciiScene";

const FRAMES = [
  "  .  ▂  ▃  ▂  ▄  ▃  ▂  ▅  ▂  ▃  ▄  ▂  ▃  .   ",
  "  ▂  ▃  ▄  ▂  ▃  ▅  ▂  ▄  ▃  ▂  ▄  ▃  ▂  ▃   ",
  "  ▃  ▄  ▂  ▅  ▂  ▄  ▃  ▂  ▄  ▃  ▂  ▅  ▂  ▃   ",
  "  ▄  ▂  ▃  ▂  ▄  ▃  ▂  ▅  ▂  ▄  ▂  ▃  ▄  ▂   ",
];

/**
 * AsciiCrowd — evocative crowd silhouette strip. Cycles frames slowly
 * (~700ms) — secondary/ambient motion only. Pauses when tab is hidden
 * OR when off-screen. Respects prefers-reduced-motion.
 */
export const AsciiCrowd = ({ className }: { className?: string }) => {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let id: number | undefined;
    let visibleInDoc = !document.hidden;
    let visibleInView = true;

    const start = () => {
      if (id) return;
      id = window.setInterval(() => setI((n) => (n + 1) % FRAMES.length), 720);
    };
    const stop = () => { if (id) window.clearInterval(id); id = undefined; };
    const evaluate = () => (visibleInDoc && visibleInView ? start() : stop());

    const onVis = () => { visibleInDoc = !document.hidden; evaluate(); };
    document.addEventListener("visibilitychange", onVis);

    let io: IntersectionObserver | undefined;
    if (ref.current && "IntersectionObserver" in window) {
      io = new IntersectionObserver((entries) => {
        visibleInView = entries[0]?.isIntersecting ?? true;
        evaluate();
      }, { threshold: 0.01 });
      io.observe(ref.current);
    } else {
      start();
    }

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
      io?.disconnect();
    };
  }, []);

  return (
    <div ref={ref}>
      <AsciiScene className={cn("ascii-muted", className)}>{FRAMES[i]}</AsciiScene>
    </div>
  );
};
