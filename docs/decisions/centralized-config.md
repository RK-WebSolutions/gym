# Decision: Centralized siteConfig.js

**Date:** 2026-04  
**Status:** Active  
**Scope:** Content management strategy

---

## Context

The gym website needs all text content (headings, descriptions, pricing, contact info) to be easily changeable — for this demo and when adapting for different gym clients.

## Decision

Use a **single centralized `siteConfig.js`** file that holds all text content, pricing, social links, and navigation data. Both React components and the template injection pipeline read from this config.

## Structure

```
siteConfig = {
  pageTitle          — browser tab title
  content            — all visible text (hero, about, programs, pricing, testimonials, contact)
  socialLinks        — Facebook, Instagram, LinkedIn, X URLs
  navigation         — nav link labels and hrefs
  hero               — eyebrow, title, description, CTAs, highlights
  announcement       — top banner text and CTA
  brand              — name and label
  footer             — eyebrow, title, description, CTA, copyright
}
```

## Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| **siteConfig.js** ✅ | Single source of truth, easy to swap for new client | Not CMS-friendly |
| **CMS (Contentful, Sanity)** | Non-dev can edit | Overkill for demo, adds API dependency |
| **Hardcoded in components** | Simplest | Scattered, hard to update |
| **JSON file** | Language-agnostic | Can't co-locate with code, no IDE autocomplete |
| **Environment variables** | Deployment flexibility | Not suitable for rich content |

## Rationale

- **One file to change** to rebrand the entire site for a new gym client
- React components import it directly — no API calls
- Template injection pipeline uses it for text replacement
- JS object gives IDE autocomplete and easy nesting (plans.basic, plans.basicPrice)

## Tradeoffs

- ❌ Not editable by non-developers (no CMS)
- ❌ Requires code deployment for content changes
- ✅ Zero latency — no API calls for content
- ✅ Type-safe and IDE-friendly
- ✅ Single source of truth for entire site
