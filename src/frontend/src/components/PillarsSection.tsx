import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import type { Pillar } from "../backend.d";
import { useGetAllPillars } from "../hooks/useQueries";

type PillarPage = "epochs" | "humanon" | "steami" | "nova" | "terra" | "equis";

const FALLBACK_PILLARS: Pillar[] = [
  {
    id: 1n,
    name: "EPOCHS",
    mandate:
      "Advanced Research & Development division driving systemic inquiry across social, technological, and environmental domains.",
    strategicRole:
      "Serves as the intellectual engine of STEMONEF, generating foundational knowledge that powers all other pillars.",
    operationalModel:
      "Operates through interdisciplinary research clusters, peer-reviewed output cycles, and strategic knowledge partnerships.",
    initiatives:
      "Project ATLAS (global systems mapping), Initiative FORGE (applied research translation), Lab NEXUS (cross-domain synthesis).",
    futureDirection:
      "Expanding into quantum social modeling and predictive institutional analysis by 2026.",
    governanceNote:
      "All research output subject to ETHOS ethical review. Data sovereignty protocols enforced.",
  },
  {
    id: 2n,
    name: "HUMANON",
    mandate:
      "Talent Incubation & Field Development system cultivating the next generation of mission-driven change agents.",
    strategicRole:
      "Human capital pipeline ensuring STEMONEF sustains long-term operational capacity and social impact.",
    operationalModel:
      "Structured progression from learner cohorts through research residencies to full field deployment.",
    initiatives:
      "Fellows Program (50+ active fellows), Mentorship Matrix, Field Academy, Global Talent Exchange.",
    futureDirection:
      "Targeting 500 active field contributors across 30 countries by 2027.",
    governanceNote:
      "All talent protocols governed by equity and inclusion framework. Zero discrimination policy enforced.",
  },
  {
    id: 3n,
    name: "STEAMI",
    mandate:
      "Intelligence & Knowledge Platform synthesizing cross-domain data into actionable institutional insight.",
    strategicRole:
      "Central intelligence infrastructure enabling evidence-based decision-making across all STEMONEF operations.",
    operationalModel:
      "Continuous data ingestion, AI-assisted synthesis, structured intelligence reporting, and policy translation services.",
    initiatives:
      "Intelligence Briefs (weekly), Domain Watch System, Policy Translation Unit, Strategic Foresight Lab.",
    futureDirection:
      "Deploying sovereign AI models for ethical intelligence synthesis with full auditability.",
    governanceNote:
      "All intelligence products reviewed for bias, accuracy, and ethical alignment before release.",
  },
  {
    id: 4n,
    name: "NOVA",
    mandate:
      "Media Translation & Storytelling division converting complex institutional knowledge into accessible public narratives.",
    strategicRole:
      "Builds public trust, drives institutional visibility, and translates mission complexity into cultural resonance.",
    operationalModel:
      "Documentary production, editorial publishing, digital media strategy, and strategic communications.",
    initiatives:
      "The STEMONEF Report (quarterly), NOVA Documentary Series, Public Dialogue Forums, Media Partners Network.",
    futureDirection:
      "Establishing an independent media institute with editorial autonomy and global distribution.",
    governanceNote:
      "Editorial independence guaranteed. No commercial or political interference in content.",
  },
  {
    id: 5n,
    name: "TERRA",
    mandate:
      "Climate & Natural Life Research division addressing ecological systems, biodiversity, and planetary sustainability.",
    strategicRole:
      "Anchors STEMONEF's environmental mandate, generating science-led policy recommendations and field interventions.",
    operationalModel:
      "Field research stations, ecological monitoring systems, climate policy analysis, and restoration project management.",
    initiatives:
      "Project GAIA (planetary health index), Reforestation Pilot (12 sites), Ocean Systems Lab, Climate Equity Framework.",
    futureDirection:
      "Building the first Social-Ecological Resilience Index spanning 50 nations by 2028.",
    governanceNote:
      "All interventions follow precautionary principle. Indigenous knowledge rights protected.",
  },
  {
    id: 6n,
    name: "EQUIS",
    mandate:
      "Equity & Sustainable Funding system mobilizing ethical capital toward mission-aligned initiatives.",
    strategicRole:
      "Financial sustainability engine ensuring STEMONEF operates with independence and long-term resilience.",
    operationalModel:
      "Impact investment facilitation, ethical venture partnerships, grant management, and revenue reinvestment allocation.",
    initiatives:
      "Impact Fund (active), Deep Tech Licensing Program, Equity Partnership Network, Regenerative Finance Model.",
    futureDirection:
      "Establishing a STEMONEF Endowment Fund targeting $50M in ethical capital by 2029.",
    governanceNote:
      "All capital sources screened against ethical investment criteria. Profit reinvestment is constitutionally mandated.",
  },
];

