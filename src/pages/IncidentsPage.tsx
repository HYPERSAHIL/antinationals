import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/site/SEO";
import { VerificationBadge } from "@/components/archive/StatusBadge";
import { EmptyState } from "@/components/archive/EmptyState";
import { formatDateShort, locationLine } from "@/lib/format";
import { FileText } from "lucide-react";

const IncidentsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["incidents-all"],
    queryFn: async () => {
      const { data } = await supabase
        .from("incidents")
        .select("id, slug, title, summary, occurred_at, city, region, country, verification_status")
        .eq("status", "published")
        .order("occurred_at", { ascending: false, nullsFirst: false })
        .limit(200);
      return data ?? [];
    },
  });

  return (
    <>
      <SEO title="Incidents" description="Chronological list of documented incidents." path="/incidents" />
      <div className="container-editorial py-12">
        <p className="kicker">Section 02</p>
        <h1 className="mt-2 font-serif text-4xl lg:text-5xl font-semibold text-foreground">Incidents</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Every published incident, most recent first. Each record links to its cited evidence and sources.
        </p>

        <div className="mt-10">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : !data || data.length === 0 ? (
            <EmptyState icon={<FileText className="mx-auto h-8 w-8" />} title="No incidents published yet." />
          ) : (
            <ul className="divide-y divide-rule border-t border-b border-rule">
              {data.map((i: any) => (
                <li key={i.id}>
                  <Link to={`/incident/${i.slug}`} className="group grid gap-2 py-6 md:grid-cols-[140px_1fr_auto] md:items-start md:gap-6 hover:bg-secondary/30 -mx-4 px-4 transition-colors">
                    <time className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground pt-1">
                      {formatDateShort(i.occurred_at)}
                    </time>
                    <div>
                      <h2 className="font-serif text-2xl leading-snug text-foreground group-hover:text-accent">{i.title}</h2>
                      {i.summary && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{i.summary}</p>}
                      <p className="mt-2 text-xs text-muted-foreground">{locationLine([i.city, i.region, i.country])}</p>
                    </div>
                    <div className="md:pt-1">
                      <VerificationBadge status={i.verification_status} />
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

export default IncidentsPage;
