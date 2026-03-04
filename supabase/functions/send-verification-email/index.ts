import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface VerificationRequest {
  email: string;
  code: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { email, code }: VerificationRequest = await req.json();

    if (!email || !code) {
      throw new Error('Email and code are required');
    }

    console.log('Sending verification email:', {
      to: email,
      code,
    });

    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (resendApiKey) {
      try {
        const emailBody = `
Hello,

Thank you for booking with Molalla Trailer Rentals!

Your verification code is:

${code}

Please enter this code on the website to verify your email address and complete your booking.

This code will expire in 30 minutes.

If you didn't request this code, please ignore this email.

---
Molalla Trailer Rentals
📞 503-874-3705
🌐 molallatrailerrentals.com

Veteran Owned & Operated
      `.trim();

        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Molalla Trailer Rentals <bookings@molallatrailerrentals.com>',
            to: [email],
            subject: 'Your Verification Code - Molalla Trailer Rentals',
            text: emailBody,
          }),
        });

        if (!resendResponse.ok) {
          const errorData = await resendResponse.json();
          console.error('Resend API error:', errorData);
          throw new Error('Failed to send verification email via Resend');
        }

        const resendData = await resendResponse.json();
        console.log('Verification email sent successfully via Resend:', resendData);
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        throw emailError;
      }
    } else {
      console.log('RESEND_API_KEY not configured, email not sent (development mode)');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Verification email sent',
        email,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Error sending verification email:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to send verification email',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});