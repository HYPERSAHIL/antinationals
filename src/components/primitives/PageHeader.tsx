import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  publicId?: string;
  title: string;
  description?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/**
 * Editorial page header. Two-column at desktop: title/description on left,
 * meta/actions on right. Monospace eyebrow + optional public ID.
 */
export const PageHeader = ({
  eyebrow,
  publicId,
  title,
  description,
  meta,
  actions,
  className,
}: PageHeaderProps) => {
  return (
    <header className={cn("rule-bottom", className)}>
      <div className="container-editorial py-10 md:py-14 grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div className="min-w-0">
          {(eyebrow || publicId) && (
            <div className="mb-4 flex items-center gap-3 text-muted-foreground">
              {publicId && (
                <span className="label-mono border border-rule px-1.5 py-0.5 text-foreground">
                  {publicId}
                </span>
              )}
              {eyebrow && <span className="kicker">{eyebrow}</span>}
            </div>
          )}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {(meta || actions) && (
          <div className="flex flex-col gap-3 md:items-end md:text-right">
            {meta}
            {actions}
          </div>
        )}
      </div>
    </header>
  );
};
