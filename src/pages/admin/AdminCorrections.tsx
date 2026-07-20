import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDateShort } from "@/lib/format";
import { toast } from "sonner";

const AdminCorrections = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-corrections"],
    queryFn: async () => {
      const { data } = await (supabase as any).from("corrections").select("*").order("created_at", { ascending: false }).limit(500);
      return (data ?? []) as any[];
    },
  });

  const setStatus = async (id: string, status: string, published?: boolean) => {
    const patch: any = { status };
    if (published !== undefined) patch.published = published;
    const { error } = await (supabase as any).from("corrections").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-corrections"] });
    toast.success("Updated");
  };

  return (
    <div>
      <p className="kicker">Corrections</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-foreground">Correction requests</h1>

      <div className="mt-8 space-y-4">
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {data?.length === 0 && <p className="text-sm text-muted-foreground">No corrections submitted.</p>}
        {data?.map((c) => (
          <article key={c.id} className="rule-top rule-bottom border-x border-rule p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="kicker">{formatDateShort(c.created_at)} · {c.correction_type} · {c.status}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.submitter_name || "Anonymous"} · {c.submitter_contact || "—"}</p>
              </div>
              <span className={`text-xs font-mono uppercase tracking-widest ${c.published ? "text-status-verified" : "text-muted-foreground"}`}>
                {c.published ? "Published" : "Not published"}
              </span>
            </div>
            <p className="mt-3 text-sm text-foreground whitespace-pre-wrap">{c.message}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <button onClick={() => setStatus(c.id, "accepted", true)} className="border border-rule px-3 py-1 hover:border-foreground">Accept + publish</button>
              <button onClick={() => setStatus(c.id, "applied", true)} className="border border-rule px-3 py-1 hover:border-foreground">Mark applied</button>
              <button onClick={() => setStatus(c.id, "rejected", false)} className="border border-rule px-3 py-1 hover:border-foreground">Reject</button>
              <button onClick={() => setStatus(c.id, "pending", false)} className="border border-rule px-3 py-1 hover:border-foreground">Reset</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AdminCorrections;
