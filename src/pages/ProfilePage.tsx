import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { LogOut, Shield } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, wallet, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' }).then(({ data }) => {
      if (data) setIsAdmin(true);
    });
  }, [user]);

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen px-4 pb-24 pt-4">
      <div className="mx-auto max-w-lg space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 font-display text-2xl font-bold text-primary">
            {user.user_metadata?.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
          </div>
          <h2 className="mt-3 font-display text-lg font-bold">
            {user.user_metadata?.display_name || 'Player'}
          </h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <p className="mt-2 font-display text-2xl font-black text-gold">₹{wallet.toFixed(0)}</p>
        </div>

        {isAdmin && (
          <Link to="/admin">
            <Button variant="gold" className="w-full">
              <Shield className="mr-2 h-4 w-4" /> Admin Dashboard
            </Button>
          </Link>
        )}

        <Button
          variant="destructive"
          className="w-full"
          onClick={async () => {
            await signOut();
            navigate('/');
          }}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
