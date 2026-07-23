/**
 * Antinationals — Phase 0 centralized demo data.
 *
 * All placeholder values used by the static UI live here so they can be
 * swapped for real data sources in a later phase without touching page
 * markup. Do NOT scatter hardcoded records across components.
 *
 * Rules:
 *  - Fictional / neutral placeholders only.
 *  - Never use a real person's name in an accusatory demo record.
 *  - IDs follow ANT-##### / INC-##### / EVD-##### conventions.
 */

import type {
  DemoCorrection,
  DemoEvidence,
  DemoIncident,
  DemoStats,
  DemoSubject,
} from "./types";

/**
 * DEMO_STATS — explicitly zeroed. Phase 1B removed realistic-looking
 * counters (e.g. 142 subjects / 3821 evidence) so they can never
 * accidentally render as live archive statistics. Real numbers only
 * ship once a backend is reconnected in Phase 0B+.
 */
export const DEMO_STATS: DemoStats = {
  subjects: 0,
  evidence: 0,
  incidents: 0,
  sources: 0,
  archived: 0,
};

export const DEMO_SUBJECTS: DemoSubject[] = [
  {
    publicId: "ANT-00142",
    identityStatus: "unidentified",
    firstDocumentedISO: "2026-03-12",
    lastDocumentedISO: "2026-04-08",
    incidentCount: 3,
    evidenceCount: 11,
    notes: "Recurring subject across three documented incidents. Identity not established.",
  },
  {
    publicId: "ANT-00291",
    identityStatus: "identity_proposed",
    displayLabel: "Subject 00291",
    firstDocumentedISO: "2026-02-04",
    lastDocumentedISO: "2026-03-30",
    incidentCount: 2,
    evidenceCount: 7,
    notes: "Identity claim submitted. Awaiting corroborating sources.",
  },
  {
    publicId: "ANT-00013",
    identityStatus: "corroborated",
    displayLabel: "Subject 00013",
    firstDocumentedISO: "2025-11-19",
    lastDocumentedISO: "2026-04-01",
    incidentCount: 5,
    evidenceCount: 22,
  },
  {
    publicId: "ANT-00092",
    identityStatus: "verified",
    displayLabel: "Subject 00092",
    firstDocumentedISO: "2025-09-02",
    lastDocumentedISO: "2026-03-11",
    incidentCount: 4,
    evidenceCount: 16,
  },
  {
    publicId: "ANT-00058",
    identityStatus: "disputed",
    displayLabel: "Subject 00058",
    firstDocumentedISO: "2026-01-22",
    lastDocumentedISO: "2026-02-14",
    incidentCount: 1,
    evidenceCount: 4,
    notes: "Prior identity claim retracted after conflicting evidence.",
  },
  {
    publicId: "ANT-00077",
    identityStatus: "retracted",
    displayLabel: "Subject 00077",
    firstDocumentedISO: "2025-12-10",
    lastDocumentedISO: "2026-01-06",
    incidentCount: 1,
    evidenceCount: 3,
    notes: "Identity association removed 17 Jul 2026 after correction accepted.",
  },
];

