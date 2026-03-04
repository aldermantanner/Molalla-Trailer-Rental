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
      if (paymentUrl) {
        return {
          subject: '🎉 Booking Confirmed - Payment Instructions Inside',
          body: `Thank you for your ${serviceType === 'rental' ? 'trailer rental' : 'junk removal'} booking!\n\nYour booking has been received and your invoice is ready.\n\n💳 PAYMENT INSTRUCTIONS:\nPay securely online using the link below. We accept credit cards and bank transfers through QuickBooks.\n\n${paymentUrl ? 'Click the payment link at the bottom of this email to pay now.' : ''}\n\nWhat's Next:\n- Pay your invoice online (secure QuickBooks payment)\n- We'll contact you to coordinate ${serviceType === 'rental' ? 'pickup/delivery' : 'service'} details\n- Bring your driver's license ${serviceType === 'rental' ? 'when picking up' : 'on service day'}\n\nQuestions? Call us at 503-874-3705`
        };
      }
      return {
        subject: '📋 Booking Received - Molalla Trailer Rentals',
        body: `Thank you for your booking! We've received your request and will contact you shortly to confirm details and arrange payment.\n\nQuestions? Call us at 503-874-3705`
      };
    case 'confirmed':
      return {
        subject: '✅ Booking Confirmed - Molalla Trailer Rentals',
        body: `Great news! Your booking has been confirmed.\n\nWhat's Next:\n- We'll contact you to coordinate pickup/delivery\n- Please bring your driver's license when picking up${paymentUrl ? '\n- Pay your invoice securely online (link below)' : '\n- Payment will be processed at pickup'}\n\nQuestions? Call us at 503-874-3705`
      };
    case 'active':
      return {
        subject: '🚚 Rental Active - Enjoy Your Trailer!',
        body: `Your rental is now active! You're all set.\n\nReminder:\n- Return by the end date to avoid additional charges\n- Return trailer clean for full deposit refund\n- Contact us if you need to extend your rental\n\nNeed help? Call 503-874-3705`
      };
    case 'completed':
      return {
        subject: '✓ Rental Complete - Thank You!',
        body: `Your rental has been completed and marked as returned.\n\nNext Steps:\n- Your deposit refund will be processed within 2-3 business days\n- You'll receive a separate confirmation when refund is issued\n\nThank you for choosing Molalla Trailer Rentals! We hope to serve you again.\n\nQuestions? Call 503-874-3705`
      };
    case 'cancelled':
      return {
        subject: '❌ Booking Cancelled',
        body: `Your booking has been cancelled.${rejectionReason ? `\n\nReason: ${rejectionReason}` : ''}\n\nIf this was unexpected or you have questions, please contact us:\n📞 503-874-3705\n📧 Reply to this email\n\nWe're here to help!`
      };
    default:
      return {
        subject: 'Booking Status Update - Molalla Trailer Rentals',
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
Molalla Trailer Rentals
📞 503-874-3705
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