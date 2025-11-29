import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSupabase } from "@/lib/supabaseClient";
import { mockBets } from "@/data/mock";

const betSchema = z.object({
  townId: z.string().min(1),
  amount: z.number().min(10),
  direction: z.enum(["UP", "DOWN"]),
  expiry: z.string(),
});

export async function GET() {
  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase.from("bets").select("*").limit(25);
    if (error) throw error;
    return NextResponse.json({ bets: data });
  } catch {
    return NextResponse.json({ bets: mockBets });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = betSchema.parse({
      ...body,
      amount: Number(body.amount),
    });

    const betRecord = {
      id: randomUUID(),
      user_id: "user-demo",
      town_id: payload.townId,
      direction: payload.direction,
      amount: payload.amount,
      expiry: payload.expiry,
      settled: false,
    };

    try {
      const supabase = getServerSupabase();
      const { error } = await supabase.from("bets").insert(betRecord);
      if (error) throw error;
    } catch (error) {
      console.warn("Fallback bet insert (mock)", error);
    }

    return NextResponse.json({
      bet: {
        id: betRecord.id,
        townId: payload.townId,
        userId: "user-demo",
        direction: payload.direction,
        amount: payload.amount,
        status: "OPEN",
        expiry: payload.expiry,
        odds: 1.9,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Payload invalide" },
      { status: 400 },
    );
  }
}
