import { cn } from "@/lib/utils";

interface PublicIdProps {
  value: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  ariaLabel?: string;
}

/**
 * PublicId — canonical presentation for ANT- / INC- / EVD- identifiers.
 * Monospace, uppercase, bordered chip. Never renders a real person's name.
 */
export const PublicId = ({ value, size = "md", className, ariaLabel }: PublicIdProps) => {
  const sizeCls =
    size === "sm"
      ? "text-[10px] px-1.5 py-0.5"
      : size === "lg"
      ? "text-sm px-2.5 py-1"
      : "text-xs px-2 py-0.5";
  return (
    <span
      aria-label={ariaLabel ?? `Public identifier ${value}`}
      className={cn(
        "inline-flex items-center gap-1 font-mono uppercase tracking-[0.15em]",
        "border border-rule text-foreground bg-surface-1",
        sizeCls,
        className,
      )}
    >
      {value}
    </span>
  );
};
