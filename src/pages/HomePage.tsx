import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/site/SEO";
import { VerificationBadge, IdentityBadge } from "@/components/archive/StatusBadge";
import { formatDate, formatDateShort, locationLine } from "@/lib/format";
import { ArrowRight, FileText, Users, Camera, ScrollText } from "lucide-react";

const HomePage = () => {
  const { data: stats } = useQuery({
    queryKey: ["archive-stats"],
    queryFn: async () => {
      const { data } = await supabase.rpc("get_archive_stats");
      return data as {
        total_subjects: number;
        total_incidents: number;
        total_evidence: number;
        total_sources: number;
        published_incidents: number;
      } | null;
    },
  });

  const { data: latest } = useQuery({
    queryKey: ["home-latest-incidents"],
    queryFn: async () => {
      const { data } = await supabase
        .from("incidents")
        .select("id, slug, title, summary, occurred_at, city, region, country, verification_status, published_at, subjects:incident_subjects(subject:subjects(display_name, slug))")
        .eq("status", "published")
        .order("occurred_at", { ascending: false, nullsFirst: false })
        .limit(6);
      return data ?? [];
    },
  });

  const { data: featured } = useQuery({
    queryKey: ["home-featured"],
    queryFn: async () => {
      const { data } = await supabase
        .from("incidents")
        .select("id, slug, title, summary, occurred_at, city, region, country, verification_status, subjects:incident_subjects(subject:subjects(display_name, slug))")
        .eq("status", "published")
        .in("verification_status", ["verified", "corroborated"])
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

  return (
    <>
      <SEO
        title="AntiNationals — Public Accountability Directory"
        description="An independent public-interest archive preserving evidence, timelines and sourcing on significant public events."
        path="/"
      />

      {/* Masthead */}
      <section className="rule-bottom">
        <div className="container-editorial py-16 lg:py-24">
          <p className="kicker">The Archive · Est. {new Date().getFullYear()}</p>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-7xl font-semibold leading-[1.02] tracking-tight text-foreground max-w-5xl">
            A record of public conduct, held to the standard of the record itself.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            AntiNationals is a public-interest archive that documents publicly observable events through
            photographs, video, testimony and traceable sources — each piece verified, dated and preserved
            against alteration.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/directory" className="group inline-flex items-center gap-2 border border-foreground bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:bg-transparent hover:text-foreground transition-colors">
              Browse the directory
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link to="/methodology" className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-rule hover:decoration-foreground">
              Read the methodology
            </Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="rule-bottom bg-secondary/30">
        <div className="container-editorial py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Users, label: "Subjects documented", value: stats?.total_subjects ?? 0 },
            { icon: FileText, label: "Incidents published", value: stats?.published_incidents ?? 0 },
            { icon: Camera, label: "Evidence records", value: stats?.total_evidence ?? 0 },
            { icon: ScrollText, label: "Cited sources", value: stats?.total_sources ?? 0 },
          ].map((s) => (
            <div key={s.label} className="flex items-start gap-3">
              <s.icon className="mt-1 h-4 w-4 text-muted-foreground" aria-hidden />
              <div>
                <p className="font-serif text-3xl tabular font-semibold text-foreground">{s.value.toLocaleString()}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured + latest */}
      <section className="container-editorial py-16">
        <div className="grid gap-16 lg:grid-cols-3">
          {/* Featured */}
          <article className="lg:col-span-2">
            <p className="kicker mb-4">Featured record</p>
            {featured ? (
              <Link to={`/incident/${featured.slug}`} className="group block">
                <div className="mb-5 aspect-[16/9] w-full rule-top rule-bottom border-x border-rule bg-secondary/30 flex items-center justify-center">
                  <span className="font-serif text-5xl text-muted-foreground/40">§</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <time className="font-mono uppercase tracking-widest">{formatDateShort(featured.occurred_at)}</time>
                  <span>·</span>
                  <span>{locationLine([featured.city, featured.region, featured.country])}</span>
                </div>
                <h2 className="mt-3 font-serif text-3xl lg:text-4xl font-semibold leading-tight text-foreground group-hover:text-accent transition-colors">
                  {featured.title}
                </h2>
                {featured.summary && (
                  <p className="mt-4 text-base text-muted-foreground leading-relaxed line-clamp-3">{featured.summary}</p>
                )}
                <div className="mt-5 flex items-center gap-3">
                  <VerificationBadge status={featured.verification_status} />
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground">
                    Read record <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ) : (
              <div className="rule-top rule-bottom py-16 text-center">
                <p className="font-serif text-xl text-foreground">The archive is being prepared.</p>
                <p className="mt-2 text-sm text-muted-foreground">Verified records will appear here as they are cleared for publication.</p>
              </div>
            )}
          </article>

          {/* Latest list */}
          <aside>
            <p className="kicker mb-4">Latest records</p>
            {latest && latest.length > 0 ? (
              <ul className="divide-y divide-rule border-t border-b border-rule">
                {latest.map((i: any) => (
                  <li key={i.id}>
                    <Link to={`/incident/${i.slug}`} className="group block py-4 hover:bg-secondary/40 -mx-2 px-2 transition-colors">
                      <time className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                        {formatDateShort(i.occurred_at)}
                      </time>
                      <p className="mt-1 font-serif text-lg leading-snug text-foreground group-hover:text-accent">
                        {i.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {locationLine([i.city, i.region, i.country])}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground py-8">No records published yet.</p>
            )}
          </aside>
        </div>
      </section>

      {/* Standards */}
      <section className="rule-top bg-secondary/20">
        <div className="container-editorial py-16 grid gap-12 lg:grid-cols-3">
          {[
            { t: "Every claim, sourced.", d: "Each incident is tied to primary material — photographs, video, court filings, government records — with dates, provenance and integrity hashes." },
            { t: "Verification, staged.", d: "Records progress through unverified, partially verified, corroborated and verified states, disclosed openly on every page." },
            { t: "Right of reply, honored.", d: "Any named subject or their representative may submit a response, which is preserved alongside the record and never removed." },
          ].map((s, i) => (
            <div key={i}>
              <p className="kicker">0{i + 1} — Standard</p>
              <h3 className="mt-3 font-serif text-2xl font-semibold text-foreground">{s.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default HomePage;
