import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { auth } from '../lib/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (!token) {
      setError('Missing reset token. Please use the link from your email.');
      return;
    }

    setLoading(true);
    try {
      await auth.resetPassword(token, password);
      setSuccess(true);
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
          <h1 className="text-2xl font-bold mt-6 mb-2">Set new password</h1>
          <p className="text-text-secondary text-sm">Enter your new password below</p>
        </div>

        <div className="glass rounded-2xl p-6">
          {success ? (
            <div className="text-center space-y-4">
              <div className="text-emerald text-4xl">✅</div>
              <p className="text-white font-semibold">Password reset successfully!</p>
              <p className="text-text-secondary text-sm">You can now log in with your new password.</p>
              <Link
                to="/login"
                className="inline-block mt-4 btn-primary px-6 py-3 rounded-lg font-bold text-white"
              >
                Go to Login
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
                <label className="text-sm text-text-secondary mb-1 block">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 bg-navy rounded-lg border border-navy-border text-white placeholder-text-dim focus:border-emerald focus:outline-none transition"
                  placeholder="Minimum 8 characters"
                />
              </div>

              <div>
                <label className="text-sm text-text-secondary mb-1 block">Confirm Password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 bg-navy rounded-lg border border-navy-border text-white placeholder-text-dim focus:border-emerald focus:outline-none transition"
                  placeholder="Type it again"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 rounded-lg font-bold text-white disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>

              <p className="text-center text-text-secondary text-sm">
                <Link to="/login" className="text-emerald hover:underline">← Back to login</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
