# Model Usage Strategy — Crabic Agent Swarm

## Overview

This document defines which models each agent uses, why, and how costs are optimized.

## Agent-Model Matrix

| Agent | Primary Model | Fallback | Rationale | Est. Daily Cost |
|-------|--------------|----------|-----------|-----------------|
| **crabic-main** | Kimi (moonshot/kimi-k2.5) | GPT-4o/Claude | Main interface, huge context (256K), free credits | $0 |
| **crabic-research** | Gemini-Lite (google/gemini-2.0-flash-lite) | GPT-4o | Cheapest for paper reading, 1M context | $0.05-0.20 |
| **crabic-scout** | Gemini-Lite (google/gemini-2.0-flash-lite) | — | High-volume monitoring, dirt cheap | $0.02-0.10 |
| **crabic-analyst** | GPT-4o (openai/gpt-4o) | Claude-Opus/o3-mini | Complex reasoning, pattern detection | $0.50-2.00 |
| **coding tasks** | Claude-Sonnet (anthropic/claude-sonnet-4-5) | GPT-4o | Superior code generation, refactoring | $0.30-1.00 |

## Model Specifications (8 Total)

### Tier 1: Free Operations

#### Kimi (moonshot/kimi-k2.5) — crabic-main
- **Cost:** $0 / $0 (credits)
- **Context:** 256K tokens
- **Strengths:** General intelligence, long context, cost-free
- **Use for:** Daily operations, coordination, user interface, briefings
- **Why:** Free credits, excellent quality, default for most tasks

### Tier 2: Cheap & Scalable

#### Gemini Lite (google/gemini-2.0-flash-lite) — high-volume
- **Cost:** $0.075 / $0.30 per 1M tokens
- **Context:** 1M tokens
- **Strengths:** Cheapest, huge context
- **Use for:** Scout monitoring, research paper scanning, high-volume text
- **Why:** Lowest cost for large context tasks

#### Gemini Flash (google/gemini-2.0-flash) — vision tasks
- **Cost:** $0.10 / $0.40 per 1M tokens
- **Context:** 1M tokens
- **Strengths:** Vision, frontend code, huge context
- **Use for:** Image analysis, HTML/CSS generation, large document processing
- **Why:** Best for vision + frontend tasks

#### GPT-4o Mini (openai/gpt-4o-mini)
- **Cost:** $0.15 / $0.60 per 1M tokens
- **Context:** 128K tokens
- **Strengths:** Fast, cheap, good quality
- **Use for:** Quick tasks when Kimi unavailable
- **Why:** Cheap backup with decent capability

### Tier 3: Premium Quality

#### GPT-4o (openai/gpt-4o) — crabic-analyst, fallback
- **Cost:** $2.50 / $10 per 1M tokens
- **Context:** 128K tokens
- **Strengths:** Complex reasoning, code, analysis, vision
- **Use for:** Deep analysis, code generation, complex pattern detection
- **Why:** Best reasoning quality when accuracy matters

#### o3-mini (openai/o3-mini) — reasoning tasks
- **Cost:** $1.10 / $4.40 per 1M tokens
- **Context:** 200K tokens
- **Strengths:** Reasoning-optimized, math, structured analysis
- **Use for:** Complex patterns, logical deductions, multi-step analysis
- **Why:** Built for reasoning tasks

#### Claude Sonnet (anthropic/claude-sonnet-4-5) — coding
- **Cost:** $3 / $15 per 1M tokens
- **Context:** 200K tokens
- **Strengths:** Code generation, refactoring, system design
- **Use for:** Complex coding, architecture, debugging
- **Why:** Best-in-class code quality

### Tier 4: Maximum Capability

#### Claude Opus (anthropic/claude-opus-4-6) — deep reasoning
- **Cost:** $15 / $75 per 1M tokens
- **Context:** 200K tokens
- **Strengths:** Deep reasoning, complex analysis, difficult problems
- **Use for:** Hardest analytical tasks, strategic decisions
- **Why:** Maximum reasoning capability, when accuracy is critical

### Claude Sonnet (anthropic/claude-sonnet-4-5) — coding specialist
- **Cost:** $3 / $15 per 1M tokens
- **Context:** 200K tokens
- **Strengths:** Code generation, refactoring, debugging, architecture
- **Use for:** Complex coding tasks, system design, code review
- **Why:** Best-in-class code quality and reasoning

### Claude Opus (anthropic/claude-opus-4-6) — deep reasoning
- **Cost:** $15 / $75 per 1M tokens
- **Context:** 200K tokens
- **Strengths:** Deep reasoning, complex analysis, difficult problems
- **Use for:** Hardest analytical tasks, strategic decisions
- **Why:** Maximum reasoning capability, when accuracy is critical

## Cost Optimization Strategy

### Tier 1: Free (Kimi)
- Default for all crabic-main operations
- 256K context handles most daily needs
- No cost = use freely

### Tier 2: Cheap (Gemini-Lite)
- Scout monitoring: scan 50+ sources daily
- Research: quick paper summaries before deep dive
- Cost: ~$0.10/day even with heavy usage

### Tier 3: Premium (GPT-4o, o3-mini)
- Analyst deep dives: worth the cost for insights
- Complex reasoning: accuracy > cost
- Use sparingly, maximum impact

## Daily Budget Estimate

| Component | Model | Est. Tokens | Cost |
|-----------|-------|-------------|------|
| Main operations | Kimi | 100K | $0 |
| Scout monitoring (3x/day) | Gemini-Lite | 300K | $0.03 |
| Research tasks (2x/day) | Gemini-Lite | 200K | $0.02 |
| Analyst deep dive (1x/day) | GPT-4o | 50K | $0.50 |
| Coding tasks (as needed) | Claude-Sonnet | 20K | $0.36 |
| **Daily Total** | — | — | **~$0.55-0.90** |
| **Monthly Total** | — | — | **~$16.50-27.00** |

### Claude Usage Guidelines
- **Claude-Sonnet:** Use for coding tasks, refactoring, system design
- **Claude-Opus:** Reserve for hardest problems (expensive, use sparingly)
- **Trigger:** Use when code quality > cost, or GPT-4o struggles with complexity

## Override Commands

User can override model selection:
- `/model GPT-4o` — switch main session to GPT-4o
- `/model default` — return to Kimi
- `/model o3-mini` — use reasoning model

## Agent Communication

Agents spawn with their assigned model automatically. No manual switching needed.

## Monitoring

Track usage via:
- `session_status` — current session tokens/cost
- Daily GitHub commits include token summaries
- Alert if daily cost exceeds $5 (unusual)

---
*Optimized for quality per dollar. Kimi for volume, GPT-4o for precision, Gemini for scale.*
