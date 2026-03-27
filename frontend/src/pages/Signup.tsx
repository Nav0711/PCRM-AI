import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Landmark, Loader2, AlertCircle, User, ShieldCheck, Menu, X } from 'lucide-react';
import { motion, useMotionValue, useMotionTemplate, useAnimationFrame } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';

const GridPattern = ({ offsetX, offsetY }: { offsetX: any; offsetY: any }) => {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id="grid-pattern-signup"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground dark:text-muted-foreground/40" 
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern-signup)" />
    </svg>
  );
};

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    aadhaar: '',
    role: 'worker',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  useAnimationFrame(() => {
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    gridOffsetX.set((currentX + 0.5) % 40);
    gridOffsetY.set((currentY + 0.5) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccessMsg('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      if (!successMsg) setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Tricolour bar at top */}
      <div className="tricolour-bar w-full" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Landmark className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight tracking-tight text-foreground">PSRM-AI</h1>
              <p className="text-xs text-muted-foreground font-medium">Public Smart Relation Management System</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a href="/#projects" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Projects
            </a>
            <ThemeToggle />
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
            <a href="/" className="block text-sm font-medium text-muted-foreground hover:text-primary py-2 transition-colors" onClick={() => setMenuOpen(false)}>
              Home
            </a>
            <a href="/#projects" className="block text-sm font-medium text-muted-foreground hover:text-primary py-2 transition-colors" onClick={() => setMenuOpen(false)}>
              Projects
            </a>
          </div>
        )}
      </header>

      {/* Main content - fullscreen grid background */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="flex-1 relative overflow-hidden flex items-center justify-center p-6"
      >
        {/* Static grid background layer */}
        <div className="absolute inset-0 z-0 opacity-[0.05] dark:opacity-[0.08] pointer-events-none">
          <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
        </div>

        {/* Interactive grid with mouse mask */}
        <motion.div 
          className="absolute inset-0 z-0 opacity-40 dark:opacity-30 pointer-events-none"
          style={{ maskImage, WebkitMaskImage: maskImage }}
        >
          <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
        </motion.div>

        {/* Decorative gradient orbs */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Saffron glow (top-right) */}
          <div className="absolute right-[-10%] top-[-10%] w-[30%] h-[30%] rounded-full bg-orange-500/30 dark:bg-orange-600/15 blur-[120px]" />
          
          {/* Blue glow (primary) */}
          <div className="absolute right-[15%] top-[5%] w-[25%] h-[25%] rounded-full bg-blue-500/30 dark:bg-blue-600/15 blur-[100px]" />
          
          {/* Green glow (bottom-left) */}
          <div className="absolute left-[-5%] bottom-[-15%] w-[30%] h-[30%] rounded-full bg-green-500/25 dark:bg-green-600/10 blur-[120px]" />
        </div>

        {/* Signup form card - centered with max-height for scrolling */}
        <div className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="bg-card rounded-2xl border border-border/70 shadow-lg p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Landmark className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold tracking-tight text-foreground">PSRM-AI</p>
                <p className="text-xs text-muted-foreground font-medium">Create Account</p>
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-1 text-foreground">Create an Account</h1>
            <p className="text-sm text-muted-foreground mb-8">Register to start managing constituency work</p>


            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Aadhaar Number</label>
                  <input
                    type="text"
                    name="aadhaar"
                    value={formData.aadhaar}
                    onChange={handleChange}
                    placeholder="1234 5678 9012"
                    className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Designation / Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.role === 'worker' ? 'bg-primary/5 border-primary ring-1 ring-primary/20' : 'bg-background hover:bg-muted/50'}`}>
                    <input
                      type="radio"
                      name="role"
                      value="worker"
                      checked={formData.role === 'worker'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <User className={`h-5 w-5 ${formData.role === 'worker' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div>
                      <p className="text-sm font-semibold">Worker</p>
                      <p className="text-xs text-muted-foreground">Field agent</p>
                    </div>
                  </label>
                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.role === 'politician' ? 'bg-primary/5 border-primary ring-1 ring-primary/20' : 'bg-background hover:bg-muted/50'}`}>
                    <input
                      type="radio"
                      name="role"
                      value="politician"
                      checked={formData.role === 'politician'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <ShieldCheck className={`h-5 w-5 ${formData.role === 'politician' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div>
                      <p className="text-sm font-semibold">Politician</p>
                      <p className="text-xs text-muted-foreground">MLA / MP</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  required
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 rounded-xl p-3">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {successMsg && (
                <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-emerald-600 font-medium">{successMsg}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !!successMsg}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 mt-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? 'Registering...' : 'Complete Registration'}
              </button>
              
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary font-semibold hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-8">
              PSRM-AI — Secure & Authorized Access Only 🇮🇳
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
