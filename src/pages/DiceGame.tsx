import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Dice5 } from 'lucide-react';

const DiceGame = () => {
  const { user, wallet, refreshWallet } = useAuth();
  const navigate = useNavigate();
  const [selectedBet, setSelectedBet] = useState<'high' | 'low' | 'exact' | null>(null);
  const [exactNumber, setExactNumber] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [results, setResults] = useState<number[]>([]);

  const rollDice = useCallback(async () => {
    if (!user) { navigate('/auth'); return; }
    if (!selectedBet) { toast.error('Select a bet type'); return; }
    if (selectedBet === 'exact' && exactNumber === null) { toast.error('Pick a number'); return; }
    if (betAmount > wallet) { toast.error('Insufficient balance'); return; }

    // Deduct
    await supabase.from('profiles').update({ wallet_balance: wallet - betAmount }).eq('id', user.id);
    await refreshWallet();

    setRolling(true);
    setResult(null);

    setTimeout(async () => {
      const diceResult = Math.floor(Math.random() * 6) + 1;
      setResult(diceResult);
      setResults((prev) => [diceResult, ...prev].slice(0, 20));
      setRolling(false);

      let won = false;
      let multiplier = 0;

      if (selectedBet === 'high' && diceResult >= 4) { won = true; multiplier = 2; }
      if (selectedBet === 'low' && diceResult <= 3) { won = true; multiplier = 2; }
      if (selectedBet === 'exact' && diceResult === exactNumber) { won = true; multiplier = 5; }

      if (won) {
        const winnings = betAmount * multiplier;
        toast.success(`🎲 You won ₹${winnings}!`);
        await supabase.from('profiles').update({ wallet_balance: wallet - betAmount + winnings }).eq('id', user.id);
        await refreshWallet();
        await supabase.from('game_history').insert({
          user_id: user.id, game_type: 'dice', bet_amount: betAmount,
          result_number: diceResult, prediction_number: exactNumber,
          prediction_color: selectedBet, payout: winnings, period_id: Date.now(),
        });
      } else {
        toast.error(`Lost! Dice: ${diceResult}`);
        await supabase.from('game_history').insert({
          user_id: user.id, game_type: 'dice', bet_amount: betAmount,
          result_number: diceResult, prediction_number: exactNumber,
          prediction_color: selectedBet, payout: 0, period_id: Date.now(),
        });
      }
    }, 1500);
  }, [user, selectedBet, exactNumber, betAmount, wallet, refreshWallet, navigate]);

  return (
    <div className="min-h-screen px-4 pb-24 pt-4">
      <div className="mx-auto max-w-lg space-y-4">
        <h2 className="font-display text-xl font-bold text-center">🎲 Dice Roll</h2>

        {/* Dice Display */}
        <div className="flex items-center justify-center rounded-xl border border-border bg-card p-8">
          <div className={`flex h-24 w-24 items-center justify-center rounded-2xl bg-secondary font-display text-5xl font-black ${rolling ? 'animate-spin' : ''}`}>
            {rolling ? '?' : result ?? <Dice5 className="h-16 w-16 text-muted-foreground" />}
          </div>
        </div>

        {/* Bet Type */}
        <div className="space-y-3">
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-muted-foreground">Bet Type</h3>
          <div className="grid grid-cols-3 gap-3">
            {([['low', 'Low (1-3)', 'green'], ['high', 'High (4-6)', 'red'], ['exact', 'Exact (5x)', 'violet']] as const).map(([type, label, variant]) => (
              <Button
                key={type}
                variant={variant}
                className={`h-12 text-xs ${selectedBet === type ? 'ring-2 ring-foreground scale-105' : ''}`}
                onClick={() => { setSelectedBet(type); if (type !== 'exact') setExactNumber(null); }}
                disabled={rolling}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {selectedBet === 'exact' && (
          <div className="grid grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                onClick={() => setExactNumber(n)}
                className={`flex h-12 items-center justify-center rounded-lg border font-display text-lg font-bold transition ${
                  exactNumber === n ? 'border-primary bg-primary/20 text-primary' : 'border-border bg-secondary text-foreground hover:border-primary/50'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        )}

        {/* Bet Amount */}
        <div className="flex gap-2">
          {[10, 50, 100, 500, 1000].map((amt) => (
            <button
              key={amt}
              onClick={() => setBetAmount(amt)}
              className={`flex-1 rounded-lg border py-2 font-display text-sm font-bold transition ${
                betAmount === amt ? 'border-gold bg-gold/20 text-gold' : 'border-border bg-secondary text-muted-foreground'
              }`}
            >
              ₹{amt}
            </button>
          ))}
        </div>

        <Button variant="gold" className="h-14 w-full text-lg" onClick={rollDice} disabled={rolling}>
          {rolling ? 'ROLLING...' : `ROLL — ₹${betAmount}`}
        </Button>

        {/* History */}
        <div className="flex flex-wrap gap-2">
          {results.map((r, i) => (
            <div key={i} className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-display text-sm font-bold">
              {r}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiceGame;
