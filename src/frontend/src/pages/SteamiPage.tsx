import { useEffect, useState } from "react";

interface SteamiPageProps {
  onBack: () => void;
}

const LEGAL_NOTE =
  "EPOCHS™, HUMANON™, STEAMI™ and all associated initiatives operate under the parent institution THE STEMONEF™ ENTERPRISES.";

const CORE_FUNCTIONS = [
  {
    label: "Research Direction",
    glyph: "◈",
    description:
      "Sets the research agenda and prioritizes intelligence domains for investigation.",
  },
  {
    label: "Intelligence Synthesis",
    glyph: "◇",
    description:
      "Aggregates and synthesizes multi-domain data into decision-grade intelligence products.",
  },
  {
    label: "Ethics Review",
    glyph: "◆",
    description:
      "Ensures all knowledge products meet rigorous ethical and accuracy standards before release.",
  },
  {
    label: "Strategic Foresight",
    glyph: "▷",
    description:
      "Projects future trajectories using advanced modeling and scenario planning.",
  },
  {
    label: "Publication Standards",
    glyph: "◎",
    description:
      "Maintains the highest standards of evidence, citation, and institutional accountability.",
  },
];

const FEEDBACK_STEPS = [
  { label: "Research", color: "#4a7ef7" },
  { label: "Review", color: "#d4a017" },
  { label: "Distribution", color: "#22d3b0" },
  { label: "Public Feedback", color: "#a78bfa" },
  { label: "New Research", color: "#4a7ef7" },
];

const DISTRIBUTION_CHANNELS = [
  "Web Platform",
  "Newsletters",
  "Video Explainers",
  "Podcasts",
  "Social Media",
  "Policy Publications",
];

const INTELLIGENCE_DOMAINS = [
  "Knowledge ingestion",
  "Modeling",
  "Forecasting",
  "Risk analysis",
  "Framework development",
];

