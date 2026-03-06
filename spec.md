# STEMONEF Enterprises

## Current State

The homepage `CTASection.tsx` is a minimal "Engage With STEMONEF" section with three plain buttons (Collaborate, Partner, Support) in a horizontal row. Collaborate and Partner open a modal form. Support just scroll-links. There is no visual system, no animations, no detailed content panels, and no routing to pillar pages.

## Requested Changes (Diff)

### Add
- Full cinematic **STEMONEF Engagement Gateway** section replacing `CTASection.tsx`
- Central SVG/Canvas orbital system with a glowing STEMONEF core node and three pathway nodes (Collaborate = blue, Partner = gold, Support = teal) orbiting slowly on a dashed ring
- Scroll-activation sequence: core appears → nodes orbit outward → connection lines draw → interaction unlocks (~1.5s)
- Per-node hover: glow brightens, connection line from core highlights, glass description panel expands with rich content
- Per-node click: locks the panel open
- Three detailed content panels:
  - **Collaborate** — description, 4 bullet opportunities, "Explore Research" → `/epochs` + "Join Collaboration" (opens form)
  - **Partner** — description, 4 bullet partnership types, "Explore Partnerships" → `/steami` + "Become a Partner" (opens form)
  - **Support** — description, 3 bullet support pathways, "Support Initiatives" → `/equis` + "Explore Funding" → `/equis`
- Below-engine engagement flow visualization: three horizontal flow chains (Collaborate / Partner / Support)
- Intro headline "Build the Future With Us" with institutional subtext
- Closing tagline at bottom
- Mobile fallback: three interactive expanding cards instead of orbital SVG, same content/color identity
- Particle canvas (lightweight, 30 FPS) behind section — slow drifting particles matching design tokens

### Modify
- `CTASection.tsx` fully replaced with `EngagementGateway.tsx` (same export, same import path to avoid App.tsx changes)
- Collaboration/Partnership form dialogs preserved and upgraded visually
- Support button now routes to `/equis` via `setView` (prop passed down) rather than scroll

### Remove
- Three plain static buttons layout
- Static horizontal button row
- Support button scroll-to-pathway behavior (replaced by navigate to /equis)

## Implementation Plan

1. Rewrite `CTASection.tsx` as the Engagement Gateway
2. SVG orbital engine: dashed ring, 3 node positions (top=Collaborate, right=Partner, left=Support), STEMONEF core, radial connector lines, slow CSS rotation on ring
3. Canvas particle layer behind section (capped 30 FPS, paused on hidden tab)
4. Scroll IntersectionObserver activates 4-step entrance sequence via state flags
5. Node hover/click state drives active panel display
6. Three rich panel objects with descriptions, bullets, status tags, and CTAs
7. CTA buttons use `onNavigate` prop (already passed from App.tsx via `onPathwaySelect`/`onNavigate`) — add `onNavigate` prop to CTASection
8. Update `App.tsx` to pass `onNavigate` to `CTASection`
9. Existing CollaborationForm dialog preserved; Support opens its own lightweight "Support Inquiry" dialog
10. Mobile: `useIsMobile` hook switches orbital SVG to vertical expanding card stack
11. Engagement flow visualization below engine
12. All design tokens (#04050e, #4a7ef7, #d4a017), Fraunces/Sora/Geist Mono fonts maintained
