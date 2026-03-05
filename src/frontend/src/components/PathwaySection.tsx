import { useCallback, useEffect, useRef, useState } from "react";
import { useLogPathwayInterest } from "../hooks/useQueries";

// ── Pathway Data ─────────────────────────────────────────────────────────────

const PATHWAYS = [
  {
    id: "research",
    label: "Research & Innovation",
    icon: "◈",
    color: "rgba(74,126,247,0.9)",
    glow: "rgba(74,126,247,0.3)",
    hexColor: "#4a7ef7",
    program: "EPOCHS",
    description:
      "Contribute to EPOCHS-led research and systemic inquiry across climate systems, ethical AI, and health intelligence.",
    subPathways: [
      "Climate systems research",
      "Ethical AI development",
      "Health intelligence",
      "Sustainability technologies",
    ],
    ctaButtons: [
      { label: "Explore EPOCHS", route: "/epochs" },
      { label: "View Research Projects", route: "/epochs#projects" },
    ],
    flowSteps: [
      "Express Interest",
      "EPOCHS Research Intake",
      "Research / Field Project",
      "Impact Contribution",
    ],
    tooltip:
      "Contribute to EPOCHS-led research and systemic inquiry. Join cutting-edge projects across climate, AI, and global health.",
    stats: [
      "42 active projects",
      "6 research domains",
      "18 partner institutions",
    ],
  },
  {
    id: "talent",
    label: "Talent & Field Growth",
    icon: "◇",
    color: "rgba(34,197,94,0.9)",
    glow: "rgba(34,197,94,0.3)",
    hexColor: "#22c55e",
    program: "HUMANON",
    description:
      "Join the HUMANON incubation pipeline — from learner to field-deployed change agent in real-world impact programs.",
    subPathways: [
      "HUMANON Fellowship",
      "Field deployment programs",
      "Skills accelerator tracks",
      "Community leadership roles",
    ],
    ctaButtons: [
      { label: "Join HUMANON", route: "/humanon" },
      { label: "View Open Programs", route: "/humanon#programs" },
    ],
    flowSteps: [
      "Express Interest",
      "HUMANON Fellowship Intake",
      "Field Deployment",
      "Impact Contribution",
    ],
    tooltip:
      "Join HUMANON's research incubation pipeline and contribute to real-world projects across global communities.",
    stats: ["380 participants", "24 field deployments", "12 active cohorts"],
  },
  {
    id: "intelligence",
    label: "Intelligence & Policy",
    icon: "◆",
    color: "rgba(167,139,250,0.9)",
    glow: "rgba(167,139,250,0.3)",
    hexColor: "#a78bfa",
    program: "STEAMI",
    description:
      "Access STEAMI intelligence briefings and contribute to policy translation, synthesis, and strategic advisory work.",
    subPathways: [
      "Intelligence synthesis",
      "Policy translation",
      "Strategic briefings",
      "Governance advisory",
    ],
    ctaButtons: [
      { label: "Access STEAMI", route: "/steami" },
      { label: "View Intelligence Briefs", route: "/steami#briefs" },
    ],
    flowSteps: [
      "Express Interest",
      "STEAMI Intelligence Intake",
      "Policy Synthesis Work",
      "Strategic Impact",
    ],
    tooltip:
      "Access STEAMI's intelligence synthesis network and contribute to policy translation for global decision-makers.",
    stats: ["96 active briefs", "31 policy domains", "9 advisory networks"],
  },
  {
    id: "climate",
    label: "Climate & Sustainability",
    icon: "⬡",
    color: "rgba(20,184,166,0.9)",
    glow: "rgba(20,184,166,0.3)",
    hexColor: "#14b8a6",
    program: "TERRA",
    description:
      "Engage with TERRA's ecological research programs and contribute to planetary health monitoring and sustainability initiatives.",
    subPathways: [
      "Ecological monitoring",
      "Planetary health research",
      "Renewable energy transition",
      "Biodiversity programs",
    ],
    ctaButtons: [
      { label: "Explore TERRA", route: "/terra" },
      { label: "View Climate Programs", route: "/terra#programs" },
    ],
    flowSteps: [
      "Express Interest",
      "TERRA Climate Intake",
      "Ecological Research",
      "Planetary Impact",
    ],
    tooltip:
      "Engage with TERRA's ecological research and planetary health monitoring across global climate systems.",
    stats: [
      "17 climate zones monitored",
      "5 biodiversity programs",
      "3 planetary datasets",
    ],
  },
  {
    id: "media",
    label: "Media & Storytelling",
    icon: "▷",
    color: "rgba(212,160,23,0.9)",
    glow: "rgba(212,160,23,0.3)",
    hexColor: "#d4a017",
    program: "NOVA",
    description:
      "Partner with NOVA to translate mission complexity into cultural narrative, documentary, and multimedia storytelling.",
    subPathways: [
      "Documentary production",
      "Science communication",
      "Digital media campaigns",
      "Cultural translation",
    ],
    ctaButtons: [
      { label: "Join NOVA", route: "/nova" },
      { label: "View Media Programs", route: "/nova#programs" },
    ],
    flowSteps: [
      "Express Interest",
      "NOVA Media Intake",
      "Storytelling Production",
      "Cultural Impact",
    ],
    tooltip:
      "Partner with NOVA to translate complex mission work into powerful cultural narratives and multimedia stories.",
    stats: [
      "28 productions in progress",
      "14 languages supported",
      "6 media partnerships",
    ],
  },
  {
    id: "equity",
    label: "Equity & Support",
    icon: "◎",
    color: "rgba(248,113,113,0.9)",
    glow: "rgba(248,113,113,0.3)",
    hexColor: "#f87171",
    program: "EQUIS",
    description:
      "Explore EQUIS ethical investment, equity funding, and support pathways for underrepresented communities and initiatives.",
    subPathways: [
      "Ethical investment",
      "Equity funding alignment",
      "Community support grants",
      "Humanitarian partnerships",
    ],
    ctaButtons: [
      { label: "Explore EQUIS", route: "/equis" },
      { label: "View Funding Pathways", route: "/equis#funding" },
    ],
    flowSteps: [
      "Express Interest",
      "EQUIS Support Intake",
      "Funding / Partnership",
      "Equity Impact",
    ],
    tooltip:
      "Explore EQUIS ethical investment pathways and equity funding for underrepresented communities and global initiatives.",
    stats: ["$4.2M distributed", "63 community grantees", "11 equity programs"],
  },
];

