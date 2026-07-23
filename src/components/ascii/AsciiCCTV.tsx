import { cn } from "@/lib/utils";
import { AsciiScene } from "./AsciiScene";

const CCTV = String.raw`
    ┌─────────────────────────┐
    │  ╔══════════════════╗   │
    │  ║  ○                ║   │
    │  ║        REC ●     ║   │
    │  ║                  ║   │
    │  ║  ┌────────────┐  ║   │
    │  ║  │ .  .    .  │  ║   │
    │  ║  │   . o  .   │  ║   │
    │  ║  │ .    .  .  │  ║   │
    │  ║  └────────────┘  ║   │
    │  ╚══════════════════╝   │
    │           │             │
    │     ══════╧══════       │
    └─────────────────────────┘
`;

/**
 * AsciiCCTV — decorative CCTV camera frame with an optional slow scanning
 * line overlay. Purely CSS animation; no per-frame JS.
 */
export const AsciiCCTV = ({
  className,
  scanning = true,
}: {
  className?: string;
  scanning?: boolean;
}) => (
  <div className={cn("relative cctv-scanlines", className)}>
    <AsciiScene className="ascii-muted">{CCTV}</AsciiScene>
    {scanning && (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 h-4 top-0 bg-gradient-to-b from-transparent via-foreground/10 to-transparent animate-scan-y motion-reduce:hidden"
      />
    )}
  </div>
);
