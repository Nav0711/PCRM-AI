import { useState } from 'react';
import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AIChatProvider } from '@/contexts/AIChatContext';
import {
  LayoutDashboard, ClipboardPlus, ListTodo, CheckCircle2, Users, BarChart3, Settings, LogOut, Building2, Menu,
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
      <div className="min-h-screen flex">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-foreground/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-200 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">Admin Panel</p>
                <p className="text-xs opacity-60 truncate">{user?.name}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map(item => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                    active
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-sidebar-border">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b bg-card flex items-center px-4 gap-4 shrink-0">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-sm font-semibold text-muted-foreground">
              {navItems.find(i => i.href === location.pathname)?.label || 'Dashboard'}
            </h2>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
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
