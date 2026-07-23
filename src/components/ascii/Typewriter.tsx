import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface TypewriterProps {
  text: string;
  speedMs?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  startDelayMs?: number;
}

/**
 * Typewriter — types text out once when it enters the viewport. Respects
 * prefers-reduced-motion (renders full text immediately in that case).
 */
export const Typewriter = ({
  text,
  speedMs = 28,
  className,
  as = "span",
  startDelayMs = 0,
}: TypewriterProps) => {
  const Tag = as as any;
  const [out, setOut] = useState("");
  const ref = useRef<HTMLElement | null>(null);
  const played = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setOut(text); return; }
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !played.current) {
          played.current = true;
          let i = 0;
          const tick = () => {
            i += 1;
            setOut(text.slice(0, i));
            if (i < text.length) window.setTimeout(tick, speedMs);
          };
          window.setTimeout(tick, startDelayMs);
          io.disconnect();
        }
      }
    }, { threshold: 0.2 });
    io.observe(node);
    return () => io.disconnect();
  }, [text, speedMs, startDelayMs]);

  return <Tag ref={ref as any} className={cn("font-mono", className)}>{out}</Tag>;
};
