import { useEffect, useRef, useState } from "react";

const STAGES = [
  {
    step: "01",
    title: "Learner",
    description:
      "Entry into the HUMANON ecosystem through structured learning programs, mentorship networks, and foundational field training.",
    icon: "◇",
    color: "rgba(74,126,247,0.8)",
    glow: "rgba(74,126,247,0.2)",
  },
  {
    step: "02",
    title: "Research",
    description:
      "Transition into active research roles within EPOCHS-led projects, contributing to live inquiry cycles and knowledge synthesis.",
    icon: "◈",
    color: "rgba(167,139,250,0.8)",
    glow: "rgba(167,139,250,0.2)",
  },
  {
    step: "03",
    title: "Industry",
    description:
      "Deployment into strategic institutional partnerships, deep technology ventures, and cross-sector implementation roles.",
    icon: "⬡",
    color: "rgba(34,211,176,0.8)",
    glow: "rgba(34,211,176,0.2)",
  },
  {
    step: "04",
    title: "Impact",
    description:
      "Full field deployment — leading initiatives, mentoring new cohorts, and contributing measurable outcomes to STEMONEF's global mission.",
    icon: "◆",
    color: "rgba(212,160,23,0.8)",
    glow: "rgba(212,160,23,0.25)",
  },
];

export default function HumanonSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [sectionVisible, setSectionVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSectionVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -30px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-ocid="humanon.section"
      id="humanon"
      className="relative py-28 px-6"
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% 100%, rgba(74,126,247,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div
            className="font-mono-geist text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: "rgba(212,160,23,0.7)" }}
          >
            ◆ TALENT ARCHITECTURE
          </div>
          <h2
            className="font-display text-4xl md:text-5xl font-light text-gradient-hero mb-4"
            style={{ letterSpacing: "0.08em" }}
          >
            HUMANON — Talent Pipeline
          </h2>
          <p
            className="max-w-xl text-sm leading-relaxed"
            style={{
              color: "rgba(255,255,255,0.4)",
              fontFamily: "Sora, sans-serif",
            }}
          >
            A structured four-stage progression from knowledge acquisition to
            measurable global impact — the human capital engine of STEMONEF.
          </p>
        </div>

        {/* Pipeline visualization */}
        <div className="relative" style={{ overflow: "visible" }}>
          {/* Connection line */}
          <div
            className="absolute top-12 left-[12.5%] right-[12.5%] h-px hidden md:block"
            style={{ zIndex: 0 }}
          >
            <div className="progress-flow-line w-full h-full" />
          </div>

          {/* Stages */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-[1]"
            style={{ overflow: "visible" }}
          >
            {STAGES.map((stage, i) => (
              <div
                key={stage.step}
                data-ocid={`humanon.item.${i + 1}`}
                className="flex flex-col items-center text-center group"
                style={{
                  minHeight: "200px",
                  opacity: sectionVisible ? 1 : 0,
                  transform: sectionVisible
                    ? "translateY(0)"
                    : "translateY(30px)",
                  transition: `opacity 600ms ease ${i * 120}ms, transform 600ms ease ${i * 120}ms`,
                }}
              >
                {/* Node */}
                <div
                  className="relative mb-6 transition-all duration-300"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "rgba(4,5,14,0.95)",
                    border: `1px solid ${stage.color.replace("0.8", "0.4")}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 0 20px ${stage.glow}`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      `0 0 40px ${stage.glow.replace("0.2", "0.4")}`;
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      stage.color;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      `0 0 20px ${stage.glow}`;
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      stage.color.replace("0.8", "0.4");
                  }}
                >
                  {/* Outer ring */}
                  <div
                    className="absolute inset-0 rounded-full animate-breathing"
                    style={{
                      border: `1px solid ${stage.color.replace("0.8", "0.15")}`,
                      borderRadius: "50%",
                      transform: "scale(1.15)",
                    }}
                  />

                  <span className="text-xl" style={{ color: stage.color }}>
                    {stage.icon}
                  </span>
                </div>

                {/* Step number */}
                <div
                  className="font-mono-geist text-[9px] tracking-[0.35em] uppercase mb-2"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  STAGE {stage.step}
                </div>

                {/* Title */}
                <h3
                  className="font-display text-xl font-light mb-3"
                  style={{
                    letterSpacing: "0.12em",
                    color: stage.color,
                  }}
                >
                  {stage.title}
                </h3>

                {/* Description */}
                <p
                  className="text-xs leading-relaxed"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontFamily: "Sora, sans-serif",
                    maxWidth: "180px",
                  }}
                >
                  {stage.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "2px",
            padding: "24px",
          }}
        >
          {[
            { value: "30+", label: "Active Fellows" },
            { value: "6+", label: "Countries" },
            { value: "2+", label: "Cohorts Deployed" },
            { value: "30", label: "Target Countries 2027" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div
                className="font-display text-2xl md:text-3xl font-light text-gradient-gold mb-1"
                style={{ letterSpacing: "0.05em" }}
              >
                {value}
              </div>
              <div
                className="font-mono-geist text-[9px] tracking-[0.3em] uppercase"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
