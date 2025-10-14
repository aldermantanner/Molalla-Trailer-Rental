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
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("Stripe API key not configured. Please set up Stripe in your Supabase project settings.");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    const { bookingId, successUrl, cancelUrl } = await req.json();

    const { data: booking, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (error || !booking) {
      throw new Error("Booking not found");
    }

    if (!successUrl || !cancelUrl) {
      throw new Error("Success and cancel URLs are required");
    }

    const lineItems = [];

    const basePrice = booking.total_price - (booking.delivery_fee || 0) - (booking.deposit_amount || 0);

    if (basePrice > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: booking.service_type === "rental"
              ? booking.trailer_type + " Trailer Rental"
              : booking.service_type === "junk_removal"
              ? "Junk Removal Service"
              : "Material Delivery Service",
            description: "Service: " + booking.service_type + (booking.start_date ? " | Dates: " + booking.start_date + " to " + (booking.end_date || booking.start_date) : ""),
          },
          unit_amount: Math.round(basePrice * 100),
        },
        quantity: 1,
      });
    }

    if (booking.delivery_fee && booking.delivery_fee > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Delivery Fee",
            description: "Trailer delivery and pickup service",
          },
          unit_amount: Math.round(booking.delivery_fee * 100),
        },
        quantity: 1,
      });
    }

    if (booking.deposit_amount && booking.deposit_amount > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Refundable Deposit",
            description: "Refunded after trailer inspection upon return",
          },
          unit_amount: Math.round(booking.deposit_amount * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        bookingId: booking.id,
      },
    });

    await supabase
      .from("bookings")
      .update({ stripe_session_id: session.id })
      .eq("id", bookingId);

    return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
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