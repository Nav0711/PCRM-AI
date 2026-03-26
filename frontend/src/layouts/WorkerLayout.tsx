import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AIChatProvider } from '@/contexts/AIChatContext';
import { ClipboardList, ClipboardCheck, UserCog, Menu, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FloatingChatButton } from '@/components/ai/FloatingChatButton';
import { ChatDrawer } from '@/components/ai/ChatDrawer';

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
        <aside className="hidden md:flex w-64 flex-col border-r bg-card/60 backdrop-blur">
          <div className="p-5 border-b">
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
                    active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <item.icon className={cn('h-5 w-5', active ? 'text-primary' : '')} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium w-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="h-16 bg-card/70 backdrop-blur border-b px-4 md:px-8 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <button className="md:hidden p-2 -ml-2 rounded-lg hover:bg-muted" onClick={() => navigate('/worker/dashboard')}>
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-lg md:text-xl font-bold">{navItems.find(i => i.href === location.pathname)?.label || 'Dashboard'}</h1>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="hidden sm:inline">{user?.name}</span>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-secondary/30">
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
