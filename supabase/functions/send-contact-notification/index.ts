import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactMessage {
  name: string;
  email: string;
  phone: string | null;
  message: string;
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
    const payload: ContactMessage = await req.json();

    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "your-email@example.com";
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const whatsappBody =
      `New Contact Message\n` +
      `Name: ${payload.name}\n` +
      `Email: ${payload.email}\n` +
      `Phone: ${payload.phone || "N/A"}\n\n` +
      `${payload.message}`;

    await sendWhatsApp(whatsappBody);

    if (!resendApiKey) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Contact message saved. Email not configured.",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p>You have received a new message from your website contact form.</p>

      <h3>Contact Information:</h3>
      <ul>
        <li><strong>Name:</strong> ${payload.name}</li>
        <li><strong>Email:</strong> ${payload.email}</li>
        <li><strong>Phone:</strong> ${payload.phone || "Not provided"}</li>
      </ul>

      <h3>Message:</h3>
      <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #333; margin: 20px 0;">
        <p style="white-space: pre-wrap; margin: 0;">${payload.message}</p>
      </div>

      <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ccc; color: #666;">
        This is an automated notification from your website contact form.
      </p>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Contact Form <onboarding@resend.dev>",
        to: [adminEmail],
        reply_to: payload.email,
        subject: `New Contact Message from ${payload.name}`,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error("Failed to send email:", errorData);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Notification sent" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
