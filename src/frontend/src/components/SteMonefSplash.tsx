import { useEffect, useRef, useState } from "react";

interface SteMonefSplashProps {
  onScrollTo: (id: string) => void;
}

const LETTERS = ["S", "T", "E", "M", "O", "N", "E", "F"];

const TAGLINE =
  "Science · Technology · Engineering · Mathematics · Oversight · Nexus · Ethics · Finance";
const MISSION = "Advancing Human Progress Through Integrated Intelligence";

// Orbital ring nodes with their positions (angle in degrees)
const ORBITAL_NODES = [
  { angle: 0, label: "EPOCHS", color: "#4a7ef7" },
  { angle: 90, label: "HUMANON", color: "#d4a017" },
  { angle: 180, label: "STEAMI", color: "#a78bfa" },
  { angle: 270, label: "TERRA", color: "#34d399" },
];

export default function SteMonefSplash({ onScrollTo }: SteMonefSplashProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef(0);
  const particlesRef = useRef<
    {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      opacity: number;
      speed: number;
    }[]
  >([]);

  const [lettersVisible, setLettersVisible] = useState<boolean[]>(
    new Array(8).fill(false),
  );
  const [scanActive, setScanActive] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [missionVisible, setMissionVisible] = useState(false);
  const [scrollCueVisible, setScrollCueVisible] = useState(false);

  // Staggered letter entrance
  useEffect(() => {
    LETTERS.forEach((_, i) => {
      setTimeout(
        () => {
          setLettersVisible((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        },
        200 + i * 80,
      );
    });
    // Scan line after letters done
    setTimeout(() => setScanActive(true), 200 + 8 * 80 + 100);
    // Tagline
    setTimeout(() => setTaglineVisible(true), 900);
    // Mission
    setTimeout(() => setMissionVisible(true), 1300);
    // Scroll cue
    setTimeout(() => setScrollCueVisible(true), 1800);
  }, []);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    const initParticles = () => {
      const w = canvas.width || window.innerWidth;
      const h = canvas.height || window.innerHeight;
      particlesRef.current = Array.from({ length: 60 }, () => ({
        x: Math.random() * w,
        y: h + Math.random() * h * 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(0.15 + Math.random() * 0.35),
        size: 0.8 + Math.random() * 1.6,
        color: Math.random() > 0.45 ? "#d4a017" : "#4a7ef7",
        opacity: 0.15 + Math.random() * 0.45,
        speed: 0.15 + Math.random() * 0.35,
      }));
    };
    initParticles();

    const draw = (ts: number) => {
      if (document.hidden) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      // Cap to ~30 FPS
      if (ts - lastFrameRef.current < 33) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      lastFrameRef.current = ts;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        // Reset when it leaves top
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      id="splash"
      data-ocid="splash.section"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        background: "#04050e",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes letterReveal {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanSweep {
          0%   { top: -4px; opacity: 0; }
          8%   { opacity: 0.8; }
          90%  { opacity: 0.6; }
          100% { top: 110%; opacity: 0; }
        }
        @keyframes rotateRing {
          to { transform: rotate(360deg); }
        }
        @keyframes rotateRingReverse {
          to { transform: rotate(-360deg); }
        }
        @keyframes nodePulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50%       { transform: scale(1.35); opacity: 1; }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(6px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes radialPulse {
          0%   { transform: scale(0.92); opacity: 0.08; }
          50%  { transform: scale(1.08); opacity: 0.14; }
          100% { transform: scale(0.92); opacity: 0.08; }
        }
        @keyframes gridFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* Particle canvas — decorative, not keyboard focusable */}
      <canvas
        ref={canvasRef}
        tabIndex={-1}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Neural grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(74,126,247,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,126,247,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          zIndex: 0,
          animation: "gridFade 2s ease forwards",
        }}
        aria-hidden="true"
      />

      {/* Radial glow behind wordmark */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "clamp(300px, 60vw, 700px)",
          height: "clamp(300px, 60vw, 700px)",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(74,126,247,0.12) 0%, rgba(212,160,23,0.06) 35%, transparent 70%)",
          animation: "radialPulse 4s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* Orbital ring SVG */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        {/* Outer rotating dashed ring */}
        <div
          style={{
            width: "clamp(280px, 42vw, 460px)",
            height: "clamp(280px, 42vw, 460px)",
            animation: "rotateRing 20s linear infinite",
            position: "relative",
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 460 460"
            role="presentation"
            style={{ position: "absolute", inset: 0 }}
          >
            {/* Outer dashed ring */}
            <circle
              cx="230"
              cy="230"
              r="220"
              fill="none"
              stroke="rgba(212,160,23,0.18)"
              strokeWidth="1"
              strokeDasharray="4 12"
            />
            {/* Inner ring */}
            <circle
              cx="230"
              cy="230"
              r="195"
              fill="none"
              stroke="rgba(74,126,247,0.08)"
              strokeWidth="0.5"
            />
            {/* Orbital nodes */}
            {ORBITAL_NODES.map((node, i) => {
              const rad = (node.angle * Math.PI) / 180;
              const nx = 230 + 220 * Math.cos(rad);
              const ny = 230 + 220 * Math.sin(rad);
              return (
                <g key={node.label}>
                  <circle
                    cx={nx}
                    cy={ny}
                    r="6"
                    fill={node.color}
                    opacity="0.8"
                    style={{
                      animation: `nodePulse ${2.2 + i * 0.4}s ease-in-out infinite`,
                      transformOrigin: `${nx}px ${ny}px`,
                    }}
                  />
                  <circle
                    cx={nx}
                    cy={ny}
                    r="12"
                    fill="none"
                    stroke={node.color}
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Counter-rotating inner detail ring */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "clamp(200px, 30vw, 320px)",
            height: "clamp(200px, 30vw, 320px)",
            animation: "rotateRingReverse 30s linear infinite",
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 320 320"
            role="presentation"
          >
            <circle
              cx="160"
              cy="160"
              r="155"
              fill="none"
              stroke="rgba(74,126,247,0.06)"
              strokeWidth="1"
              strokeDasharray="2 18"
            />
            {/* Tick marks */}
            {Array.from({ length: 24 }, (_, i) => {
              const angle = (i * 15 * Math.PI) / 180;
              const inner = 148;
              const outer = i % 6 === 0 ? 138 : 144;
              const tickKey = `a${i * 15}`;
              return (
                <line
                  key={tickKey}
                  x1={160 + inner * Math.cos(angle)}
                  y1={160 + inner * Math.sin(angle)}
                  x2={160 + outer * Math.cos(angle)}
                  y2={160 + outer * Math.sin(angle)}
                  stroke={
                    i % 6 === 0
                      ? "rgba(212,160,23,0.35)"
                      : "rgba(255,255,255,0.08)"
                  }
                  strokeWidth={i % 6 === 0 ? "1.5" : "0.8"}
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Main content stack */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "clamp(12px, 2.5vw, 28px)",
          padding: "0 clamp(16px, 4vw, 48px)",
          width: "100%",
          maxWidth: "100vw",
        }}
      >
        {/* Giant STEMONEF wordmark */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(1px, 0.5vw, 6px)",
          }}
        >
          {/* Scan sweep line */}
          {scanActive && (
            <div
              style={{
                position: "absolute",
                left: "-8px",
                right: "-8px",
                height: "3px",
                background:
                  "linear-gradient(90deg, transparent, rgba(212,160,23,0.9), rgba(255,255,255,0.6), rgba(212,160,23,0.9), transparent)",
                animation: "scanSweep 1.2s ease-out forwards",
                zIndex: 10,
                pointerEvents: "none",
                boxShadow: "0 0 18px rgba(212,160,23,0.7)",
              }}
              aria-hidden="true"
            />
          )}

          {LETTERS.map((letter, i) => (
            <span
              key={`letter-${String(i)}`}
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontSize: "clamp(2.8rem, 14vw, 13rem)",
                fontWeight: 300,
                lineHeight: 1,
                letterSpacing: "clamp(0.01em, 0.3vw, 0.08em)",
                textTransform: "uppercase",
                color: "transparent",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.55) 50%, rgba(212,160,23,0.7) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                opacity: lettersVisible[i] ? 1 : 0,
                transform: lettersVisible[i]
                  ? "translateY(0)"
                  : "translateY(40px)",
                transition: "opacity 500ms ease, transform 500ms ease",
                display: "inline-block",
                textShadow: "none",
                filter: lettersVisible[i]
                  ? "drop-shadow(0 0 30px rgba(74,126,247,0.3))"
                  : "none",
              }}
              aria-hidden={i > 0}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: taglineVisible ? 1 : 0,
            transform: taglineVisible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease, transform 600ms ease",
            fontFamily: "Geist Mono, monospace",
            fontSize: "clamp(6px, 1.1vw, 11px)",
            letterSpacing: "clamp(0.1em, 0.4vw, 0.28em)",
            textTransform: "uppercase",
            color: "#d4a017",
            textAlign: "center",
            maxWidth: "90vw",
            lineHeight: 1.6,
            padding: "0 8px",
          }}
        >
          {TAGLINE}
        </div>

        {/* Horizontal divider */}
        <div
          style={{
            opacity: missionVisible ? 1 : 0,
            transition: "opacity 600ms ease 100ms",
            width: "clamp(120px, 25vw, 280px)",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(212,160,23,0.5), rgba(74,126,247,0.5), transparent)",
          }}
          aria-hidden="true"
        />

        {/* Mission statement */}
        <div
          style={{
            opacity: missionVisible ? 1 : 0,
            transform: missionVisible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease, transform 600ms ease",
            fontFamily: "Fraunces, Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(0.75rem, 1.8vw, 1.2rem)",
            fontWeight: 300,
            color: "rgba(255,255,255,0.72)",
            textAlign: "center",
            letterSpacing: "0.03em",
            maxWidth: "600px",
            lineHeight: 1.5,
          }}
        >
          {MISSION}
        </div>

        {/* System status bar */}
        <div
          style={{
            opacity: scrollCueVisible ? 1 : 0,
            transition: "opacity 500ms ease",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontFamily: "Geist Mono, monospace",
            fontSize: "clamp(7px, 0.9vw, 9px)",
            letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.2)",
            marginTop: "8px",
          }}
        >
          <span>SYSTEM ACTIVE</span>
          <span style={{ color: "rgba(212,160,23,0.4)" }}>|</span>
          <span>7 PILLARS ONLINE</span>
          <span style={{ color: "rgba(212,160,23,0.4)" }}>|</span>
          <span>INTELLIGENCE NETWORK LIVE</span>
        </div>
      </div>

      {/* Scroll cue */}
      <button
        type="button"
        data-ocid="splash.button"
        onClick={() => onScrollTo("hero")}
        aria-label="Enter the system"
        style={{
          position: "absolute",
          bottom: "clamp(24px, 4vh, 48px)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 3,
          opacity: scrollCueVisible ? 1 : 0,
          transition: "opacity 600ms ease",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          padding: "12px 24px",
        }}
      >
        <span
          style={{
            fontFamily: "Geist Mono, monospace",
            fontSize: "8px",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(212,160,23,0.6)",
          }}
        >
          ENTER THE SYSTEM
        </span>
        <svg
          width="18"
          height="12"
          viewBox="0 0 18 12"
          fill="none"
          style={{
            animation: "scrollBounce 1.6s ease-in-out infinite",
          }}
          aria-hidden="true"
        >
          <path
            d="M1 1L9 9L17 1"
            stroke="rgba(212,160,23,0.6)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1 5L9 13L17 5"
            stroke="rgba(212,160,23,0.25)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Subtle bottom gradient fade into next section */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "120px",
          background:
            "linear-gradient(to bottom, transparent, rgba(4,5,14,0.9))",
          pointerEvents: "none",
          zIndex: 2,
        }}
        aria-hidden="true"
      />
    </section>
  );
}
