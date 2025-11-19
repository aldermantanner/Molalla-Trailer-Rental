import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
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

    const { email } = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    const cleanEmail = email.toLowerCase().trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      throw new Error("Invalid email address");
    }

    const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
    const { data: recentCodes, error: checkError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", cleanEmail)
      .gt("created_at", oneMinuteAgo);

    if (checkError) {
      console.error("Error checking recent codes:", checkError);
    }

    if (recentCodes && recentCodes.length >= 3) {
      throw new Error("Too many verification requests. Please wait a minute and try again.");
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();

    const { error: insertError } = await supabase
      .from("verification_codes")
      .insert({
        email: cleanEmail,
        code: code,
        expires_at: expiresAt,
        verified: false,
        attempts: 0,
      });

    if (insertError) {
      throw new Error(`Failed to create verification code: ${insertError.message}`);
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (resendApiKey) {
      const emailBody = `
Hello,

Your Molalla Trailer Rentals verification code is:

${code}

This code expires in 10 minutes.

Use this code to access your bookings in the Customer Portal.

If you didn't request this code, please ignore this email.

---
Molalla Trailer Rentals
📞 503-500-6121
🌐 molallatrailerrentals.com

Veteran Owned & Operated
      `.trim();

      try {
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Molalla Trailer Rentals <bookings@molallatrailerrentals.com>',
            to: [cleanEmail],
            subject: 'Your Verification Code - Molalla Trailer Rentals',
            text: emailBody,
          }),
        });

        if (!resendResponse.ok) {
          const errorData = await resendResponse.json();
          console.error('Resend API error:', errorData);
          throw new Error('Failed to send email');
        }

        console.log("Email sent successfully to:", cleanEmail);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        throw new Error('Failed to send verification email');
      }
    } else {
      console.log("DEVELOPMENT MODE: Verification code:", code);
      console.log("Email:", cleanEmail);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Verification code sent",
        devMode: !resendApiKey,
        devCode: !resendApiKey ? code : undefined,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to send verification code",
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
