import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  as?: "h2" | "h3";
}

export const SectionHeader = ({
  eyebrow,
  title,
  description,
  actions,
  className,
  as = "h2",
}: SectionHeaderProps) => {
  const Heading = as;
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow && <p className="kicker mb-2">{eyebrow}</p>}
        <Heading className="font-display text-2xl sm:text-3xl leading-tight tracking-tight text-foreground">
          {title}
        </Heading>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};
