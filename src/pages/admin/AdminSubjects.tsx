import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { IdentityBadge } from "@/components/archive/StatusBadge";
import { Plus } from "lucide-react";

const AdminSubjects = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-subjects"],
    queryFn: async () => {
      const { data } = await (supabase as any).from("subjects").select("*").order("subject_number", { ascending: false }).limit(500);
      return (data ?? []) as any[];
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="kicker">Subjects</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-foreground">All subjects</h1>
        </div>
        <Link to="/admin/subjects/new" className="inline-flex items-center gap-2 border border-foreground bg-foreground px-4 py-2 text-sm text-background hover:bg-transparent hover:text-foreground transition-colors">
          <Plus className="h-4 w-4" /> New subject
        </Link>
      </div>

      <div className="mt-8 rule-top rule-bottom border-x border-rule overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="rule-bottom">
            <tr className="text-left">
              <th className="p-3 kicker">#</th>
              <th className="p-3 kicker">Name</th>
              <th className="p-3 kicker">Role / org</th>
              <th className="p-3 kicker">Identity</th>
              <th className="p-3 kicker">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={6} className="p-6 text-muted-foreground">Loading…</td></tr>}
            {data?.length === 0 && <tr><td colSpan={6} className="p-6 text-muted-foreground">No subjects yet.</td></tr>}
            {data?.map((s) => (
              <tr key={s.id} className="border-t border-rule hover:bg-secondary/40">
                <td className="p-3 tabular font-mono text-xs text-muted-foreground">{String(s.subject_number).padStart(4, "0")}</td>
                <td className="p-3 font-serif text-base text-foreground">{s.display_name || <span className="italic text-muted-foreground">Unidentified</span>}</td>
                <td className="p-3 text-xs text-muted-foreground">{[s.role, s.organization].filter(Boolean).join(" · ") || "—"}</td>
                <td className="p-3"><IdentityBadge status={s.identity_status} /></td>
                <td className="p-3">
                  <span className={`text-xs font-mono uppercase tracking-widest ${s.published ? "text-status-verified" : "text-muted-foreground"}`}>
                    {s.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Link to={`/admin/subjects/${s.id}`} className="text-xs font-mono uppercase tracking-widest text-accent hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSubjects;
