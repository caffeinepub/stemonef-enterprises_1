import { useEffect, useRef } from "react";

interface HumanonPageProps {
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

const VALUE_PROPS = [
  {
    icon: "◎",
    title: "Scale of Operation",
    desc: "A global ecosystem spanning multiple continents, connecting diverse talent to mission-critical research opportunities.",
  },
  {
    icon: "◈",
    title: "Research Focus",
    desc: "Every participant engages in real, structured research — not simulations or case studies.",
  },
  {
    icon: "⬡",
    title: "Industry Integration",
    desc: "Deeply embedded partnerships with industry leaders who co-design the research problems.",
  },
  {
    icon: "◆",
    title: "Problem-Oriented Learning",
    desc: "Participants solve actual institutional and societal problems under expert guidance.",
  },
  {
    icon: "◇",
    title: "Career Security",
    desc: "Structured pathways that translate research experience into verified career opportunities.",
  },
];

const FLOW_STEPS = [
  "Industry Problem",
  "Research Team",
  "Mentorship",
  "Solution Development",
  "Career Opportunities",
];

const METRICS = [
  { label: "Career Placement Rate", value: "94%", ring: 94 },
  { label: "Research Output", value: "2.4×", ring: 80 },
  { label: "Partner Satisfaction", value: "97%", ring: 97 },
  { label: "Skill Development", value: "98%", ring: 98 },
  { label: "Network Expansion", value: "68%", ring: 68 },
];

export default function HumanonPage({ onBack }: HumanonPageProps) {
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
          data-ocid="humanon.button"
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
          ◇ HUMANON™ — TALENT PILLAR
        </div>
      </nav>

      {/* ─── Hero Section ───────────────────────────────────── */}
      <section
        data-ocid="humanon.section"
        className="relative flex flex-col items-center justify-center text-center px-6"
        style={{ minHeight: "82vh", paddingTop: "6rem", paddingBottom: "6rem" }}
      >
        {/* Animated background: flowing connection lines */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <svg
            role="img"
            aria-label="Decorative talent connection flow background"
            className="absolute inset-0 w-full h-full"
            style={{ opacity: 0.15 }}
          >
            <defs>
              <linearGradient
                id="humanonHeroFlow1"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#4a7ef7" stopOpacity="0" />
                <stop offset="50%" stopColor="#4a7ef7" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#22d3b0" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3, 4].map((i) => (
              <path
                key={`flow-${i}`}
                d={`M ${-100 + i * 250} 0 Q ${100 + i * 200} 400 ${200 + i * 150} 800`}
                fill="none"
                stroke="url(#humanonHeroFlow1)"
                strokeWidth="1"
                className="animate-breathing"
                style={{ animationDelay: `${i * 0.4}s` }}
              />
            ))}
            {/* Scatter nodes */}
            {[
              [10, 15],
              [25, 65],
              [45, 30],
              [60, 75],
              [80, 20],
              [70, 55],
              [35, 85],
            ].map(([cx, cy]) => (
              <circle
                key={`hnode-${cx}-${cy}`}
                cx={`${cx}%`}
                cy={`${cy}%`}
                r="2.5"
                fill="#4a7ef7"
                opacity="0.5"
                className="animate-breathing"
              />
            ))}
          </svg>
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 65% 55% at 50% 40%, rgba(74,126,247,0.06), transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div
            className="font-mono-geist text-xs tracking-[0.45em] uppercase mb-6 reveal"
            style={{ color: "rgba(212,160,23,0.7)" }}
          >
            ◆ TALENT & FIELD INCUBATION INITIATIVE
          </div>
          <h1
            className="font-display font-light mb-4 reveal reveal-delay-1 text-gradient-hero"
            style={{
              fontSize: "clamp(3rem, 9vw, 6.5rem)",
              letterSpacing: "0.15em",
              lineHeight: 1,
            }}
          >
            HUMANON™
          </h1>
          <p
            className="font-display font-light text-2xl mb-5 reveal reveal-delay-2"
            style={{ color: "#d4a017", letterSpacing: "0.06em" }}
          >
            Connecting Potential to Purpose.
          </p>
          <p
            className="text-sm reveal reveal-delay-3"
            style={{
              color: "rgba(255,255,255,0.38)",
              fontFamily: "Sora, sans-serif",
              maxWidth: "500px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Create the world's most comprehensive talent incubation ecosystem
            linking learners, researchers, and industry.
          </p>
        </div>
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

      {/* ─── Value Proposition ─────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-10 reveal">
          <div
            className="font-mono-geist text-[10px] tracking-[0.45em] uppercase mb-3"
            style={{ color: "rgba(74,126,247,0.7)" }}
          >
            ◈ VALUE PROPOSITION
          </div>
          <h2
            className="font-display text-3xl font-light text-gradient-hero"
            style={{ letterSpacing: "0.12em" }}
          >
            Why HUMANON
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {VALUE_PROPS.map((vp, i) => (
            <div
              key={vp.title}
              data-ocid={`humanon.card.${i + 1}`}
              className="p-6 rounded-sm reveal transition-all duration-300"
              style={{
                background:
                  "radial-gradient(ellipse at top left, rgba(74,126,247,0.07), rgba(4,5,14,0.8))",
                border: "1px solid rgba(74,126,247,0.12)",
                backdropFilter: "blur(16px)",
                transitionDelay: `${i * 0.06}s`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background =
                  "radial-gradient(ellipse at top left, rgba(74,126,247,0.14), rgba(4,5,14,0.88))";
                el.style.borderColor = "rgba(74,126,247,0.3)";
                el.style.transform = "translateY(-5px)";
                el.style.boxShadow = "0 12px 32px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background =
                  "radial-gradient(ellipse at top left, rgba(74,126,247,0.07), rgba(4,5,14,0.8))";
                el.style.borderColor = "rgba(74,126,247,0.12)";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
              }}
            >
              <div className="text-2xl mb-4" style={{ color: "#4a7ef7" }}>
                {vp.icon}
              </div>
              <h3
                className="font-mono-geist text-xs tracking-wider mb-3"
                style={{
                  color: "rgba(255,255,255,0.75)",
                  letterSpacing: "0.1em",
                }}
              >
                {vp.title}
              </h3>
              <p
                className="text-xs leading-relaxed"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                {vp.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Program Structure ─────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10 reveal">
          <div
            className="font-mono-geist text-[10px] tracking-[0.45em] uppercase mb-3"
            style={{ color: "rgba(212,160,23,0.7)" }}
          >
            ◈ PROGRAM PARTICIPANTS
          </div>
          <h2
            className="font-display text-3xl font-light text-gradient-hero"
            style={{ letterSpacing: "0.12em" }}
          >
            Who We Serve
          </h2>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            "STEM Students",
            "Graduate Researchers",
            "Early-Career Scientists",
            "Career Switchers",
            "Global Scholars",
          ].map((participant, i) => (
            <span
              key={participant}
              className="reveal px-5 py-2.5 rounded-sm font-mono-geist text-xs tracking-wider transition-all duration-200"
              style={{
                background: "rgba(212,160,23,0.06)",
                border: "1px solid rgba(212,160,23,0.2)",
                color: "rgba(212,160,23,0.8)",
                transitionDelay: `${i * 0.07}s`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLSpanElement).style.background =
                  "rgba(212,160,23,0.14)";
                (e.currentTarget as HTMLSpanElement).style.borderColor =
                  "rgba(212,160,23,0.45)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLSpanElement).style.background =
                  "rgba(212,160,23,0.06)";
                (e.currentTarget as HTMLSpanElement).style.borderColor =
                  "rgba(212,160,23,0.2)";
              }}
            >
              {participant}
            </span>
          ))}
        </div>
      </section>

      {/* ─── Industry Partnership Flow ──────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-10 reveal">
          <div
            className="font-mono-geist text-[10px] tracking-[0.45em] uppercase mb-3"
            style={{ color: "rgba(74,126,247,0.7)" }}
          >
            ◈ INDUSTRY PARTNERSHIP MODEL
          </div>
          <h2
            className="font-display text-3xl font-light text-gradient-hero"
            style={{ letterSpacing: "0.12em" }}
          >
            From Problem to Career
          </h2>
        </div>

        <div className="flex flex-col gap-0 reveal">
          {FLOW_STEPS.map((step, i) => (
            <div key={step} className="flex flex-col items-center">
              <div
                data-ocid={`humanon.card.${i + 1}`}
                className="w-full max-w-sm mx-auto p-5 rounded-sm transition-all duration-300"
                style={{
                  background: "rgba(74,126,247,0.05)",
                  border: "1px solid rgba(74,126,247,0.14)",
                  backdropFilter: "blur(16px)",
                  animation: "fade-in-up 0.6s ease forwards",
                  animationDelay: `${i * 0.12}s`,
                  opacity: 0,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "rgba(74,126,247,0.12)";
                  el.style.borderColor = "rgba(74,126,247,0.3)";
                  el.style.boxShadow = "0 0 20px rgba(74,126,247,0.15)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "rgba(74,126,247,0.05)";
                  el.style.borderColor = "rgba(74,126,247,0.14)";
                  el.style.boxShadow = "none";
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-mono-geist text-[9px]"
                    style={{
                      background: "rgba(74,126,247,0.15)",
                      border: "1px solid rgba(74,126,247,0.4)",
                      color: "#4a7ef7",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <span
                    className="font-mono-geist text-xs tracking-wider"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {step}
                  </span>
                </div>
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <div className="flex flex-col items-center py-1">
                  <div
                    className="w-px h-6"
                    style={{ background: "rgba(74,126,247,0.3)" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "#4a7ef7",
                      boxShadow: "0 0 8px rgba(74,126,247,0.6)",
                      animation: "node-pulse 2s ease-in-out infinite",
                      animationDelay: `${i * 0.4}s`,
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

      {/* ─── Success Metrics ────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10 reveal">
          <div
            className="font-mono-geist text-[10px] tracking-[0.45em] uppercase mb-3"
            style={{ color: "rgba(212,160,23,0.7)" }}
          >
            ◈ SUCCESS METRICS
          </div>
          <h2
            className="font-display text-3xl font-light text-gradient-hero"
            style={{ letterSpacing: "0.12em" }}
          >
            Impact Dashboard
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {METRICS.map((metric, i) => {
            const circumference = 2 * Math.PI * 28;
            const dashOffset = circumference * (1 - metric.ring / 100);
            return (
              <div
                key={metric.label}
                data-ocid={`humanon.card.${i + 1}`}
                className="reveal p-5 rounded-sm flex flex-col items-center text-center transition-all duration-300"
                style={{
                  background: "rgba(4,5,14,0.6)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  backdropFilter: "blur(16px)",
                  transitionDelay: `${i * 0.08}s`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "rgba(74,126,247,0.3)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 8px 24px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                {/* Circular ring */}
                <svg
                  role="img"
                  aria-label={`${metric.label} progress indicator`}
                  width="72"
                  height="72"
                  viewBox="0 0 72 72"
                  className="mb-3"
                >
                  <circle
                    cx="36"
                    cy="36"
                    r="28"
                    fill="none"
                    stroke="rgba(74,126,247,0.1)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="36"
                    cy="36"
                    r="28"
                    fill="none"
                    stroke="#4a7ef7"
                    strokeWidth="3"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    transform="rotate(-90 36 36)"
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                  />
                  <text
                    x="36"
                    y="40"
                    textAnchor="middle"
                    fill="#d4a017"
                    fontSize="11"
                    fontFamily="Geist Mono, monospace"
                    fontWeight="600"
                  >
                    {metric.value}
                  </text>
                </svg>
                <span
                  className="font-mono-geist text-[9px] tracking-wider"
                  style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}
                >
                  {metric.label}
                </span>
              </div>
            );
          })}
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
