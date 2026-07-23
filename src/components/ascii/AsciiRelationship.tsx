import { cn } from "@/lib/utils";
import { AsciiScene } from "./AsciiScene";

export interface RelationshipSubject {
  publicId: string;
}
export interface RelationshipEvidence {
  publicId: string;
  subjects: RelationshipSubject[];
}
export interface RelationshipIncident {
  publicId: string;
  evidence: RelationshipEvidence[];
}

interface AsciiRelationshipProps {
  incident: RelationshipIncident;
  className?: string;
  label?: string;
}

/**
 * AsciiRelationship — reusable static ASCII tree showing
 * Incident → Evidence → Subjects. No graph library.
 * Fully accessible: renders the tree structure semantically via aria-label.
 * The visual tree is rendered inside AsciiScene (mono, overflow-safe).
 */
export const AsciiRelationship = ({
  incident,
  className,
  label,
}: AsciiRelationshipProps) => {
  const lines: string[] = [];
  lines.push(incident.publicId);
  const evList = incident.evidence;
  evList.forEach((ev, i) => {
    const isLastEv = i === evList.length - 1;
    const evBranch = isLastEv ? "└── " : "├── ";
    const evGutter = isLastEv ? "    " : "│   ";

    if (ev.subjects.length === 0) {
      lines.push(`${evBranch}${ev.publicId}`);
      return;
    }
    // First subject on same line as evidence
    const [first, ...rest] = ev.subjects;
    lines.push(`${evBranch}${ev.publicId} ── ${first.publicId}`);
    rest.forEach((s, j) => {
      const isLastSub = j === rest.length - 1;
      const subBranch = isLastSub ? "└─ " : "├─ ";
      // Align subject list under the ── column of the first line
      const pad = " ".repeat(ev.publicId.length + 4);
      lines.push(`${evGutter}${pad}${subBranch}${s.publicId}`);
    });
  });

  const ariaLines: string[] = [
    `Incident ${incident.publicId}`,
    ...evList.flatMap((ev) => [
      `Evidence ${ev.publicId}`,
      ...ev.subjects.map((s) => `Subject ${s.publicId}`),
    ]),
  ];

  return (
    <AsciiScene
      label={label ?? ariaLines.join(", ")}
      className={cn("text-foreground/90", className)}
    >
      {lines.join("\n")}
    </AsciiScene>
  );
};
