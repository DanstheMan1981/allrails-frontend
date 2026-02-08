import { Link } from 'react-router-dom';

const steps = [
  { num: '01', title: 'Create Your Link', desc: 'Sign up and pick your unique username — allrails.app/you' },
  { num: '02', title: 'Add Payment Methods', desc: 'Connect Venmo, Cash App, PayPal, Zelle, crypto — whatever you use' },
  { num: '03', title: 'Share & Get Paid', desc: 'One link in your bio, texts, or QR code. Anyone can pay you instantly' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-navy">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <img src="/allrails-logo.png" alt="AllRails" className="h-8" />
          <span className="text-xl font-bold gradient-text">AllRails</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="px-4 py-2 text-sm text-text-secondary hover:text-white transition">Log In</Link>
          <Link to="/register" className="btn-primary px-4 py-2 text-sm font-semibold text-white rounded-lg">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient pt-20 pb-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <img src="/allrails-logo.png" alt="AllRails" className="h-[120px] mx-auto mb-6" />
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
            One Link.<br /><span className="gradient-text">Every Payment.</span>
          </h1>
          <p className="text-xl text-text-secondary mb-10 max-w-xl mx-auto">
            Connecting Payments, Seamlessly. Share a single link and let anyone pay you with their preferred method.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary px-8 py-3.5 text-lg font-bold text-white rounded-xl text-center">
              Create Your Link — Free
            </Link>
            <a href="#how-it-works" className="px-8 py-3.5 text-lg font-semibold text-text-secondary border border-navy-border rounded-xl hover:border-emerald/40 hover:text-white transition text-center">
              How It Works
            </a>
          </div>
        </div>

        {/* Mock phone preview */}
        <div className="max-w-xs mx-auto mt-16">
          <div className="glass rounded-3xl p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald/20 flex items-center justify-center text-3xl mx-auto mb-3">💸</div>
            <div className="font-bold text-lg mb-1">@danielpays</div>
            <div className="text-text-dim text-sm mb-5">Send me money 🙌</div>
            <div className="space-y-2.5">
              {[{ name: 'Venmo', color: '#3D95CE' }, { name: 'Cash App', color: '#00D632' }, { name: 'PayPal', color: '#003087' }, { name: 'Zelle', color: '#6D1ED4' }].map(m => (
                <div key={m.name} className="py-3 rounded-xl font-semibold text-white text-sm" style={{ background: m.color }}>{m.name}</div>
              ))}
            </div>
            <div className="mt-5 text-[10px] text-text-dim">Powered by AllRails</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">How It <span className="gradient-text">Works</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(s => (
              <div key={s.num} className="glass rounded-2xl p-6 text-center">
                <div className="text-4xl font-black gradient-text mb-4">{s.num}</div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-text-secondary text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to simplify payments?</h2>
        <p className="text-text-secondary mb-8">Free forever. Set up in 30 seconds.</p>
        <Link to="/register" className="btn-primary px-10 py-4 text-lg font-bold text-white rounded-xl inline-block">
          Get Your Link
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy-border py-8 px-6 text-center text-text-dim text-sm">
        © {new Date().getFullYear()} AllRails. All rights reserved.
      </footer>
    </div>
  );
}
