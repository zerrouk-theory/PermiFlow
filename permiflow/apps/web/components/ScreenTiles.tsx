import Link from "next/link";
import { screenGallery } from "@/data/mock";

export const ScreenTiles = ({ limit = 6 }: { limit?: number }) => {
  const list = screenGallery.slice(0, limit);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {list.map((screen) => (
        <Link
          href={`/screens/${screen.slug}`}
          key={screen.slug}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:border-white/30"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            {screen.status}
          </p>
          <h4 className="mt-2 text-lg font-semibold text-white">
            {screen.title}
          </h4>
          <p className="text-sm text-slate-300">{screen.summary}</p>
          <p className="mt-4 text-sm font-semibold text-white">
            KPI : {screen.metric}
          </p>
        </Link>
      ))}
    </div>
  );
};
