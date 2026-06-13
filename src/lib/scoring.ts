export interface PSSComponents {
  specificity: number;   // 0-5
  context: number;       // 0-5
  clarity: number;       // 0-5
  structure: number;     // 0-5
  redundancy: number;    // 0-5
}

export interface PSSResult {
  score: number;
  components: PSSComponents;
  level: string;
  suggestions: string[];
}

export type MITLevel = 1 | 2 | 3 | 4 | 5;

export interface ResourceEstimate {
  tokens: number;
  energy: number;   // mWh
  water: number;    // mL
  carbon: number;   // mg CO2e
}

export interface AnalysisResult {
  pss: PSSResult;
  mit: MITLevel;
  mitLabel: string;
  resources: ResourceEstimate;
  gaei: number;
  recommendedModel: string;
  routingReason: string;
  routingSavings: number;
}

const MODEL_FACTORS: Record<string, number> = {
  "gpt-4o-mini": 0.01,
  "gpt-4o": 0.03,
  "gpt-4.1": 0.04,
  "gpt-5": 0.06,
};

const DEFAULT_MODEL = "gpt-4o";
const WATER_FACTOR = 0.05;
const CARBON_FACTOR = 0.40;

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function estimateResources(tokens: number, model: string): ResourceEstimate {
  const factor = MODEL_FACTORS[model] ?? MODEL_FACTORS["gpt-4o"];
  const energy = tokens * factor;
  const water = energy * WATER_FACTOR;
  const carbon = energy * CARBON_FACTOR;
  return { tokens, energy, water, carbon };
}

export function calculatePSS(prompt: string): PSSResult {
  const words = prompt.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const hasQuestionMark = prompt.includes("?");
  const hasBullets = /[-•*]\s/.test(prompt) || /\d+\.\s/.test(prompt);
  const hasNumbers = /\d/.test(prompt);
  const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const redundancyRatio = wordCount > 0 ? 1 - (uniqueWords.size / wordCount) : 0;

  // Specificity: based on word count and specific keywords
  let specificity = 0;
  if (wordCount >= 5) specificity += 1;
  if (wordCount >= 15) specificity += 1;
  if (wordCount >= 30) specificity += 1;
  if (hasNumbers) specificity += 1;
  if (prompt.match(/specific|exact|precisely|format|example|like|such as/i)) specificity += 1;
  specificity = Math.min(5, specificity);

  // Context: background info indicators
  let context = 0;
  if (wordCount >= 10) context += 1;
  if (sentences.length >= 2) context += 1;
  if (prompt.match(/context|background|because|since|given|assuming|for|in order to/i)) context += 1;
  if (wordCount >= 40) context += 1;
  if (sentences.length >= 3) context += 1;
  context = Math.min(5, context);

  // Clarity: clear task definition
  let clarity = 0;
  if (hasQuestionMark || prompt.match(/^(write|create|explain|describe|list|compare|analyze|generate|translate|summarize|help|find|calculate)/i)) clarity += 2;
  if (wordCount >= 8 && wordCount <= 100) clarity += 1;
  if (prompt.match(/\b(should|must|need|want|require|output|result|response)\b/i)) clarity += 1;
  if (!prompt.match(/\b(stuff|things|something|anything)\b/i)) clarity += 1;
  clarity = Math.min(5, clarity);

  // Structure: organized formatting
  let structure = 0;
  if (hasBullets) structure += 2;
  if (sentences.length >= 2) structure += 1;
  if (prompt.match(/\n/)) structure += 1;
  if (wordCount >= 20) structure += 1;
  structure = Math.min(5, structure);

  // Redundancy (higher = worse)
  let redundancy = 0;
  if (redundancyRatio > 0.3) redundancy += 2;
  if (redundancyRatio > 0.5) redundancy += 2;
  if (wordCount > 200) redundancy += 1;
  redundancy = Math.min(5, redundancy);

  const pssRaw = 0.25 * specificity + 0.20 * context + 0.25 * clarity + 0.20 * structure - 0.10 * redundancy;
  const score = Math.max(0, Math.min(100, Math.round(pssRaw * 20)));

  let level: string;
  const suggestions: string[] = [];

  if (score <= 20) {
    level = "Very Low";
    suggestions.push("Add more specific details about what you need");
    suggestions.push("Provide context or background information");
    suggestions.push("Clearly define the expected output format");
  } else if (score <= 40) {
    level = "Low";
    suggestions.push("Be more specific about the task requirements");
    if (context < 2) suggestions.push("Add relevant context to help the model understand your needs");
    if (structure < 2) suggestions.push("Consider using bullet points or numbered steps");
  } else if (score <= 60) {
    level = "Medium";
    if (structure < 3) suggestions.push("Use structured formatting like bullet points");
    if (specificity < 3) suggestions.push("Include specific constraints or requirements");
  } else if (score <= 80) {
    level = "High";
    if (redundancy > 2) suggestions.push("Remove repetitive phrases to reduce token usage");
  } else {
    level = "Very High";
    if (redundancy > 0) suggestions.push("Minor: remove any repeated instructions");
  }

  return { score, components: { specificity, context, clarity, structure, redundancy }, level, suggestions };
}

