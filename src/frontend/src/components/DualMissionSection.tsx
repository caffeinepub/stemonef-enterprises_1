export default function DualMissionSection() {
  const impactItems = [
    { label: "Climate Systems", icon: "🌍", color: "rgba(52,211,153,0.8)" },
    { label: "Global Health", icon: "⚕", color: "rgba(248,113,113,0.8)" },
    { label: "Poverty Reduction", icon: "◈", color: "rgba(167,139,250,0.8)" },
    { label: "Education Access", icon: "◇", color: "rgba(212,160,23,0.8)" },
    { label: "Ethical AI", icon: "⬡", color: "rgba(96,165,250,0.8)" },
  ];

  const revenueItems = [
    { label: "Deep Technology", icon: "◈", color: "rgba(74,126,247,0.8)" },
    {
      label: "Intelligence Services",
      icon: "◆",
      color: "rgba(167,139,250,0.8)",
    },
    { label: "Media Production", icon: "▷", color: "rgba(212,160,23,0.8)" },
    { label: "Equity Investments", icon: "◎", color: "rgba(52,211,153,0.8)" },
  ];

  return (
    <section
      data-ocid="mission.section"
      id="mission"
      className="relative py-28 px-6"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(42,92,246,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div
            className="font-mono-geist text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: "rgba(212,160,23,0.7)" }}
          >
            ◆ ENTERPRISE MODEL
          </div>
          <h2
            className="font-display text-4xl md:text-5xl font-light text-gradient-hero"
            style={{ letterSpacing: "0.08em" }}
          >
            Enterprise Architecture
          </h2>
        </div>

        {/* Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
          {/* Left: Impact */}
          <div
            className="lg:col-span-2 p-8 rounded-sm"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderLeft: "2px solid rgba(52,211,153,0.5)",
            }}
          >
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-6"
              style={{ color: "rgba(52,211,153,0.8)" }}
            >
              IMPACT ARCHITECTURE
            </div>
            <div className="space-y-4">
              {impactItems.map(({ label, icon, color }, i) => (
                <div
                  key={label}
                  className="flex items-center gap-3 group transition-all duration-200"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span
                    className="text-base w-6 text-center flex-shrink-0"
                    style={{ color, filter: "brightness(1.2)" }}
                  >
                    {icon}
                  </span>
                  <div
                    className="flex-1 h-px transition-all duration-300"
                    style={{
                      background: `linear-gradient(90deg, ${color}30, transparent)`,
                    }}
                  />
                  <span
                    className="text-sm font-light"
                    style={{
                      color: "rgba(255,255,255,0.65)",
                      fontFamily: "Sora, sans-serif",
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Center: Flow Animation */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center py-8 lg:py-0">
            <div className="relative flex flex-col items-center gap-2">
              {/* Top label */}
              <div
                className="font-mono-geist text-[8px] tracking-[0.3em] uppercase text-center mb-2"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                REVENUE
              </div>

              {/* Animated flow SVG */}
              <svg
                role="img"
                aria-label="Revenue reinvestment flow"
                width="80"
                height="160"
                viewBox="0 0 80 160"
                fill="none"
                className="animate-breathing"
              >
                {/* Flow lines */}
                <path
                  d="M40 10 L40 75"
                  stroke="url(#flowGrad)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <path
                  d="M40 85 L40 150"
                  stroke="url(#flowGrad2)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                {/* Arrow */}
                <path
                  d="M32 150 L40 158 L48 150"
                  stroke="rgba(212,160,23,0.7)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                {/* Center circle node */}
                <circle cx="40" cy="80" r="10" fill="rgba(212,160,23,0.1)" />
                <circle
                  cx="40"
                  cy="80"
                  r="10"
                  stroke="rgba(212,160,23,0.5)"
                  strokeWidth="1"
                />
                <circle
                  cx="40"
                  cy="80"
                  r="4"
                  fill="rgba(212,160,23,0.8)"
                  style={{ animation: "node-pulse 2s ease-in-out infinite" }}
                />
                {/* Left arrow */}
                <path
                  d="M20 80 L35 80"
                  stroke="rgba(74,126,247,0.4)"
                  strokeWidth="1"
                />
                <path
                  d="M60 80 L45 80"
                  stroke="rgba(74,126,247,0.4)"
                  strokeWidth="1"
                />
                <defs>
                  <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(74,126,247,0.3)" />
                    <stop offset="100%" stopColor="rgba(212,160,23,0.7)" />
                  </linearGradient>
                  <linearGradient id="flowGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(212,160,23,0.7)" />
                    <stop offset="100%" stopColor="rgba(52,211,153,0.3)" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Bottom label */}
              <div
                className="font-mono-geist text-[8px] tracking-[0.3em] uppercase text-center"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                REINVESTED
              </div>
              <div
                className="font-mono-geist text-[8px] tracking-[0.3em] uppercase text-center"
                style={{ color: "rgba(52,211,153,0.6)" }}
              >
                INTO IMPACT
              </div>
            </div>
          </div>

          {/* Right: Revenue */}
          <div
            className="lg:col-span-2 p-8 rounded-sm"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRight: "2px solid rgba(74,126,247,0.5)",
            }}
          >
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-6"
              style={{ color: "rgba(74,126,247,0.8)" }}
            >
              REVENUE & SUSTAINABILITY ENGINE
            </div>
            <div className="space-y-4">
              {revenueItems.map(({ label, icon, color }, i) => (
                <div
                  key={label}
                  className="flex items-center gap-3 transition-all duration-200"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span
                    className="text-sm font-light"
                    style={{
                      color: "rgba(255,255,255,0.65)",
                      fontFamily: "Sora, sans-serif",
                    }}
                  >
                    {label}
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${color}30)`,
                    }}
                  />
                  <span
                    className="text-base w-6 text-center flex-shrink-0"
                    style={{ color, filter: "brightness(1.2)" }}
                  >
                    {icon}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Caption */}
        <div className="mt-10 text-center">
          <p
            className="text-xs"
            style={{
              color: "rgba(255,255,255,0.3)",
              fontFamily: "Geist Mono, monospace",
              letterSpacing: "0.1em",
            }}
          >
            All revenue streams are constitutionally mandated to reinvest
            profits into STEMONEF's humanitarian and environmental impact
            architecture.
          </p>
        </div>
      </div>
    </section>
  );
}
