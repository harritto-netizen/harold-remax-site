import { useState, FormEvent } from 'react';
import { CheckCircle, AlertCircle, Download, BookOpen, ShieldCheck, Clock } from 'lucide-react';
import { publicSupabase } from '../lib/supabase';
import { trackLead } from '../lib/tracking';
import FormReassurance from './FormReassurance';

const GUIDE_URL = '/guides/dr-buyers-guide-2026.html';
const LEAD_SOURCE = 'buyers_guide_2026';

export default function BuyersGuideMagnet() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const { error } = await publicSupabase.from('contacts').insert([
        {
          name: name.trim(),
          email: email.trim(),
          message: `[Lead source: ${LEAD_SOURCE}] Requested the Dominican Republic Buyer's Guide 2026.`,
        },
      ]);
      if (error) throw new Error(error.message);

      trackLead({ contentName: LEAD_SOURCE });
      setStatus('success');

      setTimeout(() => {
        window.open(GUIDE_URL, '_blank', 'noopener');
      }, 400);
    } catch (err) {
      // Generic message only: the backend error leaks schema and policy detail.
      console.error('Guide request failed:', err);
      setStatus('error');
      setErrorMessage('We could not send the guide. Please try again.');
    }
  };

  return (
    <section aria-labelledby="guide-magnet-heading" className="py-24 md:py-32 bg-cream border-y border-charcoal/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="font-lato text-xs uppercase tracking-[0.28em] text-[#B08C4F] mb-5">Free 2026 Buyer's Guide</p>
            <h2
              id="guide-magnet-heading"
              className="font-montserrat text-4xl sm:text-5xl md:text-6xl font-light text-charcoal uppercase tracking-wider leading-tight mb-6"
            >
              The Dominican Republic Buyer's Guide
            </h2>
            <p className="font-lato text-lg text-charcoal/70 leading-relaxed mb-8 max-w-xl">
              A private 8-chapter briefing on buying luxury property in Cap Cana, Punta Cana, Santo Domingo and Casa de Campo &mdash; markets, taxes, the closing process, financing and the mistakes that cost buyers the most.
            </p>

            <ul className="space-y-4 mb-10 max-w-xl">
              <li className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-[#B08C4F] flex-shrink-0 mt-1" strokeWidth={1.5} />
                <span className="font-lato text-charcoal/85 text-[15px] leading-relaxed">
                  How CONFOTUR saves qualifying buyers <strong className="text-charcoal font-normal">US$180k&ndash;220k</strong> in taxes over 15 years.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#B08C4F] flex-shrink-0 mt-1" strokeWidth={1.5} />
                <span className="font-lato text-charcoal/85 text-[15px] leading-relaxed">
                  The 10 mistakes we see foreign buyers make &mdash; and the pre-offer checklist that prevents them.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#B08C4F] flex-shrink-0 mt-1" strokeWidth={1.5} />
                <span className="font-lato text-charcoal/85 text-[15px] leading-relaxed">
                  A realistic 7-step timeline from first tour to keys in hand, with true costs at each stage.
                </span>
              </li>
            </ul>

            <p className="font-lato text-xs uppercase tracking-widest text-charcoal/50">
              350+ happy clients &middot; RE/MAX Certified &middot; 15+ years
            </p>
          </div>

          <div className="bg-charcoal text-cream p-8 md:p-12 shadow-2xl">
            {status === 'success' ? (
              <div className="text-center py-6 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-cream/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-cream" strokeWidth={1.5} />
                </div>
                <h3 className="font-montserrat text-2xl uppercase tracking-wider font-light mb-3">Guide sent</h3>
                <p className="font-lato text-cream/70 text-sm leading-relaxed mb-8">
                  Your copy is opening in a new tab. If a popup was blocked, use the button below.
                </p>
                <a
                  href={GUIDE_URL}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-3 border-2 border-cream text-cream px-8 py-4 text-sm uppercase tracking-widest hover:bg-cream hover:text-charcoal transition-all duration-300 font-lato"
                >
                  <Download className="w-4 h-4" strokeWidth={1.5} />
                  Open the guide
                </a>
                <p className="font-lato text-xs text-cream/50 mt-6">
                  Use the Save as PDF button at the top of the guide to keep a copy.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <p className="font-lato text-xs uppercase tracking-[0.24em] text-cream/50 mb-2">Get instant access</p>
                  <h3 className="font-montserrat text-2xl md:text-3xl font-light uppercase tracking-wider text-cream">
                    Send my free guide
                  </h3>
                </div>

                {status === 'error' && (
                  <div className="bg-red-500/20 border border-red-500/70 p-4 flex items-start gap-3 animate-fade-in">
                    <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-lato text-cream text-sm">{errorMessage}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="guide-name" className="font-lato text-xs uppercase tracking-widest text-cream/70 mb-2 block">
                    First name
                  </label>
                  <input
                    id="guide-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream focus:border-cream focus:outline-none transition-all font-lato placeholder-cream/40"
                    placeholder="Your first name"
                    disabled={status === 'loading'}
                    autoComplete="given-name"
                  />
                </div>

                <div>
                  <label htmlFor="guide-email" className="font-lato text-xs uppercase tracking-widest text-cream/70 mb-2 block">
                    Email
                  </label>
                  <input
                    id="guide-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream focus:border-cream focus:outline-none transition-all font-lato placeholder-cream/40"
                    placeholder="you@email.com"
                    disabled={status === 'loading'}
                    autoComplete="email"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full inline-flex items-center justify-center gap-3 bg-cream text-charcoal px-8 py-4 text-sm uppercase tracking-widest hover:bg-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-lato"
                >
                  {status === 'loading' ? (
                    'Sending...'
                  ) : (
                    <>
                      <Download className="w-4 h-4" strokeWidth={1.5} />
                      Send My Free Buyer's Guide
                    </>
                  )}
                </button>

                <FormReassurance
                  trackingLabel="whatsapp_guide_form"
                  whatsappText="Hi Harold, I'd like to talk about buying property in the Dominican Republic."
                />
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
