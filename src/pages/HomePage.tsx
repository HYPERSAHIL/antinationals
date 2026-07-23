import { Link } from "react-router-dom";
import { SEO } from "@/components/site/SEO";
import { AsciiWordmark } from "@/components/ascii/AsciiWordmark";
import { AsciiCCTV } from "@/components/ascii/AsciiCCTV";
import { AsciiCrowd } from "@/components/ascii/AsciiCrowd";
import { AsciiDossier } from "@/components/ascii/AsciiDossier";
import { TerminalCursor } from "@/components/ascii/TerminalCursor";
import { TimestampStrip } from "@/components/ascii/TimestampStrip";
import { Typewriter } from "@/components/ascii/Typewriter";
import { TerminalLabel } from "@/components/primitives/TerminalLabel";
import { PublicId } from "@/components/primitives/PublicId";
import { StatusIndicator } from "@/components/primitives/StatusIndicator";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { PlaceholderPanel } from "@/components/primitives/PlaceholderPanel";
import { DEMO_STATS, DEMO_INCIDENTS, DEMO_SUBJECTS } from "@/data/demo";
import { Search, ArrowRight } from "lucide-react";

const HomePage = () => {
  return (
    <>
      <SEO
        title="Antinationals — Public Evidence Archive"
        description="Public evidence archive: incidents, evidence, subjects, sources and verification history."
        path="/"
      />

      {/* HERO */}
      <section className="rule-bottom">
        <div className="container-editorial pt-8 md:pt-12 pb-14">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <TerminalLabel tone="accent">PHASE 0 · FOUNDATION</TerminalLabel>
            <TimestampStrip />
          </div>

          <div className="mt-8 md:mt-10">
            <AsciiWordmark />
          </div>

          <p className="mt-6 label-mono text-muted-foreground">
            PUBLIC EVIDENCE ARCHIVE
          </p>

          <div className="mt-4 flex items-center gap-2 font-mono text-sm text-foreground">
            <span className="text-accent">&gt;</span>
            <Typewriter text="INDEXING PUBLIC RECORD" />
            <TerminalCursor />
          </div>

          <p className="mt-8 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            A public-interest archive of incidents, evidence and subjects. Every
            record is bound to its source, its provenance and its verification
            history. Identity claims are separated from evidence and remain open
            to correction.
          </p>

          {/* Search — visual only in Phase 0 */}
          <form
            className="mt-8 flex items-stretch max-w-2xl border border-rule bg-surface-1"
            onSubmit={(e) => e.preventDefault()}
            role="search"
            aria-label="Archive search"
          >
            <div className="flex items-center pl-3 text-muted-foreground">
              <Search className="h-4 w-4" aria-hidden />
            </div>
            <input
              className="flex-1 bg-transparent px-3 py-3 text-sm placeholder:text-muted-foreground focus:outline-none"
              placeholder="Search archive — name / public ID / location / incident / organization"
              aria-label="Search archive"
            />
            <button
              type="submit"
              disabled
              className="label-mono px-4 border-l border-rule text-muted-foreground cursor-not-allowed"
              title="Search will be enabled in a later phase"
            >
              SEARCH
            </button>
          </form>
          <p className="mt-2 label-mono text-muted-foreground">
            SEARCH BACKEND — DEFERRED · UI ONLY
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              to="/archive"
              className="inline-flex items-center gap-2 border border-foreground bg-foreground px-4 py-2 label-mono text-background hover:bg-transparent hover:text-foreground transition-colors"
            >
              Enter the archive <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/methodology"
              className="inline-flex items-center gap-2 border border-rule px-4 py-2 label-mono text-foreground hover:border-foreground transition-colors"
            >
              Methodology
            </Link>
          </div>
        </div>
      </section>

      {/* COUNTERS */}
      <section className="rule-bottom">
        <div className="container-editorial py-6 grid grid-cols-2 md:grid-cols-5 gap-px bg-rule border-x border-rule">
          {[
            { k: "SUBJECTS",  v: DEMO_STATS.subjects },
            { k: "EVIDENCE",  v: DEMO_STATS.evidence },
            { k: "INCIDENTS", v: DEMO_STATS.incidents },
            { k: "SOURCES",   v: DEMO_STATS.sources },
            { k: "ARCHIVED",  v: DEMO_STATS.archived },
          ].map((c) => (
            <div key={c.k} className="bg-background p-5">
              <p className="label-mono text-muted-foreground">{c.k}</p>
              <p className="mt-2 font-display text-3xl md:text-4xl tabular text-foreground">
                {c.v.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <p className="container-editorial py-3 label-mono text-muted-foreground">
          DEMO COUNTERS · PHASE 0 · NOT LIVE DATA
        </p>
      </section>

      {/* LATEST INCIDENT + RECENT EVIDENCE */}
      <section className="container-editorial py-14 grid gap-12 lg:grid-cols-3">
        <article className="lg:col-span-2">
          <SectionHeader
            eyebrow="LATEST DOCUMENTED INCIDENT"
            title={DEMO_INCIDENTS[0].title}
            description={DEMO_INCIDENTS[0].summary}
          />
          <div className="mt-6 grid gap-6 md:grid-cols-[auto_1fr] items-start">
            <div className="border border-rule bg-surface-1 p-4">
              <AsciiCCTV />
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 items-center">
                <PublicId value={DEMO_INCIDENTS[0].publicId} />
                <StatusIndicator status={{ kind: "review", value: DEMO_INCIDENTS[0].reviewState }} variant="chip" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {DEMO_INCIDENTS[0].evidenceCount} evidence items · {DEMO_INCIDENTS[0].subjectCount} subjects ·{" "}
                {DEMO_INCIDENTS[0].sourceCount} independent sources
              </p>
              <Link
                to={`/incidents/${DEMO_INCIDENTS[0].slug}`}
                className="inline-flex items-center gap-2 label-mono text-foreground hover:text-accent"
              >
                Open incident record <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </article>

        <aside>
          <SectionHeader eyebrow="RECENT SUBJECTS" title="Subject index preview" as="h3" />
          <ul className="mt-5 border-t border-b border-rule divide-y divide-rule">
            {DEMO_SUBJECTS.slice(0, 5).map((s) => (
              <li key={s.publicId} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <PublicId value={s.publicId} size="sm" />
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {s.incidentCount} incidents · {s.evidenceCount} evidence
                  </p>
                </div>
                <StatusIndicator status={{ kind: "identity", value: s.identityStatus }} />
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {/* METHODOLOGY / CORRECTIONS / SUBMIT strip */}
      <section className="rule-top bg-surface-1/40">
        <div className="container-editorial py-14 grid gap-8 md:grid-cols-3">
          {[
            {
              t: "Evidence, first.",
              d: "Every record begins with source material — photographs, screenshots, documents — bound to its origin URL, capture date and preservation hash.",
              to: "/methodology",
              cta: "Methodology",
            },
            {
              t: "Identity is not evidence.",
              d: "Subjects appear in evidence. Identity claims are tracked separately and can be unidentified, proposed, corroborated, verified, disputed or retracted.",
              to: "/about",
              cta: "About the model",
            },
            {
              t: "Records can be corrected.",
              d: "Corrections are first-class. Errors are received, reviewed and openly logged. Retractions remain visible in the record.",
              to: "/corrections",
              cta: "Report a correction",
            },
          ].map((s, i) => (
            <div key={i} className="border border-rule bg-background p-6">
              <TerminalLabel tone="muted">0{i + 1} · STANDARD</TerminalLabel>
              <h3 className="mt-3 font-display text-2xl text-foreground">{s.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
              <Link
                to={s.to}
                className="mt-4 inline-flex items-center gap-2 label-mono text-foreground hover:text-accent"
              >
                {s.cta} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Route-specific detail templates are deferred to Phase 0B */}
      <section className="container-editorial py-14 grid gap-6 md:grid-cols-2">
        <PlaceholderPanel title="Incident timeline preview">
          Phase 0B will introduce the timeline view, evidence card grid and
          subject cross-references built on the primitives established here.
        </PlaceholderPanel>
        <PlaceholderPanel title="Archive / provenance status">
          A provenance status board summarising preservation state, source
          diversity and correction throughput will be added in Phase 0B.
        </PlaceholderPanel>
      </section>

      {/* Ambient decoration */}
      <section className="container-editorial pb-16 grid gap-6 md:grid-cols-[1fr_auto] items-end">
        <AsciiCrowd className="opacity-70" />
        <AsciiDossier className="opacity-70" />
      </section>
    </>
  );
};

export default HomePage;
