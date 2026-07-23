import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { SEO } from "@/components/site/SEO";

const renderSEO = (props: Parameters<typeof SEO>[0]) => {
  const helmetContext: { helmet?: import("react-helmet-async").HelmetServerState } = {};
  render(
    <HelmetProvider context={helmetContext}>
      <SEO {...props} />
    </HelmetProvider>,
  );
  return helmetContext.helmet!;
};

describe("SEO canonical + robots", () => {
  it("omits <link rel=canonical> when no VITE_CANONICAL_ORIGIN is set", () => {
    // vitest runs without VITE_CANONICAL_ORIGIN by default.
    const h = renderSEO({ title: "Home", description: "d", path: "/" });
    expect(h.link.toString()).not.toContain("canonical");
  });

  it("emits noindex when an explicit noindex prop is passed", () => {
    const h = renderSEO({ title: "404", noindex: true });
    expect(h.meta.toString()).toContain('name="robots"');
    expect(h.meta.toString()).toContain("noindex");
  });

  it("defaults to noindex when VITE_ALLOW_INDEXING is not true", () => {
    const h = renderSEO({ title: "Any", description: "d" });
    expect(h.meta.toString()).toContain("noindex");
  });
});
