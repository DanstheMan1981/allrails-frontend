import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicPage, type PublicPage as PublicPageData } from '../lib/api';
import { getPaymentConfig } from '../lib/payment-types';

export default function PublicPage() {
  const { username } = useParams<{ username: string }>();
  const [page, setPage] = useState<PublicPageData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    publicPage.get(username)
      .then(setPage)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="animate-pulse text-text-dim">Loading...</div>
      </div>
    );
  }

  if (notFound || !page) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-2">Page not found</h1>
          <p className="text-text-secondary mb-6">This AllRails link doesn't exist yet.</p>
          <Link to="/register" className="btn-primary px-6 py-2.5 rounded-lg font-semibold text-white inline-block">
            Claim this username
          </Link>
        </div>
      </div>
    );
  }

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handlePayment = (type: string, handle: string) => {
    const cfg = getPaymentConfig(type);
    const link = cfg.deepLink(handle);
    if (link) {
      window.location.href = link;
    }
  };

  const handleCopy = useCallback(async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  return (
    <div className="min-h-screen bg-navy hero-gradient flex flex-col">
      <div className="flex-1 flex items-start justify-center pt-12 sm:pt-20 px-4 pb-8">
        <div className="w-full max-w-sm">
          {/* Avatar + Info */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold"
              style={{ background: 'linear-gradient(135deg, #00c853, #00a844)' }}>
              {page.avatar
                ? <img src={page.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                : (page.displayName || page.username)[0].toUpperCase()
              }
            </div>
            <h1 className="text-2xl font-bold">{page.displayName || page.username}</h1>
            <p className="text-text-secondary text-sm">@{page.username}</p>
            {page.bio && <p className="text-text-dim text-sm mt-2 max-w-xs mx-auto">{page.bio}</p>}
          </div>

          {/* Payment Buttons */}
          <div className="space-y-3">
            {page.paymentMethods.map(m => {
              const cfg = getPaymentConfig(m.type);
              const isDisplayOnly = !cfg.deepLink(m.handle);

              if (isDisplayOnly) {
                return (
                  <div key={m.id}
                    className="w-full py-4 px-5 rounded-2xl text-white relative overflow-hidden"
                    style={{ background: cfg.color }}>
                    <div className="flex items-center justify-center gap-2 font-bold">
                      <span className="text-lg">{cfg.icon}</span>
                      <span>{m.label || cfg.label}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <span className="font-mono text-sm bg-black/20 px-3 py-1.5 rounded-lg">{m.handle}</span>
                      <button onClick={() => handleCopy(m.id, m.handle)}
                        className="bg-white/20 hover:bg-white/30 transition px-3 py-1.5 rounded-lg text-xs font-semibold">
                        {copiedId === m.id ? '✓ Copied!' : '📋 Copy'}
                      </button>
                    </div>
                    <div className="text-center text-[11px] opacity-70 mt-1.5">
                      Open your banking app and send to this number/email via Zelle
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={m.id}
                  onClick={() => handlePayment(m.type, m.handle)}
                  className="pay-btn w-full py-4 rounded-2xl font-bold text-white text-center relative overflow-hidden group"
                  style={{ background: cfg.color }}
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-200" />
                  <div className="relative flex items-center justify-center gap-2">
                    <span className="text-lg">{cfg.icon}</span>
                    <span>{m.label || cfg.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {page.paymentMethods.length === 0 && (
            <div className="text-center text-text-dim py-8">
              <p className="text-sm">No payment methods set up yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* AllRails branding */}
      <footer className="text-center py-6 px-4">
        <Link to="/" className="text-text-dim text-xs hover:text-text-secondary transition">
          Powered by <span className="gradient-text font-semibold">AllRails</span>
        </Link>
      </footer>
    </div>
  );
}
