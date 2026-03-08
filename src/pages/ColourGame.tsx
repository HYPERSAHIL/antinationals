import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

type Color = 'green' | 'red' | 'violet';

interface GameResult {
  period: number;
  number: number;
  color: Color;
}

const ROUND_DURATION = 30; // seconds
const COLORS: Color[] = ['green', 'red', 'violet'];
const colorMap: Record<Color, string> = {
  green: 'bg-neon-green',
  red: 'bg-neon-red',
  violet: 'bg-neon-violet',
};

const ColourGame = () => {
  const { user, wallet, refreshWallet } = useAuth();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [period, setPeriod] = useState(() => Math.floor(Date.now() / (ROUND_DURATION * 1000)));
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [betPlaced, setBetPlaced] = useState(false);
  const [results, setResults] = useState<GameResult[]>([]);
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const getColorForNumber = (num: number): Color => {
    if (num === 0 || num === 5) return 'violet';
    if (num % 2 === 0) return 'red';
    return 'green';
  };

  const generateResult = useCallback(() => {
    const number = Math.floor(Math.random() * 10);
    const color = getColorForNumber(number);
    const result: GameResult = { period, number, color };
    setLastResult(result);
    setResults((prev) => [result, ...prev].slice(0, 20));
    setShowResult(true);

    // Check win
    if (betPlaced && user) {
      let won = false;
      let multiplier = 0;

      if (selectedColor === color) {
        multiplier = color === 'violet' ? 4.5 : 2;
        won = true;
      }
      if (selectedNumber === number) {
        multiplier = 9;
        won = true;
      }

      if (won) {
        const winnings = betAmount * multiplier;
        toast.success(`🎉 You won ₹${winnings.toFixed(0)}!`);
        // Update wallet
        supabase
          .from('profiles')
          .update({ wallet_balance: wallet + winnings })
          .eq('id', user.id)
          .then(() => refreshWallet());
        // Record bet
        supabase.from('game_history').insert({
          user_id: user.id,
          game_type: 'colour',
          bet_amount: betAmount,
          result_color: color,
          result_number: number,
          prediction_color: selectedColor,
          prediction_number: selectedNumber,
          payout: winnings,
          period_id: period,
        });
      } else {
        toast.error(`You lost ₹${betAmount}. Result: ${color.toUpperCase()} ${number}`);
        supabase.from('game_history').insert({
          user_id: user.id,
          game_type: 'colour',
          bet_amount: betAmount,
          result_color: color,
          result_number: number,
          prediction_color: selectedColor,
          prediction_number: selectedNumber,
          payout: 0,
          period_id: period,
        });
      }
    }

    // Reset for next round
    setTimeout(() => {
      setShowResult(false);
      setBetPlaced(false);
      setSelectedColor(null);
      setSelectedNumber(null);
      setPeriod((p) => p + 1);
      setTimeLeft(ROUND_DURATION);
    }, 3000);
  }, [period, betPlaced, selectedColor, selectedNumber, betAmount, user, wallet, refreshWallet]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          generateResult();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [generateResult]);

  const placeBet = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!selectedColor && selectedNumber === null) {
      toast.error('Select a colour or number');
      return;
    }
    if (betAmount > wallet) {
      toast.error('Insufficient balance');
      return;
    }
    if (timeLeft <= 5) {
      toast.error('Too late! Wait for next round');
      return;
    }

    // Deduct from wallet
    await supabase
      .from('profiles')
      .update({ wallet_balance: wallet - betAmount })
      .eq('id', user.id);
    await refreshWallet();
    setBetPlaced(true);
    toast.success(`Bet placed: ₹${betAmount} on ${selectedColor || `#${selectedNumber}`}`);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen px-4 pb-24 pt-4">
      <div className="mx-auto max-w-lg space-y-4">
        {/* Timer & Period */}
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Period</p>
          <p className="font-display text-lg font-bold text-foreground">{period}</p>
          <div className={`mt-2 font-display text-4xl font-black ${timeLeft <= 5 ? 'text-neon-red animate-countdown' : 'text-primary text-glow-green'}`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          {timeLeft <= 5 && <p className="mt-1 text-xs text-neon-red">Bets closing...</p>}
        </div>

        {/* Result Display */}
        {showResult && lastResult && (
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Result</p>
            <div className={`mx-auto mt-3 flex h-20 w-20 items-center justify-center rounded-full ${colorMap[lastResult.color]} text-3xl font-black font-display`}>
              {lastResult.number}
            </div>
            <p className="mt-2 font-display text-lg font-bold uppercase">{lastResult.color}</p>
          </div>
        )}

        {/* Colour Selection */}
        {!showResult && (
          <>
            <div className="space-y-3">
              <h3 className="font-display text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Select Colour
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {COLORS.map((color) => (
                  <Button
                    key={color}
                    variant={color === 'green' ? 'green' : color === 'red' ? 'red' : 'violet'}
                    className={`h-14 text-base uppercase ${selectedColor === color ? 'ring-2 ring-foreground scale-105' : ''}`}
                    onClick={() => { setSelectedColor(color); setSelectedNumber(null); }}
                    disabled={betPlaced || timeLeft <= 5}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>

            {/* Number Selection */}
            <div className="space-y-3">
              <h3 className="font-display text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Select Number (9x payout)
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedNumber(i); setSelectedColor(null); }}
                    disabled={betPlaced || timeLeft <= 5}
                    className={`flex h-12 items-center justify-center rounded-lg border font-display text-lg font-bold transition-all ${
                      selectedNumber === i
                        ? 'border-primary bg-primary/20 text-primary scale-105'
                        : 'border-border bg-secondary text-foreground hover:border-primary/50'
                    } disabled:opacity-50`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            {/* Bet Amount */}
            <div className="space-y-3">
              <h3 className="font-display text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Bet Amount
              </h3>
              <div className="flex gap-2">
                {[10, 50, 100, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setBetAmount(amt)}
                    className={`flex-1 rounded-lg border py-2 font-display text-sm font-bold transition ${
                      betAmount === amt
                        ? 'border-gold bg-gold/20 text-gold'
                        : 'border-border bg-secondary text-muted-foreground hover:border-gold/50'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Place Bet Button */}
            <Button
              variant="gold"
              className="h-14 w-full text-lg"
              onClick={placeBet}
              disabled={betPlaced || timeLeft <= 5 || (!selectedColor && selectedNumber === null)}
            >
              {betPlaced ? '✓ BET PLACED' : `PLACE BET — ₹${betAmount}`}
            </Button>
          </>
        )}

        {/* Recent Results */}
        <div className="space-y-3">
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Recent Results
          </h3>
          <div className="flex flex-wrap gap-2">
            {results.map((r, i) => (
              <div
                key={i}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${colorMap[r.color]}`}
              >
                {r.number}
              </div>
            ))}
            {results.length === 0 && (
              <p className="text-sm text-muted-foreground">No results yet. Wait for the first round.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColourGame;
