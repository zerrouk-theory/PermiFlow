import Link from "next/link";
import { screenGallery } from "@/data/mock";

export default function ScreensPage() {
  return (
    <main className="space-y-8 pb-16">
      <div className="flex flex-col gap-4">
        <Link href="/" className="text-sm text-slate-400">
          ← Retour à l&rsquo;accueil
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
            UI kit
          </p>
          <h1 className="text-4xl font-semibold text-white">
            Les 30 écrans PermiFlow
          </h1>
          <p className="text-slate-300">
            Tous les écrans de l&rsquo;app sont décrits ici : état, KPI cible et lien
            individuel. Idéal pour planifier la roadmap Cursor ou Vercel
            Preview.
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {screenGallery.map((screen) => (
          <Link
            key={screen.slug}
            href={`/screens/${screen.slug}`}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:border-white/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {screen.status}
              </span>
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: screen.accent }}
              />
            </div>
            <h2 className="mt-3 text-xl font-semibold text-white">
              {screen.title}
            </h2>
            <p className="text-sm text-slate-300">{screen.summary}</p>
            <p className="mt-4 text-xs uppercase tracking-widest text-[#F5D98C]">
              KPI : {screen.metric}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
