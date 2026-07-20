import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/site/SEO";
import { toast } from "sonner";

const ReplyPage = () => {
  const [form, setForm] = useState({ incident_slug: "", author_name: "", body: "", contact_email: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.body.trim()) return toast.error("Please provide a response");
    setBusy(true);
    let incident_id: string | null = null;
    if (form.incident_slug.trim()) {
      const { data } = await supabase.from("incidents").select("id").eq("slug", form.incident_slug.trim()).maybeSingle();
      incident_id = data?.id ?? null;
    }
    const { error } = await supabase.from("replies").insert({
      incident_id,
      author_name: form.author_name || null,
      body: form.body,
      contact_email: form.contact_email || null,
      status: "submitted",
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Response received. It will be reviewed before publication.");
    setForm({ incident_slug: "", author_name: "", body: "", contact_email: "" });
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
            <label className="kicker">Your name or organization</label>
            <input value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })}
              className="mt-2 w-full border-b border-rule bg-transparent py-2 focus:border-foreground focus:outline-none" />
          </div>
          <div>
            <label className="kicker">Your response *</label>
            <textarea required rows={8} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })}
              className="mt-2 w-full border border-rule bg-transparent p-3 focus:border-foreground focus:outline-none" />
          </div>
          <div>
            <label className="kicker">Contact email (for verification)</label>
            <input type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
              className="mt-2 w-full border-b border-rule bg-transparent py-2 focus:border-foreground focus:outline-none" />
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
