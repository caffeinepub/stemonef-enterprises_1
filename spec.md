# STEMONEF Enterprises — V1 Update

## Current State

The app has:
- Public homepage with: BootScreen, NavBar, HeroSection, PillarsSection, DualMissionSection, IntelligenceFeed, PathwaySection, HumanonSection, CTASection, Footer
- PillarsSection renders 7 pillar cards (all pillars) from backend or fallback data; clicking a card opens a Dialog modal with mandate details
- Admin dashboard (AdminDashboard.tsx) with CMS for intelligence feed
- User dashboard (UserDashboard.tsx) shown after Internet Identity login
- AI Companion panel, SuggestionToast, NeuralCanvas background
- View routing is state-based (AppView: "home" | "admin" | "dashboard") in App.tsx
- Design system: gradient blue/black, glass morphism, yellow (#d4a017) signal accents, Fraunces display font, Geist Mono, Sora body, reveal animations

## Requested Changes (Diff)

### Add
- Three new immersive pillar pages: `/epochs`, `/humanon`, `/steami` — each with full structured content, hero, mission, project sections, interactive elements, legal footer note
- New advisory board page `/elpis` — E.L.P.I.S, circular board layout, placeholder members, governance principles, ethical oversight sections
- Three focused "hero" pillar cards in the existing PillarsSection for EPOCHS, HUMANON™, STEAMI™ (replacing the current 7-card "mandate" grid with 3 large liquid-glass feature cards as the primary display)
- Route handling for `/epochs`, `/humanon`, `/steami`, `/elpis` in App.tsx (add new view states or path-based routing)
- Legal footer note on each pillar page: "EPOCHS™, HUMANON™, STEAMI™ and all associated initiatives operate under the parent institution THE STEMONEF™ ENTERPRISES."

### Modify
- PillarsSection.tsx: Keep existing section ID, scroll behavior, and entrance animations intact. Replace the inner grid with 3 large liquid-glass feature cards (EPOCHS, HUMANON™, STEAMI™). Each card has: title, subtitle, short description, 3 focus area tags, and "Explore [PILLAR]" button that navigates to the pillar page. Hover: card deepens, yellow highlight line appears, elevation animation. The remaining 4 pillars (NOVA, TERRA, EQUIS, ETHOS) can be shown in a secondary smaller grid below or hidden for now.
- App.tsx: Add view states "epochs" | "humanon" | "steami" | "elpis" to AppView type. Add path detection for these routes. Render the appropriate page component.

### Remove
- Nothing removed — the existing 7-card mandate modal system can be retained as secondary/legacy; the main visual upgrade is the 3 featured cards

## Implementation Plan

1. **Update App.tsx routing**: Add "epochs" | "humanon" | "steami" | "elpis" to AppView, detect paths `/epochs`, `/humanon`, `/steami`, `/elpis` on mount, render appropriate page components

2. **Update PillarsSection.tsx**: 
   - Keep section wrapper, ID, scroll behavior, entrance animations unchanged
   - Replace the main grid with 3 large liquid-glass cards (EPOCHS, HUMANON, STEAMI) 
   - Each card: large format, glass morphism, floating motion, yellow accent line on hover, elevation on hover, title + subtitle + description + 3 focus tags + "Explore" CTA button
   - Keep smaller secondary display for remaining 4 pillars below (compact form)

3. **Create EpochsPage.tsx**: Full immersive page — hero (climate/neural animated bg), mission section, Project GAIA card cluster with animated lab nodes, LAB INVOS & LAB NEIA glass panels, Project EIOS animated tech pipeline, Project STEMESA with "Conceptual Development Stage" label, legal footer note

4. **Create HumanonPage.tsx**: Full immersive page — hero, value proposition interactive cards (5 items), program structure participants list, industry partnership animated workflow diagram, success metrics visual dashboard, legal footer note

5. **Create SteamiPage.tsx**: Full immersive page — hero with "not media / decision-grade" positioning, core functions glass cards (5), structure network diagram (STEAMI Parent → Intelligence → Network), STEAMI Intelligence domain list with outputs, STEAMI Network distribution channels, feedback loop interactive animation, legal footer note

6. **Create ElpisPage.tsx**: Advisory board page — hero (E.L.P.I.S acronym expanded), circular advisory board layout with placeholder members, 4 governance sections (Principles, Ethical Oversight, Strategic Guidance, Scientific Integrity)

7. All new pages share the existing design system: neural-bg, glass morphism, yellow accents, Fraunces display font, Geist Mono labels, Sora body, reveal animations, gradient blue/black backgrounds
