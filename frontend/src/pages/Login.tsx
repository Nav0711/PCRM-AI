import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Building2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const Login = () => {
  const [role, setRole] = useState<UserRole>('politician');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await login(email, password, role);
      if (success) {
        navigate(role === 'politician' ? '/politician/dashboard' : '/worker/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Constituency Work Portal</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage constituency work</p>
        </div>

        <div className="stat-card">
          {/* Role selector */}
          <div className="flex rounded-lg bg-secondary p-1 mb-6">
            {(['politician', 'worker'] as UserRole[]).map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={cn(
                  'flex-1 py-2 text-sm font-medium rounded-md transition-colors capitalize',
                  role === r ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email or Phone</label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email or phone"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign In as {role === 'politician' ? 'Politician' : 'Worker'}
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Demo: Enter any credentials to log in
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
