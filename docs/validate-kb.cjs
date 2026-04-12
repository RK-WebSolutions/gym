#!/usr/bin/env node

/**
 * KB Validation Suite
 * 
 * Validates the knowledge base for:
 * 1. JSONL syntax — every line must be valid JSON
 * 2. ID uniqueness — no duplicate fact IDs across all FACTS.jsonl files
 * 3. Entity/File ID references — all IDs in FACTS must exist in IDMAP
 * 4. KG consistency — all nodes in KG.adj must exist in IDMAP
 * 
 * Usage: node docs/validate-kb.js
 */

const fs = require("fs");
const path = require("path");

const DOCS_DIR = path.join(__dirname);
const COLORS = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

let totalErrors = 0;
let totalWarnings = 0;
let totalChecks = 0;

function log(color, symbol, msg) {
  console.log(`  ${color}${symbol}${COLORS.reset} ${msg}`);
}

function pass(msg) { totalChecks++; log(COLORS.green, "✓", msg); }
function fail(msg) { totalChecks++; totalErrors++; log(COLORS.red, "✗", msg); }
function warn(msg) { totalWarnings++; log(COLORS.yellow, "⚠", msg); }
function header(msg) { console.log(`\n${COLORS.bold}${COLORS.cyan}${msg}${COLORS.reset}`); }

// ──────────────────────────────────────────────
// 1. Find all KB files
// ──────────────────────────────────────────────

function findFiles(dir, pattern) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFiles(fullPath, pattern));
    } else if (pattern.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

// ──────────────────────────────────────────────
// 2. Validate JSONL syntax
// ──────────────────────────────────────────────

function validateJsonl(filePath) {
  const rel = path.relative(DOCS_DIR, filePath);
  const lines = fs.readFileSync(filePath, "utf-8").split("\n").filter((l) => l.trim());
  let fileErrors = 0;
  const facts = [];

  for (let i = 0; i < lines.length; i++) {
    try {
      const parsed = JSON.parse(lines[i]);
      facts.push({ ...parsed, _line: i + 1, _file: rel });
    } catch (e) {
      fail(`${rel}:${i + 1} — Invalid JSON: ${e.message}`);
      fileErrors++;
    }
  }

  if (fileErrors === 0) {
    pass(`${rel} — all ${lines.length} lines are valid JSON`);
  }

  return facts;
}

// ──────────────────────────────────────────────
// 3. Validate ID uniqueness
// ──────────────────────────────────────────────

function validateIdUniqueness(allFacts) {
  const idMap = new Map();

  for (const fact of allFacts) {
    if (!fact.id) {
      fail(`${fact._file}:${fact._line} — Fact missing "id" field`);
      continue;
    }

    if (idMap.has(fact.id)) {
      const prev = idMap.get(fact.id);
      fail(`Duplicate ID "${fact.id}" — found in ${prev._file}:${prev._line} and ${fact._file}:${fact._line}`);
    } else {
      idMap.set(fact.id, fact);
    }
  }

  const uniqueCount = idMap.size;
  if (uniqueCount === allFacts.length) {
    pass(`All ${uniqueCount} fact IDs are unique`);
  }
}

// ──────────────────────────────────────────────
// 4. Validate required fields
// ──────────────────────────────────────────────

function validateFactFields(allFacts) {
  const required = ["id", "s", "p", "o"];
  let missingCount = 0;

  for (const fact of allFacts) {
    for (const field of required) {
      if (!fact[field] && fact[field] !== 0) {
        fail(`${fact._file}:${fact._line} — Fact "${fact.id || "?"}" missing required field "${field}"`);
        missingCount++;
      }
    }
  }

  if (missingCount === 0) {
    pass(`All ${allFacts.length} facts have required fields (id, s, p, o)`);
  }
}

// ──────────────────────────────────────────────
// 5. Parse IDMAP for registered IDs
// ──────────────────────────────────────────────

function parseIdmap(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const ids = new Set();

  // Match backtick-wrapped IDs like `F01`, `U12`
  const matches = content.matchAll(/`([FU]\d+)`/g);
  for (const match of matches) {
    ids.add(match[1]);
  }

  return ids;
}

// ──────────────────────────────────────────────
// 6. Validate entity references in FACTS
// ──────────────────────────────────────────────

function validateEntityReferences(facts, registeredIds, idmapPath) {
  const rel = path.relative(DOCS_DIR, idmapPath);
  let unreferencedCount = 0;

  for (const fact of facts) {
    // Check subject
    if (fact.s && /^[FU]\d+$/.test(fact.s) && !registeredIds.has(fact.s)) {
      warn(`${fact._file}:${fact._line} — Subject "${fact.s}" not found in ${rel}`);
      unreferencedCount++;
    }

    // Check src array
    if (Array.isArray(fact.src)) {
      for (const ref of fact.src) {
        if (/^[FU]\d+$/.test(ref) && !registeredIds.has(ref)) {
          warn(`${fact._file}:${fact._line} — Source ref "${ref}" not found in ${rel}`);
          unreferencedCount++;
        }
      }
    }
  }

  if (unreferencedCount === 0) {
    pass(`All entity/file references in FACTS resolve to ${rel}`);
  }
}

// ──────────────────────────────────────────────
// 7. Validate KG.adj nodes
// ──────────────────────────────────────────────

function validateKgAdj(kgPath, registeredIds) {
  const rel = path.relative(DOCS_DIR, kgPath);
  const content = fs.readFileSync(kgPath, "utf-8");
  const lines = content.split("\n");
  let unresolvedCount = 0;
  const allNodes = new Set();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith("#")) continue;

    // Parse: NODE -> DEP1, DEP2
    const match = line.match(/^(\S+)\s*->\s*(.+)$/);
    if (!match) {
      warn(`${rel}:${i + 1} — Cannot parse line: "${line}"`);
      continue;
    }

    const source = match[1].trim();
    const targets = match[2].split(",").map((t) => t.trim()).filter(Boolean);

    allNodes.add(source);
    targets.forEach((t) => allNodes.add(t));
  }

  for (const node of allNodes) {
    if (/^[FU]\d+$/.test(node) && !registeredIds.has(node)) {
      warn(`${rel} — Node "${node}" not found in IDMAP`);
      unresolvedCount++;
    }
  }

  if (unresolvedCount === 0) {
    pass(`${rel} — all ${allNodes.size} nodes resolve to IDMAP`);
  }
}

