import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@14.11.0";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

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
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    const { bookingId } = await req.json();

    const { data: booking, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .maybeSingle();

    if (error || !booking) {
      throw new Error("Booking not found");
    }

    if (!booking.stripe_payment_intent) {
      throw new Error("No payment found for this booking");
    }

    if (booking.payment_status === "refunded" || booking.payment_status === "canceled") {
      throw new Error("Booking already refunded or canceled");
    }

    const startDate = new Date(booking.start_date);
    const now = new Date();
    const hoursUntilStart = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    let refundPercentage = 0;
    let refundReason = "";

    if (hoursUntilStart > 24) {
      refundPercentage = 1.0;
      refundReason = "More than 24 hours notice: 100% refund (minus deposit)";
    } else if (hoursUntilStart >= 12) {
      refundPercentage = 0.5;
      refundReason = "12-24 hours notice: 50% refund (minus deposit)";
    } else {
      throw new Error("No refund available: Less than 12 hours before rental start time");
    }

    const baseAmount = booking.total_price - (booking.deposit_amount || 0);
    const refundAmount = Math.round(baseAmount * refundPercentage * 100);

    if (refundAmount <= 0) {
      throw new Error("No refund amount calculated");
    }

    const refund = await stripe.refunds.create({
      payment_intent: booking.stripe_payment_intent,
      amount: refundAmount,
      reason: "requested_by_customer",
    });

    await supabase
      .from("bookings")
      .update({
        payment_status: "refunded",
        status: "cancelled",
        stripe_refund_id: refund.id,
        refund_amount: refundAmount / 100,
        cancellation_requested_at: now.toISOString(),
      })
      .eq("id", bookingId);

    return new Response(
      JSON.stringify({
        success: true,
        refundAmount: refundAmount / 100,
        refundReason: refundReason,
        refundId: refund.id,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error processing refund:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
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