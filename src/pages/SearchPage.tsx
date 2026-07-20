import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/site/SEO";
import { VerificationBadge, IdentityBadge } from "@/components/archive/StatusBadge";
import { Search } from "lucide-react";
import { formatDateShort, locationLine } from "@/lib/format";

const SearchPage = () => {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const [input, setInput] = useState(q);

  const { data, isLoading } = useQuery({
    queryKey: ["search", q],
    queryFn: async () => {
      if (!q) return { subjects: [], incidents: [] };
      const [{ data: subjects }, { data: incidents }] = await Promise.all([
        (supabase as any).from("subjects").select("id, slug, display_name, organization, identity_status").eq("published", true).ilike("display_name", `%${q}%`).limit(30),
        (supabase as any).from("incidents").select("id, slug, title, summary, incident_date, city, state, country, verification_status").eq("published", true).or(`title.ilike.%${q}%,summary.ilike.%${q}%`).limit(50),
      ]);
      return { subjects: (subjects ?? []) as any[], incidents: (incidents ?? []) as any[] };
    },
    enabled: !!q,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(params);
    if (input) next.set("q", input); else next.delete("q");
    setParams(next);
  };

  return (
    <>
      <SEO title={q ? `Search: ${q}` : "Search"} description="Search the AntiNationals archive." path="/search" />
      <div className="container-editorial py-12">
        <p className="kicker">Search</p>
        <h1 className="mt-2 font-serif text-4xl lg:text-5xl font-semibold text-foreground">Search the archive</h1>

        <form onSubmit={submit} className="mt-8 flex items-center gap-3 border-b border-rule pb-3 max-w-2xl">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input autoFocus value={input} onChange={(e) => setInput(e.target.value)} placeholder="Search subjects, incidents…"
            className="flex-1 bg-transparent text-lg focus:outline-none" />
        </form>

        {q && (
          <div className="mt-10 grid gap-16 lg:grid-cols-2">
            <section>
              <p className="kicker mb-4">Subjects</p>
              {isLoading ? <p className="text-sm text-muted-foreground">Searching…</p> :
                data?.subjects.length === 0 ? <p className="text-sm text-muted-foreground">No subjects match.</p> :
                <ul className="divide-y divide-rule border-t border-b border-rule">
                  {data?.subjects.map((s) => (
                    <li key={s.id}>
                      <Link to={`/person/${s.slug}`} className="group block py-4 hover:bg-secondary/30 -mx-2 px-2">
                        <p className="font-serif text-lg text-foreground group-hover:text-accent">{s.display_name || "Unidentified subject"}</p>
                        <div className="mt-1 flex items-center gap-3">
                          <IdentityBadge status={s.identity_status} />
                          {s.organization && <span className="text-xs text-muted-foreground">{s.organization}</span>}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              }
            </section>

            <section>
              <p className="kicker mb-4">Incidents</p>
              {isLoading ? <p className="text-sm text-muted-foreground">Searching…</p> :
                data?.incidents.length === 0 ? <p className="text-sm text-muted-foreground">No incidents match.</p> :
                <ul className="divide-y divide-rule border-t border-b border-rule">
                  {data?.incidents.map((i) => (
                    <li key={i.id}>
                      <Link to={`/incident/${i.slug}`} className="group block py-4 hover:bg-secondary/30 -mx-2 px-2">
                        <time className="kicker">{formatDateShort(i.incident_date)}</time>
                        <p className="mt-1 font-serif text-lg text-foreground group-hover:text-accent">{i.title}</p>
                        {i.summary && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{i.summary}</p>}
                        <div className="mt-2"><VerificationBadge status={i.verification_status} /></div>
                      </Link>
                    </li>
                  ))}
                </ul>
              }
            </section>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchPage;
