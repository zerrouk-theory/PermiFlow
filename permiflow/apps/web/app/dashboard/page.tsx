import Link from "next/link";
import { DashboardOverview } from "@/components/DashboardOverview";

export default function DashboardPage() {
  return (
    <main className="space-y-8 pb-16">
      <div className="flex flex-col gap-4">
        <Link href="/" className="text-sm text-slate-400">
          ← Retour à l&rsquo;accueil
        </Link>
        <div>
          <h1 className="text-4xl font-semibold text-white">
            Dashboard utilisateur
          </h1>
          <p className="text-slate-300">
            Wallet Supabase + Stripe, paris en cours, historique et KYC light.
          </p>
        </div>
      </div>
      <DashboardOverview />
    </main>
  );
}
