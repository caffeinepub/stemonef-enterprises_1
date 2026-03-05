# STEMONEF Enterprises

## Current State

The `/humanon` page (`HumanonPage.tsx`) is a basic single-file component with:
- A simple hero with title and tagline only (no CTA buttons, no animated background)
- A "Value Proposition" section with 5 static cards
- A "Program Structure" section listing participant types in a row list
- An "Industry Partnership Model" section with an auto-cycling 5-step flow diagram
- A "Success Metrics" section with animated progress bars
- A legal footer note

The page is missing: Talent Ecosystem Overview cards (expandable), Global Participation Map, Participation Pathways with detailed panels, visual program timeline, Mentor Network section, Participant Projects section, quantitative success counters, and a Join HUMANON CTA.

The backend (`main.mo`) has no types or APIs for mentors, participant projects, or industry partners.

The Admin Dashboard has no HUMANON management tab.

## Requested Changes (Diff)

### Add

**Backend:**
- `HumanonMentor` type: id, name, domain, organization, role, profileUrl (opt)
- `HumanonProject` type: id, title, researchDomain, participantTeam, summary, outcome, mentorsInvolved, publishedAt
- `HumanonPartner` type: id, name, sector, description
- `HumanonStats` type: participantsEnrolled, projectsCompleted, industryPartners, careerPlacements, countriesRepresented
- Backend API: createMentor, getMentors, deleteMentor, createProject, getProjects, updateProject, deleteProject, updateHumanonStats, getHumanonStats, createPartner, getPartners, deletePartner (all admin-gated writes, public reads)
- New query hooks in `useQueries.ts` for all the above

**Frontend (HumanonPage.tsx) — full rebuild:**
- **Hero**: animated canvas network particle background (collaboration dots/lines), HUMANON title, "Connecting Potential to Purpose" subtitle, subtext, two CTA buttons: "Explore Pathways" and "Apply to HUMANON"
- **Talent Ecosystem Overview**: three expandable glass cards — Research Participation, Industry Mentorship, Career Development — each with an expand/collapse description
- **Global Participation Map**: SVG world map with region dot overlays showing participant counts; hover shows count tooltip; on mobile collapses to regional list (Africa, Asia, Europe, Americas, Oceania) with placeholder counts
- **Participation Pathways**: five pathway cards (Student Research Track, Early Career Research Track, Industry Collaboration Track, Career Transition Track, International Scholar Track), each expandable to show eligibility, expected contributions, program duration, outcomes — accordion on mobile
- **Program Structure Timeline**: horizontal (desktop) / vertical (mobile) timeline with 6 steps: Application → Matching → Industry Mentorship → Skill Development → Research Output → Career Placement; hover/tap reveals step details
- **Industry Collaboration Model**: flow diagram with 5 steps and animated connecting arrows showing Industry Problem → HUMANON Research Team → Mentor Guidance → Prototype or Research Output → Industry Feedback; auto-animate active step
- **Mentor Network**: grid of mentor cards (from backend or seeded placeholders) showing name, domain, organization, role; cards have hover glow
- **Participant Projects**: expandable project cards from backend (with seeded placeholders) showing title, domain, team, summary, outcome; click expands to full overlay with research overview, results, mentors involved
- **Success Metrics**: animated count-up numbers on scroll for 5 stats (from backend or defaults): Participants Enrolled, Research Projects Completed, Industry Partners, Career Placements, Countries Represented
- **Join HUMANON**: CTA section with three glass buttons: "Apply as Participant", "Become a Mentor", "Partner as Industry" — link to `#join` form or show a simple modal form
- **Legal footer**: unchanged

**Admin Dashboard — new HUMANON Manager tab:**
- Sub-tabs: Mentors, Projects, Partners, Stats
- Mentors: add/delete mentor (name, domain, organization, role, profileUrl)
- Projects: add/edit/delete project (title, researchDomain, participantTeam, summary, outcome, mentorsInvolved)
- Partners: add/delete partner (name, sector, description)
- Stats: form to update the five quantitative stats

### Modify

- `HumanonPage.tsx`: full rebuild preserving existing `onBack` prop and section nav bar
- `AdminDashboard.tsx`: add HUMANON Manager as a new tab inside the existing Tabs component
- `main.mo`: add new types and API functions
- `backend.d.ts`: add new type exports and function signatures
- `useQueries.ts`: add new query/mutation hooks

### Remove

Nothing removed from existing systems.

## Implementation Plan

1. Update `main.mo` — add HumanonMentor, HumanonProject, HumanonPartner, HumanonStats types; add all CRUD endpoints; seed with placeholder data
2. Update `backend.d.ts` — add new type definitions and function signatures
3. Update `useQueries.ts` — add all new query/mutation hooks
4. Rebuild `HumanonPage.tsx` — full high-detail implementation with all 11 sections plus hero and footer
5. Update `AdminDashboard.tsx` — add HUMANON Manager tab with 4 sub-tabs
6. Validate (typecheck + lint + build)