// ── Geometry helpers ─────────────────────────────────────────────────────────

const ORBIT_R = 180;
const SVG_SIZE = 520;
const CENTER = SVG_SIZE / 2;

function nodePosition(index: number, total: number) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  return {
    x: CENTER + ORBIT_R * Math.cos(angle),
    y: CENTER + ORBIT_R * Math.sin(angle),
    angle,
  };
}

// ── Inline keyframes injected once ─────────────────────────────────────────

const KEYFRAMES_ID = "pathway-engine-keyframes";

function injectKeyframes() {
  if (document.getElementById(KEYFRAMES_ID)) return;
  const style = document.createElement("style");
  style.id = KEYFRAMES_ID;
  style.textContent = `
    @keyframes pe-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes pe-spin-reverse { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
    @keyframes pe-pulse-ring {
      0%   { r: 8;  opacity: 0.7; }
      100% { r: 22; opacity: 0; }
    }
    @keyframes pe-radar {
      0%   { r: 0;   opacity: 0.45; }
      100% { r: 180; opacity: 0; }
    }
    @keyframes pe-blink {
      0%, 49% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }
    @keyframes pe-node-breathe-0 { 0%,100%{opacity:.55} 50%{opacity:.9} }
    @keyframes pe-node-breathe-1 { 0%,100%{opacity:.5}  50%{opacity:.85} }
    @keyframes pe-node-breathe-2 { 0%,100%{opacity:.6}  50%{opacity:.95} }
    @keyframes pe-node-breathe-3 { 0%,100%{opacity:.45} 50%{opacity:.8} }
    @keyframes pe-node-breathe-4 { 0%,100%{opacity:.55} 50%{opacity:.9} }
    @keyframes pe-node-breathe-5 { 0%,100%{opacity:.5}  50%{opacity:.85} }
    @keyframes pe-line-draw {
      from { stroke-dashoffset: 200; }
      to   { stroke-dashoffset: 0; }
    }
    @keyframes pe-fade-in {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pe-scale-in {
      from { opacity: 0; transform: scale(0.7); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes pe-particle-travel {
      0%   { offset-distance: 0%; opacity: 0; }
      10%  { opacity: 0.8; }
      90%  { opacity: 0.8; }
      100% { offset-distance: 100%; opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// ── Precomputed static SVG data (avoids array-index key lint warnings) ────────

const TICK_MARKS = Array.from({ length: 24 }, (_, i) => {
  const a = (i / 24) * 2 * Math.PI;
  const r1 = 234;
  const r2 = 244;
  return {
    id: `tm-${i}`,
    x1: CENTER + r1 * Math.cos(a),
    y1: CENTER + r1 * Math.sin(a),
    x2: CENTER + r2 * Math.cos(a),
    y2: CENTER + r2 * Math.sin(a),
    major: i % 6 === 0,
  };
});

const RADIAL_LINES = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * 2 * Math.PI;
  return {
    id: `rl-${i}`,
    x2: CENTER + 100 * Math.cos(angle),
    y2: CENTER + 100 * Math.sin(angle),
  };
});

// ── Props ─────────────────────────────────────────────────────────────────────

interface PathwaySectionProps {
  onPathwaySelect?: (pathway: string) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PathwaySection({
  onPathwaySelect,
}: PathwaySectionProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [engineActive, setEngineActive] = useState(false);
  const [interactionsActive, setInteractionsActive] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [flowStepsVisible, setFlowStepsVisible] = useState(false);
  const [radarTick, setRadarTick] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const logPathway = useLogPathwayInterest();

  // Inject keyframes once
  useEffect(() => {
    injectKeyframes();
  }, []);

  // Intersection observer for scroll activation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          setTimeout(() => setEngineActive(true), 300);
          setTimeout(() => setInteractionsActive(true), 1200);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Radar pulse every 3 seconds
  useEffect(() => {
    if (!engineActive) return;
    const interval = setInterval(() => {
      setRadarTick((t) => t + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [engineActive]);

  const handleSelect = useCallback(
    (pathway: (typeof PATHWAYS)[0]) => {
      if (!interactionsActive) return;
      const isDeselect = selected === pathway.id;
      setSelected(isDeselect ? null : pathway.id);
      setPanelOpen(!isDeselect);
      setFlowStepsVisible(false);
      if (!isDeselect) {
        logPathway.mutate(pathway.label);
        onPathwaySelect?.(pathway.id);
        setTimeout(() => setFlowStepsVisible(true), 400);
      }
    },
    [selected, interactionsActive, logPathway, onPathwaySelect],
  );

  const handleClose = useCallback(() => {
    setSelected(null);
    setPanelOpen(false);
    setFlowStepsVisible(false);
  }, []);

  const selectedPathway = PATHWAYS.find((p) => p.id === selected) ?? null;
  const hoveredPathway = PATHWAYS.find((p) => p.id === hovered) ?? null;

  return (
    <section
      ref={sectionRef}
      data-ocid="pathway.section"
      id="pathway"
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: "transparent" }}
    >
      {/* Ambient background nebula */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 60%, rgba(74,126,247,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ── Section Header ─────────────────────────────────────────── */}
        <div
          className="mb-16 text-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          <div
            className="font-mono-geist text-xs tracking-[0.4em] uppercase mb-3"
            style={{ color: "rgba(212,160,23,0.75)" }}
          >
            ◆ STEMONEF ADAPTIVE PATHWAY ENGINE
          </div>

          {/* System status line */}
          <div
            className="font-mono-geist text-[9px] tracking-[0.25em] mb-5 flex items-center justify-center gap-3 flex-wrap"
            style={{ color: "rgba(212,160,23,0.5)" }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{
                  background: "#22c55e",
                  animation: "pe-blink 1.2s step-end infinite",
                }}
              />
              SYSTEM STATUS: ACTIVE
            </span>
            <span style={{ color: "rgba(212,160,23,0.25)" }}>|</span>
            <span>6 PATHWAYS AVAILABLE</span>
            <span style={{ color: "rgba(212,160,23,0.25)" }}>|</span>
            <span>
              ALIGNMENT ENGINE: ONLINE
              <span style={{ animation: "pe-blink 1s step-end infinite" }}>
                _
              </span>
            </span>
          </div>

          <h2
            className="font-display text-4xl md:text-5xl font-light text-gradient-hero mb-6"
            style={{ letterSpacing: "0.08em" }}
          >
            Choose Your Path
          </h2>

          <p
            className="max-w-2xl mx-auto text-sm leading-relaxed mb-3"
            style={{
              color: "rgba(255,255,255,0.45)",
              fontFamily: "Sora, sans-serif",
            }}
          >
            STEMONEF is built as an interconnected system of research,
            intelligence, talent development, climate action, media translation,
            and ethical investment.
          </p>
          <p
            className="max-w-2xl mx-auto text-sm leading-relaxed"
            style={{
              color: "rgba(255,255,255,0.35)",
              fontFamily: "Sora, sans-serif",
            }}
          >
            Select the domain where your interests align with the mission. The
            system will guide you into the appropriate pathway.
          </p>
        </div>

        {/* ── Desktop: Orbital Engine ────────────────────────────────── */}
        <div className="hidden md:flex flex-col items-center">
          <div
            className="relative"
            style={{
              width: SVG_SIZE,
              height: SVG_SIZE,
              opacity: engineActive ? 1 : 0,
              transform: engineActive ? "scale(1)" : "scale(0.7)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
            }}
          >
            <svg
              data-ocid="pathway.engine.canvas"
              width={SVG_SIZE}
              height={SVG_SIZE}
              viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
              style={{ overflow: "visible" }}
              role="img"
              aria-label="STEMONEF Adaptive Pathway Engine — orbital alignment system"
            >
              <defs>
                <filter
                  id="pe-glow-strong"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter
                  id="pe-glow-soft"
                  x="-30%"
                  y="-30%"
                  width="160%"
                  height="160%"
                >
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <radialGradient id="pe-center-grad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(212,160,23,0.35)" />
                  <stop offset="60%" stopColor="rgba(74,126,247,0.12)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>

              {/* Outer decorative ring — rotates CW */}
              <g
                style={{
                  transformOrigin: `${CENTER}px ${CENTER}px`,
                  animation: "pe-spin 40s linear infinite",
                }}
              >
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={240}
                  fill="none"
                  stroke="rgba(212,160,23,0.12)"
                  strokeWidth="1"
                  strokeDasharray="4 8"
                />
                {/* Tick marks */}
                {TICK_MARKS.map((tick) => (
                  <line
                    key={tick.id}
                    x1={tick.x1}
                    y1={tick.y1}
                    x2={tick.x2}
                    y2={tick.y2}
                    stroke="rgba(212,160,23,0.2)"
                    strokeWidth={tick.major ? 1.5 : 0.75}
                  />
                ))}
              </g>

              {/* Second ring — rotates CCW */}
              <g
                style={{
                  transformOrigin: `${CENTER}px ${CENTER}px`,
                  animation: "pe-spin-reverse 30s linear infinite",
                }}
              >
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={215}
                  fill="none"
                  stroke="rgba(74,126,247,0.1)"
                  strokeWidth="1"
                  strokeDasharray="2 12"
                />
              </g>

              {/* Orbit path ring */}
              <circle
                cx={CENTER}
                cy={CENTER}
                r={ORBIT_R}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />

              {/* Node-to-node connection web (all pairs) */}
              {PATHWAYS.map((pa, i) =>
                PATHWAYS.slice(i + 1).map((pb, j) => {
                  const posA = nodePosition(i, PATHWAYS.length);
                  const posB = nodePosition(i + j + 1, PATHWAYS.length);
                  const isHoverRelated =
                    hoveredPathway &&
                    (hoveredPathway.id === pa.id ||
                      hoveredPathway.id === pb.id);
                  return (
                    <line
                      key={`${pa.id}-${pb.id}`}
                      x1={posA.x}
                      y1={posA.y}
                      x2={posB.x}
                      y2={posB.y}
                      stroke={
                        isHoverRelated
                          ? "rgba(212,160,23,0.15)"
                          : "rgba(255,255,255,0.04)"
                      }
                      strokeWidth={isHoverRelated ? 0.75 : 0.5}
                      style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
                    />
                  );
                }),
              )}

              {/* Radial signal lines from center */}
              {RADIAL_LINES.map((line) => (
                <line
                  key={line.id}
                  x1={CENTER}
                  y1={CENTER}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="rgba(212,160,23,0.07)"
                  strokeWidth="0.5"
                />
              ))}

              {/* Radar pulse — keyed on radarTick to restart */}
              <circle
                key={`radar-${radarTick}`}
                cx={CENTER}
                cy={CENTER}
                r={0}
                fill="none"
                stroke="rgba(74,126,247,0.45)"
                strokeWidth="1.5"
                style={{ animation: "pe-radar 2.5s ease-out forwards" }}
              />

              {/* Center glow background */}
              <circle
                cx={CENTER}
                cy={CENTER}
                r={55}
                fill="url(#pe-center-grad)"
              />

              {/* Center pulse rings */}
              {[0, 0.7, 1.4].map((delay) => (
                <circle
                  key={delay}
                  cx={CENTER}
                  cy={CENTER}
                  r={8}
                  fill="none"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="0.75"
                  style={{
                    animation: "pe-pulse-ring 2s ease-out infinite",
                    animationDelay: `${delay}s`,
                  }}
                />
              ))}

              {/* Center circle */}
              <circle
                cx={CENTER}
                cy={CENTER}
                r={32}
                fill="rgba(4,5,14,0.92)"
                stroke="rgba(212,160,23,0.4)"
                strokeWidth="1"
                filter="url(#pe-glow-soft)"
              />

              {/* Center text */}
              <text
                x={CENTER}
                y={CENTER - 3}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(212,160,23,0.95)"
                style={{
                  fontFamily: "Geist Mono, monospace",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                }}
              >
                YOU
              </text>
              <text
                x={CENTER}
                y={CENTER + 10}
                textAnchor="middle"
                fill="rgba(212,160,23,0.45)"
                style={{
                  fontFamily: "Geist Mono, monospace",
                  fontSize: "6px",
                  letterSpacing: "0.2em",
                }}
              >
                ALIGNMENT ENGINE
              </text>

              {/* Active node arc bracket */}
              {selectedPathway &&
                (() => {
                  const idx = PATHWAYS.findIndex(
                    (p) => p.id === selectedPathway.id,
                  );
                  const angle =
                    (idx / PATHWAYS.length) * 2 * Math.PI - Math.PI / 2;
                  const arcStart = angle - 0.28;
                  const arcEnd = angle + 0.28;
                  const r = ORBIT_R + 14;
                  const x1 = CENTER + r * Math.cos(arcStart);
                  const y1 = CENTER + r * Math.sin(arcStart);
                  const x2 = CENTER + r * Math.cos(arcEnd);
                  const y2 = CENTER + r * Math.sin(arcEnd);
                  return (
                    <path
                      d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
                      fill="none"
                      stroke={selectedPathway.hexColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity="0.85"
                      filter="url(#pe-glow-soft)"
                    />
                  );
                })()}

              {/* Pathway nodes */}
              {PATHWAYS.map((pathway, i) => {
                const pos = nodePosition(i, PATHWAYS.length);
                const isActive = selected === pathway.id;
                const isHover = hovered === pathway.id;
                const delay = 0.6 + i * 0.1;
                const breatheAnim = `pe-node-breathe-${i} ${2.4 + i * 0.4}s ease-in-out infinite`;

                return (
                  <g
                    key={pathway.id}
                    data-ocid={`pathway.node.${i + 1}`}
                    style={{
                      cursor: interactionsActive ? "pointer" : "default",
                      opacity: engineActive ? 1 : 0,
                      transform: engineActive
                        ? "none"
                        : `translate(${(CENTER - pos.x) * 0.7}px, ${(CENTER - pos.y) * 0.7}px)`,
                      transition: `opacity 0.5s ease ${delay}s, transform 0.6s cubic-bezier(.34,1.56,.64,1) ${delay}s`,
                    }}
                    onClick={() => handleSelect(pathway)}
                    onMouseEnter={() =>
                      interactionsActive && setHovered(pathway.id)
                    }
                    onMouseLeave={() => setHovered(null)}
                    aria-label={pathway.label}
                    tabIndex={interactionsActive ? 0 : -1}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSelect(pathway)
                    }
                  >
                    {/* Connection line from center to node (appears on hover or active) */}
                    {(isHover || isActive) && (
                      <line
                        x1={CENTER}
                        y1={CENTER}
                        x2={pos.x}
                        y2={pos.y}
                        stroke={pathway.hexColor}
                        strokeWidth="1"
                        opacity="0.6"
                        strokeDasharray="200"
                        strokeDashoffset="0"
                        style={{
                          animation: "pe-line-draw 0.35s ease forwards",
                        }}
                      />
                    )}

                    {/* Outer glow halo */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={28}
                      fill={isActive || isHover ? pathway.glow : "transparent"}
                      style={{
                        transition: "fill 0.3s",
                        animation: breatheAnim,
                      }}
                    />

                    {/* Node circle */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={22}
                      fill={`${pathway.hexColor}22`}
                      stroke={pathway.hexColor}
                      strokeWidth={isActive ? 2 : isHover ? 1.5 : 1}
                      opacity={isActive || isHover ? 1 : 0.7}
                      filter={
                        isActive || isHover ? "url(#pe-glow-strong)" : undefined
                      }
                      style={{ transition: "stroke-width 0.2s, opacity 0.2s" }}
                    />

                    {/* Icon */}
                    <text
                      x={pos.x}
                      y={pos.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={pathway.hexColor}
                      style={{
                        fontFamily: "Sora, sans-serif",
                        fontSize: isActive || isHover ? "15px" : "13px",
                        transition: "font-size 0.2s",
                        userSelect: "none",
                      }}
                    >
                      {pathway.icon}
                    </text>

                    {/* Label below node */}
                    <text
                      x={pos.x}
                      y={pos.y + 34}
                      textAnchor="middle"
                      fill={
                        isActive ? pathway.hexColor : "rgba(255,255,255,0.55)"
                      }
                      style={{
                        fontFamily: "Sora, sans-serif",
                        fontSize: "8px",
                        letterSpacing: "0.05em",
                        transition: "fill 0.2s",
                        userSelect: "none",
                      }}
                    >
                      {pathway.label.split(" & ")[0]}
                    </text>
                    {pathway.label.includes(" & ") && (
                      <text
                        x={pos.x}
                        y={pos.y + 44}
                        textAnchor="middle"
                        fill={
                          isActive ? pathway.hexColor : "rgba(255,255,255,0.4)"
                        }
                        style={{
                          fontFamily: "Sora, sans-serif",
                          fontSize: "7px",
                          letterSpacing: "0.05em",
                          transition: "fill 0.2s",
                          userSelect: "none",
                        }}
                      >
                        {`& ${pathway.label.split(" & ")[1]}`}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Floating tooltip */}
            {hovered &&
              hoveredPathway &&
              (() => {
                const idx = PATHWAYS.findIndex((p) => p.id === hovered);
                const pos = nodePosition(idx, PATHWAYS.length);
                const scaledX = pos.x;
                const scaledY = pos.y;
                const tooltipLeft =
                  scaledX > CENTER ? scaledX + 30 : scaledX - 220;
                const tooltipTop = scaledY - 30;
                return (
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: tooltipLeft,
                      top: tooltipTop,
                      width: 190,
                      background: "rgba(4,5,14,0.92)",
                      backdropFilter: "blur(16px)",
                      border: `1px solid ${hoveredPathway.hexColor}40`,
                      borderRadius: "6px",
                      padding: "10px 14px",
                      boxShadow: `0 0 20px ${hoveredPathway.glow}`,
                      animation: "pe-fade-in 0.15s ease forwards",
                      zIndex: 50,
                    }}
                  >
                    <div
                      className="font-mono-geist text-[9px] tracking-[0.3em] uppercase mb-1"
                      style={{ color: "rgba(212,160,23,0.7)" }}
                    >
                      {hoveredPathway.program}
                    </div>
                    <div
                      className="font-display text-xs font-semibold mb-2"
                      style={{
                        color: hoveredPathway.hexColor,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {hoveredPathway.label}
                    </div>
                    <p
                      className="text-[10px] leading-relaxed"
                      style={{
                        color: "rgba(255,255,255,0.55)",
                        fontFamily: "Sora, sans-serif",
                      }}
                    >
                      {hoveredPathway.tooltip}
                    </p>
                  </div>
                );
              })()}
          </div>

          {/* Instruction hint */}
          <p
            className="mt-4 text-center font-mono-geist text-[9px] tracking-widest uppercase"
            style={{
              color: "rgba(255,255,255,0.2)",
              opacity: engineActive ? 1 : 0,
              transition: "opacity 0.5s ease 1.4s",
            }}
          >
            HOVER NODES TO EXPLORE · CLICK TO ALIGN
          </p>
        </div>

        {/* ── Mobile: Vertical card list ─────────────────────────────── */}
        <div className="md:hidden space-y-3">
          {PATHWAYS.map((pathway, i) => {
            const isActive = selected === pathway.id;
            return (
              <div
                key={pathway.id}
                data-ocid={`pathway.mobile.item.${i + 1}`}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(-20px)",
                  transition: `opacity 0.4s ease ${i * 0.07}s, transform 0.4s ease ${i * 0.07}s`,
                }}
              >
                <button
                  type="button"
                  onClick={() => handleSelect(pathway)}
                  className="w-full text-left rounded-sm transition-all duration-300"
                  style={{
                    background: isActive
                      ? `${pathway.hexColor}12`
                      : "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    borderLeft: `4px solid ${pathway.hexColor}${isActive ? "cc" : "44"}`,
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    borderRight: "1px solid rgba(255,255,255,0.06)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    padding: "16px 20px",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xl"
                      style={{ color: pathway.hexColor }}
                    >
                      {pathway.icon}
                    </span>
                    <div className="flex-1">
                      <div
                        className="font-display text-sm font-light mb-0.5"
                        style={{
                          color: isActive
                            ? pathway.hexColor
                            : "rgba(255,255,255,0.85)",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {pathway.label}
                      </div>
                      <div
                        className="font-mono-geist text-[9px] tracking-[0.25em] uppercase"
                        style={{ color: "rgba(212,160,23,0.6)" }}
                      >
                        {pathway.program}
                      </div>
                    </div>
                    <span
                      style={{
                        color: pathway.hexColor,
                        opacity: 0.7,
                        fontSize: "14px",
                        transform: isActive ? "rotate(90deg)" : "none",
                        transition: "transform 0.3s",
                        display: "inline-block",
                      }}
                    >
                      ▷
                    </span>
                  </div>
                </button>

                {/* Inline mobile detail */}
                <div
                  style={{
                    maxHeight: isActive ? "600px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.4s cubic-bezier(.4,0,.2,1)",
                  }}
                >
                  <MobileDetailContent
                    pathway={pathway}
                    flowStepsVisible={isActive && flowStepsVisible}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Pathway Detail Panel (desktop) ────────────────────────── */}
        <div
          data-ocid="pathway.detail.panel"
          style={{
            maxHeight: panelOpen && selectedPathway ? "800px" : "0",
            overflow: "hidden",
            transition: "max-height 0.45s cubic-bezier(.4,0,.2,1)",
          }}
          className="hidden md:block"
        >
          {selectedPathway && (
            <DetailPanel
              pathway={selectedPathway}
              flowStepsVisible={flowStepsVisible}
              onClose={handleClose}
            />
          )}
        </div>

        {/* ── Final tagline ──────────────────────────────────────────── */}
        <div
          className="mt-16 text-center"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.5s ease 1.5s",
          }}
        >
          <p
            className="text-xs leading-relaxed max-w-lg mx-auto"
            style={{
              color: "rgba(255,255,255,0.25)",
              fontFamily: "Sora, sans-serif",
            }}
          >
            Every pathway contributes to the STEMONEF mission —
            <br />
            advancing science, technology, and human progress.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Detail Panel (desktop) ────────────────────────────────────────────────────

interface DetailPanelProps {
  pathway: (typeof PATHWAYS)[0];
  flowStepsVisible: boolean;
  onClose: () => void;
}

function DetailPanel({ pathway, flowStepsVisible, onClose }: DetailPanelProps) {
  return (
    <div
      className="mt-8 mx-auto rounded-sm relative"
      style={{
        maxWidth: 860,
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderLeft: `4px solid ${pathway.hexColor}`,
        boxShadow: `0 0 40px ${pathway.glow}, inset 0 0 40px rgba(0,0,0,0.4)`,
        animation: "pe-fade-in 0.3s ease forwards",
        padding: "32px",
      }}
    >
      {/* Close button */}
      <button
        type="button"
        data-ocid="pathway.detail.close_button"
        onClick={onClose}
        className="absolute top-4 right-4 font-mono-geist text-xs transition-opacity hover:opacity-100"
        style={{ color: "rgba(255,255,255,0.3)", opacity: 0.5 }}
        aria-label="Close pathway detail"
      >
        ✕
      </button>

      {/* Top row */}
      <div className="flex items-start gap-4 mb-6">
        <span
          className="text-3xl flex-shrink-0"
          style={{ color: pathway.hexColor }}
        >
          {pathway.icon}
        </span>
        <div>
          <h3
            className="font-display text-2xl font-light mb-1"
            style={{ color: "rgba(255,255,255,0.9)", letterSpacing: "0.08em" }}
          >
            {pathway.label}
          </h3>
          <span
            className="font-mono-geist text-[10px] tracking-[0.35em] uppercase px-2 py-0.5 rounded-sm"
            style={{
              color: "rgba(212,160,23,0.85)",
              background: "rgba(212,160,23,0.08)",
              border: "1px solid rgba(212,160,23,0.2)",
            }}
          >
            {pathway.program}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap gap-4 mb-5">
        {pathway.stats.map((stat) => (
          <div
            key={stat}
            className="font-mono-geist text-[10px] tracking-[0.2em] uppercase"
            style={{
              color: "rgba(212,160,23,0.7)",
              background: "rgba(212,160,23,0.06)",
              border: "1px solid rgba(212,160,23,0.15)",
              padding: "4px 10px",
              borderRadius: "2px",
            }}
          >
            {stat}
          </div>
        ))}
      </div>

      {/* Description */}
      <p
        className="text-sm leading-relaxed mb-6"
        style={{
          color: "rgba(255,255,255,0.55)",
          fontFamily: "Sora, sans-serif",
          maxWidth: 600,
        }}
      >
        {pathway.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sub-pathways */}
        <div>
          <div
            className="font-mono-geist text-[9px] tracking-[0.35em] uppercase mb-3"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            PATHWAYS INCLUDE
          </div>
          <ul className="space-y-2">
            {pathway.subPathways.map((sp) => (
              <li
                key={sp}
                className="flex items-center gap-2.5 text-xs"
                style={{
                  color: "rgba(255,255,255,0.65)",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                <span style={{ color: pathway.hexColor, fontSize: "10px" }}>
                  ◈
                </span>
                {sp}
              </li>
            ))}
          </ul>
        </div>

        {/* Flow diagram */}
        <div>
          <div
            className="font-mono-geist text-[9px] tracking-[0.35em] uppercase mb-3"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            PARTICIPATION FLOW
          </div>
          <div className="flex flex-col gap-1">
            {pathway.flowSteps.map((step, idx) => (
              <div
                key={step}
                style={{
                  opacity: flowStepsVisible ? 1 : 0,
                  transform: flowStepsVisible
                    ? "translateX(0)"
                    : "translateX(-12px)",
                  transition: `opacity 0.35s ease ${idx * 0.1}s, transform 0.35s ease ${idx * 0.1}s`,
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center justify-center font-mono-geist text-[9px] font-bold flex-shrink-0"
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "3px",
                      background: `${pathway.hexColor}22`,
                      border: `1px solid ${pathway.hexColor}55`,
                      color: pathway.hexColor,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className="text-xs"
                    style={{
                      color: "rgba(255,255,255,0.65)",
                      fontFamily: "Sora, sans-serif",
                    }}
                  >
                    {step}
                  </span>
                </div>
                {idx < pathway.flowSteps.length - 1 && (
                  <div
                    className="ml-2.5 w-px h-3"
                    style={{ background: `${pathway.hexColor}30` }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-wrap gap-3 mt-8">
        <a
          href={pathway.ctaButtons[0].route}
          data-ocid="pathway.detail.primary_button"
          className="font-mono-geist text-xs tracking-[0.2em] uppercase px-5 py-2.5 rounded-sm transition-all duration-200 hover:opacity-90"
          style={{
            background: `${pathway.hexColor}22`,
            border: `1px solid ${pathway.hexColor}55`,
            color: pathway.hexColor,
            backdropFilter: "blur(8px)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background =
              `${pathway.hexColor}35`;
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              `0 0 16px ${pathway.glow}`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background =
              `${pathway.hexColor}22`;
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
          }}
        >
          {pathway.ctaButtons[0].label}
        </a>
        <a
          href={pathway.ctaButtons[1].route}
          data-ocid="pathway.detail.secondary_button"
          className="font-mono-geist text-xs tracking-[0.2em] uppercase px-5 py-2.5 rounded-sm transition-all duration-200"
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.5)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor =
              "rgba(255,255,255,0.3)";
            (e.currentTarget as HTMLAnchorElement).style.color =
              "rgba(255,255,255,0.8)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor =
              "rgba(255,255,255,0.12)";
            (e.currentTarget as HTMLAnchorElement).style.color =
              "rgba(255,255,255,0.5)";
          }}
        >
          {pathway.ctaButtons[1].label}
        </a>
      </div>
    </div>
  );
}

// ── Mobile Detail Content ─────────────────────────────────────────────────────

interface MobileDetailContentProps {
  pathway: (typeof PATHWAYS)[0];
  flowStepsVisible: boolean;
}

function MobileDetailContent({
  pathway,
  flowStepsVisible,
}: MobileDetailContentProps) {
  return (
    <div
      className="rounded-b-sm"
      style={{
        background: `${pathway.hexColor}08`,
        borderLeft: `4px solid ${pathway.hexColor}66`,
        borderRight: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "20px",
      }}
    >
      {/* Stats */}
      <div className="flex flex-wrap gap-2 mb-4">
        {pathway.stats.map((stat) => (
          <div
            key={stat}
            className="font-mono-geist text-[9px] tracking-wider uppercase"
            style={{
              color: "rgba(212,160,23,0.7)",
              background: "rgba(212,160,23,0.07)",
              border: "1px solid rgba(212,160,23,0.15)",
              padding: "3px 8px",
              borderRadius: "2px",
            }}
          >
            {stat}
          </div>
        ))}
      </div>

      <p
        className="text-xs leading-relaxed mb-4"
        style={{
          color: "rgba(255,255,255,0.5)",
          fontFamily: "Sora, sans-serif",
        }}
      >
        {pathway.description}
      </p>

      {/* Sub-pathways */}
      <ul className="space-y-1.5 mb-4">
        {pathway.subPathways.map((sp) => (
          <li
            key={sp}
            className="flex items-center gap-2 text-xs"
            style={{
              color: "rgba(255,255,255,0.55)",
              fontFamily: "Sora, sans-serif",
            }}
          >
            <span style={{ color: pathway.hexColor, fontSize: "9px" }}>◈</span>
            {sp}
          </li>
        ))}
      </ul>

      {/* Flow steps */}
      <div className="flex items-center gap-1.5 flex-wrap mb-5">
        {pathway.flowSteps.map((step, idx) => (
          <div
            key={step}
            className="flex items-center gap-1.5"
            style={{
              opacity: flowStepsVisible ? 1 : 0,
              transition: `opacity 0.3s ease ${idx * 0.1}s`,
            }}
          >
            <span
              className="font-mono-geist text-[9px] px-2 py-1 rounded-sm"
              style={{
                background: `${pathway.hexColor}18`,
                border: `1px solid ${pathway.hexColor}44`,
                color: pathway.hexColor,
              }}
            >
              {step}
            </span>
            {idx < pathway.flowSteps.length - 1 && (
              <span
                style={{ color: "rgba(255,255,255,0.25)", fontSize: "10px" }}
              >
                →
              </span>
            )}
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex gap-2 flex-wrap">
        <a
          href={pathway.ctaButtons[0].route}
          className="font-mono-geist text-[10px] tracking-wider uppercase px-4 py-2 rounded-sm"
          style={{
            background: `${pathway.hexColor}22`,
            border: `1px solid ${pathway.hexColor}55`,
            color: pathway.hexColor,
          }}
        >
          {pathway.ctaButtons[0].label}
        </a>
        <a
          href={pathway.ctaButtons[1].route}
          className="font-mono-geist text-[10px] tracking-wider uppercase px-4 py-2 rounded-sm"
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          {pathway.ctaButtons[1].label}
        </a>
      </div>
    </div>
  );
}
