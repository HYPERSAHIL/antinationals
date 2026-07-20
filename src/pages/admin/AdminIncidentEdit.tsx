import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { slugify } from "@/lib/format";
import { ArrowLeft } from "lucide-react";

const empty = {
  title: "", slug: "", summary: "", incident_date: "", city: "", state: "", country: "",
  location_description: "", verification_status: "unverified", published: false,
};

const AdminIncidentEdit = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState<any>(empty);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [linked, setLinked] = useState<any[]>([]);
  const [linkSubject, setLinkSubject] = useState("");
  const [busy, setBusy] = useState(false);
  const isNew = !id;

  useEffect(() => {
    (async () => {
      const { data: subs } = await (supabase as any).from("subjects").select("id, display_name, subject_number").order("subject_number");
      setSubjects(subs ?? []);
      if (id) {
        const { data } = await (supabase as any).from("incidents").select("*").eq("id", id).maybeSingle();
        if (data) setForm(data);
        const { data: rel } = await (supabase as any).from("subject_incidents").select("id, subject_id, relation_note, subject:subjects(display_name)").eq("incident_id", id);
        setLinked(rel ?? []);
      }
    })();
  }, [id]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const payload: any = { ...form };
    if (!payload.slug && payload.title) payload.slug = slugify(payload.title);
    if (!payload.incident_date) payload.incident_date = null;
    if (isNew) {
      const { data, error } = await (supabase as any).from("incidents").insert(payload).select().single();
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Created");
      nav(`/admin/incidents/${data.id}`);
    } else {
      const { error } = await (supabase as any).from("incidents").update(payload).eq("id", id);
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Saved");
    }
  };

  const linkSub = async () => {
    if (!linkSubject || !id) return;
    const { error } = await (supabase as any).from("subject_incidents").insert({ incident_id: id, subject_id: linkSubject });
    if (error) return toast.error(error.message);
    const { data: rel } = await (supabase as any).from("subject_incidents").select("id, subject_id, relation_note, subject:subjects(display_name)").eq("incident_id", id);
    setLinked(rel ?? []);
    setLinkSubject("");
  };

  const unlink = async (relId: string) => {
    await (supabase as any).from("subject_incidents").delete().eq("id", relId);
    setLinked(linked.filter((l) => l.id !== relId));
  };

  const remove = async () => {
    if (!id || !confirm("Delete this incident?")) return;
    const { error } = await (supabase as any).from("incidents").delete().eq("id", id);
    if (error) return toast.error(error.message);
    nav("/admin/incidents");
  };

  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  return (
    <div className="max-w-3xl">
      <Link to="/admin/incidents" className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3 w-3" /> Incidents
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-foreground">{isNew ? "New incident" : form.title || "Edit incident"}</h1>

      <form onSubmit={save} className="mt-8 space-y-6">
        <Field label="Title *">
          <input required value={form.title || ""} onChange={(e) => set("title", e.target.value)} className="input" />
        </Field>
        <Field label="Slug">
          <input value={form.slug || ""} onChange={(e) => set("slug", e.target.value)} placeholder="auto from title" className="input" />
        </Field>
        <Field label="Summary">
          <textarea rows={4} value={form.summary || ""} onChange={(e) => set("summary", e.target.value)} className="input" />
        </Field>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Incident date">
            <input type="date" value={form.incident_date || ""} onChange={(e) => set("incident_date", e.target.value)} className="input" />
          </Field>
          <Field label="Verification status">
            <select value={form.verification_status} onChange={(e) => set("verification_status", e.target.value)} className="input">
              <option value="unverified">Unverified</option>
              <option value="partially_verified">Partially verified</option>
              <option value="corroborated">Corroborated</option>
              <option value="verified">Verified</option>
              <option value="disputed">Disputed</option>
              <option value="corrected">Corrected</option>
            </select>
          </Field>
          <Field label="City"><input value={form.city || ""} onChange={(e) => set("city", e.target.value)} className="input" /></Field>
          <Field label="State / region"><input value={form.state || ""} onChange={(e) => set("state", e.target.value)} className="input" /></Field>
          <Field label="Country"><input value={form.country || ""} onChange={(e) => set("country", e.target.value)} className="input" /></Field>
          <Field label="Location description"><input value={form.location_description || ""} onChange={(e) => set("location_description", e.target.value)} className="input" /></Field>
        </div>

        <div className="flex items-center gap-3">
          <input id="pub" type="checkbox" checked={!!form.published} onChange={(e) => set("published", e.target.checked)} />
          <label htmlFor="pub" className="text-sm">Published</label>
        </div>

        <div className="flex items-center gap-3 pt-4 rule-top">
          <button disabled={busy} className="border border-foreground bg-foreground px-5 py-2 text-sm text-background hover:bg-transparent hover:text-foreground disabled:opacity-50">
            {busy ? "Saving…" : isNew ? "Create" : "Save changes"}
          </button>
          {!isNew && <button type="button" onClick={remove} className="text-xs font-mono uppercase tracking-widest text-destructive hover:underline">Delete</button>}
        </div>
      </form>

      {!isNew && (
        <section className="mt-16">
          <h2 className="rule-bottom pb-3 font-serif text-xl font-semibold">Linked subjects</h2>
          <ul className="mt-4 divide-y divide-rule">
            {linked.map((l) => (
              <li key={l.id} className="py-2 flex items-center justify-between">
                <span className="text-sm">{l.subject?.display_name || "—"}</span>
                <button onClick={() => unlink(l.id)} className="text-xs font-mono uppercase text-destructive hover:underline">Remove</button>
              </li>
            ))}
            {linked.length === 0 && <li className="py-2 text-sm text-muted-foreground">None linked.</li>}
          </ul>
          <div className="mt-4 flex gap-2">
            <select value={linkSubject} onChange={(e) => setLinkSubject(e.target.value)} className="input flex-1">
              <option value="">Select subject…</option>
              {subjects.map((s: any) => (
                <option key={s.id} value={s.id}>{s.display_name || `#${s.subject_number}`}</option>
              ))}
            </select>
            <button onClick={linkSub} className="border border-foreground px-4 text-sm hover:bg-foreground hover:text-background">Link</button>
          </div>
        </section>
      )}

      <style>{`.input{margin-top:0.5rem;width:100%;background:transparent;border:1px solid hsl(var(--rule));padding:0.5rem 0.75rem;color:hsl(var(--foreground));font-size:0.875rem}
        .input:focus{outline:none;border-color:hsl(var(--foreground))}`}</style>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block"><span className="kicker">{label}</span>{children}</label>
);

export default AdminIncidentEdit;
