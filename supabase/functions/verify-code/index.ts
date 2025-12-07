import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function cleanEmail(email: string): string {
  return email.toLowerCase().trim();
}

function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

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

    const { email, code } = await req.json();

    if (!email || !code) {
      throw new Error("Email and code are required");
    }

    const userEmail = cleanEmail(email);

    const { data: verificationRecord, error: fetchError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", userEmail)
      .eq("code", code)
      .eq("verified", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching verification code:", fetchError);
      throw new Error("Failed to verify code");
    }

    if (!verificationRecord) {
      const { data: existingCode } = await supabase
        .from("verification_codes")
        .select("*")
        .eq("email", userEmail)
        .eq("code", code)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingCode) {
        if (existingCode.verified) {
          throw new Error("Code already used");
        }
        if (new Date(existingCode.expires_at) < new Date()) {
          throw new Error("Code expired");
        }
      }

      if (existingCode && existingCode.attempts >= 5) {
        throw new Error("Too many failed attempts. Request a new code.");
      }

      if (existingCode) {
        await supabase
          .from("verification_codes")
          .update({ attempts: existingCode.attempts + 1 })
          .eq("id", existingCode.id);
      }

      throw new Error("Invalid verification code");
    }

    const { error: updateError } = await supabase
      .from("verification_codes")
      .update({ verified: true })
      .eq("id", verificationRecord.id);

    if (updateError) {
      console.error("Error updating verification code:", updateError);
      throw new Error("Failed to verify code");
    }

    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const { error: sessionError } = await supabase
      .from("verified_sessions")
      .insert({
        session_token: sessionToken,
        email: userEmail,
        expires_at: expiresAt,
      });

    if (sessionError) {
      console.error("Error creating session:", sessionError);
      throw new Error("Failed to create session");
    }

    return new Response(
      JSON.stringify({
        success: true,
        sessionToken: sessionToken,
        email: userEmail,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Error verifying code:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to verify code",
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
