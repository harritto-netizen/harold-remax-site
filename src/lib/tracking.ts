declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA4_ID = import.meta.env.VITE_GA4_ID as string | undefined;
const GOOGLE_ADS_ID = import.meta.env.VITE_GOOGLE_ADS_ID as string | undefined;
const GOOGLE_ADS_LEAD_LABEL = import.meta.env.VITE_GOOGLE_ADS_LEAD_LABEL as string | undefined;

let initialized = false;

const injectScript = (src: string, inline?: string) => {
  const s = document.createElement('script');
  s.async = true;
  if (src) s.src = src;
  if (inline) s.text = inline;
  document.head.appendChild(s);
  return s;
};

const initGtag = (ids: string[]) => {
  if (!ids.length) return;
  injectScript(`https://www.googletagmanager.com/gtag/js?id=${ids[0]}`);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  ids.forEach((id) => window.gtag!('config', id, { send_page_view: true }));
};

export const initTracking = () => {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  const gtagIds = [GA4_ID, GOOGLE_ADS_ID].filter((x): x is string => Boolean(x));
  if (gtagIds.length) initGtag(gtagIds);
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
