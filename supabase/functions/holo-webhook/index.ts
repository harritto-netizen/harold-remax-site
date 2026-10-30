import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";
import sanitizeHtml from "npm:sanitize-html@2.13.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SITE_URL = "https://www.primerealestatedr.com";
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function constantTimeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const x = enc.encode(a);
  const y = enc.encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  }
  return diff === 0;
}

async function hmacHex(secret: string, body: Uint8Array): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, body));
  return Array.from(sig, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function isAuthentic(req: Request, rawBody: Uint8Array, secret: string): Promise<boolean> {
  const signature = req.headers.get("x-holo-signature");
  if (signature) {
    return constantTimeEqual(signature, `sha256=${await hmacHex(secret, rawBody)}`);
  }
  const auth = req.headers.get("authorization") ?? "";
  return auth.startsWith("Bearer ") && constantTimeEqual(auth.slice(7), secret);
}

function httpsUrlOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function plainText(value: unknown, maxLength: number): string {
  return String(value ?? "").replace(/<[^>]*>/g, "").trim().slice(0, maxLength);
}

function cleanArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "h2", "h3", "h4", "h5", "h6", "p", "br", "hr", "blockquote", "pre", "code",
      "ul", "ol", "li", "strong", "b", "em", "i", "u", "s", "sup", "sub", "a", "img",
      "figure", "figcaption", "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption",
    ],
    allowedAttributes: {
      a: ["href", "title", "rel", "target"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      th: ["colspan", "rowspan", "scope"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["https", "http", "mailto", "tel"],
    allowedSchemesByTag: { img: ["https"] },
    allowProtocolRelative: false,
    transformTags: {
      h1: "h2",
      a: (tagName, attribs) => {
        const external = /^https?:\/\//i.test(attribs.href ?? "") &&
          !(attribs.href ?? "").startsWith(SITE_URL);
        return {
          tagName,
          attribs: external
            ? { ...attribs, target: "_blank", rel: "noopener noreferrer" }
            : { href: attribs.href ?? "", ...(attribs.title ? { title: attribs.title } : {}) },
        };
      },
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy" } }),
    },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

    const secret = Deno.env.get("HOLO_WEBHOOK_SECRET");
    if (!secret) {
      console.error("HOLO_WEBHOOK_SECRET is not configured");
      return json({ error: "Webhook not configured" }, 503);
    }

    const rawBody = new Uint8Array(await req.arrayBuffer());
    if (!(await isAuthentic(req, rawBody, secret))) {
      return json({ error: "Invalid signature" }, 401);
    }

    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(new TextDecoder().decode(rawBody));
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    const article = payload.article as Record<string, unknown> | undefined;
    if (!article || typeof article !== "object") return json({ error: "Missing article" }, 422);

    const slug = String(article.slug ?? "").toLowerCase();
    const holoId = String(article.id ?? "");
    const title = plainText(article.title, 300);
    const contentHtml = typeof article.contentHtml === "string" ? article.contentHtml : "";

    if (!SLUG_PATTERN.test(slug) || slug.length > 200) return json({ error: "Invalid slug" }, 422);
    if (!UUID_PATTERN.test(holoId)) return json({ error: "Invalid article id" }, 422);
    if (!title || !contentHtml) return json({ error: "Missing title or content" }, 422);

    const liveUrl = `${SITE_URL}/blog/${slug}`;

    if (payload.test === true) {
      return json({ ok: true, test: true, url: liveUrl });
    }

    const publishedAt = new Date(String(article.publishedAt ?? ""));

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { error } = await supabase.from("blog_posts").upsert(
      {
        holo_id: holoId,
        slug,
        title,
        excerpt: plainText(article.excerpt, 600),
        content_html: cleanArticleHtml(contentHtml),
        meta_title: plainText(article.metaTitle, 300) || title,
        meta_description: plainText(article.metaDescription, 400),
        featured_image: httpsUrlOrNull(article.featuredImage),
        published_at: isNaN(publishedAt.getTime()) ? new Date().toISOString() : publishedAt.toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "holo_id" },
    );

    if (error) {
      console.error("blog_posts upsert failed", error);
      if (error.code === "23505") return json({ error: "Slug already used by another article" }, 409);
      return json({ error: "Could not save article" }, 500);
    }

    return json({ ok: true, url: liveUrl });
  } catch (err) {
    console.error("holo-webhook error", err);
    return json({ error: "Internal error" }, 500);
  }
});
