declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
const GA4_ID = import.meta.env.VITE_GA4_ID as string | undefined;
const GOOGLE_ADS_ID = import.meta.env.VITE_GOOGLE_ADS_ID as string | undefined;
const GOOGLE_ADS_LEAD_LABEL = import.meta.env.VITE_GOOGLE_ADS_LEAD_LABEL as string | undefined;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let initialized = false;

const injectScript = (src: string, inline?: string) => {
  const s = document.createElement('script');
  s.async = true;
  if (src) s.src = src;
  if (inline) s.text = inline;
  document.head.appendChild(s);
  return s;
};

const initMetaPixel = (id: string) => {
  injectScript(
    '',
    `!function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${id}');`
  );

  const noscript = document.createElement('noscript');
  const img = document.createElement('img');
  img.height = 1;
  img.width = 1;
  img.style.display = 'none';
  img.src = `https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`;
  noscript.appendChild(img);
  document.body.appendChild(noscript);
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

const genEventId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const readCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : undefined;
};

interface UserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  city?: string;
}

interface CustomData {
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
}

const postToCapi = (eventName: string, eventId: string, userData: UserData, customData: CustomData) => {
  if (!META_PIXEL_ID || !SUPABASE_URL || !SUPABASE_ANON_KEY) return;
  const payload = {
    event_name: eventName,
    event_id: eventId,
    event_source_url: typeof window !== 'undefined' ? window.location.href : undefined,
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website' as const,
    user_data: {
      ...userData,
      fbp: readCookie('_fbp'),
      fbc: readCookie('_fbc'),
    },
    custom_data: customData,
  };
  fetch(`${SUPABASE_URL}/functions/v1/meta-capi`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch((err) => console.error('CAPI post failed:', err));
};

export const initTracking = () => {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  if (META_PIXEL_ID) {
    initMetaPixel(META_PIXEL_ID);
    const pageEventId = genEventId();
    window.fbq?.('track', 'PageView', {}, { eventID: pageEventId });
    postToCapi('PageView', pageEventId, {}, {});
  }

  const gtagIds = [GA4_ID, GOOGLE_ADS_ID].filter((x): x is string => Boolean(x));
  if (gtagIds.length) initGtag(gtagIds);
};

type LeadParams = { value?: number; currency?: string; contentName?: string; userData?: UserData };

export const trackLead = (params: LeadParams = {}) => {
  const { value, currency = 'USD', contentName, userData = {} } = params;
  const eventId = genEventId();
  const customData: CustomData = { value, currency, content_name: contentName };

  window.fbq?.('track', 'Lead', customData, { eventID: eventId });
  window.gtag?.('event', 'generate_lead', { value, currency, content_name: contentName });
  if (GOOGLE_ADS_ID && GOOGLE_ADS_LEAD_LABEL) {
    window.gtag?.('event', 'conversion', {
      send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LEAD_LABEL}`,
      value,
      currency,
    });
  }
  postToCapi('Lead', eventId, userData, customData);
};

export const trackContact = (method: string, userData: UserData = {}) => {
  const eventId = genEventId();
  const customData: CustomData = { content_name: method };
  window.fbq?.('track', 'Contact', customData, { eventID: eventId });
  window.gtag?.('event', 'contact', { method });
  postToCapi('Contact', eventId, userData, customData);
};

export const trackViewContent = (params: { contentName: string; value?: number; currency?: string; userData?: UserData }) => {
  const { contentName, value, currency = 'USD', userData = {} } = params;
  const eventId = genEventId();
  const customData: CustomData = { content_name: contentName, value, currency };
  window.fbq?.('track', 'ViewContent', customData, { eventID: eventId });
  window.gtag?.('event', 'view_item', {
    items: [{ item_name: contentName, price: value, currency }],
  });
  postToCapi('ViewContent', eventId, userData, customData);
};