// Featured pillar card data for the three core pillars
const FEATURED_PILLARS = [
  {
    key: "epochs" as PillarPage,
    glyph: "◈",
    index: "01",
    title: "EPOCHS",
    subtitle: "Research & Innovation Organization",
    description:
      "Emergent Projects ON Climate, Human & Systems Research. The primary research and development arm of STEMONEF Enterprises focused on climate systems, deep technology, and ethical innovation.",
    focus: [
      "Climate Systems Research",
      "Deep Technology Development",
      "Ethical AI Research",
    ],
    buttonLabel: "Explore EPOCHS",
    accentColor: "#4a7ef7",
    accentGlow: "rgba(74,126,247,0.3)",
    delay: "0s",
  },
  {
    key: "humanon" as PillarPage,
    glyph: "◇",
    index: "02",
    title: "HUMANON™",
    subtitle: "Talent & Field Incubation Initiative",
    description:
      "Connecting Potential to Purpose. A large-scale global talent incubation ecosystem connecting learners and early-career researchers with real-world research opportunities and industry mentorship.",
    focus: [
      "Applied Research Participation",
      "Industry Mentorship",
      "Career Path Development",
    ],
    buttonLabel: "Explore HUMANON",
    accentColor: "#22d3b0",
    accentGlow: "rgba(34,211,176,0.3)",
    delay: "0.3s",
  },
  {
    key: "steami" as PillarPage,
    glyph: "◆",
    index: "03",
    title: "STEAMI™",
    subtitle: "Intelligence & Knowledge Platform",
    description:
      "Intelligence Finds Its Voice. A decision-grade intelligence organization responsible for research synthesis, strategic foresight, and knowledge validation across the STEMONEF ecosystem.",
    focus: [
      "Intelligence Synthesis",
      "Strategic Foresight",
      "Ethical Knowledge Governance",
    ],
    buttonLabel: "Explore STEAMI",
    accentColor: "#d4a017",
    accentGlow: "rgba(212,160,23,0.3)",
    delay: "0.6s",
  },
] as const;

// Second row — launching soon pillars
const EXPANDED_FEATURED_PILLARS = [
  {
    key: "nova" as PillarPage,
    glyph: "▷",
    index: "04",
    title: "NOVA",
    subtitle: "Media Translation & Storytelling",
    description:
      "The voice of the enterprise. NOVA converts complex institutional knowledge into narratives that inform, inspire, and shift public understanding — without sacrificing depth.",
    focus: [
      "Editorial Intelligence",
      "Documentary Production",
      "Digital Distribution",
    ],
    buttonLabel: "Explore NOVA",
    accentColor: "#e86c3a",
    accentGlow: "rgba(232,108,58,0.3)",
    delay: "0s",
  },
  {
    key: "terra" as PillarPage,
    glyph: "⬡",
    index: "05",
    title: "TERRA",
    subtitle: "Climate & Natural Life Research",
    description:
      "Where science meets the living earth. TERRA conducts planetary-scale research into climate systems, biodiversity, and ecological resilience — translating science into action.",
    focus: [
      "Climate Systems Modeling",
      "Biodiversity Assessment",
      "Restoration Science",
    ],
    buttonLabel: "Explore TERRA",
    accentColor: "#22d3b0",
    accentGlow: "rgba(34,211,176,0.3)",
    delay: "0.3s",
  },
  {
    key: "equis" as PillarPage,
    glyph: "◎",
    index: "06",
    title: "EQUIS",
    subtitle: "Equity & Sustainable Funding",
    description:
      "Capital in service of mission. EQUIS mobilizes ethical capital, manages impact investments, and ensures STEMONEF operates with independence and long-term resilience.",
    focus: [
      "Impact Investment",
      "Ethical Partnerships",
      "Revenue Reinvestment",
    ],
    buttonLabel: "Explore EQUIS",
    accentColor: "#d4a017",
    accentGlow: "rgba(212,160,23,0.3)",
    delay: "0.6s",
  },
] as const;

