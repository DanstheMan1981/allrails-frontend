import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../lib/api';
import { useAuth } from '../lib/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await auth.login(email, password);
      login(res.access_token, res.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold gradient-text">AllRails</Link>
          <h1 className="text-2xl font-bold mt-6 mb-2">Welcome back</h1>
          <p className="text-text-secondary text-sm">Log in to manage your payment link</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4">
          {error && <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">{error}</div>}

          <div>
            <label className="text-sm text-text-secondary mb-1 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full px-4 py-3 bg-navy rounded-lg border border-navy-border text-white placeholder-text-dim focus:border-emerald focus:outline-none transition"
              placeholder="you@email.com" />
          </div>
          <div>
            <label className="text-sm text-text-secondary mb-1 block">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full px-4 py-3 bg-navy rounded-lg border border-navy-border text-white placeholder-text-dim focus:border-emerald focus:outline-none transition"
              placeholder="Your password" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full btn-primary py-3 rounded-lg font-bold text-white disabled:opacity-50">
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          <p className="text-center text-text-secondary text-sm">
            Don't have an account? <Link to="/register" className="text-emerald hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
