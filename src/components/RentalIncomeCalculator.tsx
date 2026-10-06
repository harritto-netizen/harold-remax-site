import { useMemo, useState, FormEvent } from 'react';
import { AlertCircle, Calculator, Lock, Quote, TrendingUp, Unlock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { trackContact, trackLead } from '../lib/tracking';
import { AREAS, PROPERTIES, formatUSD, whatsappLink, type PropertyArea } from '../data/properties';
import FormReassurance from './FormReassurance';

const LEAD_SOURCE = 'rental_income_calculator';
const MIN_BUDGET = 120000;
const MAX_BUDGET = 1500000;
const IPI_THRESHOLD = 168000;
const MANAGEMENT_FEE = 0.2;

// 2026 averages drawn from the market figures quoted elsewhere on the site.
const AREA_MODEL: Record<PropertyArea, { occupancy: number; ratePer100k: number; confotur: 'common' | 'select' }> = {
  'Punta Cana': { occupancy: 0.68, ratePer100k: 55, confotur: 'common' },
  'Cap Cana': { occupancy: 0.65, ratePer100k: 52, confotur: 'common' },
  Bayahibe: { occupancy: 0.6, ratePer100k: 50, confotur: 'common' },
  'La Romana': { occupancy: 0.58, ratePer100k: 48, confotur: 'common' },
  'Santo Domingo': { occupancy: 0.75, ratePer100k: 42, confotur: 'select' },
};

const KIND_MODEL = {
  condo: { label: 'Condo / Apartment', rateFactor: 1, upkeep: 0.025 },
  villa: { label: 'Villa', rateFactor: 1.1, upkeep: 0.035 },
} as const;

type Kind = keyof typeof KIND_MODEL;

function estimate(area: PropertyArea, kind: Kind, price: number) {
  const a = AREA_MODEL[area];
  const k = KIND_MODEL[kind];
  const nightly = (price / 100000) * a.ratePer100k * k.rateFactor;
  const gross = nightly * 365 * a.occupancy;
  const management = gross * MANAGEMENT_FEE;
  const operating = price * k.upkeep;
  const net = gross - management - operating;
  const transferSaved = price * 0.03;
  const ipiAnnual = Math.max(0, price - IPI_THRESHOLD) * 0.01;
  return {
    nightly,
    occupancy: a.occupancy,
    gross,
    grossLow: gross * 0.9,
    grossHigh: gross * 1.1,
    management,
    operating,
    net,
    netYield: net / price,
    transferSaved,
    ipiAnnual,
    ipi15: ipiAnnual * 15,
    confotur: a.confotur,
  };
}

function matchingListings(area: PropertyArea, price: number) {
  const inArea = PROPERTIES.filter((p) => p.area === area);
  const pool = inArea.length > 0 ? inArea : PROPERTIES;
  return [...pool].sort((x, y) => Math.abs(x.price - price) - Math.abs(y.price - price)).slice(0, 3);
}

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

export default function RentalIncomeCalculator() {
  const [area, setArea] = useState<PropertyArea>('Punta Cana');
  const [kind, setKind] = useState<Kind>('condo');
  const [price, setPrice] = useState(300000);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'unlocked' | 'error'>('idle');

  const result = useMemo(() => estimate(area, kind, price), [area, kind, price]);
  const listings = useMemo(() => matchingListings(area, price), [area, price]);
  const unlocked = status === 'unlocked';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const { error } = await supabase.from('contacts').insert([
        {
          name: name.trim(),
          email: email.trim(),
          message:
            `[Lead source: ${LEAD_SOURCE}] Rental income estimate requested. ` +
            `Area: ${area}. Type: ${KIND_MODEL[kind].label}. Budget: ${formatUSD(price)}. ` +
            `Est. gross: ${formatUSD(result.gross)}/yr. Est. net: ${formatUSD(result.net)}/yr (${pct(result.netYield)}).`,
        },
      ]);
      if (error) throw new Error(error.message);
      trackLead({ contentName: LEAD_SOURCE });
      setStatus('unlocked');
    } catch (err) {
      console.error('Calculator lead failed:', err);
      setStatus('error');
    }
  };

  const callLink = whatsappLink(
    `Hi Harold, I used your rental income calculator (${KIND_MODEL[kind].label} in ${area}, around ${formatUSD(price)}). I'd like to book a free 15-minute strategy call.`,
  );

  return (
    <section id="calculator" aria-labelledby="calculator-heading" className="py-24 md:py-32 bg-beige-light scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="font-lato text-xs uppercase tracking-[0.28em] text-[#B08C4F] mb-5">Free Investor Tool</p>
          <h2 id="calculator-heading" className="font-montserrat text-4xl sm:text-5xl md:text-6xl font-light text-charcoal uppercase tracking-wider leading-tight mb-6">
            What Could Your Property Earn?
          </h2>
          <p className="font-lato text-lg text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
            Pick an area, a property type and a budget. See your estimated rental income in seconds, based on 2026 market numbers.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-3 bg-cream p-6 sm:p-10 border border-charcoal/10">
            <div className="flex items-center gap-3 mb-8">
              <Calculator className="w-5 h-5 text-[#B08C4F]" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="font-montserrat text-sm uppercase tracking-widest text-charcoal">Your scenario</h3>
            </div>

            <fieldset className="mb-8">
              <legend className="font-lato text-xs uppercase tracking-widest text-charcoal/70 mb-3">Area</legend>
              <div className="flex flex-wrap gap-2">
                {AREAS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setArea(a)}
                    aria-pressed={area === a}
                    className={`font-lato text-sm px-4 py-2 border transition-all duration-200 ${
                      area === a ? 'bg-charcoal text-cream border-charcoal' : 'text-charcoal border-charcoal/20 hover:border-charcoal/60'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="mb-8">
              <legend className="font-lato text-xs uppercase tracking-widest text-charcoal/70 mb-3">Property type</legend>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(KIND_MODEL) as Kind[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKind(k)}
                    aria-pressed={kind === k}
                    className={`font-lato text-sm px-4 py-3 border transition-all duration-200 ${
                      kind === k ? 'bg-charcoal text-cream border-charcoal' : 'text-charcoal border-charcoal/20 hover:border-charcoal/60'
                    }`}
                  >
                    {KIND_MODEL[k].label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mb-10">
              <div className="flex items-baseline justify-between mb-3">
                <label htmlFor="calc-budget" className="font-lato text-xs uppercase tracking-widest text-charcoal/70">
                  Purchase budget
                </label>
                <span className="font-montserrat text-2xl font-light text-charcoal">{formatUSD(price)}</span>
              </div>
              <input
                id="calc-budget"
                type="range"
                min={MIN_BUDGET}
                max={MAX_BUDGET}
                step={10000}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full accent-[#B08C4F] cursor-pointer"
              />
              <div className="flex justify-between font-lato text-xs text-charcoal/50 mt-1">
                <span>{formatUSD(MIN_BUDGET)}</span>
                <span>{formatUSD(MAX_BUDGET)}+</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-charcoal/10 border border-charcoal/10" aria-live="polite">
              <div className="bg-cream p-5">
                <p className="font-lato text-xs uppercase tracking-widest text-charcoal/60 mb-2">Nightly rate</p>
                <p className="font-montserrat text-2xl font-light text-charcoal">{formatUSD(result.nightly)}</p>
              </div>
              <div className="bg-cream p-5">
                <p className="font-lato text-xs uppercase tracking-widest text-charcoal/60 mb-2">Occupancy</p>
                <p className="font-montserrat text-2xl font-light text-charcoal">{Math.round(result.occupancy * 100)}%</p>
              </div>
              <div className="bg-cream p-5">
                <p className="font-lato text-xs uppercase tracking-widest text-charcoal/60 mb-2">Gross / year</p>
                <p className="font-montserrat text-lg font-light text-charcoal leading-tight">
                  {formatUSD(result.grossLow)}&ndash;{formatUSD(result.grossHigh)}
                </p>
              </div>
            </div>

            <div className="relative mt-6 border border-charcoal/10 p-5">
              <div className={`grid grid-cols-2 gap-4 transition-all duration-500 ${unlocked ? '' : 'blur-sm select-none'}`} aria-hidden={!unlocked}>
                <div>
                  <p className="font-lato text-xs uppercase tracking-widest text-charcoal/60 mb-1">Net income / year</p>
                  <p className="font-montserrat text-2xl font-light text-charcoal">{unlocked ? formatUSD(result.net) : '$00,000'}</p>
                </div>
                <div>
                  <p className="font-lato text-xs uppercase tracking-widest text-charcoal/60 mb-1">Net return</p>
                  <p className="font-montserrat text-2xl font-light text-charcoal">{unlocked ? pct(result.netYield) : '0.0%'}</p>
                </div>
              </div>
              {!unlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-cream/60">
                  <p className="inline-flex items-center gap-2 font-lato text-xs uppercase tracking-widest text-charcoal">
                    <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                    Net income, costs and tax savings in your full report
                  </p>
                </div>
              )}
            </div>

            <p className="font-lato text-xs text-charcoal/50 leading-relaxed mt-6">
              Estimates use 2026 market averages for short-term rentals, a {MANAGEMENT_FEE * 100}% management fee and typical HOA, insurance and upkeep costs. Real results vary by building, season and management. This is not a guarantee of income.
            </p>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            {unlocked ? (
              <div className="bg-charcoal text-cream p-8 animate-fade-in">
                <div className="flex items-center gap-2 mb-6">
                  <Unlock className="w-4 h-4 text-[#B08C4F]" aria-hidden="true" />
                  <p className="font-lato text-xs uppercase tracking-[0.24em] text-cream/70">Your full report</p>
                </div>

                <dl className="space-y-3 font-lato text-sm mb-8">
                  {[
                    ['Gross rental income', formatUSD(result.gross)],
                    ['Management (20%)', `- ${formatUSD(result.management)}`],
                    ['HOA, insurance & upkeep', `- ${formatUSD(result.operating)}`],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 text-cream/80">
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                  <div className="flex justify-between gap-4 pt-3 border-t border-cream/15 text-cream">
                    <dt className="uppercase tracking-wider text-xs self-center">Estimated net / year</dt>
                    <dd className="font-montserrat text-xl font-light">{formatUSD(result.net)}</dd>
                  </div>
                </dl>

                <div className="bg-cream/5 border border-cream/10 p-5 mb-8">
                  <p className="font-lato text-xs uppercase tracking-widest text-[#B08C4F] mb-3">CONFOTUR tax savings</p>
                  <p className="font-lato text-sm text-cream/80 leading-relaxed">
                    On an approved project you could skip about <span className="text-cream">{formatUSD(result.transferSaved)}</span> in transfer tax
                    {result.ipiAnnual > 0 && (
                      <> and about <span className="text-cream">{formatUSD(result.ipiAnnual)}/year</span> in property tax, up to <span className="text-cream">{formatUSD(result.ipi15)}</span> over 15 years</>
                    )}
                    .
                  </p>
                  {result.confotur === 'select' && (
                    <p className="font-lato text-xs text-cream/60 mt-2">In Santo Domingo only some projects qualify. Harold will tell you which ones do.</p>
                  )}
                </div>

                <p className="font-lato text-xs uppercase tracking-widest text-cream/60 mb-3">Listings that fit</p>
                <ul className="space-y-3 mb-8">
                  {listings.map((p) => (
                    <li key={p.title}>
                      <a
                        href={whatsappLink(`Hi Harold, the calculator matched me with ${p.title} (${formatUSD(p.price)}). Can you send me details?`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackContact('whatsapp_calculator_listing')}
                        className="flex items-center gap-4 group"
                      >
                        <img src={p.image} alt="" className="w-16 h-12 object-cover flex-shrink-0" loading="lazy" decoding="async" width="64" height="48" />
                        <span className="min-w-0">
                          <span className="block font-lato text-sm text-cream truncate group-hover:underline underline-offset-4">{p.title}</span>
                          <span className="block font-lato text-xs text-cream/60">{p.location} &middot; {formatUSD(p.price)}</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>

                <a
                  href={callLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackContact('strategy_call_calculator')}
                  className="block w-full text-center bg-cream text-charcoal px-6 py-4 text-sm uppercase tracking-widest font-lato hover:bg-white transition-colors"
                >
                  Book a Free 15-Min Strategy Call
                </a>
                <p className="font-lato text-xs text-cream/60 text-center mt-3">A copy of your numbers is on its way to Harold, who will follow up within 24 hours.</p>
              </div>
            ) : (
              <>
                <figure className="bg-cream border-l-2 border-[#B08C4F] p-6">
                  <Quote className="w-5 h-5 text-[#B08C4F] mb-3" strokeWidth={1.5} aria-hidden="true" />
                  <blockquote className="font-lato text-charcoal/80 italic leading-relaxed text-[15px]">
                    "As a US-based investor, I bought two CONFOTUR condos in Cap Cana through Harold. He found properties earning 11% a year and handled everything remotely."
                  </blockquote>
                  <figcaption className="font-montserrat text-xs uppercase tracking-wider text-charcoal mt-4">
                    Ana Martinez <span className="font-lato text-charcoal/60 normal-case tracking-normal">&middot; Investor, Cap Cana</span>
                  </figcaption>
                </figure>

                <form onSubmit={handleSubmit} className="bg-charcoal text-cream p-8 space-y-5">
                  <div>
                    <p className="font-lato text-xs uppercase tracking-[0.24em] text-cream/60 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                      Free full report
                    </p>
                    <h3 className="font-montserrat text-2xl font-light uppercase tracking-wider">Unlock your numbers</h3>
                    <p className="font-lato text-sm text-cream/70 mt-2 leading-relaxed">
                      Net income, every cost, your CONFOTUR savings and 3 listings that fit your budget.
                    </p>
                  </div>

                  {status === 'error' && (
                    <div className="bg-red-500/20 border border-red-500/70 p-4 flex items-start gap-3 animate-fade-in" role="alert">
                      <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <p className="font-lato text-cream text-sm">We couldn't unlock your report. Please try again.</p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="calc-name" className="font-lato text-xs uppercase tracking-widest text-cream/70 mb-2 block">First name</label>
                    <input
                      id="calc-name"
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
                    <label htmlFor="calc-email" className="font-lato text-xs uppercase tracking-widest text-cream/70 mb-2 block">Email</label>
                    <input
                      id="calc-email"
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
                    className="w-full bg-cream text-charcoal px-6 py-4 text-sm uppercase tracking-widest font-lato hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? 'Unlocking...' : 'Show My Full Report'}
                  </button>
                  <FormReassurance
                    trackingLabel="whatsapp_calculator_form"
                    whatsappText={`Hi Harold, I'm looking at a ${KIND_MODEL[kind].label.toLowerCase()} in ${area} around ${formatUSD(price)}. Can we talk?`}
                  />
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
