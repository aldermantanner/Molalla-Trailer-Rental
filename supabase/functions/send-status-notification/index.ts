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
  serviceType?: string;
  startDate: string;
  endDate?: string;
  totalPrice?: number;
  paymentUrl?: string;
  rejectionReason?: string;
}

const getStatusMessage = (status: string, _serviceType?: string, _paymentUrl?: string, rejectionReason?: string): { subject: string; body: string } => {
  switch (status) {
    case 'pending':
      return {
        subject: 'Booking Received - Bare Acre Hauling',
        body: `Thank you for your junk removal booking!\n\nYour booking has been received and we'll contact you shortly to confirm details and arrange service.\n\nWhat's Next:\n- We'll contact you to coordinate service details\n- Payment arrangements will be discussed when we contact you\n\nQuestions? Call us at 503-874-3705`
      };
    case 'confirmed':
      return {
        subject: 'Booking Confirmed - Bare Acre Hauling',
        body: `Great news! Your booking has been confirmed.\n\nWhat's Next:\n- We'll contact you to coordinate service details\n- Payment will be arranged when we contact you\n\nQuestions? Call us at 503-874-3705`
      };
    case 'active':
      return {
        subject: 'Service In Progress - Bare Acre Hauling',
        body: `Your junk removal service is in progress! Our crew is on site.\n\nQuestions? Call us at 503-874-3705`
      };
    case 'completed':
      return {
        subject: 'Service Complete - Thank You!',
        body: `Your junk removal service has been completed.\n\nThank you for choosing Bare Acre Hauling! We hope to serve you again.\n\nQuestions? Call us at 503-874-3705`
      };
    case 'cancelled':
      return {
        subject: 'Booking Cancelled',
        body: `Your booking has been cancelled.${rejectionReason ? `\n\nReason: ${rejectionReason}` : ''}\n\nIf this was unexpected or you have questions, please contact us:\nPhone: 503-874-3705\nReply to this email\n\nWe're here to help!`
      };
    default:
      return {
        subject: 'Booking Status Update - Bare Acre Hauling',
        body: `Your booking status has been updated to: ${status}\n\nFor questions, call 503-874-3705`
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
      bookingId,
      status,
      serviceType,
      startDate,
      endDate,
      totalPrice,
      paymentUrl,
      rejectionReason,
    }: NotificationRequest = await req.json();

    if (!customerEmail || !customerName || !status) {
      throw new Error('Missing required fields');
    }

    const { subject, body } = getStatusMessage(status, serviceType, paymentUrl, rejectionReason);

    const emailBody = `
Hello ${customerName},

${body}

Booking Details:
- Booking ID: ${bookingId}
- Start Date: ${new Date(startDate).toLocaleDateString()}
${endDate ? `- End Date: ${new Date(endDate).toLocaleDateString()}` : ''}
${totalPrice ? `- Total: $${totalPrice}` : ''}
${paymentUrl ? `\nPay your invoice online:\n${paymentUrl}` : ''}

---
Bare Acre Hauling
503-874-3705
bareacrehauling.com

Veteran Owned & Operated
    `.trim();

    console.log('Sending notification email:', {
      to: customerEmail,
      subject,
      bookingId,
      status,
    });

    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not configured — status notification logged only:', { customerEmail, subject, status });
    } else {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Bare Acre Hauling <bookings@bareacrehauling.com>',
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

      console.log('Status notification sent:', { customerEmail, subject });
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
