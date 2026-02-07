# Attributr MVP1 Product Requirements Document
## AI Search Attribution Platform

**Version:** 1.0  
**Date:** February 7, 2026  
**Model:** SaaS Platform (Self-Serve)  
**Target Launch:** Q2 2026

---

## 1. Executive Summary

### 1.1 Vision
Attributr is the first **SaaS platform** that connects brand visibility in AI search engines to measurable business outcomes. We transform speculative "GEO tactics" into data-driven decisions by solving the industry's two biggest gaps: **standardized measurement** and **true revenue attribution**.

**Tagline:** *"See which AI citations drive revenue"*

### 1.2 Market Opportunity
| Metric | Value |
|--------|-------|
| **Competitors** | 25+ active players |
| **Pricing Gap** | 95% target enterprise at $10K+/mo |
| **SMB Market** | Massively underserved (<$500/mo options) |
| **Our Position** | Self-serve SaaS, $29-299/mo |

### 1.3 Key Differentiators
| Competitors | Attributr |
|-------------|-----------|
| Agencies with tools | Pure SaaS platform |
| $10K+/mo contracts | $29-299/mo self-serve |
| Sales-led demos | Instant signup & value |
| Vague metrics | Standardized AI Visibility Score™ |
| No attribution | Revenue connection engine |

### 1.4 Business Model
**SaaS Tiered Pricing:**
- **Starter:** $29/mo — 1 domain, basic tracking
- **Pro:** $99/mo — 3 domains, full analytics
- **Business:** $299/mo — 10 domains, attribution API
- **Enterprise:** Custom — Unlimited, dedicated support

---

## 2. Competitive Landscape

### 2.1 Market Map
```
                    HIGH PRICING
                         │
    Enterprise    │   Profound    │
    Platforms     │   Evertune    │
    ($800-10K+)   │               │
                  ├───────────────┤
    Premium       │   Directive   │   ★ OUR TARGET
    Agencies      │   NP Digital  │   (Accessible SaaS)
    ($5-15K/mo)   │               │
                  ├───────────────┤
    Mid-Market    │   TripleDart  │
    Agencies      │   Perrill     │
    ($3-8K/mo)    │               │
                  ├───────────────┤
    SMB SaaS      │   Geoptie     │
    ($40-200/mo)  │   ★ GAP HERE  │
    (Limited)     │               │
                         │
                    LOW PRICING
```

### 2.2 Competitor Analysis

| Company | Type | Pricing | Weakness |
|---------|------|---------|----------|
| **Profound** | Enterprise SaaS | $800+/mo | Demo-gated, complex |
| **Evertune** | Enterprise Platform | Custom | No self-serve |
| **Geoptie** | SMB SaaS | $41-166/mo | No attribution, basic |
| **Directive** | Agency | $10K+/mo | Not SaaS, slow |
| **Citeful.ai** | Agency+SaaS | Custom | Content creation focus |

**Gap:** No self-serve SaaS with real attribution under $300/mo.

### 2.3 Our Moat
1. **Attribution Engine** — Only platform connecting AI to revenue
2. **AI Visibility Score™** — Industry-standard metric
3. **Self-Serve First** — Instant value, no sales calls
4. **Transparent Pricing** — Clear tiers, no "contact us"

---

## 3. Target Customer

### 3.1 Ideal Customer Profile (ICP)

**Primary: Growth-Stage B2B SaaS**
- 10-100 employees
- $1M-$20M ARR
- Has SEO/content person
- Uses existing SEO tools (Ahrefs, SEMrush)
- **Pain:** Can't prove AI search ROI
- **Budget:** $100-500/mo for tools

**Secondary: E-commerce**
- $500K-$10M annual revenue
- High-consideration products
- **Pain:** Losing visibility to competitors in AI

**Tertiary: Indie Hackers/Solopreneurs**
- 1-5 person teams
- **Pain:** Can't afford agency, need DIY solution
- **Budget:** $29-99/mo

### 3.2 Top Pain Points

| Rank | Pain Point | Current Solution |
|------|------------|------------------|
| 1 | Can't measure AI search impact | Guesswork, vanity metrics |
| 2 | AI traffic shows as "direct" | No solution exists |
| 3 | Agencies too expensive ($10K+/mo) | Do nothing or Geoptie (limited) |
| 4 | Don't know if AI "knows" brand | Manual checking |
| 5 | Different results across LLMs | One-size-fits-all advice |

### 3.3 User Personas

**"Solo Sam" - Indie Founder**
- Wants: Quick audit, affordable, actionable
- Quote: *"I need to know if ChatGPT mentions my tool"*

**"Growth Gina" - Marketing Lead**
- Wants: Prove ROI to CEO, competitive intel
- Quote: *"Show me which AI citations convert to customers"*

