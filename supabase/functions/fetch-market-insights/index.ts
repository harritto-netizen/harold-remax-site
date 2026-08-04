import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface NewsItem {
  title: string;
  excerpt: string;
  source_url: string;
  source_name: string;
  image_url: string;
  category: string;
  published_at: string;
}

function parseRSSDate(dateStr: string): string {
  try {
    return new Date(dateStr).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function extractTextContent(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function categorizeArticle(title: string): string {
  const lower = title.toLowerCase();
  if (
    lower.includes("invest") ||
    lower.includes("roi") ||
    lower.includes("return")
  )
    return "Investment";
  if (lower.includes("price") || lower.includes("market") || lower.includes("growth"))
    return "Market Analysis";
  if (
    lower.includes("luxury") ||
    lower.includes("villa") ||
    lower.includes("condo")
  )
    return "Luxury";
  if (lower.includes("tourism") || lower.includes("travel") || lower.includes("nomad"))
    return "Lifestyle";
  if (lower.includes("law") || lower.includes("tax") || lower.includes("confotur"))
    return "Legal & Tax";
  return "Market News";
}

function pickImageForCategory(category: string): string {
  const images: Record<string, string> = {
    Investment:
      "https://images.pexels.com/photos/7578901/pexels-photo-7578901.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Market Analysis":
      "https://images.pexels.com/photos/7031406/pexels-photo-7031406.jpeg?auto=compress&cs=tinysrgb&w=800",
    Luxury:
      "https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&w=800",
    Lifestyle:
      "https://images.pexels.com/photos/2476632/pexels-photo-2476632.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Legal & Tax":
      "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Market News":
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
  };
  return images[category] || images["Market News"];
}

async function fetchGoogleNewsRSS(): Promise<NewsItem[]> {
  const queries = [
    "Dominican+Republic+real+estate",
    "Punta+Cana+property+investment",
    "Santo+Domingo+real+estate+market",
  ];

  const allItems: NewsItem[] = [];

  for (const query of queries) {
    try {
      const url = `https://news.google.com/rss/search?q=${query}&hl=en&gl=US&ceid=US:en`;
      const response = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });

      if (!response.ok) continue;

      const xml = await response.text();
      const items = xml.split("<item>");

      for (let i = 1; i < Math.min(items.length, 5); i++) {
        const item = items[i];

        const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]>|<title>(.*?)<\/title>/);
        const linkMatch = item.match(/<link>(.*?)<\/link>|<link\/>\s*(https?[^\s<]+)/);
        const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
        const sourceMatch = item.match(/<source[^>]*>(.*?)<\/source>/);
        const descMatch = item.match(
          /<description><!\[CDATA\[(.*?)\]\]>|<description>(.*?)<\/description>/
        );

        const title = titleMatch
          ? extractTextContent(titleMatch[1] || titleMatch[2] || "")
          : "";
        const link = linkMatch ? (linkMatch[1] || linkMatch[2] || "") : "";
        const pubDate = pubDateMatch ? pubDateMatch[1] : "";
        const sourceName = sourceMatch
          ? extractTextContent(sourceMatch[1])
          : "News";
        const description = descMatch
          ? extractTextContent(descMatch[1] || descMatch[2] || "")
          : "";

        if (!title || !link) continue;

        const category = categorizeArticle(title);

        allItems.push({
          title,
          excerpt: description.slice(0, 200) || title,
          source_url: link,
          source_name: sourceName,
          image_url: pickImageForCategory(category),
          category,
          published_at: parseRSSDate(pubDate),
        });
      }
    } catch {
      continue;
    }
  }

  // Deduplicate by URL
  const seen = new Set<string>();
  const unique = allItems.filter((item) => {
    if (seen.has(item.source_url)) return false;
    seen.add(item.source_url);
    return true;
  });

  // Sort by date, most recent first
  unique.sort(
    (a, b) =>
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

  return unique.slice(0, 6);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const articles = await fetchGoogleNewsRSS();

    if (articles.length === 0) {
      return new Response(
        JSON.stringify({
          articles: [],
          message: "No articles found",
          fetched_at: new Date().toISOString(),
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        articles,
        count: articles.length,
        fetched_at: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
