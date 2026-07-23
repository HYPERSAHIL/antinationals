import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, type ElementType } from "react";

interface TypewriterProps {
  text: string;
  speedMs?: number;
  className?: string;
  as?: ElementType;
  startDelayMs?: number;
}

/**
 * Typewriter — types text out once when it enters the viewport.
 *
 * Accessibility contract:
 *  - The full final text is always exposed to assistive technology
 *    immediately via a visually-hidden node. Animation NEVER gates
 *    semantic content availability.
 *  - The animated partial text is aria-hidden (visual-only).
 *  - prefers-reduced-motion renders the final visual state immediately.
 *  - Pending timers are cancelled on unmount.
 */
export const Typewriter = ({
  text,
  speedMs = 28,
  className,
  as,
  startDelayMs = 0,
}: TypewriterProps) => {
  const Tag = (as ?? "span") as ElementType;
  const [out, setOut] = useState("");
  const ref = useRef<HTMLElement | null>(null);
  const played = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setOut(text);
      return;
    }
    const node = ref.current;
    if (!node) return;

    const timers: number[] = [];
    let disposed = false;

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !played.current) {
          played.current = true;
          io.disconnect();
          let i = 0;
          const tick = () => {
            if (disposed) return;
            i += 1;
            setOut(text.slice(0, i));
            if (i < text.length) {
              timers.push(window.setTimeout(tick, speedMs));
            }
          };
          timers.push(window.setTimeout(tick, startDelayMs));
        }
      }
    }, { threshold: 0.2 });
    io.observe(node);

    return () => {
      disposed = true;
      io.disconnect();
      for (const id of timers) window.clearTimeout(id);
    };
  }, [text, speedMs, startDelayMs]);

  return (
    <Tag ref={ref as never} className={cn("font-mono", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{out}</span>
    </Tag>
  );
};
