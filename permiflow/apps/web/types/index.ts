export type Direction = "UP" | "DOWN";

export type TownScore = {
  irisCode: string;
  name: string;
  region: string;
  score: number;
  trend: "bullish" | "bearish" | "neutral";
  permits: number;
};

export type Bet = {
  id: string;
  townId: string;
  userId: string;
  direction: Direction;
  amount: number;
  odds: number;
  status: "OPEN" | "SETTLED" | "WIN" | "LOSE";
  expiry: string;
};

export type UserWallet = {
  id: string;
  name: string;
  balance: number;
  kycLevel: "light" | "full";
  totalGain: number;
};

export type ScreenInfo = {
  slug: string;
  title: string;
  summary: string;
  metric: string;
  status: "Alpha" | "Beta" | "Stable";
  accent?: string;
};
