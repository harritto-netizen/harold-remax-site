import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const payload: PropertyAlert = await req.json();

    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "your-email@example.com";
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured. Alert received:", payload);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Alert saved successfully. Email notifications not configured." 
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
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
      console.error("Failed to send email:", errorData);
      throw new Error(`Email service error: ${emailResponse.status}`);
    }

    const emailData = await emailResponse.json();
    console.log("Email sent successfully:", emailData);

    return new Response(
      JSON.stringify({ success: true, message: "Notification sent successfully" }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});