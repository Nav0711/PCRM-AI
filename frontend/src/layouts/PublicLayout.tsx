import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { POLITICIAN } from '@/data/mock';
import { Building2, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Dashboard', href: '/' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Updates', href: '/#updates' },
];

export function PublicLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top banner */}
      <div className="hero-section text-primary-foreground">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
              <Building2 className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">{POLITICIAN.name}</h1>
              <p className="text-xs opacity-80">{POLITICIAN.constituency}</p>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity">
                {l.label}
              </a>
            ))}
            <Link to="/login" className="text-sm font-semibold bg-accent text-accent-foreground px-4 py-1.5 rounded-md hover:opacity-90 transition-opacity">
              Login
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-primary-foreground/20 px-4 py-3 space-y-2">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="block text-sm font-medium opacity-80 hover:opacity-100 py-1" onClick={() => setMenuOpen(false)}>
                {l.label}
              </a>
            ))}
            <Link to="/login" className="block text-sm font-semibold bg-accent text-accent-foreground px-4 py-1.5 rounded-md text-center" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          </div>
        )}
      </div>

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground/70 py-6">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© 2026 {POLITICIAN.constituency} · Transparency Portal</p>
          <p className="mt-1 text-xs opacity-60">Powered by Constituency Work Management System</p>
        </div>
      </footer>
    </div>
  );
}
