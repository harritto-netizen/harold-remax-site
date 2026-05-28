import { useState, useEffect, FormEvent } from 'react';
import { X, Bell, CheckCircle, AlertCircle } from 'lucide-react';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../lib/supabase';
import { trackLead } from '../lib/tracking';

const STORAGE_KEY = 'property_alert_popup_dismissed';
const DISMISS_DAYS = 14;

export default function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const dismissedAt = localStorage.getItem(STORAGE_KEY);
    if (dismissedAt) {
      const daysSince = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSince < DISMISS_DAYS) return;
    }

    let triggered = false;

    const open = () => {
      if (triggered) return;
      triggered = true;
      setIsOpen(true);
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) open();
    };

    const timer = window.setTimeout(open, 45000);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    setIsOpen(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const alertData = {
        email,
        name: null,
        phone: null,
        property_type: null,
        location: null,
        price_min: null,
        price_max: null,
        is_active: true,
      };

      const response = await fetch(`/api/send-property-alert-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify(alertData),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Submit failed: HTTP ${response.status} ${text}`);
      }

      const result = await response.json().catch(() => ({}));
      if (result.success === false) {
        throw new Error(result.error || 'Submit failed');
      }

      trackLead({ contentName: 'exit_intent_popup' });
      setStatus('success');
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
      setTimeout(() => setIsOpen(false), 3500);
    } catch (error: any) {
      setStatus('error');
      const detail = error?.message || String(error);
      const urlInfo = SUPABASE_URL ? SUPABASE_URL.slice(0, 40) : 'MISSING_URL';
      const keyInfo = SUPABASE_ANON_KEY ? `key_len=${SUPABASE_ANON_KEY.length}` : 'MISSING_KEY';
      setErrorMessage(`${detail} | ${urlInfo} | ${keyInfo}`);
      console.error('Popup submit failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-popup-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />
      <div className="relative bg-cream w-full max-w-lg shadow-2xl">
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-4 right-4 text-charcoal/60 hover:text-charcoal transition-colors"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="p-8 md:p-10">
          <div className="flex items-center mb-5">
            <div className="w-12 h-12 bg-charcoal flex items-center justify-center mr-4">
              <Bell className="w-6 h-6 text-cream" />
            </div>
            <div>
              <p className="font-lato text-xs uppercase tracking-widest text-charcoal/60">Don't miss out</p>
              <h3 id="exit-popup-title" className="font-montserrat text-xl text-charcoal uppercase tracking-wider font-light">
                Off-Market Listings
              </h3>
            </div>
          </div>

          <p className="font-lato text-charcoal/80 text-base leading-relaxed mb-6">
            Be the first to see new luxury properties in the Dominican Republic. Get exclusive listings
            <strong className="font-normal"> 48 hours before they go public</strong>. No spam, unsubscribe anytime.
          </p>

          {status === 'success' ? (
            <div className="flex items-start space-x-3 bg-green-50 border border-green-200 p-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-montserrat text-sm uppercase tracking-wider text-green-700 mb-1">
                  You're in
                </h4>
                <p className="font-lato text-charcoal text-sm">
                  We'll send you the best listings before anyone else.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === 'error' && (
                <div className="flex items-start space-x-2 bg-red-50 border border-red-200 p-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="font-lato text-red-700 text-sm">{errorMessage}</p>
                </div>
              )}
              <label htmlFor="exit-popup-email" className="sr-only">Email address</label>
              <input
                id="exit-popup-email"
                type="email"
                required
                aria-required="true"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={status === 'loading'}
                className="w-full px-4 py-4 bg-white border border-charcoal/20 text-charcoal focus:border-charcoal focus:outline-none transition-all font-lato text-base"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-charcoal text-cream px-8 py-4 text-sm uppercase tracking-widest hover:bg-charcoal/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-lato"
              >
                {status === 'loading' ? 'Subscribing...' : 'Send Me Exclusive Listings'}
              </button>
              <button
                type="button"
                onClick={dismiss}
                className="w-full font-lato text-xs text-charcoal/50 uppercase tracking-wider hover:text-charcoal transition-colors pt-1"
              >
                No thanks, I'll keep browsing
              </button>
            </form>
          )}

          <p className="font-lato text-xs text-charcoal/50 text-center mt-6">
            Trusted by 500+ buyers and investors across the Caribbean
          </p>
        </div>
      </div>
    </div>
  );
}
