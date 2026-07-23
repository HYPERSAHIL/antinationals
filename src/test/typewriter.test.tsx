import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Typewriter } from "@/components/ascii/Typewriter";

describe("Typewriter accessibility", () => {
  it("exposes the full final text to assistive tech immediately", () => {
    render(<Typewriter text="INDEXING PUBLIC RECORD" />);
    // sr-only span always carries the full final text.
    expect(screen.getByText("INDEXING PUBLIC RECORD")).toBeInTheDocument();
  });
});
