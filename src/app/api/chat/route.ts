import { NextRequest, NextResponse } from "next/server";
import { analyzePrompt } from "@/lib/scoring";
import { getOpenAIClient, MODEL_IDS } from "@/lib/providers/openai";

export async function POST(req: NextRequest) {
  try {
    const { prompt, conversationHistory = [] } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "prompt required" }, { status: 400 });
    }

    const analysis = analyzePrompt(prompt);
    const modelKey = analysis.recommendedModel;
    const modelId = MODEL_IDS[modelKey] ?? "gpt-4o-mini";

    const openai = getOpenAIClient();

    const messages = [
      {
        role: "system" as const,
        content: "You are a helpful AI assistant. Provide clear, accurate, and concise responses.",
      },
      ...conversationHistory.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: prompt },
    ];

    const completion = await openai.chat.completions.create({
      model: modelId,
      messages,
      max_tokens: 2048,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content ?? "No response generated.";
    const actualTokens = completion.usage?.total_tokens ?? analysis.resources.tokens;

    return NextResponse.json({
      response,
      modelUsed: modelKey,
      analytics: {
        pss: analysis.pss.score,
        mit: analysis.mit,
        tokens: actualTokens,
        energy: analysis.resources.energy,
        water: analysis.resources.water,
        carbon: analysis.resources.carbon,
        gaei: analysis.gaei,
        selectedModel: modelKey,
        routingSavings: analysis.routingSavings,
      },
    });
  } catch (e: any) {
    console.error("Chat error:", e);
    return NextResponse.json({ error: e.message || "Chat failed" }, { status: 500 });
  }
}
