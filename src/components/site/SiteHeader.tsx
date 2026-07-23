import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TerminalCursor } from "@/components/ascii/TerminalCursor";

/**
 * Phase 0A: routes marked `indexing` are intentionally deferred. The link
 * remains navigable to a placeholder page but is visually marked so the
 * preview does not read as production-ready.
 */
const NAV: { to: string; label: string; indexing?: boolean }[] = [
  { to: "/archive",     label: "Archive",     indexing: true },
  { to: "/incidents",   label: "Incidents",   indexing: true },
  { to: "/subjects",    label: "Subjects",    indexing: true },
  { to: "/submit",      label: "Submit",      indexing: true },
  { to: "/methodology", label: "Methodology" },
  { to: "/about",       label: "About" },
];

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
              {item.indexing && (
                <span className="label-mono text-[9px] text-muted-foreground/70 border border-rule px-1 py-[1px]" aria-label="indexing — placeholder route">
                  IDX
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/submit"
          className="hidden md:inline-flex items-center gap-2 border border-rule px-3 py-1.5 label-mono text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
          aria-label="Submit evidence — route indexing"
        >
          Submit evidence · IDX
          <TerminalCursor />
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
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/submit"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center border border-foreground px-3 py-2 label-mono"
            >
              Submit evidence
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
