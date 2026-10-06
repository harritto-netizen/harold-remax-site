import { Bell, Calendar, SearchX, X } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { PROPERTIES, formatUSD, whatsappLink, type Property } from '../data/properties';
import { trackContact, trackViewContent } from '../lib/tracking';

export interface PropertyFilters {
  area: string;
  kind: string;
  budget: string;
}

export const EMPTY_FILTERS: PropertyFilters = { area: '', kind: '', budget: '' };

const KIND_LABELS: Record<string, string> = {
  villa: 'Villa',
  apartment: 'Apartment',
  condo: 'Condo',
  penthouse: 'Penthouse',
  land: 'Land',
};

const BUDGET_LABELS: Record<string, string> = {
  '0-200000': 'Under $200K',
  '200000-500000': '$200K - $500K',
  '500000-1000000': '$500K - $1M',
  '1000000+': '$1M+',
};

const matchesBudget = (price: number, budget: string) => {
  if (!budget) return true;
  if (budget.endsWith('+')) return price >= Number(budget.slice(0, -1));
  const [min, max] = budget.split('-').map(Number);
  return price >= min && price <= max;
};

// Condos and apartments are listed interchangeably by developers in the DR.
const matchesKind = (property: Property, kind: string) =>
  !kind || property.kind === kind || (kind === 'condo' && property.kind === 'apartment');

interface FeaturedPropertiesProps {
  filters: PropertyFilters;
  onClearFilters: () => void;
  onAlert: (location: string, propertyType: string) => void;
}

export default function FeaturedProperties({ filters, onClearFilters, onAlert }: FeaturedPropertiesProps) {
  const isFiltered = Boolean(filters.area || filters.kind || filters.budget);
  const results = PROPERTIES.filter(
    (p) => (!filters.area || p.area === filters.area) && matchesKind(p, filters.kind) && matchesBudget(p.price, filters.budget),
  );

  const activeChips = [
    filters.area,
    filters.kind && KIND_LABELS[filters.kind],
    filters.budget && BUDGET_LABELS[filters.budget],
  ].filter(Boolean) as string[];

  return (
    <>
      {isFiltered && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-charcoal/10 animate-fade-in" aria-live="polite">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-lato text-sm text-charcoal/70 mr-2">
              {results.length} {results.length === 1 ? 'property matches' : 'properties match'}
            </span>
            {activeChips.map((chip) => (
              <span key={chip} className="font-lato text-xs uppercase tracking-wider text-charcoal border border-charcoal/20 px-3 py-1">
                {chip}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 font-lato text-xs uppercase tracking-widest text-charcoal/70 hover:text-charcoal transition-colors self-start sm:self-auto"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
            Clear filters
          </button>
        </div>
      )}

      {results.length === 0 ? (
        <div className="text-center py-16 px-6 border border-dashed border-charcoal/20 bg-beige-light animate-fade-in">
          <SearchX className="w-10 h-10 text-charcoal/40 mx-auto mb-5" strokeWidth={1.5} aria-hidden="true" />
          <h3 className="font-montserrat text-xl uppercase tracking-wider text-charcoal mb-3">Nothing listed publicly yet</h3>
          <p className="font-lato text-charcoal/70 max-w-md mx-auto mb-8 leading-relaxed">
            Many of our best properties sell before they are ever advertised. Tell us what you want and we'll send matches as soon as they come up.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onAlert(filters.area, filters.kind)}
              className="inline-flex items-center gap-2 bg-charcoal text-cream px-6 py-3 text-sm uppercase tracking-widest font-lato hover:bg-charcoal/90 transition-colors"
            >
              <Bell className="w-4 h-4" aria-hidden="true" />
              Alert me when one lists
            </button>
            <button
              type="button"
              onClick={onClearFilters}
              className="font-lato text-sm uppercase tracking-widest text-charcoal border-b border-charcoal pb-0.5 hover:opacity-60 transition-opacity"
            >
              See all properties
            </button>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((property, index) => {
            const price = formatUSD(property.price);
            return (
              <ScrollReveal key={property.title} delay={index * 100} className="group hover-zoom overflow-hidden">
                <div className="relative h-80 overflow-hidden mb-4">
                  <img
                    src={property.image}
                    alt={`${property.title} - Property with ${property.beds} bedrooms and ${property.baths} bathrooms in ${property.location}`}
                    className="w-full h-full object-cover transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="320"
                  />
                  <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/30 transition-colors duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="font-lato text-sm uppercase tracking-wider mb-2 opacity-90">{property.location}</p>
                    <h3 className="font-montserrat text-xl uppercase tracking-wide">{property.title}</h3>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="font-montserrat text-2xl font-light text-charcoal">{price}</p>
                  <div className="flex gap-6 font-lato text-sm text-charcoal/70">
                    <span>{property.beds} Beds</span>
                    <span>{property.baths} Baths</span>
                    <span>{property.sqft} ft²</span>
                  </div>
                  <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 pt-2">
                    <a
                      href={whatsappLink(`Hello Harold, I'm interested in the ${property.title} listed at ${price} in ${property.location}. Can you provide more details?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        trackViewContent({ contentName: property.title, value: property.price });
                        trackContact('whatsapp_property');
                      }}
                      className="inline-block font-lato text-sm text-charcoal uppercase tracking-widest border-b border-charcoal hover:opacity-60 transition-opacity pb-1"
                    >
                      View Details
                    </a>
                    <a
                      href={whatsappLink(`Hi Harold, I'd like to schedule a tour of ${property.title} in ${property.location}. When are you available?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackContact('schedule_tour')}
                      className="inline-flex items-center gap-1.5 font-lato text-xs text-charcoal uppercase tracking-widest border border-charcoal px-3 py-1.5 hover:bg-charcoal hover:text-cream transition-all duration-300"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Schedule Tour
                    </a>
                    <button
                      type="button"
                      onClick={() => onAlert(property.area, '')}
                      className="inline-flex items-center gap-1.5 font-lato text-xs text-charcoal/70 uppercase tracking-wider hover:text-charcoal transition-colors"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      Alert me of similar
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      )}
    </>
  );
}
