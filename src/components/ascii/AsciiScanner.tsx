import { cn } from "@/lib/utils";

/**
 * AsciiScanner — thin scanning-line effect over an arbitrary block.
 * Wrap any child. Purely CSS animation. Reduced-motion safe.
 */
export const AsciiScanner = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("relative overflow-hidden cctv-scanlines", className)}>
    {children}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-transparent via-foreground/10 to-transparent animate-scan-y motion-reduce:hidden"
    />
  </div>
);