**"Tech Tim" - SEO Manager**
- Wants: Platform-specific insights, API access
- Quote: *"How do I optimize for Perplexity vs ChatGPT?"*

---

## 4. Product Strategy

### 4.1 Unique Value Proposition
> "The only self-serve platform that shows which AI search citations drive actual revenue — starting at $29/mo"

### 4.2 What We Do (SaaS Features)
1. **Monitor** — Track citations across ChatGPT, Perplexity, Gemini, Claude
2. **Measure** — AI Visibility Score™ + competitive benchmarks
3. **Attribute** — Connect citations to website visits & conversions
4. **Optimize** — Platform-specific recommendations

### 4.3 What We DON'T Do (Stay Focused)
❌ Content creation (partner with writers)  
❌ Full-service consulting (keep it SaaS)  
❌ Traditional SEO tools (integrate instead)  
❌ Guaranteed rankings (unethical)  
❌ White-label (Phase 2 if needed)

### 4.4 Positioning
**For:** SaaS founders & marketers who need AI search visibility  
**Who:** Can't afford enterprise agencies  
**Attributr is:** Self-serve SaaS platform  
**That:** Provides citation tracking + revenue attribution  
**Unlike:** Expensive agencies or limited SMB tools  
**We offer:** Instant signup, transparent pricing, real ROI data

---

## 5. MVP1 Feature Set

### 5.1 Core Features (Must-Haves)

#### F1: AI Citation Monitor
Track brand mentions across major LLMs.

**User Story:**
> As Gina, I want to see when AI cites my brand, so I can track visibility over time.

**Specs:**
- Monitor 5 platforms: ChatGPT, Perplexity, Gemini, Claude, Grok
- Real-time citation feed
- Show citation context (surrounding text)
- Competitor comparison (who else got cited?)
- Weekly email digest

**Tech:** API scraping + manual prompt testing

---

#### F2: AI Visibility Score™
Standardized 0-100 score for AI search presence.

**User Story:**
> As Sam, I want a single score to track progress, so I can prove value.

**Specs:**
- 0-100 score (higher = more visibility)
- Platform breakdowns
- Trend charts (30/60/90 days)
- Industry benchmarks
- Historical tracking

**Algorithm:**
- 40% Citation Volume
- 30% Citation Quality (prominence)
- 20% Entity Authority
- 10% Content Coverage

---

#### F3: Attribution Engine (Core Moat)
Connect AI citations to website visits.

**User Story:**
> As Gina, I want to prove AI citations drive revenue, so I can justify spend.

**Specs:**
- Time-based correlation (citation → visit within 30-60 min)
- Fingerprint matching (IP + user-agent + device)
- Confidence scoring (show match probability)
- Conversion tracking (form fills, purchases)
- ROI calculator

**Methods:**
1. Time-window correlation (primary)
2. Unique landing pages (secondary)
3. Post-purchase survey (fallback)

---

#### F4: Free Audit Tool (Growth Engine)
No-signup audit for lead generation.

**User Story:**
> As Sam, I want to check my AI visibility instantly, so I can decide if I need this.

**Specs:**
- Enter URL → get instant report
- Citation status (cited vs not cited)
- 3 competitor comparisons
- Top 5 recommendations
- Email report option (lead capture)

**Conversion:** Free audit → Signup for tracking

---

#### F5: Competitor Intel
Track competitor citations.

**User Story:**
> As Tim, I want to see which competitors AI cites, so I can close the gap.

