export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  analytics?: MessageAnalytics;
  timestamp: Date;
}

export interface MessageAnalytics {
  pss: number;
  mit: number;
  tokens: number;
  energy: number;
  water: number;
  carbon: number;
  gaei: number;
  selectedModel: string;
  routingSavings: number;
}

export interface OptimizationResult {
  optimizedPrompt: string;
  pssBefore: number;
  pssAfter: number;
  gaeiBefore: number;
  gaeiAfter: number;
  tokensBefore: number;
  tokensAfter: number;
  energyBefore: number;
  energyAfter: number;
  waterBefore: number;
  waterAfter: number;
  carbonBefore: number;
  carbonAfter: number;
}

export interface LiveAnalysis {
  pss: number;
  pssLevel: string;
  pssSuggestions: string[];
  mit: number;
  mitLabel: string;
  tokens: number;
  energy: number;
  water: number;
  carbon: number;
  gaei: number;
  recommendedModel: string;
  routingReason: string;
  routingSavings: number;
}
