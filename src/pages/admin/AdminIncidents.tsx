import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { VerificationBadge } from "@/components/archive/StatusBadge";
import { formatDateShort } from "@/lib/format";
import { Plus } from "lucide-react";

const AdminIncidents = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-incidents"],
    queryFn: async () => {
      const { data } = await (supabase as any).from("incidents").select("*").order("updated_at", { ascending: false }).limit(500);
      return (data ?? []) as any[];
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="kicker">Incidents</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-foreground">All incidents</h1>
        </div>
        <Link to="/admin/incidents/new" className="inline-flex items-center gap-2 border border-foreground bg-foreground px-4 py-2 text-sm text-background hover:bg-transparent hover:text-foreground transition-colors">
          <Plus className="h-4 w-4" /> New incident
        </Link>
      </div>

      <div className="mt-8 rule-top rule-bottom border-x border-rule overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="rule-bottom">
            <tr className="text-left">
              <th className="p-3 kicker">Date</th>
              <th className="p-3 kicker">Title</th>
              <th className="p-3 kicker">Verification</th>
              <th className="p-3 kicker">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={5} className="p-6 text-muted-foreground">Loading…</td></tr>}
            {data?.length === 0 && <tr><td colSpan={5} className="p-6 text-muted-foreground">No incidents yet.</td></tr>}
            {data?.map((i) => (
              <tr key={i.id} className="border-t border-rule hover:bg-secondary/40">
                <td className="p-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{formatDateShort(i.incident_date)}</td>
                <td className="p-3 font-serif text-base text-foreground">{i.title}</td>
                <td className="p-3"><VerificationBadge status={i.verification_status} /></td>
                <td className="p-3">
                  <span className={`text-xs font-mono uppercase tracking-widest ${i.published ? "text-status-verified" : "text-muted-foreground"}`}>
                    {i.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Link to={`/admin/incidents/${i.id}`} className="text-xs font-mono uppercase tracking-widest text-accent hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminIncidents;
