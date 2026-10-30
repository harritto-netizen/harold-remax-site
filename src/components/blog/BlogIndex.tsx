import { useEffect, useState } from 'react';
import { AlertTriangle, MessageCircle } from 'lucide-react';
import BlogLayout, { BLOG_WHATSAPP } from './BlogLayout';
import PostCard, { toCardPost } from './PostCard';
import ScrollReveal from '../ScrollReveal';
import { fetchPostSummaries, setPageMeta, SITE_URL, type BlogPostSummary } from '../../lib/blog';
import { trackContact } from '../../lib/tracking';

const ARCHIVE = [
  {
    href: '/blog/punta-cana-vs-cap-cana-vs-santo-domingo-where-to-buy-2026',
    title: 'Punta Cana vs Cap Cana vs Santo Domingo: Where to Buy',
    excerpt: 'Prices per m2, rental yields, occupancy and CONFOTUR benefits compared side by side.',
    featured_image: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800',
    dateLabel: 'Market Analysis',
  },
  {
    href: '/blog/living-investing-evaristo-morales-santo-domingo-real-estate',
    title: 'Living and Investing in Evaristo Morales',
    excerpt: "Why Evaristo Morales is one of Santo Domingo's premier neighborhoods for luxury living and investment.",
    featured_image: 'https://euwpcnaioorzkhmwfnjn.supabase.co/storage/v1/object/public/creative-assets/images/4ddaebfa-fe2e-4924-8717-dd1332c732e7/1787761402669-jkfd9n4p26d.jpeg',
    dateLabel: 'Neighborhood Guide',
  },
  {
    href: '/blog/confotur-tax-savings',
    title: 'CONFOTUR Tax Savings Explained',
    excerpt: 'How Law 158-01 removes transfer, property and rental income tax for 15 years on qualifying properties.',
    featured_image: '/d-2574-1765469617-c45431a7-3384-488b-b949-0103dfb4aa72.png',
    dateLabel: 'Tax Planning',
  },
];

export default function BlogIndex() {
  const [posts, setPosts] = useState<BlogPostSummary[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setPageMeta({
      title: 'Journal | Dominican Republic Real Estate Insights | RE/MAX Next Door',
      description: 'Market analysis, neighborhood guides and buying advice for Dominican Republic real estate from Harold at RE/MAX Next Door.',
      path: '/blog',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'RE/MAX Next Door Journal',
        url: `${SITE_URL}/blog`,
        publisher: { '@type': 'RealEstateAgent', name: 'RE/MAX Next Door', url: SITE_URL },
      },
    });
    fetchPostSummaries()
      .then(setPosts)
      .catch(() => setFailed(true));
  }, []);

  const [latest, ...rest] = posts ?? [];

  return (
    <BlogLayout>
      <section className="bg-beige-light border-b border-charcoal/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <p className="font-lato text-xs uppercase tracking-[0.3em] text-charcoal/50 mb-5">The Journal</p>
          <h1 className="font-montserrat text-4xl sm:text-5xl md:text-6xl font-light text-charcoal uppercase tracking-wider mb-6">
            Market Insights
          </h1>
          <p className="font-lato text-lg text-charcoal/70 max-w-2xl mx-auto mb-0">
            Expert analysis on Dominican Republic real estate trends, neighborhoods, taxes and investment opportunities.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24" aria-labelledby="latest-heading">
        <h2 id="latest-heading" className="sr-only">Latest articles</h2>

        {failed && (
          <div role="alert" className="flex items-start gap-3 border border-red-200 bg-red-50 text-red-800 p-5 mb-12">
            <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
            <p className="font-lato text-sm mb-0">We couldn't load the latest articles right now. Please refresh the page in a moment.</p>
          </div>
        )}

        {posts === null && !failed && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white border border-charcoal/10 animate-pulse">
                <div className="aspect-[16/10] bg-beige-light" />
                <div className="p-8 space-y-3">
                  <div className="h-3 w-1/3 bg-beige-light" />
                  <div className="h-5 w-4/5 bg-beige-light" />
                  <div className="h-3 w-full bg-beige-light" />
                </div>
              </div>
            ))}
          </div>
        )}

        {latest && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ScrollReveal className="md:col-span-2 lg:col-span-3 flex">
              <PostCard post={toCardPost(latest)} featured />
            </ScrollReveal>
            {rest.map((post) => (
              <ScrollReveal key={post.id} className="flex">
                <PostCard post={toCardPost(post)} />
              </ScrollReveal>
            ))}
          </div>
        )}

        {posts !== null && posts.length === 0 && (
          <p className="font-lato text-center text-charcoal/60 mx-auto">New articles are on their way. In the meantime, explore our guides below.</p>
        )}
      </section>

      <section className="border-t border-charcoal/10 bg-cream" aria-labelledby="guides-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <h2 id="guides-heading" className="font-montserrat text-2xl sm:text-3xl font-light text-charcoal uppercase tracking-wider mb-10 text-center">
            Essential Guides
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ARCHIVE.map((post) => (
              <ScrollReveal key={post.href} className="flex">
                <PostCard post={post} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-charcoal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
          <h2 className="font-montserrat text-2xl sm:text-3xl font-light text-cream uppercase tracking-wider mb-4">Ready to find your property?</h2>
          <p className="font-lato text-cream/75 mx-auto mb-8">Talk to Harold directly for a personalized market analysis.</p>
          <a
            href={BLOG_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackContact('whatsapp_blog_index')}
            className="inline-flex items-center gap-2 bg-cream text-charcoal px-8 py-3 text-sm uppercase tracking-widest hover:bg-beige-light transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Message Harold
          </a>
        </div>
      </section>
    </BlogLayout>
  );
}
