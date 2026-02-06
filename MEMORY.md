# MEMORY.md — Crabic's Long-Term Memory

## Identity
- **Name:** Crabic
- **Role:** Research agent for GEO/LLM advertising intelligence
- **Business partner:** Vlad
- **Mission:** Build the knowledge foundation for a future agency + SaaS

## Key Systems

### Obsidian Vault (Second Brain)
**Location:** `memory/obsidian/`
**Purpose:** Structured knowledge graph for GEO/LLM advertising intelligence
**Format:** Machine-readable markdown with YAML frontmatter

**Structure:**
```
obsidian/
├── Home.md                    # Master index
├── daily_notes/               # Daily intelligence briefs
│   └── YYYY-MM-DD - GEO Intelligence Brief.md
├── permanent_notes/           # Evergreen insights
├── mocs/                      # Maps of Content (topic indexes)
│   ├── GEO Techniques MOC.md
│   ├── AI Search Algorithms MOC.md
│   ├── LLM Ad Platforms MOC.md
│   ├── Daily Notes MOC.md
│   └── 2026-02 MOC.md
└── templates/                 # Reusable templates
    ├── daily-brief-template.md
    ├── permanent-note-template.md
    └── moc-template.md
```

**Daily Briefing Schedule:** 19:00 UTC (cron job: `92a18aad-587d-4664-8310-065aa03bffa6`)

### Status
- [x] Vault structure created (2026-02-06)
- [x] Templates built
- [x] Core MOCs initialized
- [x] First daily brief generated (2026-02-06)
- [x] Cron job scheduled for 19:00 UTC
- [x] Brave Search API configured (2026-02-06)
- [x] First reconnaissance complete — 3 permanent notes created
- [ ] Source watchlist built
- [ ] Active intelligence gathering ongoing

## Active Projects

### Phase 1: Infrastructure (Current)
Build the knowledge capture system — DONE (2026-02-06)

### Phase 2: Reconnaissance (In Progress)
- [x] Configure search capabilities (Brave Search API active)
- [x] Initial reconnaissance — Foundational GEO paper identified
- [x] First intelligence captured (3 permanent notes)
- [ ] Identify priority sources (RSS, Twitter, newsletters, researchers)
- [ ] Daily intelligence gathering routine established

### Phase 3: Analysis (Future)
- Pattern recognition across sources
- Competitor tracking
- Opportunity identification

## Knowledge Priorities

### High Priority
1. GEO techniques with measurable results
2. LLM ad platform developments (OpenAI, Microsoft, Google)
3. Competitor intelligence
4. Case studies with ROI data

### Medium Priority
5. Regulatory developments
6. API availability for automation
7. Academic research on LLM citation behavior

### Low Priority
8. General AI marketing trends (without GEO/ads angle)

## Important Context

### For Other Agents Reading This
If you're another agent accessing this vault:
1. Start at `obsidian/Home.md` for navigation
2. Check `obsidian/daily_notes/` for recent intelligence
3. Use MOCs (`obsidian/mocs/`) to explore topics
4. Follow wiki-links `[[Like This]]` to connect concepts
5. Check YAML frontmatter for metadata (confidence, source, date)

### Confidence Levels
- `high` — Multi-source verified
- `medium` — Single credible source or strong inference
- `low` — Rumor, speculation, or unverified claim

### Tags Used
- `#GEO` — Generative Engine Optimization
- `#LLMads` — LLM-based advertising
- `#breakthrough` — Game-changing finding
- `#competitor` — Competitor intelligence
- `#opportunity` — Strategic opening
- `#threat` — Risk or challenge
- `#unverified` — Needs confirmation

## Decisions & Lessons

### 2026-02-06
- **Decision:** Use direct file I/O instead of obsidian-cli (Go not installed)
- **Rationale:** File-based approach is more portable and doesn't require external dependencies
- **Result:** Working well — templates and vault structure operational

### 2026-02-06 (Later)
- **Decision:** Configure Brave Search API for web intelligence gathering
- **Result:** API configured and tested successfully
- **First findings:** 
  - Foundational GEO paper (KDD 2024) shows 40% visibility boost potential
  - Perplexity AI launched first LLM native ads (Nov 2024)
  - Industry claims of 27% conversion rates for AI-sourced traffic (unverified)
- **Key insight:** The field is nascent — first-mover advantage window is open

## Open Questions
1. What are the must-follow sources for GEO/LLM ads news?
2. Which competitors are already in this space?
3. What's the timeline for mainstream LLM ad adoption?
4. How will attribution work in a conversational ad model?
5. What specific GEO techniques drove the 40% boost in the research paper?
6. What are Perplexity's actual ad rates and targeting capabilities?
7. Can we verify any of the 27% conversion rate claims?

## GitHub Sync
- **Repository:** https://github.com/Nutopia13/geo-intelligence-vault
- **Private:** Yes
- **Auto-commit:** Daily at 20:00 UTC (1h after briefing)
- **Current commit:** Initial setup complete

## Contact
- **Business partner:** Vlad
- **Daily briefings:** 19:00 UTC (web + Telegram)
- **Vault location:** `memory/obsidian/`
- **Telegram:** @personal_crabic_bot

---
*Last updated: 2026-02-06 by Crabic 🦀*
