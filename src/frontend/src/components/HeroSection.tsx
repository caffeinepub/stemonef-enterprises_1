import { useEffect, useRef } from "react";
import NeuralCanvas from "./NeuralCanvas";

// ── Particle Trail ─────────────────────────────────────────────────────────
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  decay: number;
  isGold: boolean;
}

function ParticleTrail({
  containerRef,
}: { containerRef: React.RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Skip on touch-primary devices
    if (window.matchMedia("(hover: none)").matches) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas to match container
    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // Spawn particles on mouse move
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Spawn 2-3 particles per move event for a denser trail
      const count = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -(0.4 + Math.random() * 0.4),
          radius: 1.5 + Math.random() * 2,
          opacity: 0.7 + Math.random() * 0.3,
          decay: 0.012 + Math.random() * 0.01,
          isGold: Math.random() > 0.45,
        });
      }
    };

    container.addEventListener("mousemove", onMouseMove);

    // Animation loop
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const alive: Particle[] = [];
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= p.decay;

        if (p.opacity <= 0) continue;
        alive.push(p);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.isGold) {
          ctx.fillStyle = `rgba(212,160,23,${p.opacity.toFixed(3)})`;
        } else {
          ctx.fillStyle = `rgba(74,126,247,${p.opacity.toFixed(3)})`;
        }

        ctx.fill();
      }
      particlesRef.current = alive;

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 2 }}
    />
  );
}

// ── HeroSection ────────────────────────────────────────────────────────────
interface HeroSectionProps {
  onScrollTo: (id: string) => void;
}

