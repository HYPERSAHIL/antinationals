import { cn } from "@/lib/utils";
import { AsciiScene } from "./AsciiScene";

const DOSSIER = String.raw`
  ┌──────────────────────────────┐
  │  CASE FILE           N°      │
  ├──────────────────────────────┤
  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓  │
  │  ▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
  │                              │
  │  ▪ EVIDENCE                  │
  │  ▪ SOURCES                   │
  │  ▪ VERIFICATION              │
  └──────────────────────────────┘
`;

/** AsciiDossier — decorative file/folder graphic. */
export const AsciiDossier = ({ className }: { className?: string }) => (
  <AsciiScene className={cn("ascii-muted", className)}>{DOSSIER}</AsciiScene>
);
