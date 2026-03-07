# STEMONEF Enterprises — EPOCHS Page: Stage 1 & 2 Build

## Current State

The existing `EpochsPage.tsx` is a research-organization page focused on EPOCHS as a research body (Project GAIA, EIOS, STEMESA, labs, research library, climate dashboard, collaboration gateway). It has animated background particles, domain network canvas, chart widgets, and IntersectionObserver-based reveal animations. It does NOT contain a "Civilization Exploration Interface" — no civilization timeline, no epoch narrative content blocks, no cinematic scroll experience, no floating epoch signals panel, no reading progress bar.

## Requested Changes (Diff)

### Add

**Stage 1 — Architecture Foundation (inserted ABOVE existing content, after the hero):**
- Scroll progress bar at the top of the page (sticky, subtle)
- New cinematic hero section redesigned to introduce the Civilization Exploration Interface concept (large heading, philosophical intro, atmospheric background, entry CTA into timeline)
- Vertical civilization timeline framework with 6 epoch nodes:
  1. Early Scientific Foundations (Ancient–1600s)
  2. Industrial Transformation (1700s–1850s)
  3. Electrical & Electronic Age (1850s–1940s)
  4. Computing Revolution (1940s–1990s)
  5. Networked Intelligence (1990s–2020s)
  6. Emerging Planetary Technologies (2020s–present)
- Modular `EpochBlock` component for each epoch with sections: Epoch Title, Scientific Context, Key Breakthroughs (list), Key Signals (structured panel), Strategic Implications, Forward Trajectory
- `ExpandableDeepDive` sub-component within each epoch for: Underlying Scientific Principles, Enabling Technologies, Long-term Consequences, Unresolved Questions
- Floating right-side "Epoch Signals" panel that updates as user scrolls (tracks active epoch via IntersectionObserver)

**Stage 2 — Cinematic Scroll Narrative (motion layered on top of Stage 1 structure):**
- Parallax depth layers on hero section (multi-layer canvas/CSS transforms driven by scroll position)
- Smooth animated timeline progression (timeline spine draws in as user scrolls)
- Atmospheric particle canvas on hero (distinct from the existing AnimatedBackground — epoch-specific energy field)
- Subtle lighting/gradient transitions between epoch sections (background hue shifts)
- Scroll-driven scene atmosphere: each epoch section has a unique ambient color identity that bleeds into the background as it enters viewport
- Animated epoch node activation on the timeline as user scrolls past each section

### Modify

- Hero section: convert from research-org intro to Civilization Exploration Interface intro while preserving the EPOCHS branding and back-nav
- The new civilization timeline + epoch blocks are inserted as a new major section between the hero and the existing research content (Mission, Project GAIA, etc.)
- Reading progress bar replaces/enhances the existing sticky nav area

### Remove

- Nothing removed from the existing page structure; all existing sections (Project GAIA, Labs, EIOS, STEMESA, Domain Network, Research Library, Climate Dashboard, Collaboration Gateway, Scientific Integrity) remain intact below the new civilization interface.

## Implementation Plan

1. Add `useScrollProgress` hook — returns 0–1 scroll progress
2. Add `ReadingProgressBar` component — thin top bar driven by scroll progress
3. Redesign hero section to "Civilization Exploration Interface" framing while keeping EPOCHS branding, back-nav, and AnimatedBackground
4. Define `CIVILIZATION_EPOCHS` data array with full scientific content for all 6 epochs (scientific context, breakthroughs, key signals, strategic implications, forward trajectory, and deep dive sections)
5. Build `EpochSignal` type and `FloatingEpochSignalsPanel` component — right-side panel, tracks active epoch via IntersectionObserver, updates signal list dynamically
6. Build `EpochBlock` component — full modular content block for one epoch with all required sub-sections
7. Build `ExpandableDeepDive` sub-component with smooth expand/collapse transitions
8. Build `CivilizationTimeline` component — vertical spine with 6 nodes, scroll-to-section navigation
9. Insert Civilization Timeline + EpochBlocks as a new section between hero and existing research content
10. Stage 2 — Add `useParallax` hook for hero parallax layers driven by scroll
11. Stage 2 — Add animated timeline spine: SVG line that draws in as user scrolls
12. Stage 2 — Add epoch atmosphere: each EpochBlock section has a subtle background color identity that transitions in via IntersectionObserver
13. Stage 2 — Floating signals panel animates signals on epoch change with fade transitions
14. All animations capped at 30 FPS, mobile-responsive, no layout breakage
