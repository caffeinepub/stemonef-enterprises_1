import { useEffect, useRef, useState } from "react";
import { useSubmitCollaborationRequest } from "../hooks/useQueries";

interface TerraPageProps {
  onBack: () => void;
}

const LEGAL_NOTE =
  "TERRA™ and all associated initiatives operate under the parent institution THE STEMONEF™ ENTERPRISES.";

function WireframeGlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Field station dots (lat/lng mapped to sphere coords)
    const stations = [
      { lat: 51.5, lng: -0.1 }, // London
      { lat: -33.9, lng: 18.4 }, // Cape Town
      { lat: 35.7, lng: 139.7 }, // Tokyo
      { lat: 40.7, lng: -74.0 }, // New York
      { lat: -34.6, lng: -58.4 }, // Buenos Aires
      { lat: 28.6, lng: 77.2 }, // Delhi
      { lat: -3.7, lng: -38.5 }, // Fortaleza
      { lat: 64.1, lng: -21.9 }, // Reykjavik
      { lat: 1.3, lng: 103.8 }, // Singapore
      { lat: -23.5, lng: -46.6 }, // São Paulo
      { lat: 55.7, lng: 37.6 }, // Moscow
      { lat: -37.8, lng: 144.9 }, // Melbourne
    ];

    const stationPulse = stations.map(() => Math.random());

    function project(
      lat: number,
      lng: number,
      rotation: number,
      r: number,
      cx: number,
      cy: number,
    ) {
      const phi = ((90 - lat) * Math.PI) / 180;
      const theta = ((lng + rotation) * Math.PI) / 180;
      const x3 = r * Math.sin(phi) * Math.cos(theta);
      const y3 = r * Math.cos(phi);
      const z3 = r * Math.sin(phi) * Math.sin(theta);
      // perspective projection (very simple)
      const scale = 800 / (800 + z3 * 0.5);
      return {
        x: cx + x3 * scale,
        y: cy - y3 * scale,
        z: z3,
        visible: z3 > -r * 0.15,
      };
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = Math.min(canvas.width, canvas.height) * 0.38;
      const rotation = (t * 8) % 360;

      t += 0.004;

      // Aurora atmosphere background
      const auroraGrad = ctx.createRadialGradient(
        cx,
        cy - r * 0.5,
        r * 0.2,
        cx,
        cy,
        r * 2.2,
      );
      auroraGrad.addColorStop(0, "rgba(34,211,176,0.04)");
      auroraGrad.addColorStop(0.4, "rgba(8,145,178,0.03)");
      auroraGrad.addColorStop(0.7, "rgba(34,211,176,0.02)");
      auroraGrad.addColorStop(1, "transparent");
      ctx.fillStyle = auroraGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Outer atmosphere glow ring
      const atmosGrad = ctx.createRadialGradient(
        cx,
        cy,
        r * 0.95,
        cx,
        cy,
        r * 1.25,
      );
      atmosGrad.addColorStop(0, "transparent");
      atmosGrad.addColorStop(0.5, "rgba(34,211,176,0.08)");
      atmosGrad.addColorStop(1, "transparent");
      ctx.fillStyle = atmosGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // Globe dark fill
      const globeGrad = ctx.createRadialGradient(
        cx - r * 0.25,
        cy - r * 0.25,
        r * 0.05,
        cx,
        cy,
        r,
      );
      globeGrad.addColorStop(0, "rgba(8,20,15,0.95)");
      globeGrad.addColorStop(0.7, "rgba(4,10,8,0.98)");
      globeGrad.addColorStop(1, "rgba(2,6,4,1)");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = globeGrad;
      ctx.fill();

      // Latitude grid lines
      for (let lat = -60; lat <= 60; lat += 30) {
        const phi = ((90 - lat) * Math.PI) / 180;
        const ry_e = r * Math.sin(phi);
        const y_e = cy - r * Math.cos(phi);
        ctx.beginPath();
        ctx.ellipse(cx, y_e, ry_e, ry_e * 0.25, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(34,211,176,${lat === 0 ? 0.15 : 0.07})`;
        ctx.lineWidth = lat === 0 ? 1 : 0.5;
        ctx.stroke();
      }

      // Longitude grid lines (wireframe arcs)
      for (let lng = 0; lng < 360; lng += 30) {
        const adjustedLng = lng + rotation;
        const a = (adjustedLng * Math.PI) / 180;
        const cosA = Math.cos(a);
        const sinA = Math.sin(a);
        // draw arc from top to bottom
        ctx.beginPath();
        let first = true;
        for (let lat = -90; lat <= 90; lat += 5) {
          const phi = ((90 - lat) * Math.PI) / 180;
          const x3 = r * Math.sin(phi) * cosA;
          const y3 = r * Math.cos(phi);
          const z3 = r * Math.sin(phi) * sinA;
          if (z3 < -r * 0.2) {
            first = true;
            continue;
          }
          const scale = 800 / (800 + z3 * 0.3);
          const px = cx + x3 * scale;
          const py = cy - y3 * scale;
          if (first) {
            ctx.moveTo(px, py);
            first = false;
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.strokeStyle = "rgba(34,211,176,0.07)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Field station dots
      for (let i = 0; i < stations.length; i++) {
        stationPulse[i] = (stationPulse[i] + 0.015) % (Math.PI * 2);
        const pos = project(
          stations[i].lat,
          stations[i].lng,
          rotation,
          r,
          cx,
          cy,
        );
        if (!pos.visible) continue;

        const pulse = (Math.sin(stationPulse[i]) + 1) / 2;
        const dotR = 3.5 + pulse * 2;
        const alpha = 0.6 + pulse * 0.4;

        // Pulse ring
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, dotR * 3, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(34,211,176,${pulse * 0.25})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Outer ring
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, dotR + 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(34,211,176,${alpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Dot
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, dotR * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,211,176,${alpha})`;
        ctx.fill();
      }

      // Globe edge highlight
      const edgeGrad = ctx.createRadialGradient(cx, cy, r * 0.75, cx, cy, r);
      edgeGrad.addColorStop(0, "transparent");
      edgeGrad.addColorStop(1, "rgba(8,145,178,0.2)");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = edgeGrad;
      ctx.fill();

      // North pole glow
      const polePos = project(90, 0, rotation, r, cx, cy);
      if (polePos.visible) {
        const pGrad = ctx.createRadialGradient(
          polePos.x,
          polePos.y,
          0,
          polePos.x,
          polePos.y,
          30,
        );
        pGrad.addColorStop(0, "rgba(34,211,176,0.15)");
        pGrad.addColorStop(1, "transparent");
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(polePos.x, polePos.y, 30, 0, Math.PI * 2);
        ctx.fill();
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
      style={{ opacity: 0.9 }}
      tabIndex={-1}
      aria-hidden="true"
    />
  );
}

export default function TerraPage({ onBack }: TerraPageProps) {
  const [hoveredFocus, setHoveredFocus] = useState<number | null>(null);

  // Register Interest form
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const submitRequest = useSubmitCollaborationRequest();

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
    const revealEls = document.querySelectorAll(".terra-reveal");
    for (const el of revealEls) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const focusAreas = [
    {
      color: "#4a7ef7",
      title: "Climate Systems Modeling",
      desc: "Predictive modeling of planetary climate trajectories and feedback loops across decades and centuries.",
    },
    {
      color: "#22d3b0",
      title: "Biodiversity Assessment",
      desc: "Comprehensive biodiversity indexing across ecosystems, tracking species, habitats, and ecological networks.",
    },
    {
      color: "#d4a017",
      title: "Carbon Systems Analysis",
      desc: "Carbon capture, sequestration, and emission modeling across natural and industrial systems.",
    },
    {
      color: "#0891b2",
      title: "Ocean & Water Systems",
      desc: "Marine ecology, freshwater systems, hydrological cycles, and ocean warming impact assessments.",
    },
    {
      color: "#a78bfa",
      title: "Restoration Science",
      desc: "Field-based ecological restoration interventions — measuring, scaling, and validating outcomes.",
    },
  ];

  const initiatives = [
    {
      num: "01",
      title: "Project GAIA",
      desc: "Planetary Health Index spanning 80+ global indicators across climate, biodiversity, and human systems.",
    },
    {
      num: "02",
      title: "Reforestation Pilot",
      desc: "Active ecological restoration across 12 pilot sites in three climate zones.",
    },
    {
      num: "03",
      title: "Ocean Systems Lab",
      desc: "Deep marine ecology and warming impact studies in partnership with coastal research institutions.",
    },
    {
      num: "04",
      title: "Climate Equity Framework",
      desc: "Linking climate impact data to social vulnerability indices — science in service of justice.",
    },
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
          data-ocid="terra.back.button"
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
              "rgba(34,211,176,0.9)";
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
          TERRA
        </div>
      </div>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[100vh] flex items-center px-6 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, rgba(2,14,10,0.97) 0%, rgba(4,5,14,1) 65%)",
        }}
      >
        <WireframeGlobeCanvas />
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
            ◆ PILLAR V — CLIMATE & NATURAL LIFE
          </div>

          <h1
            className="font-display font-light mb-4"
            style={{
              fontSize: "clamp(4.5rem, 14vw, 11rem)",
              letterSpacing: "0.08em",
              lineHeight: 0.88,
              background:
                "linear-gradient(135deg, #22d3b0 0%, #0891b2 40%, #ffffff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "fade-in-up 0.7s ease forwards",
              animationDelay: "0.1s",
              opacity: 0,
            }}
          >
            TERRA
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
            Where Science Meets the Living Earth
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
            TERRA anchors STEMONEF's environmental mandate — conducting
            planetary-scale research into climate systems, biodiversity, and
            ecological resilience. Every discovery moves the enterprise closer
            to a sustainable future.
          </p>

          {/* Launching Soon badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-sm"
            style={{
              background: "rgba(34,211,176,0.08)",
              border: "1px solid rgba(34,211,176,0.35)",
              animation: "fade-in-up 0.7s ease forwards",
              animationDelay: "0.4s",
              opacity: 0,
            }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse-glow"
              style={{ background: "#22d3b0" }}
            />
            <span
              className="font-mono-geist text-xs tracking-[0.3em] uppercase"
              style={{ color: "#22d3b0" }}
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
          <div className="terra-reveal reveal mb-4">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ MISSION
            </div>
          </div>
          <div
            className="glass-strong p-10 rounded-sm terra-reveal reveal"
            style={{
              borderLeft: "3px solid rgba(34,211,176,0.5)",
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
              The planet does not negotiate. TERRA operates on the premise that
              environmental science must translate directly into policy,
              intervention, and measurable outcome — with full respect for
              natural systems and indigenous knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* ── RESEARCH FOCUS AREAS ─────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 terra-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◈ RESEARCH DOMAINS
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              Research Focus Areas
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {focusAreas.map((area, i) => (
              <div
                key={area.title}
                className="terra-reveal reveal"
                style={{ transitionDelay: `${i * 0.08}s` }}
                onMouseEnter={() => setHoveredFocus(i)}
                onMouseLeave={() => setHoveredFocus(null)}
              >
                <div
                  className="p-6 rounded-sm h-full transition-all duration-300 relative overflow-hidden"
                  style={{
                    background:
                      hoveredFocus === i
                        ? `rgba(${area.color
                            .slice(1)
                            .match(/.{2}/g)!
                            .map((x) => Number.parseInt(x, 16))
                            .join(",")},0.12)`
                        : "rgba(255,255,255,0.025)",
                    border: `1px solid ${hoveredFocus === i ? `${area.color}44` : "rgba(255,255,255,0.07)"}`,
                    backdropFilter: "blur(12px)",
                    borderTop: `2px solid ${area.color}77`,
                    transform: hoveredFocus === i ? "translateY(-5px)" : "none",
                    boxShadow:
                      hoveredFocus === i
                        ? `0 0 25px ${area.color}22, 0 8px 40px rgba(0,0,0,0.4)`
                        : "none",
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full mb-4 animate-node-pulse"
                    style={{
                      background: area.color,
                      animationDelay: `${i * 0.3}s`,
                    }}
                  />
                  <h3
                    className="font-display text-base font-light mb-3"
                    style={{
                      letterSpacing: "0.08em",
                      color: "rgba(255,255,255,0.88)",
                    }}
                  >
                    {area.title}
                  </h3>
                  <p
                    className="text-xs leading-relaxed"
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      fontFamily: "Sora, sans-serif",
                    }}
                  >
                    {area.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACTIVE INITIATIVES ──────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 terra-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ ACTIVE OPERATIONS
            </div>
            <h2
              className="font-display text-4xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              Active Initiatives
            </h2>
          </div>

          <div className="space-y-4">
            {initiatives.map((init, i) => (
              <div
                key={init.title}
                className="terra-reveal reveal"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div
                  className="flex gap-6 items-start p-7 rounded-sm relative overflow-hidden transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    backdropFilter: "blur(12px)",
                    borderLeft: "2px solid rgba(34,211,176,0.4)",
                  }}
                >
                  {/* Scan animation */}
                  <div
                    className="animate-card-scan pointer-events-none absolute left-0 right-0 z-10"
                    style={{
                      height: "1px",
                      background:
                        "linear-gradient(90deg, transparent, rgba(34,211,176,0.3), transparent)",
                      ["--scan-delay" as string]: `${i * 1.2}s`,
                    }}
                    aria-hidden="true"
                  />

                  <div
                    className="font-mono-geist text-2xl font-light flex-shrink-0 leading-none mt-1"
                    style={{ color: "rgba(34,211,176,0.4)" }}
                  >
                    {init.num}
                  </div>
                  <div>
                    <h3
                      className="font-display text-xl font-light mb-2"
                      style={{
                        letterSpacing: "0.1em",
                        color: "rgba(255,255,255,0.88)",
                      }}
                    >
                      {init.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontFamily: "Sora, sans-serif",
                      }}
                    >
                      {init.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FIELD OPERATIONS ─────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 terra-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◈ OPERATIONAL INFRASTRUCTURE
            </div>
            <h2
              className="font-display text-4xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              Field Operations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className="glass-strong p-8 rounded-sm terra-reveal reveal"
              style={{
                borderTop: "2px solid rgba(34,211,176,0.5)",
                transitionDelay: "0.1s",
              }}
            >
              <div
                className="font-mono-geist text-[10px] tracking-[0.35em] uppercase mb-2"
                style={{ color: "rgba(34,211,176,0.7)" }}
              >
                UNIT I
              </div>
              <h3
                className="font-display text-2xl font-light mb-2"
                style={{
                  letterSpacing: "0.12em",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                Field Research Network
              </h3>
              <p
                className="text-xs mb-6"
                style={{
                  color: "rgba(212,160,23,0.7)",
                  fontFamily: "Geist Mono, monospace",
                  letterSpacing: "0.1em",
                }}
              >
                Distributed Ecological Intelligence
              </p>
              <ul className="space-y-3">
                {[
                  "Distributed research stations across 6 climate zones",
                  "Mobile monitoring units and field laboratories",
                  "Indigenous partner programs and co-research protocols",
                  "Real-time ecological data collection and telemetry",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div
                      className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
                      style={{ background: "rgba(34,211,176,0.7)" }}
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

            <div
              className="glass-strong p-8 rounded-sm terra-reveal reveal"
              style={{
                borderTop: "2px solid rgba(8,145,178,0.5)",
                transitionDelay: "0.2s",
              }}
            >
              <div
                className="font-mono-geist text-[10px] tracking-[0.35em] uppercase mb-2"
                style={{ color: "rgba(8,145,178,0.7)" }}
              >
                UNIT II
              </div>
              <h3
                className="font-display text-2xl font-light mb-2"
                style={{
                  letterSpacing: "0.12em",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                Policy Translation Unit
              </h3>
              <p
                className="text-xs mb-6"
                style={{
                  color: "rgba(212,160,23,0.7)",
                  fontFamily: "Geist Mono, monospace",
                  letterSpacing: "0.1em",
                }}
              >
                Science to Governance Pipeline
              </p>
              <ul className="space-y-3">
                {[
                  "Converting field findings into actionable policy briefs",
                  "Direct engagement with climate governance bodies",
                  "Public advocacy grounded in peer-reviewed science",
                  "Collaboration with international climate frameworks",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div
                      className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
                      style={{ background: "rgba(8,145,178,0.7)" }}
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

      {/* ── GOVERNANCE NOTE ──────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className="p-8 rounded-sm terra-reveal reveal"
            style={{
              background: "rgba(34,211,176,0.03)",
              border: "1px solid rgba(34,211,176,0.15)",
              backdropFilter: "blur(12px)",
              transitionDelay: "0.1s",
            }}
          >
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-4"
              style={{ color: "rgba(34,211,176,0.6)" }}
            >
              ◆ GOVERNANCE PRINCIPLE
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.6)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              All TERRA interventions follow the precautionary principle.
              Indigenous knowledge rights are recognized and protected in all
              field operations and publications. No extraction without
              reciprocity. Our presence in a community must leave it better than
              we found it.
            </p>
          </div>
        </div>
      </section>

      {/* ── REGISTER INTEREST ────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="terra-reveal reveal mb-6">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(34,211,176,0.7)" }}
            >
              ◆ ENTERING INAUGURAL PHASE
            </div>
            <h2
              className="font-display text-3xl md:text-4xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              Register Your Interest
            </h2>
            <p
              className="mt-3 text-sm leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.45)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              TERRA field operations are entering their inaugural phase.
              Register your interest to join the research network when we open.
            </p>
          </div>

          {submitted ? (
            <div
              data-ocid="terra.success_state"
              className="p-8 rounded-sm text-center animate-fade-in-up terra-reveal reveal"
              style={{
                background: "rgba(34,211,176,0.06)",
                border: "1px solid rgba(34,211,176,0.3)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div
                className="w-3 h-3 rounded-full animate-pulse-glow mx-auto mb-4"
                style={{ background: "#22d3b0" }}
              />
              <p
                className="font-display text-xl font-light"
                style={{
                  color: "rgba(255,255,255,0.85)",
                  letterSpacing: "0.06em",
                }}
              >
                Thank you — your interest has been registered.
              </p>
              <p
                className="mt-2 text-xs"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                The TERRA team will reach out when field operations open.
              </p>
            </div>
          ) : (
            <form
              data-ocid="terra.dialog"
              className="terra-reveal reveal p-8 rounded-sm relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(34,211,176,0.22)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 0 40px rgba(34,211,176,0.04)",
              }}
              onSubmit={async (e) => {
                e.preventDefault();
                if (!formName || !formEmail) return;
                try {
                  await submitRequest.mutateAsync({
                    name: formName,
                    email: formEmail,
                    pathway: "TERRA",
                    message: formMessage,
                  });
                  setSubmitted(true);
                } catch {
                  setSubmitted(true);
                }
              }}
            >
              <div
                className="animate-card-scan pointer-events-none absolute left-0 right-0 z-10"
                style={{
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(34,211,176,0.35), transparent)",
                }}
                aria-hidden="true"
              />

              <div className="space-y-4">
                <div>
                  <label
                    className="font-mono-geist text-[10px] tracking-[0.3em] uppercase block mb-1.5"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                    htmlFor="terra-name"
                  >
                    Full Name
                  </label>
                  <input
                    id="terra-name"
                    type="text"
                    data-ocid="terra.input"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 text-sm outline-none rounded-sm transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.85)",
                      fontFamily: "Sora, sans-serif",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(34,211,176,0.5)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.1)";
                    }}
                  />
                </div>

                <div>
                  <label
                    className="font-mono-geist text-[10px] tracking-[0.3em] uppercase block mb-1.5"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                    htmlFor="terra-email"
                  >
                    Email Address
                  </label>
                  <input
                    id="terra-email"
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 text-sm outline-none rounded-sm transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.85)",
                      fontFamily: "Sora, sans-serif",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(34,211,176,0.5)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.1)";
                    }}
                  />
                </div>

                <div>
                  <label
                    className="font-mono-geist text-[10px] tracking-[0.3em] uppercase block mb-1.5"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                    htmlFor="terra-message"
                  >
                    Why You&apos;re Interested{" "}
                    <span style={{ color: "rgba(255,255,255,0.2)" }}>
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id="terra-message"
                    data-ocid="terra.textarea"
                    rows={3}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Tell us about your interest in TERRA..."
                    className="w-full px-4 py-3 text-sm outline-none rounded-sm resize-none transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.85)",
                      fontFamily: "Sora, sans-serif",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(34,211,176,0.5)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.1)";
                    }}
                  />
                </div>

                <button
                  type="submit"
                  data-ocid="terra.submit_button"
                  disabled={submitRequest.isPending}
                  className="w-full py-3 text-xs tracking-[0.25em] uppercase transition-all duration-200 rounded-sm"
                  style={{
                    background: submitRequest.isPending
                      ? "rgba(34,211,176,0.05)"
                      : "rgba(34,211,176,0.1)",
                    border: "1px solid rgba(34,211,176,0.4)",
                    color: "#22d3b0",
                    fontFamily: "Geist Mono, monospace",
                    letterSpacing: "0.2em",
                    cursor: submitRequest.isPending ? "not-allowed" : "pointer",
                    boxShadow: "0 0 20px rgba(34,211,176,0.06)",
                  }}
                  onMouseEnter={(e) => {
                    if (!submitRequest.isPending)
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(34,211,176,0.18)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(34,211,176,0.1)";
                  }}
                >
                  {submitRequest.isPending
                    ? "REGISTERING..."
                    : "REGISTER INTEREST →"}
                </button>
              </div>
            </form>
          )}
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
