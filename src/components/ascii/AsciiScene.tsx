import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type OverflowStrategy = "clip" | "scroll" | "visible";

interface AsciiSceneProps {
  children: ReactNode;
  label?: string;      // accessible label (defaults to decorative)
  compact?: string;    // alternative content for very small viewports
  className?: string;
  /**
   * How to handle content wider than the container.
   *  - "clip"    (default): decorative art — hide overflow.
   *  - "scroll": semantic diagrams — allow horizontal scroll rather than
   *              silently clipping meaningful IDs/relationships.
   *  - "visible": rare; caller manages overflow.
   */
  overflow?: OverflowStrategy;
}

const overflowClass: Record<OverflowStrategy, string> = {
  clip: "overflow-hidden",
  scroll: "overflow-x-auto overflow-y-hidden",
  visible: "overflow-visible",
};

/**
 * AsciiScene — wrapper for all ASCII art. Handles:
 *  - responsive font sizing via clamp
 *  - explicit horizontal overflow strategy (decorative vs semantic)
 *  - screen-reader semantics (decorative by default)
 *  - optional compact fallback for narrow viewports
 *
 * Decorative art must never force document-level horizontal overflow.
 * Semantic diagrams (e.g. AsciiRelationship) must never silently clip
 * meaningful IDs — pass `overflow="scroll"`.
 */
export const AsciiScene = ({
  children,
  label,
  compact,
  className,
  overflow = "clip",
}: AsciiSceneProps) => {
  const decorative = !label;
  return (
    <div
      role={decorative ? "presentation" : "img"}
      aria-label={label}
      aria-hidden={decorative || undefined}
      className={cn(
        "ascii max-w-full",
        overflowClass[overflow],
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
