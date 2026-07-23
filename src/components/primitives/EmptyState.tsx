import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export const EmptyState = ({ title, description, action, icon, className }: EmptyStateProps) => (
  <div className={cn("border border-rule bg-surface-1 p-8 md:p-12 text-center", className)}>
    {icon && <div className="mx-auto mb-4 text-muted-foreground">{icon}</div>}
    <p className="font-display text-xl text-foreground">{title}</p>
    {description && (
      <p className="mt-2 mx-auto max-w-md text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    )}
    {action && <div className="mt-5 flex justify-center">{action}</div>}
  </div>
);
