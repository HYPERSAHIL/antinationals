import type { ArchiveStatus, IdentityStatus, ReviewState } from "@/data/demo/types";

/**
 * Semantic status → token mapping. UI components must go through this
 * module so status colors remain consistent and centralized.
 */

export interface StatusToken {
  label: string;
  /** tailwind class using semantic token */
  dotClass: string;
  textClass: string;
  borderClass: string;
  description: string;
}

export const IDENTITY_STATUS: Record<IdentityStatus, StatusToken> = {
  unidentified: {
    label: "Unidentified",
    dotClass: "bg-status-unidentified",
    textClass: "text-status-unidentified",
    borderClass: "border-status-unidentified/40",
    description: "No identity established. Subject appears in evidence.",
  },
  identity_proposed: {
    label: "Identity proposed",
    dotClass: "bg-status-proposed",
    textClass: "text-status-proposed",
    borderClass: "border-status-proposed/40",
    description: "An identity claim has been submitted and is awaiting supporting sources.",
  },
  corroborated: {
    label: "Corroborated",
    dotClass: "bg-status-corroborated",
    textClass: "text-status-corroborated",
    borderClass: "border-status-corroborated/40",
    description: "Identity claim supported by multiple independent sources.",
  },
  verified: {
    label: "Verified",
    dotClass: "bg-status-verified",
    textClass: "text-status-verified",
    borderClass: "border-status-verified/40",
    description: "Identity confirmed through review. Not a social endorsement.",
  },
  disputed: {
    label: "Disputed",
    dotClass: "bg-status-disputed",
    textClass: "text-status-disputed",
    borderClass: "border-status-disputed/40",
    description: "Conflicting evidence exists. Identity claim under contest.",
  },
  retracted: {
    label: "Retracted",
    dotClass: "bg-status-retracted",
    textClass: "text-status-retracted",
    borderClass: "border-status-retracted/40",
    description: "Prior identity association removed after review.",
  },
};

export const ARCHIVE_STATUS: Record<ArchiveStatus, StatusToken> = {
  pending: {
    label: "Archival pending",
    dotClass: "bg-status-pending",
    textClass: "text-status-pending",
    borderClass: "border-status-pending/40",
    description: "Awaiting preservation copy.",
  },
  archiving: {
    label: "Archiving",
    dotClass: "bg-status-pending",
    textClass: "text-status-pending",
    borderClass: "border-status-pending/40",
    description: "Preservation copy in progress.",
  },
  preserved: {
    label: "Preservation copy held",
    dotClass: "bg-status-verified",
    textClass: "text-status-verified",
    borderClass: "border-status-verified/40",
    description: "Private preservation copy stored.",
  },
  failed: {
    label: "Archive failed",
    dotClass: "bg-status-disputed",
    textClass: "text-status-disputed",
    borderClass: "border-status-disputed/40",
    description: "Preservation attempt failed. Retry queued.",
  },
  not_applicable: {
    label: "No archive",
    dotClass: "bg-status-unidentified",
    textClass: "text-status-unidentified",
    borderClass: "border-status-unidentified/40",
    description: "No preservation copy applicable.",
  },
};

export const REVIEW_STATE: Record<ReviewState, StatusToken> = {
  submitted: {
    label: "Submitted",
    dotClass: "bg-status-pending",
    textClass: "text-status-pending",
    borderClass: "border-status-pending/40",
    description: "Awaiting review.",
  },
  under_review: {
    label: "Under review",
    dotClass: "bg-status-proposed",
    textClass: "text-status-proposed",
    borderClass: "border-status-proposed/40",
    description: "Review in progress.",
  },
  needs_research: {
    label: "Needs research",
    dotClass: "bg-status-corroborated",
    textClass: "text-status-corroborated",
    borderClass: "border-status-corroborated/40",
    description: "Additional research required.",
  },
  duplicate: {
    label: "Duplicate",
    dotClass: "bg-status-retracted",
    textClass: "text-status-retracted",
    borderClass: "border-status-retracted/40",
    description: "Merged into an existing record.",
  },
  approved: {
    label: "Approved",
    dotClass: "bg-status-verified",
    textClass: "text-status-verified",
    borderClass: "border-status-verified/40",
    description: "Cleared for publication.",
  },
  rejected: {
    label: "Rejected",
    dotClass: "bg-status-disputed",
    textClass: "text-status-disputed",
    borderClass: "border-status-disputed/40",
    description: "Did not meet publication standards.",
  },
};
