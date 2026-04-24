import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PropertyAlert {
  email: string;
  name: string | null;
  phone: string | null;
  property_type: string | null;
  location: string | null;
  price_min: number | null;
  price_max: number | null;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function sendWhatsApp(body: string) {
  const sid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const token = Deno.env.get("TWILIO_AUTH_TOKEN");
  const adminPhone = Deno.env.get("ADMIN_PHONE");
  const from = Deno.env.get("TWILIO_WHATSAPP_FROM") || "whatsapp:+14155238886";

  if (!sid || !token || !adminPhone) {
    console.log("Twilio not configured, skipping WhatsApp");
    return;
  }

  const to = adminPhone.startsWith("whatsapp:") ? adminPhone : `whatsapp:${adminPhone}`;
  const params = new URLSearchParams({ To: to, From: from, Body: body });

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${sid}:${token}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Twilio WhatsApp send failed:", err);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const payload: PropertyAlert = await req.json();

    if (!payload.email || typeof payload.email !== "string") {
      return jsonResponse({ success: false, error: "Email is required" }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { error: insertError } = await admin.from("property_alerts").insert([
      {
        email: payload.email,
        name: payload.name,
        phone: payload.phone,
        property_type: payload.property_type,
        location: payload.location,
        price_min: payload.price_min,
        price_max: payload.price_max,
        is_active: true,
      },
    ]);

    if (insertError) {
      console.error("DB insert failed:", insertError);
      return jsonResponse(
        { success: false, error: `DB insert failed: ${insertError.message}` },
        500
      );
    }

    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "your-email@example.com";
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const formatPriceShort = (price: number | null) =>
      price ? `$${price.toLocaleString("en-US")}` : "N/A";

    const whatsappBody =
      `New Property Alert Signup\n` +
      `Name: ${payload.name || "N/A"}\n` +
      `Email: ${payload.email}\n` +
      `Phone: ${payload.phone || "N/A"}\n` +
      `Type: ${payload.property_type || "Any"}\n` +
      `Location: ${payload.location || "Any"}\n` +
      `Price: ${formatPriceShort(payload.price_min)} - ${formatPriceShort(payload.price_max)}`;

    await sendWhatsApp(whatsappBody);

    if (!resendApiKey) {
      return jsonResponse({
        success: true,
        message: "Alert saved successfully. Email notifications not configured.",
      });
    }

    const formatPrice = (price: number | null) => {
      if (!price) return "N/A";
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      }).format(price);
    };

    const emailHtml = `
      <h2>New Property Alert Subscription</h2>
      <p>Someone just signed up for property alerts on your website!</p>

      <h3>Contact Information:</h3>
      <ul>
        <li><strong>Name:</strong> ${payload.name || "Not provided"}</li>
        <li><strong>Email:</strong> ${payload.email}</li>
        <li><strong>Phone:</strong> ${payload.phone || "Not provided"}</li>
      </ul>

      <h3>Property Preferences:</h3>
      <ul>
        <li><strong>Property Type:</strong> ${payload.property_type || "Any"}</li>
        <li><strong>Location:</strong> ${payload.location || "Any"}</li>
        <li><strong>Price Range:</strong> ${formatPrice(payload.price_min)} - ${formatPrice(payload.price_max)}</li>
      </ul>

      <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ccc; color: #666;">
        This is an automated notification from your property alert system.
      </p>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Property Alerts <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `New Property Alert: ${payload.name || payload.email}`,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error("Email send failed:", errorData);
    }

    return jsonResponse({ success: true, message: "Alert saved successfully" });
  } catch (error) {
    console.error("Error processing request:", error);
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      500
    );
  }
});
