# Lead Generation Flow

> How a visitor becomes a lead on the gym website

---

## Flow Diagram

```
Visitor lands on site
       │
       ▼
┌──────────────┐
│  Hero Section │──→ Sees headline + value proposition
└──────┬───────┘
       │
       ▼
  Explores sections
  (About → Programs → Trainers → Membership → Testimonials)
       │
       ├──────────────────────────────────┐
       ▼                                  ▼
┌──────────────┐                 ┌────────────────┐
│  "Join Now"   │                 │ "Book Free     │
│   CTA Button  │                 │  Trial" Button  │
└──────┬───────┘                 └───────┬────────┘
       │                                  │
       ▼                                  ▼
┌──────────────────────────────────────────────┐
│              Contact Section                  │
│  ┌─────────────────┐  ┌───────────────────┐  │
│  │  Info Cards      │  │  Contact Form     │  │
│  │  • Call Us       │  │  • Name           │  │
│  │  • Email Us      │  │  • Email          │  │
│  │  • Visit Us      │  │  • Phone          │  │
│  │  • Working Hours │  │  • Program Select │  │
│  │                  │  │  • Message        │  │
│  └─────────────────┘  │  • Send Message   │  │
│                        └───────────────────┘  │
└──────────────────────────────────────────────┘
       │
       ▼
  Lead captured (currently frontend-only, no backend)
```

---

## Steps

| # | Step | Location | Entity |
|---|------|----------|--------|
| 1 | Visitor arrives at landing page | Hero (U03) | U01 |
| 2 | Reads value proposition (headline + description) | Hero (U03) | U03 |
| 3 | Scrolls through sections to build trust | About, Programs, Trainers, Testimonials | U04-U08 |
| 4 | Views pricing plans to evaluate fit | Membership (U06) | U06, U13 |
| 5 | Clicks primary CTA ("Join Now") or secondary CTA ("Book Free Trial") | Hero / Header / Footer | U03, U02, U10 |
| 6 | Reaches Contact section | Contact (U09) | U09 |
| 7 | Option A: Calls/emails directly via info cards | Info cards | U09 |
| 8 | Option B: Fills out contact form | Contact form (U16) | U16 |
| 9 | Form shows "Sent ✓" confirmation | Contact form (U16) | U16 |

---

## CTA Touchpoints (where user can convert)

1. **Header CTA** — persistent button in Navbar (U02)
2. **Hero primary CTA** — "Join Now" in hero section (U03)
3. **Hero secondary CTA** — "Book Free Trial" in hero section (U03)
4. **Announcement bar CTA** — top banner link (U17)
5. **Footer CTA** — bottom section CTA button (U10)
6. **Contact form** — "Send Message" submit (U16)
7. **Phone link** — direct call from info card (U09)
8. **Email link** — direct email from info card (U09)

---

## Current Limitations

- ❌ No backend — form submit is frontend-only (shows "Sent ✓", resets after 2s)
- ❌ No analytics tracking on CTA clicks
- ❌ No WhatsApp CTA integration yet
- ❌ No email capture / newsletter signup
- ❌ Phone number is placeholder (+91 XXXXX XXXXX)

---

## Future Improvements

- [ ] Connect contact form to backend API or email service
- [ ] Add WhatsApp CTA button (primary lead channel for local businesses)
- [ ] Add Google Analytics / event tracking on CTA clicks
- [ ] Replace placeholder phone number with real number
- [ ] Add lead notification system (email/SMS to gym owner)
