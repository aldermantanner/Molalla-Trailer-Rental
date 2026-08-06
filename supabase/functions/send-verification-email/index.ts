import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Allow at most 3 verification email sends per email address per 10 minutes
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MINUTES = 10;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      throw new Error("Email and code are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // Rate-limit check: count recent verification_codes rows for this email
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    const windowStart = new Date(
      Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000
    ).toISOString();

    const { count, error: countError } = await supabase
      .from("verification_codes")
      .select("id", { count: "exact", head: true })
      .eq("email", email.toLowerCase().trim())
      .gte("created_at", windowStart);

    if (countError) {
      console.error("Rate limit check failed:", countError);
    } else if ((count ?? 0) >= RATE_LIMIT_MAX) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Too many verification requests. Please wait a few minutes and try again.",
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Emit a log entry — actual email delivery is handled by the database
    // trigger / notification system. If a RESEND_API_KEY is present it sends.
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (resendApiKey) {
      const emailBody = `Hello,

Thank you for booking with Bare Acre Hauling!

Your verification code is: ${code}

Please enter this code on the website to verify your email address and complete your booking.

This code will expire in 30 minutes.

If you didn't request this code, please ignore this email.

---
Bare Acre Hauling
503-874-3705
bareacrehauling.com
Veteran Owned & Operated`.trim();

      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Bare Acre Hauling <bookings@bareacrehauling.com>",
          to: [email],
          subject: "Your Verification Code - Bare Acre Hauling",
          text: emailBody,
        }),
      });

      if (!resendResponse.ok) {
        const errorData = await resendResponse.json();
        console.error("Resend API error:", errorData);
        throw new Error("Failed to send verification email");
      }

      console.log("Verification email sent:", email);
    } else {
      console.log("No email provider configured — code logged only (dev mode):", code);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Verification email sent", email }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Failed to send verification email" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
