"use client";

import { useEffect } from "react";
import { mockBets, mockTowns } from "@/data/mock";
import { useBetStore } from "@/hooks/useBetStore";
import { Card } from "./ui/Card";

export const LiveFeed = () => {
  const bets = useBetStore((state) => state.bets);
  const replaceAll = useBetStore((state) => state.replaceAll);

  useEffect(() => {
    replaceAll(mockBets);
  }, [replaceAll]);

  return (
    <Card title="Flux temps réel" subtitle="Derniers paris confirmés">
      <ul className="space-y-3 text-sm">
        {bets.slice(0, 6).map((bet) => {
          const town = mockTowns.find((item) => item.irisCode === bet.townId);
          return (
            <li
              key={bet.id}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-2.5"
            >
              <div>
                <p className="font-semibold text-white">
                  {town?.name ?? "IRIS"}
                </p>
                <p className="text-xs text-slate-400">
                  {bet.direction === "UP" ? "Hausse" : "Baisse"} • Echéance{" "}
                  {new Date(bet.expiry).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <p className="text-white">€{bet.amount}</p>
            </li>
          );
        })}
      </ul>
    </Card>
  );
};
