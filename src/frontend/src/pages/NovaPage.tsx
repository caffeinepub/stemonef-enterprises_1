import { useEffect, useRef, useState } from "react";
import { useSubmitCollaborationRequest } from "../hooks/useQueries";

interface NovaPageProps {
  onBack: () => void;
}

const LEGAL_NOTE =
  "NOVA™ and all associated initiatives operate under the parent institution THE STEMONEF™ ENTERPRISES.";

function OrbitalSphereCanvas() {
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

    // Orbit ring parameters
    const orbitRings = [
      { rx: 220, ry: 60, tilt: 0.2, speed: 0.004, color: "rgba(212,160,23," },
      { rx: 180, ry: 80, tilt: -0.5, speed: -0.006, color: "rgba(74,126,247," },
      { rx: 260, ry: 50, tilt: 0.8, speed: 0.003, color: "rgba(232,108,58," },
    ];

    // Particle nodes on orbits
    const particles: {
      orbitIdx: number;
      angle: number;
      size: number;
      alpha: number;
    }[] = [];
    for (let i = 0; i < 18; i++) {
      particles.push({
        orbitIdx: i % 3,
        angle: (Math.PI * 2 * i) / 18,
        size: Math.random() * 3 + 1.5,
        alpha: Math.random() * 0.6 + 0.4,
      });
    }

    // Data stream lines
    const streams: {
      angle: number;
      length: number;
      speed: number;
      progress: number;
      alpha: number;
    }[] = [];
    for (let i = 0; i < 12; i++) {
      streams.push({
        angle: (Math.PI * 2 * i) / 12,
        length: 100 + Math.random() * 80,
        speed: 0.008 + Math.random() * 0.006,
        progress: Math.random(),
        alpha: Math.random() * 0.3 + 0.15,
      });
    }

    function getOrbitalPos(ring: (typeof orbitRings)[0], angle: number) {
      const cx = canvas!.width / 2;
      const cy = canvas!.height / 2;
      const x = cx + ring.rx * Math.cos(angle);
      const y = cy + ring.ry * Math.sin(angle) * Math.cos(ring.tilt);
      return { x, y };
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const sphereR = 110;

      t += 0.008;

      // Background glow behind sphere
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, sphereR * 2.5);
      bgGrad.addColorStop(0, "rgba(232,108,58,0.06)");
      bgGrad.addColorStop(0.4, "rgba(212,160,23,0.04)");
      bgGrad.addColorStop(1, "transparent");
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, sphereR * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Sphere base
      const sphereGrad = ctx.createRadialGradient(
        cx - sphereR * 0.3,
        cy - sphereR * 0.3,
        sphereR * 0.1,
        cx,
        cy,
        sphereR,
      );
      sphereGrad.addColorStop(0, "rgba(30,20,10,0.95)");
      sphereGrad.addColorStop(0.6, "rgba(12,8,4,0.98)");
      sphereGrad.addColorStop(1, "rgba(5,4,2,1)");
      ctx.beginPath();
      ctx.arc(cx, cy, sphereR, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();

      // Sphere edge glow
      const edgeGrad = ctx.createRadialGradient(
        cx,
        cy,
        sphereR * 0.85,
        cx,
        cy,
        sphereR,
      );
      edgeGrad.addColorStop(0, "transparent");
      edgeGrad.addColorStop(1, "rgba(232,108,58,0.35)");
      ctx.beginPath();
      ctx.arc(cx, cy, sphereR, 0, Math.PI * 2);
      ctx.fillStyle = edgeGrad;
      ctx.fill();

      // Latitudinal grid lines on sphere
      for (let lat = -3; lat <= 3; lat++) {
        const ly = cy + (lat / 3.5) * sphereR;
        const halfW = Math.sqrt(
          Math.max(0, sphereR * sphereR - (ly - cy) * (ly - cy)),
        );
        if (halfW < 5) continue;
        ctx.beginPath();
        ctx.ellipse(cx, ly, halfW, halfW * 0.2, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212,160,23,${0.05 + Math.abs(lat) * 0.01})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Data stream lines emanating from sphere
      for (const stream of streams) {
        stream.progress += stream.speed;
        if (stream.progress > 1) stream.progress = 0;
        const startR = sphereR;
        const endR = sphereR + stream.length;
        const currentR = startR + stream.progress * (endR - startR);
        const sx = cx + startR * Math.cos(stream.angle);
        const sy = cy + startR * Math.sin(stream.angle) * 0.45;
        const ex = cx + currentR * Math.cos(stream.angle);
        const ey = cy + currentR * Math.sin(stream.angle) * 0.45;
        const grad = ctx.createLinearGradient(sx, sy, ex, ey);
        grad.addColorStop(0, `rgba(212,160,23,${stream.alpha})`);
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Orbit rings
      for (const ring of orbitRings) {
        ring.tilt += ring.speed * 0.5; // very slow tilt evolution
        ctx.save();
        ctx.translate(cx, cy);
        ctx.beginPath();
        // draw as ellipse
        ctx.ellipse(
          0,
          0,
          ring.rx,
          ring.ry * Math.abs(Math.cos(t * 0.3 + ring.tilt)),
          t * ring.speed * 30,
          0,
          Math.PI * 2,
        );
        ctx.strokeStyle = `${ring.color}0.2)`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      // Orbit particles
      for (const p of particles) {
        const ring = orbitRings[p.orbitIdx];
        p.angle += ring.speed * 0.8;
        const pos = getOrbitalPos(ring, p.angle);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${ring.color}${p.alpha})`;
        ctx.fill();
        // particle glow
        const pgGrad = ctx.createRadialGradient(
          pos.x,
          pos.y,
          0,
          pos.x,
          pos.y,
          p.size * 4,
        );
        pgGrad.addColorStop(0, `${ring.color}${p.alpha * 0.5})`);
        pgGrad.addColorStop(1, "transparent");
        ctx.fillStyle = pgGrad;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, p.size * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Center pulse on sphere
      const pulseR = sphereR * 0.15 + Math.sin(t * 2) * sphereR * 0.05;
      const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulseR);
      centerGrad.addColorStop(0, "rgba(232,108,58,0.5)");
      centerGrad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
      ctx.fillStyle = centerGrad;
      ctx.fill();

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
      style={{ opacity: 0.85 }}
      tabIndex={-1}
      aria-hidden="true"
    />
  );
}

export default function NovaPage({ onBack }: NovaPageProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredPrinciple, setHoveredPrinciple] = useState<number | null>(null);

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
    const revealEls = document.querySelectorAll(".nova-reveal");
    for (const el of revealEls) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const divisions = [
    {
      glyph: "◈",
      color: "#4a7ef7",
      title: "Editorial Intelligence",
      description:
        "Story selection, institutional narrative design, and framing frameworks that ensure every published piece serves the enterprise's mission.",
    },
    {
      glyph: "◇",
      color: "#22d3b0",
      title: "Documentary Production",
      description:
        "Long-form documentary projects and cinematic institutional storytelling — translating complex research into visual narratives.",
    },
    {
      glyph: "◆",
      color: "#d4a017",
      title: "Digital Distribution",
      description:
        "Multi-platform dissemination architecture and audience engagement strategy ensuring research reaches the people who need it most.",
    },
  ];

  const publications = [
    "The STEMONEF Report (Quarterly)",
    "NOVA Documentary Series",
    "Policy Explainer Series",
    "Public Dialogue Forums",
    "Strategic Briefing Publications",
    "Digital Intelligence Digests",
  ];

  const principles = [
    {
      title: "Independence",
      body: "No commercial or political interference. Editorial decisions are final.",
    },
    {
      title: "Accuracy",
      body: "Every claim is research-backed and peer-reviewed before publication.",
    },
    {
      title: "Accessibility",
      body: "Complex ideas rendered clearly — without losing their depth.",
    },
    {
      title: "Integrity",
      body: "NOVA does not sensationalize. It illuminates.",
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
          data-ocid="nova.back.button"
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
              "rgba(232,108,58,0.9)";
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
          style={{ color: "rgba(232,108,58,0.7)" }}
        >
          NOVA
        </div>
      </div>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[100vh] flex items-center px-6 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, rgba(25,12,5,0.95) 0%, rgba(4,5,14,1) 65%)",
        }}
      >
        <OrbitalSphereCanvas />
        <div
          className="neural-grid-bg absolute inset-0 opacity-20"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full pt-16 pb-24">
          {/* Overline */}
          <div
            className="font-mono-geist text-xs tracking-[0.45em] uppercase mb-6"
            style={{
              color: "rgba(212,160,23,0.7)",
              animation: "fade-in-up 0.6s ease forwards",
            }}
          >
            ◆ PILLAR IV — MEDIA TRANSLATION
          </div>

          {/* Title */}
          <h1
            className="font-display font-light mb-4"
            style={{
              fontSize: "clamp(4.5rem, 14vw, 11rem)",
              letterSpacing: "0.08em",
              lineHeight: 0.88,
              background:
                "linear-gradient(135deg, #e86c3a 0%, #d4a017 40%, #ffffff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "fade-in-up 0.7s ease forwards",
              animationDelay: "0.1s",
              opacity: 0,
            }}
          >
            NOVA
          </h1>

          {/* Subtitle */}
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
            The Voice of the Enterprise
          </p>

          {/* Description */}
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
            Transforming institutional complexity into cultural resonance. NOVA
            is the media and storytelling arm of STEMONEF — translating deep
            research into narratives that inform, inspire, and move the world.
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

      {/* ── MISSION ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="nova-reveal reveal mb-4">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ MISSION
            </div>
          </div>
          <div
            className="glass-strong p-10 rounded-sm nova-reveal reveal"
            style={{
              borderLeft: "3px solid rgba(232,108,58,0.5)",
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
              NOVA does not produce content. It architects understanding. Every
              story told through NOVA is grounded in research, reviewed for
              accuracy, and designed to shift public knowledge — not chase
              engagement.
            </p>
          </div>
        </div>
      </section>

      {/* ── CORE DIVISIONS ──────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 nova-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◈ OPERATIONAL STRUCTURE
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              Core Divisions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {divisions.map((div, i) => (
              <div
                key={div.title}
                className="nova-reveal reveal"
                style={{ transitionDelay: `${i * 0.1}s` }}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className="p-8 rounded-sm h-full transition-all duration-300 relative overflow-hidden"
                  style={{
                    background:
                      hoveredCard === i
                        ? `radial-gradient(ellipse 100% 80% at 50% 0%, ${div.color}18 0%, rgba(4,5,14,0.85) 60%)`
                        : "rgba(255,255,255,0.03)",
                    border: `1px solid ${hoveredCard === i ? `${div.color}44` : "rgba(255,255,255,0.07)"}`,
                    backdropFilter: "blur(12px)",
                    borderTop: `2px solid ${div.color}88`,
                    transform: hoveredCard === i ? "translateY(-4px)" : "none",
                    boxShadow:
                      hoveredCard === i
                        ? `0 0 30px ${div.color}22, 0 8px 40px rgba(0,0,0,0.5)`
                        : "none",
                  }}
                >
                  <div
                    className="text-3xl mb-5 animate-glyph-pulse"
                    style={{ color: `${div.color}88` }}
                    aria-hidden="true"
                  >
                    {div.glyph}
                  </div>
                  <h3
                    className="font-display text-xl font-light mb-3"
                    style={{
                      letterSpacing: "0.12em",
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    {div.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontFamily: "Sora, sans-serif",
                    }}
                  >
                    {div.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT NOVA PRODUCES ──────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 nova-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ PUBLICATIONS & OUTPUT
            </div>
            <h2
              className="font-display text-4xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              What NOVA Produces
            </h2>
          </div>

          <div className="space-y-3">
            {publications.map((pub, i) => (
              <div
                key={pub}
                className="nova-reveal reveal"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div
                  className="flex items-center gap-5 px-6 py-4 rounded-sm transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span
                    className="font-mono-geist text-[10px] tracking-[0.2em] flex-shrink-0"
                    style={{ color: "rgba(232,108,58,0.6)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div
                    className="h-px flex-1"
                    style={{ background: "rgba(232,108,58,0.15)" }}
                  />
                  <span
                    className="text-sm tracking-wider"
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontFamily: "Sora, sans-serif",
                    }}
                  >
                    {pub}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDITORIAL PRINCIPLES ────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 nova-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◈ GOVERNANCE OF CONTENT
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              Editorial Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {principles.map((p, i) => (
              <div
                key={p.title}
                className="nova-reveal reveal"
                style={{ transitionDelay: `${i * 0.1}s` }}
                onMouseEnter={() => setHoveredPrinciple(i)}
                onMouseLeave={() => setHoveredPrinciple(null)}
              >
                <div
                  className="p-8 rounded-sm h-full transition-all duration-300 relative"
                  style={{
                    background:
                      hoveredPrinciple === i
                        ? "rgba(232,108,58,0.07)"
                        : "rgba(255,255,255,0.025)",
                    border: `1px solid ${hoveredPrinciple === i ? "rgba(232,108,58,0.3)" : "rgba(255,255,255,0.06)"}`,
                    backdropFilter: "blur(12px)",
                    transform:
                      hoveredPrinciple === i ? "translateY(-2px)" : "none",
                  }}
                >
                  <div
                    className="font-mono-geist text-[10px] tracking-[0.35em] uppercase mb-3"
                    style={{ color: "rgba(232,108,58,0.7)" }}
                  >
                    {p.title}
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontFamily: "Sora, sans-serif",
                    }}
                  >
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REGISTER INTEREST ────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="nova-reveal reveal mb-6">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ IN DEVELOPMENT
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
              NOVA is currently in development phase. Register your interest and
              be among the first to engage when the enterprise launches.
            </p>
          </div>

          {submitted ? (
            <div
              data-ocid="nova.success_state"
              className="p-8 rounded-sm text-center animate-fade-in-up nova-reveal reveal"
              style={{
                background: "rgba(212,160,23,0.08)",
                border: "1px solid rgba(212,160,23,0.35)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div
                className="w-3 h-3 rounded-full animate-pulse-glow mx-auto mb-4"
                style={{ background: "#d4a017" }}
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
                The NOVA team will reach out when the enterprise launches.
              </p>
            </div>
          ) : (
            <form
              data-ocid="nova.dialog"
              className="nova-reveal reveal p-8 rounded-sm relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(212,160,23,0.25)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 0 40px rgba(212,160,23,0.05)",
              }}
              onSubmit={async (e) => {
                e.preventDefault();
                if (!formName || !formEmail) return;
                try {
                  await submitRequest.mutateAsync({
                    name: formName,
                    email: formEmail,
                    pathway: "NOVA",
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
                    "linear-gradient(90deg, transparent, rgba(212,160,23,0.4), transparent)",
                }}
                aria-hidden="true"
              />

              <div className="space-y-4">
                <div>
                  <label
                    className="font-mono-geist text-[10px] tracking-[0.3em] uppercase block mb-1.5"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                    htmlFor="nova-name"
                  >
                    Full Name
                  </label>
                  <input
                    id="nova-name"
                    type="text"
                    data-ocid="nova.input"
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
                        "rgba(212,160,23,0.5)";
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
                    htmlFor="nova-email"
                  >
                    Email Address
                  </label>
                  <input
                    id="nova-email"
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
                        "rgba(212,160,23,0.5)";
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
                    htmlFor="nova-message"
                  >
                    Why You&apos;re Interested{" "}
                    <span style={{ color: "rgba(255,255,255,0.2)" }}>
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id="nova-message"
                    data-ocid="nova.textarea"
                    rows={3}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Tell us about your interest in NOVA..."
                    className="w-full px-4 py-3 text-sm outline-none rounded-sm resize-none transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.85)",
                      fontFamily: "Sora, sans-serif",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(212,160,23,0.5)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.1)";
                    }}
                  />
                </div>

                <button
                  type="submit"
                  data-ocid="nova.submit_button"
                  disabled={submitRequest.isPending}
                  className="w-full py-3 text-xs tracking-[0.25em] uppercase transition-all duration-200 rounded-sm"
                  style={{
                    background: submitRequest.isPending
                      ? "rgba(212,160,23,0.08)"
                      : "rgba(212,160,23,0.12)",
                    border: "1px solid rgba(212,160,23,0.45)",
                    color: "#d4a017",
                    fontFamily: "Geist Mono, monospace",
                    letterSpacing: "0.2em",
                    cursor: submitRequest.isPending ? "not-allowed" : "pointer",
                    boxShadow: "0 0 20px rgba(212,160,23,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    if (!submitRequest.isPending)
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(212,160,23,0.22)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(212,160,23,0.12)";
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
