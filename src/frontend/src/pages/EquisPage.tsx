import { useEffect, useRef, useState } from "react";

interface EquisPageProps {
  onBack: () => void;
}

const LEGAL_NOTE =
  "EQUIS™ and all associated initiatives operate under the parent institution THE STEMONEF™ ENTERPRISES.";

function GoldenLatticeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Node = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      pulse: number;
      pulseSpeed: number;
      anchor: boolean;
      alpha: number;
    };

    let nodes: Node[] = [];

    function initNodes() {
      nodes = [];
      const cx = canvas!.width / 2;
      const cy = canvas!.height / 2;

      // Anchor nodes (large — represent anchor investments)
      const anchorPositions = [
        { x: cx, y: cy },
        { x: cx - 180, y: cy - 80 },
        { x: cx + 180, y: cy - 80 },
        { x: cx - 90, y: cy + 150 },
        { x: cx + 90, y: cy + 150 },
      ];
      for (const pos of anchorPositions) {
        nodes.push({
          x: pos.x + (Math.random() - 0.5) * 20,
          y: pos.y + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: 6 + Math.random() * 4,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.02,
          anchor: true,
          alpha: 0.85,
        });
      }

      // Regular network nodes
      for (let i = 0; i < 30; i++) {
        nodes.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: 2 + Math.random() * 2.5,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.03 + Math.random() * 0.03,
          anchor: false,
          alpha: 0.4 + Math.random() * 0.4,
        });
      }
    }

    initNodes();
    window.addEventListener("resize", initNodes);

    // Capital flow streams — bright particles traveling along connections
    const flowStreams: {
      fromIdx: number;
      toIdx: number;
      progress: number;
      speed: number;
    }[] = [];

    for (let i = 0; i < 8; i++) {
      flowStreams.push({
        fromIdx: Math.floor(Math.random() * nodes.length),
        toIdx: Math.floor(Math.random() * nodes.length),
        progress: Math.random(),
        speed: 0.006 + Math.random() * 0.004,
      });
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background radial gradient
      const bgGrad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) * 0.6,
      );
      bgGrad.addColorStop(0, "rgba(212,160,23,0.04)");
      bgGrad.addColorStop(0.5, "rgba(180,120,10,0.02)");
      bgGrad.addColorStop(1, "transparent");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update node positions
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += n.pulseSpeed;

        // Gentle boundary bounce
        if (n.x < n.r || n.x > canvas.width - n.r) n.vx *= -1;
        if (n.y < n.r || n.y > canvas.height - n.r) n.vy *= -1;
        n.x = Math.max(n.r, Math.min(canvas.width - n.r, n.x));
        n.y = Math.max(n.r, Math.min(canvas.height - n.r, n.y));
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = nodes[i].anchor || nodes[j].anchor ? 220 : 140;

          if (dist < maxDist) {
            const opacity = 0.15 * (1 - dist / maxDist);
            const isAnchorConn = nodes[i].anchor || nodes[j].anchor;
            const lineGrad = ctx.createLinearGradient(
              nodes[i].x,
              nodes[i].y,
              nodes[j].x,
              nodes[j].y,
            );
            lineGrad.addColorStop(
              0,
              `rgba(212,160,23,${opacity * (isAnchorConn ? 2 : 1)})`,
            );
            lineGrad.addColorStop(
              0.5,
              `rgba(255,190,50,${opacity * (isAnchorConn ? 1.5 : 0.8)})`,
            );
            lineGrad.addColorStop(
              1,
              `rgba(212,160,23,${opacity * (isAnchorConn ? 2 : 1)})`,
            );
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = lineGrad;
            ctx.lineWidth = isAnchorConn ? 1.2 : 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw capital flow streams
      for (const stream of flowStreams) {
        if (stream.fromIdx >= nodes.length || stream.toIdx >= nodes.length)
          continue;
        stream.progress += stream.speed;
        if (stream.progress > 1) {
          stream.progress = 0;
          stream.fromIdx = Math.floor(Math.random() * nodes.length);
          stream.toIdx = Math.floor(Math.random() * nodes.length);
        }

        const from = nodes[stream.fromIdx];
        const to = nodes[stream.toIdx];
        const px = from.x + (to.x - from.x) * stream.progress;
        const py = from.y + (to.y - from.y) * stream.progress;

        // Flow particle
        const fpGrad = ctx.createRadialGradient(px, py, 0, px, py, 6);
        fpGrad.addColorStop(0, "rgba(255,210,80,0.9)");
        fpGrad.addColorStop(0.4, "rgba(212,160,23,0.5)");
        fpGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fillStyle = fpGrad;
        ctx.fill();
      }

      // Draw nodes
      for (const n of nodes) {
        const pulse = (Math.sin(n.pulse) + 1) / 2;

        if (n.anchor) {
          // Pulse ring for anchor nodes
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * (2 + pulse * 1.5), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(212,160,23,${0.15 * pulse})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(212,160,23,${0.35 + pulse * 0.2})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Glow
        const glowGrad = ctx.createRadialGradient(
          n.x,
          n.y,
          0,
          n.x,
          n.y,
          n.r * 3,
        );
        glowGrad.addColorStop(0, `rgba(212,160,23,${n.alpha * 0.6})`);
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,200,60,${n.alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", initNodes);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.8 }}
      tabIndex={-1}
      aria-hidden="true"
    />
  );
}

export default function EquisPage({ onBack }: EquisPageProps) {
  const [activeFlowStep, setActiveFlowStep] = useState(0);
  const [hoveredPillar, setHoveredPillar] = useState<number | null>(null);

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
    const revealEls = document.querySelectorAll(".equis-reveal");
    for (const el of revealEls) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Cycle through flow steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFlowStep((prev) => (prev + 1) % 7);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  const capitalPillars = [
    {
      color: "#d4a017",
      title: "Impact Investment Facilitation",
      desc: "Structuring mission-aligned investment vehicles with measurable financial and social returns.",
    },
    {
      color: "#4a7ef7",
      title: "Ethical Venture Partnerships",
      desc: "Strategic partnerships with enterprises that share STEMONEF's ethical framework and long-term vision.",
    },
    {
      color: "#22d3b0",
      title: "Grant Management",
      desc: "Institutional grant programs supporting research, talent incubation, and climate initiatives.",
    },
    {
      color: "#a78bfa",
      title: "Revenue Reinvestment",
      desc: "Constitutionally mandated reinvestment of operational surplus into mission-critical work across all pillars.",
    },
  ];

  const flowSteps = [
    { label: "Enterprise Revenue", color: "#d4a017" },
    { label: "EQUIS Review", color: "#e8a020" },
    { label: "Ethical Screening", color: "#f0a82a" },
    { label: "Mission Allocation", color: "#d4a017" },
    { label: "Pillar Funding", color: "#c09010" },
    { label: "Measurable Impact", color: "#b08000" },
    { label: "Report Back", color: "#d4a017" },
  ];

  const programs = [
    {
      num: "01",
      title: "STEMONEF Impact Fund",
      desc: "Active investment vehicle targeting mission-aligned enterprises across deep tech, climate, and health sectors.",
    },
    {
      num: "02",
      title: "Deep Tech Licensing Program",
      desc: "IP licensing generating sustainable revenue from EPOCHS research output — knowledge as sustainable asset.",
    },
    {
      num: "03",
      title: "Equity Partnership Network",
      desc: "12 institutional partners committed to ethical co-investment and aligned impact measurement.",
    },
    {
      num: "04",
      title: "Regenerative Finance Model",
      desc: "Long-cycle investment structures designed for long-term systemic impact rather than short-term return.",
    },
  ];

  const criteria = [
    "Source aligned with STEMONEF values",
    "No extractive or harmful industries",
    "Transparent ownership structure",
    "Long-term mission compatibility",
    "Independent ethics board review",
  ];

  return (
    <div style={{ background: "var(--neural-bg)", minHeight: "100vh" }}>
      {/* Sticky sub-nav */}
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
          data-ocid="equis.back.button"
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
          EQUIS
        </div>
      </div>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[100vh] flex items-center px-6 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, rgba(18,14,2,0.97) 0%, rgba(4,5,14,1) 65%)",
        }}
      >
        <GoldenLatticeCanvas />
        <div
          className="neural-grid-bg absolute inset-0 opacity-15"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full pt-16 pb-24">
          <div
            className="font-mono-geist text-xs tracking-[0.45em] uppercase mb-6"
            style={{
              color: "rgba(212,160,23,0.7)",
              animation: "fade-in-up 0.6s ease forwards",
            }}
          >
            ◆ PILLAR VI — EQUITY & SUSTAINABLE FUNDING
          </div>

          <h1
            className="font-display font-light mb-4"
            style={{
              fontSize: "clamp(4.5rem, 14vw, 11rem)",
              letterSpacing: "0.08em",
              lineHeight: 0.88,
              background:
                "linear-gradient(135deg, #d4a017 0%, #f0c84a 45%, #ffffff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "fade-in-up 0.7s ease forwards",
              animationDelay: "0.1s",
              opacity: 0,
            }}
          >
            EQUIS
          </h1>

          <p
            className="font-display text-2xl md:text-3xl font-light mb-5"
            style={{
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "0.06em",
              animation: "fade-in-up 0.7s ease forwards",
              animationDelay: "0.2s",
              opacity: 0,
            }}
          >
            Capital in Service of Mission
          </p>

          <p
            className="text-sm leading-relaxed mb-8 max-w-2xl"
            style={{
              color: "rgba(255,255,255,0.5)",
              fontFamily: "Sora, sans-serif",
              animation: "fade-in-up 0.7s ease forwards",
              animationDelay: "0.3s",
              opacity: 0,
            }}
          >
            EQUIS is the financial sustainability engine of STEMONEF —
            mobilizing ethical capital, managing impact investments, and
            ensuring the enterprise operates with independence and long-term
            resilience.
          </p>

          {/* Launching Soon badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-sm"
            style={{
              background: "rgba(212,160,23,0.1)",
              border: "1px solid rgba(212,160,23,0.4)",
              animation: "fade-in-up 0.7s ease forwards",
              animationDelay: "0.4s",
              opacity: 0,
            }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse-glow"
              style={{ background: "#d4a017" }}
            />
            <span
              className="font-mono-geist text-xs tracking-[0.3em] uppercase"
              style={{ color: "#d4a017" }}
            >
              Launching Soon
            </span>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent, var(--neural-bg))",
          }}
        />
      </section>

      {/* ── MISSION ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="equis-reveal reveal mb-4">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ MISSION
            </div>
          </div>
          <div
            className="glass-strong p-10 rounded-sm equis-reveal reveal"
            style={{
              borderLeft: "3px solid rgba(212,160,23,0.5)",
              transitionDelay: "0.1s",
            }}
          >
            <p
              className="font-display text-xl md:text-2xl font-light leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.8)",
                letterSpacing: "0.03em",
              }}
            >
              Capital is not neutral. EQUIS operates on the principle that how
              an institution is funded determines what it can truthfully say and
              do. Every capital source is screened. Every return is reinvested.
              No compromise.
            </p>
          </div>
        </div>
      </section>

      {/* ── CAPITAL PILLARS ──────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 equis-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◈ CAPITAL ARCHITECTURE
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              Capital Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {capitalPillars.map((p, i) => (
              <div
                key={p.title}
                className="equis-reveal reveal"
                style={{ transitionDelay: `${i * 0.1}s` }}
                onMouseEnter={() => setHoveredPillar(i)}
                onMouseLeave={() => setHoveredPillar(null)}
              >
                <div
                  className="p-8 rounded-sm h-full transition-all duration-300"
                  style={{
                    background:
                      hoveredPillar === i
                        ? `rgba(${p.color
                            .slice(1)
                            .match(/.{2}/g)!
                            .map((x) => Number.parseInt(x, 16))
                            .join(",")},0.1)`
                        : "rgba(255,255,255,0.025)",
                    border: `1px solid ${hoveredPillar === i ? `${p.color}44` : "rgba(255,255,255,0.07)"}`,
                    backdropFilter: "blur(12px)",
                    borderTop: `2px solid ${p.color}77`,
                    transform:
                      hoveredPillar === i ? "translateY(-4px)" : "none",
                    boxShadow:
                      hoveredPillar === i
                        ? `0 0 30px ${p.color}22, 0 8px 40px rgba(0,0,0,0.4)`
                        : "none",
                  }}
                >
                  <div
                    className="w-8 h-px mb-5"
                    style={{ background: `${p.color}88` }}
                  />
                  <h3
                    className="font-display text-lg font-light mb-3"
                    style={{
                      letterSpacing: "0.1em",
                      color: "rgba(255,255,255,0.88)",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontFamily: "Sora, sans-serif",
                    }}
                  >
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVENUE REINVESTMENT FLOW ────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 equis-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ CONSTITUTIONAL MECHANISM
            </div>
            <h2
              className="font-display text-4xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              Revenue Reinvestment Flow
            </h2>
          </div>

          <div
            className="p-8 rounded-sm equis-reveal reveal"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(212,160,23,0.15)",
              backdropFilter: "blur(12px)",
              transitionDelay: "0.1s",
            }}
          >
            {/* Mobile: vertical flow */}
            <div className="flex flex-col gap-0 md:hidden">
              {flowSteps.map((step, i) => (
                <div key={step.label} className="flex items-stretch">
                  <div className="flex flex-col items-center mr-4">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 transition-all duration-500"
                      style={{
                        background:
                          activeFlowStep >= i
                            ? step.color
                            : "rgba(255,255,255,0.1)",
                        boxShadow:
                          activeFlowStep === i
                            ? `0 0 12px ${step.color}`
                            : "none",
                        transform:
                          activeFlowStep === i ? "scale(1.4)" : "scale(1)",
                      }}
                    />
                    {i < flowSteps.length - 1 && (
                      <div
                        className="w-px flex-1 my-1 transition-all duration-500"
                        style={{
                          background:
                            activeFlowStep > i
                              ? `linear-gradient(to bottom, ${step.color}, ${flowSteps[i + 1].color})`
                              : "rgba(255,255,255,0.1)",
                          minHeight: "20px",
                        }}
                      />
                    )}
                  </div>
                  <div
                    className="pb-4 transition-all duration-500"
                    style={{
                      paddingTop: "2px",
                    }}
                  >
                    <span
                      className="font-mono-geist text-xs tracking-[0.15em] uppercase transition-all duration-500"
                      style={{
                        color:
                          activeFlowStep >= i
                            ? `${step.color}`
                            : "rgba(255,255,255,0.3)",
                        opacity: activeFlowStep >= i ? 1 : 0.5,
                      }}
                    >
                      {step.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: horizontal flow */}
            <div className="hidden md:flex items-center gap-2 overflow-x-auto">
              {flowSteps.map((step, i) => (
                <div
                  key={step.label}
                  className="flex items-center flex-shrink-0"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full transition-all duration-500"
                      style={{
                        background:
                          activeFlowStep >= i
                            ? step.color
                            : "rgba(255,255,255,0.1)",
                        boxShadow:
                          activeFlowStep === i
                            ? `0 0 14px ${step.color}, 0 0 28px ${step.color}55`
                            : "none",
                        transform:
                          activeFlowStep === i ? "scale(1.5)" : "scale(1)",
                      }}
                    />
                    <span
                      className="font-mono-geist text-[9px] tracking-[0.12em] uppercase text-center transition-all duration-500"
                      style={{
                        color:
                          activeFlowStep >= i
                            ? step.color
                            : "rgba(255,255,255,0.3)",
                        maxWidth: "70px",
                        lineHeight: 1.3,
                      }}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < flowSteps.length - 1 && (
                    <div
                      className="mx-2 transition-all duration-500"
                      style={{
                        width: "30px",
                        height: "1px",
                        marginBottom: "18px",
                        background:
                          activeFlowStep > i
                            ? `linear-gradient(to right, ${step.color}, ${flowSteps[i + 1].color})`
                            : "rgba(255,255,255,0.1)",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ACTIVE PROGRAMS ──────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 equis-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◈ ACTIVE OPERATIONS
            </div>
            <h2
              className="font-display text-4xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              Active Programs
            </h2>
          </div>

          <div className="space-y-4">
            {programs.map((prog, i) => (
              <div
                key={prog.title}
                className="equis-reveal reveal"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div
                  className="flex gap-6 items-start p-7 rounded-sm relative overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    backdropFilter: "blur(12px)",
                    borderLeft: "2px solid rgba(212,160,23,0.4)",
                  }}
                >
                  <div
                    className="animate-card-scan pointer-events-none absolute left-0 right-0 z-10"
                    style={{
                      height: "1px",
                      background:
                        "linear-gradient(90deg, transparent, rgba(212,160,23,0.3), transparent)",
                      ["--scan-delay" as string]: `${i * 1.3}s`,
                    }}
                    aria-hidden="true"
                  />
                  <div
                    className="font-mono-geist text-2xl font-light flex-shrink-0 leading-none mt-1"
                    style={{ color: "rgba(212,160,23,0.4)" }}
                  >
                    {prog.num}
                  </div>
                  <div>
                    <h3
                      className="font-display text-xl font-light mb-2"
                      style={{
                        letterSpacing: "0.1em",
                        color: "rgba(255,255,255,0.88)",
                      }}
                    >
                      {prog.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontFamily: "Sora, sans-serif",
                      }}
                    >
                      {prog.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ETHICAL INVESTMENT CRITERIA ──────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 equis-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ CAPITAL GOVERNANCE
            </div>
            <h2
              className="font-display text-4xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              Ethical Investment Criteria
            </h2>
          </div>

          <div
            className="p-8 rounded-sm equis-reveal reveal"
            style={{
              background: "rgba(212,160,23,0.03)",
              border: "1px solid rgba(212,160,23,0.15)",
              backdropFilter: "blur(12px)",
              transitionDelay: "0.1s",
            }}
          >
            <div className="space-y-4">
              {criteria.map((c, i) => (
                <div
                  key={c}
                  className="flex items-center gap-4 py-3 border-b"
                  style={{ borderColor: "rgba(255,255,255,0.04)" }}
                >
                  <span
                    className="text-base flex-shrink-0"
                    style={{ color: "#d4a017" }}
                  >
                    ✓
                  </span>
                  <span
                    className="text-sm"
                    style={{
                      color: "rgba(255,255,255,0.65)",
                      fontFamily: "Sora, sans-serif",
                    }}
                  >
                    {c}
                  </span>
                  <span
                    className="font-mono-geist text-[9px] tracking-[0.2em] ml-auto flex-shrink-0"
                    style={{ color: "rgba(212,160,23,0.35)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMING SOON ──────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div
            className="p-12 rounded-sm text-center equis-reveal reveal relative overflow-hidden"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,160,23,0.08) 0%, rgba(4,5,14,0.95) 60%)",
              border: "1px solid rgba(212,160,23,0.25)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div
              className="animate-card-scan pointer-events-none absolute left-0 right-0 z-10"
              style={{
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(212,160,23,0.5), transparent)",
              }}
              aria-hidden="true"
            />

            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-5"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ INAUGURAL CYCLE
            </div>
            <h2
              className="font-display text-3xl md:text-4xl font-light mb-5 text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              Structuring Now
            </h2>
            <p
              className="text-sm leading-relaxed max-w-xl mx-auto"
              style={{
                color: "rgba(255,255,255,0.5)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              EQUIS is currently structuring its inaugural investment cycle.
              Accredited investors and institutional partners committed to
              ethical capital deployment can register early interest. Capital
              must earn its place here.
            </p>
          </div>
        </div>
      </section>

      {/* Legal Footer */}
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
