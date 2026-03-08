import { useAuth } from '@/contexts/AuthContext';
import { Wallet } from 'lucide-react';

const TopBar = () => {
  const { user, wallet } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <h1 className="font-display text-lg font-bold tracking-wider text-primary text-glow-green">
          COLOR<span className="text-foreground">PLAY</span>
        </h1>
        {user && (
          <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5">
            <Wallet className="h-4 w-4 text-gold" />
            <span className="font-display text-sm font-bold text-gold">₹{wallet.toFixed(0)}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
