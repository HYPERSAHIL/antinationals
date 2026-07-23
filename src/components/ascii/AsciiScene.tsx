import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AsciiSceneProps {
  children: ReactNode;
  label?: string;      // accessible label (defaults to decorative)
  compact?: string;    // alternative content for very small viewports
  className?: string;
}

/**
 * AsciiScene — wrapper for all ASCII art. Handles:
 *  - responsive font sizing via clamp
 *  - horizontal overflow prevention (never forces page scroll)
 *  - screen-reader semantics (decorative by default)
 *  - optional compact fallback for narrow viewports
 */
export const AsciiScene = ({ children, label, compact, className }: AsciiSceneProps) => {
  const decorative = !label;
  return (
    <div
      role={decorative ? "presentation" : "img"}
      aria-label={label}
      aria-hidden={decorative || undefined}
      className={cn(
        "ascii overflow-hidden max-w-full",
        "text-[clamp(0.55rem,1.1vw,0.78rem)] leading-[1.05]",
        className,
      )}
    >
      {compact ? (
        <>
          <span className="hidden sm:inline">{children}</span>
          <span className="sm:hidden">{compact}</span>
        </>
      ) : (
        children
      )}
    </div>
  );
};
