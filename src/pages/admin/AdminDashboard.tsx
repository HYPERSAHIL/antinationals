import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Users, FileText, Camera, AlertCircle, MessageSquare, ArrowRight } from "lucide-react";

const AdminDashboard = () => {
  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await supabase.rpc("get_admin_dashboard_stats");
      return (data as any) ?? {};
    },
  });

  const cards = [
    { label: "Subjects", value: data?.total_subjects ?? 0, icon: Users, to: "/admin/subjects" },
    { label: "Incidents", value: data?.total_incidents ?? 0, icon: FileText, to: "/admin/incidents" },
    { label: "Evidence records", value: data?.total_evidence ?? 0, icon: Camera, to: "/admin/evidence" },
    { label: "Pending corrections", value: data?.pending_corrections ?? 0, icon: AlertCircle, to: "/admin/corrections" },
    { label: "Pending replies", value: data?.pending_replies ?? 0, icon: MessageSquare, to: "/admin/replies" },
    { label: "Published incidents", value: data?.published_incidents ?? 0, icon: FileText, to: "/admin/incidents" },
  ];

  return (
    <div>
      <p className="kicker">Overview</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-foreground">Editorial workspace</h1>
      <p className="mt-2 text-sm text-muted-foreground">Everything in the archive at a glance. Pending items need attention.</p>

      <div className="mt-8 grid gap-px bg-rule border border-rule sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="group bg-background p-6 hover:bg-secondary/40 transition-colors">
            <div className="flex items-center justify-between">
              <c.icon className="h-4 w-4 text-muted-foreground" />
              <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="mt-4 font-serif text-4xl tabular font-semibold text-foreground">{Number(c.value).toLocaleString()}</p>
            <p className="mt-1 text-xs text-muted-foreground">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link to="/admin/subjects/new" className="rule-top rule-bottom border-x border-rule p-5 hover:bg-secondary/40 transition-colors">
          <p className="kicker">Create</p>
          <p className="mt-1 font-serif text-lg text-foreground">New subject</p>
        </Link>
        <Link to="/admin/incidents/new" className="rule-top rule-bottom border-x border-rule p-5 hover:bg-secondary/40 transition-colors">
          <p className="kicker">Create</p>
          <p className="mt-1 font-serif text-lg text-foreground">New incident</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
