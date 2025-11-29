import Link from "next/link";
import { BetForm } from "@/components/BetForm";

export default function ParisPage() {
  return (
    <main className="space-y-8 pb-16">
      <div className="flex flex-col gap-4">
        <Link href="/" className="text-sm text-slate-400">
          ← Retour à l&rsquo;accueil
        </Link>
        <h1 className="text-4xl font-semibold text-white">Placer un pari</h1>
        <p className="text-slate-300">
          Choisissez une commune, un montant et une direction. Les paris sont
          mis en relation pair-à-pair et stockés dans Supabase avec un règlement
          automatique (worker Python) et un prélèvement Stripe.
        </p>
      </div>
      <BetForm />
    </main>
  );
}