export function classifyMIT(prompt: string): { level: MITLevel; label: string; description: string } {
  const lower = prompt.toLowerCase();
  const wordCount = prompt.trim().split(/\s+/).length;

  // MIT-5: Scientific/Complex reasoning
  if (lower.match(/\b(research|hypothesis|analyze|methodology|scientific|statistical|algorithm|architecture|complex|multi-step|strategy|theoretical|framework)\b/) && wordCount > 30) {
    return { level: 5, label: "MIT-5", description: "Scientific & Complex Reasoning" };
  }

  // MIT-4: Coding/Technical
  if (lower.match(/\b(code|program|function|debug|implement|api|database|algorithm|script|class|method|bug|error|deploy|docker|sql|typescript|python|javascript)\b/)) {
    return { level: 4, label: "MIT-4", description: "Coding & Technical Tasks" };
  }

  // MIT-3: Content generation
  if (lower.match(/\b(write|create|generate|draft|compose|article|essay|blog|story|email|report|document|content|describe in detail|explain thoroughly)\b/) && wordCount > 15) {
    return { level: 3, label: "MIT-3", description: "Content Generation" };
  }

  // MIT-2: Translation/rephrasing
  if (lower.match(/\b(translate|rephrase|rewrite|paraphrase|correct grammar|improve|edit|proofread|summarize|condense)\b/)) {
    return { level: 2, label: "MIT-2", description: "Translation & Rephrasing" };
  }

  // MIT-1: Simple QA
  return { level: 1, label: "MIT-1", description: "Simple Question Answering" };
}

export function routeModel(mitLevel: MITLevel): { model: string; reason: string } {
  const routes: Record<MITLevel, { model: string; reason: string }> = {
    1: { model: "gpt-4o-mini", reason: "Simple questions don't require advanced reasoning — using the most efficient model" },
    2: { model: "gpt-4o-mini", reason: "Translation and rephrasing tasks are well-handled by compact models" },
    3: { model: "gpt-4o", reason: "Content generation benefits from GPT-4o's language fluency" },
    4: { model: "gpt-4.1", reason: "Coding tasks require strong technical reasoning from GPT-4.1" },
    5: { model: "gpt-5", reason: "Scientific and complex analysis requires maximum reasoning capability" },
  };
  return routes[mitLevel];
}

export function calculateRES(mitLevel: MITLevel, tokens: number): number {
  const defaultEnergy = estimateResources(tokens, DEFAULT_MODEL).energy;
  const { model } = routeModel(mitLevel);
  const routedEnergy = estimateResources(tokens, model).energy;
  if (defaultEnergy === 0) return 0;
  return Math.max(0, Math.round(((defaultEnergy - routedEnergy) / defaultEnergy) * 100));
}

export function calculateRE(tokens: number, model: string): number {
  const maxTokens = 1000;
  const resources = estimateResources(tokens, model);
  const maxEnergy = estimateResources(maxTokens, "gpt-5").energy;
  const normalizedCost = Math.min(100, (resources.energy / maxEnergy) * 100);
  return Math.round(100 - normalizedCost);
}

export function calculateGAEI(pss: number, re: number, res: number): number {
  return Math.round(0.40 * pss + 0.35 * re + 0.25 * res);
}

export function getGAEILevel(gaei: number): string {
  if (gaei <= 20) return "Very Low Sustainability";
  if (gaei <= 40) return "Low Sustainability";
  if (gaei <= 60) return "Moderate Sustainability";
  if (gaei <= 80) return "High Sustainability";
  return "Excellent Sustainability";
}

export function analyzePrompt(prompt: string): AnalysisResult {
  const pssResult = calculatePSS(prompt);
  const mitResult = classifyMIT(prompt);
  const { model, reason } = routeModel(mitResult.level);
  const tokens = estimateTokens(prompt);
  const resources = estimateResources(tokens, model);
  const res = calculateRES(mitResult.level, tokens);
  const re = calculateRE(tokens, model);
  const gaei = calculateGAEI(pssResult.score, re, res);

  const defaultResources = estimateResources(tokens, DEFAULT_MODEL);
  const routingSavings = defaultResources.energy - resources.energy;

  return {
    pss: pssResult,
    mit: mitResult.level,
    mitLabel: mitResult.label,
    resources,
    gaei,
    recommendedModel: model,
    routingReason: reason,
    routingSavings: Math.max(0, routingSavings),
  };
}
