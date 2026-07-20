import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/site/SEO";
import { VerificationBadge } from "@/components/archive/StatusBadge";
import { LegalNote } from "@/components/archive/LegalNote";
import { formatDate, locationLine } from "@/lib/format";
import { ExternalLink } from "lucide-react";
import NotFound from "./NotFound";

const IncidentPage = () => {
  const { slug } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["incident", slug],
    queryFn: async () => {
      const { data: incident } = await (supabase as any)
        .from("incidents").select("*").eq("slug", slug!).eq("published", true).maybeSingle();
      if (!incident) return null;
      const [{ data: subjects }, { data: evidence }, { data: sources }, { data: replies }, { data: corrections }] = await Promise.all([
        (supabase as any).from("subject_incidents").select("relation_note, subject:subjects(id, slug, display_name, identity_status, role, organization)").eq("incident_id", incident.id),
        (supabase as any).from("evidence").select("*").eq("incident_id", incident.id).eq("published", true).order("capture_time", { nullsFirst: false }),
        (supabase as any).from("sources").select("*").eq("incident_id", incident.id).order("publication_date", { nullsFirst: false }),
        (supabase as any).from("replies").select("*").eq("incident_id", incident.id).eq("published", true).order("created_at"),
        (supabase as any).from("corrections").select("*").eq("related_incident_id", incident.id).eq("published", true).order("created_at", { ascending: false }),
      ]);
      return {
        incident,
        subjects: (subjects ?? []) as any[],
        evidence: (evidence ?? []) as any[],
        sources: (sources ?? []) as any[],
        replies: (replies ?? []) as any[],
        corrections: (corrections ?? []) as any[],
      };
    },
    enabled: !!slug,
  });

  if (isLoading) return <div className="container-editorial py-16 text-sm text-muted-foreground">Loading…</div>;
  if (!data) return <NotFound />;

  const { incident, subjects, evidence, sources, replies, corrections } = data;

  return (
    <>
      <SEO title={incident.title} description={incident.summary ?? undefined} path={`/incident/${incident.slug}`} type="article" />

      <article className="container-editorial py-12 max-w-4xl">
        <p className="kicker">Incident record</p>
        <h1 className="mt-2 font-serif text-4xl lg:text-6xl font-semibold text-foreground leading-[1.05]">
          {incident.title}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 rule-top rule-bottom py-4">
          <VerificationBadge status={incident.verification_status} />
          <span className="text-xs text-muted-foreground">
            <span className="kicker mr-1">Occurred</span> {formatDate(incident.incident_date)}
          </span>
          <span className="text-xs text-muted-foreground">
            <span className="kicker mr-1">Location</span> {locationLine([incident.location_description, incident.city, incident.state, incident.country])}
          </span>
        </div>

        {incident.summary && (
          <p className="mt-8 font-serif text-2xl leading-snug text-foreground">{incident.summary}</p>
        )}

        {subjects.length > 0 && (
          <section className="mt-16">
            <h2 className="rule-bottom pb-3 font-serif text-2xl font-semibold text-foreground">Named subjects</h2>
            <ul className="mt-4 divide-y divide-rule">
              {subjects.map((s: any) => s.subject && (
                <li key={s.subject.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <Link to={`/person/${s.subject.slug}`} className="font-serif text-lg text-foreground hover:text-accent">
                      {s.subject.display_name || "Unidentified subject"}
                    </Link>
                    {(s.subject.role || s.subject.organization) && (
                      <p className="text-xs text-muted-foreground">{[s.subject.role, s.subject.organization].filter(Boolean).join(" · ")}</p>
                    )}
                  </div>
                  {s.relation_note && <span className="text-xs text-muted-foreground uppercase font-mono tracking-widest">{s.relation_note}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {evidence.length > 0 && (
          <section className="mt-16">
            <h2 className="rule-bottom pb-3 font-serif text-2xl font-semibold text-foreground">Evidence</h2>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2">
              {evidence.map((e: any) => (
                <li key={e.id} className="rule-top rule-bottom border-x border-rule bg-secondary/20 p-5">
                  <div className="flex items-center justify-between">
                    <span className="kicker">{e.media_type || "record"}</span>
                    <VerificationBadge status={e.verification_status} className="text-[9px]" />
                  </div>
                  <p className="mt-3 font-serif text-lg text-foreground">{e.title || "Untitled evidence"}</p>
                  {e.caption && <p className="mt-2 text-sm text-muted-foreground">{e.caption}</p>}
                  <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {e.capture_time && <><dt className="kicker">Captured</dt><dd>{formatDate(e.capture_time)}</dd></>}
                    {e.attribution && <><dt className="kicker">By</dt><dd>{e.attribution}</dd></>}
                    {e.sha256 && <><dt className="kicker">SHA-256</dt><dd className="font-mono truncate" title={e.sha256}>{e.sha256.slice(0, 16)}…</dd></>}
                  </dl>
                  {e.source_url && (
                    <a href={e.source_url} target="_blank" rel="noreferrer noopener" className="mt-3 inline-flex items-center gap-1 text-xs text-accent underline underline-offset-2">
                      Source <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {sources.length > 0 && (
          <section className="mt-16">
            <h2 className="rule-bottom pb-3 font-serif text-2xl font-semibold text-foreground">Sources</h2>
            <ol className="mt-6 space-y-4 list-decimal list-inside marker:text-muted-foreground marker:font-mono marker:text-xs">
              {sources.map((s: any) => (
                <li key={s.id} className="text-sm">
                  <span className="font-serif text-base text-foreground">{s.title || s.url || "Source"}</span>
                  {s.publisher && <span className="text-muted-foreground"> · {s.publisher}</span>}
                  {s.publication_date && <span className="text-muted-foreground"> · {formatDate(s.publication_date)}</span>}
                  {s.source_type && <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{s.source_type.replace(/_/g, " ")}</span>}
                  {s.url && (
                    <a href={s.url} target="_blank" rel="noreferrer noopener" className="ml-2 inline-flex items-center gap-1 text-accent underline underline-offset-2">
                      Link <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}

        {replies.length > 0 && (
          <section className="mt-16">
            <h2 className="rule-bottom pb-3 font-serif text-2xl font-semibold text-foreground">Right of reply</h2>
            {replies.map((r: any) => (
              <blockquote key={r.id} className="mt-6 border-l-2 border-accent bg-secondary/30 p-5">
                <p className="font-serif text-lg italic text-foreground">"{r.response_text}"</p>
                <footer className="mt-3 text-xs text-muted-foreground">
                  — {r.submitter_name}
                  {r.submitter_role && `, ${r.submitter_role}`}
                  {` · ${formatDate(r.created_at)}`}
                </footer>
              </blockquote>
            ))}
          </section>
        )}

        {corrections.length > 0 && (
          <section className="mt-16">
            <h2 className="rule-bottom pb-3 font-serif text-2xl font-semibold text-foreground">Corrections</h2>
            <ul className="mt-4 divide-y divide-rule">
              {corrections.map((c: any) => (
                <li key={c.id} className="py-4">
                  <p className="kicker">{formatDate(c.created_at)} · {c.correction_type}</p>
                  <p className="mt-1 text-sm text-foreground">{c.public_summary || c.message}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-16">
          <LegalNote />
          <p className="mt-4 text-xs text-muted-foreground">
            <Link to="/corrections" className="text-foreground underline">Request a correction</Link> ·{" "}
            <Link to="/right-of-reply" className="text-foreground underline">Submit a right-of-reply</Link>
          </p>
        </div>
      </article>
    </>
  );
};

export default IncidentPage;
