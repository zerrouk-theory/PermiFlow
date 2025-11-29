"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { mockTowns } from "@/data/mock";
import { Direction } from "@/types";
import { useBetStore } from "@/hooks/useBetStore";
import { Button } from "./ui/Button";

const defaultTown = mockTowns[0]?.irisCode ?? "";
const buildDefaultExpiry = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().slice(0, 10);
};

export const BetForm = () => {
  const [townId, setTownId] = useState(defaultTown);
  const [amount, setAmount] = useState(100);
  const [direction, setDirection] = useState<Direction>("UP");
  const [expiry, setExpiry] = useState<string>(buildDefaultExpiry);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const addBet = useBetStore((state) => state.addBet);

  const selectedTown = useMemo(
    () => mockTowns.find((town) => town.irisCode === townId),
    [townId],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    const payload = {
      townId,
      amount,
      direction,
      expiry,
    };

    startTransition(async () => {
      const response = await fetch("/api/bets", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setMessage("Erreur lors de la création du pari.");
        return;
      }

      const data = await response.json();
      addBet(data.bet);
      setMessage("Pari enregistré ✅");
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass grid gap-4 rounded-3xl p-6 md:grid-cols-2"
    >
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-300">
          Commune / IRIS
        </label>
        <select
          className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white"
          value={townId}
          onChange={(event) => setTownId(event.target.value)}
        >
          {mockTowns.map((town) => (
            <option key={town.irisCode} value={town.irisCode}>
              {town.name}
            </option>
          ))}
        </select>
        {selectedTown && (
          <p className="text-xs text-slate-400">
            Score {selectedTown.score} • {selectedTown.permits} permis / 12 mois
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-300">Montant €</label>
        <input
          type="number"
          min={10}
          step={10}
          className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white"
          value={amount}
          onChange={(event) => setAmount(Number(event.target.value))}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-300">
          Direction
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(["UP", "DOWN"] as Direction[]).map((value) => (
            <button
              type="button"
              key={value}
              onClick={() => setDirection(value)}
              className={`rounded-2xl border p-3 font-semibold transition ${
                direction === value
                  ? "border-[#F5D98C] bg-[#F5D98C]/20 text-white"
                  : "border-white/10 text-slate-300 hover:border-white/30"
              }`}
            >
              {value === "UP" ? "Hausse" : "Baisse"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-300">
          Échéance (jour)
        </label>
        <input
          type="date"
          className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white"
          value={expiry}
          onChange={(event) => setExpiry(event.target.value)}
        />
      </div>

      <div className="md:col-span-2">
        <Button
          type="submit"
          className="w-full py-3 text-base"
          disabled={isPending}
        >
          {isPending ? "Envoi..." : "Placer mon pari"}
        </Button>
        {message && (
          <p className="mt-3 text-center text-sm text-slate-300">{message}</p>
        )}
      </div>
    </form>
  );
};
