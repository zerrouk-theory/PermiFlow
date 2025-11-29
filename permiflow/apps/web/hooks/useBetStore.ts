"use client";

import { create } from "zustand";
import { Bet } from "@/types";
import { mockBets } from "@/data/mock";

type BetState = {
  bets: Bet[];
  addBet: (bet: Bet) => void;
  updateBet: (betId: string, payload: Partial<Bet>) => void;
  replaceAll: (bets: Bet[]) => void;
};

export const useBetStore = create<BetState>((set) => ({
  bets: mockBets,
  addBet: (bet) =>
    set((state) => ({
      bets: [bet, ...state.bets],
    })),
  updateBet: (betId, payload) =>
    set((state) => ({
      bets: state.bets.map((bet) =>
        bet.id === betId ? { ...bet, ...payload } : bet,
      ),
    })),
  replaceAll: (bets) => set({ bets }),
}));
