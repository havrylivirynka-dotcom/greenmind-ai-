"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Leaf, ArrowLeft, BarChart3, Zap, Droplets, Wind, Cpu, TrendingUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn, getScoreColor } from "@/lib/utils";

const MODEL_COLORS: Record<string, string> = {
  "gpt-4o-mini": "#22c55e",
  "gpt-4o": "#0ea5e9",
  "gpt-4.1": "#f59e0b",
  "gpt-5": "#8b5cf6",
};

const MIT_LABELS: Record<string, string> = {
  "MIT-1": "Simple QA",
  "MIT-2": "Translation",
  "MIT-3": "Content Gen",
  "MIT-4": "Coding",
  "MIT-5": "Scientific",
};

interface Stats {
  avgPss: number;
  avgGaei: number;
  avgTokens: number;
  avgEnergy: number;
  avgWater: number;
  avgCarbon: number;
  totalPrompts: number;
  modelDistribution: Record<string, number>;
  mitDistribution: Record<string, number>;
}

function StatCard({ label, value, unit, icon, color }: { label: string; value: string | number; unit?: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-background border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", color)}>
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-1">
        <span className="text-2xl font-bold">{value}</span>
        {unit && <span className="text-sm text-muted-foreground mb-0.5">{unit}</span>}
      </div>
    </div>
  );
}

export function DashboardContent() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, []);

  // Demo data for visualization when no real data
  const demoModelData = [
    { name: "GPT-4o-mini", value: 45, color: MODEL_COLORS["gpt-4o-mini"] },
    { name: "GPT-4o", value: 30, color: MODEL_COLORS["gpt-4o"] },
    { name: "GPT-4.1", value: 15, color: MODEL_COLORS["gpt-4.1"] },
    { name: "GPT-5", value: 10, color: MODEL_COLORS["gpt-5"] },
  ];

  const demoMITData = [
    { name: "MIT-1", count: 20, label: "Simple QA" },
    { name: "MIT-2", count: 15, label: "Translation" },
    { name: "MIT-3", count: 30, label: "Content" },
    { name: "MIT-4", count: 25, label: "Coding" },
    { name: "MIT-5", count: 10, label: "Scientific" },
  ];

  const modelData = stats
    ? Object.entries(stats.modelDistribution).map(([name, value]) => ({ name, value, color: MODEL_COLORS[name] ?? "#6b7280" }))
    : demoModelData;

  const mitData = stats
    ? Object.entries(stats.mitDistribution).map(([name, count]) => ({ name, count, label: MIT_LABELS[name] ?? name }))
    : demoMITData;

  const displayStats = stats ?? {
    avgPss: 72, avgGaei: 68, avgTokens: 145, avgEnergy: 0.0043,
    avgWater: 0.00022, avgCarbon: 0.00017, totalPrompts: 0,
    modelDistribution: {}, mitDistribution: {},
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <header className="bg-background border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/chat">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Chat
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-green-600 rounded-md flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">Analytics Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {stats?.totalPrompts === 0 && (
              <Badge variant="outline" className="text-xs">Demo Data</Badge>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Overview Cards */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Sustainability Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Avg PSS Score"
              value={displayStats.avgPss}
              unit="/100"
              icon={<TrendingUp className="w-4 h-4 text-green-600" />}
              color="bg-green-50 dark:bg-green-900/20"
            />
            <StatCard
              label="Avg GAEI"
              value={displayStats.avgGaei}
              unit="/100"
              icon={<BarChart3 className="w-4 h-4 text-blue-500" />}
              color="bg-blue-50 dark:bg-blue-900/20"
            />
            <StatCard
              label="Avg Tokens"
              value={displayStats.avgTokens}
              unit="per query"
              icon={<Cpu className="w-4 h-4 text-purple-500" />}
              color="bg-purple-50 dark:bg-purple-900/20"
            />
            <StatCard
              label="Total Prompts"
              value={displayStats.totalPrompts}
              icon={<Leaf className="w-4 h-4 text-green-600" />}
              color="bg-green-50 dark:bg-green-900/20"
            />
          </div>
        </section>

        {/* Environmental Impact */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Environmental Impact (Avg per Query)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              label="Energy Consumption"
              value={displayStats.avgEnergy.toFixed(4)}
              unit="mWh"
              icon={<Zap className="w-4 h-4 text-yellow-500" />}
              color="bg-yellow-50 dark:bg-yellow-900/20"
            />
            <StatCard
              label="Water Footprint"
              value={displayStats.avgWater.toFixed(5)}
              unit="mL"
              icon={<Droplets className="w-4 h-4 text-blue-500" />}
              color="bg-blue-50 dark:bg-blue-900/20"
            />
            <StatCard
              label="Carbon Footprint"
              value={displayStats.avgCarbon.toFixed(5)}
              unit="mg CO₂e"
              icon={<Wind className="w-4 h-4 text-green-500" />}
              color="bg-green-50 dark:bg-green-900/20"
            />
          </div>
        </section>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Model Distribution Pie */}
          <div className="bg-background border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-1">Model Distribution</h3>
            <p className="text-xs text-muted-foreground mb-4">Which models were selected by Green Routing</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={modelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {modelData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v} queries`, "Count"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-1.5">
              {modelData.map(m => (
                <div key={m.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: m.color }} />
                    <span>{m.name}</span>
                  </div>
                  <span className="text-muted-foreground">{m.value} queries</span>
                </div>
              ))}
            </div>
          </div>

          {/* MIT Distribution Bar */}
          <div className="bg-background border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-1">MIT Distribution</h3>
            <p className="text-xs text-muted-foreground mb-4">Model Interaction Tier breakdown</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mitData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-background border border-border rounded-lg p-2 text-xs shadow-lg">
                        <p className="font-medium">{d.name} — {d.label}</p>
                        <p className="text-muted-foreground">{d.count} queries</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 grid grid-cols-5 gap-1">
              {mitData.map(m => (
                <div key={m.name} className="text-center">
                  <div className="text-xs font-medium">{m.count}</div>
                  <div className="text-xs text-muted-foreground">{m.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Methodology */}
        <section className="bg-background border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-3">Scoring Methodology</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="font-medium text-green-600 mb-1">PSS Formula</p>
              <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                PSS = (0.25×S + 0.20×C + 0.25×T + 0.20×O − 0.10×R) × 20
              </p>
              <p className="text-xs text-muted-foreground mt-2">S=Specificity, C=Context, T=Clarity, O=Structure, R=Redundancy</p>
            </div>
            <div>
              <p className="font-medium text-blue-500 mb-1">GAEI Formula</p>
              <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                GAEI = 0.40×PSS + 0.35×RE + 0.25×RES
              </p>
              <p className="text-xs text-muted-foreground mt-2">RE=Resource Efficiency, RES=Routing Efficiency Score</p>
            </div>
            <div>
              <p className="font-medium text-yellow-500 mb-1">Resource Estimation</p>
              <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                tokens = chars / 4{"\n"}
                energy = tokens × model_factor{"\n"}
                water = energy × 0.05{"\n"}
                carbon = energy × 0.40
              </p>
            </div>
          </div>
        </section>

        {/* Research Export */}
        <section className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-1">Research Mode Export</h3>
              <p className="text-sm text-green-700 dark:text-green-400">Enable Research Mode in the chat sidebar to collect and export scientific datasets</p>
            </div>
            <Link href="/chat">
              <Button variant="green" size="sm" className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                <Leaf className="w-4 h-4" /> Open Chat
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
