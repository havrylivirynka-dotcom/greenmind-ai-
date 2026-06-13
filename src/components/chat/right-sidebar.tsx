"use client";

import { useState } from "react";
import { Leaf, Zap, Droplets, Wind, Cpu, TrendingDown, ChevronRight, ChevronLeft, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message, LiveAnalysis, OptimizationResult } from "@/types/chat";
import { cn, getScoreColor, getScoreBg } from "@/lib/utils";

interface Props {
  liveAnalysis: LiveAnalysis | null;
  lastOptimization: OptimizationResult | null;
  messages: Message[];
}

function ScoreCircle({ score, label, size = "md" }: { score: number; label: string; size?: "sm" | "md" }) {
  const isSmall = size === "sm";
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={cn("relative rounded-full flex items-center justify-center border-2", isSmall ? "w-12 h-12" : "w-16 h-16", score >= 80 ? "border-green-400" : score >= 60 ? "border-green-300" : score >= 40 ? "border-yellow-400" : "border-orange-400")}>
        <span className={cn("font-bold", isSmall ? "text-base" : "text-xl", getScoreColor(score))}>{score}</span>
      </div>
      <span className="text-xs text-muted-foreground text-center">{label}</span>
    </div>
  );
}

export function RightSidebar({ liveAnalysis, lastOptimization, messages }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  const analytics = liveAnalysis;
  const hasData = !!analytics;

  const totalEnergy = messages.filter(m => m.analytics).reduce((acc, m) => acc + (m.analytics?.energy ?? 0), 0);
  const totalCarbon = messages.filter(m => m.analytics).reduce((acc, m) => acc + (m.analytics?.carbon ?? 0), 0);
  const totalWater = messages.filter(m => m.analytics).reduce((acc, m) => acc + (m.analytics?.water ?? 0), 0);

  return (
    <div className={cn("flex flex-col border-l border-border bg-background transition-all duration-200", collapsed ? "w-10" : "w-72")}>
      <div className="p-2 border-b border-border flex items-center">
        <SidebarButton className="h-7 w-7" onClick={() => setCollapsed(c => !c)}>
          {collapsed ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </SidebarButton>
        {!collapsed && <span className="text-sm font-medium ml-2">Analysis Panel</span>}
      </div>

      {!collapsed && (
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-5">
            {/* Scores */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Sustainability Scores</p>
              <div className="flex items-center justify-around">
                <ScoreCircle score={hasData ? analytics!.pss : 0} label="PSS" />
                <ScoreCircle score={hasData ? analytics!.gaei : 0} label="GAEI" />
              </div>
              {hasData && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Prompt Sustainability</span>
                    <span className={cn("font-medium", getScoreColor(analytics!.pss))}>{analytics!.pssLevel || "—"}</span>
                  </div>
                  <Progress value={analytics!.pss} className="h-1.5" />
                </div>
              )}
            </div>

            <Separator />

            {/* Model Routing */}
            {hasData && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Model Routing</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Tier</span>
                    <Badge variant="outline" className="font-mono text-xs">{analytics!.mitLabel}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Model</span>
                    <Badge className="text-xs bg-green-600 hover:bg-green-700 text-white">{analytics!.recommendedModel}</Badge>
                  </div>
                  {analytics!.routingReason && (
                    <p className="text-xs text-muted-foreground bg-muted rounded-md p-2 leading-relaxed">
                      {analytics!.routingReason}
                    </p>
                  )}
                </div>
              </div>
            )}

            {hasData && <Separator />}

            {/* Resource Metrics */}
            {hasData && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Resource Impact</p>
                <div className="space-y-3">
                  {[
                    { icon: <Cpu className="w-3.5 h-3.5 text-muted-foreground" />, label: "Tokens", value: analytics!.tokens, unit: "" },
                    { icon: <Zap className="w-3.5 h-3.5 text-yellow-500" />, label: "Energy", value: analytics!.energy.toFixed(3), unit: " mWh" },
                    { icon: <Droplets className="w-3.5 h-3.5 text-blue-500" />, label: "Water", value: analytics!.water.toFixed(4), unit: " mL" },
                    { icon: <Wind className="w-3.5 h-3.5 text-green-500" />, label: "Carbon", value: analytics!.carbon.toFixed(4), unit: " mg CO₂e" },
                  ].map(m => (
                    <div key={m.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {m.icon}
                        <span className="text-xs text-muted-foreground">{m.label}</span>
                      </div>
                      <span className="text-xs font-medium font-mono">{m.value}{m.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PSS Suggestions */}
            {hasData && analytics!.pssSuggestions.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Suggestions</p>
                  <ul className="space-y-1.5">
                    {analytics!.pssSuggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <Leaf className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Optimization Comparison */}
            {lastOptimization && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <TrendingDown className="w-3.5 h-3.5 text-green-600" />
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Optimization Impact</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "PSS", before: lastOptimization.pssBefore, after: lastOptimization.pssAfter, higher: true },
                      { label: "GAEI", before: lastOptimization.gaeiBefore, after: lastOptimization.gaeiAfter, higher: true },
                      { label: "Tokens", before: lastOptimization.tokensBefore, after: lastOptimization.tokensAfter, higher: false },
                    ].map(m => {
                      const diff = m.after - m.before;
                      const improved = m.higher ? diff > 0 : diff < 0;
                      return (
                        <div key={m.label} className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{m.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">{m.before}</span>
                            <span className="text-muted-foreground">→</span>
                            <span className={improved ? "text-green-600 font-medium" : "text-orange-500 font-medium"}>{m.after}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Session Totals */}
            {messages.some(m => m.analytics) && (
              <>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Session Totals</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        <span className="text-muted-foreground">Total Energy</span>
                      </div>
                      <span className="font-mono">{totalEnergy.toFixed(3)} mWh</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <Wind className="w-3 h-3 text-green-500" />
                        <span className="text-muted-foreground">Total Carbon</span>
                      </div>
                      <span className="font-mono">{totalCarbon.toFixed(4)} mg</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <Droplets className="w-3 h-3 text-blue-500" />
                        <span className="text-muted-foreground">Total Water</span>
                      </div>
                      <span className="font-mono">{totalWater.toFixed(4)} mL</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!hasData && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Leaf className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Start typing a prompt to see sustainability analysis
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

function SidebarButton({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent/10 focus-visible:outline-none",
        className
      )}
    >
      {children}
    </button>
  );
}
