import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface BookingNotification {
  booking_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_type: string;
  start_date: string;
  end_date?: string;
  delivery_address: string;
  total_price?: number;
  trailer_type?: string;
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
    const booking: BookingNotification = await req.json();

    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "Molallatrailerrental@outlook.com";
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const emailBody = `
      <h2>New Booking Received!</h2>
      <p><strong>Booking ID:</strong> ${booking.booking_id}</p>
      <hr>
      <h3>Customer Information</h3>
      <p><strong>Name:</strong> ${booking.customer_name}</p>
      <p><strong>Email:</strong> ${booking.customer_email}</p>
      <p><strong>Phone:</strong> ${booking.customer_phone}</p>
      <hr>
      <h3>Service Details</h3>
      <p><strong>Service Type:</strong> ${booking.service_type === 'rental' ? 'Trailer Rental' : 'Junk Removal'}</p>
      ${booking.trailer_type ? `<p><strong>Trailer:</strong> ${booking.trailer_type}</p>` : ''}
      <p><strong>Start Date:</strong> ${new Date(booking.start_date).toLocaleDateString()}</p>
      ${booking.end_date ? `<p><strong>End Date:</strong> ${new Date(booking.end_date).toLocaleDateString()}</p>` : ''}
      <p><strong>Delivery Address:</strong> ${booking.delivery_address}</p>
      ${booking.total_price ? `<p><strong>Total Price:</strong> $${booking.total_price}</p>` : ''}
      <hr>
      <p><em>Log in to your admin portal to manage this booking.</em></p>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Molalla Trailer Rentals <notifications@rentmolallatrailers.com>",
        to: [adminEmail],
        subject: `New Booking: ${booking.customer_name} - ${booking.service_type === 'rental' ? 'Trailer Rental' : 'Junk Removal'}`,
        html: emailBody,
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.text();
      console.error("Email sending failed:", error);
      throw new Error(`Failed to send email: ${error}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Notification sent" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});