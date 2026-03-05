import { useEffect, useRef } from "react";

interface ElpisPageProps {
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

const BOARD_MEMBERS = [
  {
    name: "Dr. A. Mitchell",
    role: "Research Ethics & Governance",
    initials: "AM",
  },
  { name: "Prof. S. Okafor", role: "Climate Policy & Science", initials: "SO" },
  { name: "Dr. R. Vance", role: "AI Ethics & Technology", initials: "RV" },
  { name: "Dr. L. Chen", role: "Medical Research & Bioethics", initials: "LC" },
  { name: "Prof. M. Adeyemi", role: "Social Science & Equity", initials: "MA" },
  {
    name: "Dr. T. Bergmann",
    role: "Strategic Foresight & Policy",
    initials: "TB",
  },
  {
    name: "Prof. I. Nakamura",
    role: "Institutional Governance",
    initials: "IN",
  },
  { name: "Dr. F. Diallo", role: "International Development", initials: "FD" },
];

const GOVERNANCE_PANELS = [
  {
    title: "Governance Principles",
    accentColor: "#4a7ef7",
    content:
      "Operate with full transparency, independence, and institutional accountability across all STEMONEF verticals.",
    icon: "◈",
  },
  {
    title: "Ethical Oversight",
    accentColor: "#d4a017",
    content:
      "Review and approve all research initiatives, publications, and operational decisions that carry ethical implications.",
    icon: "◆",
  },
  {
    title: "Strategic Guidance",
    accentColor: "#a78bfa",
    content:
      "Provide long-term directional counsel to the executive leadership on matters of institutional strategy and social impact.",
    icon: "◇",
  },
  {
    title: "Scientific Integrity",
    accentColor: "#22d3b0",
    content:
      "Ensure all published research, intelligence products, and knowledge outputs meet rigorous peer standards.",
    icon: "◎",
  },
];

export default function ElpisPage({ onBack }: ElpisPageProps) {
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
          data-ocid="elpis.button"
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
          ◎ E.L.P.I.S — ADVISORY BOARD
        </div>
      </nav>

      {/* ─── Hero Section ───────────────────────────────────── */}
      <section
        data-ocid="elpis.section"
        className="relative flex flex-col items-center justify-center text-center px-6"
        style={{ minHeight: "78vh", paddingTop: "6rem", paddingBottom: "6rem" }}
      >
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <svg
            role="img"
            aria-label="Decorative advisory board concentric rings background"
            className="absolute inset-0 w-full h-full"
            style={{ opacity: 0.12 }}
          >
            <defs>
              <radialGradient id="elpisHeroGrad" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#d4a017" stopOpacity="0.25" />
                <stop offset="60%" stopColor="#4a7ef7" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#04050e" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#elpisHeroGrad)" />
            {/* Concentric ring decoration */}
            <circle
              cx="50%"
              cy="40%"
              r="180"
              fill="none"
              stroke="rgba(212,160,23,0.12)"
              strokeWidth="1"
              strokeDasharray="6 8"
              className="animate-breathing"
            />
            <circle
              cx="50%"
              cy="40%"
              r="260"
              fill="none"
              stroke="rgba(74,126,247,0.08)"
              strokeWidth="1"
              strokeDasharray="4 10"
              className="animate-breathing"
              style={{ animationDelay: "0.5s" }}
            />
            <circle
              cx="50%"
              cy="40%"
              r="340"
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
              className="animate-breathing"
              style={{ animationDelay: "1s" }}
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div
            className="font-mono-geist text-xs tracking-[0.45em] uppercase mb-6 reveal"
            style={{ color: "rgba(212,160,23,0.7)" }}
          >
            ◎ ADVISORY GOVERNANCE BODY
          </div>
          <h1
            className="font-display font-light mb-4 reveal reveal-delay-1"
            style={{
              fontSize: "clamp(3rem, 9vw, 6rem)",
              letterSpacing: "0.2em",
              lineHeight: 1,
              background:
                "linear-gradient(135deg, #d4a017 0%, #f0c843 40%, #ffffff 80%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            E.L.P.I.S
          </h1>
          <p
            className="font-display font-light text-xl mb-5 reveal reveal-delay-2"
            style={{ color: "rgba(255,255,255,0.55)", letterSpacing: "0.06em" }}
          >
            Ethical Leadership, Policy & Innovation Stewardship
          </p>
          <p
            className="text-sm mb-4 reveal reveal-delay-3"
            style={{
              color: "rgba(255,255,255,0.4)",
              fontFamily: "Sora, sans-serif",
              maxWidth: "520px",
              margin: "0 auto 1rem",
              lineHeight: 1.7,
            }}
          >
            Ensure all STEMONEF verticals remain ethically guided and
            scientifically grounded.
          </p>
          <p
            className="text-xs reveal reveal-delay-4"
            style={{
              color: "rgba(255,255,255,0.3)",
              fontFamily: "Sora, sans-serif",
              maxWidth: "560px",
              margin: "0 auto",
              lineHeight: 1.8,
            }}
          >
            E.L.P.I.S brings together leading voices in research, policy,
            ethics, and science education to guide the long-term direction of
            the enterprise.
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
                "linear-gradient(to bottom, rgba(212,160,23,0.5), transparent)",
            }}
          />
        </div>
      </section>

      {/* ─── Circular Advisory Board ────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="mb-12 text-center reveal">
          <div
            className="font-mono-geist text-[10px] tracking-[0.45em] uppercase mb-3"
            style={{ color: "rgba(212,160,23,0.7)" }}
          >
            ◈ ADVISORY BOARD
          </div>
          <h2
            className="font-display text-3xl font-light text-gradient-gold"
            style={{ letterSpacing: "0.12em" }}
          >
            Board Composition
          </h2>
        </div>

        {/* Circular layout using CSS grid + radial positioning */}
        <div className="reveal">
          <div
            className="relative mx-auto"
            style={{ width: "min(560px, 100%)", height: "min(560px, 100vw)" }}
          >
            {/* Center seal */}
            <div
              className="absolute z-10"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "110px",
                height: "110px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(212,160,23,0.12), rgba(4,5,14,0.95))",
                border: "1.5px solid rgba(212,160,23,0.4)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  "0 0 40px rgba(212,160,23,0.15), 0 0 80px rgba(212,160,23,0.06)",
              }}
            >
              <div
                className="font-display text-sm font-light"
                style={{ color: "#d4a017", letterSpacing: "0.15em" }}
              >
                E.L.P.I.S
              </div>
              <div
                className="font-mono-geist text-[7px] tracking-wider mt-1"
                style={{ color: "rgba(212,160,23,0.5)" }}
              >
                ADVISORY
              </div>
            </div>

            {/* Connecting ring SVG */}
            <svg
              role="img"
              aria-hidden="true"
              className="absolute inset-0 w-full h-full animate-breathing"
              viewBox="0 0 560 560"
              style={{ opacity: 0.25 }}
            >
              <circle
                cx="280"
                cy="280"
                r="200"
                fill="none"
                stroke="rgba(212,160,23,0.3)"
                strokeWidth="0.5"
                strokeDasharray="4 6"
              />
              {BOARD_MEMBERS.map((member, i) => {
                const angle =
                  (i / BOARD_MEMBERS.length) * 2 * Math.PI - Math.PI / 2;
                const x = 280 + 200 * Math.cos(angle);
                const y = 280 + 200 * Math.sin(angle);
                return (
                  <line
                    key={`line-${member.initials}`}
                    x1="280"
                    y1="280"
                    x2={x}
                    y2={y}
                    stroke="rgba(212,160,23,0.2)"
                    strokeWidth="0.5"
                  />
                );
              })}
            </svg>

            {/* Member positions */}
            {BOARD_MEMBERS.map((member, i) => {
              const angle =
                (i / BOARD_MEMBERS.length) * 2 * Math.PI - Math.PI / 2;
              const radius = 200;
              const cx = 50 + ((radius / 2.8) * Math.cos(angle) * 100) / 100;
              const cy = 50 + ((radius / 2.8) * Math.sin(angle) * 100) / 100;
              return (
                <div
                  key={member.name}
                  data-ocid={`elpis.card.${i + 1}`}
                  className="absolute transition-all duration-300 group"
                  style={{
                    top: `${cy}%`,
                    left: `${cx}%`,
                    transform: "translate(-50%, -50%)",
                    width: "88px",
                    textAlign: "center",
                  }}
                >
                  {/* Avatar */}
                  <div
                    className="mx-auto rounded-full flex items-center justify-center mb-1 transition-all duration-300"
                    style={{
                      width: "44px",
                      height: "44px",
                      background: "rgba(4,5,14,0.9)",
                      border: "1.5px solid rgba(212,160,23,0.3)",
                      boxShadow: "0 0 12px rgba(212,160,23,0.1)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(212,160,23,0.7)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        "0 0 20px rgba(212,160,23,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(212,160,23,0.3)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        "0 0 12px rgba(212,160,23,0.1)";
                    }}
                  >
                    <span
                      className="font-mono-geist text-[9px] font-bold"
                      style={{
                        color: "rgba(212,160,23,0.85)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {member.initials}
                    </span>
                  </div>
                  <div
                    className="font-mono-geist text-[7px] tracking-wider leading-tight"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {member.name}
                  </div>
                  <div
                    className="font-mono-geist text-[6px] leading-tight mt-0.5"
                    style={{ color: "rgba(212,160,23,0.45)" }}
                  >
                    {member.role}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile fallback list */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 md:hidden">
          {BOARD_MEMBERS.map((member, i) => (
            <div
              key={`mobile-${member.name}`}
              data-ocid={`elpis.card.${i + 1}`}
              className="p-4 rounded-sm text-center"
              style={{
                background: "rgba(212,160,23,0.04)",
                border: "1px solid rgba(212,160,23,0.15)",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2"
                style={{
                  background: "rgba(212,160,23,0.1)",
                  border: "1px solid rgba(212,160,23,0.3)",
                }}
              >
                <span
                  className="font-mono-geist text-[9px] font-bold"
                  style={{ color: "#d4a017" }}
                >
                  {member.initials}
                </span>
              </div>
              <div
                className="font-mono-geist text-[8px] tracking-wider"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                {member.name}
              </div>
              <div
                className="font-mono-geist text-[7px] mt-1"
                style={{ color: "rgba(212,160,23,0.5)" }}
              >
                {member.role}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Governance Sections ────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10 reveal">
          <div
            className="font-mono-geist text-[10px] tracking-[0.45em] uppercase mb-3"
            style={{ color: "rgba(74,126,247,0.7)" }}
          >
            ◈ GOVERNANCE FRAMEWORK
          </div>
          <h2
            className="font-display text-3xl font-light text-gradient-hero"
            style={{ letterSpacing: "0.12em" }}
          >
            Institutional Pillars
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {GOVERNANCE_PANELS.map((panel, i) => (
            <div
              key={panel.title}
              data-ocid={`elpis.panel.${i + 1}`}
              className="p-8 rounded-sm reveal transition-all duration-300"
              style={{
                background: "rgba(4,5,14,0.7)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderTop: `3px solid ${panel.accentColor}`,
                backdropFilter: "blur(16px)",
                transitionDelay: `${i * 0.08}s`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "rgba(4,5,14,0.85)";
                el.style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${panel.accentColor}15`;
                el.style.borderColor = `${panel.accentColor}30`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "rgba(4,5,14,0.7)";
                el.style.boxShadow = "none";
                el.style.borderColor = "rgba(255,255,255,0.07)";
              }}
            >
              <div
                className="text-xl mb-4"
                style={{ color: panel.accentColor }}
              >
                {panel.icon}
              </div>
              <h3
                className="font-display text-xl font-light mb-4"
                style={{
                  color: "rgba(255,255,255,0.88)",
                  letterSpacing: "0.12em",
                }}
              >
                {panel.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                {panel.content}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Simple footer for ELPIS */}
      <footer
        className="px-6 py-10 text-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p
          className="font-mono-geist text-[10px]"
          style={{ color: "rgba(255,255,255,0.2)", letterSpacing: "0.12em" }}
        >
          © {new Date().getFullYear()} STEMONEF ENTERPRISES — E.L.P.I.S Advisory
          Board
        </p>
      </footer>
    </div>
  );
}
