import { supabase } from './supabase';

export const SITE_URL = 'https://www.primerealestatedr.com';

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_html: string;
  meta_title: string;
  meta_description: string;
  featured_image: string | null;
  published_at: string;
  updated_at: string;
};

export type BlogPostSummary = Omit<BlogPost, 'content_html' | 'meta_title' | 'meta_description'>;

const SUMMARY_COLUMNS = 'id, slug, title, excerpt, featured_image, published_at, updated_at';

export async function fetchPostSummaries(limit = 60, excludeSlug?: string): Promise<BlogPostSummary[]> {
  let query = supabase
    .from('blog_posts')
    .select(SUMMARY_COLUMNS)
    .order('published_at', { ascending: false })
    .limit(limit);
  if (excludeSlug) query = query.neq('slug', excludeSlug);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as BlogPostSummary[];
}

export async function fetchPost(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`${SUMMARY_COLUMNS}, content_html, meta_title, meta_description`)
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data as BlogPost | null;
}

export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function readingMinutes(html: string): number {
  const words = html.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 225));
}

function upsertHeadTag(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function setMeta(key: 'name' | 'property', name: string, content: string) {
  upsertHeadTag(`meta[${key}="${name}"]`, () => {
    const m = document.createElement('meta');
    m.setAttribute(key, name);
    return m;
  }, 'content', content);
}

export function setPageMeta(opts: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: Record<string, unknown>;
}) {
  const url = `${SITE_URL}${opts.path}`;
  document.title = opts.title;
  setMeta('name', 'description', opts.description);
  setMeta('name', 'robots', opts.noindex ? 'noindex, follow' : 'index, follow');
  setMeta('property', 'og:title', opts.title);
  setMeta('property', 'og:description', opts.description);
  setMeta('property', 'og:url', url);
  setMeta('property', 'og:type', opts.type ?? 'website');
  if (opts.image) setMeta('property', 'og:image', opts.image);
  setMeta('name', 'twitter:title', opts.title);
  setMeta('name', 'twitter:description', opts.description);
  if (opts.image) setMeta('name', 'twitter:image', opts.image);
  upsertHeadTag('link[rel="canonical"]', () => {
    const l = document.createElement('link');
    l.setAttribute('rel', 'canonical');
    return l;
  }, 'href', url);

  document.getElementById('blog-jsonld')?.remove();
  if (opts.jsonLd) {
    const script = document.createElement('script');
    script.id = 'blog-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(opts.jsonLd);
    document.head.appendChild(script);
  }
}
