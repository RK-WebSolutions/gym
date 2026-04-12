# Decision: Template Injection Architecture

**Date:** 2026-04  
**Status:** Active  
**Scope:** Core rendering strategy

---

## Context

Building a premium gym website from scratch would take significant time. The Gymate WordPress theme (by RadiusTheme) provides a polished design with animations, but we need full control over content, links, and behavior.

## Decision

**Fetch a saved copy of the Gymate HTML template at runtime and inject/transform it** inside a React app, rather than rebuilding the entire UI from scratch or using WordPress directly.

## How It Works

1. Save the Gymate WordPress demo page as static HTML + assets
2. At runtime, fetch the HTML file via `fetch()`
3. Parse it into head nodes, body HTML, and scripts
4. Sanitize: rewrite asset paths, neutralize external links, remove unwanted sections
5. Override: replace all text content from `siteConfig.js`
6. Inject custom React components (Hero, Navbar, Footer) alongside the template

## Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| **Template injection** ✅ | Premium design instantly, full control via overrides | Complex sanitization, fragile if template changes |
| **Build from scratch** | Full control, clean code | 10x more development time |
| **Use WordPress directly** | CMS, easy editing | Bloated, slow, hosting cost, less control |
| **Use a React template** | React-native, clean | Hard to find one as polished as Gymate |

## Rationale

- Get 80% of the design for free from a professional WordPress theme
- Full control over content via `siteConfig.js` — change text without touching HTML
- Custom React components (Hero, Navbar, Footer) replace the weakest parts of the template
- Can strip unwanted features (WooCommerce, shop, cart) without touching WordPress

## Tradeoffs

- ❌ Fragile coupling to template HTML structure — DOM selectors can break
- ❌ Complex sanitization pipeline (1000+ lines in App.jsx)
- ❌ Template assets must be stored locally (~saved HTML + assets folder)
- ❌ Scripts loaded sequentially can cause jank
- ✅ Premium design without weeks of CSS work
- ✅ Easy to swap content for different clients
- ✅ Hybrid approach — best parts as React, rest from template

## Risk Mitigation

- Loading/error states handle fetch failures gracefully
- Cleanup function restores DOM on unmount
- Blocked script/style lists prevent unwanted WordPress behavior
- Icon fallback system handles broken font icons
