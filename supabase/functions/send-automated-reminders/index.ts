import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const todayStr = now.toISOString().split('T')[0];

    const { data: pickupReminders, error: pickupError } = await supabase
      .from('bookings')
      .select('*')
      .eq('status', 'confirmed')
      .eq('start_date', tomorrowStr);

    if (pickupError) throw pickupError;

    const { data: returnReminders, error: returnError } = await supabase
      .from('bookings')
      .select('*')
      .eq('status', 'active')
      .eq('end_date', tomorrowStr);

    if (returnError) throw returnError;

    const { data: overdueRentals, error: overdueError } = await supabase
      .from('bookings')
      .select('*')
      .eq('status', 'active')
      .lt('end_date', todayStr);

    if (overdueError) throw overdueError;

    const results = {
      pickupReminders: 0,
      returnReminders: 0,
      overdueNotifications: 0,
      manualTextRecommended: [] as string[],
    };

    for (const booking of pickupReminders || []) {
      try {
        await fetch(`${supabaseUrl}/functions/v1/send-status-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            customerEmail: booking.customer_email,
            customerName: booking.customer_name,
            bookingId: booking.id,
            status: 'pickup_reminder',
            startDate: booking.start_date,
            totalPrice: booking.total_price,
          }),
        });
        results.pickupReminders++;
        results.manualTextRecommended.push(`${booking.customer_name} (${booking.customer_phone}) - Pickup tomorrow`);
      } catch (err) {
        console.error('Failed to send pickup reminder email:', err);
      }
    }

    for (const booking of returnReminders || []) {
      try {
        await fetch(`${supabaseUrl}/functions/v1/send-status-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            customerEmail: booking.customer_email,
            customerName: booking.customer_name,
            bookingId: booking.id,
            status: 'return_reminder',
            endDate: booking.end_date,
            totalPrice: booking.total_price,
          }),
        });
        results.returnReminders++;
        results.manualTextRecommended.push(`${booking.customer_name} (${booking.customer_phone}) - Return due tomorrow`);
      } catch (err) {
        console.error('Failed to send return reminder email:', err);
      }
    }

    for (const booking of overdueRentals || []) {
      try {
        await supabase
          .from('bookings')
          .update({ status: 'overdue' })
          .eq('id', booking.id);

        await fetch(`${supabaseUrl}/functions/v1/send-status-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            customerEmail: booking.customer_email,
            customerName: booking.customer_name,
            bookingId: booking.id,
            status: 'overdue',
            endDate: booking.end_date,
            totalPrice: booking.total_price,
          }),
        });
        results.overdueNotifications++;
        results.manualTextRecommended.push(`🚨 URGENT: ${booking.customer_name} (${booking.customer_phone}) - OVERDUE rental`);
      } catch (err) {
        console.error('Failed to send overdue notification email:', err);
      }
    }

    console.log('Reminder summary:', results);
    console.log('MANUAL TEXT RECOMMENDED FOR:', results.manualTextRecommended);

    return new Response(
      JSON.stringify({
        success: true,
        ...results,
        timestamp: now.toISOString(),
        note: 'Email notifications sent. Consider manually texting critical customers listed in manualTextRecommended.',
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Error in reminder system:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
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
