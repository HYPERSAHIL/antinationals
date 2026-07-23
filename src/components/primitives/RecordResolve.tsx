import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface RecordResolveProps {
  /** Final text to resolve to. Always exposed to assistive tech immediately. */
  text: string;
  /** Total scramble duration in ms. Runs once. */
  durationMs?: number;
  /** Optional delay before starting. */
  startDelayMs?: number;
  className?: string;
  /** Force play even if IntersectionObserver isn't triggered. */
  eager?: boolean;
}

const GLYPHS = "▒▓░#*+=-".split("");

const scramble = (text: string) => {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === " " || ch === "\n") out += ch;
    else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
  }
  return out;
};

/**
 * RecordResolve — archival "record found" character-resolve effect.
 * Runs once when it enters view. Preserves whitespace and casing.
 * Reduced-motion users see the final text immediately.
 * The accessible name is always the final text.
 *
 * Visual initial state is scrambled (not the final text) so viewers
 * never see a resolved flash before the effect begins.
 */
export const RecordResolve = ({
  text,
  durationMs = 600,
  startDelayMs = 0,
  className,
  eager = false,
}: RecordResolveProps) => {
  // Initialize to a scrambled placeholder so we never flash the final text.
  const [out, setOut] = useState(() => {
    if (typeof window === "undefined") return text;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    return reduce ? text : scramble(text);
  });
  const ref = useRef<HTMLSpanElement | null>(null);
  const played = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setOut(text);
      played.current = true;
      return;
    }

    let raf = 0;
    let cancelled = false;

    const play = () => {
      if (played.current || cancelled) return;
      played.current = true;
      const start = performance.now() + startDelayMs;
      const total = Math.max(120, durationMs);
      const tick = (now: number) => {
        if (cancelled) return;
        const t = Math.max(0, now - start);
        const progress = Math.min(1, t / total);
        const resolved = Math.floor(progress * text.length);
        let next = "";
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (i < resolved || ch === " " || ch === "\n") next += ch;
          else next += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        setOut(next);
        if (progress < 1) raf = requestAnimationFrame(tick);
        else setOut(text);
      };
      raf = requestAnimationFrame(tick);
    };

    if (eager) {
      play();
      return () => { cancelled = true; if (raf) cancelAnimationFrame(raf); };
    }

    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) play();
    }, { threshold: 0.4 });
    io.observe(node);
    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [text, durationMs, startDelayMs, eager]);

  return (
    <span
      ref={ref}
      className={cn("font-mono tabular", className)}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden>{out}</span>
    </span>
  );
};
