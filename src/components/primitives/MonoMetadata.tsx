import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MonoMetadataProps {
  label: string;
  value: ReactNode;
  className?: string;
}

/**
 * Inline monospace label/value pair. Used for timestamps, IDs, hashes.
 */
export const MonoMetadata = ({ label, value, className }: MonoMetadataProps) => (
  <div className={cn("flex items-baseline gap-2 min-w-0", className)}>
    <span className="label-mono text-muted-foreground shrink-0">{label}</span>
    <span className="font-mono text-xs text-foreground truncate">{value}</span>
  </div>
);
