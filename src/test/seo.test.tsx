import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { SEO } from "@/components/site/SEO";

afterEach(() => {
  cleanup();
  document.head.querySelectorAll("meta[data-react-helmet], link[data-react-helmet]").forEach((n) => n.remove());
});

const mount = (props: Parameters<typeof SEO>[0]) =>
  render(
    <HelmetProvider>
      <SEO {...props} />
    </HelmetProvider>,
  );

const headHtml = () => document.head.innerHTML;

describe("SEO canonical + robots", () => {
  it("omits <link rel=canonical> when no VITE_CANONICAL_ORIGIN is set", async () => {
    mount({ title: "Home", description: "d", path: "/" });
    await waitFor(() => expect(document.title).toContain("Antinationals"));
    expect(headHtml()).not.toMatch(/rel="canonical"/);
  });

  it("emits noindex when an explicit noindex prop is passed", async () => {
    mount({ title: "404", noindex: true });
    await waitFor(() => expect(headHtml()).toMatch(/name="robots"/));
    expect(headHtml()).toMatch(/content="noindex, nofollow"/);
  });

  it("defaults to noindex when VITE_ALLOW_INDEXING is not true", async () => {
    mount({ title: "Any", description: "d" });
    await waitFor(() => expect(headHtml()).toMatch(/name="robots"/));
    expect(headHtml()).toMatch(/noindex/);
  });
});
