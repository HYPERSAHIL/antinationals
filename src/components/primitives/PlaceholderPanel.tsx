import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { TerminalLabel } from "./TerminalLabel";

interface PlaceholderPanelProps {
  phaseLabel?: string;
  title: string;
  children?: ReactNode;
  className?: string;
}

/**
 * PlaceholderPanel — used across Phase 0A to mark route sections that are
 * intentionally deferred to Phase 0B / 0C. Explicit, honest, non-decorative.
 */
export const PlaceholderPanel = ({
  phaseLabel = "PHASE 0B",
  title,
  children,
  className,
}: PlaceholderPanelProps) => (
  <div
    className={cn(
      "relative border border-rule bg-surface-1 p-6 md:p-10 overflow-hidden",
      className,
    )}
  >
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.06]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, hsl(var(--foreground)) 0 2px, transparent 2px 12px)",
      }}
    />
    <div className="relative">
      <TerminalLabel tone="accent">{phaseLabel} · DEFERRED</TerminalLabel>
      <h3 className="mt-3 font-display text-2xl text-foreground">{title}</h3>
      {children && (
        <div className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-2xl">
          {children}
        </div>
      )}
    </div>
  </div>
);
