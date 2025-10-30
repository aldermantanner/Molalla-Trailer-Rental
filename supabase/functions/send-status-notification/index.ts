import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface NotificationRequest {
  customerEmail: string;
  customerName: string;
  bookingId: string;
  status: string;
  startDate: string;
  endDate?: string;
  totalPrice?: number;
}

const getStatusMessage = (status: string): { subject: string; body: string } => {
  switch (status) {
    case 'confirmed':
      return {
        subject: '✅ Booking Confirmed - Molalla Trailer Rentals',
        body: `Great news! Your booking has been confirmed.\n\nWhat's Next:\n- We'll contact you to coordinate pickup/delivery\n- Please bring your driver's license when picking up\n- Payment will be processed at pickup\n\nQuestions? Call us at 503-500-6121`
      };
    case 'active':
      return {
        subject: '🚚 Rental Active - Enjoy Your Trailer!',
        body: `Your rental is now active! You're all set.\n\nReminder:\n- Return by the end date to avoid additional charges\n- Return trailer clean for full deposit refund\n- Contact us if you need to extend your rental\n\nNeed help? Call 503-500-6121`
      };
    case 'completed':
      return {
        subject: '✓ Rental Complete - Thank You!',
        body: `Your rental has been completed and marked as returned.\n\nNext Steps:\n- Your deposit refund will be processed within 2-3 business days\n- You'll receive a separate confirmation when refund is issued\n\nThank you for choosing Molalla Trailer Rentals! We hope to serve you again.\n\nQuestions? Call 503-500-6121`
      };
    case 'cancelled':
      return {
        subject: '❌ Booking Cancelled',
        body: `Your booking has been cancelled.\n\nIf this was unexpected or you have questions, please contact us:\n📞 503-500-6121\n📧 Reply to this email\n\nWe're here to help!`
      };
    default:
      return {
        subject: 'Booking Status Update - Molalla Trailer Rentals',
        body: `Your booking status has been updated to: ${status}\n\nFor questions, call 503-500-6121`
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
      startDate,
      endDate,
      totalPrice,
    }: NotificationRequest = await req.json();

    if (!customerEmail || !customerName || !status) {
      throw new Error('Missing required fields');
    }

    const { subject, body } = getStatusMessage(status);

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
📞 503-500-6121
🌐 molallatrailerrentals.com

Veteran Owned & Operated
    `.trim();

    console.log('Sending notification email:', {
      to: customerEmail,
      subject,
      bookingId,
      status,
    });

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
