import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SMSRequest {
  customerPhone: string;
  customerName: string;
  status: string;
  bookingId: string;
  startDate?: string;
  endDate?: string;
}

const getStatusSMS = (status: string, customerName: string, startDate?: string, endDate?: string): string => {
  const firstName = customerName.split(' ')[0];

  switch (status) {
    case 'confirmed':
      return `Hi ${firstName}, your Molalla Trailer rental is CONFIRMED! We'll contact you about pickup. Questions? Call 503-500-6121`;

    case 'active':
      return `${firstName}, your trailer rental is now ACTIVE! Return by ${endDate ? new Date(endDate).toLocaleDateString() : 'end date'}. Need help? 503-500-6121`;

    case 'completed':
      return `Thank you ${firstName}! Rental complete. Your deposit refund will be processed within 2-3 days. - Molalla Trailer Rentals`;

    case 'cancelled':
      return `${firstName}, your booking has been cancelled. Questions? Call us at 503-500-6121 - Molalla Trailer Rentals`;

    case 'pickup_reminder':
      return `Reminder ${firstName}: Trailer pickup is tomorrow! Bring your driver's license. 503-500-6121 - Molalla Trailer Rentals`;

    case 'return_reminder':
      return `Reminder ${firstName}: Trailer return due tomorrow by end of day. Need extension? Call 503-500-6121 - Molalla Trailer Rentals`;

    case 'overdue':
      return `${firstName}, your trailer rental is OVERDUE. Please return ASAP or call 503-500-6121. Late fees apply. - Molalla Trailer`;

    default:
      return `${firstName}, your booking status updated. View details or call 503-500-6121 - Molalla Trailer Rentals`;
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
      customerPhone,
      customerName,
      status,
      bookingId,
      startDate,
      endDate,
    }: SMSRequest = await req.json();

    if (!customerPhone || !customerName || !status) {
      throw new Error('Missing required fields');
    }

    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER') || '+15035006121';

    const message = getStatusSMS(status, customerName, startDate, endDate);

    if (!twilioAccountSid || !twilioAuthToken) {
      console.log('Twilio not configured, simulating SMS');
      console.log('To:', customerPhone);
      console.log('Message:', message);

      return new Response(
        JSON.stringify({
          success: true,
          simulated: true,
          message: 'SMS would be sent (Twilio not configured)',
          preview: message,
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('1') ? `+${cleanPhone}` : `+1${cleanPhone}`;

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
    const formData = new URLSearchParams();
    formData.append('To', formattedPhone);
    formData.append('From', twilioPhoneNumber);
    formData.append('Body', message);

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${twilioAccountSid}:${twilioAuthToken}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Twilio error:', error);
      throw new Error(`Twilio API error: ${response.status}`);
    }

    const result = await response.json();

    console.log('Customer SMS sent:', {
      to: formattedPhone,
      sid: result.sid,
      bookingId,
      status,
    });

    return new Response(
      JSON.stringify({
        success: true,
        messageSid: result.sid,
        to: formattedPhone,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Error sending customer SMS:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to send SMS',
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
