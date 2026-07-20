import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { slugify } from "@/lib/format";
import { ArrowLeft } from "lucide-react";

const empty = {
  display_name: "", slug: "", role: "", department: "", organization: "",
  identity_status: "unconfirmed", is_unidentified: false, bio_summary: "", identity_notes: "",
  primary_image: "", published: false,
};

const AdminSubjectEdit = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState<any>(empty);
  const [busy, setBusy] = useState(false);
  const isNew = !id;

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await (supabase as any).from("subjects").select("*").eq("id", id).maybeSingle();
      if (data) setForm(data);
    })();
  }, [id]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const payload: any = { ...form };
    if (!payload.slug && payload.display_name) payload.slug = slugify(payload.display_name);
    if (!payload.slug) { setBusy(false); return toast.error("Slug required"); }
    if (isNew) {
      const { data, error } = await (supabase as any).from("subjects").insert(payload).select().single();
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Subject created");
      nav(`/admin/subjects/${data.id}`);
    } else {
      const { error } = await (supabase as any).from("subjects").update(payload).eq("id", id);
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Saved");
    }
  };

  const remove = async () => {
    if (!id || !confirm("Delete this subject? This cannot be undone.")) return;
    const { error } = await (supabase as any).from("subjects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    nav("/admin/subjects");
  };

  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  return (
    <div className="max-w-3xl">
      <Link to="/admin/subjects" className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3 w-3" /> Subjects
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-foreground">{isNew ? "New subject" : form.display_name || "Edit subject"}</h1>

      <form onSubmit={save} className="mt-8 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Display name">
            <input value={form.display_name || ""} onChange={(e) => set("display_name", e.target.value)} className="input" />
          </Field>
          <Field label="Slug">
            <input value={form.slug || ""} onChange={(e) => set("slug", e.target.value)} placeholder="auto from name" className="input" />
          </Field>
          <Field label="Role / title">
            <input value={form.role || ""} onChange={(e) => set("role", e.target.value)} className="input" />
          </Field>
          <Field label="Organization">
            <input value={form.organization || ""} onChange={(e) => set("organization", e.target.value)} className="input" />
          </Field>
          <Field label="Department">
            <input value={form.department || ""} onChange={(e) => set("department", e.target.value)} className="input" />
          </Field>
          <Field label="Identity status">
            <select value={form.identity_status} onChange={(e) => set("identity_status", e.target.value)} className="input">
              <option value="unconfirmed">Unconfirmed</option>
              <option value="corroborated">Corroborated</option>
              <option value="verified">Verified</option>
            </select>
          </Field>
        </div>

        <Field label="Bio summary">
          <textarea rows={4} value={form.bio_summary || ""} onChange={(e) => set("bio_summary", e.target.value)} className="input" />
        </Field>
        <Field label="Identity notes (basis of identification)">
          <textarea rows={3} value={form.identity_notes || ""} onChange={(e) => set("identity_notes", e.target.value)} className="input" />
        </Field>
        <Field label="Primary image URL">
          <input value={form.primary_image || ""} onChange={(e) => set("primary_image", e.target.value)} className="input" />
        </Field>

        <div className="flex items-center gap-3">
          <input id="pub" type="checkbox" checked={!!form.published} onChange={(e) => set("published", e.target.checked)} />
          <label htmlFor="pub" className="text-sm">Published (visible on public archive)</label>
        </div>

        <div className="flex items-center gap-3 pt-4 rule-top">
          <button disabled={busy} className="border border-foreground bg-foreground px-5 py-2 text-sm text-background hover:bg-transparent hover:text-foreground disabled:opacity-50">
            {busy ? "Saving…" : isNew ? "Create" : "Save changes"}
          </button>
          {!isNew && (
            <button type="button" onClick={remove} className="text-xs font-mono uppercase tracking-widest text-destructive hover:underline">
              Delete
            </button>
          )}
        </div>
      </form>

      <style>{`.input{margin-top:0.5rem;width:100%;background:transparent;border:1px solid hsl(var(--rule));padding:0.5rem 0.75rem;color:hsl(var(--foreground));font-size:0.875rem}
        .input:focus{outline:none;border-color:hsl(var(--foreground))}`}</style>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="kicker">{label}</span>
    {children}
  </label>
);

export default AdminSubjectEdit;
