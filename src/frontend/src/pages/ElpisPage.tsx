import { useEffect } from "react";

interface ElpisPageProps {
  onBack: () => void;
}

const LEGAL_NOTE =
  "EPOCHS™, HUMANON™, STEAMI™ and all associated initiatives operate under the parent institution THE STEMONEF™ ENTERPRISES.";

const ADVISORY_MEMBERS = [
  { id: "01", initials: "AM", role: "Research Ethics" },
  { id: "02", initials: "BK", role: "Policy & Governance" },
  { id: "03", initials: "CL", role: "Climate Science" },
  { id: "04", initials: "DR", role: "AI Ethics" },
  { id: "05", initials: "ES", role: "Education Systems" },
  { id: "06", initials: "FT", role: "Strategic Foresight" },
];

const GOVERNANCE_SECTIONS = [
  {
    title: "Governance Principles",
    glyph: "◈",
    color: "#d4a017",
    description:
      "All decisions within STEMONEF verticals are subject to independent review, transparent documentation, and accountability standards that hold regardless of institutional pressures.",
  },
  {
    title: "Ethical Oversight",
    glyph: "◆",
    color: "#4a7ef7",
    description:
      "E.L.P.I.S evaluates research outputs, operational practices, and strategic decisions against the STEMONEF Ethics Charter — an independently published foundational document.",
  },
  {
    title: "Strategic Guidance",
    glyph: "◇",
    color: "#22d3b0",
    description:
      "Drawing on collective expertise in research, policy, and systems science, the board provides forward-looking guidance to ensure alignment between organizational growth and mission integrity.",
  },
  {
    title: "Scientific Integrity",
    glyph: "◎",
    color: "#a78bfa",
    description:
      "Rigorous standards of evidence, peer accountability, and methodological transparency are enforced across all STEMONEF research initiatives and published knowledge products.",
  },
];

// Circular member layout positions (angle in degrees from top)
function getMemberPosition(index: number, total: number, radius: number) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);
  return { x, y };
}

