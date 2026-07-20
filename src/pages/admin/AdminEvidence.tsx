import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VerificationBadge } from "@/components/archive/StatusBadge";

const AdminEvidence = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-evidence"],
    queryFn: async () => {
      const { data } = await (supabase as any).from("evidence").select("*, incident:incidents(title, slug)").order("upload_time", { ascending: false }).limit(500);
      return (data ?? []) as any[];
    },
  });

  return (
    <div>
      <p className="kicker">Evidence</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-foreground">Evidence records</h1>
      <p className="mt-2 text-sm text-muted-foreground">Attach evidence from the incident edit page. All uploads should include an SHA-256 hash.</p>

      <div className="mt-8 rule-top rule-bottom border-x border-rule overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="rule-bottom">
            <tr className="text-left">
              <th className="p-3 kicker">Type</th>
              <th className="p-3 kicker">Title</th>
              <th className="p-3 kicker">Incident</th>
              <th className="p-3 kicker">Verification</th>
              <th className="p-3 kicker">SHA-256</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={5} className="p-6 text-muted-foreground">Loading…</td></tr>}
            {data?.length === 0 && <tr><td colSpan={5} className="p-6 text-muted-foreground">No evidence records yet.</td></tr>}
            {data?.map((e) => (
              <tr key={e.id} className="border-t border-rule hover:bg-secondary/40">
                <td className="p-3 kicker">{e.media_type}</td>
                <td className="p-3">{e.title || <span className="italic text-muted-foreground">Untitled</span>}</td>
                <td className="p-3 text-xs">{e.incident?.title || "—"}</td>
                <td className="p-3"><VerificationBadge status={e.verification_status} /></td>
                <td className="p-3 font-mono text-[10px] text-muted-foreground truncate max-w-[160px]" title={e.sha256 || ""}>{e.sha256 ? `${e.sha256.slice(0, 12)}…` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEvidence;
