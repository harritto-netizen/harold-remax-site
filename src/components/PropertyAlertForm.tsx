import { useState, useEffect, FormEvent } from 'react';
import { Bell, CheckCircle, AlertCircle, Star } from 'lucide-react';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../lib/supabase';
import { trackLead } from '../lib/tracking';

interface PropertyAlertFormProps {
  initialLocation?: string;
  initialPropertyType?: string;
}

export default function PropertyAlertForm({ initialLocation = '', initialPropertyType = '' }: PropertyAlertFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    property_type: initialPropertyType,
    location: initialLocation,
    price_min: '',
    price_max: ''
  });

  useEffect(() => {
    if (initialLocation || initialPropertyType) {
      setFormData((prev) => ({
        ...prev,
        location: initialLocation || prev.location,
        property_type: initialPropertyType || prev.property_type,
      }));
    }
  }, [initialLocation, initialPropertyType]);
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('loading');
    setErrorMessage('');

    try {
      const alertData = {
        email: formData.email,
        name: formData.name || null,
        phone: formData.phone || null,
        property_type: formData.property_type || null,
        location: formData.location || null,
        price_min: formData.price_min ? parseInt(formData.price_min) : null,
        price_max: formData.price_max ? parseInt(formData.price_max) : null,
        is_active: true
      };

      const response = await fetch(`/api/send-property-alert-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
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

      const [firstName, ...restName] = (formData.name || '').trim().split(/\s+/);
      trackLead({
        contentName: 'property_alert_form',
        userData: {
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          firstName: firstName || undefined,
          lastName: restName.length ? restName.join(' ') : undefined,
          city: formData.location || undefined,
        },
      });
      setFormStatus('success');
      setFormData({
        email: '',
        name: '',
        phone: '',
        property_type: '',
        location: '',
        price_min: '',
        price_max: ''
      });

      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
    } catch (error: any) {
      setFormStatus('error');
      const detail = error?.message || String(error);
      const urlInfo = SUPABASE_URL ? SUPABASE_URL.slice(0, 40) : 'MISSING_URL';
      const keyInfo = SUPABASE_ANON_KEY ? `key_len=${SUPABASE_ANON_KEY.length}` : 'MISSING_KEY';
      setErrorMessage(`${detail} | ${urlInfo} | ${keyInfo}`);
      console.error('Form submit failed:', error);
    }
  };

  return (
    <div className="bg-charcoal text-cream p-8 md:p-12">
      <div className="flex items-center justify-center mb-6">
        <Bell className="w-8 h-8 text-cream mr-3" />
        <h3 className="font-montserrat text-2xl sm:text-3xl font-light uppercase tracking-wider">
          Property Alerts
        </h3>
      </div>
      <p className="font-lato text-cream/80 text-center mb-4 max-w-2xl mx-auto">
        See new luxury listings <strong className="font-normal text-cream">48 hours before they go public</strong>. Off-market villas, penthouses and investment properties across the Dominican Republic.
      </p>
      <div className="flex items-center justify-center gap-2 mb-8 text-cream/70">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-cream text-cream" />
          ))}
        </div>
        <span className="font-lato text-xs uppercase tracking-wider">Trusted by 500+ buyers and investors</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
        {formStatus === 'success' && (
          <div className="bg-green-500/20 border border-green-500 p-4 flex items-start space-x-3 animate-fade-in">
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-montserrat text-sm uppercase tracking-wider text-green-400 mb-1">Subscribed!</h4>
              <p className="font-lato text-cream text-sm">You'll receive alerts for new properties matching your preferences.</p>
            </div>
          </div>
        )}
        {formStatus === 'error' && (
          <div className="bg-red-500/20 border border-red-500 p-4 flex items-start space-x-3 animate-fade-in">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-montserrat text-sm uppercase tracking-wider text-red-400 mb-1">Error</h4>
              <p className="font-lato text-cream text-sm">{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="alert-email" className="font-lato text-sm text-cream/90 uppercase tracking-wider mb-2 block">Email *</label>
            <input
              id="alert-email"
              type="email"
              required
              aria-required="true"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream focus:border-cream focus:outline-none transition-all font-lato placeholder-cream/40"
              placeholder="you@email.com"
              disabled={formStatus === 'loading'}
            />
          </div>
          <div>
            <label htmlFor="alert-name" className="font-lato text-sm text-cream/90 uppercase tracking-wider mb-2 block">Name</label>
            <input
              id="alert-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream focus:border-cream focus:outline-none transition-all font-lato placeholder-cream/40"
              placeholder="Your name"
              disabled={formStatus === 'loading'}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="alert-property-type" className="font-lato text-sm text-cream/90 uppercase tracking-wider mb-2 block">Property Type</label>
            <select
              id="alert-property-type"
              value={formData.property_type}
              onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
              className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream focus:border-cream focus:outline-none transition-all font-lato [&>option]:bg-charcoal [&>option]:text-cream"
              disabled={formStatus === 'loading'}
            >
              <option value="">Any</option>
              <option value="villa">Villa</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="penthouse">Penthouse</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          <div>
            <label htmlFor="alert-location" className="font-lato text-sm text-cream/90 uppercase tracking-wider mb-2 block">Location</label>
            <select
              id="alert-location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream focus:border-cream focus:outline-none transition-all font-lato [&>option]:bg-charcoal [&>option]:text-cream"
              disabled={formStatus === 'loading'}
            >
              <option value="">Any</option>
              <option value="Santo Domingo">Santo Domingo</option>
              <option value="Punta Cana">Punta Cana</option>
              <option value="Cap Cana">Cap Cana</option>
              <option value="Bayahibe">Bayahibe</option>
              <option value="La Romana">La Romana</option>
              <option value="Casa de Campo">Casa de Campo</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="alert-price-min" className="font-lato text-sm text-cream/90 uppercase tracking-wider mb-2 block">Min Price (USD)</label>
            <input
              id="alert-price-min"
              type="number"
              value={formData.price_min}
              onChange={(e) => setFormData({ ...formData, price_min: e.target.value })}
              className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream focus:border-cream focus:outline-none transition-all font-lato placeholder-cream/40"
              placeholder="100000"
              min="0"
              disabled={formStatus === 'loading'}
            />
          </div>
          <div>
            <label htmlFor="alert-price-max" className="font-lato text-sm text-cream/90 uppercase tracking-wider mb-2 block">Max Price (USD)</label>
            <input
              id="alert-price-max"
              type="number"
              value={formData.price_max}
              onChange={(e) => setFormData({ ...formData, price_max: e.target.value })}
              className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream focus:border-cream focus:outline-none transition-all font-lato placeholder-cream/40"
              placeholder="500000"
              min="0"
              disabled={formStatus === 'loading'}
            />
          </div>
        </div>

        <div>
          <label htmlFor="alert-phone" className="font-lato text-sm text-cream/90 uppercase tracking-wider mb-2 block">Phone (optional)</label>
          <input
            id="alert-phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream focus:border-cream focus:outline-none transition-all font-lato placeholder-cream/40"
            placeholder="809-000-0000"
            disabled={formStatus === 'loading'}
          />
        </div>

        <div className="flex justify-center">
          <div className="cf-turnstile" data-sitekey="0x4AAAAAACIywdosyC_96b7n"></div>
        </div>

        <button
          type="submit"
          disabled={formStatus === 'loading'}
          className="w-full border-2 border-cream text-cream px-8 py-4 text-sm uppercase tracking-widest hover:bg-cream hover:text-charcoal transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-lato"
        >
          {formStatus === 'loading' ? 'Subscribing...' : 'Get Property Alerts'}
        </button>
      </form>
    </div>
  );
}
