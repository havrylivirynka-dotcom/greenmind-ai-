# GreenMind AI Platform

An eco-aware AI chat platform that reduces the environmental impact of generative AI usage through prompt analysis, intelligent model routing, and optimization.

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Copy `.env.local.example` to `.env.local` and fill in your keys:
```bash
cp .env.local.example .env.local
```

Required keys:
| Variable | Where to get it |
|---|---|
| `OPENAI_API_KEY` | platform.openai.com → API Keys |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project → Settings → API |

### 3. Set up Supabase database
Run the SQL in `supabase/schema.sql` in your Supabase SQL editor:
- Go to your Supabase project → SQL Editor
- Paste the contents of `supabase/schema.sql`
- Click Run

### 4. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Features

- **AI Chat** — Three-column layout with conversation history, message rendering with Markdown support
- **PSS Score** — Prompt Sustainability Score (0–100) evaluating specificity, context, clarity, structure, redundancy
- **MIT Classification** — Model Interaction Tier (1–5) based on task complexity
- **Green Routing** — Automatically selects the most energy-efficient model for each task
- **Prompt Optimization** — One-click rewrite to improve sustainability metrics
- **GAEI** — Green AI Efficiency Index combining prompt quality + resource + routing efficiency
- **Resource Metrics** — Real-time energy (mWh), water (mL), carbon (mg CO₂e) estimation per prompt
- **Analytics Dashboard** — Session stats, model/MIT distribution charts
- **Research Mode** — Export datasets as CSV/JSON for scientific validation
- **Dark/Light Mode** — Full theme support

## Scoring Methodology

### PSS (Prompt Sustainability Score)
```
PSS_raw = 0.25×S + 0.20×C + 0.25×T + 0.20×O − 0.10×R
PSS = PSS_raw × 20   (normalized 0–100)
```
S=Specificity, C=Context, T=Clarity, O=Structure, R=Redundancy

### Resource Estimation
```
tokens = characters / 4
energy = tokens × model_factor  (mWh)
water  = energy × 0.05          (mL)
carbon = energy × 0.40          (mg CO₂e)
```

Model factors: GPT-4o-mini=0.01, GPT-4o=0.03, GPT-4.1=0.04, GPT-5=0.06

### GAEI (Green AI Efficiency Index)
```
GAEI = 0.40×PSS + 0.35×RE + 0.25×RES
```
RE=Resource Efficiency, RES=Routing Efficiency Score

## Green Routing Rules
| MIT | Task Type | Model |
|---|---|---|
| MIT-1 | Simple QA | GPT-4o-mini |
| MIT-2 | Translation / Rephrasing | GPT-4o-mini |
| MIT-3 | Content Generation | GPT-4o |
| MIT-4 | Coding / Technical | GPT-4.1 |
| MIT-5 | Scientific / Complex | GPT-5 |

## Deployment (Vercel)

```bash
npm install -g vercel
vercel --prod
```

Set the environment variables in Vercel project settings.

## References
- Brown et al. (2020) — Language Models are Few-Shot Learners
- Lannelongue et al. (2021) — Green Algorithms
- Patterson et al. (2021) — Carbon and the Broad Ecosystem of Deep Learning
- Li et al. (2023) — Making AI Less "Thirsty"
