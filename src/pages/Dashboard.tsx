import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { profile as profileApi, paymentMethods as pmApi, type Profile, type PaymentMethod } from '../lib/api';
import { useAuth } from '../lib/auth';
import { getPaymentConfig, PAYMENT_TYPE_OPTIONS } from '../lib/payment-types';

export default function Dashboard() {
  const { logout } = useAuth();
  const [prof, setProf] = useState<Profile | null>(null);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [addType, setAddType] = useState('venmo');
  const [addHandle, setAddHandle] = useState('');
  const [addLabel, setAddLabel] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editType, setEditType] = useState('');
  const [editLabel, setEditLabel] = useState('');
  const [editHandle, setEditHandle] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [p, m] = await Promise.all([profileApi.get(), pmApi.list()]);
      setProf(p);
      setMethods(m);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const shareLink = prof ? `${window.location.origin}/p/${prof.username}` : null;

  const handleShare = async () => {
    if (!shareLink) return;
    if (navigator.share) {
      try { await navigator.share({ title: 'Pay me with AllRails', url: shareLink }); return; } catch {}
    }
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addHandle.trim()) return;
    await pmApi.create({ type: addType, handle: addHandle.trim(), label: addLabel.trim() || undefined });
    setAddHandle(''); setAddLabel(''); setShowAdd(false);
    fetchData();
  };

  const handleToggle = async (m: PaymentMethod) => {
    await pmApi.update(m.id, { active: !m.active });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    await pmApi.delete(id);
    fetchData();
  };

  const handleMoveUp = async (idx: number) => {
    if (idx === 0) return;
    const newOrder = [...methods];
    [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
    await pmApi.reorder(newOrder.map((m, i) => ({ id: m.id, sortOrder: i })));
    fetchData();
  };

  const handleMoveDown = async (idx: number) => {
    if (idx === methods.length - 1) return;
    const newOrder = [...methods];
    [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];
    await pmApi.reorder(newOrder.map((m, i) => ({ id: m.id, sortOrder: i })));
    fetchData();
  };

  const startEdit = (m: PaymentMethod) => {
    setEditingId(m.id);
    setEditType(m.type);
    setEditLabel(m.label || '');
    setEditHandle(m.handle);
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id: string) => {
    if (!editHandle.trim()) return;
    await pmApi.update(id, { type: editType, label: editLabel.trim() || null, handle: editHandle.trim() });
    setEditingId(null);
    fetchData();
  };

  if (loading) return <div className="min-h-screen bg-navy flex items-center justify-center text-text-secondary">Loading...</div>;

  return (
    <div className="min-h-screen bg-navy">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-navy-border max-w-3xl mx-auto">
        <Link to="/" className="text-xl font-bold gradient-text">AllRails</Link>
        <div className="flex items-center gap-3">
          <Link to="/settings" className="text-sm text-text-secondary hover:text-white transition">Settings</Link>
          <button onClick={logout} className="text-sm text-text-dim hover:text-red-400 transition">Logout</button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Profile setup prompt */}
        {!prof && (
          <div className="glass rounded-2xl p-6 mb-6 text-center">
            <div className="text-3xl mb-3">👋</div>
            <h2 className="text-xl font-bold mb-2">Set up your profile</h2>
            <p className="text-text-secondary text-sm mb-4">Choose a username to get your payment link</p>
            <Link to="/settings" className="btn-primary px-6 py-2.5 rounded-lg font-semibold text-white inline-block">
              Set Up Profile
            </Link>
          </div>
        )}

        {/* Share Link */}
        {prof && (
          <div className="glass rounded-2xl p-6 mb-6">
            <div className="text-sm text-text-secondary mb-2">Your AllRails Link</div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-navy rounded-lg px-4 py-3 font-mono text-emerald text-sm truncate border border-navy-border">
                {shareLink}
              </div>
              <button onClick={handleShare} className="btn-primary px-5 py-3 rounded-lg font-semibold text-white shrink-0">
                {copied ? '✓ Copied!' : '📋 Share'}
              </button>
            </div>
            <Link to={`/p/${prof.username}`} className="text-xs text-text-dim hover:text-emerald mt-2 inline-block transition">
              Preview your page →
            </Link>
          </div>
        )}

        {/* Payment Methods */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Payment Methods</h2>
            <button onClick={() => setShowAdd(!showAdd)}
              className="text-sm text-emerald hover:text-emerald-dark font-semibold transition">
              {showAdd ? 'Cancel' : '+ Add Method'}
            </button>
          </div>

          {/* Add form */}
          {showAdd && (
            <form onSubmit={handleAdd} className="bg-navy/50 rounded-xl p-4 mb-4 space-y-3 border border-navy-border">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-secondary mb-1 block">Type</label>
                  <select value={addType} onChange={e => setAddType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-navy border border-navy-border rounded-lg text-white text-sm focus:border-emerald focus:outline-none">
                    {PAYMENT_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.icon} {o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-secondary mb-1 block">Label (optional)</label>
                  <input value={addLabel} onChange={e => setAddLabel(e.target.value)}
                    className="w-full px-3 py-2.5 bg-navy border border-navy-border rounded-lg text-white text-sm placeholder-text-dim focus:border-emerald focus:outline-none"
                    placeholder="My Venmo" />
                </div>
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Handle / Address</label>
                <input value={addHandle} onChange={e => setAddHandle(e.target.value)} required
                  className="w-full px-3 py-2.5 bg-navy border border-navy-border rounded-lg text-white text-sm placeholder-text-dim focus:border-emerald focus:outline-none"
                  placeholder="@username, $cashtag, email, or address" />
              </div>
              <button type="submit" className="btn-primary px-5 py-2 rounded-lg font-semibold text-white text-sm">Add</button>
            </form>
          )}

          {/* Method list */}
          {methods.length === 0 && !showAdd && (
            <div className="text-center py-8 text-text-dim">
              <div className="text-3xl mb-2">💳</div>
              <p className="text-sm">No payment methods yet. Add your first one!</p>
            </div>
          )}

          <div className="space-y-2">
            {methods.map((m, idx) => {
              const cfg = getPaymentConfig(m.type);
              const isEditing = editingId === m.id;
              const editCfg = isEditing ? getPaymentConfig(editType) : cfg;

              return (
                <div key={m.id} className={`p-3 rounded-xl border transition ${m.active ? 'border-navy-border bg-navy/30' : 'border-navy-border/50 bg-navy/10 opacity-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{ background: editCfg.color }}>{editCfg.icon}</div>

                    {isEditing ? (
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <select value={editType} onChange={e => setEditType(e.target.value)}
                            className="px-2 py-1.5 bg-navy border border-navy-border rounded-lg text-white text-sm focus:border-emerald focus:outline-none">
                            {PAYMENT_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.icon} {o.label}</option>)}
                          </select>
                          <input value={editLabel} onChange={e => setEditLabel(e.target.value)}
                            className="px-2 py-1.5 bg-navy border border-navy-border rounded-lg text-white text-sm placeholder-text-dim focus:border-emerald focus:outline-none"
                            placeholder="Label (optional)" />
                        </div>
                        <input value={editHandle} onChange={e => setEditHandle(e.target.value)}
                          className="w-full px-2 py-1.5 bg-navy border border-navy-border rounded-lg text-white text-sm placeholder-text-dim focus:border-emerald focus:outline-none"
                          placeholder="Handle / Address"
                          onKeyDown={e => { if (e.key === 'Enter') saveEdit(m.id); if (e.key === 'Escape') cancelEdit(); }} />
                        <div className="flex gap-2">
                          <button onClick={() => saveEdit(m.id)}
                            className="px-3 py-1 bg-emerald/20 text-emerald rounded text-xs font-semibold hover:bg-emerald/30 transition">Save</button>
                          <button onClick={cancelEdit}
                            className="px-3 py-1 bg-navy border border-navy-border text-text-secondary rounded text-xs font-semibold hover:text-white transition">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{m.label || cfg.label}</div>
                        <div className="text-xs text-text-secondary truncate">{m.handle}</div>
                      </div>
                    )}

                    {!isEditing && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => startEdit(m)} title="Edit"
                          className="p-1.5 text-text-dim hover:text-emerald transition text-xs">✏️</button>
                        <button onClick={() => handleMoveUp(idx)} disabled={idx === 0}
                          className="p-1.5 text-text-dim hover:text-white disabled:opacity-20 transition text-xs">▲</button>
                        <button onClick={() => handleMoveDown(idx)} disabled={idx === methods.length - 1}
                          className="p-1.5 text-text-dim hover:text-white disabled:opacity-20 transition text-xs">▼</button>
                        <button onClick={() => handleToggle(m)}
                          className={`px-2 py-1 rounded text-[10px] font-semibold transition ${m.active ? 'bg-emerald/20 text-emerald' : 'bg-red-400/20 text-red-400'}`}>
                          {m.active ? 'ON' : 'OFF'}
                        </button>
                        <button onClick={() => handleDelete(m.id)}
                          className="p-1.5 text-text-dim hover:text-red-400 transition text-xs">✕</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick stats placeholder */}
        <div className="glass rounded-2xl p-6 mt-6 text-center text-text-dim">
          <div className="text-2xl mb-2">📊</div>
          <p className="text-sm">Link analytics coming in Phase 2</p>
        </div>
      </div>
    </div>
  );
}
