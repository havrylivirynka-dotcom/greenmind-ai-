import { NextRequest, NextResponse } from "next/server";
import { analyzePrompt } from "@/lib/scoring";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "prompt required" }, { status: 400 });
    }
    const result = analyzePrompt(prompt);
    return NextResponse.json({
      pss: result.pss.score,
      pssLevel: result.pss.level,
      pssComponents: result.pss.components,
      pssSuggestions: result.pss.suggestions,
      mit: result.mit,
      mitLabel: result.mitLabel,
      tokens: result.resources.tokens,
      energy: result.resources.energy,
      water: result.resources.water,
      carbon: result.resources.carbon,
      gaei: result.gaei,
      recommendedModel: result.recommendedModel,
      routingReason: result.routingReason,
      routingSavings: result.routingSavings,
    });
  } catch (e) {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