type AnyFeaturedPillar = {
  key: PillarPage;
  glyph: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  focus: readonly string[];
  buttonLabel: string;
  accentColor: string;
  accentGlow: string;
  delay: string;
};

function FeaturedPillarCard({
  pillar,
  scanDelay,
  onNavigate,
  launchingSoon,
}: {
  pillar: AnyFeaturedPillar;
  scanDelay: string;
  onNavigate?: (page: PillarPage) => void;
  launchingSoon?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex flex-col h-full animate-float-up"
      style={{
        animationDelay: pillar.delay,
        transitionDelay: pillar.delay,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Yellow highlight bar at top edge — appears on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 transition-all duration-300 rounded-t-sm z-10"
        style={{
          background: `linear-gradient(90deg, transparent, ${pillar.accentColor}, transparent)`,
          opacity: hovered ? 1 : 0,
        }}
        aria-hidden="true"
      />

      <div
        className={`glass-strong flex flex-col h-full p-8 rounded-sm transition-all duration-400 overflow-hidden relative${hovered ? " animate-featured-glow" : ""}`}
        style={{
          background: hovered
            ? `radial-gradient(ellipse 100% 80% at 50% 0%, ${pillar.accentGlow.replace("0.3", "0.1")} 0%, rgba(4,5,14,0.85) 60%)`
            : `radial-gradient(ellipse 80% 60% at 50% 0%, ${pillar.accentGlow.replace("0.3", "0.05")} 0%, rgba(4,5,14,0.7) 55%)`,
          borderColor: hovered
            ? `${pillar.accentColor}44`
            : "rgba(255,255,255,0.08)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          /* CSS variable for the pulsing glow keyframe */
          ["--card-glow-color" as string]: pillar.accentGlow,
        }}
      >
        {/* Floating scan line */}
        <div
          className="animate-card-scan pointer-events-none absolute left-0 right-0 z-10"
          style={{
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${pillar.accentColor}, transparent)`,
            ["--scan-delay" as string]: scanDelay,
          }}
          aria-hidden="true"
        />

        {/* Top row: glyph + index */}
        <div className="flex items-center justify-between mb-6">
          {/* Animated glyph */}
          <div
            className="text-2xl animate-glyph-pulse"
            style={{ color: `${pillar.accentColor}77` }}
            aria-hidden="true"
          >
            {pillar.glyph}
          </div>
          <div
            className="font-mono-geist text-[10px] tracking-[0.25em]"
            style={{ color: `${pillar.accentColor}88` }}
          >
            {pillar.index}
          </div>
        </div>

        {/* Title */}
        <h3
          className="font-display text-3xl md:text-4xl font-light text-gradient-hero mb-2"
          style={{ letterSpacing: "0.12em", lineHeight: 1 }}
        >
          {pillar.title}
        </h3>

        {/* Subtitle */}
        <div
          className="font-mono-geist text-[10px] tracking-[0.25em] uppercase mb-3"
          style={{ color: pillar.accentColor, opacity: 0.75 }}
        >
          {pillar.subtitle}
        </div>

        {/* Launching Soon badge */}
        {launchingSoon && (
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm mb-5 w-fit"
            style={{
              background: `${pillar.accentColor}12`,
              border: `1px solid ${pillar.accentColor}44`,
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
              style={{ background: pillar.accentColor }}
            />
            <span
              className="font-mono-geist text-[9px] tracking-[0.25em] uppercase"
              style={{ color: pillar.accentColor }}
            >
              Launching Soon
            </span>
          </div>
        )}

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-6 flex-1"
          style={{
            color: "rgba(255,255,255,0.45)",
            fontFamily: "Sora, sans-serif",
          }}
        >
          {pillar.description}
        </p>

        {/* Focus area pills — staggered entrance */}
        <div className="flex flex-wrap gap-2 mb-8">
          {pillar.focus.map((area, idx) => (
            <span
              key={area}
              className="px-3 py-1 text-[10px] tracking-[0.1em] uppercase rounded-sm"
              style={{
                background: `${pillar.accentColor}10`,
                border: `1px solid ${pillar.accentColor}30`,
                color: `${pillar.accentColor}cc`,
                fontFamily: "Geist Mono, monospace",
                /* staggered entrance */
                animation: "fade-in-up 0.4s ease forwards",
                animationDelay: `${idx * 0.08}s`,
                opacity: 0,
              }}
            >
              {area}
            </span>
          ))}
        </div>

        {/* Explore button */}
        {onNavigate && (
          <button
            type="button"
            data-ocid={`pillars.featured.${pillar.key}.button`}
            onClick={() => onNavigate(pillar.key)}
            className="w-full py-3.5 text-xs tracking-widest uppercase transition-all duration-300 rounded-sm"
            style={{
              background: hovered
                ? `${pillar.accentColor}18`
                : "rgba(255,255,255,0.04)",
              border: `1px solid ${hovered ? `${pillar.accentColor}66` : `${pillar.accentColor}33`}`,
              color: hovered ? pillar.accentColor : `${pillar.accentColor}bb`,
              fontFamily: "Geist Mono, monospace",
              letterSpacing: "0.2em",
              cursor: "pointer",
              boxShadow: hovered
                ? `0 0 12px ${pillar.accentGlow.replace("0.3", "0.15")}`
                : "none",
            }}
          >
            {pillar.buttonLabel} →
          </button>
        )}
      </div>
    </div>
  );
}

const PILLAR_COLORS = [
  {
    line: "#4a7ef7",
    glow: "rgba(74,126,247,0.3)",
    bg: "rgba(74,126,247,0.06)",
  },
  {
    line: "#22d3b0",
    glow: "rgba(34,211,176,0.3)",
    bg: "rgba(34,211,176,0.06)",
  },
  {
    line: "#a78bfa",
    glow: "rgba(167,139,250,0.3)",
    bg: "rgba(167,139,250,0.06)",
  },
  {
    line: "#d4a017",
    glow: "rgba(212,160,23,0.3)",
    bg: "rgba(212,160,23,0.06)",
  },
  {
    line: "#34d399",
    glow: "rgba(52,211,153,0.3)",
    bg: "rgba(52,211,153,0.06)",
  },
  {
    line: "#f472b6",
    glow: "rgba(244,114,182,0.3)",
    bg: "rgba(244,114,182,0.06)",
  },
  {
    line: "#60a5fa",
    glow: "rgba(96,165,250,0.3)",
    bg: "rgba(96,165,250,0.06)",
  },
];

function PillarCard({
  pillar,
  index,
  onClick,
}: {
  pillar: Pillar;
  index: number;
  onClick: () => void;
}) {
  const color = PILLAR_COLORS[index % PILLAR_COLORS.length];
  const [hovered, setHovered] = useState(false);
  const scanDelay = `${index * 1.8}s`;
  const GLYPHS = ["◈", "◇", "◆", "▷", "⬡", "◎", "◉"] as const;

  return (
    <button
      type="button"
      data-ocid={`pillars.item.${index + 1}`}
      onClick={onClick}
      className="text-left w-full group transition-all duration-300"
      style={{
        animation: "fade-in-up 0.7s ease forwards",
        animationDelay: `${index * 0.1}s`,
        opacity: 0,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
      }}
    >
      <div
        className={`h-full p-6 rounded-sm transition-all duration-300 relative overflow-hidden${hovered ? " animate-featured-glow" : ""}`}
        style={{
          background: hovered
            ? `radial-gradient(ellipse 100% 100% at 110% 110%, ${color.glow.replace("0.3", "0.18")} 0%, rgba(4,5,14,0.75) 65%)`
            : `radial-gradient(ellipse 80% 80% at 110% 110%, ${color.glow.replace("0.3", "0.08")} 0%, rgba(4,5,14,0.6) 60%)`,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: `1px solid ${hovered ? `${color.line}55` : "rgba(255,255,255,0.07)"}`,
          borderLeft: `2px solid ${color.line}`,
          boxShadow: hovered
            ? `0 0 25px ${color.glow.replace("0.3", "0.2")}, 0 8px 32px rgba(0,0,0,0.5)`
            : "none",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          /* CSS variable for the pulsing glow keyframe */
          ["--card-glow-color" as string]: color.glow,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Floating scan line */}
        <div
          className="animate-card-scan pointer-events-none absolute left-0 right-0 z-10"
          style={{
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${color.line}, transparent)`,
            ["--scan-delay" as string]: scanDelay,
          }}
          aria-hidden="true"
        />

        {/* Watermark number — oversized, behind content */}
        <div
          className="absolute font-display font-light select-none pointer-events-none"
          style={{
            fontSize: "7rem",
            lineHeight: 1,
            color: color.line,
            opacity: 0.04,
            right: "-8px",
            bottom: "-16px",
            letterSpacing: "-0.02em",
          }}
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Pillar glyph top-right corner — animated */}
        <div
          className="absolute top-4 right-5 font-mono-geist text-[10px] font-bold select-none pointer-events-none animate-glyph-pulse"
          style={{ color: color.line, letterSpacing: "0.05em" }}
          aria-hidden="true"
        >
          {GLYPHS[index % 7]}
        </div>

        {/* Index */}
        <div
          className="font-mono-geist text-[10px] mb-3"
          style={{ color: color.line, letterSpacing: "0.2em" }}
        >
          {String(index + 1).padStart(2, "0")} /{" "}
          <span style={{ color: "rgba(255,255,255,0.25)" }}>06</span>
        </div>

        {/* Name */}
        <h3
          className="font-display text-xl font-light mb-3 transition-all duration-300"
          style={{
            letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.92)",
          }}
        >
          {pillar.name}
        </h3>

        {/* Mandate preview */}
        <p
          className="text-xs leading-relaxed line-clamp-3"
          style={{
            color: "rgba(255,255,255,0.38)",
            fontFamily: "Sora, sans-serif",
          }}
        >
          {pillar.mandate}
        </p>

        {/* Focus pills — staggered entrance */}
        <div className="mt-4 flex flex-wrap gap-1.5 mb-3">
          {pillar.mandate
            .split(/[,.]/)
            .slice(0, 2)
            .map((tag, tagIdx) => {
              const trimmed = tag.trim();
              if (!trimmed) return null;
              return (
                <span
                  key={trimmed}
                  className="px-2 py-0.5 text-[9px] tracking-[0.08em] uppercase rounded-sm"
                  style={{
                    background: `${color.line}10`,
                    border: `1px solid ${color.line}28`,
                    color: `${color.line}bb`,
                    fontFamily: "Geist Mono, monospace",
                    animation: "fade-in-up 0.4s ease forwards",
                    animationDelay: `${tagIdx * 0.08}s`,
                    opacity: 0,
                  }}
                >
                  {trimmed.slice(0, 28)}
                </span>
              );
            })}
        </div>

        {/* Expand hint */}
        <div
          className="mt-3 flex items-center gap-2 text-[10px] tracking-widest uppercase transition-all duration-200"
          style={{
            color: color.line,
            opacity: hovered ? 0.85 : 0.55,
            fontFamily: "Geist Mono, monospace",
          }}
        >
          <span>View Mandate</span>
          <span>→</span>
        </div>
      </div>
    </button>
  );
}

