import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, DollarSign, Gamepad2, TrendingUp, TrendingDown } from 'lucide-react';

interface AdminStats {
  total_users: number;
  total_bets: number;
  total_wagered: number;
  total_payouts: number;
  total_wallet_balance: number;
}

interface UserProfile {
  id: string;
  display_name: string | null;
  wallet_balance: number;
  created_at: string;
}

interface GameRecord {
  id: string;
  user_id: string;
  game_type: string;
  bet_amount: number;
  payout: number;
  result_color: string | null;
  result_number: number | null;
  created_at: string;
}

const StatCard = ({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string; sub?: string; color: string }) => (
  <div className={`rounded-xl border border-border bg-card p-4 ${color}`}>
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="h-4 w-4" />
      <span className="text-xs font-semibold uppercase tracking-widest">{label}</span>
    </div>
    <p className="mt-2 font-display text-2xl font-black">{value}</p>
    {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [recentGames, setRecentGames] = useState<GameRecord[]>([]);
  const [tab, setTab] = useState<'overview' | 'users' | 'games'>('overview');

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }

    const checkAdmin = async () => {
      const { data } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' });
      if (!data) {
        navigate('/');
        return;
      }
      setIsAdmin(true);
      setLoading(false);

      // Fetch stats
      const { data: statsData } = await supabase.rpc('get_admin_stats');
      if (statsData) setStats(statsData as unknown as AdminStats);

      // Fetch users
      const { data: usersData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (usersData) setUsers(usersData);

      // Fetch recent games
      const { data: gamesData } = await supabase.from('game_history').select('*').order('created_at', { ascending: false }).limit(100);
      if (gamesData) setRecentGames(gamesData);
    };

    checkAdmin();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pb-20">
        <p className="text-muted-foreground">Checking permissions...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  const profit = stats ? stats.total_wagered - stats.total_payouts : 0;

  return (
    <div className="min-h-screen px-4 pb-24 pt-4">
      <div className="mx-auto max-w-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-gold" />
          <h2 className="font-display text-xl font-bold">Admin Dashboard</h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg bg-secondary p-1">
          {(['overview', 'users', 'games'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-md py-2 font-display text-xs font-bold uppercase tracking-wider transition ${
                tab === t ? 'bg-card text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && stats && (
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={Users} label="Total Users" value={String(stats.total_users)} color="" />
            <StatCard icon={Gamepad2} label="Total Bets" value={String(stats.total_bets)} color="" />
            <StatCard icon={DollarSign} label="Total Wagered" value={`₹${Number(stats.total_wagered).toLocaleString()}`} color="" />
            <StatCard icon={DollarSign} label="Total Payouts" value={`₹${Number(stats.total_payouts).toLocaleString()}`} color="" />
            <StatCard
              icon={profit >= 0 ? TrendingUp : TrendingDown}
              label="House Profit"
              value={`₹${Math.abs(profit).toLocaleString()}`}
              sub={profit >= 0 ? 'Profit' : 'Loss'}
              color={profit >= 0 ? 'border-neon-green/30' : 'border-neon-red/30'}
            />
            <StatCard icon={DollarSign} label="User Balances" value={`₹${Number(stats.total_wallet_balance).toLocaleString()}`} color="border-gold/30" />
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">{users.length} users</p>
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                <div>
                  <p className="font-display text-sm font-bold">{u.display_name || 'Anonymous'}</p>
                  <p className="text-xs text-muted-foreground">Joined {new Date(u.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-sm font-bold text-gold">₹{Number(u.wallet_balance).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Games Tab */}
        {tab === 'games' && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">{recentGames.length} recent games</p>
            {recentGames.map((g) => {
              const won = g.payout > 0;
              return (
                <div key={g.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                  <div>
                    <p className="font-display text-sm font-bold capitalize">{g.game_type}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(g.created_at).toLocaleString()} · User: {g.user_id.slice(0, 8)}…
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-sm font-bold">₹{g.bet_amount}</p>
                    <p className={`text-xs font-bold ${won ? 'text-neon-green' : 'text-neon-red'}`}>
                      {won ? `+₹${g.payout}` : 'Lost'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
