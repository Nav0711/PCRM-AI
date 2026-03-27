import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Landmark, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setLoadingMessage('Connecting to server...');
    
    try {
      const success = await login(username, password);
      if (success) {
        setLoadingMessage('Login successful, redirecting...');
        setTimeout(() => navigate('/politician/dashboard'), 500);
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(errorMsg);
      console.error('Login error:', errorMsg);
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar relative overflow-hidden flex-col justify-between p-12">
        {/* Saffron glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FF9933]/15 blur-[100px]" />
        {/* Green glow */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#138808]/10 blur-[100px]" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="h-12 w-12 rounded-xl bg-[#FF9933]/20 flex items-center justify-center border border-[#FF9933]/30">
              <Landmark className="h-6 w-6 text-[#FF9933]" />
            </div>
            <div>
              <p className="text-lg font-bold text-white tracking-tight">PSRM-AI</p>
              <p className="text-xs text-white/50 font-medium">Constituency Portal</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white leading-tight tracking-tight mb-4">
            Serve Your<br />
            <span className="bg-gradient-to-r from-[#FF9933] via-white/90 to-[#138808] bg-clip-text text-transparent">
              Constituency Better
            </span>
          </h2>
          <p className="text-white/50 text-base max-w-sm leading-relaxed">
            AI-powered complaint management, real-time analytics, and automated briefings for your representative office.
          </p>
        </div>

        <div className="relative z-10">
          <div className="h-1 w-32 rounded-full bg-gradient-to-r from-[#FF9933] via-white/30 to-[#138808] mb-4" />
          <p className="text-xs text-white/40">जय हिन्द 🇮🇳 — Built for Digital India</p>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Back to home */}
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Portal
          </Link>

          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Landmark className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">PSRM-AI</p>
              <p className="text-xs text-muted-foreground font-medium">Constituency Portal</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-1 text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground mb-8">Sign in to manage constituency work</p>

          {/* Demo Credentials */}
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 mb-6">
            <p className="text-xs font-semibold text-primary mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Demo Credentials
            </p>
            
            <div className="space-y-2">
              <div className="bg-card rounded-xl p-3 border border-border/50">
                <p className="text-xs font-medium text-foreground">Politician</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  <span className="font-mono text-foreground/80">rajesh@example.com</span> / <span className="font-mono text-foreground/80">password</span>
                </p>
              </div>
              <div className="bg-card rounded-xl p-3 border border-border/50">
                <p className="text-xs font-medium text-foreground">Worker</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  <span className="font-mono text-foreground/80">amit@example.com</span> / <span className="font-mono text-foreground/80">password</span>
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Phone or Email</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your phone number or email"
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 rounded-xl p-3">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {loading && loadingMessage && (
              <div className="flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-xl p-3">
                <Loader2 className="h-4 w-4 text-primary animate-spin" />
                <p className="text-sm text-primary">{loadingMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            PSRM-AI — Public Smart Relation Management System with AI 🇮🇳
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
