import { useEffect, useRef } from 'react';
import ScrollReveal from './ScrollReveal';

const HOLO_SCRIPT_SRC =
  'https://prod-api-holo-ai.fly.dev/public/seo/embed/08f4c3ef-0a74-49bf-afda-c02f9b895192.js';

export default function MarketInsights() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${HOLO_SCRIPT_SRC}"]`
    );
    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.src = HOLO_SCRIPT_SRC;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <section id="blog" className="py-24 md:py-32 bg-beige-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <h2 className="font-montserrat text-4xl sm:text-5xl md:text-6xl font-light text-charcoal uppercase tracking-wider mb-6">
            Market Insights
          </h2>
          <p className="font-lato text-lg text-charcoal/70 max-w-2xl mx-auto">
            Expert analysis on Dominican Republic real estate trends, investment opportunities, and market forecasts
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mb-16">
            <h3 className="font-montserrat text-2xl sm:text-3xl font-light text-charcoal uppercase tracking-wider mb-10 text-center">
              Featured Articles
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <a
                href="/blog/living-investing-evaristo-morales-santo-domingo-real-estate.html"
                className="group block bg-white border border-charcoal/10 hover:border-charcoal/30 transition-colors overflow-hidden"
              >
                <div className="aspect-[16/10] overflow-hidden bg-beige-light">
                  <img
                    src="https://euwpcnaioorzkhmwfnjn.supabase.co/storage/v1/object/public/creative-assets/images/4ddaebfa-fe2e-4924-8717-dd1332c732e7/1787761402669-jkfd9n4p26d.jpeg"
                    alt="Evaristo Morales luxury real estate hero"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <p className="font-lato text-xs uppercase tracking-widest text-charcoal/50 mb-3">
                    August 26, 2026 &middot; Santo Domingo
                  </p>
                  <h4 className="font-montserrat text-xl md:text-2xl font-light text-charcoal mb-3 leading-snug">
                    Living and Investing in Evaristo Morales
                  </h4>
                  <p className="font-lato text-sm text-charcoal/70 leading-relaxed mb-4">
                    Discover why Evaristo Morales is one of Santo Domingo's premier neighborhoods for luxury living and property investment, featuring Torre Roraima.
                  </p>
                  <span className="inline-block font-montserrat text-xs uppercase tracking-widest text-charcoal border-b border-charcoal pb-1 group-hover:opacity-70 transition-opacity">
                    Read Article
                  </span>
                </div>
              </a>

              <a
                href="/blog/confotur-tax-savings.html"
                className="group block bg-white border border-charcoal/10 hover:border-charcoal/30 transition-colors overflow-hidden"
              >
                <div className="aspect-[16/10] overflow-hidden bg-beige-light">
                  <img
                    src="/d-2574-1765469617-c45431a7-3384-488b-b949-0103dfb4aa72.png"
                    alt="CONFOTUR-approved property in Cap Cana"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <p className="font-lato text-xs uppercase tracking-widest text-charcoal/50 mb-3">
                    July 1, 2026 &middot; Tax Planning
                  </p>
                  <h4 className="font-montserrat text-xl md:text-2xl font-light text-charcoal mb-3 leading-snug">
                    CONFOTUR Tax Savings Explained
                  </h4>
                  <p className="font-lato text-sm text-charcoal/70 leading-relaxed mb-4">
                    How CONFOTUR Law 158-01 eliminates transfer tax, property tax, and rental income tax for 15 years on qualifying Dominican Republic properties.
                  </p>
                  <span className="inline-block font-montserrat text-xs uppercase tracking-widest text-charcoal border-b border-charcoal pb-1 group-hover:opacity-70 transition-opacity">
                    Read Article
                  </span>
                </div>
              </a>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div ref={containerRef} className="holo-blog-wrapper">
            <div id="holo-blog"></div>
          </div>
        </ScrollReveal>

        <div className="mt-16 text-center max-w-3xl mx-auto">
          <p className="font-lato text-charcoal/60 text-sm leading-relaxed">
            Stay informed about the Dominican Republic real estate market with expert insights from RE/MAX Next Door. Whether you are looking to buy property in Punta Cana, invest in Santo Domingo condos, or explore luxury villas in Cap Cana, our market reports help you make confident investment decisions. Contact Harold for a personalized market analysis.
          </p>
        </div>

        <ScrollReveal className="mt-20 border-t border-charcoal/10 pt-16">
          <h3 className="font-montserrat text-2xl sm:text-3xl font-light text-charcoal uppercase tracking-wider mb-10 text-center">
            2026 Neighborhood Price Guide
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { area: 'Piantini, Santo Domingo', priceRange: '$2,200 - $2,800/m2', yield: '6-8%', type: 'Luxury Condos & Penthouses', trend: 'Up 14% YoY' },
              { area: 'Naco, Santo Domingo', priceRange: '$1,800 - $2,400/m2', yield: '7-9%', type: 'Modern Towers & Apartments', trend: 'Up 11% YoY' },
              { area: 'Evaristo Morales, Santo Domingo', priceRange: '$1,500 - $2,000/m2', yield: '8-10%', type: 'Apartments & Mixed-Use', trend: 'Up 16% YoY' },
              { area: 'Cap Cana', priceRange: '$3,000 - $4,500/m2', yield: '8-12%', type: 'Resort Condos & Villas', trend: 'Up 18% YoY' },
              { area: 'Punta Cana', priceRange: '$2,000 - $3,500/m2', yield: '8-12%', type: 'Vacation Condos & Homes', trend: 'Up 15% YoY' },
              { area: 'Bayahibe', priceRange: '$1,800 - $2,800/m2', yield: '9-12%', type: 'Beachfront Condos', trend: 'Up 13% YoY' },
            ].map((data, index) => (
              <div key={index} className="border border-charcoal/10 p-6 hover:border-charcoal/25 transition-colors">
                <h4 className="font-montserrat text-sm uppercase tracking-wider text-charcoal mb-3">{data.area}</h4>
                <p className="font-montserrat text-2xl font-light text-charcoal mb-1">{data.priceRange}</p>
                <div className="space-y-1 mt-3">
                  <p className="font-lato text-xs text-charcoal/60"><span className="text-charcoal/80 font-medium">Type:</span> {data.type}</p>
                  <p className="font-lato text-xs text-charcoal/60"><span className="text-charcoal/80 font-medium">Rental Yield:</span> {data.yield} annually</p>
                  <p className="font-lato text-xs text-charcoal/60"><span className="text-charcoal/80 font-medium">Price Trend:</span> {data.trend}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="font-lato text-xs text-charcoal/40 text-center mt-6 italic">
            Data based on Q2 2026 market analysis by RE/MAX Next Door. Prices in USD. Yields are net estimates for furnished short-term rentals.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
