import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TerminalLabelProps {
  children: ReactNode;
  tone?: "default" | "accent" | "muted";
  className?: string;
}

/**
 * TerminalLabel — bracketed monospace label. Renders as `[ LABEL ]`.
 */
export const TerminalLabel = ({ children, tone = "default", className }: TerminalLabelProps) => {
  const toneCls =
    tone === "accent" ? "text-accent"
    : tone === "muted" ? "text-muted-foreground"
    : "text-foreground";
  return (
    <span className={cn("inline-flex items-center label-mono", toneCls, className)}>
      <span aria-hidden className="opacity-60 mr-1">[</span>
      {children}
      <span aria-hidden className="opacity-60 ml-1">]</span>
    </span>
  );
};
