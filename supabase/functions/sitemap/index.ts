import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SITE_URL = "https://www.primerealestatedr.com";

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Static pages with their image entries. lastmod for these is set to the
// homepage lastmod (today) so Google re-evaluates them, while blog posts use
// their real updated_at. Image filenames are URL-encoded (%2C for commas).
const STATIC_PAGES = [
  {
    loc: `${SITE_URL}/`,
    changefreq: "weekly",
    priority: "1.0",
    images: [
      { loc: `${SITE_URL}/harold-portrait.jpg`, title: "Harold - Certified Real Estate Agent RE/MAX Next Door" },
      { loc: `${SITE_URL}/re_max_next_door_(4).png`, title: "RE/MAX Next Door Logo" },
      { loc: `${SITE_URL}/d-2574-1765469617-c45431a7-3384-488b-b949-0103dfb4aa72.png`, title: "GreenWood Apartment in Cap Cana" },
      { loc: `${SITE_URL}/laud-2.webp`, title: "Villa Playa Nueva Romana" },
      { loc: `${SITE_URL}/2025-12-13_09_46_23-edificio_rentable_con_en_santo_domingo%2C_distrito_nacional%2C_republica_dominic.png`, title: "Luxury Home with Panoramic View in Santo Domingo" },
      { loc: `${SITE_URL}/60.jpg`, title: "Apartment in Torre Roraima - Evaristo Morales" },
      { loc: `${SITE_URL}/d-2392-1764611103-8d08280a-5912-4dc7-ab09-fc84088d5fcc.jpg`, title: "Furnished Apartment in Bayahibe" },
    ],
  },
  {
    loc: `${SITE_URL}/blog/punta-cana-vs-cap-cana-vs-santo-domingo-where-to-buy-2026`,
    changefreq: "monthly",
    priority: "0.8",
    images: [
      { loc: "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg", title: "Punta Cana vs Cap Cana vs Santo Domingo" },
    ],
  },
  {
    loc: `${SITE_URL}/blog/confotur-tax-savings`,
    changefreq: "monthly",
    priority: "0.8",
    images: [
      { loc: `${SITE_URL}/d-2574-1765469617-c45431a7-3384-488b-b949-0103dfb4aa72.png`, title: "CONFOTUR-Approved Property in Cap Cana" },
      { loc: `${SITE_URL}/d-2392-1764611103-8d08280a-5912-4dc7-ab09-fc84088d5fcc.jpg`, title: "CONFOTUR-Approved Apartment in Bayahibe" },
    ],
  },
  {
    loc: `${SITE_URL}/blog/living-investing-evaristo-morales-santo-domingo-real-estate`,
    changefreq: "monthly",
    priority: "0.8",
    images: [
      { loc: "https://euwpcnaioorzkhmwfnjn.supabase.co/storage/v1/object/public/creative-assets/images/4ddaebfa-fe2e-4924-8717-dd1332c732e7/1787761402669-jkfd9n4p26d.jpeg", title: "Evaristo Morales Luxury Real Estate" },
    ],
  },
  { loc: `${SITE_URL}/privacy-policy`, changefreq: "yearly", priority: "0.3", images: [] },
];

type StaticPage = (typeof STATIC_PAGES)[number];

function renderStaticPage(page: StaticPage, lastmod: string): string {
  const images = page.images
    .map(
      (img) =>
        `    <image:image><image:loc>${xmlEscape(img.loc)}</image:loc><image:title>${xmlEscape(img.title)}</image:title></image:image>`,
    )
    .join("\n");
  const imageBlock = images ? `\n${images}` : "";
  return `  <url>
    <loc>${xmlEscape(page.loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${imageBlock}
  </url>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );

    const { data, error } = await supabase
      .from("blog_posts")
      .select("slug, updated_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(5000);

    if (error) throw error;

    const posts = data ?? [];
    const today = new Date().toISOString().slice(0, 10);

    // Homepage reflects the freshest activity on the site: the newest blog
    // update, or today if the blog is empty. This is what keeps lastmod
    // moving automatically whenever a post is published or edited.
    const newestPostUpdate = posts.reduce<string | null>(
      (max, p) => (!max || p.updated_at > max ? p.updated_at : max),
      null,
    );
    const homepageLastmod = (newestPostUpdate ?? today).slice(0, 10);

    const staticUrls = STATIC_PAGES.map((page) =>
      renderStaticPage(page, page.loc === `${SITE_URL}/` ? homepageLastmod : today),
    );

    const blogIndexLastmod = (newestPostUpdate ?? today).slice(0, 10);
    const blogIndexUrl = `  <url>
    <loc>${SITE_URL}/blog</loc>
    <lastmod>${blogIndexLastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;

    const postUrls = posts.map(
      (p) => `  <url>
    <loc>${xmlEscape(`${SITE_URL}/blog/${p.slug}`)}</loc>
    <lastmod>${p.updated_at.slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`,
    );

    const allUrls = [staticUrls[0], blogIndexUrl, ...staticUrls.slice(1), ...postUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls.join("\n")}
</urlset>
`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=900",
      },
    });
  } catch (err) {
    console.error("sitemap error", err);
    return new Response("Sitemap unavailable", {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "text/plain" },
    });
  }
});
