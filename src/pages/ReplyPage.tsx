import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/site/SEO";
import { toast } from "sonner";

const ReplyPage = () => {
  const [form, setForm] = useState({ incident_slug: "", submitter_name: "", submitter_role: "", response_text: "", submitter_contact: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.response_text.trim() || !form.submitter_name.trim() || !form.submitter_contact.trim()) {
      return toast.error("Name, contact and response are required");
    }
    setBusy(true);
    let incident_id: string | null = null;
    if (form.incident_slug.trim()) {
      const { data } = await (supabase as any).from("incidents").select("id").eq("slug", form.incident_slug.trim()).maybeSingle();
      incident_id = data?.id ?? null;
    }
    const { error } = await (supabase as any).from("replies").insert({
      incident_id,
      submitter_name: form.submitter_name,
      submitter_role: form.submitter_role || null,
      submitter_contact: form.submitter_contact,
      response_text: form.response_text,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Response received. It will be reviewed before publication.");
    setForm({ incident_slug: "", submitter_name: "", submitter_role: "", response_text: "", submitter_contact: "" });
  };

  return (
    <>
      <SEO title="Right of Reply" description="Named subjects may submit a response." path="/right-of-reply" />
      <div className="container-editorial py-16 max-w-2xl">
        <p className="kicker">Standards</p>
        <h1 className="mt-2 font-serif text-4xl lg:text-5xl font-semibold text-foreground">Right of reply</h1>
        <p className="mt-4 text-muted-foreground">
          If you are a named subject in a record, or their representative, you may submit a response. Accepted responses
          appear alongside the record on the public page and are never removed from the archive.
        </p>

        <form onSubmit={submit} className="mt-10 space-y-6">
          <div>
            <label className="kicker">Incident slug</label>
            <input value={form.incident_slug} onChange={(e) => setForm({ ...form, incident_slug: e.target.value })}
              className="mt-2 w-full border-b border-rule bg-transparent py-2 focus:border-foreground focus:outline-none" />
          </div>
          <div>
            <label className="kicker">Your name *</label>
            <input required value={form.submitter_name} onChange={(e) => setForm({ ...form, submitter_name: e.target.value })}
              className="mt-2 w-full border-b border-rule bg-transparent py-2 focus:border-foreground focus:outline-none" />
          </div>
          <div>
            <label className="kicker">Role / relationship to subject</label>
            <input value={form.submitter_role} onChange={(e) => setForm({ ...form, submitter_role: e.target.value })}
              className="mt-2 w-full border-b border-rule bg-transparent py-2 focus:border-foreground focus:outline-none"
              placeholder="e.g. Subject, legal representative, press officer" />
          </div>
          <div>
            <label className="kicker">Contact email *</label>
            <input required type="email" value={form.submitter_contact} onChange={(e) => setForm({ ...form, submitter_contact: e.target.value })}
              className="mt-2 w-full border-b border-rule bg-transparent py-2 focus:border-foreground focus:outline-none" />
          </div>
          <div>
            <label className="kicker">Your response *</label>
            <textarea required rows={8} value={form.response_text} onChange={(e) => setForm({ ...form, response_text: e.target.value })}
              className="mt-2 w-full border border-rule bg-transparent p-3 focus:border-foreground focus:outline-none" />
          </div>
          <button disabled={busy} className="border border-foreground bg-foreground px-6 py-2.5 text-sm font-medium text-background hover:bg-transparent hover:text-foreground transition-colors disabled:opacity-50">
            {busy ? "Submitting…" : "Submit response"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ReplyPage;
