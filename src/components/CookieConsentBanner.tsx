import { useEffect, useState } from 'react';
import { Cookie } from 'lucide-react';
import { setConsent, type ConsentChoice } from '../lib/tracking';

interface CookieConsentBannerProps {
  open: boolean;
  onClose: () => void;
}

export default function CookieConsentBanner({ open, onClose }: CookieConsentBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  if (!open) return null;

  const choose = (choice: ConsentChoice) => {
    setConsent(choice);
    setVisible(false);
    window.setTimeout(onClose, 300);
  };

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className={`fixed inset-x-0 bottom-0 z-[70] p-3 sm:p-4 mobile-cta-safe transition-all duration-300 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="max-w-5xl mx-auto bg-charcoal text-cream shadow-2xl border border-cream/10">
        <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8 p-5 sm:p-6">
          <div className="flex items-start gap-4 flex-1">
            <span className="hidden sm:flex w-10 h-10 flex-shrink-0 items-center justify-center border border-[#B08C4F]/50 text-[#D9BC85]">
              <Cookie className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <div>
              <p className="font-montserrat text-xs uppercase tracking-widest text-cream mb-2">
                Your privacy, your choice
              </p>
              <p className="font-lato text-sm text-cream/75 leading-relaxed">
                We use analytics cookies to understand which properties and areas interest visitors most, and to measure our advertising. Nothing is tracked unless you accept. Browsing the listings works either way.{' '}
                <a
                  href="/privacy-policy"
                  className="text-cream underline underline-offset-2 hover:text-[#D9BC85] transition-colors"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-3 md:flex-shrink-0">
            <button
              type="button"
              onClick={() => choose('denied')}
              className="px-6 py-3 border border-cream/30 text-cream font-lato text-xs uppercase tracking-widest hover:border-cream hover:bg-cream/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9BC85]"
            >
              Essential only
            </button>
            <button
              type="button"
              onClick={() => choose('granted')}
              className="px-6 py-3 bg-cream text-charcoal font-lato text-xs uppercase tracking-widest hover:bg-beige transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9BC85]"
            >
              Accept analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