interface PillarsSectionProps {
  onNavigate?: (page: PillarPage) => void;
}

export default function PillarsSection({ onNavigate }: PillarsSectionProps) {
  const { data: pillars, isLoading } = useGetAllPillars();
  const displayPillars =
    pillars && pillars.length > 0 ? pillars : FALLBACK_PILLARS;
  const [selectedPillar, setSelectedPillar] = useState<Pillar | null>(null);

  return (
    <section
      data-ocid="pillars.section"
      id="pillars"
      className="relative py-28 px-6"
    >
      {/* ── FEATURED PILLARS BLOCK ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto mb-28">
        {/* Featured heading */}
        <div
          className="mb-12"
          style={{ animation: "fade-in-up 0.7s ease forwards" }}
        >
          <div
            className="font-mono-geist text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: "rgba(212,160,23,0.7)" }}
          >
            ◆ CORE PILLARS
          </div>
          <h2
            className="font-display text-4xl md:text-5xl font-light text-gradient-hero"
            style={{ letterSpacing: "0.08em" }}
          >
            The Foundation
          </h2>
          <p
            className="mt-3 max-w-lg text-sm leading-relaxed"
            style={{
              color: "rgba(255,255,255,0.38)",
              fontFamily: "Sora, sans-serif",
            }}
          >
            Three primary verticals drive STEMONEF's core mission — explore each
            to understand the full depth of their mandate.
          </p>
        </div>

        {/* Three large feature cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {FEATURED_PILLARS.map((fp, cardIdx) => (
            <FeaturedPillarCard
              key={fp.key}
              pillar={fp}
              scanDelay={`${cardIdx * 1.5}s`}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        {/* Expanded featured pillars — Launching Soon row */}
        <div className="mt-6">
          <div
            className="flex items-center gap-4 mb-6"
            style={{
              animation: "fade-in-up 0.7s ease forwards",
              animationDelay: "0.3s",
              opacity: 0,
            }}
          >
            <div
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(90deg, rgba(212,160,23,0.3), transparent)",
              }}
            />
            <div
              className="font-mono-geist text-[10px] tracking-[0.35em] uppercase px-3"
              style={{ color: "rgba(212,160,23,0.55)" }}
            >
              NEXT PILLARS — LAUNCHING SOON
            </div>
            <div
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(270deg, rgba(212,160,23,0.3), transparent)",
              }}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {EXPANDED_FEATURED_PILLARS.map((fp, cardIdx) => (
              <FeaturedPillarCard
                key={fp.key}
                pillar={fp}
                scanDelay={`${(cardIdx + 3) * 1.5}s`}
                onNavigate={onNavigate}
                launchingSoon
              />
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        className="max-w-7xl mx-auto mb-16 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
        }}
        aria-hidden="true"
      />

      {/* Section header */}
      <div className="max-w-7xl mx-auto mb-16">
        <div
          className="font-mono-geist text-xs tracking-[0.4em] uppercase mb-4"
          style={{ color: "rgba(212,160,23,0.7)" }}
        >
          ◆ STRUCTURAL ARCHITECTURE
        </div>
        <h2
          className="font-display text-4xl md:text-5xl font-light mb-4 text-gradient-hero"
          style={{ letterSpacing: "0.08em" }}
        >
          Six Pillars
        </h2>
        <p
          className="max-w-xl text-sm leading-relaxed"
          style={{
            color: "rgba(255,255,255,0.4)",
            fontFamily: "Sora, sans-serif",
          }}
        >
          STEMONEF operates through six interdependent structural pillars, each
          carrying a distinct mandate while contributing to a unified
          institutional mission.
        </p>
      </div>

      {/* Pillar grid */}
      {isLoading ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_item, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders with no stable ID
              key={i}
              data-ocid="pillars.loading_state"
              className="h-48 rounded-sm"
              style={{
                background: "rgba(255,255,255,0.03)",
                animation: "node-pulse 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayPillars.map((pillar, i) => (
            <PillarCard
              key={String(pillar.id)}
              pillar={pillar}
              index={i}
              onClick={() => setSelectedPillar(pillar)}
            />
          ))}
        </div>
      )}

      {/* SVG connection lines overlay - decorative */}
      <div className="max-w-7xl mx-auto relative mt-8 hidden xl:block">
        <svg
          role="img"
          aria-label="Pillar connection lines"
          className="w-full pillar-connection-svg animate-breathing"
          height="2"
          style={{ overflow: "visible" }}
        >
          <line
            x1="7%"
            y1="0"
            x2="93%"
            y2="0"
            stroke="rgba(74,126,247,0.15)"
            strokeWidth="1"
            strokeDasharray="8 8"
          />
        </svg>
      </div>

      {/* Pillar Detail Modal */}
      <Dialog
        open={!!selectedPillar}
        onOpenChange={(open) => !open && setSelectedPillar(null)}
      >
        <DialogContent
          data-ocid="pillars.dialog"
          className="max-w-2xl max-h-[85vh] overflow-y-auto"
          style={{
            background: "rgba(6,8,20,0.97)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(74,126,247,0.2)",
            boxShadow:
              "0 0 60px rgba(74,126,247,0.1), 0 24px 64px rgba(0,0,0,0.8)",
          }}
        >
          {selectedPillar && (
            <>
              <DialogHeader>
                <div
                  className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-2"
                  style={{ color: "rgba(212,160,23,0.7)" }}
                >
                  PILLAR MANDATE
                </div>
                <DialogTitle
                  className="font-display text-3xl font-light"
                  style={{
                    letterSpacing: "0.2em",
                    background: "linear-gradient(135deg, #4a7ef7, #ffffff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {selectedPillar.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {[
                  { label: "MANDATE", content: selectedPillar.mandate },
                  {
                    label: "STRATEGIC ROLE",
                    content: selectedPillar.strategicRole,
                  },
                  {
                    label: "OPERATIONAL MODEL",
                    content: selectedPillar.operationalModel,
                  },
                  {
                    label: "ACTIVE INITIATIVES",
                    content: selectedPillar.initiatives,
                  },
                  {
                    label: "FUTURE DIRECTION",
                    content: selectedPillar.futureDirection,
                  },
                  {
                    label: "GOVERNANCE & ETHICS",
                    content: selectedPillar.governanceNote,
                  },
                ].map(({ label, content }) => (
                  <div key={label}>
                    <div
                      className="font-mono-geist text-[9px] tracking-[0.35em] uppercase mb-2"
                      style={{ color: "rgba(212,160,23,0.6)" }}
                    >
                      {label}
                    </div>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: "rgba(255,255,255,0.65)",
                        fontFamily: "Sora, sans-serif",
                      }}
                    >
                      {content}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className="mt-6 pt-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <button
                  type="button"
                  data-ocid="pillars.close_button"
                  onClick={() => setSelectedPillar(null)}
                  className="px-6 py-2 text-xs tracking-widest uppercase transition-all duration-200"
                  style={{
                    background: "rgba(74,126,247,0.08)",
                    border: "1px solid rgba(74,126,247,0.3)",
                    color: "rgba(74,126,247,0.8)",
                    fontFamily: "Geist Mono, monospace",
                    letterSpacing: "0.15em",
                    cursor: "pointer",
                    borderRadius: "2px",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(74,126,247,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(74,126,247,0.08)";
                  }}
                >
                  Close
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
