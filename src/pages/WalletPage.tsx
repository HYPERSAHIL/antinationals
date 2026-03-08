import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Plus, Minus } from 'lucide-react';

const WalletPage = () => {
  const { user, wallet, refreshWallet } = useAuth();
  const [amount, setAmount] = useState('');

  const addFunds = async () => {
    if (!user) return;
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) { toast.error('Enter a valid amount'); return; }
    await supabase.from('profiles').update({ wallet_balance: wallet + amt }).eq('id', user.id);
    await refreshWallet();
    setAmount('');
    toast.success(`₹${amt} added to wallet (demo)`);
  };

  const withdraw = async () => {
    if (!user) return;
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0 || amt > wallet) { toast.error('Invalid amount'); return; }
    await supabase.from('profiles').update({ wallet_balance: wallet - amt }).eq('id', user.id);
    await refreshWallet();
    setAmount('');
    toast.success(`₹${amt} withdrawn (demo)`);
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center pb-20">
        <p className="text-muted-foreground">Please sign in to access your wallet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pb-24 pt-4">
      <div className="mx-auto max-w-lg space-y-6">
        <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/10 to-card p-6 text-center glow-gold">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Your Balance</p>
          <p className="mt-2 font-display text-4xl font-black text-gold">₹{wallet.toFixed(0)}</p>
        </div>

        <div className="space-y-3 rounded-xl border border-border bg-card p-5">
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-secondary border-border text-center font-display text-lg"
          />
          <div className="grid grid-cols-2 gap-3">
            <Button variant="green" className="h-12" onClick={addFunds}>
              <Plus className="mr-1 h-4 w-4" /> Deposit
            </Button>
            <Button variant="red" className="h-12" onClick={withdraw}>
              <Minus className="mr-1 h-4 w-4" /> Withdraw
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground">Demo mode — no real money involved</p>
        </div>

        {/* Quick Add */}
        <div className="flex gap-2">
          {[100, 500, 1000, 5000].map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount(String(amt))}
              className="flex-1 rounded-lg border border-border bg-secondary py-2 font-display text-sm font-bold text-muted-foreground transition hover:border-gold/50 hover:text-gold"
            >
              +₹{amt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
