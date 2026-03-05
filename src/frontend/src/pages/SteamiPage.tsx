import { useEffect, useRef } from "react";

interface SteamiPageProps {
  onBack: () => void;
}

function useRevealObserver(containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    const els = container.querySelectorAll(".reveal");
    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef]);
}

const LEGAL_NOTE =
  "EPOCHS™, HUMANON™, STEAMI™ and all associated initiatives operate under the parent institution THE STEMONEF™ ENTERPRISES.";

const CORE_FUNCTIONS = [
  {
    title: "Research Direction",
    desc: "Sets the strategic research agenda across all STEMONEF knowledge domains.",
  },
  {
    title: "Intelligence Synthesis",
    desc: "Aggregates, contextualizes, and validates cross-domain intelligence outputs.",
  },
  {
    title: "Ethics Review",
    desc: "Every intelligence product passes an independent ethical review layer.",
  },
  {
    title: "Strategic Foresight",
    desc: "Models emerging futures and risk vectors across social and technological landscapes.",
  },
  {
    title: "Publication Standards",
    desc: "Enforces rigorous standards for all public and restricted knowledge outputs.",
  },
];

const DISTRIBUTION_CHANNELS = [
  "Web Platform",
  "Newsletters",
  "Video Explainers",
  "Podcasts",
  "Social Media",
  "Policy Publications",
];

const FEEDBACK_LOOP = [
  "Research",
  "Review",
  "Distribution",
  "Public Feedback",
  "New Research",
];

