/**
 * Antinationals — Phase 0 demo data types.
 *
 * These types describe the CONCEPTUAL evidence-first model used to drive
 * static UI. They are intentionally decoupled from any existing Supabase
 * schema; Phase 2 will audit and reconcile.
 */

export type IdentityStatus =
  | "unidentified"
  | "identity_proposed"
  | "corroborated"
  | "verified"
  | "disputed"
  | "retracted";

export type ArchiveStatus =
  | "pending"
  | "archiving"
  | "preserved"
  | "failed"
  | "not_applicable";

export type EvidenceMedium =
  | "photograph"
  | "screenshot"
  | "document"
  | "audio"
  | "transcript";

export type SourcePlatform =
  | "instagram"
  | "x"
  | "facebook"
  | "youtube"
  | "news"
  | "self_captured"
  | "other";

export type ReviewState =
  | "submitted"
  | "under_review"
  | "needs_research"
  | "duplicate"
  | "approved"
  | "rejected";

export interface DemoSubject {
  publicId: string;              // ANT-00142
  identityStatus: IdentityStatus;
  displayLabel?: string;         // never a real name in demo data
  firstDocumentedISO: string;
  lastDocumentedISO: string;
  incidentCount: number;
  evidenceCount: number;
  notes?: string;
}

export interface DemoSource {
  platform: SourcePlatform;
  label: string;                 // human platform label
  originalUrl?: string;
  publishedAtISO?: string;
  archivedAtISO?: string;
}

export interface DemoEvidence {
  publicId: string;              // EVD-00192
  medium: EvidenceMedium;
  caption: string;
  capturedAtISO?: string;
  submittedAtISO: string;
  source: DemoSource;
  archiveStatus: ArchiveStatus;
  sha256: string;                // demo hash string
  incidentPublicId?: string;
  subjectPublicIds: string[];
}

export interface DemoIncident {
  publicId: string;              // INC-00031
  slug: string;
  title: string;
  occurredOnISO: string;
  approximateLocation: string;
  summary: string;
  evidenceCount: number;
  subjectCount: number;
  sourceCount: number;
  reviewState: ReviewState;
}

export interface DemoStats {
  subjects: number;
  evidence: number;
  incidents: number;
  sources: number;
  archived: number;
}

export interface DemoCorrection {
  id: string;
  targetPublicId: string;        // INC-... / EVD-... / ANT-...
  submittedAtISO: string;
  state: "received" | "reviewing" | "accepted" | "partially_accepted" | "rejected";
  summary: string;
}
