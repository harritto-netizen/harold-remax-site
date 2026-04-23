import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface UserData {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  country?: string | null;
  city?: string | null;
  fbp?: string | null;
  fbc?: string | null;
}

interface CustomData {
  value?: number | null;
  currency?: string | null;
  content_name?: string | null;
  content_category?: string | null;
  content_ids?: string[] | null;
}

interface RequestPayload {
  event_name: "Lead" | "Contact" | "ViewContent" | "PageView" | "CompleteRegistration" | string;
  event_id: string;
  event_source_url?: string;
  event_time?: number;
  action_source?: "website" | "email" | "chat" | "phone_call" | "other";
  user_data?: UserData;
  custom_data?: CustomData;
}

const sha256Hex = async (input: string): Promise<string> => {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const normalizePhone = (phone: string) => phone.replace(/[^0-9]/g, "");
const normalizeName = (name: string) => name.trim().toLowerCase();
const normalizeShort = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "");

const buildHashedUserData = async (user: UserData, req: Request) => {
  const hashed: Record<string, string | string[] | undefined> = {};
  if (user.email) hashed.em = [await sha256Hex(normalizeEmail(user.email))];
  if (user.phone) hashed.ph = [await sha256Hex(normalizePhone(user.phone))];
  if (user.firstName) hashed.fn = [await sha256Hex(normalizeName(user.firstName))];
  if (user.lastName) hashed.ln = [await sha256Hex(normalizeName(user.lastName))];
  if (user.country) hashed.country = [await sha256Hex(normalizeShort(user.country))];
  if (user.city) hashed.ct = [await sha256Hex(normalizeShort(user.city))];
  if (user.fbp) hashed.fbp = user.fbp;
  if (user.fbc) hashed.fbc = user.fbc;

  const ipHeader = req.headers.get("x-forwarded-for") || "";
  const ip = ipHeader.split(",")[0].trim();
  if (ip) hashed.client_ip_address = ip;
  const ua = req.headers.get("user-agent");
  if (ua) hashed.client_user_agent = ua;

  return hashed;
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const pixelId = Deno.env.get("META_PIXEL_ID");
    const accessToken = Deno.env.get("META_CAPI_ACCESS_TOKEN");
    const testEventCode = Deno.env.get("META_TEST_EVENT_CODE");

    if (!pixelId || !accessToken) {
      return new Response(
        JSON.stringify({ error: "Meta CAPI not configured. Set META_PIXEL_ID and META_CAPI_ACCESS_TOKEN." }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const body: RequestPayload = await req.json();
    if (!body.event_name || !body.event_id) {
      return new Response(JSON.stringify({ error: "event_name and event_id are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const eventTime = body.event_time ?? Math.floor(Date.now() / 1000);
    const userData = await buildHashedUserData(body.user_data ?? {}, req);

    const event = {
      event_name: body.event_name,
      event_time: eventTime,
      event_id: body.event_id,
      event_source_url: body.event_source_url,
      action_source: body.action_source ?? "website",
      user_data: userData,
      custom_data: body.custom_data ?? {},
    };

    const capiPayload: Record<string, unknown> = { data: [event] };
    if (testEventCode) capiPayload.test_event_code = testEventCode;

    const endpoint = `https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`;

    const metaResp = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(capiPayload),
    });
    const metaText = await metaResp.text();

    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, serviceKey);
      await supabase.from("meta_capi_events").insert({
        event_id: body.event_id,
        event_name: body.event_name,
        event_source_url: body.event_source_url ?? null,
        event_time: new Date(eventTime * 1000).toISOString(),
        payload: event,
        response_status: metaResp.status,
        response_body: metaText.slice(0, 2000),
      });
    } catch (logError) {
      console.error("Failed to log CAPI event:", logError);
    }

    return new Response(
      JSON.stringify({ ok: metaResp.ok, status: metaResp.status, meta: metaText }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
