import { ArrowUpRight, Newspaper } from 'lucide-react';
import { formatPostDate, type BlogPostSummary } from '../../lib/blog';

type CardPost = Pick<BlogPostSummary, 'title' | 'excerpt' | 'featured_image'> & {
  href: string;
  dateLabel: string;
};

export function toCardPost(post: BlogPostSummary): CardPost {
  return { ...post, href: `/blog/${post.slug}`, dateLabel: formatPostDate(post.published_at) };
}

export default function PostCard({ post, featured = false }: { post: CardPost; featured?: boolean }) {
  return (
    <a
      href={post.href}
      className={`group w-full flex bg-white border border-charcoal/10 hover:border-charcoal/30 hover:-translate-y-1 hover:shadow-[0_16px_40px_-24px_rgba(64,62,63,0.45)] transition-all duration-500 overflow-hidden ${
        featured ? 'flex-col lg:flex-row' : 'flex-col'
      }`}
    >
      <div className={`overflow-hidden bg-beige-light relative ${featured ? 'aspect-[16/10] lg:aspect-auto lg:w-3/5 lg:min-h-[420px]' : 'aspect-[16/10]'}`}>
        {post.featured_image ? (
          <img
            src={post.featured_image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading={featured ? 'eager' : 'lazy'}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Newspaper className="w-10 h-10 text-charcoal/20" />
          </div>
        )}
        {featured && (
          <span className="absolute top-4 left-4 bg-cream text-charcoal font-lato text-[11px] uppercase tracking-widest px-3 py-1">
            Latest
          </span>
        )}
      </div>
      <div className={`flex flex-col flex-1 ${featured ? 'p-8 md:p-12 lg:justify-center' : 'p-6 md:p-8'}`}>
        <p className="font-lato text-xs uppercase tracking-widest text-charcoal/50 mb-3">{post.dateLabel}</p>
        <h3
          className={`font-montserrat font-light text-charcoal mb-3 leading-snug ${
            featured ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl'
          }`}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p className={`font-lato text-charcoal/70 leading-relaxed mb-5 ${featured ? 'text-base' : 'text-sm line-clamp-3'}`}>
            {post.excerpt}
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-1 self-start font-montserrat text-xs uppercase tracking-widest text-charcoal border-b border-charcoal pb-1">
          Read Article
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </a>
  );
}
