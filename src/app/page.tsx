import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Leaf, Zap, BarChart3, ArrowRight, CheckCircle, Droplets, Wind, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">GreenMind AI</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
            <a href="#impact" className="hover:text-foreground transition-colors">Impact</a>
            <a href="#research" className="hover:text-foreground transition-colors">Research</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/chat">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                Launch App
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <Badge variant="green" className="mb-6 text-xs px-3 py-1">
            🌱 Scientific Research Platform — Genius Olympiad 2025
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            AI that{" "}
            <span className="text-green-600">thinks green</span>
            <br />before it thinks.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            GreenMind AI analyzes, optimizes, and routes your prompts to minimize environmental impact —
            measuring energy, water, and carbon footprint in real time.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/chat">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white gap-2 h-12 px-8">
                Start Chatting <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="gap-2 h-12 px-8">
                <BarChart3 className="w-4 h-4" /> View Dashboard
              </Button>
            </Link>
          </div>
          <div className="mt-16 grid grid-cols-3 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { label: "PSS", desc: "Prompt Sustainability Score" },
              { label: "GAEI", desc: "Green AI Efficiency Index" },
              { label: "MIT", desc: "Model Interaction Tier" },
            ].map(m => (
              <div key={m.label} className="text-center">
                <div className="text-3xl font-bold text-green-600">{m.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">How GreenMind Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Four intelligent layers that make every AI interaction more sustainable</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: <Cpu className="w-6 h-6" />, step: "01", title: "Analyze", desc: "Every prompt is analyzed for sustainability using PSS and MIT classification before execution." },
              { icon: <Zap className="w-6 h-6" />, step: "02", title: "Route", desc: "Intelligent routing selects the most energy-efficient model based on task complexity." },
              { icon: <Leaf className="w-6 h-6" />, step: "03", title: "Optimize", desc: "One-click optimization rewrites your prompt to reduce tokens while preserving intent." },
              { icon: <BarChart3 className="w-6 h-6" />, step: "04", title: "Measure", desc: "Real-time metrics show energy (mWh), water (mL), and carbon (mg CO₂e) per interaction." },
            ].map(item => (
              <div key={item.step} className="bg-background border border-border rounded-xl p-6 relative">
                <div className="text-xs font-mono text-muted-foreground mb-4">{item.step}</div>
                <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Environmental Impact */}
      <section id="impact" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Environmental Impact Metrics</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Scientifically grounded estimates based on published AI energy consumption research</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Zap className="w-6 h-6 text-yellow-500" />, metric: "Energy", unit: "mWh per query", color: "yellow", desc: "Estimated electricity consumption based on token count and model size factors from Patterson et al. (2021)" },
              { icon: <Droplets className="w-6 h-6 text-blue-500" />, metric: "Water", unit: "mL per query", color: "blue", desc: "Data center cooling water footprint estimate following Li et al. (2023) water usage effectiveness metrics" },
              { icon: <Wind className="w-6 h-6 text-green-500" />, metric: "Carbon", unit: "mg CO₂e per query", color: "green", desc: "Greenhouse gas emissions estimate using grid carbon intensity factors from Lannelongue et al. (2021)" },
            ].map(item => (
              <div key={item.metric} className="border border-border rounded-xl p-6 bg-background">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-1">{item.metric}</h3>
                <p className="text-sm text-muted-foreground mb-3">{item.unit}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Model Routing */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Intelligent Model Routing</h2>
            <p className="text-muted-foreground">Task complexity determines the most efficient model — never overspend compute</p>
          </div>
          <div className="space-y-3">
            {[
              { tier: "MIT-1", desc: "Simple Question Answering", model: "GPT-4o-mini", savings: "83% less energy" },
              { tier: "MIT-2", desc: "Translation & Rephrasing", model: "GPT-4o-mini", savings: "83% less energy" },
              { tier: "MIT-3", desc: "Content Generation", model: "GPT-4o", savings: "50% less energy" },
              { tier: "MIT-4", desc: "Coding & Technical Tasks", model: "GPT-4.1", savings: "33% less energy" },
              { tier: "MIT-5", desc: "Scientific & Complex Reasoning", model: "GPT-5", savings: "Optimal model" },
            ].map(r => (
              <div key={r.tier} className="flex items-center gap-4 p-4 bg-background border border-border rounded-lg">
                <Badge variant="outline" className="font-mono text-xs min-w-[60px] justify-center">{r.tier}</Badge>
                <span className="flex-1 text-sm">{r.desc}</span>
                <span className="text-sm font-medium text-green-600">{r.model}</span>
                <Badge variant="green" className="text-xs">{r.savings}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research */}
      <section id="research" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Research Background</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">GreenMind AI is built on peer-reviewed research in AI energy consumption, environmental impact, and sustainable computing</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Research Hypothesis", content: "Improving prompt quality and selecting the most resource-efficient model reduces the estimated environmental impact of AI interactions while maintaining response usefulness." },
              { title: "Methodology", content: "Relative sustainability estimates based on Brown et al. (2020), Lannelongue et al. (2021), Patterson et al. (2021), and Li et al. (2023) using normalized comparative frameworks." },
              { title: "Research Mode", content: "Enable Research Mode to store all metrics, generate exportable datasets for scientific papers, and contribute to environmental AI research validation." },
              { title: "Scoring System", content: "PSS (0–100) measures prompt quality. GAEI combines PSS (40%), Resource Efficiency (35%), and Routing Efficiency (25%) into a unified sustainability indicator." },
            ].map(r => (
              <div key={r.title} className="border border-border rounded-xl p-6 bg-background">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">{r.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{r.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-green-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Make your AI usage sustainable</h2>
          <p className="text-green-100 mb-8 text-lg">Join the movement toward environmentally responsible AI. Every optimized prompt counts.</p>
          <Link href="/chat">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-700 h-12 px-8 gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-green-600" />
            <span>GreenMind AI — Sustainable AI Platform</span>
          </div>
          <div className="flex gap-6">
            <Link href="/chat" className="hover:text-foreground transition-colors">Chat</Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
