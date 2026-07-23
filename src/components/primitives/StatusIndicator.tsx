import { cn } from "@/lib/utils";
import { ARCHIVE_STATUS, IDENTITY_STATUS, REVIEW_STATE, type StatusToken } from "@/lib/status";
import type { ArchiveStatus, IdentityStatus, ReviewState } from "@/data/demo/types";

type StatusInput =
  | { kind: "identity"; value: IdentityStatus }
  | { kind: "archive"; value: ArchiveStatus }
  | { kind: "review"; value: ReviewState }
  | { kind: "custom"; token: StatusToken };

interface StatusIndicatorProps {
  status: StatusInput;
  variant?: "inline" | "chip" | "block";
  showDescription?: boolean;
  className?: string;
}

const resolve = (status: StatusInput): StatusToken => {
  switch (status.kind) {
    case "identity": return IDENTITY_STATUS[status.value];
    case "archive":  return ARCHIVE_STATUS[status.value];
    case "review":   return REVIEW_STATE[status.value];
    case "custom":   return status.token;
  }
};

/**
 * StatusIndicator — restrained status treatment. Dot + label + optional
 * description. Never a bright SaaS badge.
 */
export const StatusIndicator = ({
  status,
  variant = "inline",
  showDescription = false,
  className,
}: StatusIndicatorProps) => {
  const token = resolve(status);

  if (variant === "chip") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2 border px-2 py-0.5 label-mono",
          token.borderClass,
          token.textClass,
          className,
        )}
      >
        <span className={cn("h-1.5 w-1.5", token.dotClass)} aria-hidden />
        {token.label}
      </span>
    );
  }

  if (variant === "block") {
    return (
      <div className={cn("border rule-strong-bottom p-3", token.borderClass, className)}>
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2", token.dotClass)} aria-hidden />
          <span className={cn("label-mono", token.textClass)}>{token.label}</span>
        </div>
        {showDescription && (
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            {token.description}
          </p>
        )}
      </div>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className={cn("h-1.5 w-1.5", token.dotClass)} aria-hidden />
      <span className={cn("label-mono", token.textClass)}>{token.label}</span>
      {showDescription && (
        <span className="text-xs text-muted-foreground">— {token.description}</span>
      )}
    </span>
  );
};
