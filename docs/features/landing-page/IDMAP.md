# Scope
Full landing page for RK Web Solutions Gym Demo — single-page app with template injection architecture.

# File IDs
`F01` = src/App.jsx              — Main app: fetches Gymate HTML template, sanitizes, injects content overrides
`F02` = src/components/Hero.jsx  — Custom React hero section (replaces template hero)
`F03` = src/components/Navbar.jsx — Custom React navbar with mobile menu toggle
`F04` = src/components/Footer.jsx — Custom React footer with social links + copyright
`F05` = src/siteConfig.js        — Centralized content config (all text, pricing, social links)
`F06` = src/app.css              — Full custom CSS overrides for the template + React components
`F07` = src/main.jsx             — React entry point (renders App)
`F08` = index.html               — HTML shell with meta tags
`F09` = public/gymate/home2-source.html — Saved Gymate WordPress template (source HTML)

# Entity IDs
`U01` = LandingPage              — The full single-page experience
`U02` = Navbar                   — Top navigation (announcement bar + nav links + mobile menu)
`U03` = HeroSection              — Hero with eyebrow, title, description, 2 CTAs, highlights
`U04` = AboutSection             — About the gym (injected from template)
`U05` = ProgramsSection          — "Our Programs" — fitness program cards
`U06` = MembershipSection        — Pricing plans with monthly/yearly toggle
`U07` = TrainersSection          — Trainer profiles
`U08` = TestimonialsSection      — Member testimonials (3 testimonials)
`U09` = ContactSection           — "Get In Touch" with form + info cards (phone, email, location, hours)
`U10` = Footer                   — Footer with CTA, social links, copyright, back-to-top
`U11` = SiteConfig               — Centralized content object driving all text
`U12` = TemplateEngine           — HTML fetch → parse → sanitize → inject pipeline in App.jsx
`U13` = PricingToggle            — Monthly/Yearly pricing switcher logic
`U14` = SocialLinks              — Social media links (Facebook, Instagram, LinkedIn, X)
`U15` = MobileMenu               — Hamburger toggle for responsive nav
`U16` = ContactForm              — Inline contact form with program selector
`U17` = AnnouncementBar          — Top banner with CTA link

# Predicate vocabulary
- contains          (parent → child structural relationship)
- renders           (file → entity it renders)
- configures        (config file → entity it drives)
- triggers          (element → action/behavior)
- injects           (pipeline → content transformation)
- fetches           (component → external resource)
- overrides         (function → template content it replaces)
- toggles           (control → state it switches)
- navigates-to      (link → section anchor)
- displays          (entity → visible content)
