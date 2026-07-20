import { ReactNode } from "react";

export const EmptyState = ({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) => (
  <div className="rule-top rule-bottom py-20 text-center">
    {icon && <div className="mx-auto mb-4 text-muted-foreground">{icon}</div>}
    <p className="font-serif text-xl text-foreground">{title}</p>
    {description && <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);
