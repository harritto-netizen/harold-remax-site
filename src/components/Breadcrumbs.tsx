import { ChevronRight, Home } from 'lucide-react';

export type Crumb = {
  label: string;
  href?: string;
};

type Props = {
  items: Crumb[];
  siteUrl?: string;
  className?: string;
};

export default function Breadcrumbs({ items, siteUrl = 'https://www.primerealestatedr.com', className = '' }: Props) {
  const trail: Crumb[] = [{ label: 'Home', href: '/' }, ...items];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: c.href ? `${siteUrl}${c.href.startsWith('/') ? c.href : '/' + c.href}` : undefined,
    })),
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className={`font-lato text-sm ${className}`}>
        <ol className="flex flex-wrap items-center gap-1.5 text-charcoal/70">
          {trail.map((c, i) => {
            const isLast = i === trail.length - 1;
            return (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-charcoal/40" aria-hidden="true" />}
                {isLast || !c.href ? (
                  <span aria-current={isLast ? 'page' : undefined} className="text-charcoal">
                    {i === 0 ? (
                      <span className="inline-flex items-center gap-1">
                        <Home className="w-3.5 h-3.5" aria-hidden="true" />
                        {c.label}
                      </span>
                    ) : (
                      c.label
                    )}
                  </span>
                ) : (
                  <a
                    href={c.href}
                    className="hover:text-charcoal transition-colors underline-offset-4 hover:underline"
                  >
                    {i === 0 ? (
                      <span className="inline-flex items-center gap-1">
                        <Home className="w-3.5 h-3.5" aria-hidden="true" />
                        {c.label}
                      </span>
                    ) : (
                      c.label
                    )}
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