export default function ElpisPage({ onBack }: ElpisPageProps) {
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
    const els = document.querySelectorAll(".elpis-reveal");
    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const radius = 160;
  const containerSize = radius * 2 + 120;

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
          data-ocid="elpis.back.button"
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
          style={{ color: "rgba(212,160,23,0.7)" }}
        >
          E.L.P.I.S
        </div>
      </div>

      {/* Hero */}
      <section
        className="relative min-h-[75vh] flex items-center px-6 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, rgba(12,10,30,0.9) 0%, rgba(4,5,14,1) 65%)",
        }}
      >
        <div
          className="neural-grid-bg absolute inset-0 opacity-20"
          aria-hidden="true"
        />

        {/* Ambient glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(212,160,23,0.06) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full pt-16 pb-20">
          <div
            className="font-mono-geist text-xs tracking-[0.4em] uppercase mb-6 animate-fade-in-up"
            style={{ color: "rgba(212,160,23,0.7)" }}
          >
            ◆ ADVISORY BOARD
          </div>

          <h1
            className="font-display font-light text-gradient-gold mb-4 animate-fade-in-up"
            style={{
              fontSize: "clamp(3rem, 10vw, 7.5rem)",
              letterSpacing: "0.12em",
              lineHeight: 0.9,
              animationDelay: "0.1s",
            }}
          >
            E.L.P.I.S
          </h1>

          <p
            className="font-display text-xl md:text-2xl font-light mb-6 animate-fade-in-up"
            style={{
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.05em",
              maxWidth: "640px",
              animationDelay: "0.2s",
            }}
          >
            Ethical Leadership, Policy &amp; Innovation Stewardship
          </p>

          <div
            className="animate-fade-in-up max-w-2xl"
            style={{ animationDelay: "0.3s" }}
          >
            <p
              className="text-base leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.45)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              Ensure all STEMONEF verticals remain ethically guided and
              scientifically grounded. E.L.P.I.S brings together leading voices
              in research, policy, ethics, and science education to guide the
              long-term direction of the enterprise.
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

      {/* Advisory Board Circular Layout */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 elpis-reveal reveal text-center">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◈ BOARD MEMBERS
            </div>
            <h2
              className="font-display text-4xl font-light text-gradient-gold"
              style={{ letterSpacing: "0.08em" }}
            >
              Advisory Council
            </h2>
            <p
              className="mt-3 text-sm max-w-md mx-auto"
              style={{
                color: "rgba(255,255,255,0.35)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              Positions currently open. Board composition finalised upon
              institutional launch.
            </p>
          </div>

          {/* Circular arrangement */}
          <div
            className="elpis-reveal reveal relative mx-auto"
            style={{
              width: `${containerSize}px`,
              height: `${containerSize}px`,
              maxWidth: "100%",
              transitionDelay: "0.1s",
            }}
          >
            {/* Center node */}
            <div
              className="absolute"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                background: "rgba(212,160,23,0.08)",
                border: "2px solid rgba(212,160,23,0.4)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}
            >
              <div
                className="font-display text-xs font-light tracking-widest text-center"
                style={{
                  color: "rgba(212,160,23,0.9)",
                  letterSpacing: "0.15em",
                }}
              >
                STE
                <br />
                MO
                <br />
                NEF
              </div>
            </div>

            {/* Orbital ring */}
            <div
              className="absolute animate-breathing"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: `${radius * 2}px`,
                height: `${radius * 2}px`,
                borderRadius: "50%",
                border: "1px dashed rgba(212,160,23,0.15)",
              }}
              aria-hidden="true"
            />

            {/* Member cards */}
            {ADVISORY_MEMBERS.map((member, i) => {
              const pos = getMemberPosition(i, ADVISORY_MEMBERS.length, radius);
              return (
                <div
                  key={member.id}
                  data-ocid={`elpis.member.card.${i + 1}`}
                  className="absolute transition-all duration-300"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                    zIndex: 5,
                  }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex flex-col items-center justify-center cursor-default transition-all duration-300 group"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(212,160,23,0.2)",
                      backdropFilter: "blur(12px)",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.background = "rgba(212,160,23,0.1)";
                      el.style.borderColor = "rgba(212,160,23,0.5)";
                      el.style.boxShadow = "0 0 16px rgba(212,160,23,0.2)";
                      el.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.background = "rgba(255,255,255,0.04)";
                      el.style.borderColor = "rgba(212,160,23,0.2)";
                      el.style.boxShadow = "none";
                      el.style.transform = "scale(1)";
                    }}
                  >
                    <div
                      className="font-mono-geist text-sm font-bold"
                      style={{ color: "rgba(212,160,23,0.8)" }}
                    >
                      {member.initials}
                    </div>
                    <div
                      className="font-mono-geist text-[8px] text-center mt-0.5 leading-tight px-1"
                      style={{
                        color: "rgba(255,255,255,0.35)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {member.role}
                    </div>
                  </div>

                  {/* Connecting line to center (SVG) */}
                  <svg
                    className="absolute pointer-events-none"
                    style={{
                      left: "50%",
                      top: "50%",
                      overflow: "visible",
                      transform: "translate(-50%, -50%)",
                      zIndex: -1,
                    }}
                    width="2"
                    height="2"
                    aria-hidden="true"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2={-pos.x}
                      y2={-pos.y}
                      stroke="rgba(212,160,23,0.1)"
                      strokeWidth="1"
                      strokeDasharray="3 4"
                      className="animate-breathing"
                    />
                  </svg>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Governance Sections */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 elpis-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ GOVERNANCE FRAMEWORK
            </div>
            <h2
              className="font-display text-4xl font-light"
              style={{
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Pillars of Stewardship
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GOVERNANCE_SECTIONS.map((gs, i) => (
              <div
                key={gs.title}
                data-ocid={`elpis.governance.card.${i + 1}`}
                className="glass-strong p-8 rounded-sm transition-all duration-300 elpis-reveal reveal"
                style={{
                  borderLeft: `3px solid ${gs.color}55`,
                  transitionDelay: `${i * 0.1}s`,
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderLeftColor = `${gs.color}99`;
                  el.style.boxShadow = `0 0 20px ${gs.color}0d, 0 8px 32px rgba(0,0,0,0.4)`;
                  el.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderLeftColor = `${gs.color}55`;
                  el.style.boxShadow = "none";
                  el.style.transform = "none";
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="text-xl"
                    style={{ color: `${gs.color}88` }}
                    aria-hidden="true"
                  >
                    {gs.glyph}
                  </div>
                  <h3
                    className="font-display text-xl font-light tracking-widest uppercase"
                    style={{ color: gs.color, letterSpacing: "0.12em" }}
                  >
                    {gs.title}
                  </h3>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    fontFamily: "Sora, sans-serif",
                  }}
                >
                  {gs.description}
                </p>
              </div>
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
