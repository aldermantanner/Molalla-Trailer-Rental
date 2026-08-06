import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface LeadNotification {
  name: string;
  phone: string;
  email: string | null;
  zip_code: string | null;
  service_type: string | null;
  message: string | null;
  source: string;
  campaign: string | null;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const serviceLabels: Record<string, string> = {
  junk_removal: "General Junk Removal",
  appliance: "Appliance Removal",
  cleanout: "Garage / Estate Cleanout",
  debris: "Construction Debris",
  yard: "Yard Waste Cleanup",
  other: "Other",
};

const sourceLabels: Record<string, string> = {
  google: "Google Ads",
  meta: "Meta Ads",
  direct: "Direct",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const lead: LeadNotification = await req.json();

    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "BareAcreHauling@outlook.com";
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.warn("RESEND_API_KEY not configured — lead notification logged only");
      console.log("New lead received:", { name: lead.name, phone: lead.phone, source: lead.source });
      return new Response(
        JSON.stringify({ success: true, message: "Notification logged (no email provider)" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const serviceLabel = serviceLabels[lead.service_type || ""] || lead.service_type || "Not specified";
    const sourceLabel = sourceLabels[lead.source] || lead.source;

    const emailBody = `
      <h2 style="color:#16a34a;">New Lead from Ad Landing Page!</h2>
      <p style="background-color:#DCFCE7;padding:12px;border-left:4px solid #16a34a;margin:16px 0;font-size:16px;">
        <strong>${lead.name}</strong> just submitted the quote form. Call them ASAP to close the job.
      </p>
      <hr>
      <h3>Contact Info</h3>
      <p><strong>Name:</strong> ${lead.name}</p>
      <p><strong>Phone:</strong> <a href="tel:${lead.phone}">${lead.phone}</a></p>
      ${lead.email ? `<p><strong>Email:</strong> <a href="mailto:${lead.email}">${lead.email}</a></p>` : ""}
      ${lead.zip_code ? `<p><strong>ZIP:</strong> ${lead.zip_code}</p>` : ""}
      <hr>
      <h3>Request Details</h3>
      <p><strong>Service:</strong> ${serviceLabel}</p>
      ${lead.message ? `<p><strong>Details:</strong> ${lead.message}</p>` : ""}
      <hr>
      <h3>Source</h3>
      <p><strong>Channel:</strong> ${sourceLabel}</p>
      ${lead.campaign ? `<p><strong>Campaign:</strong> ${lead.campaign}</p>` : ""}
      <hr>
      <p><em>View and manage this lead in your admin portal &rarr; Lead Inbox tab.</em></p>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Bare Acre Hauling <notifications@bareacrehauling.com>",
        to: [adminEmail],
        subject: `New Lead: ${lead.name} — ${serviceLabel}`,
        html: emailBody,
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.text();
      console.error("Email sending failed:", error);
      throw new Error(`Failed to send email: ${error}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Lead notification sent" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending lead notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
