"use client";

import { useState, useRef, useCallback } from "react";
import { Message, LiveAnalysis, OptimizationResult } from "@/types/chat";
import { LeftSidebar } from "./left-sidebar";
import { ChatCenter } from "./chat-center";
import { RightSidebar } from "./right-sidebar";
import { analyzePrompt } from "@/lib/scoring";

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [liveAnalysis, setLiveAnalysis] = useState<LiveAnalysis | null>(null);
  const [lastOptimization, setLastOptimization] = useState<OptimizationResult | null>(null);
  const [researchMode, setResearchMode] = useState(false);
  const [conversationId] = useState<string>(() => crypto.randomUUID());

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
    if (value.trim().length > 3) {
      const result = analyzePrompt(value);
      setLiveAnalysis({
        pss: result.pss.score,
        pssLevel: result.pss.level,
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
    } else {
      setLiveAnalysis(null);
    }
  }, []);

  const handleSend = useCallback(async (promptOverride?: string) => {
    const prompt = typeof promptOverride === "string" ? promptOverride : input;
    if (!prompt.trim() || isLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLiveAnalysis(null);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, conversationHistory: history }),
      });
      const data = await res.json();

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.response ?? "No response.",
        model: data.modelUsed,
        analytics: data.analytics,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);

      if (data.analytics) {
        setLiveAnalysis({
          pss: data.analytics.pss,
          pssLevel: "",
          pssSuggestions: [],
          mit: data.analytics.mit,
          mitLabel: `MIT-${data.analytics.mit}`,
          tokens: data.analytics.tokens,
          energy: data.analytics.energy,
          water: data.analytics.water,
          carbon: data.analytics.carbon,
          gaei: data.analytics.gaei,
          recommendedModel: data.analytics.selectedModel,
          routingReason: "",
          routingSavings: data.analytics.routingSavings,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const handleOptimize = useCallback(async () => {
    if (!input.trim() || isOptimizing) return;
    setIsOptimizing(true);
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      if (data.optimizedPrompt) {
        setLastOptimization(data);
        setInput(data.optimizedPrompt);
        handleInputChange(data.optimizedPrompt);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsOptimizing(false);
    }
  }, [input, isOptimizing, handleInputChange]);

  const handleExport = useCallback(async (format: "csv" | "json") => {
    const exportData = messages
      .filter(m => m.analytics)
      .map(m => ({
        timestamp: m.timestamp.toISOString(),
        role: m.role,
        prompt_preview: m.content.slice(0, 100),
        model: m.model ?? "",
        pss: m.analytics?.pss ?? 0,
        mit: m.analytics?.mit ?? 0,
        tokens: m.analytics?.tokens ?? 0,
        energy_mwh: m.analytics?.energy ?? 0,
        water_ml: m.analytics?.water ?? 0,
        carbon_mg: m.analytics?.carbon ?? 0,
        gaei: m.analytics?.gaei ?? 0,
      }));

    const res = await fetch("/api/research/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ format, data: exportData }),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `greenmind-export.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [messages]);

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <LeftSidebar
        messages={messages}
        researchMode={researchMode}
        onToggleResearch={() => setResearchMode(r => !r)}
        onExport={handleExport}
        onNewChat={() => { setMessages([]); setInput(""); setLiveAnalysis(null); setLastOptimization(null); }}
      />
      <ChatCenter
        messages={messages}
        input={input}
        isLoading={isLoading}
        isOptimizing={isOptimizing}
        onInputChange={handleInputChange}
        onSend={handleSend}
        onOptimize={handleOptimize}
      />
      <RightSidebar
        liveAnalysis={liveAnalysis}
        lastOptimization={lastOptimization}
        messages={messages}
      />
    </div>
  );
}
