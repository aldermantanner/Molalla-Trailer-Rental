import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const { data: pendingBookings, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("payment_status", "pending")
      .or("service_type.eq.junk_removal,service_type.eq.material_delivery")
      .lt("created_at", twentyFourHoursAgo.toISOString());

    if (error) {
      throw error;
    }

    const reminders = [];

    for (const booking of pendingBookings || []) {
      const twilioUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-sms-notification`;
      
      const message = `Hi ${booking.customer_name}, this is Molalla Trailer Rental. Your ${booking.service_type === 'junk_removal' ? 'junk removal' : 'material delivery'} booking is pending payment. We'll send you a payment link shortly. Questions? Call 503-500-6121.`;

      try {
        const response = await fetch(twilioUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
          },
          body: JSON.stringify({
            to: booking.customer_phone,
            message: message,
          }),
        });

        if (response.ok) {
          reminders.push({
            bookingId: booking.id,
            status: "sent",
            customer: booking.customer_name,
          });
        } else {
          reminders.push({
            bookingId: booking.id,
            status: "failed",
            customer: booking.customer_name,
          });
        }
      } catch (smsError) {
        console.error(`Failed to send SMS to ${booking.customer_phone}:`, smsError);
        reminders.push({
          bookingId: booking.id,
          status: "error",
          customer: booking.customer_name,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        reminders: reminders,
        totalSent: reminders.filter(r => r.status === "sent").length,
        totalPending: (pendingBookings || []).length,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending payment reminders:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});