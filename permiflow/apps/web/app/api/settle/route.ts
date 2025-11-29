import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const { dryRun = false } = (await request.json().catch(() => ({}))) as {
      dryRun?: boolean;
    };

    const supabase = getServerSupabase();
    const { data: bets } = await supabase
      .from("bets")
      .select("*")
      .lte("expiry", new Date().toISOString());

    if (!dryRun && bets?.length) {
      await supabase
        .from("bets")
        .update({ settled: true })
        .in(
          "id",
          bets.map((bet) => bet.id),
        );
    }

    return NextResponse.json({
      settled: bets?.length ?? 0,
      dryRun,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Impossible de régler les paris" },
      { status: 500 },
    );
  }
}
