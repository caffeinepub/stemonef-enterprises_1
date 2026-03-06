interface FooterProps {
  onNavigate?: (page: string) => void; // institutional pages
  onPillarNavigate?: (page: string) => void; // pillar pages
}

const PILLARS = [
  {
    label: "EPOCHS",
    page: "epochs",
    color: "#4a7ef7",
    desc: "Research & Innovation",
  },
  {
    label: "HUMANON",
    page: "humanon",
    color: "#d4a017",
    desc: "Talent & Development",
  },
  {
    label: "STEAMI",
    page: "steami",
    color: "#a78bfa",
    desc: "Intelligence & Policy",
  },
  {
    label: "NOVA",
    page: "nova",
    color: "#22d3ee",
    desc: "Technology & Futures",
  },
  {
    label: "TERRA",
    page: "terra",
    color: "#34d399",
    desc: "Climate & Sustainability",
  },
  { label: "EQUIS", page: "equis", color: "#f59e0b", desc: "Equity & Capital" },
];

const INSTITUTIONAL = [
  { label: "Ethics Charter", page: "ethics-charter", color: "#4a7ef7" },
  {
    label: "Accountability Report",
    page: "accountability-report",
    color: "#d4a017",
  },
  { label: "Impact Fund", page: "impact-fund", color: "#34d399" },
  { label: "Talent Pipeline", page: "talent-pipeline", color: "#a78bfa" },
  { label: "Intelligence Feed", page: "intelligence-feed", color: "#22d3ee" },
  { label: "Privacy Policy", page: "privacy-policy", color: "#f59e0b" },
];

