# STEMONEF Enterprises

## Current State

`PathwaySection.tsx` renders a static 3-column card grid. Six pathway cards (Research & Innovation, Talent & Field Growth, Intelligence & Policy, Climate & Sustainability, Media & Storytelling, Equity & Support) display with a click-to-select state. No orbital engine, no scroll activation, no pathway detail panels, no flow diagrams, no animated center engine. The section header has a small eyebrow label, title, and single-line description.

## Requested Changes (Diff)

### Add
- Central circular alignment engine: an SVG/Canvas-based orbital visualization with "YOU" in the center and 6 pathway nodes slowly orbiting around it, each glowing with its domain color
- Scroll-activated entrance sequence: title fades in (0s), central engine appears (0.3s), nodes orbit into position (0.6s), interaction activates (1.0s) — total ~1.5s
- Hover interaction on each node: a connection line appears from center to node, a tooltip shows pathway name + description
- Click/select interaction: node highlights, pathway details panel expands below the engine
- Pathway detail panel (per selected node): title, description paragraphs, bullet list of sub-pathways, two CTA buttons (e.g. "Explore EPOCHS" and "View Research Projects" for Research node), plus a small flow diagram (Interest → Program → Project → Impact Contribution)
- Reinforced section introduction text: multi-sentence context paragraph explaining STEMONEF as an interconnected system
- Final tagline caption below the engine: "Every pathway contributes to the STEMONEF mission — advancing science, technology, and human progress."
- Mobile fallback: vertical step-selector layout, nodes become interactive cards with the same domain color identity
- Signal pulse animations on nodes (subtle glow throbs)
- Particle/line signals flowing from center outward

### Modify
- `PathwaySection.tsx`: full component rewrite to implement all of the above; keep the same `data-ocid="pathway.section"` root marker and `id="pathway"` anchor; retain `useLogPathwayInterest` backend call on node select; keep existing PATHWAYS color tokens exactly
- Section introduction text strengthened from single sentence to two-paragraph context block

### Remove
- Static 3-column card grid (replaced by orbital engine + expandable detail panel)
- Single-line description under the title (replaced by fuller context paragraph)

## Implementation Plan

1. Rewrite `PathwaySection.tsx` completely.
2. Add `useIntersectionObserver` (inline ref-based) to trigger scroll-activation state.
3. Render central engine as an SVG element sized ~480×480px on desktop, with:
   - Outer dashed orbit ring (animated slow rotation)
   - Inner pulsing ring around "YOU" center text
   - 6 node circles positioned on the orbit ring, each with domain color glow
   - Radial connection line from center to hovered node
4. Add per-pathway DETAILS data object with: full description, sub-pathway bullets, CTA button labels + routes, flow steps (4-step string array), and program name.
5. Expanded detail panel rendered below the SVG engine; uses glass panel styling, animates in with fade+translateY; contains flow diagram as a small vertical step list with arrows.
6. Tooltip rendered as an absolutely-positioned glass card near the hovered node (clamped to viewport).
7. Mobile breakpoint (< 768px): replace SVG engine with a vertical accordion-style card list; preserve color identity and detail panel expansion.
8. Keep all existing design tokens (`#04050e`, `#4a7ef7`, `#d4a017`), fonts (Fraunces display, Sora body, Geist Mono mono), and glass/glow utility classes.
9. Apply deterministic `data-ocid` markers to all interactive nodes, detail panel buttons, and tab-like node selectors.
