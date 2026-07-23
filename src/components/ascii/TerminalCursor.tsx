import { cn } from "@/lib/utils";

interface TerminalCursorProps {
  className?: string;
}

/** Blinking block cursor. Respects prefers-reduced-motion via global CSS. */
export const TerminalCursor = ({ className }: TerminalCursorProps) => (
  <span aria-hidden className={cn("cursor-blink text-foreground", className)} />
);
