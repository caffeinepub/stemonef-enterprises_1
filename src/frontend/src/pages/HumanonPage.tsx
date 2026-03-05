import { useEffect, useRef, useState } from "react";

interface HumanonPageProps {
  onBack: () => void;
}

const LEGAL_NOTE =
  "EPOCHS™, HUMANON™, STEAMI™ and all associated initiatives operate under the parent institution THE STEMONEF™ ENTERPRISES.";

const VALUE_PROPS = [
  {
    label: "Scale of Operation",
    glyph: "⬡",
    description:
      "A global network spanning multiple continents, reaching thousands of learners and researchers simultaneously.",
  },
  {
    label: "Research Focus",
    glyph: "◈",
    description:
      "Every engagement is anchored in real research problems — not simulations or hypothetical scenarios.",
  },
  {
    label: "Industry Integration",
    glyph: "◇",
    description:
      "Deep partnerships with leading organizations provide authentic industry exposure and live problem-solving.",
  },
  {
    label: "Problem-Oriented Learning",
    glyph: "◆",
    description:
      "Participants work on unsolved challenges from day one, building judgment through genuine uncertainty.",
  },
  {
    label: "Career Security",
    glyph: "◎",
    description:
      "Structured pathways ensure each participant exits with verifiable credentials and direct career opportunities.",
  },
];

const PARTICIPANTS = [
  "STEM students",
  "Graduate researchers",
  "Early-career scientists",
  "Career switchers",
  "Global scholars",
];

const FLOW_STEPS = [
  { label: "Industry Problem", color: "#d4a017" },
  { label: "Research Team", color: "#4a7ef7" },
  { label: "Mentorship", color: "#22d3b0" },
  { label: "Solution Development", color: "#a78bfa" },
  { label: "Career Opportunities", color: "#34d399" },
];

const METRICS = [
  { label: "Career Placement Rate", value: 87, color: "#d4a017" },
  { label: "Research Output", value: 72, color: "#4a7ef7" },
  { label: "Partner Satisfaction", value: 94, color: "#22d3b0" },
  { label: "Skill Development", value: 91, color: "#a78bfa" },
  { label: "Network Expansion", value: 78, color: "#34d399" },
];

