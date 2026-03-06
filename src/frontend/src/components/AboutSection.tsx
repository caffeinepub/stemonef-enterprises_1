import { useEffect, useRef, useState } from "react";

interface AboutSectionProps {
  onScrollTo: (id: string) => void;
}

// ─── Animated count-up ────────────────────────────────────────────────────────
function AnimatedStat({
  end,
  label,
  suffix = "",
  delay = 0,
  trigger,
}: {
  end: number;
  label: string;
  suffix?: string;
  delay?: number;
  trigger: boolean;
}) {
  const [count, setCount] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!trigger || doneRef.current) return;
    doneRef.current = true;
    const timeout = setTimeout(() => {
      const duration = 1400;
      const start = performance.now();
      const step = (ts: number) => {
        const progress = Math.min((ts - start) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        setCount(Math.floor(eased * end));
        if (progress < 1) requestAnimationFrame(step);
        else setCount(end);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [trigger, end, delay]);

  return (
    <div className="text-center flex flex-col items-center gap-2">
      <div
        style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
          fontWeight: 300,
          letterSpacing: "0.04em",
          background:
            "linear-gradient(135deg, #d4a017 0%, #f7c948 50%, #d4a017 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          lineHeight: 1,
        }}
      >
        {count}
        {suffix}
      </div>
      <div
        style={{
          fontFamily: "Geist Mono, monospace",
          fontSize: "9px",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ─── Timeline item ─────────────────────────────────────────────────────────────
const MILESTONES = [
  {
    year: "2024",
    title: "Founded",
    description:
      "STEMONEF Enterprises established as a Social Science Enterprise with a mandate to integrate science, intelligence, and humanitarian action.",
  },
  {
    year: "2024",
    title: "Seven Pillars Activated",
    description:
      "EPOCHS, HUMANON, STEAMI, NOVA, TERRA, EQUIS, and E.L.P.I.S structural pillars brought into operational development.",
  },
  {
    year: "2025",
    title: "Intelligence Network Launched",
    description:
      "STEAMI Live Intelligence Feed and Signal Network goes live, aggregating real-time insights across policy, climate, AI, and research domains.",
  },
  {
    year: "2025",
    title: "Global Reach",
    description:
      "Initial institutional partnerships and participant programs spanning 2+ countries, with cohort structures entering preparation.",
  },
  {
    year: "2026",
    title: "Scaling Phase",
    description:
      "Program launches rolling out. Cohort frameworks, funding systems, and enterprise revenue architecture entering active development.",
  },
];

// ─── Mission / Vision / Values cards ─────────────────────────────────────────
const MVV_CARDS = [
  {
    icon: "◇",
    label: "MISSION",
    accentColor: "#d4a017",
    content:
      "To integrate research, intelligence synthesis, ethical oversight, talent development, and humanitarian action into a single coordinated institutional engine that generates measurable global impact.",
  },
  {
    icon: "◈",
    label: "VISION",
    accentColor: "#4a7ef7",
    content:
      "A world where science and technology are consistently translated into human benefit — where the gap between discovery and impact is systematically closed.",
  },
  {
    icon: "◆",
    label: "VALUES",
    accentColor: "#a78bfa",
    content: null,
    values: [
      "Scientific Integrity",
      "Ethical Governance",
      "Global Inclusion",
      "Long-Term Thinking",
      "Radical Transparency",
    ],
  },
];

export default function AboutSection({ onScrollTo }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [timelineVisible, setTimelineVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSectionVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const statsEl = statsRef.current;
    if (!statsEl) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setStatsVisible(true);
            setTimelineVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(statsEl);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      data-ocid="about.section"
      style={{
        position: "relative",
        background: "#04050e",
        overflow: "hidden",
        paddingTop: "clamp(64px, 10vw, 120px)",
        paddingBottom: "clamp(64px, 10vw, 120px)",
      }}
    >
      <style>{`
        @keyframes about-gradient-sweep {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes about-scan-line {
          0%   { top: -2px; opacity: 0; }
          5%   { opacity: 0.6; }
          95%  { opacity: 0.4; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes about-quote-breathe {
          0%, 100% { opacity: 0.06; }
          50%       { opacity: 0.11; }
        }
      `}</style>

      {/* Background glows */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 50% at 20% 30%, rgba(74,126,247,0.04) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 70%, rgba(212,160,23,0.04) 0%, transparent 60%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* Subtle neural grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(74,126,247,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,126,247,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          pointerEvents: "none",
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      <div
        className="relative"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 clamp(16px, 5vw, 64px)",
          zIndex: 1,
        }}
      >
        {/* ── A) Hero Statement Block ── */}
        <div
          style={{
            marginBottom: "clamp(56px, 8vw, 96px)",
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 700ms ease, transform 700ms ease",
          }}
        >
          {/* Animated top gradient rule */}
          <div
            style={{
              width: "100%",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, #d4a017, #4a7ef7, rgba(255,255,255,0.1), transparent)",
              marginBottom: "clamp(24px, 3vw, 40px)",
              backgroundSize: "200% 100%",
              animation: "about-gradient-sweep 4s linear infinite",
            }}
            aria-hidden="true"
          />

          {/* Eyebrow */}
          <div
            style={{
              fontFamily: "Geist Mono, monospace",
              fontSize: "10px",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "#d4a017",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span>◆</span>
            <span>ABOUT STEMONEF</span>
          </div>

          {/* Main heading */}
          <h2
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: "clamp(2.5rem, 7vw, 5rem)",
              fontWeight: 300,
              letterSpacing: "0.04em",
              lineHeight: 1.05,
              marginBottom: "clamp(16px, 2vw, 24px)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(74,126,247,0.8) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            We Are STEMONEF
          </h2>

          {/* Subheading */}
          <p
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.75,
              maxWidth: "680px",
            }}
          >
            A Social Science Enterprise built on the principle that research,
            intelligence, and ethical investment can be engineered into a
            self-sustaining system of human progress.
          </p>
        </div>

        {/* ── B) Mission / Vision / Values Cards ── */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          style={{ marginBottom: "clamp(56px, 8vw, 96px)" }}
        >
          {MVV_CARDS.map((card, i) => (
            <div
              key={card.label}
              data-ocid={`about.card.${i + 1}`}
              style={{
                position: "relative",
                background: "rgba(255,255,255,0.025)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderTop: `2px solid ${card.accentColor}`,
                borderRadius: "2px",
                padding: "clamp(20px, 3vw, 32px)",
                opacity: sectionVisible ? 1 : 0,
                transform: sectionVisible
                  ? "translateY(0)"
                  : "translateY(24px)",
                transition: `opacity 600ms ease ${200 + i * 150}ms, transform 600ms ease ${200 + i * 150}ms`,
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "rgba(255,255,255,0.04)";
                el.style.boxShadow = `0 0 32px ${card.accentColor}18`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "rgba(255,255,255,0.025)";
                el.style.boxShadow = "none";
              }}
            >
              {/* Animated SVG accent */}
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "16px",
                  opacity: 0.15,
                }}
                aria-hidden="true"
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  role="presentation"
                >
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="none"
                    stroke={card.accentColor}
                    strokeWidth="0.8"
                    strokeDasharray="3 8"
                    style={{
                      animation: `rotateRing ${14 + i * 4}s linear infinite`,
                      transformOrigin: "20px 20px",
                    }}
                  />
                  <circle cx="20" cy="4" r="2.5" fill={card.accentColor} />
                </svg>
              </div>

              {/* Icon + label */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{
                    fontSize: "18px",
                    color: card.accentColor,
                  }}
                >
                  {card.icon}
                </span>
                <span
                  style={{
                    fontFamily: "Geist Mono, monospace",
                    fontSize: "9px",
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    color: card.accentColor,
                  }}
                >
                  {card.label}
                </span>
              </div>

              {/* Content */}
              {card.content ? (
                <p
                  style={{
                    fontFamily: "Sora, sans-serif",
                    fontSize: "clamp(0.8rem, 1.1vw, 0.9rem)",
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.75,
                  }}
                >
                  {card.content}
                </p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {card.values?.map((v) => (
                    <li
                      key={v}
                      style={{
                        fontFamily: "Sora, sans-serif",
                        fontSize: "clamp(0.78rem, 1vw, 0.87rem)",
                        color: "rgba(255,255,255,0.55)",
                        lineHeight: 1.8,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          width: "4px",
                          height: "4px",
                          borderRadius: "50%",
                          background: card.accentColor,
                          flexShrink: 0,
                          opacity: 0.7,
                        }}
                      />
                      {v}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* ── C) Milestone Timeline ── */}
        <div style={{ marginBottom: "clamp(56px, 8vw, 96px)" }}>
          {/* Timeline header */}
          <div
            style={{
              marginBottom: "40px",
              opacity: sectionVisible ? 1 : 0,
              transform: sectionVisible ? "translateY(0)" : "translateY(20px)",
              transition:
                "opacity 600ms ease 600ms, transform 600ms ease 600ms",
            }}
          >
            <div
              style={{
                fontFamily: "Geist Mono, monospace",
                fontSize: "9px",
                letterSpacing: "0.35em",
                color: "rgba(212,160,23,0.6)",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              ◆ INSTITUTIONAL TIMELINE
            </div>
            <h3
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                fontWeight: 300,
                color: "rgba(255,255,255,0.85)",
                letterSpacing: "0.05em",
              }}
            >
              Building the Architecture
            </h3>
          </div>

          {/* Timeline items — vertical stack, horizontal line on md+ */}
          <div
            className="flex flex-col md:flex-row gap-0 md:gap-0 relative"
            style={{ alignItems: "flex-start" }}
          >
            {/* Horizontal connector on desktop */}
            <div
              className="hidden md:block absolute"
              style={{
                top: "20px",
                left: "10%",
                right: "10%",
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(212,160,23,0.3), transparent)",
                zIndex: 0,
              }}
              aria-hidden="true"
            />

            {MILESTONES.map((m, i) => (
              <div
                key={m.year + m.title}
                data-ocid={`about.item.${i + 1}`}
                className="flex flex-row md:flex-col items-start md:items-center gap-4 md:gap-3 flex-1 relative"
                style={{
                  paddingBottom:
                    i < MILESTONES.length - 1 ? "clamp(24px, 3vw, 0px)" : "0",
                  opacity: timelineVisible ? 1 : 0,
                  transform: timelineVisible
                    ? "translateX(0)"
                    : "translateX(-24px)",
                  transition: `opacity 600ms ease ${i * 150}ms, transform 600ms ease ${i * 150}ms`,
                  zIndex: 1,
                }}
              >
                {/* Gold dot */}
                <div
                  className="flex-shrink-0"
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#d4a017",
                    boxShadow: "0 0 12px rgba(212,160,23,0.4)",
                    marginTop: "4px",
                  }}
                  aria-hidden="true"
                />

                {/* Vertical connector (mobile only) */}
                {i < MILESTONES.length - 1 && (
                  <div
                    className="block md:hidden absolute"
                    style={{
                      left: "5px",
                      top: "16px",
                      bottom: "-24px",
                      width: "1px",
                      background:
                        "linear-gradient(180deg, rgba(212,160,23,0.4), transparent)",
                    }}
                    aria-hidden="true"
                  />
                )}

                <div className="md:text-center">
                  <div
                    style={{
                      fontFamily: "Geist Mono, monospace",
                      fontSize: "9px",
                      letterSpacing: "0.3em",
                      color: "#d4a017",
                      marginBottom: "4px",
                    }}
                  >
                    {m.year}
                  </div>
                  <div
                    style={{
                      fontFamily: "Fraunces, Georgia, serif",
                      fontSize: "clamp(0.85rem, 1.2vw, 1rem)",
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.85)",
                      letterSpacing: "0.04em",
                      marginBottom: "6px",
                    }}
                  >
                    {m.title}
                  </div>
                  <p
                    style={{
                      fontFamily: "Sora, sans-serif",
                      fontSize: "clamp(0.7rem, 0.9vw, 0.78rem)",
                      color: "rgba(255,255,255,0.35)",
                      lineHeight: 1.65,
                      maxWidth: "180px",
                    }}
                  >
                    {m.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── D) Philosophy Pull-Quote ── */}
        <div
          style={{
            position: "relative",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "2px",
            padding: "clamp(32px, 5vw, 56px)",
            marginBottom: "clamp(56px, 8vw, 96px)",
            overflow: "hidden",
          }}
        >
          {/* Scan line animation */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(212,160,23,0.5), transparent)",
              animation: "about-scan-line 8s linear infinite",
              pointerEvents: "none",
            }}
            aria-hidden="true"
          />

          {/* Watermark quote mark */}
          <div
            style={{
              position: "absolute",
              top: "8px",
              left: "24px",
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: "clamp(120px, 18vw, 200px)",
              fontWeight: 700,
              color: "#d4a017",
              lineHeight: 1,
              animation: "about-quote-breathe 5s ease-in-out infinite",
              pointerEvents: "none",
              userSelect: "none",
            }}
            aria-hidden="true"
          >
            "
          </div>

          <blockquote
            style={{
              position: "relative",
              zIndex: 1,
              fontFamily: "Fraunces, Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(1rem, 2.2vw, 1.4rem)",
              fontWeight: 300,
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.7,
              letterSpacing: "0.02em",
              maxWidth: "800px",
              margin: "0 auto",
              textAlign: "center",
              padding: "0 clamp(8px, 5vw, 48px)",
            }}
          >
            "The most powerful systems are those that convert knowledge into
            action and action into impact — systematically, ethically, and at
            scale."
            <footer
              style={{
                marginTop: "20px",
                fontFamily: "Geist Mono, monospace",
                fontStyle: "normal",
                fontSize: "9px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(212,160,23,0.6)",
              }}
            >
              — STEMONEF Founding Principles
            </footer>
          </blockquote>
        </div>

        {/* ── E) Animated Counter Stats ── */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          style={{
            marginBottom: "clamp(56px, 8vw, 96px)",
            padding: "clamp(24px, 4vw, 48px)",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "2px",
          }}
        >
          <AnimatedStat
            end={2024}
            label="Year Founded"
            trigger={statsVisible}
            delay={0}
          />
          <AnimatedStat
            end={7}
            label="Structural Pillars"
            trigger={statsVisible}
            delay={150}
          />
          <AnimatedStat
            end={5}
            label="Global Impact Domains"
            trigger={statsVisible}
            delay={300}
          />
          <AnimatedStat
            end={4}
            label="Revenue Streams"
            trigger={statsVisible}
            delay={450}
          />
        </div>

        {/* ── F) CTA Block ── */}
        <div
          style={{
            textAlign: "center",
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 600ms ease 800ms, transform 600ms ease 800ms",
          }}
        >
          <h3
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
              fontWeight: 300,
              color: "rgba(255,255,255,0.8)",
              letterSpacing: "0.04em",
              marginBottom: "24px",
            }}
          >
            Ready to Contribute to the Mission?
          </h3>
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              data-ocid="about.primary_button"
              onClick={() => onScrollTo("pillars")}
              style={{
                fontFamily: "Geist Mono, monospace",
                fontSize: "10px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                padding: "14px 28px",
                background: "rgba(74,126,247,0.12)",
                border: "1px solid rgba(74,126,247,0.4)",
                color: "rgba(74,126,247,0.9)",
                cursor: "pointer",
                borderRadius: "2px",
                transition: "all 200ms ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "rgba(74,126,247,0.2)";
                el.style.borderColor = "rgba(74,126,247,0.7)";
                el.style.boxShadow = "0 0 20px rgba(74,126,247,0.2)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "rgba(74,126,247,0.12)";
                el.style.borderColor = "rgba(74,126,247,0.4)";
                el.style.boxShadow = "none";
              }}
            >
              Explore the Pillars
            </button>
            <button
              type="button"
              data-ocid="about.secondary_button"
              onClick={() => onScrollTo("cta")}
              style={{
                fontFamily: "Geist Mono, monospace",
                fontSize: "10px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                padding: "14px 28px",
                background: "rgba(212,160,23,0.08)",
                border: "1px solid rgba(212,160,23,0.35)",
                color: "rgba(212,160,23,0.85)",
                cursor: "pointer",
                borderRadius: "2px",
                transition: "all 200ms ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "rgba(212,160,23,0.14)";
                el.style.borderColor = "rgba(212,160,23,0.6)";
                el.style.boxShadow = "0 0 20px rgba(212,160,23,0.15)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "rgba(212,160,23,0.08)";
                el.style.borderColor = "rgba(212,160,23,0.35)";
                el.style.boxShadow = "none";
              }}
            >
              Engage With STEMONEF
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
