export interface IntelligenceStep {
  id: string;
  missionNumber: number;
  title: string;
  description: string;
  targetSection: string;
  focusLabel: string;
}

export const INTELLIGENCE_STEPS: IntelligenceStep[] = [
  {
    id: "intro",
    missionNumber: 1,
    title: "Enterprise Architecture",
    description:
      "Begin by understanding the structural pillars of THE STEMONEF ENTERPRISES — seven interdependent verticals forming a unified social science institution.",
    targetSection: "pillars",
    focusLabel: "View Pillars",
  },
  {
    id: "research",
    missionNumber: 2,
    title: "Research Infrastructure",
    description:
      "Explore EPOCHS — the primary research and innovation engine. Climate systems, deep technology, and ethical AI under one institutional mandate.",
    targetSection: "pillars",
    focusLabel: "Explore EPOCHS",
  },
  {
    id: "talent",
    missionNumber: 3,
    title: "Talent Ecosystem",
    description:
      "HUMANON connects learners and early-career researchers with real-world research opportunities and industry mentorship at scale.",
    targetSection: "humanon",
    focusLabel: "View HUMANON",
  },
  {
    id: "intelligence",
    missionNumber: 4,
    title: "Intelligence Network",
    description:
      "STEAMI transforms research into decision-grade intelligence. Knowledge ingestion, modeling, forecasting, and ethical framework development.",
    targetSection: "feed",
    focusLabel: "Intelligence Feed",
  },
  {
    id: "engage",
    missionNumber: 5,
    title: "Collaboration Pathways",
    description:
      "Choose a collaboration pathway to participate in the ecosystem. Research, Talent, Intelligence, Climate, Media, or Equity alignment.",
    targetSection: "cta",
    focusLabel: "Engage Now",
  },
];
