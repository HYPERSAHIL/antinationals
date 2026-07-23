import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Phase 0A/1B: every currently-implemented public route is a placeholder
 * (see _PlaceholderPage). Until Phase 0B ships route implementations,
 * every nav entry is truthfully marked `indexing` so the preview never
 * reads as production-ready.
 */
const NAV: { to: string; label: string; indexing?: boolean }[] = [
  { to: "/archive",     label: "Archive",     indexing: true },
  { to: "/incidents",   label: "Incidents",   indexing: true },
  { to: "/subjects",    label: "Subjects",    indexing: true },
  { to: "/submit",      label: "Submit",      indexing: true },
  { to: "/methodology", label: "Methodology", indexing: true },
  { to: "/about",       label: "About",       indexing: true },
];

/**
 * IDX chip — small mono marker on placeholder routes. Uses
 * `text-muted-foreground` (not /70) so 9px text still meets contrast.
 */
const IdxChip = () => (
  <span
    className="label-mono text-[9px] text-muted-foreground border border-rule px-1 py-[1px]"
    aria-label="indexing — route not yet implemented"
  >
    IDX
  </span>
);

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 rule-bottom bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container-editorial flex items-center gap-6 py-3">
        <Link to="/" className="group flex items-baseline gap-2 min-w-0" aria-label="Antinationals — home">
          <span className="font-display text-lg font-semibold tracking-tight text-foreground">
            ANTINATIONALS
          </span>
          <span className="hidden sm:inline label-mono text-muted-foreground">
            PUBLIC EVIDENCE ARCHIVE
          </span>
        </Link>

        <nav className="ml-auto hidden lg:flex items-center gap-6" aria-label="Primary">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "text-sm transition-colors inline-flex items-baseline gap-1.5",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              {item.label}
              {item.indexing && <IdxChip />}
            </NavLink>
          ))}
        </nav>

        {/*
          Submit is a placeholder route in Phase 0 — keep the CTA visually
          quiet and truthful. No blinking cursor on the header; motion is
          reserved for the hero.
        */}
        <Link
          to="/submit"
          className="hidden md:inline-flex items-center gap-2 border border-rule px-3 py-1.5 label-mono text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
          aria-label="Submit evidence — route indexing"
        >
          Submit evidence
          <IdxChip />
        </Link>

        <button
          type="button"
          className="lg:hidden ml-auto md:ml-0 p-2 -mr-2 text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden rule-top bg-background">
          <nav className="container-editorial flex flex-col py-4" aria-label="Mobile">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "py-2.5 text-sm rule-bottom last:border-b-0",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )
                }
              >
                <span className="inline-flex items-center gap-2">
                  {item.label}
                  {item.indexing && <IdxChip />}
                </span>
              </NavLink>
            ))}
            <Link
              to="/submit"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center gap-2 border border-rule px-3 py-2 label-mono text-muted-foreground"
              aria-label="Submit evidence — route indexing"
            >
              Submit evidence
              <IdxChip />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
