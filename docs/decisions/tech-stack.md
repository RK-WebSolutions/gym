# Decision: React + Vite over Next.js or plain HTML

**Date:** 2026-04  
**Status:** Active  
**Scope:** Frontend framework

---

## Context

This is a demo gym website built by RK Web Solutions to showcase web development capability. It needs to look premium, load fast, and be easy to modify for different gym clients.

## Decision

Use **React with Vite** as the frontend framework.

## Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| **React + Vite** ✅ | Fast HMR, simple setup, component reuse, no server needed | No SSR, no built-in routing |
| **Next.js** | SSR/SSG, SEO built-in, API routes | Overkill for single-page demo, heavier setup |
| **Plain HTML/CSS/JS** | Simplest, fastest load | No component reuse, harder to maintain |
| **WordPress** | Client-friendly CMS | Bloated, slower, hosting cost |

## Rationale

- Single-page demo doesn't need SSR or routing
- Vite's instant HMR makes iteration fast
- React components (Hero, Navbar, Footer) can be reused across client projects
- No backend needed for a demo site
- Easy to deploy as static files

## Tradeoffs

- ❌ No server-side rendering — not ideal for SEO (acceptable for demo)
- ❌ No built-in API routes — contact form is frontend-only
- ✅ Extremely fast development cycle
- ✅ Zero hosting cost (can deploy to Vercel/Netlify free tier)
