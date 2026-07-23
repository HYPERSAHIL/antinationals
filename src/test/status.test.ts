import { describe, it, expect } from "vitest";
import { IDENTITY_STATUS, ARCHIVE_STATUS, REVIEW_STATE } from "@/lib/status";

describe("status tokens", () => {
  it("provide a resolved token for every identity status", () => {
    for (const k of ["unidentified", "identity_proposed", "corroborated", "verified", "disputed", "retracted"] as const) {
      const t = IDENTITY_STATUS[k];
      expect(t.label).toBeTruthy();
      expect(t.dotClass).toMatch(/^bg-status-/);
      expect(t.textClass).toMatch(/^text-status-/);
    }
  });

  it("archive & review states expose consistent shape", () => {
    for (const t of [...Object.values(ARCHIVE_STATUS), ...Object.values(REVIEW_STATE)]) {
      expect(t.label).toBeTruthy();
      expect(t.description).toBeTruthy();
      expect(t.borderClass).toMatch(/^border-status-/);
    }
  });
});
