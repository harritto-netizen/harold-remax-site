import { MessageCircle, Calendar } from 'lucide-react';
import { trackContact } from '../lib/tracking';

export default function MobileCTABar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-cream border-t border-charcoal/10 p-3 flex gap-3 shadow-lg mobile-cta-safe">
      <a
        href="https://wa.me/18094262269?text=Hello%20Harold,%20I'm%20interested%20in%20your%20real%20estate%20services"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackContact('whatsapp_mobile_cta')}
        className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white text-xs uppercase tracking-widest font-lato hover:bg-green-600 transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        Chat Now
      </a>
      <a
        href="https://wa.me/18094262269?text=Hi%20Harold,%20I'd%20like%20to%20schedule%20a%20property%20tour.%20When%20are%20you%20available?"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackContact('schedule_tour_mobile_cta')}
        className="flex-1 flex items-center justify-center gap-2 py-3 bg-charcoal text-cream text-xs uppercase tracking-widest font-lato hover:bg-charcoal/90 transition-colors"
      >
        <Calendar className="w-4 h-4" />
        Book Tour
      </a>
    </div>
  );
}
