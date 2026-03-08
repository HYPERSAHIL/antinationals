import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Palette, Dice5, Target, TrendingUp } from 'lucide-react';

const games = [
  {
    id: 'colour',
    name: 'Colour Prediction',
    description: 'Predict the winning colour',
    icon: Palette,
    gradient: 'from-neon-green/20 to-neon-red/20',
    border: 'border-neon-green/30',
    available: true,
  },
  {
    id: 'dice',
    name: 'Dice Roll',
    description: 'Predict the dice outcome',
    icon: Dice5,
    gradient: 'from-neon-violet/20 to-gold/20',
    border: 'border-neon-violet/30',
    available: true,
  },
  {
    id: 'aviator',
    name: 'Aviator',
    description: 'Cash out before the crash',
    icon: TrendingUp,
    gradient: 'from-gold/20 to-neon-red/20',
    border: 'border-gold/30',
    available: false,
  },
  {
    id: 'mines',
    name: 'Mines',
    description: 'Avoid the hidden mines',
    icon: Target,
    gradient: 'from-neon-red/20 to-neon-violet/20',
    border: 'border-neon-red/30',
    available: false,
  },
];

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen px-4 pb-24 pt-4">
      <div className="mx-auto max-w-lg space-y-6">
        {/* Welcome Banner */}
        <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-card p-5 glow-green">
          <h2 className="font-display text-xl font-bold tracking-wide">
            {user ? 'Ready to Play?' : 'Welcome to ColorPlay'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {user ? 'Choose a game and start winning!' : 'Sign in to start playing and winning big!'}
          </p>
          {!user && (
            <Link
              to="/auth"
              className="mt-3 inline-block rounded-lg bg-primary px-5 py-2 font-display text-sm font-bold text-primary-foreground transition hover:bg-primary/80"
            >
              GET STARTED
            </Link>
          )}
        </div>

        {/* Games Grid */}
        <div>
          <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Games
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {games.map((game) => {
              const Icon = game.icon;
              const content = (
                <div
                  key={game.id}
                  className={`relative rounded-xl border ${game.border} bg-gradient-to-br ${game.gradient} p-4 transition-all hover:scale-[1.02] ${
                    !game.available ? 'opacity-50' : ''
                  }`}
                >
                  <Icon className="mb-2 h-8 w-8 text-foreground" />
                  <h4 className="font-display text-sm font-bold">{game.name}</h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">{game.description}</p>
                  {!game.available && (
                    <span className="mt-2 inline-block rounded bg-secondary px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                      Coming Soon
                    </span>
                  )}
                </div>
              );
              return game.available ? (
                <Link key={game.id} to={`/games/${game.id}`}>
                  {content}
                </Link>
              ) : (
                <div key={game.id}>{content}</div>
              );
            })}
          </div>
        </div>

        {/* Recent Results Marquee */}
        <div>
          <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Recent Results
          </h3>
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 12 }).map((_, i) => {
              const colors = ['bg-neon-green', 'bg-neon-red', 'bg-neon-violet'];
              const color = colors[Math.floor(Math.random() * 3)];
              return (
                <div
                  key={i}
                  className={`h-8 w-8 flex-shrink-0 rounded-full ${color} flex items-center justify-center text-xs font-bold`}
                >
                  {Math.floor(Math.random() * 10)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
