import { useEffect, useRef } from "react";

interface EpochsPageProps {
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

export default function EpochsPage({ onBack }: EpochsPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useRevealObserver(containerRef);

  // Scroll to top on mount
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
          data-ocid="epochs.button"
          onClick={onBack}
          className="flex items-center gap-3 group transition-all duration-200"
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
          ◈ EPOCHS — R&D PILLAR
        </div>
      </nav>

      {/* ─── Hero Section ───────────────────────────────────── */}
      <section
        data-ocid="epochs.section"
        className="relative flex flex-col items-center justify-center text-center px-6"
        style={{ minHeight: "82vh", paddingTop: "6rem", paddingBottom: "6rem" }}
      >
        {/* Animated background: climate network SVG */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <svg
            role="img"
            aria-label="Decorative climate network background"
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: 0.18 }}
          >
            <defs>
              <radialGradient id="epochsHeroGrad" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#4a7ef7" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#04050e" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#epochsHeroGrad)" />
            {/* Network nodes */}
            {[
              [15, 20],
              [30, 70],
              [50, 35],
              [70, 80],
              [85, 25],
              [20, 55],
              [65, 15],
              [40, 90],
              [80, 60],
            ].map(([cx, cy]) => (
              <g key={`node-${cx}-${cy}`}>
                <circle
                  cx={`${cx}%`}
                  cy={`${cy}%`}
                  r="3"
                  fill="#4a7ef7"
                  opacity="0.6"
                  className="animate-node-pulse"
                />
              </g>
            ))}
            {/* Connection lines */}
            <line
              x1="15%"
              y1="20%"
              x2="50%"
              y2="35%"
              stroke="#4a7ef7"
              strokeWidth="0.5"
              strokeDasharray="4 6"
              opacity="0.4"
              className="animate-breathing"
            />
            <line
              x1="50%"
              y1="35%"
              x2="85%"
              y2="25%"
              stroke="#4a7ef7"
              strokeWidth="0.5"
              strokeDasharray="4 6"
              opacity="0.4"
              className="animate-breathing"
            />
            <line
              x1="50%"
              y1="35%"
              x2="70%"
              y2="80%"
              stroke="#22d3b0"
              strokeWidth="0.5"
              strokeDasharray="4 6"
              opacity="0.3"
              className="animate-breathing"
            />
            <line
              x1="30%"
              y1="70%"
              x2="50%"
              y2="35%"
              stroke="#4a7ef7"
              strokeWidth="0.5"
              strokeDasharray="4 6"
              opacity="0.3"
              className="animate-breathing"
            />
            <line
              x1="20%"
              y1="55%"
              x2="30%"
              y2="70%"
              stroke="#22d3b0"
              strokeWidth="0.5"
              strokeDasharray="4 6"
              opacity="0.3"
              className="animate-breathing"
            />
          </svg>
          {/* Gradient mesh overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(74,126,247,0.07) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div
            className="font-mono-geist text-xs tracking-[0.45em] uppercase mb-6 reveal"
            style={{ color: "rgba(212,160,23,0.7)" }}
          >
            ◆ RESEARCH & INNOVATION ORGANIZATION
          </div>
          <h1
            className="font-display font-light mb-5 reveal reveal-delay-1 text-gradient-hero"
            style={{
              fontSize: "clamp(3.5rem, 10vw, 7rem)",
              letterSpacing: "0.18em",
              lineHeight: 1,
            }}
          >
            EPOCHS
          </h1>
          <p
            className="font-display font-light mb-4 reveal reveal-delay-2"
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.08em",
            }}
          >
            Emergent Projects ON Climate, Human & Systems Research
          </p>
          <p
            className="text-sm reveal reveal-delay-3"
            style={{
              color: "rgba(255,255,255,0.35)",
              fontFamily: "Sora, sans-serif",
              maxWidth: "480px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Primary Research & Innovation Organization of STEMONEF Enterprises.
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-chevron-bounce"
          aria-hidden="true"
        >
          <div
            className="w-px h-10 mx-auto"
            style={{
              background:
                "linear-gradient(to bottom, rgba(74,126,247,0.5), transparent)",
            }}
          />
        </div>
      </section>

      {/* ─── Mission Section ───────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div
          className="reveal"
          style={{
            borderLeft: "3px solid #d4a017",
            paddingLeft: "2rem",
            paddingTop: "1.5rem",
            paddingBottom: "1.5rem",
            background: "rgba(212,160,23,0.03)",
            borderRadius: "0 4px 4px 0",
          }}
        >
          <div
            className="font-mono-geist text-[10px] tracking-[0.45em] uppercase mb-4"
            style={{ color: "rgba(212,160,23,0.65)" }}
          >
            ◆ MISSION STATEMENT
          </div>
          <p
            className="text-base leading-relaxed"
            style={{
              color: "rgba(255,255,255,0.7)",
              fontFamily: "Sora, sans-serif",
              maxWidth: "680px",
            }}
          >
            Conduct research across climate, technology, and medical domains
            while maintaining the highest ethical standards and translating
            discoveries into practical societal solutions.
          </p>
        </div>
      </section>

      {/* ─── Project GAIA ──────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-10 reveal">
          <div
            className="font-mono-geist text-[10px] tracking-[0.45em] uppercase mb-3"
            style={{ color: "rgba(74,126,247,0.7)" }}
          >
            ◈ PROJECT GAIA — Climate & Sustainability Research
          </div>
          <h2
            className="font-display text-3xl font-light text-gradient-hero"
            style={{ letterSpacing: "0.12em" }}
          >
            Climate & Planetary Systems
          </h2>
        </div>

        {/* Animated lab nodes diagram */}
        <div className="mb-10 reveal">
          <svg
            role="img"
            aria-label="GAIA project node network"
            width="100%"
            height="80"
            viewBox="0 0 800 80"
            preserveAspectRatio="xMidYMid meet"
            style={{ overflow: "visible" }}
          >
            {[0, 1, 2, 3, 4].map((i) => {
              const x = 80 + i * 160;
              return (
                <g key={`gaia-node-${i}`}>
                  <line
                    x1={x}
                    y1="40"
                    x2={x + 130}
                    y2="40"
                    stroke="rgba(34,211,176,0.25)"
                    strokeWidth="1"
                    strokeDasharray="6 4"
                  />
                  <circle
                    cx={x}
                    cy="40"
                    r="10"
                    fill="rgba(34,211,176,0.1)"
                    stroke="#22d3b0"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={x}
                    cy="40"
                    r="4"
                    fill="#22d3b0"
                    style={{
                      animation: `node-pulse ${2.2 + i * 0.2}s ease-in-out infinite`,
                      animationDelay: `${i * 0.3}s`,
                    }}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {[
            "Climate modeling and prediction",
            "Sustainable healthcare",
            "Environmental impact assessment",
            "Carbon capture systems",
            "Renewable energy integration",
          ].map((area, i) => (
            <div
              key={area}
              data-ocid={`epochs.card.${i + 1}`}
              className="p-5 rounded-sm reveal group transition-all duration-300"
              style={
                {
                  animationDelay: `${i * 0.08}s`,
                  background:
                    "radial-gradient(ellipse at top, rgba(34,211,176,0.06), rgba(4,5,14,0.8))",
                  border: "1px solid rgba(34,211,176,0.12)",
                  backdropFilter: "blur(16px)",
                  cursor: "default",
                  "--delay": `${i * 0.08}s`,
                } as React.CSSProperties
              }
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background =
                  "radial-gradient(ellipse at top, rgba(34,211,176,0.14), rgba(4,5,14,0.85))";
                el.style.borderColor = "rgba(34,211,176,0.3)";
                el.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background =
                  "radial-gradient(ellipse at top, rgba(34,211,176,0.06), rgba(4,5,14,0.8))";
                el.style.borderColor = "rgba(34,211,176,0.12)";
                el.style.transform = "translateY(0)";
              }}
            >
              <div
                className="w-2 h-2 rounded-full mb-3"
                style={{
                  background: "#22d3b0",
                  boxShadow: "0 0 8px rgba(34,211,176,0.5)",
                  animation: "node-pulse 2s ease-in-out infinite",
                  animationDelay: `${i * 0.3}s`,
                }}
              />
              <p
                className="text-xs leading-relaxed"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                {area}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Labs Section ──────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10 reveal">
          <div
            className="font-mono-geist text-[10px] tracking-[0.45em] uppercase mb-3"
            style={{ color: "rgba(74,126,247,0.7)" }}
          >
            ◈ RESEARCH LABORATORIES
          </div>
          <h2
            className="font-display text-3xl font-light text-gradient-hero"
            style={{ letterSpacing: "0.12em" }}
          >
            Lab Infrastructure
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LAB INVOS */}
          <div
            data-ocid="epochs.lab.panel"
            className="p-8 rounded-sm reveal transition-all duration-300"
            style={{
              background: "rgba(74,126,247,0.04)",
              border: "1px solid rgba(74,126,247,0.15)",
              borderLeft: "3px solid #4a7ef7",
              backdropFilter: "blur(16px)",
            }}
          >
            <div
              className="font-mono-geist text-[9px] tracking-[0.45em] uppercase mb-2"
              style={{ color: "rgba(74,126,247,0.6)" }}
            >
              RESEARCH LABORATORY
            </div>
            <h3
              className="font-display text-2xl font-light mb-4"
              style={{ color: "rgba(255,255,255,0.9)", letterSpacing: "0.2em" }}
            >
              LAB INVOS
            </h3>
            <ul className="space-y-2">
              {[
                "Fundamental climate science",
                "Environmental monitoring systems",
                "Sustainability theory",
                "Data analysis methodologies",
                "Interdisciplinary climate research",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs"
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "Sora, sans-serif",
                  }}
                >
                  <span style={{ color: "#4a7ef7", flexShrink: 0 }}>›</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* LAB NEIA */}
          <div
            data-ocid="epochs.lab.panel"
            className="p-8 rounded-sm reveal reveal-delay-1 transition-all duration-300"
            style={{
              background: "rgba(74,126,247,0.04)",
              border: "1px solid rgba(74,126,247,0.15)",
              borderLeft: "3px solid #22d3b0",
              backdropFilter: "blur(16px)",
            }}
          >
            <div
              className="font-mono-geist text-[9px] tracking-[0.45em] uppercase mb-2"
              style={{ color: "rgba(34,211,176,0.6)" }}
            >
              DEVELOPMENT LABORATORY
            </div>
            <h3
              className="font-display text-2xl font-light mb-4"
              style={{ color: "rgba(255,255,255,0.9)", letterSpacing: "0.2em" }}
            >
              LAB NEIA
            </h3>
            <ul className="space-y-2">
              {[
                "Sustainable technology prototyping",
                "Climate solution testing",
                "Environmental intervention scaling",
                "Implementation partnerships",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs"
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "Sora, sans-serif",
                  }}
                >
                  <span style={{ color: "#22d3b0", flexShrink: 0 }}>›</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── Project EIOS ──────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-10 reveal">
          <div
            className="font-mono-geist text-[10px] tracking-[0.45em] uppercase mb-3"
            style={{ color: "rgba(74,126,247,0.7)" }}
          >
            ◈ PROJECT EIOS — Deep Technology & Intelligence Systems
          </div>
          <h2
            className="font-display text-3xl font-light text-gradient-hero"
            style={{ letterSpacing: "0.12em" }}
          >
            Technology Pipeline
          </h2>
        </div>

        {/* Horizontal pipeline diagram */}
        <div className="relative reveal mb-8" style={{ overflowX: "auto" }}>
          <div
            className="flex items-center gap-0 min-w-max mx-auto"
            style={{ padding: "2rem 0" }}
          >
            {[
              "Intelligence Platforms",
              "Operating Systems",
              "IoT Networks",
              "Analytics Infrastructure",
              "Sustainability Enterprise Systems",
            ].map((node, i) => (
              <div key={node} className="flex items-center">
                <div
                  data-ocid={`epochs.card.${i + 1}`}
                  className="flex flex-col items-center p-5 rounded-sm transition-all duration-300 group"
                  style={{
                    background: "rgba(74,126,247,0.06)",
                    border: "1px solid rgba(74,126,247,0.18)",
                    backdropFilter: "blur(16px)",
                    minWidth: "140px",
                    textAlign: "center",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      "rgba(74,126,247,0.14)";
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "rgba(74,126,247,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      "rgba(74,126,247,0.06)";
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "rgba(74,126,247,0.18)";
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full mb-3"
                    style={{
                      background: "#4a7ef7",
                      boxShadow: "0 0 10px rgba(74,126,247,0.6)",
                      animation: "node-pulse 2s ease-in-out infinite",
                      animationDelay: `${i * 0.25}s`,
                    }}
                  />
                  <span
                    className="font-mono-geist text-[9px] tracking-wider"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {node}
                  </span>
                </div>
                {i < 4 && (
                  <div className="flex-shrink-0 w-8 flex items-center justify-center">
                    <div
                      className="w-full h-px"
                      style={{
                        background: "rgba(74,126,247,0.3)",
                        backgroundImage:
                          "repeating-linear-gradient(90deg, #4a7ef7 0, #4a7ef7 4px, transparent 4px, transparent 8px)",
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Project STEMESA ───────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-8 reveal">
          <div
            className="font-mono-geist text-[10px] tracking-[0.45em] uppercase mb-3"
            style={{ color: "rgba(167,139,250,0.7)" }}
          >
            ◈ PROJECT STEMESA — Ethical AI Development
          </div>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <h2
              className="font-display text-3xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.12em" }}
            >
              Ethical AI Framework
            </h2>
            <span
              className="font-mono-geist text-[9px] tracking-[0.3em] uppercase px-3 py-1 rounded-sm"
              style={{
                color: "#d4a017",
                background: "rgba(212,160,23,0.1)",
                border: "1px solid rgba(212,160,23,0.3)",
              }}
            >
              CONCEPTUAL DEVELOPMENT STAGE
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 reveal">
          {[
            "Brain Research",
            "Cognitive Modeling",
            "Human-AI Interaction",
            "Healthcare AI",
            "Bias Mitigation",
            "Explainable AI Frameworks",
          ].map((topic, i) => (
            <div
              key={topic}
              className="px-4 py-3 rounded-sm text-center transition-all duration-200"
              style={{
                background: "rgba(167,139,250,0.05)",
                border: "1px solid rgba(167,139,250,0.15)",
                animationDelay: `${i * 0.06}s`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  "rgba(167,139,250,0.12)";
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "rgba(167,139,250,0.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  "rgba(167,139,250,0.05)";
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "rgba(167,139,250,0.15)";
              }}
            >
              <span
                className="font-mono-geist text-[10px] tracking-wider"
                style={{ color: "rgba(167,139,250,0.8)" }}
              >
                {topic}
              </span>
            </div>
          ))}
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
