import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabaseClient";
import { mockTowns } from "@/data/mock";

export async function GET() {
  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("towns")
      .select("iris_code, name, score, permits")
      .limit(50);
    if (error) throw error;

    return NextResponse.json({ towns: data });
  } catch {
    return NextResponse.json({ towns: mockTowns });
  }
}
