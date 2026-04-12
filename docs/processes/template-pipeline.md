# Template Injection Pipeline

> How the Gymate WordPress theme HTML gets loaded and transformed into the gym site

---

## Pipeline Sequence

```
1. fetch("/gymate/home2-source.html")
         │
         ▼
2. extractSourceParts(rawHtml)
   ├─ Parse <html>, <head>, <body>
   ├─ Rewrite asset paths (ASSET_PREFIXES → LOCAL_ASSET_BASE)
   └─ Separate scripts from content
         │
         ▼
3. Apply HTML/Body attributes
   ├─ applyHtmlAttributes() — lang, dir, title
   └─ applyBodyAttributes() — className, dataset
         │
         ▼
4. Clone head nodes (stylesheets only)
   └─ shouldCloneHeadNode() filters by rel/id
         │
         ▼
5. Mount body HTML into #gymate-app ref
         │
         ▼
6. Sanitize & Clean
   ├─ sanitizeInjectedMarkup() — rewrite external URLs, neutralize forms
   ├─ removeUnnecessarySections() — strip WooCommerce, shop, cart, trainer promo
   └─ Filter nav to: Home, About, Programs, Trainers, Testimonials, Contact
         │
         ▼
7. Apply Content
   ├─ wireNavbarAnchors() — assign section IDs, setup smooth scroll
   ├─ applyContentOverrides() — replace text from siteConfig.content
   ├─ applyTestimonialOverrides() — inject local testimonial data
   ├─ ensureContactSection() — inject custom contact section if missing
   ├─ applyLogoOverrides() — set dark/light logo paths
   └─ applyPricingSwitcher() — wire monthly/yearly toggle
         │
         ▼
8. Apply Icons
   ├─ addGlobalIcon() — inject globe icon for rkws.in
   ├─ applySocialIconFallbacks() — FA font icons → inline SVGs
   └─ applyIconFallbacks() — flaticon-* → fa-solid equivalents
         │
         ▼
9. Load scripts (sequential, filtered)
   ├─ shouldSkipScript() — block WooCommerce/shop scripts
   └─ appendScriptInOrder() — clone + await load
         │
         ▼
10. Post-script fixup
    ├─ Re-apply icon fallbacks (scripts may mutate DOM)
    └─ setupPricingToggle() — secondary toggle wiring
```

---

## Error Handling

- Fetch failure → cleanup all managed nodes → show error message
- Disposed flag prevents state updates after unmount
- Cleanup function restores original HTML/body attributes

---

## Key Files

| File | Role |
|------|------|
| `src/App.jsx` | Entire pipeline lives here |
| `src/siteConfig.js` | Content values for text replacement |
| `public/gymate/home2-source.html` | Source template |
| `public/gymate/assets/` | Local copies of template assets |
