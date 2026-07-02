import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AlertRecord {
  email: string;
  name: string | null;
  phone: string | null;
  property_type: string | null;
  location: string | null;
  price_min: number | null;
  price_max: number | null;
}

interface WebhookPayload {
  type?: string;
  table?: string;
  record?: AlertRecord;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const payload: WebhookPayload & AlertRecord = await req.json();

    // Support both trigger/webhook format (record field) and direct format
    const alert: AlertRecord = payload.record ?? {
      email: payload.email,
      name: payload.name ?? null,
      phone: payload.phone ?? null,
      property_type: payload.property_type ?? null,
      location: payload.location ?? null,
      price_min: payload.price_min ?? null,
      price_max: payload.price_max ?? null,
    };

    if (!alert.email || typeof alert.email !== "string") {
      return jsonResponse({ success: true, message: "No email to notify" });
    }

    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "your-email@example.com";
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      return jsonResponse({
        success: true,
        message: "Alert received. Email notifications not configured.",
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
        <li><strong>Name:</strong> ${alert.name || "Not provided"}</li>
        <li><strong>Email:</strong> ${alert.email}</li>
        <li><strong>Phone:</strong> ${alert.phone || "Not provided"}</li>
      </ul>

      <h3>Property Preferences:</h3>
      <ul>
        <li><strong>Property Type:</strong> ${alert.property_type || "Any"}</li>
        <li><strong>Location:</strong> ${alert.location || "Any"}</li>
        <li><strong>Price Range:</strong> ${formatPrice(alert.price_min)} - ${formatPrice(alert.price_max)}</li>
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
        subject: `New Property Alert: ${alert.name || alert.email}`,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error("Email send failed:", errorData);
      return jsonResponse({ success: true, message: "Alert saved, email delivery failed" });
    }

    return jsonResponse({ success: true, message: "Notification sent" });
  } catch (error) {
    console.error("Error processing request:", error);
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      500
    );
  }
});
