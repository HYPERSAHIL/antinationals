import { describe, it, expect } from "vitest";
import { DEMO_STATS, DEMO_SUBJECTS, DEMO_INCIDENTS, DEMO_EVIDENCE } from "@/data/demo";

describe("demo data invariants", () => {
  it("DEMO_STATS is zeroed to avoid production-looking counters", () => {
    for (const v of Object.values(DEMO_STATS)) expect(v).toBe(0);
  });

  it("subject public IDs follow ANT-##### convention", () => {
    for (const s of DEMO_SUBJECTS) expect(s.publicId).toMatch(/^ANT-\d{5}$/);
  });

  it("incident public IDs follow INC-##### convention", () => {
    for (const i of DEMO_INCIDENTS) expect(i.publicId).toMatch(/^INC-\d{5}$/);
  });

  it("evidence public IDs follow EVD-##### convention", () => {
    for (const e of DEMO_EVIDENCE) expect(e.publicId).toMatch(/^EVD-\d{5}$/);
  });
});
