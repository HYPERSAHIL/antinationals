import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface RedactionTextProps {
  children: ReactNode;
  reveal?: boolean;
  className?: string;
  ariaLabel?: string;
}

/**
 * RedactionText — visually redacts inline text using diagonal warning
 * stripes. Screen readers get the underlying text via aria-label.
 */
export const RedactionText = ({
  children,
  reveal = false,
  className,
  ariaLabel,
}: RedactionTextProps) => {
  if (reveal) {
    return <span className={className}>{children}</span>;
  }
  return (
    <span
      aria-label={ariaLabel ?? "redacted"}
      className={cn(
        "inline-block align-baseline redaction-stripes text-transparent select-none",
        "px-1",
        className,
      )}
    >
      {children}
    </span>
  );
};
