import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface RedactionTextProps {
  children: ReactNode;
  reveal?: boolean;
  className?: string;
  ariaLabel?: string;
}

/**
 * RedactionText — VISUAL-ONLY redaction primitive.
 *
 * ⚠️  SECURITY WARNING — NOT A PRIVACY BOUNDARY ⚠️
 *
 * The child text remains in the rendered DOM, in the network payload,
 * in view-source, and in assistive-technology output. This component
 * only overlays diagonal warning stripes on top of it.
 *
 * NEVER pass genuinely sensitive/private values to this component:
 *  - home / physical addresses
 *  - phone numbers or personal contact details
 *  - private source identities or whistleblower names
 *  - unpublished identity claims
 *  - internal editorial notes
 *  - authentication tokens, API keys, or any secret material
 *
 * Private values must not be sent to the public client at all — filter
 * them out server-side. Use this component only for editorial redaction
 * of already-public content where the underlying string is safe to ship.
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
