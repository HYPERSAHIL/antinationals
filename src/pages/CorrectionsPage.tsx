import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/site/SEO";
import { toast } from "sonner";

const CorrectionsPage = () => {
  const [form, setForm] = useState({ incident_slug: "", correction_type: "factual", message: "", submitter_name: "", submitter_contact: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message.trim()) return toast.error("Please describe the correction");
    setBusy(true);
    let related_incident_id: string | null = null;
    if (form.incident_slug.trim()) {
      const { data } = await (supabase as any).from("incidents").select("id").eq("slug", form.incident_slug.trim()).maybeSingle();
      related_incident_id = data?.id ?? null;
    }
    const { error } = await (supabase as any).from("corrections").insert({
      related_incident_id,
      correction_type: form.correction_type,
      message: form.message,
      submitter_name: form.submitter_name || null,
      submitter_contact: form.submitter_contact || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Correction submitted for review.");
    setForm({ incident_slug: "", correction_type: "factual", message: "", submitter_name: "", submitter_contact: "" });
  };

  return (
    <>
      <SEO title="Corrections" description="Request a correction to a record." path="/corrections" />
      <div className="container-editorial py-16 max-w-2xl">
        <p className="kicker">Standards</p>
        <h1 className="mt-2 font-serif text-4xl lg:text-5xl font-semibold text-foreground">Request a correction</h1>
        <p className="mt-4 text-muted-foreground">
          We treat corrections as first-class content. Submissions are reviewed and, if accepted, appear on the record's page
          alongside a timestamped correction log.
        </p>

        <form onSubmit={submit} className="mt-10 space-y-6">
          <div>
            <label className="kicker">Incident slug (if known)</label>
            <input value={form.incident_slug} onChange={(e) => setForm({ ...form, incident_slug: e.target.value })}
              className="mt-2 w-full border-b border-rule bg-transparent py-2 focus:border-foreground focus:outline-none" placeholder="e.g. 2024-city-hall-incident" />
          </div>
          <div>
            <label className="kicker">Correction type</label>
            <select value={form.correction_type} onChange={(e) => setForm({ ...form, correction_type: e.target.value })}
              className="mt-2 w-full border-b border-rule bg-transparent py-2 focus:border-foreground focus:outline-none">
              <option value="factual">Factual error</option>
              <option value="attribution">Attribution</option>
              <option value="identification">Identification</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="kicker">What should be corrected? *</label>
            <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-2 w-full border border-rule bg-transparent p-3 focus:border-foreground focus:outline-none" />
          </div>
          <div>
            <label className="kicker">Your name</label>
            <input value={form.submitter_name} onChange={(e) => setForm({ ...form, submitter_name: e.target.value })}
              className="mt-2 w-full border-b border-rule bg-transparent py-2 focus:border-foreground focus:outline-none" />
          </div>
          <div>
            <label className="kicker">Your email</label>
            <input type="email" value={form.submitter_contact} onChange={(e) => setForm({ ...form, submitter_contact: e.target.value })}
              className="mt-2 w-full border-b border-rule bg-transparent py-2 focus:border-foreground focus:outline-none" />
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
