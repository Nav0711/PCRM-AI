import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ClipboardList, LogOut, Building2, User, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WorkerLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="hero-section text-primary-foreground shrink-0">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center">
              <Building2 className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-bold">Worker Portal</p>
              <p className="text-xs opacity-70">{user?.name} · {user?.ward}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-4 md:py-6 max-w-2xl pb-20 sm:pb-6">
        {children}
      </main>

      {/* Bottom tab bar - mobile optimized */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 border-t bg-card flex shrink-0 z-30 safe-area-bottom">
        <Link
          to="/worker/dashboard"
          className={cn(
            'flex-1 flex flex-col items-center py-3 text-xs gap-0.5',
            location.pathname === '/worker/dashboard' ? 'text-primary font-semibold' : 'text-muted-foreground'
          )}
        >
          <ClipboardList className="h-5 w-5" />
          Tasks
        </Link>
        <Link
          to="/worker/dashboard"
          className={cn(
            'flex-1 flex flex-col items-center py-3 text-xs gap-0.5',
            'text-muted-foreground'
          )}
        >
          <Bell className="h-5 w-5" />
          Updates
        </Link>
        <Link
          to="/worker/dashboard"
          className={cn(
            'flex-1 flex flex-col items-center py-3 text-xs gap-0.5',
            'text-muted-foreground'
          )}
        >
          <User className="h-5 w-5" />
          Profile
        </Link>
      </nav>
    </div>
  );
}
