import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";

const schema = z.object({
  amount: z.number().min(5).default(25),
  email: z.string().email().optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export async function POST(request: Request) {
  try {
    const raw = await request.json();
    const payload = schema.parse(raw);
    const stripe = getStripe();

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      success_url: payload.successUrl ?? `${baseUrl}/dashboard?status=success`,
      cancel_url: payload.cancelUrl ?? `${baseUrl}/dashboard?status=cancel`,
      customer_email: payload.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            product_data: {
              name: "Crédit PermiFlow",
            },
            unit_amount: Math.round(payload.amount * 100),
          },
        },
      ],
      metadata: {
        userId: "user-demo",
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Impossible de créer le checkout Stripe" },
      { status: 500 },
    );
  }
}
