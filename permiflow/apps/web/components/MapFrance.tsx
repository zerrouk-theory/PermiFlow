"use client";

import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { scaleQuantize } from "d3-scale";
import { TownScore } from "@/types";

const GEO_URL = "/data/france-simplified.geojson";

type Props = {
  scores: TownScore[];
};

const palette = ["#0f172a", "#1d4ed8", "#1d9bf0", "#34d399", "#f5d98c"];

export const MapFrance = ({ scores }: Props) => {
  const [activeTown, setActiveTown] = useState<TownScore | null>(null);

  const colorScale = useMemo(
    () =>
      scaleQuantize<string>().domain([0, 100]).range(palette),
    [],
  );

  const scoreMap = useMemo(
    () => new Map(scores.map((town) => [town.irisCode, town])),
    [scores],
  );

  return (
    <div className="w-full">
      <ComposableMap
        projection="geoMercator"
        height={420}
        style={{ width: "100%", height: "auto" }}
        projectionConfig={{ center: [2.2137, 46.2276], scale: 1700 }}
      >
        <ZoomableGroup>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const irisCode = geo.id?.toString() ?? "";
                const town = scoreMap.get(irisCode);
                const score = town?.score ?? 0;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => town && setActiveTown(town)}
                    onMouseLeave={() => setActiveTown(null)}
                    style={{
                      default: {
                        fill: colorScale(score),
                        outline: "none",
                      },
                      hover: {
                        fill: "#f5d98c",
                        outline: "none",
                      },
                      pressed: {
                        fill: "#f5d98c",
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-slate-400">
        {palette.map((color, index) => (
          <div key={color} className="flex items-center gap-1.5">
            <span
              className="h-3 w-8 rounded-full"
              style={{ background: color }}
            />
            <span>{index * 25} +</span>
          </div>
        ))}
      </div>

      {activeTown && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white">
          <p className="text-base font-semibold">{activeTown.name}</p>
          <p className="text-slate-300">{activeTown.region}</p>
          <div className="mt-2 flex items-center gap-6 text-xs uppercase tracking-wide text-slate-400">
            <span>Score {activeTown.score}</span>
            <span>Permis {activeTown.permits}</span>
            <span>Tendance {activeTown.trend}</span>
          </div>
        </div>
      )}
    </div>
  );
};
