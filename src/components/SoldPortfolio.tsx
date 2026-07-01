import { useEffect, useRef, useState } from 'react';
import { BadgeCheck } from 'lucide-react';

const soldProperties = [
  {
    title: 'Penthouse in Piantini',
    location: 'Santo Domingo',
    price: '$920,000',
    beds: 4,
    baths: 4,
    sqft: '3,800',
    soldDate: 'June 2026',
    daysOnMarket: 28,
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop',
  },
  {
    title: 'Oceanview Villa',
    location: 'Cap Cana',
    price: '$1,450,000',
    beds: 5,
    baths: 5,
    sqft: '5,200',
    soldDate: 'May 2026',
    daysOnMarket: 35,
    image: '/RUID49c.jpg',
  },
  {
    title: 'Modern Apartment',
    location: 'Naco, Santo Domingo',
    price: '$285,000',
    beds: 2,
    baths: 2,
    sqft: '1,200',
    soldDate: 'May 2026',
    daysOnMarket: 18,
    image: 'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop',
  },
  {
    title: 'Beachfront Condo',
    location: 'Bayahibe',
    price: '$340,000',
    beds: 2,
    baths: 2,
    sqft: '1,450',
    soldDate: 'April 2026',
    daysOnMarket: 41,
    image: 'https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop',
  },
  {
    title: 'Golf Course Villa',
    location: 'Punta Cana',
    price: '$780,000',
    beds: 4,
    baths: 3,
    sqft: '3,400',
    soldDate: 'March 2026',
    daysOnMarket: 32,
    image: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop',
  },
  {
    title: 'Luxury Tower Unit',
    location: 'Evaristo Morales',
    price: '$198,000',
    beds: 1,
    baths: 1,
    sqft: '860',
    soldDate: 'March 2026',
    daysOnMarket: 12,
    image: 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop',
  },
];

export default function SoldPortfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="font-lato text-xs uppercase tracking-widest text-cream/50 mb-4">
            Our Track Record
          </p>
          <h2 className="font-montserrat text-4xl sm:text-5xl md:text-6xl font-light text-cream uppercase tracking-wider mb-6">
            Recently Sold
          </h2>
          <p className="font-lato text-lg text-cream/60 max-w-2xl mx-auto">
            A selection of properties we have successfully closed for our clients
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {soldProperties.map((property, index) => (
            <div
              key={index}
              className={`group relative cursor-pointer transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Vertical image container */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={property.image}
                  alt={`${property.title} - Sold property in ${property.location}`}
                  className="w-full h-full object-cover transition-all duration-700 ease-out can-hover:grayscale can-hover:group-hover:grayscale-0 can-hover:group-hover:scale-105"
                  loading="lazy"
                  width="600"
                  height="900"
                />

                {/* Dark overlay - only on hover devices */}
                <div className="absolute inset-0 transition-all duration-700 can-hover:bg-charcoal/30 can-hover:group-hover:bg-charcoal/0" />

                {/* Sold badge - always visible */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-cream text-charcoal px-3 py-1.5 z-10">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  <span className="font-lato text-xs uppercase tracking-wider font-medium">Sold</span>
                </div>

                {/* Details overlay - always visible on touch, hover-reveal on desktop */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 opacity-100 can-hover:opacity-0 can-hover:group-hover:opacity-100 transition-all duration-500">
                  <div className="bg-charcoal/85 backdrop-blur-sm p-4 sm:p-5 translate-y-0 can-hover:translate-y-4 can-hover:group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <p className="font-lato text-xs text-cream/70 uppercase tracking-wider mb-1">
                      {property.location}
                    </p>
                    <h3 className="font-montserrat text-base sm:text-lg text-cream uppercase tracking-wide mb-3">
                      {property.title}
                    </h3>
                    <div className="flex items-baseline justify-between mb-2">
                      <p className="font-montserrat text-xl sm:text-2xl font-light text-cream">
                        {property.price}
                      </p>
                    </div>
                    <div className="flex gap-4 font-lato text-xs text-cream/70 mb-2">
                      <span>{property.beds} Beds</span>
                      <span>{property.baths} Baths</span>
                      <span>{property.sqft} ft2</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-cream/20">
                      <span className="font-lato text-xs text-cream/50">{property.soldDate}</span>
                      <span className="font-lato text-xs text-cream/50">Sold in {property.daysOnMarket} days</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Minimal info below image - only on desktop where overlay is hidden */}
              <div className="mt-3 text-center hidden can-hover:block">
                <p className="font-montserrat text-sm text-cream/80 uppercase tracking-wider">
                  {property.title}
                </p>
                <p className="font-lato text-xs text-cream/40 mt-1">
                  {property.location}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <a
            href="https://wa.me/18094262269?text=Hello%20Harold,%20I%20saw%20your%20recent%20sales%20and%20I'm%20interested%20in%20selling%20my%20property.%20Can%20we%20discuss?"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border-2 border-cream text-cream px-8 py-3 text-sm uppercase tracking-widest hover:bg-cream hover:text-charcoal transition-all duration-300"
          >
            List Your Property With Us
          </a>
        </div>
      </div>
    </section>
  );
}
