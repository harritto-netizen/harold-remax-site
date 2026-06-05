declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GOOGLE_ADS_ID = import.meta.env.VITE_GOOGLE_ADS_ID as string | undefined;
const GOOGLE_ADS_LEAD_LABEL = import.meta.env.VITE_GOOGLE_ADS_LEAD_LABEL as string | undefined;

let initialized = false;

const injectScript = (src: string) => {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
  return s;
};

export const initTracking = () => {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  if (GOOGLE_ADS_ID) {
    window.addEventListener('load', () => {
      injectScript(`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`);
      window.dataLayer = window.dataLayer || [];
      if (!window.gtag) {
        window.gtag = function gtag() {
          window.dataLayer!.push(arguments);
        };
        window.gtag('js', new Date());
      }
      window.gtag!('config', GOOGLE_ADS_ID, { send_page_view: true });
    }, { once: true });
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
