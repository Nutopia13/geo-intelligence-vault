# Agent Skill Distribution

Last updated: 2026-02-06

## Skill Assignment

### crabic-main (Coordinator)
**Location:** `/home/clawd/.openclaw/workspace/skills/`

**Skills:**
- `bird` - Twitter/X monitoring
- `reddit` - Reddit monitoring  
- `context-optimizer` - Large context handling
- `frontend-design-ultimate` - UI/UX design
- `human-optimized-frontend` - Frontend optimization
- `vercel` - Deployment management
- `self-improving-agent` - Continuous improvement logging

---

### crabic-research (Research Specialist)
**Location:** `/home/clawd/.openclaw/agents/crabic-research/workspace/skills/`

**Assigned Skills:**
- ✅ `bird` - Monitor academic/researcher Twitter accounts
- ✅ `reddit` - Research discussions and community insights
- ✅ `context-optimizer` - Handle large research papers (64k+ context)

**Use Cases:**
- Track researcher Twitter for new paper announcements
- Monitor r/MachineLearning for trending research
- Process large academic papers with context optimization

---

### crabic-scout (Social Monitor)
**Location:** `/home/clawd/.openclaw/agents/crabic-scout/workspace/skills/`

**Assigned Skills:**
- ✅ `bird` - Twitter/X monitoring for breaking news
- ✅ `reddit` - Subreddit monitoring for trends

**Use Cases:**
- Real-time Twitter monitoring for GEO/LLM news
- Reddit tracking in r/LLM, r/marketing, r/SaaS
- Early signal detection from social chatter

**Monitoring Targets:**
- Twitter: #GEO, #LLMads, @OpenAI, @GoogleAI, @perplexity_ai
- Reddit: r/LLM, r/MachineLearning, r/marketing, r/SaaS, r/SEO

---

### crabic-analyst (Pattern Detection)
**Location:** `/home/clawd/.openclaw/agents/crabic-analyst/workspace/skills/`

**Assigned Skills:**
- ✅ `bird` - Sentiment analysis from Twitter
- ✅ `reddit` - Community sentiment tracking
- ✅ `self-improving-agent` - Log analysis learnings
- ✅ `context-optimizer` - Large-scale pattern analysis

**Use Cases:**
- Cross-platform sentiment analysis
- Trend verification across sources
- Pattern detection in large datasets
- Continuous learning from analysis errors

---

## Global Skills (All Agents)

These skills are available to all agents via the main agent:

- `web_search` - Brave Search API
- `web_fetch` - URL content extraction
- `sessions_send` - Inter-agent communication
- `read/write` - File operations

## Model Assignments

| Agent | Primary Model | Use Case |
|-------|---------------|----------|
| crabic-main | Kimi (moonshot/kimi-k2.5) | Coordination, general tasks |
| crabic-research | Gemini-Lite (google/gemini-2.0-flash-lite) | Cost-effective research |
| crabic-scout | Gemini-Lite (google/gemini-2.0-flash-lite) | High-volume monitoring |
| crabic-analyst | GPT-4o (openai/gpt-4o) | Complex reasoning, analysis |

## Cost Strategy

- **Scout work:** Gemini-Lite ($0.075/1M tokens) - cheapest for high volume
- **Research:** Gemini-Lite for scanning, GPT-4o for deep analysis
- **Analysis:** GPT-4o for complex pattern detection
- **Coordination:** Kimi (free credits) for general operations

## Adding New Skills

To add a skill to an agent:

```bash
# Copy skill to agent workspace
cp -r /home/clawd/.openclaw/workspace/skills/<skill-name> \
  /home/clawd/.openclaw/agents/<agent-name>/workspace/skills/

# Update agent's SOUL.md with skill documentation
```

## Skill Maintenance

- Update skills monthly to latest versions
- Remove unused skills to reduce bloat
- Document new use cases in agent SOUL.md
