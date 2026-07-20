import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/site/SEO";
import { IdentityBadge, VerificationBadge } from "@/components/archive/StatusBadge";
import { LegalNote } from "@/components/archive/LegalNote";
import { formatDateShort, locationLine } from "@/lib/format";
import NotFound from "./NotFound";

const PersonPage = () => {
  const { slug } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["subject", slug],
    queryFn: async () => {
      const { data: subject } = await supabase
        .from("subjects")
        .select("*")
        .eq("slug", slug!)
        .eq("status", "published")
        .maybeSingle();
      if (!subject) return null;
      const { data: incidents } = await supabase
        .from("incident_subjects")
        .select("incident:incidents(id, slug, title, summary, occurred_at, city, region, country, verification_status, status)")
        .eq("subject_id", subject.id);
      const list = (incidents ?? [])
        .map((r: any) => r.incident)
        .filter((i: any) => i && i.status === "published")
        .sort((a: any, b: any) => new Date(b.occurred_at || 0).getTime() - new Date(a.occurred_at || 0).getTime());
      return { subject, incidents: list };
    },
    enabled: !!slug,
  });

  if (isLoading) return <div className="container-editorial py-16 text-sm text-muted-foreground">Loading…</div>;
  if (!data) return <NotFound />;

  const { subject, incidents } = data;

  return (
    <>
      <SEO
        title={subject.display_name}
        description={subject.summary ?? `Documented record for ${subject.display_name} in the AntiNationals archive.`}
        path={`/person/${subject.slug}`}
        type="article"
      />

      <article className="container-editorial py-12 max-w-4xl">
        <p className="kicker">Subject profile</p>
        <h1 className="mt-2 font-serif text-4xl lg:text-6xl font-semibold text-foreground leading-tight">
          {subject.display_name}
        </h1>
        {subject.aliases && subject.aliases.length > 0 && (
          <p className="mt-3 text-muted-foreground">
            <span className="kicker mr-2">Also known as</span>
            <span className="italic">{subject.aliases.join(" · ")}</span>
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <IdentityBadge status={subject.identity_status} />
          <span className="text-xs text-muted-foreground">
            {locationLine([subject.city, subject.region, subject.country])}
          </span>
        </div>

        {subject.identity_status !== "verified" && (
          <div className="mt-8">
            <LegalNote variant="warning" />
          </div>
        )}

        {subject.summary && (
          <div className="mt-10 prose prose-invert max-w-none prose-p:text-foreground prose-p:leading-relaxed">
            <p className="font-serif text-xl text-foreground leading-relaxed">{subject.summary}</p>
          </div>
        )}

        <section className="mt-16">
          <div className="flex items-baseline justify-between rule-bottom pb-3">
            <h2 className="font-serif text-2xl font-semibold text-foreground">Documented incidents</h2>
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              {incidents.length} record{incidents.length === 1 ? "" : "s"}
            </span>
          </div>

          {incidents.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">No published incidents linked to this subject.</p>
          ) : (
            <ul className="mt-6 divide-y divide-rule">
              {incidents.map((i: any) => (
                <li key={i.id}>
                  <Link to={`/incident/${i.slug}`} className="group block py-6 hover:bg-secondary/30 -mx-4 px-4 transition-colors">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <time className="font-mono uppercase tracking-widest">{formatDateShort(i.occurred_at)}</time>
                      <span>·</span>
                      <span>{locationLine([i.city, i.region, i.country])}</span>
                    </div>
                    <h3 className="mt-2 font-serif text-2xl text-foreground group-hover:text-accent">{i.title}</h3>
                    {i.summary && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{i.summary}</p>}
                    <div className="mt-3">
                      <VerificationBadge status={i.verification_status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="mt-16">
          <LegalNote />
          <p className="mt-4 text-xs text-muted-foreground">
            Believe something on this page is inaccurate? <Link to="/corrections" className="text-foreground underline">Request a correction</Link> or{" "}
            <Link to="/right-of-reply" className="text-foreground underline">submit a right-of-reply</Link>.
          </p>
        </div>
      </article>
    </>
  );
};

export default PersonPage;
