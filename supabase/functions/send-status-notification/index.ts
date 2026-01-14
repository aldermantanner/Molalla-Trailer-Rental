import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface NotificationRequest {
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  bookingId: string;
  status: string;
  startDate: string;
  endDate?: string;
  totalPrice?: number;
}

const getStatusMessage = (status: string): { subject: string; body: string; sms: string } => {
  switch (status) {
    case 'confirmed':
      return {
        subject: '✅ Booking Confirmed - Molalla Trailer Rentals',
        body: `Great news! Your booking has been confirmed.\n\nWhat's Next:\n- We'll contact you to coordinate pickup/delivery\n- Please bring your driver's license when picking up\n- Payment will be processed at pickup\n\nQuestions? Call us at 971-459-0077`,
        sms: `Your booking with Molalla Trailer Rentals has been confirmed! We'll contact you soon to coordinate pickup/delivery. Questions? Call 971-459-0077`
      };
    case 'active':
      return {
        subject: '🚚 Rental Active - Enjoy Your Trailer!',
        body: `Your rental is now active! You're all set.\n\nReminder:\n- Return by the end date to avoid additional charges\n- Return trailer clean for full deposit refund\n- Contact us if you need to extend your rental\n\nNeed help? Call 971-459-0077`,
        sms: `Your Molalla Trailer rental is now active! Return on time for full deposit refund. Need to extend? Call 971-459-0077`
      };
    case 'completed':
      return {
        subject: '✓ Rental Complete - Thank You!',
        body: `Your rental has been completed and marked as returned.\n\nNext Steps:\n- Your deposit refund will be processed within 2-3 business days\n- You'll receive a separate confirmation when refund is issued\n\nThank you for choosing Molalla Trailer Rentals! We hope to serve you again.\n\nQuestions? Call 971-459-0077`,
        sms: `Your rental is complete! Your deposit refund will be processed within 2-3 days. Thanks for choosing Molalla Trailer Rentals!`
      };
    case 'cancelled':
      return {
        subject: '❌ Booking Cancelled',
        body: `Your booking has been cancelled.\n\nIf this was unexpected or you have questions, please contact us:\n📞 971-459-0077\n📧 Reply to this email\n\nWe're here to help!`,
        sms: `Your booking with Molalla Trailer Rentals has been cancelled. Questions? Call 971-459-0077`
      };
    default:
      return {
        subject: 'Booking Status Update - Molalla Trailer Rentals',
        body: `Your booking status has been updated to: ${status}\n\nFor questions, call 971-459-0077`,
        sms: `Your booking status: ${status}. Questions? Call Molalla Trailer Rentals at 971-459-0077`
      };
  }
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const {
      customerEmail,
      customerName,
      customerPhone,
      bookingId,
      status,
      startDate,
      endDate,
      totalPrice,
    }: NotificationRequest = await req.json();

    if (!customerEmail || !customerName || !status) {
      throw new Error('Missing required fields');
    }

    const { subject, body, sms } = getStatusMessage(status);

    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    const emailBody = `
Hello ${customerName},

${body}

Booking Details:
- Booking ID: ${bookingId}
- Start Date: ${new Date(startDate).toLocaleDateString()}
${endDate ? `- End Date: ${new Date(endDate).toLocaleDateString()}` : ''}
${totalPrice ? `- Total: $${totalPrice}` : ''}

---
Molalla Trailer Rentals
📞 971-459-0077
🌐 molallatrailerrentals.com

Veteran Owned & Operated
    `.trim();

    console.log('Sending notification email:', {
      to: customerEmail,
      subject,
      bookingId,
      status,
    });

    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (resendApiKey) {
      try {
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Molalla Trailer Rentals <bookings@molallatrailerrentals.com>',
            to: [customerEmail],
            subject: subject,
            text: emailBody,
          }),
        });

        if (!resendResponse.ok) {
          const errorData = await resendResponse.json();
          console.error('Resend API error:', errorData);
          throw new Error('Failed to send email via Resend');
        }

        const resendData = await resendResponse.json();
        console.log('Email sent successfully via Resend:', resendData);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }
    } else {
      console.log('RESEND_API_KEY not configured, email not sent (development mode)');
    }

    // Send SMS notification via Twilio
    if (customerPhone && twilioAccountSid && twilioAuthToken && twilioPhoneNumber) {
      try {
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
        const twilioAuth = btoa(`${twilioAccountSid}:${twilioAuthToken}`);

        const smsResponse = await fetch(twilioUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${twilioAuth}`,
          },
          body: new URLSearchParams({
            To: customerPhone,
            From: twilioPhoneNumber,
            Body: sms,
          }).toString(),
        });

        if (!smsResponse.ok) {
          const smsError = await smsResponse.text();
          console.error("SMS sending failed:", smsError);
        } else {
          console.log("SMS notification sent successfully");
        }
      } catch (smsError) {
        console.error("Error sending SMS:", smsError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Notification sent',
        email: customerEmail,
        subject,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Error sending notification:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to send notification',
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