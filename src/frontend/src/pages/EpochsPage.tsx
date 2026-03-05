import { useEffect, useRef, useState } from "react";

interface EpochsPageProps {
  onBack: () => void;
}

const LEGAL_NOTE =
  "EPOCHS™, HUMANON™, STEAMI™ and all associated initiatives operate under the parent institution THE STEMONEF™ ENTERPRISES.";

function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const nodes: { x: number; y: number; vx: number; vy: number; r: number }[] =
      [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 28; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2.5 + 1,
      });
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(74,126,247,0.5)";
        ctx.fill();
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(74,126,247,${0.12 * (1 - dist / 160)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.35 }}
      tabIndex={-1}
    />
  );
}

function PipelineNode({
  label,
  index,
  total,
}: { label: string; index: number; total: number }) {
  const isLast = index === total - 1;
  return (
    <div className="flex items-center">
      <div
        className="flex flex-col items-center gap-1"
        style={{ animationDelay: `${index * 0.15}s` }}
      >
        <div
          className="px-4 py-3 rounded-sm text-center animate-fade-in-up"
          style={{
            background: "rgba(74,126,247,0.08)",
            border: "1px solid rgba(74,126,247,0.25)",
            backdropFilter: "blur(12px)",
            minWidth: "140px",
            animationDelay: `${index * 0.18}s`,
          }}
        >
          <div
            className="font-mono-geist text-[9px] tracking-[0.2em] uppercase mb-1"
            style={{ color: "rgba(212,160,23,0.7)" }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>
          <div
            className="font-mono-geist text-xs"
            style={{ color: "rgba(255,255,255,0.8)", letterSpacing: "0.05em" }}
          >
            {label}
          </div>
        </div>
      </div>
      {!isLast && (
        <div className="flex items-center mx-2">
          <div
            className="progress-flow-line"
            style={{ width: "40px", height: "1px" }}
          />
          <span
            className="font-mono-geist text-xs ml-1"
            style={{ color: "rgba(212,160,23,0.6)" }}
          >
            →
          </span>
        </div>
      )}
    </div>
  );
}

export default function EpochsPage({ onBack }: EpochsPageProps) {
  const [hoveredGaia, setHoveredGaia] = useState<number | null>(null);
  const revealRef = useRef<HTMLDivElement>(null);

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
    const revealEls = document.querySelectorAll(".epochs-reveal");
    for (const el of revealEls) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const gaiaFocusAreas = [
    "Climate modeling and prediction",
    "Sustainable healthcare",
    "Environmental impact assessment",
    "Carbon capture systems",
    "Renewable energy integration",
  ];

  const pipelineSteps = [
    "Intelligence Platforms",
    "Operating Systems",
    "IoT Networks",
    "Analytics Infrastructure",
    "Sustainability Enterprise Systems",
  ];

  return (
    <div
      ref={revealRef}
      style={{ background: "var(--neural-bg)", minHeight: "100vh" }}
    >
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
          data-ocid="epochs.back.button"
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
          style={{ color: "rgba(74,126,247,0.7)" }}
        >
          EPOCHS
        </div>
      </div>

      {/* Hero */}
      <section
        className="relative min-h-[90vh] flex items-center px-6 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, rgba(10,18,50,0.9) 0%, rgba(4,5,14,1) 60%)",
        }}
      >
        <AnimatedBackground />
        <div
          className="neural-grid-bg absolute inset-0 opacity-30"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full pt-16 pb-20">
          <div
            className="font-mono-geist text-xs tracking-[0.4em] uppercase mb-6 animate-fade-in-up"
            style={{ color: "rgba(212,160,23,0.7)" }}
          >
            ◈ RESEARCH & INNOVATION ORGANIZATION
          </div>

          <h1
            className="font-display font-light text-gradient-hero mb-6 animate-fade-in-up"
            style={{
              fontSize: "clamp(4rem, 12vw, 9rem)",
              letterSpacing: "0.1em",
              lineHeight: 0.9,
              animationDelay: "0.1s",
            }}
          >
            EPOCHS
          </h1>

          <p
            className="font-display text-2xl md:text-3xl font-light mb-6 animate-fade-in-up"
            style={{
              color: "rgba(255,255,255,0.65)",
              letterSpacing: "0.06em",
              maxWidth: "700px",
              animationDelay: "0.2s",
            }}
          >
            Emergent Projects ON Climate, Human &amp; Systems Research
          </p>

          <div
            className="animate-fade-in-up"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              background: "rgba(74,126,247,0.08)",
              border: "1px solid rgba(74,126,247,0.2)",
              borderRadius: "2px",
              animationDelay: "0.3s",
            }}
          >
            <span
              className="font-mono-geist text-xs tracking-[0.25em] uppercase"
              style={{ color: "rgba(138,180,255,0.8)" }}
            >
              Primary Research &amp; Innovation Organization of STEMONEF
              Enterprises
            </span>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent, var(--neural-bg))",
          }}
        />
      </section>

      {/* Mission */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div
            className="epochs-reveal reveal"
            style={{ transitionDelay: "0s" }}
          >
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-4"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ MISSION
            </div>
          </div>
          <div
            className="glass-strong p-10 rounded-sm epochs-reveal reveal"
            style={{
              borderLeft: "3px solid rgba(74,126,247,0.5)",
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
              Conduct research across climate, technology, and medical domains
              while maintaining the highest ethical standards and translating
              discoveries into practical societal solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Project GAIA */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 epochs-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◈ ACTIVE RESEARCH INITIATIVE
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              PROJECT GAIA
            </h2>
            <p
              className="mt-3 text-sm"
              style={{
                color: "rgba(255,255,255,0.4)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              Climate &amp; Sustainability Research
            </p>
          </div>

          {/* GAIA node cluster */}
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {gaiaFocusAreas.map((area, i) => (
                <div
                  key={area}
                  data-ocid={`epochs.gaia.card.${i + 1}`}
                  className="epochs-reveal reveal relative"
                  style={{ transitionDelay: `${i * 0.08}s` }}
                  onMouseEnter={() => setHoveredGaia(i)}
                  onMouseLeave={() => setHoveredGaia(null)}
                >
                  <div
                    className="p-6 rounded-sm h-full transition-all duration-300"
                    style={{
                      background:
                        hoveredGaia === i
                          ? "rgba(52,211,153,0.1)"
                          : "rgba(52,211,153,0.04)",
                      border:
                        hoveredGaia === i
                          ? "1px solid rgba(52,211,153,0.4)"
                          : "1px solid rgba(52,211,153,0.12)",
                      backdropFilter: "blur(12px)",
                      boxShadow:
                        hoveredGaia === i
                          ? "0 0 20px rgba(52,211,153,0.1), 0 8px 32px rgba(0,0,0,0.4)"
                          : "none",
                      transform:
                        hoveredGaia === i ? "translateY(-4px)" : "none",
                    }}
                  >
                    {/* Animated lab node */}
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className="w-2 h-2 rounded-full animate-node-pulse"
                        style={{
                          background: "rgba(52,211,153,0.8)",
                          animationDelay: `${i * 0.3}s`,
                        }}
                      />
                      <div
                        className="font-mono-geist text-[9px] tracking-[0.2em] uppercase"
                        style={{ color: "rgba(52,211,153,0.7)" }}
                      >
                        NODE {String(i + 1).padStart(2, "0")}
                      </div>
                    </div>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        fontFamily: "Sora, sans-serif",
                      }}
                    >
                      {area}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Labs */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 epochs-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ RESEARCH LABORATORIES
            </div>
            <h2
              className="font-display text-4xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              Active Labs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LAB INVOS */}
            <div
              className="glass-strong p-8 rounded-sm epochs-reveal reveal"
              style={{
                borderTop: "2px solid rgba(74,126,247,0.5)",
                transitionDelay: "0.1s",
              }}
            >
              <div
                className="font-mono-geist text-[10px] tracking-[0.35em] uppercase mb-2"
                style={{ color: "rgba(74,126,247,0.7)" }}
              >
                LABORATORY I
              </div>
              <h3
                className="font-display text-2xl font-light mb-2"
                style={{
                  letterSpacing: "0.15em",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                LAB INVOS
              </h3>
              <p
                className="text-xs mb-6"
                style={{
                  color: "rgba(212,160,23,0.7)",
                  fontFamily: "Geist Mono, monospace",
                  letterSpacing: "0.1em",
                }}
              >
                Research-Focused Laboratory
              </p>
              <ul className="space-y-3">
                {[
                  "Fundamental climate science",
                  "Environmental monitoring systems",
                  "Sustainability theory",
                  "Data analysis methodologies",
                  "Interdisciplinary climate research",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div
                      className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
                      style={{ background: "rgba(74,126,247,0.7)" }}
                    />
                    <span
                      className="text-sm"
                      style={{
                        color: "rgba(255,255,255,0.6)",
                        fontFamily: "Sora, sans-serif",
                      }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* LAB NEIA */}
            <div
              className="glass-strong p-8 rounded-sm epochs-reveal reveal"
              style={{
                borderTop: "2px solid rgba(167,139,250,0.5)",
                transitionDelay: "0.2s",
              }}
            >
              <div
                className="font-mono-geist text-[10px] tracking-[0.35em] uppercase mb-2"
                style={{ color: "rgba(167,139,250,0.7)" }}
              >
                LABORATORY II
              </div>
              <h3
                className="font-display text-2xl font-light mb-2"
                style={{
                  letterSpacing: "0.15em",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                LAB NEIA
              </h3>
              <p
                className="text-xs mb-6"
                style={{
                  color: "rgba(212,160,23,0.7)",
                  fontFamily: "Geist Mono, monospace",
                  letterSpacing: "0.1em",
                }}
              >
                Development-Focused Laboratory
              </p>
              <ul className="space-y-3">
                {[
                  "Sustainable technology prototyping",
                  "Climate solution testing",
                  "Environmental intervention scaling",
                  "Implementation partnerships",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div
                      className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
                      style={{ background: "rgba(167,139,250,0.7)" }}
                    />
                    <span
                      className="text-sm"
                      style={{
                        color: "rgba(255,255,255,0.6)",
                        fontFamily: "Sora, sans-serif",
                      }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Project EIOS */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 epochs-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ DEEP TECHNOLOGY INITIATIVE
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              PROJECT EIOS
            </h2>
            <p
              className="mt-3 text-sm"
              style={{
                color: "rgba(255,255,255,0.4)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              Deep Technology &amp; Intelligence Systems
            </p>
          </div>

          <div
            className="glass p-8 rounded-sm epochs-reveal reveal overflow-x-auto"
            style={{ transitionDelay: "0.1s" }}
          >
            <div className="flex items-center flex-nowrap gap-0 min-w-max mx-auto justify-start lg:justify-center">
              {pipelineSteps.map((step, i) => (
                <PipelineNode
                  key={step}
                  label={step}
                  index={i}
                  total={pipelineSteps.length}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Project STEMESA */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 epochs-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◈ ETHICAL AI INITIATIVE
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              PROJECT STEMESA
            </h2>
            <p
              className="mt-3 text-sm"
              style={{
                color: "rgba(255,255,255,0.4)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              Ethical AI Development
            </p>
          </div>

          <div
            className="glass-strong p-8 rounded-sm epochs-reveal reveal relative overflow-hidden"
            style={{
              borderLeft: "3px solid rgba(212,160,23,0.4)",
              transitionDelay: "0.15s",
            }}
          >
            {/* Conceptual badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm mb-6"
              style={{
                background: "rgba(212,160,23,0.1)",
                border: "1px solid rgba(212,160,23,0.3)",
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
                style={{ background: "#d4a017" }}
              />
              <span
                className="font-mono-geist text-[10px] tracking-[0.3em] uppercase text-gradient-gold"
                style={{ letterSpacing: "0.2em" }}
              >
                Conceptual Development Stage
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                "Brain research",
                "Cognitive modeling",
                "Human-AI interaction",
                "Healthcare AI",
                "Bias mitigation",
                "Explainable AI frameworks",
              ].map((topic) => (
                <div
                  key={topic}
                  className="flex items-center gap-3 py-3 px-4"
                  style={{
                    background: "rgba(212,160,23,0.04)",
                    border: "1px solid rgba(212,160,23,0.1)",
                    borderRadius: "2px",
                  }}
                >
                  <div
                    className="w-1 h-1 rounded-full flex-shrink-0"
                    style={{ background: "rgba(212,160,23,0.6)" }}
                  />
                  <span
                    className="text-sm"
                    style={{
                      color: "rgba(255,255,255,0.65)",
                      fontFamily: "Sora, sans-serif",
                    }}
                  >
                    {topic}
                  </span>
                </div>
              ))}
            </div>
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
