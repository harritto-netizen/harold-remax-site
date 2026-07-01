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
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
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
    image: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800',
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
    image: 'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800',
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
    image: 'https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=800',
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
    image: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Luxury Tower Unit',
    location: 'Evaristo Morales, Santo Domingo',
    price: '$198,000',
    beds: 1,
    baths: 1,
    sqft: '860',
    soldDate: 'March 2026',
    daysOnMarket: 12,
    image: 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=800',
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
    <section ref={sectionRef} className="py-24 md:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="font-lato text-xs uppercase tracking-widest text-charcoal/50 mb-4">
            Our Track Record
          </p>
          <h2 className="font-montserrat text-4xl sm:text-5xl md:text-6xl font-light text-charcoal uppercase tracking-wider mb-6">
            Recently Sold
          </h2>
          <p className="font-lato text-lg text-charcoal/70 max-w-2xl mx-auto">
            A selection of properties we have successfully closed for our clients
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {soldProperties.map((property, index) => (
            <div
              key={index}
              className={`group transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative h-72 overflow-hidden mb-4">
                <img
                  src={property.image}
                  alt={`${property.title} - Sold property in ${property.location}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  width="400"
                  height="288"
                />
                <div className="absolute inset-0 bg-charcoal/10 group-hover:bg-charcoal/20 transition-colors duration-300" />
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-charcoal/90 text-cream px-3 py-1.5">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  <span className="font-lato text-xs uppercase tracking-wider">Sold</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal/80 to-transparent p-5 pt-12">
                  <p className="font-lato text-xs text-cream/80 uppercase tracking-wider mb-1">
                    {property.location}
                  </p>
                  <h3 className="font-montserrat text-lg text-cream uppercase tracking-wide">
                    {property.title}
                  </h3>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <p className="font-montserrat text-2xl font-light text-charcoal">
                    {property.price}
                  </p>
                  <span className="font-lato text-xs text-charcoal/50 uppercase tracking-wider">
                    {property.soldDate}
                  </span>
                </div>
                <div className="flex gap-4 font-lato text-sm text-charcoal/70">
                  <span>{property.beds} Beds</span>
                  <span>{property.baths} Baths</span>
                  <span>{property.sqft} ft2</span>
                </div>
                <p className="font-lato text-xs text-charcoal/50 italic">
                  Sold in {property.daysOnMarket} days
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
            className="inline-block border-2 border-charcoal text-charcoal px-8 py-3 text-sm uppercase tracking-widest hover:bg-charcoal hover:text-cream transition-all duration-300"
          >
            List Your Property With Us
          </a>
        </div>
      </div>
    </section>
  );
}
