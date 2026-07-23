import { SEO } from "@/components/site/SEO";
import { PageHeader } from "@/components/primitives/PageHeader";
import { PlaceholderPanel } from "@/components/primitives/PlaceholderPanel";
import { TerminalLabel } from "@/components/primitives/TerminalLabel";
import type { ReactNode } from "react";

interface PlaceholderPageProps {
  seoTitle: string;
  seoDescription: string;
  path: string;
  eyebrow: string;
  title: string;
  description?: ReactNode;
  panelTitle: string;
  panelBody: ReactNode;
  phaseLabel?: string;
}

/**
 * PlaceholderPage — shared shell for every public route whose full layout
 * is deferred to Phase 0B. Uses the established design system and makes
 * the deferral explicit rather than pretending to be complete.
 */
export const PlaceholderPage = ({
  seoTitle,
  seoDescription,
  path,
  eyebrow,
  title,
  description,
  panelTitle,
  panelBody,
  phaseLabel = "PHASE 0B",
}: PlaceholderPageProps) => (
  <>
    <SEO title={seoTitle} description={seoDescription} path={path} />
    <PageHeader
      eyebrow={eyebrow}
      title={title}
      description={description}
      meta={<TerminalLabel tone="muted">{phaseLabel} · SCHEDULED</TerminalLabel>}
    />
    <section className="container-editorial py-12">
      <PlaceholderPanel phaseLabel={phaseLabel} title={panelTitle}>
        {panelBody}
      </PlaceholderPanel>
    </section>
  </>
);
