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

    const { bookingId, refundAmount } = await req.json();

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

    if (booking.deposit_refunded) {
      throw new Error("Deposit already refunded");
    }

    const refundAmountCents = Math.round(refundAmount * 100);

    const refund = await stripe.refunds.create({
      payment_intent: booking.stripe_payment_intent,
      amount: refundAmountCents,
      reason: "requested_by_customer",
    });

    await supabase
      .from("bookings")
      .update({
        deposit_refunded: true,
        deposit_refund_amount: refundAmount,
      })
      .eq("id", bookingId);

    return new Response(
      JSON.stringify({
        success: true,
        refundAmount: refundAmount,
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
    console.error("Error refunding deposit:", error);
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