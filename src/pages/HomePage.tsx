import { Link } from "react-router-dom";
import { SEO } from "@/components/site/SEO";
import { AsciiWordmark } from "@/components/ascii/AsciiWordmark";
import { AsciiCrowd } from "@/components/ascii/AsciiCrowd";
import { AsciiRelationship } from "@/components/ascii/AsciiRelationship";
import { TerminalCursor } from "@/components/ascii/TerminalCursor";
import { TimestampStrip } from "@/components/ascii/TimestampStrip";
import { Typewriter } from "@/components/ascii/Typewriter";
import { TerminalLabel } from "@/components/primitives/TerminalLabel";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { RecordResolve } from "@/components/primitives/RecordResolve";
import { Search, ArrowRight } from "lucide-react";

/**
 * HomePage — Phase 1 refined composition.
 *
 * Motion hierarchy (single primary):
 *  - PRIMARY: hero Typewriter + terminal cursor
 *  - AMBIENT: AsciiCrowd (below the fold, pauses off-screen)
 *  - The AsciiWordmark is intentionally STATIC — it functions as the
 *    hero display type, so there is no competing wordmark animation,
 *    scanning line, or CCTV motion on this page.
 *
 * ASCII density:
 *  - Level A (dominant): AsciiWordmark
 *  - Level B (ambient):  AsciiCrowd, AsciiRelationship prototype
 *  - Level C (functional): PublicId, TimestampStrip, TerminalLabel
 *
 * Counters intentionally do NOT display numbers. Real numbers ship only
 * when a live backend is reconnected (Phase 0B+).
 */
const HomePage = () => {
  return (
    <>
      <SEO
        title="Antinationals — Public Evidence Archive"
        description="Public evidence archive: incidents, evidence, subjects, sources and verification history."
        path="/"
      />

      {/* HERO — one dominant motion, ASCII wordmark as display type */}
      <section className="rule-bottom">
        <div className="container-editorial pt-8 md:pt-12 pb-14">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <TerminalLabel tone="accent">PHASE 0 · FOUNDATION</TerminalLabel>
            <TimestampStrip context="ARCHIVE / PUBLIC INDEX" showClock />
          </div>

          <div className="mt-8 md:mt-10">
            <AsciiWordmark />
          </div>

          <p className="mt-6 label-mono text-muted-foreground">
            PUBLIC EVIDENCE ARCHIVE
          </p>

          <div className="mt-4 flex items-center gap-2 font-mono text-sm text-foreground">
            <span className="text-accent" aria-hidden>&gt;</span>
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
              to="/methodology"
              className="inline-flex items-center gap-2 border border-foreground bg-foreground px-4 py-2 label-mono text-background hover:bg-transparent hover:text-foreground transition-colors"
            >
              Read the methodology <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 border border-rule px-4 py-2 label-mono text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              About this archive
            </Link>
          </div>
        </div>
      </section>

      {/* COUNTERS — explicit non-production state, no fictional numbers */}
      <section className="rule-bottom">
        <div className="container-editorial py-6 grid grid-cols-2 md:grid-cols-4 gap-px bg-rule border-x border-rule">
          {["SUBJECTS", "EVIDENCE", "INCIDENTS", "ARCHIVED SOURCES"].map((k) => (
            <div key={k} className="bg-background p-5">
              <p className="label-mono text-muted-foreground">{k}</p>
              <p
                className="mt-2 font-mono text-2xl md:text-3xl text-muted-foreground/70"
                aria-label={`${k}: index initializing`}
              >
                [ ——— ]
              </p>
            </div>
          ))}
        </div>
        <p className="container-editorial py-3 label-mono text-muted-foreground">
          ARCHIVE INDEX INITIALIZING · LIVE COUNTERS PENDING BACKEND RECONNECT
        </p>
      </section>

      {/* MACHINE / HUMAN LAYERS — editorial two-column, no card grid */}
      <section className="container-editorial py-14 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <article>
          <SectionHeader
            eyebrow="EDITORIAL STANDARDS"
            title="Evidence first. Identity separate. Corrections public."
            description="Every record begins with source material — photographs, screenshots, documents — bound to its origin, capture date and preservation hash. Subjects appear in evidence; identity claims are tracked separately and remain open to challenge."
          />

          <dl className="mt-8 rule-top divide-y divide-rule">
            {[
              {
                t: "Evidence, first.",
                d: "Every record begins with source material — bound to its origin URL, capture date and preservation hash.",
                to: "/methodology",
                cta: "Methodology",
              },
              {
                t: "Identity is not evidence.",
                d: "Subjects appear in evidence. Identity claims are tracked separately as unidentified, proposed, corroborated, verified, disputed or retracted.",
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
              <div key={i} className="py-6 grid gap-4 md:grid-cols-[8rem_1fr_auto] md:items-baseline">
                <TerminalLabel tone="muted">0{i + 1} · STANDARD</TerminalLabel>
                <div>
                  <h3 className="font-display text-xl text-foreground">{s.t}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-prose">
                    {s.d}
                  </p>
                </div>
                <Link
                  to={s.to}
                  className="inline-flex items-center gap-2 label-mono text-muted-foreground hover:text-foreground whitespace-nowrap"
                >
                  {s.cta} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </dl>
        </article>

        {/* Machine layer sidebar — mono, monochrome, dossier feel */}
        <aside className="border border-rule bg-surface-1 p-6 newsprint-rules">
          <p className="kicker mb-3">MACHINE LAYER · RECORD SHAPE</p>
          <h3 className="font-display text-xl text-foreground">
            How a record is structured.
          </h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            An incident links to evidence. Evidence links to subjects. Every
            edge is a public, correctable claim.
          </p>

          <div className="mt-5 border border-rule bg-background p-4 overflow-x-auto">
            <AsciiRelationship
              incident={{
                publicId: "INC-00031",
                evidence: [
                  {
                    publicId: "EVD-00192",
                    subjects: [{ publicId: "ANT-00142" }, { publicId: "ANT-00191" }],
                  },
                  {
                    publicId: "EVD-00217",
                    subjects: [{ publicId: "ANT-00222" }],
                  },
                ],
              }}
            />
          </div>

          <div className="mt-5">
            <p className="kicker mb-2">RECORD RESOLVE</p>
            <RecordResolve
              text="RECORD 00192"
              className="text-foreground text-lg"
            />
          </div>
        </aside>
      </section>

      {/* AMBIENT — one subtle motif per section rule */}
      <section className="rule-top">
        <div className="container-editorial py-10 grid gap-4 md:grid-cols-[1fr_auto] items-end">
          <div>
            <p className="kicker">AMBIENT / PUBLIC RECORD</p>
            <p className="mt-2 font-display text-xl text-foreground max-w-xl">
              The archive concerns publicly observable events. It never
              speculates on identity.
            </p>
          </div>
          <AsciiCrowd className="opacity-60" />
        </div>
      </section>
    </>
  );
};

export default HomePage;
