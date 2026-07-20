import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDateShort } from "@/lib/format";
import { toast } from "sonner";

const AdminReplies = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-replies"],
    queryFn: async () => {
      const { data } = await (supabase as any).from("replies").select("*").order("created_at", { ascending: false }).limit(500);
      return (data ?? []) as any[];
    },
  });

  const setStatus = async (id: string, status: string, published?: boolean) => {
    const patch: any = { status };
    if (published !== undefined) patch.published = published;
    const { error } = await (supabase as any).from("replies").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-replies"] });
    toast.success("Updated");
  };

  return (
    <div>
      <p className="kicker">Right of reply</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-foreground">Reply submissions</h1>

      <div className="mt-8 space-y-4">
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {data?.length === 0 && <p className="text-sm text-muted-foreground">No replies submitted.</p>}
        {data?.map((r) => (
          <article key={r.id} className="rule-top rule-bottom border-x border-rule p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="kicker">{formatDateShort(r.created_at)} · {r.status}</p>
                <p className="mt-1 text-xs text-muted-foreground">{r.submitter_name}{r.submitter_role ? `, ${r.submitter_role}` : ""} · {r.submitter_contact}</p>
              </div>
              <span className={`text-xs font-mono uppercase tracking-widest ${r.published ? "text-status-verified" : "text-muted-foreground"}`}>
                {r.published ? "Published" : "Not published"}
              </span>
            </div>
            <blockquote className="mt-3 border-l-2 border-accent pl-4 font-serif text-base text-foreground italic">"{r.response_text}"</blockquote>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <button onClick={() => setStatus(r.id, "approved", true)} className="border border-rule px-3 py-1 hover:border-foreground">Approve + publish</button>
              <button onClick={() => setStatus(r.id, "rejected", false)} className="border border-rule px-3 py-1 hover:border-foreground">Reject</button>
              <button onClick={() => setStatus(r.id, "pending", false)} className="border border-rule px-3 py-1 hover:border-foreground">Reset</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AdminReplies;
