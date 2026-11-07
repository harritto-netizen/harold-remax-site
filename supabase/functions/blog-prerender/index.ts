import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SITE_URL = "https://www.primerealestatedr.com";
const BRAND = "RE/MAX Next Door";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type Post = {
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

function htmlResponse(html: string, status = 200): Response {
  return new Response(html, {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}

function head(opts: {
  title: string;
  description: string;
  canonical: string;
  image?: string | null;
  robots?: string;
  ogType?: string;
  jsonLd?: Record<string, unknown>;
}): string {
  const robots = opts.robots ?? "index, follow, max-image-preview:large, max-snippet:-1";
  const image = opts.image ? `    <meta property="og:image" content="${escapeHtml(opts.image)}" />\n    <meta name="twitter:image" content="${escapeHtml(opts.image)}" />\n` : "";
  const jsonLd = opts.jsonLd
    ? `    <script type="application/ld+json">${JSON.stringify(opts.jsonLd)}</script>\n`
    : "";
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(opts.title)}</title>
    <meta name="description" content="${escapeHtml(opts.description)}" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${escapeHtml(opts.canonical)}" />
    <meta property="og:title" content="${escapeHtml(opts.title)}" />
    <meta property="og:description" content="${escapeHtml(opts.description)}" />
    <meta property="og:url" content="${escapeHtml(opts.canonical)}" />
    <meta property="og:type" content="${opts.ogType ?? "article"}" />
    <meta property="og:site_name" content="${BRAND}" />
${image}    <meta name="twitter:card" content="summary_large_image" />
${jsonLd}  </head>
`;
}

const FOOT = `    <hr />
    <footer>
      <p><strong>${BRAND}</strong> — Luxury real estate in Santo Domingo, Punta Cana, Cap Cana and Bayahibe.</p>
      <p><a href="${SITE_URL}/">Home</a> · <a href="${SITE_URL}/blog">Journal</a> · Phone/WhatsApp: +1-809-426-2269</p>
    </footer>
  </body>
</html>`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");
    const view = url.searchParams.get("view");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );

    // Blog index page
    if (!slug || view === "index") {
      const { data } = await supabase
        .from("blog_posts")
        .select("slug, title, excerpt, published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(60);

      const items = (data ?? [])
        .map(
          (p) =>
            `      <article>
        <h2><a href="${SITE_URL}/blog/${escapeHtml(p.slug)}">${escapeHtml(p.title)}</a></h2>
        <p>${escapeHtml(p.excerpt)}</p>
      </article>`,
        )
        .join("\n");

      const html =
        head({
          title: `Journal | Dominican Republic Real Estate Insights | ${BRAND}`,
          description: "Market analysis, neighborhood guides and buying advice for Dominican Republic real estate from Harold at RE/MAX Next Door.",
          canonical: `${SITE_URL}/blog`,
          ogType: "website",
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "Blog",
            name: `${BRAND} Journal`,
            url: `${SITE_URL}/blog`,
            publisher: { "@type": "RealEstateAgent", name: BRAND, url: SITE_URL },
          },
        }) +
        `  <body>
    <nav><a href="${SITE_URL}/">← ${BRAND}</a> · <a href="${SITE_URL}/blog">Journal</a></nav>
    <main>
      <h1>Market Insights</h1>
      <p>Expert analysis on Dominican Republic real estate trends, neighborhoods, taxes and investment opportunities.</p>
${items}
    </main>
` +
        FOOT;

      return htmlResponse(html);
    }

    // Single article page
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
      return htmlResponse(head({ title: `Not found | ${BRAND}`, description: "Article not found.", canonical: `${SITE_URL}/blog`, robots: "noindex, follow" }) + `  <body><p>Not found. <a href="${SITE_URL}/blog">Browse all articles</a></p>\n` + FOOT, 404);
    }

    const { data: post, error } = await supabase
      .from("blog_posts")
      .select("slug, title, excerpt, content_html, meta_title, meta_description, featured_image, published_at, updated_at")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error) throw error;

    if (!post) {
      const html =
        head({
          title: `Article not found | ${BRAND}`,
          description: "This article could not be found.",
          canonical: `${SITE_URL}/blog`,
          robots: "noindex, follow",
        }) +
        `  <body>
    <nav><a href="${SITE_URL}/">← ${BRAND}</a> · <a href="${SITE_URL}/blog">Journal</a></nav>
    <main><h1>Article not found</h1><p>This article may have moved or is no longer available. <a href="${SITE_URL}/blog">Browse all articles</a></p></main>
` +
        FOOT;
      return htmlResponse(html, 404);
    }

    const p = post as Post;
    const pageUrl = `${SITE_URL}/blog/${p.slug}`;
    const description = p.meta_description || p.excerpt;
    const title = `${p.meta_title || p.title} | ${BRAND}`;
    const datePublished = p.published_at.slice(0, 10);
    const dateModified = p.updated_at.slice(0, 10);

    const html =
      head({
        title,
        description,
        canonical: pageUrl,
        image: p.featured_image,
        ogType: "article",
        jsonLd: {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BlogPosting",
              headline: p.title,
              description,
              image: p.featured_image ?? undefined,
              datePublished: p.published_at,
              dateModified: p.updated_at,
              mainEntityOfPage: pageUrl,
              author: { "@type": "Person", name: "Harold", worksFor: { "@type": "RealEstateAgent", name: BRAND } },
              publisher: { "@type": "RealEstateAgent", name: BRAND, url: SITE_URL },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
                { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE_URL}/blog` },
                { "@type": "ListItem", position: 3, name: p.title, item: pageUrl },
              ],
            },
          ],
        },
      }) +
      `  <body>
    <nav><a href="${SITE_URL}/">← ${BRAND}</a> · <a href="${SITE_URL}/blog">Journal</a></nav>
    <main>
      <article>
        <p><a href="${SITE_URL}/">Home</a> › <a href="${SITE_URL}/blog">Journal</a></p>
        <h1>${escapeHtml(p.title)}</h1>
        ${p.excerpt ? `<p><em>${escapeHtml(p.excerpt)}</em></p>` : ""}
        <p>By Harold, ${BRAND} · <time datetime="${datePublished}">${datePublished}</time></p>
        ${p.featured_image ? `<img src="${escapeHtml(p.featured_image)}" alt="${escapeHtml(p.title)}" />` : ""}
        <div>
${p.content_html}
        </div>
      </article>
      <p><a href="${SITE_URL}/#propiedades">View properties for sale</a> · <a href="${SITE_URL}/blog">More articles</a></p>
    </main>
` +
      FOOT;

    return htmlResponse(html);
  } catch (err) {
    console.error("blog-prerender error", err);
    return htmlResponse(
      `<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>${BRAND}</title><meta name="robots" content="noindex"></head><body><p>Loading…</p></body></html>`,
      500,
    );
  }
});
