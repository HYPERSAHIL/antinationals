import { Outlet, NavLink, Navigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { SEO } from "@/components/site/SEO";
import { LayoutDashboard, Users, FileText, Camera, MessageSquare, AlertCircle, LogOut, ExternalLink } from "lucide-react";

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/subjects", label: "Subjects", icon: Users },
  { to: "/admin/incidents", label: "Incidents", icon: FileText },
  { to: "/admin/evidence", label: "Evidence", icon: Camera },
  { to: "/admin/corrections", label: "Corrections", icon: AlertCircle },
  { to: "/admin/replies", label: "Replies", icon: MessageSquare },
];

const AdminLayout = () => {
  const { user, isAdmin, loading, signOut } = useAuth();

  if (loading) return <div className="p-16 text-sm text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <p className="kicker">Access denied</p>
          <h1 className="mt-2 font-serif text-3xl">Editorial access only</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Your account does not have admin privileges. Contact an editor to request access.
          </p>
          <Link to="/" className="mt-6 inline-block text-xs font-mono uppercase tracking-widest text-accent hover:underline">
            Return to archive
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Admin" description="AntiNationals editorial workspace." path="/admin" />
      <div className="flex flex-col lg:flex-row">
        <aside className="lg:w-60 lg:min-h-screen lg:border-r lg:border-rule flex flex-col">
          <div className="p-6 rule-bottom">
            <Link to="/" className="font-serif text-lg font-bold text-foreground">AntiNationals</Link>
            <p className="kicker mt-1">Editorial workspace</p>
          </div>
          <nav className="flex-1 p-3 flex lg:flex-col gap-1 overflow-x-auto">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-sm px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                    isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`
                }>
                <n.icon className="h-4 w-4" />
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 rule-top text-xs">
            <p className="truncate text-muted-foreground">{user.email}</p>
            <div className="mt-3 flex gap-3">
              <Link to="/" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                <ExternalLink className="h-3 w-3" /> Public
              </Link>
              <button onClick={signOut} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                <LogOut className="h-3 w-3" /> Sign out
              </button>
            </div>
          </div>
        </aside>
        <main className="flex-1 p-6 lg:p-10 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
