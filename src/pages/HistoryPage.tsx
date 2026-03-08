import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface GameRecord {
  id: string;
  game_type: string;
  bet_amount: number;
  payout: number;
  result_color: string | null;
  result_number: number | null;
  created_at: string;
}

const HistoryPage = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<GameRecord[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('game_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) setHistory(data);
      });
  }, [user]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center pb-20">
        <p className="text-muted-foreground">Please sign in to view history.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pb-24 pt-4">
      <div className="mx-auto max-w-lg space-y-4">
        <h2 className="font-display text-xl font-bold">Game History</h2>

        {history.length === 0 ? (
          <p className="text-muted-foreground text-sm">No games played yet.</p>
        ) : (
          <div className="space-y-2">
            {history.map((h) => {
              const won = h.payout > 0;
              return (
                <div key={h.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                  <div>
                    <p className="font-display text-sm font-bold capitalize">{h.game_type}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(h.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-sm font-bold">₹{h.bet_amount}</p>
                    <p className={`text-xs font-bold ${won ? 'text-neon-green' : 'text-neon-red'}`}>
                      {won ? `+₹${h.payout}` : 'Lost'}
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

export default HistoryPage;
