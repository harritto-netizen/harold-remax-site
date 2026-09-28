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

/**
 * The submitter controls every one of these fields, so nothing may reach the
 * notification email as markup. Escaping here means an enquiry cannot plant a
 * link, an image beacon or any other element inside a message the recipient
 * trusts.
 */
function escapeHtml(value: unknown, maxLength = 500): string {
  const text = value === null || value === undefined ? "" : String(value);
  return text
    .slice(0, maxLength)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Strips CR/LF so a field can never inject a header into the outgoing mail. */
function singleLine(value: unknown, maxLength = 200): string {
  return String(value ?? "").replace(/[\r\n]+/g, " ").slice(0, maxLength);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const payload: ContactMessage = await req.json();

    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "your-email@example.com";
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

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
        <li><strong>Name:</strong> ${escapeHtml(payload.name, 100)}</li>
        <li><strong>Email:</strong> ${escapeHtml(payload.email, 255)}</li>
        <li><strong>Phone:</strong> ${payload.phone ? escapeHtml(payload.phone, 50) : "Not provided"}</li>
      </ul>

      <h3>Message:</h3>
      <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #333; margin: 20px 0;">
        <p style="white-space: pre-wrap; margin: 0;">${escapeHtml(payload.message, 2000)}</p>
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
        reply_to: singleLine(payload.email, 255),
        subject: `New Contact Message from ${singleLine(payload.name, 100)}`,
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
    // The caller gets a constant message: the exception text would expose
    // internal detail about the service.
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Unable to process this request.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