function FeedbackLoopAnimation() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FEEDBACK_STEPS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-wrap justify-center items-center gap-2">
      {FEEDBACK_STEPS.map((step, i) => (
        <div key={step.label} className="flex items-center gap-2">
          <div
            className="px-5 py-3 rounded-sm transition-all duration-500"
            style={{
              background:
                activeIndex === i
                  ? `${step.color}18`
                  : "rgba(255,255,255,0.03)",
              border:
                activeIndex === i
                  ? `1px solid ${step.color}55`
                  : "1px solid rgba(255,255,255,0.07)",
              boxShadow:
                activeIndex === i ? `0 0 18px ${step.color}22` : "none",
              transform: activeIndex === i ? "scale(1.05)" : "scale(1)",
            }}
          >
            <span
              className="font-display text-sm font-light tracking-widest uppercase"
              style={{
                color: activeIndex === i ? step.color : "rgba(255,255,255,0.4)",
                letterSpacing: "0.12em",
                transition: "color 0.5s ease",
              }}
            >
              {step.label}
            </span>
          </div>
          {i < FEEDBACK_STEPS.length - 1 && (
            <div
              className="font-mono-geist text-xs transition-all duration-300"
              style={{
                color:
                  activeIndex === i ? step.color : "rgba(255,255,255,0.15)",
              }}
            >
              →
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function NetworkDiagram() {
  const nodes = [
    {
      label: "STEAMI PARENT",
      sublabel: "Strategic Oversight",
      color: "#d4a017",
      y: 0,
    },
    {
      label: "STEAMI INTELLIGENCE",
      sublabel: "Research Synthesis",
      color: "#4a7ef7",
      y: 1,
    },
    {
      label: "STEAMI NETWORK",
      sublabel: "Distribution Layer",
      color: "#22d3b0",
      y: 2,
    },
  ];

  return (
    <div className="flex flex-col items-center gap-0">
      {nodes.map((node, i) => (
        <div key={node.label} className="flex flex-col items-center">
          <div
            className="w-full max-w-sm px-8 py-6 rounded-sm text-center transition-all duration-300"
            style={{
              background: `${node.color}0a`,
              border: `1px solid ${node.color}35`,
              backdropFilter: "blur(12px)",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.background = `${node.color}15`;
              el.style.borderColor = `${node.color}60`;
              el.style.boxShadow = `0 0 20px ${node.color}18`;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.background = `${node.color}0a`;
              el.style.borderColor = `${node.color}35`;
              el.style.boxShadow = "none";
            }}
          >
            <div
              className="font-mono-geist text-[9px] tracking-[0.2em] uppercase mb-1"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              LAYER {String(i + 1).padStart(2, "0")}
            </div>
            <div
              className="font-display text-xl font-light tracking-widest uppercase mb-1"
              style={{ color: node.color, letterSpacing: "0.12em" }}
            >
              {node.label}
            </div>
            <div
              className="font-mono-geist text-[10px] tracking-[0.15em]"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {node.sublabel}
            </div>
          </div>
          {i < nodes.length - 1 && (
            <div className="flex flex-col items-center py-3">
              <svg width="2" height="32" aria-hidden="true">
                <line
                  x1="1"
                  y1="0"
                  x2="1"
                  y2="32"
                  stroke={`url(#grad-${i})`}
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  className="animate-breathing"
                />
                <defs>
                  <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={nodes[i].color}
                      stopOpacity="0.6"
                    />
                    <stop
                      offset="100%"
                      stopColor={nodes[i + 1].color}
                      stopOpacity="0.6"
                    />
                  </linearGradient>
                </defs>
              </svg>
              <span
                className="font-mono-geist text-xs"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                ↓
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function SteamiPage({ onBack }: SteamiPageProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );
    const els = document.querySelectorAll(".steami-reveal");
    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: "var(--neural-bg)", minHeight: "100vh" }}>
      {/* Section Nav */}
      <div
        className="sticky top-[65px] z-40 px-6 py-3 flex items-center justify-between"
        style={{
          background: "rgba(4,5,14,0.9)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <button
          type="button"
          data-ocid="steami.back.button"
          onClick={onBack}
          className="flex items-center gap-2 font-mono-geist text-xs tracking-widest uppercase transition-all duration-200"
          style={{
            color: "rgba(255,255,255,0.45)",
            background: "none",
            border: "none",
            cursor: "pointer",
            letterSpacing: "0.15em",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "rgba(212,160,23,0.9)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "rgba(255,255,255,0.45)";
          }}
        >
          ← STEMONEF
        </button>
        <div
          className="font-mono-geist text-xs tracking-[0.3em] uppercase"
          style={{ color: "rgba(74,126,247,0.7)" }}
        >
          STEAMI™
        </div>
      </div>

      {/* Hero */}
      <section
        className="relative min-h-[80vh] flex items-center px-6 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, rgba(8,14,40,0.95) 0%, rgba(4,5,14,1) 65%)",
        }}
      >
        <div
          className="neural-grid-bg absolute inset-0 opacity-25"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full pt-16 pb-20">
          <div
            className="font-mono-geist text-xs tracking-[0.4em] uppercase mb-6 animate-fade-in-up"
            style={{ color: "rgba(74,126,247,0.7)" }}
          >
            ◆ INTELLIGENCE &amp; KNOWLEDGE PLATFORM
          </div>

          <h1
            className="font-display font-light text-gradient-hero mb-4 animate-fade-in-up"
            style={{
              fontSize: "clamp(3.5rem, 11vw, 8rem)",
              letterSpacing: "0.1em",
              lineHeight: 0.9,
              animationDelay: "0.1s",
            }}
          >
            STEAMI™
          </h1>

          <p
            className="font-display text-xl md:text-2xl font-light mb-8 animate-fade-in-up"
            style={{
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.05em",
              maxWidth: "500px",
              animationDelay: "0.2s",
            }}
          >
            Intelligence Finds Its Voice.
          </p>

          {/* Positioning statement */}
          <div
            className="glass-strong p-6 max-w-xl rounded-sm animate-fade-in-up"
            style={{
              borderLeft: "3px solid rgba(74,126,247,0.6)",
              animationDelay: "0.3s",
            }}
          >
            <p
              className="font-mono-geist text-sm leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.75)",
                letterSpacing: "0.05em",
              }}
            >
              STEAMI is{" "}
              <span style={{ color: "rgba(212,160,23,0.9)" }}>not media</span>.
              It is a{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #4a7ef7, #8ab4ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: 600,
                }}
              >
                decision-grade intelligence system
              </span>
              .
            </p>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent, var(--neural-bg))",
          }}
        />
      </section>

      {/* Core Functions */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 steami-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◈ CORE FUNCTIONS
            </div>
            <h2
              className="font-display text-4xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              What STEAMI Does
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {CORE_FUNCTIONS.map((fn, i) => (
              <div
                key={fn.label}
                data-ocid={`steami.function.card.${i + 1}`}
                className="glass-strong p-6 rounded-sm transition-all duration-300 steami-reveal reveal"
                style={{
                  borderTop: "2px solid rgba(74,126,247,0.3)",
                  transitionDelay: `${i * 0.08}s`,
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderTopColor = "rgba(74,126,247,0.7)";
                  el.style.boxShadow =
                    "0 0 20px rgba(74,126,247,0.08), 0 8px 32px rgba(0,0,0,0.4)";
                  el.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderTopColor = "rgba(74,126,247,0.3)";
                  el.style.boxShadow = "none";
                  el.style.transform = "none";
                }}
              >
                <div
                  className="text-2xl mb-4"
                  style={{ color: "rgba(74,126,247,0.5)" }}
                  aria-hidden="true"
                >
                  {fn.glyph}
                </div>
                <div
                  className="font-mono-geist text-[10px] tracking-[0.2em] uppercase mb-3"
                  style={{ color: "rgba(74,126,247,0.8)" }}
                >
                  {fn.label}
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "Sora, sans-serif",
                  }}
                >
                  {fn.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Structure */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 steami-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ ORGANIZATIONAL STRUCTURE
            </div>
            <h2
              className="font-display text-4xl font-light"
              style={{
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Network Architecture
            </h2>
          </div>

          <div
            className="steami-reveal reveal"
            style={{ transitionDelay: "0.1s" }}
          >
            <NetworkDiagram />
          </div>
        </div>
      </section>

      {/* STEAMI Intelligence */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 steami-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◈ INTELLIGENCE LAYER
            </div>
            <h2
              className="font-display text-4xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              STEAMI Intelligence
            </h2>
          </div>

          <div
            className="glass-strong p-8 rounded-sm steami-reveal reveal"
            style={{
              borderLeft: "3px solid rgba(74,126,247,0.5)",
              transitionDelay: "0.1s",
            }}
          >
            <p
              className="text-sm leading-relaxed mb-8"
              style={{
                color: "rgba(255,255,255,0.6)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              Focus: Research synthesis and decision-grade intelligence. STEAMI
              Intelligence operates as the analytical core of the platform —
              transforming raw data into structured, actionable knowledge
              products.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Domains */}
              <div>
                <div
                  className="font-mono-geist text-[9px] tracking-[0.35em] uppercase mb-4"
                  style={{ color: "rgba(74,126,247,0.7)" }}
                >
                  OPERATIONAL DOMAINS
                </div>
                <ul className="space-y-3">
                  {INTELLIGENCE_DOMAINS.map((d) => (
                    <li key={d} className="flex items-center gap-3">
                      <div
                        className="w-1.5 h-1.5 rounded-full animate-node-pulse flex-shrink-0"
                        style={{ background: "rgba(74,126,247,0.7)" }}
                      />
                      <span
                        className="text-sm capitalize"
                        style={{
                          color: "rgba(255,255,255,0.65)",
                          fontFamily: "Sora, sans-serif",
                        }}
                      >
                        {d}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Outputs */}
              <div>
                <div
                  className="font-mono-geist text-[9px] tracking-[0.35em] uppercase mb-4"
                  style={{ color: "rgba(212,160,23,0.7)" }}
                >
                  OUTPUT PRODUCTS
                </div>
                <div className="space-y-4">
                  <div
                    className="px-5 py-4 rounded-sm"
                    style={{
                      background: "rgba(212,160,23,0.06)",
                      border: "1px solid rgba(212,160,23,0.25)",
                    }}
                  >
                    <div
                      className="font-mono-geist text-xs tracking-[0.15em] uppercase mb-1"
                      style={{ color: "#d4a017" }}
                    >
                      Intelligence Briefs
                    </div>
                    <div
                      className="font-mono-geist text-[9px] tracking-[0.2em] uppercase"
                      style={{ color: "rgba(212,160,23,0.5)" }}
                    >
                      ● RESTRICTED ACCESS
                    </div>
                  </div>
                  <div
                    className="px-5 py-4 rounded-sm"
                    style={{
                      background: "rgba(34,211,176,0.06)",
                      border: "1px solid rgba(34,211,176,0.25)",
                    }}
                  >
                    <div
                      className="font-mono-geist text-xs tracking-[0.15em] uppercase mb-1"
                      style={{ color: "#22d3b0" }}
                    >
                      Validated Frameworks
                    </div>
                    <div
                      className="font-mono-geist text-[9px] tracking-[0.2em] uppercase"
                      style={{ color: "rgba(34,211,176,0.5)" }}
                    >
                      ● PUBLIC ACCESS
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEAMI Network */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 steami-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ DISTRIBUTION LAYER
            </div>
            <h2
              className="font-display text-4xl font-light"
              style={{
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              STEAMI Network
            </h2>
          </div>

          <div
            className="glass p-8 rounded-sm steami-reveal reveal"
            style={{ transitionDelay: "0.1s" }}
          >
            <div className="flex flex-wrap gap-3">
              {DISTRIBUTION_CHANNELS.map((ch, i) => (
                <div
                  key={ch}
                  className="px-4 py-2.5 rounded-sm animate-fade-in-up transition-all duration-300"
                  style={{
                    background: "rgba(74,126,247,0.06)",
                    border: "1px solid rgba(74,126,247,0.2)",
                    animationDelay: `${i * 0.1}s`,
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.background = "rgba(74,126,247,0.14)";
                    el.style.borderColor = "rgba(74,126,247,0.5)";
                    el.style.boxShadow = "0 0 10px rgba(74,126,247,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.background = "rgba(74,126,247,0.06)";
                    el.style.borderColor = "rgba(74,126,247,0.2)";
                    el.style.boxShadow = "none";
                  }}
                >
                  <span
                    className="font-mono-geist text-xs tracking-[0.1em] uppercase"
                    style={{ color: "rgba(138,180,255,0.8)" }}
                  >
                    {ch}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Loop */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 steami-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◈ FEEDBACK LOOP
            </div>
            <h2
              className="font-display text-4xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              Intelligence Cycle
            </h2>
          </div>

          <div
            className="glass-strong p-10 rounded-sm steami-reveal reveal"
            style={{ transitionDelay: "0.1s" }}
          >
            <FeedbackLoopAnimation />
            <p
              className="text-center text-xs mt-6"
              style={{
                color: "rgba(255,255,255,0.25)",
                fontFamily: "Sora, sans-serif",
                letterSpacing: "0.05em",
              }}
            >
              Every output feeds the next cycle of intelligence
            </p>
          </div>
        </div>
      </section>

      {/* Legal Footer Note */}
      <div
        className="py-8 px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-5xl mx-auto">
          <p
            className="font-mono-geist text-[10px] text-center leading-relaxed"
            style={{ color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em" }}
          >
            {LEGAL_NOTE}
          </p>
        </div>
      </div>
    </div>
  );
}
