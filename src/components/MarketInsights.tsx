import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

interface MarketArticle {
  title: string;
  excerpt: string;
  source_url: string;
  source_name: string;
  image_url: string;
  category: string;
  published_at: string;
}

const FALLBACK_ARTICLES: MarketArticle[] = [
  {
    title: 'Dominican Republic Real Estate Market Forecast 2026: Record Foreign Investment Drives Growth',
    excerpt: 'The DR real estate market is experiencing unprecedented growth in 2026 with foreign investment up 34% year-over-year. Punta Cana and Cap Cana lead with average property appreciation of 12-18% annually.',
    source_url: '#',
    source_name: 'Market Report',
    image_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Market Analysis',
    published_at: new Date().toISOString(),
  },
  {
    title: 'Why Remote Workers Are Buying Homes in Punta Cana and Cap Cana in 2026',
    excerpt: 'The digital nomad visa program and fiber-optic infrastructure expansion are attracting remote professionals to purchase condos and villas in Punta Cana.',
    source_url: '#',
    source_name: 'Lifestyle',
    image_url: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Lifestyle',
    published_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    title: 'Santo Domingo Luxury Condo Boom: New Developments and Investment Returns',
    excerpt: 'Santo Domingo is experiencing a luxury condo construction boom along the Malecon and in Naco district with rental yields averaging 8-10% for furnished short-term rentals.',
    source_url: '#',
    source_name: 'Investment',
    image_url: 'https://images.pexels.com/photos/2476632/pexels-photo-2476632.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Investment',
    published_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

const CACHE_KEY = 'market_insights_cache';
const CACHE_DURATION = 1000 * 60 * 60 * 4; // 4 hours

function getCachedArticles(): MarketArticle[] | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const { articles, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) return null;
    return articles;
  } catch {
    return null;
  }
}

function setCachedArticles(articles: MarketArticle[]) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ articles, timestamp: Date.now() })
    );
  } catch {
    // localStorage may be unavailable
  }
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

function trackContact(source: string) {
  if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).gtag) {
    (window as unknown as Record<string, (...args: unknown[]) => void>).gtag('event', 'contact_click', { event_category: 'engagement', event_label: source });
  }
}

export default function MarketInsights() {
  const [articles, setArticles] = useState<MarketArticle[]>(() => {
    return getCachedArticles() || FALLBACK_ARTICLES;
  });
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const cached = getCachedArticles();
    if (cached) {
      setArticles(cached);
      setIsLive(true);
      return;
    }

    const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? '').trim();
    const supabaseKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim();
    if (!supabaseUrl || !supabaseKey) return;

    const controller = new AbortController();

    (async () => {
      try {
        const response = await fetch(
          `${supabaseUrl}/functions/v1/fetch-market-insights`,
          {
            headers: {
              Authorization: `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          }
        );

        if (!response.ok) return;

        const data = await response.json();
        if (data.articles && data.articles.length >= 3) {
          setArticles(data.articles.slice(0, 6));
          setCachedArticles(data.articles.slice(0, 6));
          setIsLive(true);
        }
      } catch {
        // Silently fall back to default articles
      }
    })();

    return () => controller.abort();
  }, []);

  const displayArticles = articles.slice(0, 3);

  return (
    <section id="blog" className="py-24 md:py-32 bg-beige-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-20">
          <h2 className="font-montserrat text-4xl sm:text-5xl md:text-6xl font-light text-charcoal uppercase tracking-wider mb-6">
            Market Insights
          </h2>
          <p className="font-lato text-lg text-charcoal/70 max-w-2xl mx-auto">
            {isLive
              ? 'Latest news and analysis on Dominican Republic real estate trends and investment opportunities'
              : 'Expert analysis on Dominican Republic real estate trends, investment opportunities, and market forecasts for 2026'}
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayArticles.map((article, index) => (
            <ScrollReveal key={article.source_url + index} delay={index * 150}>
              <article
                className="group"
                itemScope
                itemType="https://schema.org/BlogPosting"
              >
                <meta
                  itemProp="author"
                  content="Harold - RE/MAX Next Door"
                />
                <meta itemProp="publisher" content="RE/MAX Next Door" />
                <meta itemProp="datePublished" content={article.published_at} />
                <div className="h-64 overflow-hidden mb-4 relative">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    width="400"
                    height="256"
                    itemProp="image"
                  />
                  <span className="absolute top-4 left-4 bg-charcoal/80 text-cream font-lato text-xs uppercase tracking-wider px-3 py-1">
                    {article.category}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <p className="font-lato text-xs text-charcoal/50 uppercase tracking-wider">
                    {formatDate(article.published_at)}
                  </p>
                  {article.source_name && article.source_name !== 'News' && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-charcoal/30"></span>
                      <p className="font-lato text-xs text-charcoal/50 uppercase tracking-wider">
                        {article.source_name}
                      </p>
                    </>
                  )}
                </div>
                <h3
                  className="font-montserrat text-lg uppercase tracking-wide text-charcoal mb-3 group-hover:opacity-60 transition-opacity leading-tight line-clamp-3"
                  itemProp="headline"
                >
                  {article.title}
                </h3>
                <p
                  className="font-lato text-charcoal/70 mb-4 leading-relaxed text-sm line-clamp-3"
                  itemProp="description"
                >
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-4">
                  {isLive && article.source_url !== '#' && (
                    <a
                      href={article.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-lato text-sm text-charcoal/60 uppercase tracking-widest hover:text-charcoal transition-colors pb-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Read Article
                    </a>
                  )}
                  <a
                    href={`https://wa.me/18094262269?text=${encodeURIComponent(`Hi Harold, I just read about "${article.title}" and would like to learn more about investment opportunities.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackContact('blog_cta')}
                    className="inline-block font-lato text-sm text-charcoal uppercase tracking-widest border-b border-charcoal hover:opacity-60 transition-opacity pb-1"
                  >
                    Discuss With Harold
                  </a>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
