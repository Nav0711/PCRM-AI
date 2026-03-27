import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { POLITICIAN } from '@/data/mock';
import { Menu, X, Landmark } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Updates', href: '/#updates' },
];

export function PublicLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Tricolour bar at top */}
      <div className="tricolour-bar w-full" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Landmark className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight tracking-tight text-foreground">PSRM-AI</h1>
              <p className="text-xs text-muted-foreground font-medium">Public Smart Relation Management System</p>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                {l.label}
              </a>
            ))}
            <ThemeToggle />
            <Link to="/login" className="text-sm font-semibold bg-primary text-primary-foreground px-5 py-2 rounded-xl hover:bg-primary/90 transition-all shadow-sm hover:shadow-md">
              Login
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button className="p-2 rounded-lg hover:bg-muted transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-border/50 px-4 py-4 space-y-2 bg-background animate-fade-in">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="block text-sm font-medium text-muted-foreground hover:text-primary py-2 transition-colors" onClick={() => setMenuOpen(false)}>
                {l.label}
              </a>
            ))}
            <Link to="/login" className="block text-sm font-semibold bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-center mt-2" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-sidebar text-sidebar-foreground/80">
        {/* Tricolour bar above footer */}
        <div className="tricolour-bar w-full" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-sidebar-primary/20 flex items-center justify-center">
                <Landmark className="h-4 w-4 text-sidebar-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Public Smart Relation Management System</p>
                <p className="text-xs opacity-60">PSRM-AI</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs font-medium opacity-60">
              <span>जय हिन्द 🇮🇳</span>
              <span>© 2026</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