export const DEMO_INCIDENTS: DemoIncident[] = [
  {
    publicId: "INC-00047",
    slug: "inc-00047",
    title: "Public disturbance, district transit corridor",
    occurredOnISO: "2026-04-08",
    approximateLocation: "District 4, transit corridor",
    summary:
      "Multiple public recordings depict a coordinated disturbance along a transit corridor. Documented from four independent public sources.",
    evidenceCount: 12,
    subjectCount: 5,
    sourceCount: 4,
    reviewState: "approved",
  },
  {
    publicId: "INC-00031",
    slug: "inc-00031",
    title: "Marketplace incident, west quarter",
    occurredOnISO: "2026-03-12",
    approximateLocation: "West quarter, open marketplace",
    summary:
      "Recorded incident at a public marketplace. Provenance established for six of nine submitted items.",
    evidenceCount: 9,
    subjectCount: 3,
    sourceCount: 3,
    reviewState: "approved",
  },
  {
    publicId: "INC-00022",
    slug: "inc-00022",
    title: "Roadway obstruction, arterial route",
    occurredOnISO: "2026-02-04",
    approximateLocation: "Arterial route, north bypass",
    summary:
      "Static and moving imagery from three sources. Two identity claims currently under review.",
    evidenceCount: 7,
    subjectCount: 2,
    sourceCount: 3,
    reviewState: "under_review",
  },
  {
    publicId: "INC-00014",
    slug: "inc-00014",
    title: "Assembly, civic square",
    occurredOnISO: "2025-11-19",
    approximateLocation: "Civic square",
    summary: "Broad-scope assembly documented across social platforms and one press outlet.",
    evidenceCount: 22,
    subjectCount: 8,
    sourceCount: 7,
    reviewState: "approved",
  },
];

export const DEMO_EVIDENCE: DemoEvidence[] = [
  {
    publicId: "EVD-00192",
    medium: "photograph",
    caption: "Wide-angle capture, primary vantage.",
    capturedAtISO: "2026-04-08T14:12:00Z",
    submittedAtISO: "2026-04-09T09:41:00Z",
    source: {
      platform: "instagram",
      label: "Instagram",
      originalUrl: "https://example.invalid/p/demo-192",
      publishedAtISO: "2026-04-08T18:04:00Z",
      archivedAtISO: "2026-04-09T10:02:00Z",
    },
    archiveStatus: "preserved",
    sha256: "9f2b5c4e8a1d7c30b6f0e12a44c9d0e1f8b7a6c5d4e3f2a1b0c9d8e7f6a5b4c3",
    incidentPublicId: "INC-00047",
    subjectPublicIds: ["ANT-00013", "ANT-00092", "ANT-00142"],
  },
  {
    publicId: "EVD-00217",
    medium: "screenshot",
    caption: "Screenshot of public post, permalink preserved.",
    capturedAtISO: "2026-04-08T15:04:00Z",
    submittedAtISO: "2026-04-10T07:12:00Z",
    source: {
      platform: "x",
      label: "X",
      originalUrl: "https://example.invalid/status/demo-217",
      publishedAtISO: "2026-04-08T16:20:00Z",
      archivedAtISO: "2026-04-10T07:15:00Z",
    },
    archiveStatus: "preserved",
    sha256: "b1c2d3e4f5061728394a5b6c7d8e9f001a2b3c4d5e6f708192a3b4c5d6e7f809",
    incidentPublicId: "INC-00047",
    subjectPublicIds: ["ANT-00092"],
  },
  {
    publicId: "EVD-00301",
    medium: "photograph",
    caption: "Secondary vantage, submitted by public witness.",
    submittedAtISO: "2026-03-13T11:00:00Z",
    source: {
      platform: "self_captured",
      label: "Self-captured",
    },
    archiveStatus: "pending",
    sha256: "c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f403a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8",
    incidentPublicId: "INC-00031",
    subjectPublicIds: ["ANT-00142"],
  },
];

export const DEMO_CORRECTIONS: DemoCorrection[] = [
  {
    id: "COR-00021",
    targetPublicId: "ANT-00077",
    submittedAtISO: "2026-07-17T09:00:00Z",
    state: "accepted",
    summary: "Identity association removed after conflicting evidence.",
  },
  {
    id: "COR-00034",
    targetPublicId: "INC-00022",
    submittedAtISO: "2026-07-20T15:30:00Z",
    state: "reviewing",
    summary: "Approximate location contested. Awaiting source verification.",
  },
  {
    id: "COR-00041",
    targetPublicId: "EVD-00217",
    submittedAtISO: "2026-07-22T12:11:00Z",
    state: "received",
    summary: "Alternate original source URL proposed.",
  },
];

export * from "./types";
