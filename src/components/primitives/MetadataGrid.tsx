import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface MetadataEntry {
  label: string;
  value: ReactNode;
  mono?: boolean;
}

interface MetadataGridProps {
  entries: MetadataEntry[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

/**
 * MetadataGrid — dossier-style key/value listing. Uppercase mono labels,
 * primary values below. Deliberately dense.
 */
export const MetadataGrid = ({ entries, columns = 3, className }: MetadataGridProps) => {
  const colCls =
    columns === 1 ? "grid-cols-1"
    : columns === 2 ? "grid-cols-1 sm:grid-cols-2"
    : columns === 3 ? "grid-cols-2 md:grid-cols-3"
    : "grid-cols-2 md:grid-cols-4";
  return (
    <dl className={cn("grid gap-px bg-rule border border-rule", colCls, className)}>
      {entries.map((e, i) => (
        <div key={i} className="bg-background p-4">
          <dt className="label-mono text-muted-foreground">{e.label}</dt>
          <dd className={cn("mt-1.5 text-sm text-foreground break-words", e.mono && "font-mono")}>
            {e.value ?? <span className="text-muted-foreground">—</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
};
