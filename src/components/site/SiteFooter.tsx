import { Link } from "react-router-dom";

const cols = [
  { title: "Archive", links: [
    { to: "/directory", label: "Directory" },
    { to: "/incidents", label: "Incidents" },
    { to: "/timeline", label: "Timeline" },
    { to: "/search", label: "Search" },
  ]},
  { title: "Standards", links: [
    { to: "/methodology", label: "Methodology" },
    { to: "/corrections", label: "Corrections" },
    { to: "/right-of-reply", label: "Right of Reply" },
    { to: "/editorial-policy", label: "Editorial policy" },
  ]},
  { title: "About", links: [
    { to: "/about", label: "About the archive" },
    { to: "/privacy", label: "Privacy" },
    { to: "/terms", label: "Terms" },
  ]},
];

export const SiteFooter = () => (
  <footer className="rule-top mt-32 bg-background">
    <div className="container-editorial py-16">
      <div className="grid gap-12 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <p className="font-serif text-lg font-semibold text-foreground">AntiNationals</p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            An independent public-interest archive preserving evidence, timelines and sourcing on significant public events.
          </p>
          <p className="mt-6 border-l-2 border-accent pl-3 font-serif italic text-sm text-foreground">
            Document the conduct. Preserve the evidence. Let the record speak.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <p className="kicker mb-3">{col.title}</p>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="rule-top mt-12 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} AntiNationals. All records cite their sources.</p>
        <p>Inclusion does not constitute a finding of criminal or civil liability.</p>
      </div>
    </div>
  </footer>
);
