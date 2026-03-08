import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Gamepad2, History, User, Wallet, LogOut } from 'lucide-react';

const BottomNav = () => {
  const { pathname } = useLocation();
  const { user, signOut, wallet } = useAuth();

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/games/colour', icon: Gamepad2, label: 'Play' },
    { to: '/wallet', icon: Wallet, label: 'Wallet' },
    { to: '/history', icon: History, label: 'History' },
    { to: user ? '/profile' : '/auth', icon: User, label: user ? 'Profile' : 'Login' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
                active ? 'text-primary text-glow-green' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-body">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
