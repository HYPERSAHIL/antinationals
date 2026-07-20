import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/site/SEO";
import { toast } from "sonner";

const CorrectionsPage = () => {
  const [form, setForm] = useState({ incident_slug: "", description: "", contact_email: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim()) return toast.error("Please describe the correction");
    setBusy(true);
    // Find incident by slug if provided
    let incident_id: string | null = null;
    if (form.incident_slug.trim()) {
      const { data } = await supabase.from("incidents").select("id").eq("slug", form.incident_slug.trim()).maybeSingle();
      incident_id = data?.id ?? null;
    }
    const { error } = await supabase.from("corrections").insert({
      incident_id,
      description: form.description,
      contact_email: form.contact_email || null,
      status: "submitted",
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Correction submitted for review.");
    setForm({ incident_slug: "", description: "", contact_email: "" });
  };

  return (
    <>
      <SEO title="Corrections" description="Request a correction to a record." path="/corrections" />
      <div className="container-editorial py-16 max-w-2xl">
        <p className="kicker">Standards</p>
        <h1 className="mt-2 font-serif text-4xl lg:text-5xl font-semibold text-foreground">Request a correction</h1>
        <p className="mt-4 text-muted-foreground">
          We treat corrections as first-class content. Submissions are reviewed by two archivists and, if accepted, appear
          on the record's page alongside a timestamped correction log.
        </p>

        <form onSubmit={submit} className="mt-10 space-y-6">
          <div>
            <label className="kicker">Incident slug (if known)</label>
            <input value={form.incident_slug} onChange={(e) => setForm({ ...form, incident_slug: e.target.value })}
              className="mt-2 w-full border-b border-rule bg-transparent py-2 focus:border-foreground focus:outline-none" placeholder="e.g. 2024-city-hall-incident" />
          </div>
          <div>
            <label className="kicker">What should be corrected? *</label>
            <textarea required rows={6} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-2 w-full border border-rule bg-transparent p-3 focus:border-foreground focus:outline-none" />
          </div>
          <div>
            <label className="kicker">Your email (optional)</label>
            <input type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
              className="mt-2 w-full border-b border-rule bg-transparent py-2 focus:border-foreground focus:outline-none" placeholder="For follow-up questions" />
          </div>
          <button disabled={busy} className="border border-foreground bg-foreground px-6 py-2.5 text-sm font-medium text-background hover:bg-transparent hover:text-foreground transition-colors disabled:opacity-50">
            {busy ? "Submitting…" : "Submit correction"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CorrectionsPage;
