import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export const getStripe = () => {
  if (stripeClient) return stripeClient;

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error("STRIPE_SECRET_KEY manquant");
  }

  stripeClient = new Stripe(secret, {
    apiVersion: "2024-09-30.acacia",
  });

  return stripeClient;
};
