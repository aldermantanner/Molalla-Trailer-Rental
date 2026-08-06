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

const getStatusMessage = (status: string, serviceType?: string, paymentUrl?: string, rejectionReason?: string): { subject: string; body: string } => {
  switch (status) {
    case 'pending':
      return {
        subject: '📋 Booking Received - Bare Acre Hauling',
        body: `Thank you for your ${serviceType === 'rental' ? 'trailer rental' : 'junk removal'} booking!\n\nYour booking has been received and we'll contact you shortly to confirm details and arrange payment.\n\nWhat's Next:\n- We'll contact you to coordinate ${serviceType === 'rental' ? 'pickup/delivery' : 'service'} details\n- Bring your driver's license ${serviceType === 'rental' ? 'when picking up' : 'on service day'}\n- Payment arrangements will be discussed when we contact you\n\nQuestions? Call us at 503-874-3705`
      };
    case 'confirmed':
      return {
        subject: '✅ Booking Confirmed - Bare Acre Hauling',
        body: `Great news! Your booking has been confirmed.\n\nWhat's Next:\n- We'll contact you to coordinate pickup/delivery\n- Please bring your driver's license when picking up\n- Payment will be processed at pickup\n\nQuestions? Call us at 503-874-3705`
      };
    case 'active':
      return {
        subject: '🚚 Rental Active - Enjoy Your Trailer!',
        body: `Your rental is now active! You're all set.\n\nReminder:\n- Return by the end date to avoid additional charges\n- Return trailer clean for full deposit refund\n- Contact us if you need to extend your rental\n\nNeed help? Call 503-874-3705`
      };
    case 'completed':
      return {
        subject: '✓ Rental Complete - Thank You!',
        body: `Your rental has been completed and marked as returned.\n\nNext Steps:\n- Your deposit refund will be processed within 2-3 business days\n- You'll receive a separate confirmation when refund is issued\n\nThank you for choosing Bare Acre Hauling! We hope to serve you again.\n\nQuestions? Call 503-874-3705`
      };
    case 'cancelled':
      return {
        subject: '❌ Booking Cancelled',
        body: `Your booking has been cancelled.${rejectionReason ? `\n\nReason: ${rejectionReason}` : ''}\n\nIf this was unexpected or you have questions, please contact us:\n📞 503-874-3705\n📧 Reply to this email\n\nWe're here to help!`
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
      customerPhone,
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
${paymentUrl ? `\n💳 PAY YOUR INVOICE ONLINE:\n${paymentUrl}\n\nPay securely with credit card or bank transfer through QuickBooks.` : ''}

---
Bare Acre Hauling
📞 503-874-3705
🌐 bareacrehauling.com

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