**Specs:**
- Track up to 5 competitors
- Citation share pie chart
- Gap analysis (where competitors appear, you don't)
- Content that got them cited

---

#### F6: Platform Playbooks
Optimization guides per LLM.

**User Story:**
> As Tim, I want to optimize for Perplexity vs ChatGPT, so I can prioritize efforts.

**Specs:**
- 5 playbooks (ChatGPT, Perplexity, Gemini, Claude, Grok)
- Technical requirements per platform
- Content format preferences
- Algorithm update alerts

---

#### F7: Simple Dashboard
Clean, actionable UI.

**User Story:**
> As Gina, I want a clear dashboard, so I can check status in 30 seconds.

**Specs:**
- AI Visibility Score (big, prominent)
- Recent citations list
- Attribution summary (citations → visits → conversions)
- Competitor movement alerts
- Weekly trend graphs

---

### 5.2 Phase 2 Features (Post-MVP)

| Feature | Description |
|---------|-------------|
| API Access | REST API for power users |
| White-label Reports | Agency branding |
| Automated Recommendations | AI-suggested optimizations |
| Slack/Discord Integration | Real-time alerts |
| Historical Data Export | CSV/PDF reports |

### 5.3 Out of Scope (Intentional)

| Feature | Why |
|---------|-----|
| Content Creation | Keep it SaaS, not service |
| Full-Service Agency | Low margins, slow scale |
| Traditional SEO | Partner with Ahrefs/SEMrush |
| Social Media | Scope creep |
| Guaranteed Citations | Unethical |

---

## 6. Pricing Strategy

### 6.1 SaaS Tiers

| Plan | Price | Target | Features |
|------|-------|--------|----------|
| **Free** | $0 | Lead gen | 1 audit/mo, basic score |
| **Starter** | $29/mo | Indie/SMB | 1 domain, 50 citations/mo, basic dashboard |
| **Pro** | $99/mo | Growth | 3 domains, 200 citations/mo, attribution, API read |
| **Business** | $299/mo | Scale-up | 10 domains, 1K citations/mo, full attribution, webhooks |
| **Enterprise** | Custom | Big co | Unlimited, dedicated support, custom integrations |

### 6.2 Free Tier Limits
- 1 audit per month
- Basic AI Visibility Score
- No historical tracking
- No attribution

**Goal:** Show value → Convert to paid

### 6.3 Pricing Psychology
- **Starter ($29):** Entry point for serious users
- **Pro ($99):** Most popular tier (3 domains = agency/small team)
- **Business ($299):** Power users, still 10x cheaper than agencies

---

## 7. Go-to-Market

### 7.1 Distribution
1. **Product-Led Growth** — Free audit tool goes viral
2. **Content SEO** — Rank for "AI search visibility," "GEO tracking"
3. **Indie Hackers/Product Hunt** — Launch to tech-savvy early adopters
4. **Twitter/X** — Build in public, share insights
5. **Agency Partnerships** — Reseller program (Phase 2)

### 7.2 Launch Plan

**Pre-Launch (4 weeks):**
- Beta with 10 users
- Content: 5 articles on AI search
- Landing page + waitlist

**Launch Week:**
- Product Hunt launch
- Free tool viral campaign
- Twitter thread storm

**Post-Launch:**
- Weekly content
- Case studies
- Feature updates

### 7.3 Success Metrics

**Month 6 Targets:**
- 500 free tier users
- 100 paying customers
- $10K MRR
- <5% churn

**Month 12 Targets:**
- 5,000 free users
- 500 paying customers
- $50K MRR
- NPS >40

---

## 8. Technical Architecture

### 8.1 Stack Recommendation

| Layer | Tech | Why |
|-------|------|-----|
| Frontend | Next.js 14 + Tailwind + shadcn | Fast, modern, great DX |
| Backend | Fastify (Node.js) | Fast, lightweight API |
| Database | PostgreSQL + TimescaleDB | Time-series for tracking |
| Queue | BullMQ (Redis) | Job processing |
| Auth | Clerk or Auth0 | Quick, secure |
| Hosting | Vercel (frontend) + Railway (backend) | Fast deploy, cost-effective |
| Monitoring | Plausible (privacy-friendly) | Simple analytics |

### 8.2 Data Flow
```
AI Platforms → Scraper/API → Queue → Database → Dashboard
                                    ↓
Website Script → Visit Data → Attribution Engine → ROI Display
```

### 8.3 Attribution Algorithm (MVP)

**Time-Window Correlation:**
```python
def attribute_visit(citation, visit):
    time_diff = visit.timestamp - citation.timestamp
    fingerprint_match = similarity(citation.fingerprint, visit.fingerprint)
    
    if time_diff < 3600 and fingerprint_match > 0.85:
        return {
            'attributed': True,
            'confidence': fingerprint_match,
            'source': citation.platform,
            'query': citation.query
        }
```

**Accuracy Target:** 85%+ with conservative matching

---

## 9. Risks & Mitigation

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| LLM API changes | High | Multi-method tracking, fallback scrapers |
| Attribution accuracy | Medium | Conservative matching, transparent methodology |
| CAC too high | Medium | Product-led growth, free tier viral loop |
| Competitor copies | High | Speed to market, data moat, community |
| LLM platforms ban scraping | Medium | API-first, user-provided data option |

---

## 10. MVP1 Success Criteria

**Launch Ready:**
- [ ] 5 core features working
- [ ] AI Visibility Score validated
- [ ] Attribution >80% accuracy
- [ ] Self-serve signup flow
- [ ] 10 beta users happy

**90 Days Post-Launch:**
- [ ] 100+ paying customers
- [ ] $10K MRR
- [ ] <5% monthly churn
- [ ] 3 case studies published

---

**Next Steps:**
1. Finalize tech stack
2. Design database schema
3. Build citation scraper MVP
4. Create attribution algorithm v1
5. Build dashboard UI
6. Launch beta

*Prepared for Attributr — AI Search Attribution Platform*
