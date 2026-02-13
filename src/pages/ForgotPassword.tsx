import { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await auth.forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img src="/allrails-logo.png" alt="AllRails" className="h-[160px] mx-auto" />
          </Link>
          <h1 className="text-2xl font-bold mt-6 mb-2">Reset your password</h1>
          <p className="text-text-secondary text-sm">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <div className="glass rounded-2xl p-6">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="text-emerald text-4xl">✉️</div>
              <p className="text-white">
                If an account exists for <span className="text-emerald font-semibold">{email}</span>,
                you'll receive a reset link shortly.
              </p>
              <p className="text-text-secondary text-sm">Check your inbox and spam folder.</p>
              <Link to="/login" className="inline-block mt-4 text-emerald hover:underline text-sm">
                ← Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
                  {error}
                </div>
              )}

              <div>
                <label className="text-sm text-text-secondary mb-1 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-navy rounded-lg border border-navy-border text-white placeholder-text-dim focus:border-emerald focus:outline-none transition"
                  placeholder="you@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 rounded-lg font-bold text-white disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <p className="text-center text-text-secondary text-sm">
                Remember your password?{' '}
                <Link to="/login" className="text-emerald hover:underline">Log in</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