function MetricBar({
  label,
  value,
  color,
  index,
}: {
  label: string;
  value: number;
  color: string;
  index: number;
}) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimated(true), index * 100);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between">
        <span
          className="font-mono-geist text-xs tracking-[0.1em] uppercase"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          {label}
        </span>
        <span className="font-mono-geist text-sm font-bold" style={{ color }}>
          {value}%
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: animated ? `${value}%` : "0%",
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 8px ${color}44`,
          }}
        />
      </div>
    </div>
  );
}

export default function HumanonPage({ onBack }: HumanonPageProps) {
  const [activeStep, setActiveStep] = useState(0);

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
    const els = document.querySelectorAll(".humanon-reveal");
    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % FLOW_STEPS.length);
    }, 1800);
    return () => clearInterval(interval);
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
          data-ocid="humanon.back.button"
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
          style={{ color: "rgba(34,211,176,0.7)" }}
        >
          HUMANON™
        </div>
      </div>

      {/* Hero */}
      <section
        className="relative min-h-[80vh] flex items-center px-6 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, rgba(8,28,36,0.9) 0%, rgba(4,5,14,1) 60%)",
        }}
      >
        <div
          className="neural-grid-bg absolute inset-0 opacity-20"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full pt-16 pb-20">
          <div
            className="font-mono-geist text-xs tracking-[0.4em] uppercase mb-6 animate-fade-in-up"
            style={{ color: "rgba(34,211,176,0.7)" }}
          >
            ◇ TALENT &amp; FIELD INCUBATION INITIATIVE
          </div>

          <h1
            className="font-display font-light mb-6 animate-fade-in-up"
            style={{
              fontSize: "clamp(3.5rem, 11vw, 8rem)",
              letterSpacing: "0.1em",
              lineHeight: 0.9,
              background:
                "linear-gradient(135deg, #22d3b0 0%, #8ab4ff 50%, #ffffff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animationDelay: "0.1s",
            }}
          >
            HUMANON™
          </h1>

          <p
            className="font-display text-2xl md:text-3xl font-light mb-6 animate-fade-in-up"
            style={{
              color: "rgba(255,255,255,0.65)",
              letterSpacing: "0.05em",
              maxWidth: "600px",
              animationDelay: "0.2s",
            }}
          >
            Connecting Potential to Purpose.
          </p>

          <p
            className="animate-fade-in-up text-base leading-relaxed max-w-xl"
            style={{
              color: "rgba(255,255,255,0.45)",
              fontFamily: "Sora, sans-serif",
              animationDelay: "0.3s",
            }}
          >
            Create the world's most comprehensive talent incubation ecosystem
            linking learners, researchers, and industry.
          </p>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent, var(--neural-bg))",
          }}
        />
      </section>

      {/* Value Proposition */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 humanon-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ VALUE PROPOSITION
            </div>
            <h2
              className="font-display text-4xl font-light"
              style={{
                letterSpacing: "0.08em",
                background: "linear-gradient(135deg, #22d3b0, #ffffff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Why HUMANON
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {VALUE_PROPS.map((vp, i) => (
              <div
                key={vp.label}
                data-ocid={`humanon.value.card.${i + 1}`}
                className="glass-strong p-6 rounded-sm group transition-all duration-300 humanon-reveal reveal"
                style={{
                  borderTop: "2px solid rgba(34,211,176,0.3)",
                  transitionDelay: `${i * 0.08}s`,
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderTopColor = "rgba(34,211,176,0.7)";
                  el.style.boxShadow =
                    "0 0 20px rgba(34,211,176,0.08), 0 8px 32px rgba(0,0,0,0.4)";
                  el.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderTopColor = "rgba(34,211,176,0.3)";
                  el.style.boxShadow = "none";
                  el.style.transform = "none";
                }}
              >
                <div
                  className="text-2xl mb-4"
                  style={{ color: "rgba(34,211,176,0.5)" }}
                  aria-hidden="true"
                >
                  {vp.glyph}
                </div>
                <div
                  className="font-mono-geist text-[10px] tracking-[0.2em] uppercase mb-3"
                  style={{ color: "rgba(34,211,176,0.8)" }}
                >
                  {vp.label}
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "Sora, sans-serif",
                  }}
                >
                  {vp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Structure */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 humanon-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◈ PROGRAM STRUCTURE
            </div>
            <h2
              className="font-display text-4xl font-light"
              style={{
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              WHO WE SERVE
            </h2>
          </div>

          <div className="space-y-3">
            {PARTICIPANTS.map((p, i) => (
              <div
                key={p}
                data-ocid={`humanon.participant.item.${i + 1}`}
                className="humanon-reveal reveal flex items-center gap-5 px-6 py-4 rounded-sm group transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  transitionDelay: `${i * 0.08}s`,
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "rgba(34,211,176,0.06)";
                  el.style.borderColor = "rgba(34,211,176,0.25)";
                  el.style.boxShadow = "0 0 15px rgba(34,211,176,0.06)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "rgba(255,255,255,0.03)";
                  el.style.borderColor = "rgba(255,255,255,0.06)";
                  el.style.boxShadow = "none";
                }}
              >
                <div
                  className="font-mono-geist text-xs"
                  style={{
                    color: "rgba(34,211,176,0.6)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div
                  className="h-px flex-1"
                  style={{ background: "rgba(34,211,176,0.1)" }}
                />
                <div
                  className="font-display text-lg font-light tracking-widest uppercase"
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    letterSpacing: "0.15em",
                  }}
                >
                  {p}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Partnership Model */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 humanon-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ INDUSTRY PARTNERSHIP MODEL
            </div>
            <h2
              className="font-display text-4xl font-light"
              style={{
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              The Pipeline
            </h2>
          </div>

          <div
            className="flex flex-col items-center gap-0 humanon-reveal reveal"
            style={{ transitionDelay: "0.1s" }}
          >
            {FLOW_STEPS.map((step, i) => (
              <div
                key={step.label}
                className="flex flex-col items-center w-full max-w-sm"
              >
                <div
                  className="w-full px-8 py-5 rounded-sm text-center transition-all duration-500"
                  style={{
                    background:
                      activeStep === i
                        ? `rgba(${step.color === "#d4a017" ? "212,160,23" : step.color === "#4a7ef7" ? "74,126,247" : step.color === "#22d3b0" ? "34,211,176" : step.color === "#a78bfa" ? "167,139,250" : "52,211,153"},0.12)`
                        : "rgba(255,255,255,0.03)",
                    border:
                      activeStep === i
                        ? `1px solid ${step.color}55`
                        : "1px solid rgba(255,255,255,0.06)",
                    boxShadow:
                      activeStep === i ? `0 0 20px ${step.color}22` : "none",
                    transform: activeStep === i ? "scale(1.02)" : "scale(1)",
                  }}
                >
                  <div
                    className="font-mono-geist text-[9px] tracking-[0.2em] uppercase mb-1"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    STEP {String(i + 1).padStart(2, "0")}
                  </div>
                  <div
                    className="font-display text-lg font-light tracking-widest uppercase"
                    style={{
                      color:
                        activeStep === i
                          ? step.color
                          : "rgba(255,255,255,0.55)",
                      letterSpacing: "0.12em",
                      transition: "color 0.5s ease",
                    }}
                  >
                    {step.label}
                  </div>
                </div>
                {i < FLOW_STEPS.length - 1 && (
                  <div className="flex flex-col items-center py-2">
                    <div
                      className="w-px h-6 transition-all duration-300"
                      style={{
                        background:
                          activeStep === i
                            ? `linear-gradient(to bottom, ${step.color}, ${FLOW_STEPS[i + 1].color})`
                            : "rgba(255,255,255,0.1)",
                      }}
                    />
                    <div
                      className="font-mono-geist text-xs"
                      style={{ color: "rgba(255,255,255,0.2)" }}
                    >
                      ↓
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 humanon-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◈ SUCCESS METRICS
            </div>
            <h2
              className="font-display text-4xl font-light"
              style={{
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Impact Dashboard
            </h2>
          </div>

          <div
            className="glass-strong p-10 rounded-sm humanon-reveal reveal space-y-8"
            style={{ transitionDelay: "0.1s" }}
          >
            {METRICS.map((m, i) => (
              <MetricBar
                key={m.label}
                label={m.label}
                value={m.value}
                color={m.color}
                index={i}
              />
            ))}
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
