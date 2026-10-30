import { useEffect, useState } from 'react';
import { AlertTriangle, ChevronRight, Clock, MessageCircle } from 'lucide-react';
import BlogLayout, { BLOG_WHATSAPP } from './BlogLayout';
import PostCard, { toCardPost } from './PostCard';
import {
  fetchPost,
  fetchPostSummaries,
  formatPostDate,
  readingMinutes,
  setPageMeta,
  SITE_URL,
  type BlogPost,
  type BlogPostSummary,
} from '../../lib/blog';
import { trackContact } from '../../lib/tracking';

type Status = 'loading' | 'ready' | 'not-found' | 'error';

export default function BlogArticle({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPostSummary[]>([]);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    let cancelled = false;
    fetchPost(slug)
      .then((found) => {
        if (cancelled) return;
        if (!found) {
          setStatus('not-found');
          setPageMeta({ title: 'Article not found | RE/MAX Next Door', description: 'This article could not be found.', path: `/blog/${slug}`, noindex: true });
          return;
        }
        setPost(found);
        setStatus('ready');
        const url = `${SITE_URL}/blog/${found.slug}`;
        const description = found.meta_description || found.excerpt;
        setPageMeta({
          title: `${found.meta_title || found.title} | RE/MAX Next Door`,
          description,
          path: `/blog/${found.slug}`,
          image: found.featured_image,
          type: 'article',
          jsonLd: {
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BlogPosting',
                headline: found.title,
                description,
                image: found.featured_image ?? undefined,
                datePublished: found.published_at,
                dateModified: found.updated_at,
                mainEntityOfPage: url,
                author: { '@type': 'Person', name: 'Harold', worksFor: { '@type': 'RealEstateAgent', name: 'RE/MAX Next Door' } },
                publisher: { '@type': 'RealEstateAgent', name: 'RE/MAX Next Door', url: SITE_URL },
              },
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                  { '@type': 'ListItem', position: 2, name: 'Journal', item: `${SITE_URL}/blog` },
                  { '@type': 'ListItem', position: 3, name: found.title, item: url },
                ],
              },
            ],
          },
        });
      })
      .catch(() => !cancelled && setStatus('error'));

    fetchPostSummaries(3, slug)
      .then((items) => !cancelled && setRelated(items))
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <BlogLayout>
      {status === 'loading' && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24 animate-pulse" aria-label="Loading article">
          <div className="h-3 w-40 bg-beige-light mb-8" />
          <div className="h-10 w-full bg-beige-light mb-4" />
          <div className="h-10 w-2/3 bg-beige-light mb-12" />
          <div className="aspect-[16/9] bg-beige-light" />
        </div>
      )}

      {(status === 'not-found' || status === 'error') && (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-28 text-center">
          <AlertTriangle className="w-8 h-8 text-charcoal/40 mx-auto mb-6" />
          <h1 className="font-montserrat font-light text-charcoal uppercase tracking-wider">
            {status === 'not-found' ? 'Article not found' : 'Something went wrong'}
          </h1>
          <p className="font-lato text-charcoal/70 mx-auto mb-8">
            {status === 'not-found'
              ? 'This article may have moved or is no longer available.'
              : "We couldn't load this article right now. Please refresh the page in a moment."}
          </p>
          <a href="/blog" className="inline-block border border-charcoal text-charcoal px-8 py-3 text-sm uppercase tracking-widest hover:bg-charcoal hover:text-cream transition-all duration-300">
            Browse all articles
          </a>
        </div>
      )}

      {status === 'ready' && post && (
        <article>
          <header className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 md:pt-20 pb-10">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap items-center gap-1 font-lato text-xs uppercase tracking-widest text-charcoal/50">
                <li><a href="/" className="hover:text-charcoal transition-colors">Home</a></li>
                <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
                <li><a href="/blog" className="hover:text-charcoal transition-colors">Journal</a></li>
              </ol>
            </nav>
            <h1 className="font-montserrat font-light text-charcoal text-3xl sm:text-4xl md:text-5xl leading-tight mb-6">{post.title}</h1>
            {post.excerpt && <p className="font-lato text-lg md:text-xl text-charcoal/70 mb-8">{post.excerpt}</p>}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-lato text-sm text-charcoal/60 border-t border-charcoal/10 pt-6">
              <span>By Harold, RE/MAX Next Door</span>
              <time dateTime={post.published_at}>{formatPostDate(post.published_at)}</time>
              <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{readingMinutes(post.content_html)} min read</span>
            </div>
          </header>

          {post.featured_image && (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12 md:mb-16">
              <img src={post.featured_image} alt={post.title} className="w-full aspect-[16/9] object-cover" />
            </div>
          )}

          <div className="blog-prose max-w-3xl mx-auto px-4 sm:px-6" dangerouslySetInnerHTML={{ __html: post.content_html }} />

          <aside className="max-w-3xl mx-auto px-4 sm:px-6 my-16 md:my-20">
            <div className="bg-beige-light border border-charcoal/10 p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6 justify-between">
              <div>
                <p className="font-montserrat text-lg uppercase tracking-wider text-charcoal mb-2">Thinking about buying?</p>
                <p className="font-lato text-charcoal/70 mb-0">Get a free, personalized market analysis from Harold.</p>
              </div>
              <a
                href={BLOG_WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContact('whatsapp_blog_article')}
                className="shrink-0 inline-flex items-center justify-center gap-2 bg-charcoal text-cream px-6 py-3 text-sm uppercase tracking-widest hover:bg-charcoal/85 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Message Harold
              </a>
            </div>
          </aside>
        </article>
      )}

      {status !== 'loading' && related.length > 0 && (
        <section className="border-t border-charcoal/10 bg-cream" aria-labelledby="related-heading">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <h2 id="related-heading" className="font-montserrat text-2xl font-light text-charcoal uppercase tracking-wider mb-10 text-center">
              Keep Reading
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((item) => (
                <div key={item.id} className="flex"><PostCard post={toCardPost(item)} /></div>
              ))}
            </div>
          </div>
        </section>
      )}
    </BlogLayout>
  );
}
