import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AIChatProvider } from '@/contexts/AIChatContext';
import { ClipboardList, ClipboardCheck, UserCog, Menu, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FloatingChatButton } from '@/components/ai/FloatingChatButton';
import { ChatDrawer } from '@/components/ai/ChatDrawer';
import { ThemeToggle } from '@/components/ThemeToggle';

export function WorkerLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>();
  const isDashboard = location.pathname === '/worker/dashboard';

  const navItems = [
    { label: 'Dashboard', href: '/worker/dashboard', icon: ClipboardList },
    { label: 'Assigned Work', href: '/worker/assigned', icon: ClipboardCheck },
    { label: 'Settings', href: '/worker/settings', icon: UserCog },
  ];

  const openChat = (msg?: string) => {
    setChatInitialMessage(msg);
    setChatOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AIChatProvider value={{ openChat }}>
      <div className="h-screen flex overflow-hidden bg-background">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground relative z-10">
          <div className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                <ClipboardList className="h-6 w-6 text-accent-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold tracking-tight">Worker Portal</p>
                <p className="text-xs opacity-80 font-medium truncate">{user?.name}</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
            {navItems.map(item => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                    active ? 'bg-sidebar-primary/10 text-sidebar-primary border border-sidebar-primary/20' : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                  )}
                >
                  <item.icon className={cn('h-5 w-5', active ? 'text-sidebar-primary' : '')} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 mt-auto">
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="h-14 sm:h-16 bg-transparent px-3 sm:px-4 md:px-8 flex items-center justify-between gap-3 shrink-0 pt-2 sm:pt-4 z-10">
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="md:hidden p-1.5 sm:p-2 -ml-1 sm:-ml-2 rounded-lg hover:bg-muted" onClick={() => navigate('/worker/dashboard')}>
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-base sm:text-lg md:text-xl font-bold">{navItems.find(i => i.href === location.pathname)?.label || 'Dashboard'}</h1>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <ThemeToggle />
              <span className="hidden sm:inline">{user?.name}</span>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8 bg-background pt-2 md:pt-4">
            {children}
          </main>
        </div>

        {!isDashboard && <FloatingChatButton onClick={() => openChat()} />}
        <ChatDrawer
          open={chatOpen}
          onClose={() => { setChatOpen(false); setChatInitialMessage(undefined); }}
          initialMessage={chatInitialMessage}
        />
      </div>
    </AIChatProvider>
  );
}
