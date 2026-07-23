import { Link } from "react-router-dom";
import { TimestampStrip } from "@/components/ascii/TimestampStrip";

const COLS: { title: string; links: { to: string; label: string }[] }[] = [
  {
    title: "Archive",
    links: [
      { to: "/archive",    label: "Full archive" },
      { to: "/incidents",  label: "Incidents" },
      { to: "/subjects",   label: "Subjects" },
      { to: "/submit",     label: "Submit evidence" },
    ],
  },
  {
    title: "Standards",
    links: [
      { to: "/methodology", label: "Methodology" },
      { to: "/corrections", label: "Corrections" },
      { to: "/about",       label: "About" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy", label: "Privacy" },
      { to: "/legal",   label: "Legal notice" },
    ],
  },
];

export const SiteFooter = () => (
  <footer className="rule-top mt-16">
    <div className="container-editorial py-12 grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
      <div>
        <p className="font-display text-2xl text-foreground">ANTINATIONALS</p>
        <p className="mt-2 label-mono text-muted-foreground">PUBLIC EVIDENCE ARCHIVE</p>
        <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
          Antinationals documents publicly observable incidents, evidence and
          subjects through verifiable sources, provenance and open verification
          history. Records are subject to correction.
        </p>
        <div className="mt-5">
          {/* Static contextual strip — no live clock in the footer. */}
          <TimestampStrip context="ARCHIVE / FOUNDATION" showClock={false} />
        </div>
      </div>
      {COLS.map((c) => (
        <div key={c.title}>
          <p className="kicker mb-3">{c.title}</p>
          <ul className="space-y-2">
            {c.links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-foreground/85 hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="rule-top">
      <div className="container-editorial py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <p className="label-mono text-muted-foreground">
          © {new Date().getFullYear()} ANTINATIONALS · PHASE 0 FOUNDATION
        </p>
        <p className="label-mono text-muted-foreground">
          NON-COMMERCIAL · PUBLIC INTEREST · SUBJECT TO CORRECTION
        </p>
      </div>
    </div>
  </footer>
);
