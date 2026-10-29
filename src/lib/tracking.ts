declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GTM_ID = 'GTM-5T8KX4BJ';
const GA4_ID = 'G-P3F80FDS7W';
const GOOGLE_ADS_ID = import.meta.env.VITE_GOOGLE_ADS_ID as string | undefined;
const GOOGLE_ADS_LEAD_LABEL = import.meta.env.VITE_GOOGLE_ADS_LEAD_LABEL as string | undefined;

const CONSENT_KEY = 'cookie_consent_v1';

export type ConsentChoice = 'granted' | 'denied';

let loaded = false;

export const getConsent = (): ConsentChoice | null => {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
};

const injectScript = (src: string) => {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
};

const ensureGtag = () => {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      window.dataLayer!.push(arguments);
    };
  }
};

const consentState = (choice: ConsentChoice) => ({
  ad_storage: choice,
  ad_user_data: choice,
  ad_personalization: choice,
  analytics_storage: choice,
});

const loadTrackers = () => {
  if (loaded) return;
  loaded = true;

  ensureGtag();
  window.gtag!('consent', 'default', consentState('granted'));
  window.dataLayer!.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  injectScript(`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`);

  injectScript(`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`);
  window.gtag!('js', new Date());
  window.gtag!('config', GA4_ID);
  if (GOOGLE_ADS_ID) window.gtag!('config', GOOGLE_ADS_ID, { send_page_view: true });
};

export const initTracking = () => {
  if (typeof window === 'undefined' || getConsent() !== 'granted') return;
  if (document.readyState === 'complete') loadTrackers();
  else window.addEventListener('load', loadTrackers, { once: true });
};

export const setConsent = (choice: ConsentChoice) => {
  try {
    localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // Storage blocked: the choice still applies for this visit.
  }
  if (choice === 'granted') {
    loadTrackers();
  } else if (loaded) {
    window.gtag?.('consent', 'update', consentState('denied'));
  }
};

type LeadParams = { value?: number; currency?: string; contentName?: string };

export const trackLead = (params: LeadParams = {}) => {
  const { value, currency = 'USD', contentName } = params;

  window.gtag?.('event', 'generate_lead', { value, currency, content_name: contentName });
  if (GOOGLE_ADS_ID && GOOGLE_ADS_LEAD_LABEL) {
    window.gtag?.('event', 'conversion', {
      send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LEAD_LABEL}`,
      value,
      currency,
    });
  }
};

export const trackContact = (method: string) => {
  window.gtag?.('event', 'contact', { method });
};

export const trackViewContent = (params: { contentName: string; value?: number; currency?: string }) => {
  const { contentName, value, currency = 'USD' } = params;
  window.gtag?.('event', 'view_item', {
    items: [{ item_name: contentName, price: value, currency }],
  });
};
