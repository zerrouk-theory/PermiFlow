import Link from "next/link";
import { MapFrance } from "@/components/MapFrance";
import { Card } from "@/components/ui/Card";
import { mockTowns } from "@/data/mock";
import { LiveFeed } from "@/components/LiveFeed";
import { ScreenTiles } from "@/components/ScreenTiles";

export default function Home() {
  return (
    <main className="space-y-10 pb-16">
      <section className="glass gap-6 rounded-[32px] p-8 text-white shadow-2xl">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
          PermiFlow
        </p>
        <h1 className="text-4xl font-semibold sm:text-5xl">
          Captez le pouls de la ville
        </h1>
        <p className="max-w-2xl text-lg text-slate-300">
          Analysez les permis de construire, visualisez les dynamiques urbaines
          et placez des paris sur les quartiers les plus prometteurs. Données
          IRIS, Supabase, Stripe et cartes React Simple Maps réunis dans une PWA
          installable.
        </p>
        <div className="flex flex-wrap gap-4 text-sm font-semibold">
          <Link
            href="/paris"
            className="inline-flex items-center rounded-full bg-[#1E3A8A] px-6 py-3 text-base text-white transition hover:bg-[#2746a8]"
          >
            Placer un pari
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 text-base text-white transition hover:border-white hover:bg-white/10"
          >
            Accéder au dashboard
          </Link>
          <Link
            href="/screens"
            className="inline-flex items-center text-sm font-semibold text-[#F5D98C]"
          >
            Voir les 30 écrans →
          </Link>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card
          title="Heatmap France"
          subtitle="Scores IRIS (0-100)"
          className="lg:col-span-1"
        >
          <MapFrance scores={mockTowns} />
        </Card>
        <LiveFeed />
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Card title="Permis 30j" subtitle="Totaux agrégés">
          <p className="text-3xl font-semibold text-white">655</p>
          <p className="text-xs text-slate-400">+12% vs période précédente</p>
        </Card>
        <Card title="Mise moyenne" subtitle="Sur la plateforme">
          <p className="text-3xl font-semibold text-white">€126</p>
          <p className="text-xs text-slate-400">Ticket Stripe + wallet</p>
        </Card>
        <Card title="Taux succès" subtitle="Parieurs verifiés">
          <p className="text-3xl font-semibold text-white">61%</p>
          <p className="text-xs text-slate-400">Après règlement 5% fee</p>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Extraits d’écrans (30)
            </h2>
            <p className="text-sm text-slate-400">
              Tous les écrans sont disponibles dans /screens avec navigation
              dédiée.
            </p>
          </div>
          <Link
            href="/screens"
            className="text-sm font-semibold text-[#F5D98C]"
          >
            Tout explorer
          </Link>
        </div>
        <ScreenTiles limit={6} />
      </section>

      <section className="glass rounded-3xl p-6">
        <h3 className="text-xl font-semibold text-white">Pipeline nightly</h3>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-300">
          <li>
            02:00 — Scraper Python télécharge SITADEL et agrège les permis.
          </li>
          <li>
            02:30 — Script XGBoost met à jour les scores dans Supabase.
          </li>
          <li>05:00 — Worker settle calcule les gagnants et applique 5% fee.</li>
          <li>
            06:00 — Health check GitHub Actions valide les routes publiques.
          </li>
        </ol>
      </section>
    </main>
  );
}
