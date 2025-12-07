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

    if (!bookingData.service_type || !['rental', 'junk_removal', 'material_delivery'].includes(bookingData.service_type)) {
      throw new Error("Invalid service type");
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert(bookingData)
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