// ──────────────────────────────────────────────
// 8. Check KB_INDEX references
// ──────────────────────────────────────────────

function validateKbIndex() {
  const indexPath = path.join(DOCS_DIR, "KB_INDEX.md");
  if (!fs.existsSync(indexPath)) {
    fail("KB_INDEX.md not found");
    return;
  }

  const content = fs.readFileSync(indexPath, "utf-8");
  // Extract section paths from ## headers
  const sections = [...content.matchAll(/^## ([\w/.-]+)/gm)].map((m) => m[1]);

  for (const section of sections) {
    const sectionPath = path.join(DOCS_DIR, section);
    if (fs.existsSync(sectionPath)) {
      pass(`KB_INDEX section "${section}" → directory exists`);
    } else {
      warn(`KB_INDEX section "${section}" → directory not found at ${sectionPath}`);
    }
  }
}

// ──────────────────────────────────────────────
// MAIN
// ──────────────────────────────────────────────

console.log(`${COLORS.bold}🧠 KB Validation Suite${COLORS.reset}`);
console.log(`${COLORS.dim}Scanning: ${DOCS_DIR}${COLORS.reset}`);

// 1. Validate KB_INDEX
header("1. KB_INDEX.md");
validateKbIndex();

// 2. Find and validate all JSONL files
header("2. JSONL Syntax");
const jsonlFiles = findFiles(DOCS_DIR, /FACTS\.jsonl$/);
const allFacts = [];

for (const file of jsonlFiles) {
  allFacts.push(...validateJsonl(file));
}

if (jsonlFiles.length === 0) {
  warn("No FACTS.jsonl files found");
}

// 3. ID uniqueness
header("3. Fact ID Uniqueness");
validateIdUniqueness(allFacts);

// 4. Required fields
header("4. Required Fields");
validateFactFields(allFacts);

// 5. Entity references (per feature)
header("5. Entity & File References");
const featureDirs = findFiles(DOCS_DIR, /IDMAP\.md$/);

for (const idmapPath of featureDirs) {
  const featureDir = path.dirname(idmapPath);
  const registeredIds = parseIdmap(idmapPath);
  const featureFacts = allFacts.filter((f) => f._file.startsWith(path.relative(DOCS_DIR, featureDir)));

  if (featureFacts.length > 0) {
    validateEntityReferences(featureFacts, registeredIds, idmapPath);
  }

  // Check KG.adj
  const kgPath = path.join(featureDir, "KG.adj");
  if (fs.existsSync(kgPath)) {
    validateKgAdj(kgPath, registeredIds);
  }
}

// Summary
console.log(`\n${COLORS.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);
console.log(`  Total checks: ${totalChecks}`);
console.log(`  ${COLORS.green}Passed: ${totalChecks - totalErrors}${COLORS.reset}`);
if (totalErrors > 0) {
  console.log(`  ${COLORS.red}Errors: ${totalErrors}${COLORS.reset}`);
}
if (totalWarnings > 0) {
  console.log(`  ${COLORS.yellow}Warnings: ${totalWarnings}${COLORS.reset}`);
}
console.log(`${COLORS.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}\n`);

process.exit(totalErrors > 0 ? 1 : 0);
