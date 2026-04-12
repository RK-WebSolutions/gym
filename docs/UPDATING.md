# Updating the Knowledge Base

> How to keep the KB accurate after every code change.

---

## 🔑 Golden Rule

> **FACTS.jsonl is append-only. Never delete or rewrite old facts blindly.**

Old facts are historical truth. If something changed, add a new fact that supersedes it.

---

## 📋 When to Update

| You just... | Update these |
|-------------|-------------|
| Added a new component | `IDMAP.md` (new File + Entity IDs) → `KG.adj` (new edges) → `FACTS.jsonl` (new facts) |
| Changed a component's behavior | `FACTS.jsonl` (append new fact with updated behavior) |
| Added a new section to the page | `IDMAP.md` + `KG.adj` + `FACTS.jsonl` + maybe `KB_INDEX.md` |
| Changed colors/spacing | `shared/ui/FACTS.jsonl` (append new fact) |
| Changed siteConfig values | `project/FACTS.jsonl` or `features/landing-page/FACTS.jsonl` |
| Added a new social platform | `shared/social/FACTS.jsonl` |
| Made an architecture decision | New file in `docs/decisions/` |
| Changed the user flow | `docs/processes/lead-flow.md` |
| Added a new feature area | New folder in `docs/features/` + update `KB_INDEX.md` |

---

## 📝 How to Add a New Fact

### Step 1: Find the next ID

Look at the last fact in the relevant FACTS.jsonl:
```json
{"id":"AF130","s":"U12","p":"injects","o":"FontAwesome SVG fallbacks...","src":["F01"]}
```
Next ID = `AF131`

### Step 2: Write the fact

```json
{"id":"AF131","s":"[entity]","p":"[predicate]","o":"[what it does/is]","src":["[file IDs]"]}
```

### Step 3: Append (don't replace)

Add the new line at the **end** of the file. Don't edit existing lines.

---

## 📝 How to Add a New Entity

### Step 1: Add to IDMAP.md

```md
# Under Entity IDs:
`U18` = NewSectionName    — brief description
```

### Step 2: Add to KG.adj

```
U01 -> U18              (page contains new section)
F01 -> U18              (file renders new section)
U18 -> U11              (if config-driven)
```

### Step 3: Add facts

```json
{"id":"AF131","s":"U18","p":"displays","o":"what the new section shows","src":["F01"]}
{"id":"AF132","s":"U18","p":"triggers","o":"what interactions it has","src":["F01"]}
```

---

## 📝 How to Add a New File

### Step 1: Add to IDMAP.md

```md
# Under File IDs:
`F10` = src/components/NewComponent.jsx — brief description
```

### Step 2: Add to KG.adj

```
F10 -> U18              (file renders entity)
```

### Step 3: Add facts referencing F10

```json
{"id":"AF133","s":"U18","p":"renders","o":"description of what F10 renders","src":["F10"]}
```

---

## 📝 How to Add a New Feature Area

### Step 1: Create the folder

```bash
mkdir -p docs/features/new-feature-name
```

### Step 2: Create the three files

```
docs/features/new-feature-name/
  IDMAP.md       — file IDs, entity IDs, predicates
  KG.adj         — dependency graph
  FACTS.jsonl    — behavioral facts
```

### Step 3: Update KB_INDEX.md

```md
## features/new-feature-name
Use for:
- what this feature covers
- specific behaviors

Depends on:
- project
- shared/ui
```

---

## 🔄 Superseding Old Facts

If behavior changes, **don't delete** the old fact. Add a new one with a note:

```json
{"id":"AF134","s":"U16","p":"triggers","o":"form submit → sends data to /api/contact (replaces AF122: was frontend-only)","src":["F01"]}
```

This way:
- You know what changed
- You know what it replaced
- History is preserved

---

## ✅ Update Checklist

After any code change, ask yourself:

- [ ] Did I add a new file? → Update IDMAP.md (File IDs)
- [ ] Did I add a new UI section/entity? → Update IDMAP.md (Entity IDs) + KG.adj
- [ ] Did I change how something works? → Append to FACTS.jsonl
- [ ] Did I change the design system? → Append to shared/ui/FACTS.jsonl
- [ ] Did I make a significant choice? → Add docs/decisions/new-decision.md
- [ ] Did I change the user flow? → Update docs/processes/lead-flow.md
- [ ] Did I add a whole new feature? → New folder + update KB_INDEX.md

---

## ⚠️ Common Mistakes

| Mistake | Why it's bad | Do this instead |
|---------|-------------|-----------------|
| Deleting old facts | Loses history | Append new fact, reference old ID |
| Editing FACTS inline | Hard to track changes | Append at end |
| Forgetting KG.adj | AI can't trace dependencies | Always update the graph |
| Skipping IDMAP | New entities have no ID | Always register IDs first |
| Not updating KB_INDEX | AI won't find new features | Add new section to index |
| Huge monolithic facts | Hard to query | One fact = one behavior |

---

## 🕐 When to Update

- **Immediately after a feature is complete** — not "later"
- **Before committing to git** — KB should be in sync with code
- **After debugging** — if you discovered new behavior, document it
- **After a decision** — write it down while the reasoning is fresh
