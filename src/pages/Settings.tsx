import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { profile as profileApi, type Profile } from '../lib/api';
import { useAuth } from '../lib/auth';

export default function Settings() {
  const { logout } = useAuth();
  const [prof, setProf] = useState<Profile | null>(null);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    profileApi.get().then(p => {
      if (p) {
        setProf(p);
        setUsername(p.username);
        setDisplayName(p.displayName || '');
        setBio(p.bio || '');
      }
    }).catch(() => {}).finally(() => setFetching(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const updated = await profileApi.upsert({
        username: username.toLowerCase().trim(),
        displayName: displayName.trim() || undefined,
        bio: bio.trim() || undefined,
      });
      setProf(updated);
      setSuccess('Profile saved!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="min-h-screen bg-navy flex items-center justify-center text-text-secondary">Loading...</div>;

  return (
    <div className="min-h-screen bg-navy">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-navy-border max-w-3xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <img src="/allrails-logo.png" alt="AllRails" className="h-12" />
          <span className="text-xl font-bold gradient-text">AllRails</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="text-sm text-text-secondary hover:text-white transition">Dashboard</Link>
          <button onClick={logout} className="text-sm text-text-dim hover:text-red-400 transition">Logout</button>
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

        <form onSubmit={handleSave} className="glass rounded-2xl p-6 space-y-4">
          {error && <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">{error}</div>}
          {success && <div className="text-emerald text-sm bg-emerald/10 border border-emerald/20 rounded-lg px-4 py-2">{success}</div>}

          <div>
            <label className="text-sm text-text-secondary mb-1 block">Username</label>
            <div className="flex items-center gap-2">
              <span className="text-text-dim text-sm shrink-0">allrails.app/p/</span>
              <input value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} required
                className="flex-1 px-4 py-3 bg-navy rounded-lg border border-navy-border text-white placeholder-text-dim focus:border-emerald focus:outline-none transition font-mono"
                placeholder="your-name" maxLength={30} minLength={3} />
            </div>
            <p className="text-[11px] text-text-dim mt-1">Lowercase letters, numbers, and hyphens only</p>
          </div>

          <div>
            <label className="text-sm text-text-secondary mb-1 block">Display Name</label>
            <input value={displayName} onChange={e => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 bg-navy rounded-lg border border-navy-border text-white placeholder-text-dim focus:border-emerald focus:outline-none transition"
              placeholder="How your name appears" maxLength={50} />
          </div>

          <div>
            <label className="text-sm text-text-secondary mb-1 block">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
              className="w-full px-4 py-3 bg-navy rounded-lg border border-navy-border text-white placeholder-text-dim focus:border-emerald focus:outline-none transition resize-none"
              placeholder="A short bio for your page" maxLength={200} />
            <p className="text-[11px] text-text-dim mt-1">{bio.length}/200</p>
          </div>

          <button type="submit" disabled={loading}
            className="w-full btn-primary py-3 rounded-lg font-bold text-white disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>

        {/* Preview */}
        {prof && (
          <div className="mt-8">
            <h2 className="text-sm text-text-secondary mb-3">Preview</h2>
            <div className="glass rounded-2xl p-6 text-center max-w-xs mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald/20 flex items-center justify-center text-3xl mx-auto mb-3">
                {displayName ? displayName[0].toUpperCase() : '?'}
              </div>
              <div className="font-bold text-lg">{displayName || 'Your Name'}</div>
              <div className="text-text-secondary text-sm">@{username || 'username'}</div>
              {bio && <div className="text-text-dim text-sm mt-2">{bio}</div>}
              <Link to={`/p/${prof.username}`} className="text-xs text-emerald hover:underline mt-3 inline-block">
                View live page →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
