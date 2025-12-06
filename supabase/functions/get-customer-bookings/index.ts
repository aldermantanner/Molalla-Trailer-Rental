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

    const { sessionToken, email } = await req.json();

    if (!sessionToken || !email) {
      throw new Error("Session token and email are required");
    }

    const cleanEmail = email.toLowerCase().trim();

    // Validate session token
    const { data: session, error: sessionError } = await supabase
      .from("verified_sessions")
      .select("*")
      .eq("session_token", sessionToken)
      .eq("email", cleanEmail)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (sessionError) {
      throw new Error("Failed to validate session");
    }

    if (!session) {
      throw new Error("Invalid or expired session");
    }

    // Fetch bookings for this email
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("*")
      .eq("customer_email", cleanEmail)
      .order("created_at", { ascending: false });

    if (bookingsError) {
      throw new Error("Failed to fetch bookings");
    }

    return new Response(
      JSON.stringify({
        success: true,
        bookings: bookings || [],
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to fetch bookings",
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
