# How To Use This Knowledge Base

> Practical guide for using the KB with AI tools (Codex, GPT, Gemini, Claude) and during development.

---

## 🧠 Rule #1: Always Start With KB_INDEX

Before any task, read `docs/KB_INDEX.md` first.  
It tells you **which knowledge bases to load** based on what you're working on.

---

## 📋 Quick Reference

| Working on... | Load these KBs |
|---------------|----------------|
| Hero section | `project` + `features/landing-page` + `shared/ui` |
| Pricing plans | `project` + `features/landing-page` (U06, U13) + `shared/ui` |
| Contact form | `project` + `features/landing-page` (U09, U16) + `shared/ui` |
| Social links | `shared/social` + `features/landing-page` (U14) |
| Changing colors/fonts | `shared/ui` |
| Adding a new section | `project` + `features/landing-page` + `shared/ui` + `processes/template-pipeline` |
| Understanding the architecture | `project` + `decisions/*` + `processes/template-pipeline` |
| Conversion optimization | `processes/lead-flow` + `features/landing-page` |
| Rebranding for new client | `project` + `decisions/centralized-config` + `features/landing-page` (U11) |

---

## 🤖 AI Prompt Templates

### Template 1: Feature Work

```
Context: I'm working on the gym website (RK Web Solutions demo).

Before answering, read these KB files in order:
1. docs/KB_INDEX.md
2. docs/project/FACTS.jsonl
3. docs/features/landing-page/IDMAP.md
4. docs/features/landing-page/KG.adj
5. docs/features/landing-page/FACTS.jsonl
6. docs/shared/ui/FACTS.jsonl

Task: [describe your task here]

Rules:
- Use entity IDs from IDMAP (U01-U17, F01-F09)
- Follow the design system in shared/ui
- Follow the naming convention (rk- prefix, BEM)
- Do not invent behavior not in FACTS
- Reference which files need changes using File IDs
```

### Template 2: Debugging

```
Context: I'm debugging an issue in the gym website.

Before answering, read these KB files:
1. docs/features/landing-page/FACTS.jsonl
2. docs/processes/template-pipeline.md
3. docs/features/landing-page/KG.adj

Issue: [describe the bug]

Rules:
- Trace the issue through the KG dependency graph
- Check which entities (U01-U17) are affected
- Check which pipeline step (template-pipeline.md) could cause this
- Reference exact file IDs (F01-F09)
```

### Template 3: Design Changes

```
Context: I'm updating the design of the gym website.

Before answering, read:
1. docs/shared/ui/FACTS.jsonl
2. docs/features/landing-page/FACTS.jsonl

Task: [describe the design change]

Rules:
- Use exact color values from shared/ui (e.g., #ff0336, not "red")
- Follow border-radius scale: 12px inputs → 14px icons → 16px cards → 20px containers
- Use the existing transition: all 0.3s ease
- Follow rk- prefix BEM naming
- Respect breakpoints: 900px tablet, 600px mobile
```

### Template 4: New Client Adaptation

```
Context: I need to adapt this gym website for a new client.

Read:
1. docs/decisions/centralized-config.md
2. docs/project/FACTS.jsonl
3. docs/features/landing-page/FACTS.jsonl (specifically U11)

New client details:
- Name: [gym name]
- Location: [city]
- Phone: [number]
- Programs: [list]
- Pricing: [tiers]

Task: Generate a new siteConfig.js for this client.

Rules:
- Only modify siteConfig.js (F05)
- Keep the same structure
- Update all content fields
- Update social links
```

---

## 📂 KB File Reading Order

When loading a feature KB, always read in this order:

```
1. IDMAP.md    → Understand what exists (files, entities, predicates)
2. KG.adj      → Understand how things connect
3. FACTS.jsonl → Understand exact behavior and details
```

**Why this order?**
- IDMAP gives you the vocabulary (IDs and names)
- KG shows you the map (dependencies)
- FACTS gives you the ground truth (what each thing actually does)

Without IDMAP, the FACTS file is unreadable (full of U01, F03 references).

---

## ⚠️ Rules When Using KB

1. **Never invent facts** — if it's not in FACTS.jsonl, don't assume it exists
2. **Always trace to source files** — every fact has `src` linking to File IDs
3. **Follow the dependency graph** — changing U11 (SiteConfig) affects U02-U10
4. **Use entity IDs in communication** — say "U06 pricing toggle" not "the pricing section thing"
5. **Update KB after changes** — new features = new facts (see Step 9 doc)

---

## 🔍 How to Find Things

| I need to know... | Look in... |
|-------------------|------------|
| What file handles X | `IDMAP.md` → File IDs section |
| What depends on X | `KG.adj` → find the node, trace arrows |
| What X actually does | `FACTS.jsonl` → search by entity ID |
| Why X was built this way | `docs/decisions/` → relevant decision doc |
| How the user flow works | `docs/processes/lead-flow.md` |
| How the template pipeline works | `docs/processes/template-pipeline.md` |
| What colors/spacing to use | `docs/shared/ui/FACTS.jsonl` |
| What social links exist | `docs/shared/social/FACTS.jsonl` |

---

## 💡 Pro Tips

1. **Copy-paste the prompt template** into your AI tool — don't type from memory
2. **Start small** — load `project` + one feature KB, not everything at once
3. **Use KG for impact analysis** — before changing U11, check what depends on it
4. **Decisions docs save arguments** — when someone asks "why React?", point them to `decisions/tech-stack.md`
5. **FACTS.jsonl is append-only** — never delete old facts, only add new ones
