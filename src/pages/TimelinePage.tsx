import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/site/SEO";
import { VerificationBadge } from "@/components/archive/StatusBadge";
import { formatDate, locationLine } from "@/lib/format";

const TimelinePage = () => {
  const { data } = useQuery({
    queryKey: ["timeline"],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("incidents")
        .select("id, slug, title, summary, incident_date, city, state, country, verification_status")
        .eq("published", true)
        .not("incident_date", "is", null)
        .order("incident_date", { ascending: false })
        .limit(300);
      return (data ?? []) as any[];
    },
  });

  const grouped: Record<string, any[]> = {};
  (data ?? []).forEach((i) => {
    const y = i.incident_date ? new Date(i.incident_date).getFullYear().toString() : "Undated";
    (grouped[y] ||= []).push(i);
  });
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <>
      <SEO title="Timeline" description="Chronological timeline of documented incidents." path="/timeline" />
      <div className="container-editorial py-12">
        <p className="kicker">Section 03</p>
        <h1 className="mt-2 font-serif text-4xl lg:text-5xl font-semibold text-foreground">Timeline</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">Documented incidents grouped by year of occurrence.</p>

        <div className="mt-12 space-y-16">
          {years.length === 0 && <p className="text-sm text-muted-foreground">No dated incidents yet.</p>}
          {years.map((y) => (
            <section key={y} className="grid gap-8 md:grid-cols-[120px_1fr]">
              <h2 className="font-serif text-5xl font-bold text-muted-foreground/50 tabular sticky top-24 self-start">{y}</h2>
              <ul className="space-y-6 border-l border-rule pl-8 relative">
                {grouped[y].map((i) => (
                  <li key={i.id} className="relative">
                    <span className="absolute -left-[33px] top-2 h-2 w-2 rounded-full bg-accent" aria-hidden />
                    <Link to={`/incident/${i.slug}`} className="group block">
                      <time className="kicker">{formatDate(i.incident_date)}</time>
                      <p className="mt-1 font-serif text-2xl text-foreground group-hover:text-accent">{i.title}</p>
                      {i.summary && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{i.summary}</p>}
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{locationLine([i.city, i.state, i.country])}</span>
                        <VerificationBadge status={i.verification_status} />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
};

export default TimelinePage;
