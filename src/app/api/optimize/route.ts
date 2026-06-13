import { NextRequest, NextResponse } from "next/server";
import { analyzePrompt } from "@/lib/scoring";
import { getOpenAIClient } from "@/lib/providers/openai";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "prompt required" }, { status: 400 });
    }

    const before = analyzePrompt(prompt);

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a Green AI prompt optimization assistant.
Rewrite the prompt to:
- increase specificity
- increase clarity
- reduce ambiguity
- reduce unnecessary tokens
- preserve original intent.
Return only the optimized prompt, nothing else.`,
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    const optimizedPrompt = completion.choices[0]?.message?.content?.trim() ?? prompt;
    const after = analyzePrompt(optimizedPrompt);

    return NextResponse.json({
      optimizedPrompt,
      pssBefore: before.pss.score,
      pssAfter: after.pss.score,
      gaeiBefore: before.gaei,
      gaeiAfter: after.gaei,
      tokensBefore: before.resources.tokens,
      tokensAfter: after.resources.tokens,
      energyBefore: before.resources.energy,
      energyAfter: after.resources.energy,
      waterBefore: before.resources.water,
      waterAfter: after.resources.water,
      carbonBefore: before.resources.carbon,
      carbonAfter: after.resources.carbon,
    });
  } catch (e: any) {
    console.error("Optimize error:", e);
    return NextResponse.json({ error: e.message || "Optimization failed" }, { status: 500 });
  }
}
