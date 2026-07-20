import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

const nav = [
  { to: "/directory", label: "Directory" },
  { to: "/incidents", label: "Incidents" },
  { to: "/timeline", label: "Timeline" },
  { to: "/methodology", label: "Methodology" },
  { to: "/about", label: "About" },
];

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 rule-bottom bg-background/95 backdrop-blur">
      <div className="container-editorial flex items-center gap-6 py-4">
        <Link to="/" className="group flex items-baseline gap-2" aria-label="AntiNationals home">
          <span className="font-serif text-xl font-bold tracking-tight text-foreground">
            AntiNationals
          </span>
          <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            Archive
          </span>
        </Link>

        <nav className="ml-4 hidden lg:flex items-center gap-6" aria-label="Primary">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden md:flex items-center gap-2 rule-bottom border-t-0 border-x-0 border-b border-rule">
          <Search className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search archive…"
            className="w-44 bg-transparent py-1 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0"
            aria-label="Search archive"
          />
        </form>

        {isAdmin && (
          <Link to="/admin" className="hidden md:inline-block text-[10px] font-mono uppercase tracking-[0.2em] text-accent hover:underline">
            Admin
          </Link>
        )}

        <button
          className="lg:hidden ml-auto p-2 -mr-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden rule-top">
          <nav className="container-editorial flex flex-col py-4" aria-label="Mobile">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-2 text-sm ${isActive ? "text-foreground" : "text-muted-foreground"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <form onSubmit={submitSearch} className="mt-3 flex items-center gap-2 border-b border-rule">
              <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search archive…"
                className="w-full bg-transparent py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
              />
            </form>
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="mt-3 text-[10px] font-mono uppercase tracking-[0.2em] text-accent">
                Admin
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
