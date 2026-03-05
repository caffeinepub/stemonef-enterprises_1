# STEMONEF Enterprises

## Current State
The `DualMissionSection` component renders a static three-column layout:
- Left: Impact Architecture card with 5 impact domain items (Climate Systems, Global Health, Poverty Reduction, Education Access, Ethical AI)
- Center: A small SVG flow arrow with dashed lines and a gold node
- Right: Revenue & Sustainability Engine card with 4 revenue items
- Footer caption about profit reinvestment

All items are static — no interactivity, no animation beyond basic CSS, no hover effects that connect the two sides.

## Requested Changes (Diff)

### Add
- `EnterpriseEngine.tsx` — a fully new component replacing `DualMissionSection`
- Canvas-based particle flow system animating signals from Revenue → Engine → Impact
- Central animated SVG orbital ring with 7 pillar nodes (EPOCHS, HUMANON, STEAMI, NOVA, TERRA, EQUIS, ETHOS) that slowly rotate
- Each node has a glowing pulse animation and inter-node connection lines
- Hover on impact items highlights specific related pillar nodes in the engine
- Hover on revenue items highlights related pillar nodes
- Hover on pillar nodes shows tooltip (name, description, active systems)
- Scroll-triggered entrance sequence: Impact fades in → Revenue fades in → Engine activates → Data flow begins (1.5–2s total)
- Section tagline block below the engine
- Mobile vertical layout: Impact → Engine → Revenue stacked with simplified interactions
- Section header renamed to "STEMONEF Enterprise Engine"

### Modify
- `App.tsx`: Replace `<DualMissionSection />` import and usage with `<EnterpriseEngine />`

### Remove
- `DualMissionSection.tsx` usage on the homepage (file kept for safety, just unmounted)

## Implementation Plan
1. Create `src/frontend/src/components/EnterpriseEngine.tsx` with:
   - `useRef` for canvas, SVG, section container
   - `IntersectionObserver` for scroll activation (4-step sequence)
   - 7 pillar node definitions with positions on a circular ring, tooltip content, and pillar→impact/revenue mappings
   - Impact domain list with `hoveredImpact` state; hover triggers `highlightedNodes` state
   - Revenue stream list with `hoveredRevenue` state; hover triggers `highlightedNodes` state
   - Central SVG with rotating ring (CSS `transform: rotate` via `requestAnimationFrame` or CSS animation), node circles with glow filters, inter-node lines, and node labels
   - Canvas overlay for particle flow (requestAnimationFrame, 30 FPS cap, tab-pause)
   - Tooltip component that follows hovered pillar node
   - Scroll-in CSS classes with staggered opacity/transform transitions
   - Mobile: `flex-col` layout with `lg:flex-row` (responsive grid)
   - Tagline block at bottom
2. Update `App.tsx` to import and use `EnterpriseEngine` instead of `DualMissionSection`
3. Validate (typecheck + lint + build)
