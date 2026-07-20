import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/site/SEO";
import { IdentityBadge } from "@/components/archive/StatusBadge";
import { EmptyState } from "@/components/archive/EmptyState";
import { Search, Users } from "lucide-react";

const DirectoryPage = () => {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const [input, setInput] = useState(q);

  const { data, isLoading } = useQuery({
    queryKey: ["directory", q],
    queryFn: async () => {
      let query = supabase
        .from("subjects")
        .select("id, slug, display_name, aliases, city, region, country, identity_status, incident_count:incident_subjects(count)")
        .eq("status", "published")
        .order("display_name");
      if (q) query = query.or(`display_name.ilike.%${q}%,aliases.cs.{${q}}`);
      const { data } = await query.limit(200);
      return data ?? [];
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(params);
    if (input) next.set("q", input); else next.delete("q");
    setParams(next);
  };

  return (
    <>
      <SEO title="Directory" description="Directory of documented subjects in the AntiNationals archive." path="/directory" />
      <div className="container-editorial py-12">
        <p className="kicker">Section 01</p>
        <h1 className="mt-2 font-serif text-4xl lg:text-5xl font-semibold text-foreground">Directory</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Named subjects associated with one or more documented incidents. Identity verification status is disclosed on every entry.
        </p>

        <form onSubmit={submit} className="mt-8 flex items-center gap-3 border-b border-rule pb-2 max-w-xl">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search by name or alias…"
            className="flex-1 bg-transparent py-1 text-sm focus:outline-none"
          />
          <button type="submit" className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground">
            Search
          </button>
        </form>

        <div className="mt-10">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : !data || data.length === 0 ? (
            <EmptyState
              icon={<Users className="mx-auto h-8 w-8" />}
              title={q ? `No subjects match "${q}"` : "The directory is being prepared."}
              description="Published subjects will appear here as records are cleared for publication."
            />
          ) : (
            <ul className="grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-3">
              {data.map((s: any) => (
                <li key={s.id} className="bg-background">
                  <Link
                    to={`/person/${s.slug}`}
                    className="group block h-full p-5 transition-colors hover:bg-secondary/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-serif text-xl font-semibold text-foreground group-hover:text-accent truncate">
                          {s.display_name}
                        </p>
                        {s.aliases && s.aliases.length > 0 && (
                          <p className="mt-0.5 text-xs text-muted-foreground truncate">
                            aka {s.aliases.slice(0, 2).join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {[s.city, s.region, s.country].filter(Boolean).join(", ") || "Location not recorded"}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <IdentityBadge status={s.identity_status} />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                        {s.incident_count?.[0]?.count ?? 0} record{(s.incident_count?.[0]?.count ?? 0) === 1 ? "" : "s"}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default DirectoryPage;