export default function SteamiPage({ onBack }: SteamiPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useRevealObserver(containerRef);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        background: "var(--neural-bg)",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* ─── Top Navigation Bar ─────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(4,5,14,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <button
          type="button"
          data-ocid="steami.button"
          onClick={onBack}
          className="flex items-center gap-3"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <span
            className="font-mono-geist text-xs tracking-widest"
            style={{ color: "rgba(74,126,247,0.7)" }}
          >
            ←
          </span>
          <span
            className="font-mono-geist text-xs tracking-[0.25em] uppercase transition-colors duration-200"
            style={{ color: "rgba(255,255,255,0.5)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLSpanElement).style.color =
                "rgba(212,160,23,0.8)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLSpanElement).style.color =
                "rgba(255,255,255,0.5)";
            }}
          >
            STEMONEF
          </span>
        </button>
        <div
          className="font-mono-geist text-[10px] tracking-[0.4em] uppercase"
          style={{ color: "rgba(212,160,23,0.55)" }}
        >
          ◆ STEAMI™ — INTELLIGENCE PILLAR
        </div>
      </nav>

      {/* ─── Hero Section ───────────────────────────────────── */}
      <section
        data-ocid="steami.section"
        className="relative flex flex-col items-center justify-center text-center px-6"
        style={{ minHeight: "82vh", paddingTop: "6rem", paddingBottom: "6rem" }}
      >
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <svg
            role="img"
            aria-label="Decorative intelligence data stream background"
            className="absolute inset-0 w-full h-full"
            style={{ opacity: 0.15 }}
          >
            <defs>
              <radialGradient id="steamiHeroGrad" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#04050e" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#steamiHeroGrad)" />
            {/* Data stream lines */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line
                key={`stream-${i}`}
                x1={`${10 + i * 16}%`}
                y1="0"
                x2={`${5 + i * 18}%`}
                y2="100%"
                stroke="#a78bfa"
                strokeWidth="0.5"
                strokeDasharray="3 8"
                opacity="0.3"
                className="animate-breathing"
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            ))}
            {[
              [20, 25],
              [40, 55],
              [60, 35],
              [75, 70],
              [35, 85],
              [55, 15],
              [85, 45],
            ].map(([cx, cy]) => (
              <circle
                key={`sint-${cx}-${cy}`}
                cx={`${cx}%`}
                cy={`${cy}%`}
                r="2.5"
                fill="#a78bfa"
                opacity="0.4"
                className="animate-breathing"
              />
            ))}
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div
            className="font-mono-geist text-xs tracking-[0.45em] uppercase mb-6 reveal"
            style={{ color: "rgba(212,160,23,0.7)" }}
          >
            ◆ INTELLIGENCE & KNOWLEDGE PLATFORM
          </div>
          <h1
            className="font-display font-light mb-4 reveal reveal-delay-1"
            style={{
              fontSize: "clamp(3rem, 9vw, 6.5rem)",
              letterSpacing: "0.18em",
              lineHeight: 1,
              background:
                "linear-gradient(135deg, #a78bfa 0%, #4a7ef7 50%, #ffffff 80%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            STEAMI™
          </h1>
          <p
            className="font-display font-light text-xl mb-2 reveal reveal-delay-2"
            style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}
          >
            Intelligence & Knowledge Platform
          </p>
          <p
            className="font-display font-light text-2xl mb-6 reveal reveal-delay-3"
            style={{ color: "#d4a017", letterSpacing: "0.06em" }}
          >
            Intelligence Finds Its Voice.
          </p>

          {/* Important callout */}
          <div
            className="inline-block px-6 py-4 rounded-sm reveal reveal-delay-4"
            style={{
              background: "rgba(167,139,250,0.07)",
              border: "1px solid rgba(167,139,250,0.2)",
              backdropFilter: "blur(16px)",
            }}
          >
            <p
              className="font-mono-geist text-xs tracking-wider"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              <span style={{ color: "#a78bfa" }}>STEAMI is not media.</span> It
              is a{" "}
              <span style={{ color: "#d4a017" }}>
                decision-grade intelligence system.
              </span>
            </p>
          </div>
        </div>
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-chevron-bounce"
          aria-hidden="true"
        >
          <div
            className="w-px h-10 mx-auto"
            style={{
              background:
                "linear-gradient(to bottom, rgba(167,139,250,0.5), transparent)",
            }}
          />
        </div>
      </section>

      {/* ─── Core Functions ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-10 reveal">
          <div
            className="font-mono-geist text-[10px] tracking-[0.45em] uppercase mb-3"
            style={{ color: "rgba(167,139,250,0.7)" }}
          >
            ◈ CORE FUNCTIONS
          </div>
          <h2
            className="font-display text-3xl font-light"
            style={{
              letterSpacing: "0.12em",
              background: "linear-gradient(135deg, #a78bfa, #4a7ef7, #ffffff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Operational Mandate
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {CORE_FUNCTIONS.map((fn, i) => (
            <div
              key={fn.title}
              data-ocid={`steami.card.${i + 1}`}
              className="p-6 rounded-sm reveal transition-all duration-300"
              style={{
                background:
                  "radial-gradient(ellipse at top left, rgba(167,139,250,0.07), rgba(4,5,14,0.8))",
                border: "1px solid rgba(167,139,250,0.12)",
                backdropFilter: "blur(16px)",
                transitionDelay: `${i * 0.06}s`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background =
                  "radial-gradient(ellipse at top left, rgba(167,139,250,0.14), rgba(4,5,14,0.88))";
                el.style.borderColor = "rgba(167,139,250,0.3)";
                el.style.transform = "translateY(-5px)";
                el.style.boxShadow = "0 12px 32px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background =
                  "radial-gradient(ellipse at top left, rgba(167,139,250,0.07), rgba(4,5,14,0.8))";
                el.style.borderColor = "rgba(167,139,250,0.12)";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
              }}
            >
              <div
                className="w-2 h-2 rounded-full mb-4"
                style={{
                  background: "#d4a017",
                  boxShadow: "0 0 8px rgba(212,160,23,0.5)",
                }}
              />
              <h3
                className="font-mono-geist text-xs tracking-wider mb-3"
                style={{
                  color: "rgba(255,255,255,0.75)",
                  letterSpacing: "0.12em",
                }}
              >
                {fn.title}
              </h3>
              <p
                className="text-xs leading-relaxed"
                style={{
                  color: "rgba(255,255,255,0.38)",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                {fn.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Organizational Structure ───────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10 reveal">
          <div
            className="font-mono-geist text-[10px] tracking-[0.45em] uppercase mb-3"
            style={{ color: "rgba(74,126,247,0.7)" }}
          >
            ◈ ORGANIZATIONAL STRUCTURE
          </div>
          <h2
            className="font-display text-3xl font-light text-gradient-hero"
            style={{ letterSpacing: "0.12em" }}
          >
            Network Hierarchy
          </h2>
        </div>

        <div className="flex flex-col items-center gap-0 reveal">
          {[
            {
              label: "STEAMI Parent",
              role: "Strategic governance and editorial direction for the entire intelligence ecosystem.",
              color: "#a78bfa",
            },
            {
              label: "STEAMI Intelligence",
              role: "Research synthesis, forecasting, and decision-grade intelligence production.",
              color: "#4a7ef7",
            },
            {
              label: "STEAMI Network",
              role: "Distribution, communication, and public engagement channels.",
              color: "#22d3b0",
            },
          ].map((node, i) => (
            <div key={node.label} className="flex flex-col items-center w-full">
              <div
                data-ocid={`steami.card.${i + 1}`}
                className="w-full max-w-md p-6 rounded-sm transition-all duration-300 text-center"
                style={{
                  background: `rgba(${i === 0 ? "167,139,250" : i === 1 ? "74,126,247" : "34,211,176"},0.06)`,
                  border: `1px solid rgba(${i === 0 ? "167,139,250" : i === 1 ? "74,126,247" : "34,211,176"},0.18)`,
                  backdropFilter: "blur(16px)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background =
                    `rgba(${i === 0 ? "167,139,250" : i === 1 ? "74,126,247" : "34,211,176"},0.12)`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background =
                    `rgba(${i === 0 ? "167,139,250" : i === 1 ? "74,126,247" : "34,211,176"},0.06)`;
                }}
              >
                <div
                  className="font-display text-lg font-light mb-2"
                  style={{ color: node.color, letterSpacing: "0.15em" }}
                >
                  {node.label}
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontFamily: "Sora, sans-serif",
                  }}
                >
                  {node.role}
                </p>
              </div>
              {i < 2 && (
                <div className="flex flex-col items-center py-1">
                  <div
                    className="w-px h-6"
                    style={{ background: "rgba(74,126,247,0.3)" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "#4a7ef7",
                      boxShadow: "0 0 8px rgba(74,126,247,0.5)",
                      animation: "node-pulse 2s ease-in-out infinite",
                      animationDelay: `${i * 0.5}s`,
                    }}
                  />
                  <div
                    className="w-px h-4"
                    style={{ background: "rgba(74,126,247,0.2)" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── STEAMI Intelligence ────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-8 reveal">
          <div
            className="font-mono-geist text-[10px] tracking-[0.45em] uppercase mb-3"
            style={{ color: "rgba(74,126,247,0.7)" }}
          >
            ◈ STEAMI INTELLIGENCE
          </div>
          <h2
            className="font-display text-3xl font-light text-gradient-hero"
            style={{ letterSpacing: "0.12em" }}
          >
            Decision-Grade Intelligence
          </h2>
        </div>

        <div
          className="p-8 rounded-sm reveal"
          style={{
            background: "rgba(74,126,247,0.04)",
            border: "1px solid rgba(74,126,247,0.14)",
            borderLeft: "3px solid #4a7ef7",
            backdropFilter: "blur(16px)",
          }}
        >
          <div
            className="font-mono-geist text-[9px] tracking-[0.4em] uppercase mb-4"
            style={{ color: "rgba(74,126,247,0.6)" }}
          >
            OPERATIONAL DOMAINS
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              "Knowledge Ingestion",
              "Modeling",
              "Forecasting",
              "Risk Analysis",
              "Framework Development",
            ].map((domain) => (
              <span
                key={domain}
                className="px-3 py-1.5 rounded-sm font-mono-geist text-[10px] tracking-wider"
                style={{
                  background: "rgba(74,126,247,0.08)",
                  border: "1px solid rgba(74,126,247,0.2)",
                  color: "rgba(74,126,247,0.8)",
                }}
              >
                {domain}
              </span>
            ))}
          </div>

          <div
            className="font-mono-geist text-[9px] tracking-[0.4em] uppercase mb-3"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            OUTPUT CLASSIFICATIONS
          </div>
          <div className="flex flex-wrap gap-3">
            <span
              className="px-4 py-2 rounded-sm font-mono-geist text-[10px] tracking-wider"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "rgba(239,68,68,0.75)",
              }}
            >
              ⊘ Intelligence Briefs — RESTRICTED
            </span>
            <span
              className="px-4 py-2 rounded-sm font-mono-geist text-[10px] tracking-wider"
              style={{
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.2)",
                color: "rgba(34,197,94,0.75)",
              }}
            >
              ◈ Validated Frameworks — PUBLIC
            </span>
          </div>
        </div>
      </section>

      {/* ─── STEAMI Network / Distribution ─────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-8 reveal">
          <div
            className="font-mono-geist text-[10px] tracking-[0.45em] uppercase mb-3"
            style={{ color: "rgba(34,211,176,0.7)" }}
          >
            ◈ DISTRIBUTION CHANNELS
          </div>
          <h2
            className="font-display text-3xl font-light text-gradient-hero"
            style={{ letterSpacing: "0.12em" }}
          >
            STEAMI Network
          </h2>
        </div>

        <div className="flex flex-wrap gap-3 reveal">
          {DISTRIBUTION_CHANNELS.map((channel, i) => (
            <span
              key={channel}
              className="px-4 py-2 rounded-sm font-mono-geist text-xs tracking-wider transition-all duration-200"
              style={{
                background: "rgba(34,211,176,0.05)",
                border: "1px solid rgba(34,211,176,0.15)",
                color: "rgba(34,211,176,0.7)",
                transitionDelay: `${i * 0.06}s`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLSpanElement).style.background =
                  "rgba(34,211,176,0.12)";
                (e.currentTarget as HTMLSpanElement).style.borderColor =
                  "rgba(34,211,176,0.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLSpanElement).style.background =
                  "rgba(34,211,176,0.05)";
                (e.currentTarget as HTMLSpanElement).style.borderColor =
                  "rgba(34,211,176,0.15)";
              }}
            >
              {channel}
            </span>
          ))}
        </div>
      </section>

      {/* ─── Feedback Loop ──────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10 reveal">
          <div
            className="font-mono-geist text-[10px] tracking-[0.45em] uppercase mb-3"
            style={{ color: "rgba(212,160,23,0.7)" }}
          >
            ◈ INTELLIGENCE FEEDBACK LOOP
          </div>
          <h2
            className="font-display text-3xl font-light text-gradient-hero"
            style={{ letterSpacing: "0.12em" }}
          >
            Continuous Intelligence Cycle
          </h2>
        </div>

        <div className="reveal" style={{ overflowX: "auto" }}>
          <div
            className="flex items-center gap-0 min-w-max mx-auto pb-4"
            style={{ padding: "2rem 0" }}
          >
            {FEEDBACK_LOOP.map((step, i) => (
              <div key={step} className="flex items-center">
                <div
                  data-ocid={`steami.card.${i + 1}`}
                  className="flex flex-col items-center p-5 rounded-sm transition-all duration-300"
                  style={{
                    background: "rgba(212,160,23,0.05)",
                    border: "1px solid rgba(212,160,23,0.15)",
                    backdropFilter: "blur(16px)",
                    minWidth: "130px",
                    textAlign: "center",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      "rgba(212,160,23,0.12)";
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "rgba(212,160,23,0.35)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 0 20px rgba(212,160,23,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      "rgba(212,160,23,0.05)";
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "rgba(212,160,23,0.15)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "none";
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full mb-3"
                    style={{
                      background: "#d4a017",
                      boxShadow: "0 0 10px rgba(212,160,23,0.6)",
                      animation: "node-pulse 2s ease-in-out infinite",
                      animationDelay: `${i * 0.35}s`,
                    }}
                  />
                  <span
                    className="font-mono-geist text-[9px] tracking-wider"
                    style={{ color: "rgba(212,160,23,0.8)" }}
                  >
                    {step}
                  </span>
                </div>
                {/* Arrow connector — last one loops back */}
                <div
                  className="flex-shrink-0 flex flex-col items-center"
                  style={{ width: "40px" }}
                >
                  {i < FEEDBACK_LOOP.length - 1 ? (
                    <div className="w-full flex items-center justify-center gap-1">
                      <div
                        className="flex-1 h-px"
                        style={{ background: "rgba(212,160,23,0.3)" }}
                      />
                      <span
                        className="font-mono-geist text-[8px]"
                        style={{ color: "rgba(212,160,23,0.5)" }}
                      >
                        →
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span
                        className="font-mono-geist text-[8px]"
                        style={{ color: "rgba(212,160,23,0.4)" }}
                      >
                        ↺
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Legal Footer ──────────────────────────────────── */}
      <footer
        className="px-6 py-12 text-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p
          className="font-mono-geist text-[10px] tracking-wider"
          style={{
            color: "rgba(255,255,255,0.25)",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: 1.8,
          }}
        >
          {LEGAL_NOTE}
        </p>
      </footer>
    </div>
  );
}
