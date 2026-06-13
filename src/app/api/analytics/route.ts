import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ analytics: null });

    const { data, error } = await supabase
      .from("prompt_analytics")
      .select(`
        *,
        messages!inner(
          conversation_id,
          conversations!inner(user_id)
        )
      `)
      .eq("messages.conversations.user_id", user.id);

    if (error) throw error;

    const records = data ?? [];
    if (records.length === 0) {
      return NextResponse.json({
        avgPss: 0, avgGaei: 0, avgTokens: 0,
        avgEnergy: 0, avgWater: 0, avgCarbon: 0,
        totalPrompts: 0,
        modelDistribution: {},
        mitDistribution: {},
      });
    }

    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

    const modelDist: Record<string, number> = {};
    const mitDist: Record<string, number> = {};

    records.forEach(r => {
      if (r.selected_model) modelDist[r.selected_model] = (modelDist[r.selected_model] || 0) + 1;
      if (r.mit) mitDist[`MIT-${r.mit}`] = (mitDist[`MIT-${r.mit}`] || 0) + 1;
    });

    return NextResponse.json({
      avgPss: Math.round(avg(records.map(r => r.pss || 0))),
      avgGaei: Math.round(avg(records.map(r => r.gaei || 0))),
      avgTokens: Math.round(avg(records.map(r => r.tokens || 0))),
      avgEnergy: avg(records.map(r => r.energy || 0)),
      avgWater: avg(records.map(r => r.water || 0)),
      avgCarbon: avg(records.map(r => r.carbon || 0)),
      totalPrompts: records.length,
      modelDistribution: modelDist,
      mitDistribution: mitDist,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
