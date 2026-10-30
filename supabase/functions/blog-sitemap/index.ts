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
    const latest = posts.reduce<string | null>(
      (max, p) => (!max || p.updated_at > max ? p.updated_at : max),
      null,
    );

    const urls = [
      `  <url><loc>${SITE_URL}/blog</loc>${latest ? `<lastmod>${latest.slice(0, 10)}</lastmod>` : ""}<changefreq>daily</changefreq><priority>0.8</priority></url>`,
      ...posts.map((p) =>
        `  <url><loc>${xmlEscape(`${SITE_URL}/blog/${p.slug}`)}</loc><lastmod>${p.updated_at.slice(0, 10)}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`
      ),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=900",
      },
    });
  } catch (err) {
    console.error("blog-sitemap error", err);
    return new Response("Sitemap unavailable", {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "text/plain" },
    });
  }
});
