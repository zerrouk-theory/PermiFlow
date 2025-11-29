import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getServerSupabase } from "@/lib/supabaseClient";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const secret = process.env.STRIPE_ENDPOINT_SECRET;
    if (!secret) {
      throw new Error("STRIPE_ENDPOINT_SECRET manquant");
    }

    const event = stripe.webhooks.constructEvent(body, signature, secret);
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const amount = (session.amount_total ?? 0) / 100;

      if (userId && amount > 0) {
        const supabase = getServerSupabase();
        await supabase.rpc("increment_balance", {
          p_user_id: userId,
          p_amount: amount,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Webhook invalide" },
      { status: 400 },
    );
  }
}
