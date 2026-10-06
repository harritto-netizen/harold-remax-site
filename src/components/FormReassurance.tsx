import { Lock, MessageCircle } from 'lucide-react';
import { whatsappLink } from '../data/properties';
import { trackContact } from '../lib/tracking';

interface FormReassuranceProps {
  tone?: 'light' | 'dark';
  whatsappText?: string;
  trackingLabel: string;
}

export default function FormReassurance({
  tone = 'dark',
  whatsappText = "Hi Harold, I'd prefer to chat on WhatsApp about buying property in the Dominican Republic.",
  trackingLabel,
}: FormReassuranceProps) {
  const isDark = tone === 'dark';
  const muted = isDark ? 'text-cream/70' : 'text-charcoal/70';
  const strong = isDark ? 'text-cream' : 'text-charcoal';
  const divider = isDark ? 'border-cream/15' : 'border-charcoal/10';

  return (
    <div className={`mt-6 pt-6 border-t ${divider} space-y-4`}>
      <div className="flex items-center gap-3">
        <img
          src="/harold-portrait.webp"
          alt="Harold, RE/MAX Next Door"
          className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-[#B08C4F]/40"
          loading="lazy"
          decoding="async"
          width="40"
          height="40"
        />
        <p className={`font-lato text-sm leading-snug ${muted}`}>
          <span className={strong}>"I personally reply within 24 hours."</span>
          <span className="block text-xs mt-0.5">Harold, Prime Real Estate DR</span>
        </p>
      </div>
      <p className={`flex items-start gap-2 font-lato text-xs leading-relaxed ${muted}`}>
        <Lock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" strokeWidth={1.5} aria-hidden="true" />
        No spam. One useful email a week at most, unsubscribe in one click. Your details stay with Harold and are never sold or shared.
      </p>
      <a
        href={whatsappLink(whatsappText)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackContact(trackingLabel)}
        className={`inline-flex items-center gap-2 font-lato text-xs uppercase tracking-widest ${strong} border-b border-current pb-0.5 hover:opacity-70 transition-opacity`}
      >
        <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
        Prefer WhatsApp? Message us
      </a>
    </div>
  );
}