export default function Footer({ onNavigate, onPillarNavigate }: FooterProps) {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer
      className="relative py-16 px-6"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(4,5,14,0) 0%, rgba(2,3,9,1) 100%)",
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(rgba(74,126,247,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,126,247,0.015) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div
              className="font-display text-xl font-light tracking-[0.25em] mb-2"
              style={{
                background: "linear-gradient(135deg, #4a7ef7, #8ab4ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              STEMONEF
            </div>
            <div
              className="font-mono-geist text-[9px] tracking-[0.35em] uppercase mb-4"
              style={{ color: "rgba(212,160,23,0.6)" }}
            >
              ENTERPRISES
            </div>
            <p
              className="text-xs leading-relaxed mb-5"
              style={{
                color: "rgba(255,255,255,0.3)",
                fontFamily: "Sora, sans-serif",
                maxWidth: "200px",
              }}
            >
              For a Better Tomorrow.
            </p>

            {/* System status */}
            <div
              className="font-mono-geist text-[8px] tracking-[0.2em] uppercase space-y-1.5"
              style={{ color: "rgba(255,255,255,0.15)" }}
            >
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#34d399",
                    boxShadow: "0 0 6px rgba(52,211,153,0.5)",
                    flexShrink: 0,
                  }}
                />
                <span>INTELLIGENCE: ACTIVE</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "rgba(212,160,23,0.6)",
                    flexShrink: 0,
                  }}
                />
                <span>6 PILLARS ONLINE</span>
              </div>
            </div>
          </div>

          {/* Structural Pillars */}
          <div>
            <div
              className="font-mono-geist text-[9px] tracking-[0.35em] uppercase mb-5"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              STRUCTURAL PILLARS
            </div>
            <div className="space-y-0.5">
              {PILLARS.map((pillar) => (
                <button
                  key={pillar.label}
                  type="button"
                  data-ocid={`footer.pillar.${pillar.page}.link`}
                  onClick={() => onPillarNavigate?.(pillar.page)}
                  className="group flex items-center gap-3 w-full text-left rounded-[1px] px-2 py-2 -mx-2 transition-all duration-200"
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: onPillarNavigate ? "pointer" : "default",
                  }}
                  onMouseEnter={(e) => {
                    if (!onPillarNavigate) return;
                    (e.currentTarget as HTMLButtonElement).style.background =
                      `${pillar.color}0a`;
                    const dot = (
                      e.currentTarget as HTMLButtonElement
                    ).querySelector(".pillar-dot") as HTMLElement;
                    if (dot) dot.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                    const dot = (
                      e.currentTarget as HTMLButtonElement
                    ).querySelector(".pillar-dot") as HTMLElement;
                    if (dot) dot.style.opacity = "0.45";
                  }}
                >
                  {/* Pillar indicator dot */}
                  <div
                    className="pillar-dot"
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: pillar.color,
                      opacity: 0.45,
                      flexShrink: 0,
                      transition: "opacity 200ms",
                      boxShadow: `0 0 6px ${pillar.color}50`,
                    }}
                  />
                  <div className="flex flex-col gap-0">
                    <span
                      className="font-mono-geist text-xs"
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        letterSpacing: "0.15em",
                        transition: "color 200ms",
                      }}
                      onMouseEnter={(e) => {
                        if (onPillarNavigate)
                          (e.currentTarget as HTMLSpanElement).style.color =
                            pillar.color;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLSpanElement).style.color =
                          "rgba(255,255,255,0.5)";
                      }}
                    >
                      {pillar.label}
                    </span>
                    <span
                      className="font-mono-geist text-[8px]"
                      style={{
                        color: "rgba(255,255,255,0.2)",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {pillar.desc}
                    </span>
                  </div>
                  {onPillarNavigate && (
                    <span
                      className="ml-auto font-mono-geist text-[9px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ color: pillar.color }}
                    >
                      →
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Institutional */}
          <div>
            <div
              className="font-mono-geist text-[9px] tracking-[0.35em] uppercase mb-5"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              INSTITUTIONAL
            </div>
            <div className="space-y-0.5">
              {INSTITUTIONAL.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  data-ocid={`footer.institutional.${item.page}.link`}
                  onClick={() => onNavigate?.(item.page)}
                  className="group flex items-center gap-3 w-full text-left rounded-[1px] px-2 py-2 -mx-2 transition-all duration-200"
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: onNavigate ? "pointer" : "default",
                  }}
                  onMouseEnter={(e) => {
                    if (!onNavigate) return;
                    (e.currentTarget as HTMLButtonElement).style.background =
                      `${item.color}0a`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                  }}
                >
                  {/* Square indicator */}
                  <div
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "1px",
                      background: item.color,
                      opacity: 0.4,
                      flexShrink: 0,
                      transition: "opacity 200ms",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.opacity = "0.4";
                    }}
                  />
                  <span
                    className="font-mono-geist text-xs"
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      letterSpacing: "0.1em",
                      transition: "color 200ms",
                    }}
                    onMouseEnter={(e) => {
                      if (onNavigate)
                        (e.currentTarget as HTMLSpanElement).style.color =
                          item.color;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLSpanElement).style.color =
                        "rgba(255,255,255,0.4)";
                    }}
                  >
                    {item.label}
                  </span>
                  {onNavigate && (
                    <span
                      className="ml-auto font-mono-geist text-[9px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ color: item.color }}
                    >
                      →
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mission divider */}
        <div
          className="py-5 mb-4"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.04)",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <p
            className="font-mono-geist text-[9px] text-center tracking-[0.2em]"
            style={{ color: "rgba(255,255,255,0.1)" }}
          >
            ADVANCING SCIENCE · TECHNOLOGY · INTELLIGENCE · AND HUMAN PROGRESS
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p
            className="font-mono-geist text-[10px]"
            style={{ color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}
          >
            © {year} STEMONEF ENTERPRISES. All Rights Reserved.
          </p>

          <a
            href={utmLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono-geist text-[10px] transition-colors duration-200"
            style={{
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.1em",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color =
                "rgba(212,160,23,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color =
                "rgba(255,255,255,0.2)";
            }}
          >
            Built with ♥ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
