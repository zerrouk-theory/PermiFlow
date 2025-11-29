import { notFound } from "next/navigation";
import Link from "next/link";
import { screenGallery } from "@/data/mock";

type Props = {
  params: { slug: string };
};

export default function ScreenDetail({ params }: Props) {
  const screen = screenGallery.find((entry) => entry.slug === params.slug);

  if (!screen) {
    notFound();
  }

  return (
    <main className="space-y-8 pb-16">
      <Link href="/screens" className="text-sm text-slate-400">
        ← Retour aux écrans
      </Link>

      <article className="glass space-y-4 rounded-3xl p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
          {screen.status}
        </p>
        <h1 className="text-4xl font-semibold text-white">{screen.title}</h1>
        <p className="text-lg text-slate-200">{screen.summary}</p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-widest text-slate-400">
              KPI cible
            </p>
            <p className="text-2xl font-semibold text-white">{screen.metric}</p>
            <p className="text-sm text-slate-400">
              Utiliser ce KPI pour configurer les tests e2e ou les alertes
              Supabase.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Statut
            </p>
            <p className="text-2xl font-semibold text-white">
              {screen.status}
            </p>
            <p className="text-sm text-slate-400">
              Mettre à jour ce label depuis `data/mock.ts` quand l&rsquo;écran passe
              en production.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
