import type { ReactNode } from 'react';
import { ArrowLeft, Phone } from 'lucide-react';
import { whatsappLink } from '../../data/properties';
import { trackContact } from '../../lib/tracking';

export const BLOG_WHATSAPP = whatsappLink("Hi Harold, I just read your blog and I'd like to talk about buying property in the Dominican Republic.");

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header className="bg-cream/95 backdrop-blur-sm border-b border-charcoal/10 sticky top-0 z-40">
        <nav aria-label="Blog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between gap-4">
          <a href="/" className="group flex items-center gap-2 text-charcoal">
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="font-montserrat text-sm uppercase tracking-widest">RE/MAX Next Door</span>
          </a>
          <div className="flex items-center gap-6 sm:gap-10">
            <a href="/blog" className="hidden sm:inline text-charcoal text-sm uppercase tracking-widest hover:opacity-60 transition-opacity">Journal</a>
            <a href="/#propiedades" className="hidden md:inline text-charcoal text-sm uppercase tracking-widest hover:opacity-60 transition-opacity">Properties</a>
            <a
              href={BLOG_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContact('whatsapp_blog_header')}
              className="border border-charcoal text-charcoal px-4 sm:px-6 py-2 text-xs sm:text-sm uppercase tracking-widest hover:bg-charcoal hover:text-cream transition-all duration-300"
            >
              Get In Touch
            </a>
          </div>
        </nav>
      </header>

      <main id="main-content" className="flex-1">{children}</main>

      <footer className="bg-cream border-t border-charcoal/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div>
            <p className="font-montserrat text-sm uppercase tracking-widest text-charcoal mb-2">RE/MAX Next Door</p>
            <p className="font-lato text-sm text-charcoal/60 mb-0">Luxury real estate in Santo Domingo, Punta Cana, Cap Cana and Bayahibe.</p>
          </div>
          <div className="flex flex-wrap items-center gap-6 font-lato text-sm text-charcoal/70">
            <a href="/" className="hover:text-charcoal transition-colors">Home</a>
            <a href="/blog" className="hover:text-charcoal transition-colors">Journal</a>
            <a href="/privacy-policy" className="hover:text-charcoal transition-colors">Privacy Policy</a>
            <a href="tel:+18094262269" className="inline-flex items-center gap-1 hover:text-charcoal transition-colors">
              <Phone className="w-3.5 h-3.5" />+1 (809) 426-2269
            </a>
          </div>
        </div>
        <p className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 font-lato text-xs text-charcoal/50">
          &copy; {new Date().getFullYear()} RE/MAX Next Door. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
