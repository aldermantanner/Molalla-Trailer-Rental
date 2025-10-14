import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface SMSNotification {
  booking_id: string;
  customer_name: string;
  customer_phone: string;
  service_type: string;
  start_date: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const booking: SMSNotification = await req.json();

    const adminPhone = Deno.env.get("ADMIN_PHONE") || "5035006121";
    const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      console.error("Twilio credentials not configured");
      return new Response(
        JSON.stringify({ error: "SMS service not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const smsBody = `New booking from ${booking.customer_name}! Service: ${booking.service_type === 'rental' ? 'Trailer Rental' : 'Junk Removal'}. Date: ${new Date(booking.start_date).toLocaleDateString()}. Phone: ${booking.customer_phone}. Check admin portal for details.`;

    const credentials = btoa(`${twilioAccountSid}:${twilioAuthToken}`);

    const formData = new URLSearchParams();
    formData.append('To', `+1${adminPhone}`);
    formData.append('From', twilioPhoneNumber);
    formData.append('Body', smsBody);

    const smsResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${credentials}`,
        },
        body: formData.toString(),
      }
    );

    if (!smsResponse.ok) {
      const error = await smsResponse.text();
      console.error("SMS sending failed:", error);
      throw new Error(`Failed to send SMS: ${error}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "SMS notification sent" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending SMS:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