export default function HeroSection({ onScrollTo }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      data-ocid="hero.section"
      id="hero"
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* Canvas background */}
      <div className="absolute inset-0 z-0">
        <NeuralCanvas interactive={true} />
      </div>

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(4,5,14,0.6) 60%, rgba(4,5,14,0.95) 100%)",
        }}
      />

      {/* Particle trail canvas — above overlay, below content */}
      <ParticleTrail containerRef={sectionRef} />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-[4]"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(4,5,14,1))",
        }}
      />

      {/* Content */}
      <div className="relative z-[3] flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
        {/* System designation — elevated far above wordmark */}
        <div
          className="animate-fade-in-up mb-16"
          style={{
            animationDelay: "0.1s",
            animationFillMode: "both",
          }}
        >
          {/* Coordinate ticker row — institutional signature detail */}
          <div className="flex items-center justify-center gap-4">
            <div
              className="h-px flex-1"
              style={{
                maxWidth: "80px",
                background:
                  "linear-gradient(90deg, transparent, rgba(212,160,23,0.4))",
              }}
            />
            <span
              className="font-mono-geist text-[9px] tracking-[0.45em] uppercase"
              style={{ color: "rgba(212,160,23,0.65)" }}
            >
              EST. 2024 · SOCIAL SCIENCE ENTERPRISE · GBL/001
            </span>
            <div
              className="h-px flex-1"
              style={{
                maxWidth: "80px",
                background:
                  "linear-gradient(90deg, rgba(212,160,23,0.4), transparent)",
              }}
            />
          </div>
        </div>

        {/* Main heading */}
        <h1
          className="font-display font-light animate-fade-in-up"
          style={{
            fontSize: "clamp(4.5rem, 14vw, 11rem)",
            letterSpacing: "0.18em",
            lineHeight: 0.88,
            animationDelay: "0.3s",
            animationFillMode: "both",
            marginBottom: "0.6rem",
          }}
        >
          <span
            style={{
              background:
                "linear-gradient(160deg, #4a7ef7 0%, #8ab4ff 35%, #ffffff 65%, #e8eeff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            STEMONEF
          </span>
        </h1>

        {/* Underline with coordinate marks — signature detail */}
        <div
          className="animate-fade-in-up mb-8 flex items-center justify-center gap-0"
          style={{
            animationDelay: "0.45s",
            animationFillMode: "both",
            width: "100%",
          }}
        >
          {/* Left tick */}
          <div
            style={{
              width: "1px",
              height: "12px",
              background: "rgba(212,160,23,0.5)",
              flexShrink: 0,
            }}
          />
          {/* Line */}
          <div
            style={{
              flex: 1,
              maxWidth: "500px",
              height: "1px",
              background:
                "linear-gradient(90deg, rgba(212,160,23,0.5) 0%, rgba(212,160,23,0.15) 40%, rgba(74,126,247,0.15) 60%, rgba(74,126,247,0.5) 100%)",
            }}
          />
          {/* Right tick */}
          <div
            style={{
              width: "1px",
              height: "12px",
              background: "rgba(74,126,247,0.5)",
              flexShrink: 0,
            }}
          />
        </div>

        {/* Tagline */}
        <div
          className="animate-fade-in-up mb-10"
          style={{
            animationDelay: "0.55s",
            animationFillMode: "both",
          }}
        >
          <p
            className="font-serif-instrument"
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.5em",
              textTransform: "uppercase",
            }}
          >
            For a Better Tomorrow
          </p>
        </div>

        {/* Description — tighter, lower opacity, shorter max-width */}
        <p
          className="max-w-xl text-sm leading-relaxed mb-14 animate-fade-in-up"
          style={{
            color: "rgba(255,255,255,0.35)",
            animationDelay: "0.7s",
            animationFillMode: "both",
            fontFamily: "Sora, sans-serif",
          }}
        >
          A hybrid institutional system integrating Research & Development,
          Intelligence Synthesis, Ethical Oversight, and Humanitarian
          Development — operating through seven structural pillars toward
          measurable global impact.
        </p>

        {/* CTA Buttons — clear hierarchy: primary filled / secondary outlined / tertiary text */}
        <div
          className="flex flex-col sm:flex-row items-center gap-3 animate-fade-in-up"
          style={{ animationDelay: "0.9s", animationFillMode: "both" }}
        >
          {/* Primary — solid gold fill on hover */}
          <button
            type="button"
            data-ocid="hero.primary_button"
            onClick={() => onScrollTo("cta")}
            className="px-10 py-4 text-xs tracking-widest uppercase transition-all duration-300"
            style={{
              background: "rgba(212,160,23,0.15)",
              border: "1px solid rgba(212,160,23,0.6)",
              color: "#d4a017",
              fontFamily: "Geist Mono, monospace",
              letterSpacing: "0.25em",
              cursor: "pointer",
              borderRadius: "2px",
              boxShadow:
                "0 0 20px rgba(212,160,23,0.12), inset 0 1px 0 rgba(212,160,23,0.1)",
              minWidth: "180px",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = "rgba(212,160,23,0.22)";
              el.style.boxShadow =
                "0 0 35px rgba(212,160,23,0.3), inset 0 1px 0 rgba(212,160,23,0.2)";
              el.style.color = "#f0c843";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = "rgba(212,160,23,0.15)";
              el.style.boxShadow =
                "0 0 20px rgba(212,160,23,0.12), inset 0 1px 0 rgba(212,160,23,0.1)";
              el.style.color = "#d4a017";
            }}
          >
            Collaborate
          </button>

          {/* Secondary — outlined blue */}
          <button
            type="button"
            data-ocid="hero.secondary_button"
            onClick={() => onScrollTo("pillars")}
            className="px-10 py-4 text-xs tracking-widest uppercase transition-all duration-300"
            style={{
              background: "transparent",
              border: "1px solid rgba(74,126,247,0.4)",
              color: "rgba(74,126,247,0.85)",
              fontFamily: "Geist Mono, monospace",
              letterSpacing: "0.25em",
              cursor: "pointer",
              borderRadius: "2px",
              minWidth: "180px",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = "rgba(74,126,247,0.1)";
              el.style.borderColor = "rgba(74,126,247,0.7)";
              el.style.color = "rgba(74,126,247,1)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = "transparent";
              el.style.borderColor = "rgba(74,126,247,0.4)";
              el.style.color = "rgba(74,126,247,0.85)";
            }}
          >
            Explore Pillars
          </button>

          {/* Tertiary — text only with subtle underline */}
          <button
            type="button"
            data-ocid="hero.secondary_button"
            onClick={() => onScrollTo("feed")}
            className="px-6 py-4 text-xs tracking-widest uppercase transition-all duration-300"
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.35)",
              fontFamily: "Geist Mono, monospace",
              letterSpacing: "0.25em",
              cursor: "pointer",
              textDecoration: "none",
              borderBottom: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "0",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.color = "rgba(255,255,255,0.65)";
              el.style.borderBottomColor = "rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.color = "rgba(255,255,255,0.35)";
              el.style.borderBottomColor = "rgba(255,255,255,0.12)";
            }}
          >
            Intelligence Feed
          </button>
        </div>

        {/* Scroll cue */}
        <div
          className="mt-16 flex flex-col items-center gap-2 animate-fade-in-up"
          style={{ animationDelay: "1.3s", animationFillMode: "both" }}
        >
          <span
            className="font-mono-geist text-[9px] tracking-[0.4em] uppercase"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            Scroll
          </span>
          <svg
            role="img"
            aria-label="Scroll down"
            className="animate-chevron-bounce"
            width="16"
            height="10"
            viewBox="0 0 16 10"
            fill="none"
          >
            <path
              d="M1 1L8 8L15 1"
              stroke="rgba(212,160,23,0.45)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
