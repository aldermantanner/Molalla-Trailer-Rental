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

    const bookingData = await req.json();

    if (!bookingData.customer_email || !bookingData.customer_name || !bookingData.customer_phone) {
      throw new Error("Missing required customer information");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.customer_email)) {
      throw new Error("Invalid email format");
    }

    const phoneRegex = /^\d{10}$/;
    const cleanPhone = bookingData.customer_phone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      throw new Error("Invalid phone number format. Must be 10 digits.");
    }

    if (!bookingData.service_type || !['rental', 'junk_removal'].includes(bookingData.service_type)) {
      throw new Error("Invalid service type");
    }

    const sanitizedBooking: Record<string, unknown> = {
      customer_name: bookingData.customer_name,
      customer_email: bookingData.customer_email,
      customer_phone: cleanPhone,
      service_type: bookingData.service_type,
      start_date: bookingData.start_date,
      end_date: bookingData.end_date || null,
      delivery_address: bookingData.delivery_address || "",
      delivery_required: Boolean(bookingData.delivery_required),
      notes: bookingData.notes || "",
    };

    const optionalFields = [
      "date_of_birth", "drivers_license_number", "address", "city",
      "state", "zip_code", "emergency_contact_name", "emergency_contact_phone",
    ];
    for (const field of optionalFields) {
      if (bookingData[field] !== undefined) {
        sanitizedBooking[field] = bookingData[field];
      }
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert(sanitizedBooking)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      throw new Error("Failed to create booking");
    }

    return new Response(
      JSON.stringify({
        success: true,
        bookingId: data.id,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to create booking",
      }),
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
