import { useState } from 'react';
import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AIChatProvider } from '@/contexts/AIChatContext';
import {
  LayoutDashboard, ClipboardPlus, ListTodo, CheckCircle2, Users, BarChart3, Settings, LogOut, Landmark, Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FloatingChatButton } from '@/components/ai/FloatingChatButton';
import { ChatDrawer } from '@/components/ai/ChatDrawer';

const navItems = [
  { label: 'Dashboard', href: '/politician/dashboard', icon: LayoutDashboard },
  { label: 'Assign Work', href: '/politician/assign', icon: ClipboardPlus },
  { label: 'Active Works', href: '/politician/works', icon: ListTodo },
  { label: 'Approvals', href: '/politician/approvals', icon: CheckCircle2 },
  { label: 'Workers', href: '/politician/workers', icon: Users },
  { label: 'Analytics', href: '/politician/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/politician/settings', icon: Settings },
];

export function PoliticianLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>();
  const isDashboard = location.pathname === '/politician/dashboard';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openChat = (msg?: string) => {
    setChatInitialMessage(msg);
    setChatOpen(true);
  };

  return (
    <AIChatProvider value={{ openChat }}>
      <div className="h-screen flex overflow-hidden bg-background">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-foreground/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-200 lg:translate-x-0 flex-shrink-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <div className="p-5 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#FF9933]/20 flex items-center justify-center border border-[#FF9933]/30">
                <Landmark className="h-5 w-5 text-[#FF9933]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold truncate tracking-tight">Bharat AI</p>
                <p className="text-xs opacity-60 truncate font-medium">{user?.name || 'Admin Panel'}</p>
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
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-sidebar-primary/10 text-sidebar-primary shadow-sm border border-sidebar-primary/20'
                      : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                  )}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0 transition-colors", active ? "text-sidebar-primary" : "")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-sidebar-border mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0 bg-secondary/30">
          <header className="h-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-8 gap-4 shrink-0 z-10">
            <div className="flex items-center gap-4">
              <button className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-muted" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </button>
              <h2 className="text-2xl font-bold tracking-tight text-foreground hidden md:block">
                {navItems.find(i => i.href === location.pathname)?.label || 'Dashboard'}
              </h2>
            </div>
            
            <div className="flex flex-1 items-center justify-end gap-3 md:gap-5">
              <div className="hidden md:flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-xl text-muted-foreground w-64 border border-border/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/70" />
                <kbd className="hidden lg:inline-flex items-center gap-1 rounded bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground border">
                  <span>⌘</span>K
                </kbd>
              </div>
              <button className="relative p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </button>
              <button className="relative p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
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

// Export a hook-like pattern for children to access
export type PoliticianLayoutChildProps = {
  openChat: (msg?: string) => void;
};
