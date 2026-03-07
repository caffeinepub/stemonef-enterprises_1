import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FeedEntry } from "../backend.d";
import { useGetPublicFeeds } from "../hooks/useQueries";

interface SteamiPageProps {
  onBack: () => void;
}

const LEGAL_NOTE =
  "EPOCHS™, HUMANON™, STEAMI™ and all associated initiatives operate under the parent institution THE STEMONEF™ ENTERPRISES.";

// ─── Hero Canvas ─────────────────────────────────────────────────────────────
function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    // Particles
    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      isGold: boolean;
      trail: { x: number; y: number }[];
    };

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const particles: Particle[] = Array.from({ length: 70 }, (_, idx) => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      vx: 0.25 + Math.random() * 0.65,
      vy: (Math.random() - 0.5) * 0.18,
      radius: 1.2 + Math.random() * 2.2,
      alpha: 0.25 + Math.random() * 0.55,
      isGold: idx < 12, // first 12 are gold signal particles
      trail: [],
    }));

    // Data stream lines — two layers: blue primary, gold accent
    const streamLines = Array.from({ length: 12 }, (_, idx) => ({
      y: Math.random() * H(),
      alpha:
        idx < 8 ? 0.07 + Math.random() * 0.09 : 0.04 + Math.random() * 0.06,
      speed: 0.4 + Math.random() * 1.1,
      offset: Math.random() * W(),
      isGold: idx >= 9, // last 3 lines are gold
      width: idx < 4 ? 1.5 : 1,
      length: 0.2 + Math.random() * 0.25,
    }));

    // Pulse nodes — alternating gold/blue with mesh connections
    const nodes = Array.from({ length: 8 }, (_, idx) => ({
      x: (0.1 + Math.random() * 0.8) * W(),
      y: (0.1 + Math.random() * 0.8) * H(),
      phase: Math.random() * Math.PI * 2,
      radius: 2.5 + Math.random() * 5,
      isGold: idx % 2 === 0,
    }));

    let paused = false;
    const handleVisibility = () => {
      paused = document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const FPS = 30;
    const FRAME_MS = 1000 / FPS;

    const animate = (now: number) => {
      frameRef.current = requestAnimationFrame(animate);
      if (paused) return;
      if (now - lastFrameRef.current < FRAME_MS) return;
      lastFrameRef.current = now;

      ctx.clearRect(0, 0, W(), H());

      // Stream lines — blue primary + gold accent
      for (const line of streamLines) {
        line.offset += line.speed;
        if (line.offset > W()) line.offset = 0;
        const len = W() * line.length;
        ctx.beginPath();
        ctx.moveTo(line.offset, line.y);
        ctx.lineTo(line.offset + len, line.y);
        const grad = ctx.createLinearGradient(
          line.offset,
          0,
          line.offset + len,
          0,
        );
        if (line.isGold) {
          grad.addColorStop(0, "rgba(212,160,23,0)");
          grad.addColorStop(0.35, `rgba(212,160,23,${line.alpha})`);
          grad.addColorStop(0.65, `rgba(212,160,23,${line.alpha * 0.6})`);
          grad.addColorStop(1, "rgba(212,160,23,0)");
        } else {
          grad.addColorStop(0, "rgba(74,126,247,0)");
          grad.addColorStop(0.3, `rgba(74,126,247,${line.alpha})`);
          grad.addColorStop(0.7, `rgba(74,126,247,${line.alpha * 0.5})`);
          grad.addColorStop(1, "rgba(74,126,247,0)");
        }
        ctx.strokeStyle = grad;
        ctx.lineWidth = line.width;
        ctx.stroke();
      }

      // Node mesh — faint lines connecting nearby nodes
      const t = Date.now() / 1000;
      for (let a = 0; a < nodes.length; a++) {
        for (let b = a + 1; b < nodes.length; b++) {
          const dx = nodes[a].x - nodes[b].x;
          const dy = nodes[a].y - nodes[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < W() * 0.28) {
            const meshAlpha = (1 - dist / (W() * 0.28)) * 0.06;
            ctx.beginPath();
            ctx.moveTo(nodes[a].x, nodes[a].y);
            ctx.lineTo(nodes[b].x, nodes[b].y);
            ctx.strokeStyle = `rgba(74,126,247,${meshAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Particles with comet trails
      for (const p of particles) {
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 28) p.trail.shift();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x > W() + 20) {
          p.x = -20;
          p.trail = [];
        }
        if (p.y < 0 || p.y > H()) {
          p.vy *= -1;
        }

        // Comet tail — tapers at both ends
        for (let ti = 0; ti < p.trail.length - 1; ti++) {
          const frac = ti / p.trail.length;
          const trailAlpha = frac * frac * p.alpha * 0.7;
          ctx.beginPath();
          ctx.moveTo(p.trail[ti].x, p.trail[ti].y);
          ctx.lineTo(p.trail[ti + 1].x, p.trail[ti + 1].y);
          ctx.strokeStyle = p.isGold
            ? `rgba(212,160,23,${trailAlpha})`
            : `rgba(74,126,247,${trailAlpha})`;
          ctx.lineWidth = p.radius * 0.6 * frac;
          ctx.stroke();
        }

        // Head glow
        const headGrad = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.radius * 2.5,
        );
        if (p.isGold) {
          headGrad.addColorStop(0, `rgba(212,160,23,${p.alpha})`);
          headGrad.addColorStop(1, "rgba(212,160,23,0)");
        } else {
          headGrad.addColorStop(0, `rgba(100,150,255,${p.alpha})`);
          headGrad.addColorStop(1, "rgba(74,126,247,0)");
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = headGrad;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.isGold
          ? `rgba(212,160,23,${p.alpha * 0.9})`
          : `rgba(120,165,255,${p.alpha * 0.85})`;
        ctx.fill();
      }

      // Pulse nodes — alternating gold/blue with layered glow rings
      for (const n of nodes) {
        const pulse = Math.sin(t * 1.3 + n.phase) * 0.5 + 0.5;
        const r = n.radius + pulse * 7;
        const alpha = (n.isGold ? 0.12 : 0.08) + pulse * 0.22;
        const innerColor = n.isGold ? "212,160,23" : "74,126,247";
        // Outer glow
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
        grad.addColorStop(0, `rgba(${innerColor},${alpha * 0.6})`);
        grad.addColorStop(0.5, `rgba(${innerColor},${alpha * 0.2})`);
        grad.addColorStop(1, `rgba(${innerColor},0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        // Ring
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 1.6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${innerColor},${alpha * 0.35})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        // Core
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${innerColor},${alpha * 1.8})`;
        ctx.fill();
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

// ─── Architecture Pipeline ────────────────────────────────────────────────────
const ARCH_STAGES = [
  {
    label: "Research Sources",
    glyph: "◎",
    color: "#4a7ef7",
    activities: [
      "Academic databases",
      "Satellite data streams",
      "Research institutions",
      "Regulatory bodies",
    ],
  },
  {
    label: "Signal Ingestion",
    glyph: "◇",
    color: "#22d3b0",
    activities: [
      "Automated data collection",
      "Quality filtering",
      "Source verification",
      "Metadata tagging",
    ],
  },
  {
    label: "Intelligence Synthesis",
    glyph: "◈",
    color: "#d4a017",
    activities: [
      "Pattern analysis",
      "Cross-disciplinary interpretation",
      "Scenario modeling",
      "Insight validation",
    ],
  },
  {
    label: "Ethics Review",
    glyph: "◆",
    color: "#a78bfa",
    activities: [
      "Bias assessment",
      "Accuracy verification",
      "Societal impact analysis",
      "ETHOS board review",
    ],
  },
  {
    label: "Knowledge Distribution",
    glyph: "▷",
    color: "#22d3b0",
    activities: [
      "Publication formatting",
      "Audience segmentation",
      "Multi-channel delivery",
      "Impact tracking",
    ],
  },
];

function ArchitecturePipeline() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {/* Desktop: horizontal with connectors */}
      <div className="hidden lg:flex items-start gap-0">
        {ARCH_STAGES.map((stage, i) => {
          const isHovered = hoveredIndex === i;
          return (
            <div key={stage.label} className="flex items-start flex-1 gap-0">
              <div className="flex-1">
                <div
                  data-ocid={`steami.architecture.card.${i + 1}`}
                  className="cursor-default transition-all duration-400 rounded-sm"
                  style={{
                    background: isHovered
                      ? `${stage.color}14`
                      : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isHovered ? `${stage.color}60` : "rgba(255,255,255,0.08)"}`,
                    backdropFilter: "blur(12px)",
                    boxShadow: isHovered
                      ? `0 0 24px ${stage.color}20, 0 8px 32px rgba(0,0,0,0.4)`
                      : "none",
                    transform: isHovered ? "translateY(-6px)" : "none",
                    transition: "all 0.35s ease",
                    padding: isHovered ? "20px 16px 20px" : "20px 16px",
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div
                    className="text-2xl mb-3 transition-all duration-300"
                    style={{
                      color: isHovered ? stage.color : `${stage.color}70`,
                    }}
                    aria-hidden="true"
                  >
                    {stage.glyph}
                  </div>
                  <div
                    className="font-mono-geist text-[9px] tracking-[0.25em] uppercase mb-1"
                    style={{
                      color: isHovered ? stage.color : "rgba(255,255,255,0.35)",
                    }}
                  >
                    STAGE {String(i + 1).padStart(2, "0")}
                  </div>
                  <div
                    className="font-display text-sm font-light mb-3"
                    style={{
                      color: isHovered
                        ? "rgba(255,255,255,0.95)"
                        : "rgba(255,255,255,0.7)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {stage.label}
                  </div>

                  {/* Expanded activities */}
                  <div
                    className="overflow-hidden transition-all duration-400"
                    style={{
                      maxHeight: isHovered ? "200px" : "0px",
                      opacity: isHovered ? 1 : 0,
                    }}
                  >
                    <div
                      className="pt-3 space-y-1.5"
                      style={{ borderTop: `1px solid ${stage.color}25` }}
                    >
                      <div
                        className="font-mono-geist text-[8px] tracking-[0.3em] uppercase mb-2"
                        style={{ color: `${stage.color}80` }}
                      >
                        ACTIVITIES
                      </div>
                      {stage.activities.map((a) => (
                        <div key={a} className="flex items-center gap-2">
                          <div
                            className="w-1 h-1 rounded-full flex-shrink-0"
                            style={{ background: stage.color, opacity: 0.7 }}
                          />
                          <span
                            className="text-[10px] leading-relaxed"
                            style={{
                              color: "rgba(255,255,255,0.5)",
                              fontFamily: "Sora, sans-serif",
                            }}
                          >
                            {a}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Connector arrow */}
              {i < ARCH_STAGES.length - 1 && (
                <div className="flex items-center pt-6 px-1 flex-shrink-0">
                  <svg
                    width="28"
                    height="16"
                    viewBox="0 0 28 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <line
                      x1="0"
                      y1="8"
                      x2="20"
                      y2="8"
                      stroke={
                        hoveredIndex === i || hoveredIndex === i + 1
                          ? "#4a7ef7"
                          : "rgba(255,255,255,0.12)"
                      }
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      className="animate-breathing"
                    />
                    <polyline
                      points="16,3 22,8 16,13"
                      stroke={
                        hoveredIndex === i || hoveredIndex === i + 1
                          ? "#4a7ef7"
                          : "rgba(255,255,255,0.12)"
                      }
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical stack */}
      <div className="flex flex-col gap-3 lg:hidden">
        {ARCH_STAGES.map((stage, i) => (
          <div
            key={stage.label}
            data-ocid={`steami.architecture.card.${i + 1}`}
            className="rounded-sm p-5 transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${stage.color}35`,
            }}
          >
            <div className="flex items-center gap-4 mb-3">
              <span
                className="text-xl"
                style={{ color: stage.color }}
                aria-hidden="true"
              >
                {stage.glyph}
              </span>
              <div>
                <div
                  className="font-mono-geist text-[8px] tracking-[0.2em] uppercase"
                  style={{ color: `${stage.color}70` }}
                >
                  STAGE {String(i + 1).padStart(2, "0")}
                </div>
                <div
                  className="font-display text-sm font-light"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  {stage.label}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {stage.activities.map((a) => (
                <span
                  key={a}
                  className="text-[9px] px-2 py-1 rounded-sm"
                  style={{
                    background: `${stage.color}10`,
                    color: "rgba(255,255,255,0.45)",
                    fontFamily: "Geist Mono, monospace",
                  }}
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Signal Ingestion SVG ─────────────────────────────────────────────────────
const SIGNAL_SOURCES = [
  {
    label: "EPOCHS Research Outputs",
    angle: -80,
    color: "#4a7ef7",
    desc: "Primary research outputs from EPOCHS laboratories, including climate models, technology assessments and ethical AI frameworks.",
  },
  {
    label: "External Scientific Research",
    angle: -20,
    color: "#22d3b0",
    desc: "Peer-reviewed journals, preprints and academic publications across climate, health, technology and policy domains.",
  },
  {
    label: "Policy & Regulatory Data",
    angle: 40,
    color: "#d4a017",
    desc: "Government publications, regulatory filings, international treaty data and policy consultation documents.",
  },
  {
    label: "Technology Developments",
    angle: 100,
    color: "#a78bfa",
    desc: "Technology intelligence from patent filings, R&D announcements, industry reports and innovation signals.",
  },
  {
    label: "Global Climate Data",
    angle: 160,
    color: "#22d3b0",
    desc: "Satellite monitoring data, ocean sensors, atmospheric measurements and environmental observation networks.",
  },
];

function SignalIngestionSVG() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const cx = 240;
  const cy = 200;
  const radius = 140;

  const nodePositions = SIGNAL_SOURCES.map((s) => {
    const rad = (s.angle * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  });

  const getTooltipPos = (i: number) => {
    const pos = nodePositions[i];
    return { x: pos.x, y: pos.y };
  };

  return (
    <div className="flex flex-col lg:flex-row items-center gap-8">
      {/* SVG Radial (desktop + tablet) */}
      <div className="hidden sm:block relative flex-shrink-0">
        <svg
          ref={svgRef}
          width="480"
          height="400"
          viewBox="0 0 480 400"
          className="overflow-visible"
          aria-labelledby="signal-ingestion-title"
        >
          <title id="signal-ingestion-title">
            Signal ingestion network diagram
          </title>
          <defs>
            <filter id="glow-blue">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-gold">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connection lines */}
          {nodePositions.map((pos, i) => {
            const src = SIGNAL_SOURCES[i];
            const isHov = hovered === i;
            return (
              <g key={`conn-${src.label}`}>
                <line
                  x1={pos.x}
                  y1={pos.y}
                  x2={cx}
                  y2={cy}
                  stroke={isHov ? src.color : `${src.color}40`}
                  strokeWidth={isHov ? 2 : 1}
                  strokeDasharray="6 4"
                  style={{
                    animation: "dashMove 2s linear infinite",
                    animationDelay: `${i * 0.4}s`,
                    strokeDashoffset: 0,
                  }}
                />
                {/* Traveling dot */}
                <circle r="3" fill={src.color} opacity={isHov ? 0.9 : 0.5}>
                  <animateMotion
                    dur={`${1.5 + i * 0.3}s`}
                    repeatCount="indefinite"
                    path={`M ${pos.x} ${pos.y} L ${cx} ${cy}`}
                  />
                </circle>
              </g>
            );
          })}

          {/* Central node */}
          <circle
            cx={cx}
            cy={cy}
            r={36}
            fill="rgba(212,160,23,0.08)"
            stroke="#d4a017"
            strokeWidth="1.5"
            filter="url(#glow-gold)"
          />
          <circle
            cx={cx}
            cy={cy}
            r={28}
            fill="rgba(212,160,23,0.12)"
            stroke="#d4a017"
            strokeWidth="1"
            className="animate-node-pulse"
          />
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fill="#d4a017"
            fontSize="9"
            fontFamily="Geist Mono"
            letterSpacing="1"
            className="select-none"
          >
            SYNTHESIS
          </text>
          <text
            x={cx}
            y={cy + 8}
            textAnchor="middle"
            fill="#d4a017"
            fontSize="9"
            fontFamily="Geist Mono"
            letterSpacing="1"
            className="select-none"
          >
            ENGINE
          </text>

          {/* Source nodes */}
          {nodePositions.map((pos, i) => {
            const src = SIGNAL_SOURCES[i];
            const isHov = hovered === i;
            return (
              <g
                key={`node-${src.label}`}
                data-ocid={`steami.ingestion.node.${i + 1}`}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => {
                  setHovered(i);
                  setTooltip(getTooltipPos(i));
                }}
                onMouseLeave={() => {
                  setHovered(null);
                  setTooltip(null);
                }}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isHov ? 22 : 18}
                  fill={isHov ? `${src.color}20` : `${src.color}10`}
                  stroke={isHov ? src.color : `${src.color}60`}
                  strokeWidth={isHov ? 2 : 1}
                  filter={isHov ? "url(#glow-blue)" : undefined}
                  style={{ transition: "all 0.25s ease" }}
                />
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fill={isHov ? src.color : `${src.color}cc`}
                  fontSize="14"
                  fontFamily="Sora"
                  className="select-none"
                >
                  ◉
                </text>
                {/* Short label below node */}
                <foreignObject
                  x={pos.x - 50}
                  y={pos.y + 26}
                  width="100"
                  height="40"
                  style={{ overflow: "visible" }}
                >
                  <p
                    style={{
                      fontSize: "8px",
                      textAlign: "center",
                      color: isHov
                        ? "rgba(255,255,255,0.85)"
                        : "rgba(255,255,255,0.4)",
                      fontFamily: "Geist Mono, monospace",
                      letterSpacing: "0.05em",
                      lineHeight: "1.4",
                      margin: 0,
                    }}
                  >
                    {src.label}
                  </p>
                </foreignObject>
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hovered !== null && tooltip && (
          <div
            className="absolute pointer-events-none z-20 rounded-sm p-3 max-w-[200px]"
            style={{
              left: tooltip.x + 30,
              top: tooltip.y - 40,
              background: "rgba(4,5,14,0.95)",
              border: `1px solid ${SIGNAL_SOURCES[hovered].color}50`,
              backdropFilter: "blur(16px)",
              boxShadow: `0 4px 20px rgba(0,0,0,0.6), 0 0 12px ${SIGNAL_SOURCES[hovered].color}20`,
            }}
          >
            <div
              className="font-mono-geist text-[8px] tracking-[0.2em] uppercase mb-1"
              style={{ color: SIGNAL_SOURCES[hovered].color }}
            >
              {SIGNAL_SOURCES[hovered].label}
            </div>
            <p
              className="text-[10px] leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.55)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              {SIGNAL_SOURCES[hovered].desc}
            </p>
          </div>
        )}
      </div>

      {/* Mobile: vertical list */}
      <div className="sm:hidden w-full space-y-3">
        {SIGNAL_SOURCES.map((src, i) => (
          <div
            key={src.label}
            data-ocid={`steami.ingestion.node.${i + 1}`}
            className="p-4 rounded-sm"
            style={{
              background: `${src.color}08`,
              border: `1px solid ${src.color}35`,
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-2 h-2 rounded-full animate-node-pulse flex-shrink-0"
                style={{ background: src.color }}
              />
              <div
                className="font-mono-geist text-[9px] tracking-[0.15em] uppercase"
                style={{ color: src.color }}
              >
                {src.label}
              </div>
            </div>
            <p
              className="text-xs leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.45)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              {src.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Right side description (desktop) */}
      <div className="hidden sm:flex flex-col gap-4 max-w-xs">
        <div
          className="font-mono-geist text-[9px] tracking-[0.3em] uppercase mb-1"
          style={{ color: "rgba(74,126,247,0.6)" }}
        >
          INPUT SIGNALS
        </div>
        {SIGNAL_SOURCES.map((src, i) => (
          <div
            key={src.label}
            data-ocid={`steami.ingestion.node.${i + 1}`}
            className="flex items-start gap-3 cursor-default transition-all duration-200"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 animate-node-pulse"
              style={{
                background: hovered === i ? src.color : `${src.color}70`,
              }}
            />
            <div>
              <div
                className="font-mono-geist text-[9px] tracking-[0.1em] uppercase mb-0.5"
                style={{
                  color: hovered === i ? src.color : "rgba(255,255,255,0.45)",
                }}
              >
                {src.label}
              </div>
              <p
                className="text-[10px] leading-relaxed"
                style={{
                  color: "rgba(255,255,255,0.3)",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                {src.desc.slice(0, 70)}...
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Synthesis Pipeline ───────────────────────────────────────────────────────
const SYNTHESIS_STEPS = [
  {
    label: "Signal Analysis",
    glyph: "◎",
    color: "#4a7ef7",
    methodology:
      "Raw intelligence signals are processed, normalized and classified by domain and confidence score",
  },
  {
    label: "Pattern Detection",
    glyph: "◇",
    color: "#22d3b0",
    methodology:
      "ML-assisted pattern recognition identifies correlations across disparate data sources",
  },
  {
    label: "Cross-domain Synthesis",
    glyph: "◈",
    color: "#d4a017",
    methodology:
      "Insights from climate, technology, health and policy domains are cross-referenced and synthesized",
  },
  {
    label: "Insight Generation",
    glyph: "◆",
    color: "#a78bfa",
    methodology:
      "Validated insights are structured into intelligence frameworks with evidence chains",
  },
  {
    label: "Intelligence Brief",
    glyph: "▷",
    color: "#22d3b0",
    methodology:
      "Decision-grade intelligence products formatted for target audiences and distribution channels",
  },
];

function SynthesisPipeline() {
  const [activeStep, setActiveStep] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (locked) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % SYNTHESIS_STEPS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [locked]);

  const handleClick = (i: number) => {
    setActiveStep(i);
    setLocked(true);
  };

  return (
    <div>
      {/* Steps row */}
      <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0 mb-6">
        {SYNTHESIS_STEPS.map((step, i) => {
          const isActive = activeStep === i;
          return (
            <div
              key={step.label}
              className="flex sm:flex-col items-center sm:flex-1 gap-2 sm:gap-0"
            >
              <button
                type="button"
                data-ocid={`steami.synthesis.step.${i + 1}`}
                onClick={() => handleClick(i)}
                className="flex-1 sm:flex-none sm:w-full text-left sm:text-center px-3 py-3 sm:py-4 rounded-sm transition-all duration-400 cursor-pointer"
                style={{
                  background: isActive
                    ? `${step.color}14`
                    : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isActive ? `${step.color}60` : "rgba(255,255,255,0.07)"}`,
                  boxShadow: isActive
                    ? `0 0 20px ${step.color}20, 0 4px 16px rgba(0,0,0,0.3)`
                    : "none",
                  transform: isActive ? "scale(1.04)" : "scale(1)",
                }}
              >
                <div
                  className="text-lg mb-1"
                  style={{ color: isActive ? step.color : `${step.color}60` }}
                  aria-hidden="true"
                >
                  {step.glyph}
                </div>
                <div
                  className="font-mono-geist text-[8px] tracking-[0.15em] uppercase"
                  style={{
                    color: isActive ? step.color : "rgba(255,255,255,0.3)",
                  }}
                >
                  {step.label}
                </div>
              </button>
              {i < SYNTHESIS_STEPS.length - 1 && (
                <div
                  className="hidden sm:flex items-center"
                  style={{
                    color:
                      activeStep === i
                        ? SYNTHESIS_STEPS[i].color
                        : "rgba(255,255,255,0.12)",
                  }}
                  aria-hidden="true"
                >
                  <span className="font-mono-geist text-xs">→</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active step detail */}
      <div
        className="p-6 rounded-sm transition-all duration-400"
        style={{
          background: `${SYNTHESIS_STEPS[activeStep].color}0a`,
          border: `1px solid ${SYNTHESIS_STEPS[activeStep].color}30`,
          borderLeft: `3px solid ${SYNTHESIS_STEPS[activeStep].color}`,
        }}
      >
        <div
          className="font-mono-geist text-[9px] tracking-[0.3em] uppercase mb-3"
          style={{ color: SYNTHESIS_STEPS[activeStep].color }}
        >
          METHODOLOGY — STEP {String(activeStep + 1).padStart(2, "0")}
        </div>
        <p
          className="text-sm leading-relaxed"
          style={{
            color: "rgba(255,255,255,0.7)",
            fontFamily: "Sora, sans-serif",
          }}
        >
          {SYNTHESIS_STEPS[activeStep].methodology}
        </p>
        {locked && (
          <button
            type="button"
            onClick={() => setLocked(false)}
            className="mt-3 font-mono-geist text-[8px] tracking-[0.2em] uppercase"
            style={{
              color: "rgba(255,255,255,0.25)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            RESUME AUTO →
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Insight Streams ──────────────────────────────────────────────────────────
const INSIGHT_STREAMS = [
  {
    label: "AI Governance",
    glyph: "◈",
    color: "#4a7ef7",
    desc: "Comprehensive analysis of global artificial intelligence policy frameworks, regulatory developments and institutional governance structures.",
    signalCount: "18+",
  },
  {
    label: "Climate Systems",
    glyph: "◇",
    color: "#22d3b0",
    desc: "Synthesis of planetary climate data, environmental monitoring outputs and sustainability intelligence from global research networks.",
    signalCount: "24+",
  },
  {
    label: "Emerging Technologies",
    glyph: "▷",
    color: "#d4a017",
    desc: "Foresight intelligence on breakthrough technologies, disruptive innovation patterns and emerging capability developments.",
    signalCount: "15+",
  },
  {
    label: "Global Health Intelligence",
    glyph: "◆",
    color: "#a78bfa",
    desc: "Decision-grade analysis of global health systems, epidemiological patterns and healthcare infrastructure intelligence.",
    signalCount: "12+",
  },
  {
    label: "Future Infrastructure",
    glyph: "◎",
    color: "#4a7ef7",
    desc: "Intelligence on next-generation infrastructure development, smart systems integration and sustainable urban planning.",
    signalCount: "9+",
  },
];

function InsightStreams({
  onFilterLibrary,
}: { onFilterLibrary: (domain: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {INSIGHT_STREAMS.map((stream, i) => (
        <div
          key={stream.label}
          data-ocid={`steami.stream.card.${i + 1}`}
          className="relative overflow-hidden rounded-sm cursor-default transition-all duration-300"
          style={
            {
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${stream.color}30`,
              "--scan-delay": `${i * 1.2}s`,
            } as React.CSSProperties
          }
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.background = `${stream.color}0a`;
            el.style.borderColor = `${stream.color}60`;
            el.style.boxShadow = `0 0 24px ${stream.color}15, 0 8px 32px rgba(0,0,0,0.35)`;
            el.style.transform = "translateY(-4px)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.background = "rgba(255,255,255,0.03)";
            el.style.borderColor = `${stream.color}30`;
            el.style.boxShadow = "none";
            el.style.transform = "none";
          }}
        >
          {/* Scan line */}
          <div
            className="animate-card-scan absolute inset-x-0 top-0 h-[1px] pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, ${stream.color}70, transparent)`,
            }}
            aria-hidden="true"
          />

          <div className="p-6">
            {/* Glyph */}
            <div
              className="text-4xl mb-4 animate-glyph-pulse"
              style={{ color: stream.color }}
              aria-hidden="true"
            >
              {stream.glyph}
            </div>

            {/* Domain indicator */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-1.5 h-1.5 rounded-full animate-node-pulse"
                style={{ background: stream.color }}
                aria-hidden="true"
              />
              <span
                className="font-mono-geist text-[8px] tracking-[0.3em] uppercase"
                style={{ color: `${stream.color}80` }}
              >
                ACTIVE DOMAIN
              </span>
            </div>

            <h3
              className="font-display text-xl font-light mb-2"
              style={{
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.06em",
              }}
            >
              {stream.label}
            </h3>

            <p
              className="text-xs leading-relaxed mb-4"
              style={{
                color: "rgba(255,255,255,0.45)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              {stream.desc}
            </p>

            <div className="flex items-center justify-between">
              <span
                className="px-2 py-1 rounded-sm text-[9px] font-mono-geist tracking-[0.15em]"
                style={{
                  background: `${stream.color}12`,
                  color: stream.color,
                  border: `1px solid ${stream.color}30`,
                }}
              >
                Signal Count: {stream.signalCount}
              </span>
              <button
                type="button"
                onClick={() => onFilterLibrary(stream.label)}
                className="font-mono-geist text-[9px] tracking-[0.15em] uppercase transition-colors duration-200"
                style={{
                  background: "none",
                  border: "none",
                  color: `${stream.color}70`,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    stream.color;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    `${stream.color}70`;
                }}
              >
                View Stream →
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── STEAMI Intelligence Sub-section ─────────────────────────────────────────
const FOCUS_AREAS = [
  {
    label: "Research Synthesis",
    desc: "Aggregating multi-domain research into coherent intelligence frameworks.",
    color: "#4a7ef7",
  },
  {
    label: "Framework Development",
    desc: "Building structured analytical frameworks for systematic intelligence production.",
    color: "#22d3b0",
  },
  {
    label: "Predictive Modeling",
    desc: "Advanced scenario modeling and trajectory analysis for strategic foresight.",
    color: "#d4a017",
  },
  {
    label: "Risk Analysis",
    desc: "Systematic identification and assessment of emerging risks across domains.",
    color: "#a78bfa",
  },
  {
    label: "Decision Support Tools",
    desc: "Producing actionable intelligence products for evidence-based decision-making.",
    color: "#4a7ef7",
  },
];

// ─── Distribution Network Cards ───────────────────────────────────────────────
const DISTRIBUTION_CHANNELS = [
  {
    label: "Web Platform",
    glyph: "◎",
    color: "#4a7ef7",
    type: "Digital",
    desc: "Primary intelligence portal for public and institutional access. Features searchable knowledge base, interactive briefs and real-time signal feeds.",
  },
  {
    label: "Newsletter",
    glyph: "◇",
    color: "#22d3b0",
    type: "Editorial",
    desc: "Curated intelligence digests delivered to subscriber networks. Tailored by domain interest and audience classification.",
  },
  {
    label: "Video Explainers",
    glyph: "▷",
    color: "#d4a017",
    type: "Media",
    desc: "Complex intelligence translated into accessible visual formats. Produced in partnership with STEAMI Network editorial team.",
  },
  {
    label: "Podcasts",
    glyph: "◈",
    color: "#a78bfa",
    type: "Audio",
    desc: "Long-form intelligence conversations with researchers, policymakers and domain experts. Distributed across major platforms.",
  },
  {
    label: "Policy Publications",
    glyph: "◆",
    color: "#22d3b0",
    type: "Formal",
    desc: "Formal intelligence briefings formatted for institutional and government audiences. Peer-reviewed before distribution.",
  },
  {
    label: "Social Media",
    glyph: "◉",
    color: "#4a7ef7",
    type: "Social",
    desc: "Signal amplification through strategic social channels. Filtered for accuracy and contextual framing.",
  },
];

// ─── Feedback Loop SVG ────────────────────────────────────────────────────────
const CYCLE_NODES = [
  {
    label: "Research",
    color: "#4a7ef7",
    desc: "New research questions are formulated from validated insights and public feedback signals.",
  },
  {
    label: "Intelligence",
    color: "#d4a017",
    desc: "Research outputs enter the STEAMI synthesis pipeline for intelligence processing.",
  },
  {
    label: "Publication",
    color: "#22d3b0",
    desc: "Validated intelligence products are published across STEAMI distribution channels.",
  },
  {
    label: "Public Feedback",
    color: "#a78bfa",
    desc: "Public and institutional responses are collected and analyzed for quality signals.",
  },
  {
    label: "New Research",
    color: "#4a7ef7",
    desc: "Feedback signals inform new research priorities, closing the intelligence loop.",
  },
];

function FeedbackLoopSVG() {
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [travelAngle, setTravelAngle] = useState(0);
  const frameRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);

  useEffect(() => {
    const FPS = 30;
    const FRAME_MS = 1000 / FPS;
    const animate = (now: number) => {
      frameRef.current = requestAnimationFrame(animate);
      if (now - lastFrameRef.current < FRAME_MS) return;
      lastFrameRef.current = now;
      setTravelAngle((prev) => (prev + 1.2) % 360);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const cx = 200;
  const cy = 190;
  const r = 130;

  const nodeAngles = CYCLE_NODES.map(
    (_, i) => (i / CYCLE_NODES.length) * 360 - 90,
  );
  const nodePos = nodeAngles.map((a) => ({
    x: cx + r * Math.cos((a * Math.PI) / 180),
    y: cy + r * Math.sin((a * Math.PI) / 180),
  }));

  // Traveling dot position
  const dotRad = ((travelAngle - 90) * Math.PI) / 180;
  const dotX = cx + r * Math.cos(dotRad);
  const dotY = cy + r * Math.sin(dotRad);

  // Which node is nearest the traveling dot?
  const nearestNode = nodeAngles.reduce((best, a, i) => {
    const diff = Math.abs((travelAngle - (a + 90) + 360) % 360);
    const bestDiff = Math.abs(
      (travelAngle - (nodeAngles[best] + 90) + 360) % 360,
    );
    return diff < bestDiff ? i : best;
  }, 0);

  return (
    <div className="flex flex-col lg:flex-row items-center gap-8">
      {/* SVG Circle */}
      <div className="flex-shrink-0">
        <svg
          width="400"
          height="380"
          viewBox="0 0 400 380"
          className="overflow-visible"
          aria-labelledby="feedback-cycle-title"
        >
          <title id="feedback-cycle-title">
            Intelligence feedback cycle diagram
          </title>
          {/* Circle path */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="rgba(74,126,247,0.12)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* Glowing track segment near dot */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="rgba(74,126,247,0.35)"
            strokeWidth="2"
            strokeDasharray="20 500"
            strokeDashoffset={-((travelAngle / 360) * 2 * Math.PI * r)}
            strokeLinecap="round"
          />

          {/* Nodes */}
          {nodePos.map((pos, i) => {
            const isNearest = nearestNode === i;
            const isHovered = activeNode === i;
            const node = CYCLE_NODES[i];
            const pulse = isNearest || isHovered;
            return (
              <g
                key={node.label}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setActiveNode(i)}
                onMouseLeave={() => setActiveNode(null)}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={pulse ? 20 : 16}
                  fill={pulse ? `${node.color}20` : `${node.color}0a`}
                  stroke={pulse ? node.color : `${node.color}50`}
                  strokeWidth={pulse ? 2 : 1}
                  style={{ transition: "all 0.3s ease" }}
                />
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  textAnchor="middle"
                  fill={pulse ? node.color : `${node.color}80`}
                  fontSize="12"
                  fontFamily="Sora"
                  className="select-none"
                >
                  ◆
                </text>
                {/* Label */}
                <foreignObject
                  x={pos.x - 45}
                  y={pos.y + 24}
                  width="90"
                  height="30"
                >
                  <p
                    style={{
                      fontSize: "8px",
                      textAlign: "center",
                      color: pulse
                        ? "rgba(255,255,255,0.85)"
                        : "rgba(255,255,255,0.35)",
                      fontFamily: "Geist Mono, monospace",
                      letterSpacing: "0.05em",
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {node.label}
                  </p>
                </foreignObject>
              </g>
            );
          })}

          {/* Traveling dot with comet tail — stable keys from step number */}
          <circle
            key="tail-step-10-of-10"
            cx={cx + r * Math.cos(((travelAngle - 90 - 45) * Math.PI) / 180)}
            cy={cy + r * Math.sin(((travelAngle - 90 - 45) * Math.PI) / 180)}
            r={0.35}
            fill="rgba(74,126,247,0.005)"
          />
          <circle
            key="tail-step-9-of-10"
            cx={cx + r * Math.cos(((travelAngle - 90 - 40.5) * Math.PI) / 180)}
            cy={cy + r * Math.sin(((travelAngle - 90 - 40.5) * Math.PI) / 180)}
            r={0.7}
            fill="rgba(74,126,247,0.018)"
          />
          <circle
            key="tail-step-8-of-10"
            cx={cx + r * Math.cos(((travelAngle - 90 - 36) * Math.PI) / 180)}
            cy={cy + r * Math.sin(((travelAngle - 90 - 36) * Math.PI) / 180)}
            r={1.05}
            fill="rgba(74,126,247,0.038)"
          />
          <circle
            key="tail-step-7-of-10"
            cx={cx + r * Math.cos(((travelAngle - 90 - 31.5) * Math.PI) / 180)}
            cy={cy + r * Math.sin(((travelAngle - 90 - 31.5) * Math.PI) / 180)}
            r={1.4}
            fill="rgba(74,126,247,0.063)"
          />
          <circle
            key="tail-step-6-of-10"
            cx={cx + r * Math.cos(((travelAngle - 90 - 27) * Math.PI) / 180)}
            cy={cy + r * Math.sin(((travelAngle - 90 - 27) * Math.PI) / 180)}
            r={1.75}
            fill="rgba(74,126,247,0.090)"
          />
          <circle
            key="tail-step-5-of-10"
            cx={cx + r * Math.cos(((travelAngle - 90 - 22.5) * Math.PI) / 180)}
            cy={cy + r * Math.sin(((travelAngle - 90 - 22.5) * Math.PI) / 180)}
            r={2.1}
            fill="rgba(74,126,247,0.125)"
          />
          <circle
            key="tail-step-4-of-10"
            cx={cx + r * Math.cos(((travelAngle - 90 - 18) * Math.PI) / 180)}
            cy={cy + r * Math.sin(((travelAngle - 90 - 18) * Math.PI) / 180)}
            r={2.45}
            fill="rgba(74,126,247,0.160)"
          />
          <circle
            key="tail-step-3-of-10"
            cx={cx + r * Math.cos(((travelAngle - 90 - 13.5) * Math.PI) / 180)}
            cy={cy + r * Math.sin(((travelAngle - 90 - 13.5) * Math.PI) / 180)}
            r={2.8}
            fill="rgba(74,126,247,0.200)"
          />
          <circle
            key="tail-step-2-of-10"
            cx={cx + r * Math.cos(((travelAngle - 90 - 9) * Math.PI) / 180)}
            cy={cy + r * Math.sin(((travelAngle - 90 - 9) * Math.PI) / 180)}
            r={3.15}
            fill="rgba(74,126,247,0.250)"
          />
          <circle
            key="tail-step-1-of-10"
            cx={cx + r * Math.cos(((travelAngle - 90 - 4.5) * Math.PI) / 180)}
            cy={cy + r * Math.sin(((travelAngle - 90 - 4.5) * Math.PI) / 180)}
            r={3.5}
            fill="rgba(74,126,247,0.320)"
          />
          {/* Outer glow ring */}
          <circle cx={dotX} cy={dotY} r={11} fill="rgba(74,126,247,0.1)" />
          {/* Mid glow */}
          <circle cx={dotX} cy={dotY} r={7} fill="rgba(74,126,247,0.28)" />
          {/* White-hot core */}
          <circle cx={dotX} cy={dotY} r={3.5} fill="rgba(255,255,255,0.92)" />
          {/* Blue accent ring */}
          <circle
            cx={dotX}
            cy={dotY}
            r={5}
            fill="none"
            stroke="rgba(74,126,247,0.5)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Node detail panel */}
      <div className="flex-1 space-y-3">
        <div
          className="font-mono-geist text-[9px] tracking-[0.3em] uppercase mb-4"
          style={{ color: "rgba(74,126,247,0.6)" }}
        >
          CYCLE STAGES — HOVER TO EXPLORE
        </div>
        {CYCLE_NODES.map((node, i) => {
          const isActive = activeNode === i || nearestNode === i;
          return (
            <div
              key={node.label}
              className="flex items-start gap-4 p-4 rounded-sm cursor-default transition-all duration-300"
              style={{
                background: isActive
                  ? `${node.color}0a`
                  : "rgba(255,255,255,0.02)",
                border: `1px solid ${isActive ? `${node.color}40` : "rgba(255,255,255,0.05)"}`,
              }}
              onMouseEnter={() => setActiveNode(i)}
              onMouseLeave={() => setActiveNode(null)}
            >
              <div
                className="w-2 h-2 rounded-full mt-1 flex-shrink-0 animate-node-pulse"
                style={{
                  background: isActive ? node.color : `${node.color}50`,
                }}
              />
              <div>
                <div
                  className="font-mono-geist text-[9px] tracking-[0.15em] uppercase mb-1"
                  style={{
                    color: isActive ? node.color : "rgba(255,255,255,0.35)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")} — {node.label}
                </div>
                <p
                  className="text-[10px] leading-relaxed"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontFamily: "Sora, sans-serif",
                  }}
                >
                  {node.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Ethics Principles ────────────────────────────────────────────────────────
const ETHICS_PRINCIPLES = [
  {
    name: "Transparency",
    desc: "All methodologies, sources and limitations are disclosed with every intelligence product.",
    glyph: "◎",
  },
  {
    name: "Accuracy",
    desc: "Multi-source verification and expert review before any insight is classified as decision-grade.",
    glyph: "◈",
  },
  {
    name: "Bias Mitigation",
    desc: "Systematic bias detection and correction protocols applied across all synthesis processes.",
    glyph: "◇",
  },
  {
    name: "Societal Responsibility",
    desc: "Impact assessment ensures intelligence products serve the broader public good.",
    glyph: "◆",
  },
];

// ─── Library Card ─────────────────────────────────────────────────────────────
const DOMAIN_COLORS: Record<string, string> = {
  "AI Governance": "#4a7ef7",
  "Climate Systems": "#22d3b0",
  Climate: "#22d3b0",
  "Emerging Technologies": "#d4a017",
  "Global Health Intelligence": "#a78bfa",
  "Future Infrastructure": "#4a7ef7",
  Research: "#4a7ef7",
  Ethics: "#a78bfa",
  Technology: "#d4a017",
  Health: "#a78bfa",
};

function getDomainColor(domain: string): string {
  return DOMAIN_COLORS[domain] ?? "#4a7ef7";
}

function formatFeedDate(ts: bigint): string {
  const ms = Number(ts);
  if (ms > 1e12) {
    return new Date(ms).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  return "—";
}

// ─── Editorial Pieces ─────────────────────────────────────────────────────────
type EditorialPiece = {
  id: string;
  title: string;
  eyebrow: string;
  domain: string;
  accentColor: string;
  readTime: string;
  heroSymbol: string;
  summary: string;
  lead: string;
  sections: { heading: string; body: string }[];
  keySignals: string[];
  implications: string[];
  tags: string[];
  cardAnim:
    | "pulse"
    | "scan"
    | "cascade"
    | "waveform"
    | "orbit"
    | "grid"
    | "flow"
    | "ripple"
    | "fractal"
    | "heatmap";
};

const EDITORIAL_PIECES: EditorialPiece[] = [
  {
    id: "ep-001",
    title: "The Governance Gap: Why AI Regulation Is Racing to Catch a Shadow",
    eyebrow: "AI GOVERNANCE INTELLIGENCE",
    domain: "AI Governance",
    accentColor: "#4a7ef7",
    readTime: "5 min read",
    heroSymbol: "⬡",
    summary:
      "Regulatory frameworks across 140+ nations are fragmenting as AI capability outpaces institutional response. STEAMI maps the emerging fault lines between technical acceleration and governance architecture.",
    lead: "In the span of 36 months, artificial intelligence has transitioned from a research curiosity to a critical infrastructure component embedded in healthcare decisions, judicial processes, financial systems, and military planning. Yet the governance architecture designed to manage this transition remains fractured, underfunded, and fundamentally misaligned with the speed of deployment.",
    sections: [
      {
        heading: "The Regulatory Fragmentation Problem",
        body: "Across the European Union, United States, China, and emerging economies, AI governance approaches diverge dramatically. The EU's AI Act classifies systems by risk tier, imposing compliance obligations before deployment. The US relies on sector-specific guidance and voluntary frameworks. China mandates algorithmic transparency for recommendation systems while operating a centralized oversight model. This fragmentation creates what governance scholars call 'regulatory arbitrage' — the systematic exploitation of jurisdictional gaps by deployers seeking the least constrained operating environment. STEAMI analysis of 47 national AI policy documents reveals that fewer than 12 percent include binding enforcement mechanisms with allocated budgets.",
      },
      {
        heading: "Institutional Capacity and the Expertise Deficit",
        body: "Even where regulations exist, enforcement capacity is largely absent. Most national regulatory agencies lack technical staff capable of auditing large language models, computer vision systems, or reinforcement learning architectures. The United Kingdom's AI Safety Institute, widely regarded as a leading institutional effort, operates with a staff smaller than the engineering team of a mid-tier AI startup. This asymmetry between regulated entities and regulators is not incidental — it reflects structural underinvestment in public-sector technical capacity accumulated over decades of privatisation ideology. Without deliberate state investment in technical governance expertise, regulation becomes a document rather than a function.",
      },
      {
        heading: "The Emerging International Architecture",
        body: "Despite fragmentation, certain multilateral initiatives are gaining traction. The Hiroshima AI Process initiated by the G7, the Bletchley Declaration on frontier AI safety, and emerging UN advisory work represent the first tentative architecture of international AI governance. STEAMI assessment indicates these frameworks remain consultative rather than binding, and largely exclude the Global South from meaningful participation. The diplomatic challenge is acute: binding international AI governance requires the same states competing most fiercely in AI development to voluntarily constrain their own strategic advantage. Historical analogies to nuclear non-proliferation suggest this is possible but took decades and multiple catastrophic near-misses to achieve.",
      },
    ],
    keySignals: [
      "Only 12% of national AI policies include binding enforcement mechanisms",
      "Regulatory expertise gap between agencies and frontier AI labs widening annually",
      "G7 Hiroshima Process: consultative but no binding commitments yet",
      "AI governance arbitrage accelerating cross-border deployment strategies",
      "UN Secretary-General's Advisory Body on AI: 39 recommendations, 0 binding mechanisms",
    ],
    implications: [
      "Institutions deploying AI in high-stakes domains face compound liability exposure as governance catches up",
      "Technical standards bodies (ISO, IEEE, NIST) gaining de facto governance power in absence of binding law",
      "Nations with strong regulatory frameworks risk disadvantage unless international coordination improves",
    ],
    tags: [
      "AI Policy",
      "Regulation",
      "Global Governance",
      "Institutional Capacity",
    ],
    cardAnim: "pulse",
  },
  {
    id: "ep-002",
    title:
      "Planetary Boundaries Under Pressure: The Science of Earth System Limits",
    eyebrow: "CLIMATE SYSTEMS ANALYSIS",
    domain: "Climate Systems",
    accentColor: "#22c55e",
    readTime: "5 min read",
    heroSymbol: "◉",
    summary:
      "Six of nine planetary boundaries have now been transgressed. STEAMI synthesises the latest Earth system science to map what cascading threshold crossings mean for civilisational stability over the next 30 years.",
    lead: "The planetary boundaries framework, developed by Earth system scientists including Johan Rockström and Will Steffen, identifies nine biophysical systems whose stability underpins human civilisation. As of the most recent assessment published in Science Advances, six of these boundaries have been crossed: climate change, biosphere integrity, land-system change, freshwater change, biogeochemical flows, and novel entities including synthetic chemicals and plastics.",
    sections: [
      {
        heading: "What Transgression Actually Means",
        body: "A common misunderstanding treats planetary boundary transgression as binary — safe or unsafe. The science is more nuanced and more alarming. Each boundary defines a 'safe operating space' beyond which the risk of abrupt, nonlinear, or irreversible Earth system change increases substantially. Transgression does not guarantee catastrophe at a fixed threshold; it increases the probability of tipping point activation, which in complex systems is characterised by discontinuous rather than gradual change. The analogy from engineering is structural overload: a bridge can carry load beyond its design rating for a period before failure, but the probability of catastrophic collapse increases nonlinearly with load beyond the design limit.",
      },
      {
        heading: "The Interconnection Problem: When Boundaries Cascade",
        body: "The most significant finding of recent Earth system science is not any individual boundary transgression but the interactions between them. Climate change accelerates land degradation, which impairs freshwater systems, which reduces agricultural productivity, which drives land conversion, which further degrades biosphere integrity. These feedback loops can amplify local shocks into regional and global disruptions far exceeding what any single boundary assessment suggests. STEAMI modelling of compound boundary interaction scenarios indicates that current trajectory — with multiple boundaries transgressed simultaneously — creates qualitatively different risk than historical analogues where boundaries were crossed individually and sequentially.",
      },
      {
        heading: "Implications for Long-Horizon Institutional Planning",
        body: "For institutions with 10- to 50-year planning horizons, planetary boundary science presents a fundamental challenge: standard risk frameworks assume stationarity — the future resembling the past with quantifiable variance. Earth system evidence increasingly suggests non-stationarity: we are operating in a novel state with no historical precedent at current greenhouse gas concentrations, biodiversity loss rates, and chemical pollution loads. STEMONEF's TERRA and EPOCHS programs are designed precisely around this challenge — developing research and intelligence frameworks capable of operating productively under deep uncertainty rather than false precision.",
      },
    ],
    keySignals: [
      "6 of 9 planetary boundaries now transgressed (2023 Science Advances assessment)",
      "Biosphere integrity boundary transgression most severe — 10x above safe threshold",
      "Novel entities boundary includes 350,000+ manufactured chemicals with largely unknown systemic effects",
      "Freshwater boundary crossed 2023 — first time since framework developed",
      "Cascading boundary interactions create non-linear risk amplification",
    ],
    implications: [
      "Infrastructure designed for 20th-century climate conditions faces systematic obsolescence",
      "Agricultural systems dependent on stable precipitation and temperature regimes face compound stress",
      "Insurance and financial risk models built on historical data become unreliable under non-stationary conditions",
    ],
    tags: [
      "Planetary Science",
      "Climate Risk",
      "Earth Systems",
      "Tipping Points",
    ],
    cardAnim: "orbit",
  },
  {
    id: "ep-003",
    title:
      "The Global Health Intelligence Deficit: What We Don't Know Is Killing Us",
    eyebrow: "GLOBAL HEALTH INTELLIGENCE",
    domain: "Global Health",
    accentColor: "#ec4899",
    readTime: "5 min read",
    heroSymbol: "⬟",
    summary:
      "Pandemic preparedness, antimicrobial resistance, and mental health represent three converging crises where information asymmetry — not just resource scarcity — is the binding constraint on effective response.",
    lead: "The COVID-19 pandemic exposed a paradox at the heart of global health: in a world of unprecedented connectivity and data generation, the most consequential health decisions were made with dramatic uncertainty. Epidemiological surveillance in many regions remained dependent on infrastructure designed in the 1950s. Genomic sequencing capacity was concentrated in fewer than 30 countries. And the institutional architecture for translating available evidence into coordinated policy action proved fragile under real-world stress.",
    sections: [
      {
        heading: "Surveillance Gaps and the Unknown Burden of Disease",
        body: "Global health intelligence — the systematic collection, analysis, and communication of information about health threats — is profoundly uneven in geographic coverage and methodological quality. The Institute for Health Metrics and Evaluation estimates that fewer than 40% of global deaths are registered with cause-of-death information. In sub-Saharan Africa, this figure falls below 20%. Without mortality data, excess mortality surveillance — the primary tool for detecting novel disease emergence — is essentially non-functional. The practical implication is that a pandemic originating in regions with weak surveillance infrastructure can circulate for months before detection, as the early COVID-19 timeline demonstrated. Investment in civil registration and vital statistics systems is arguably the highest-return intervention in global health security.",
      },
      {
        heading:
          "Antimicrobial Resistance: The Silent Pandemic Already Underway",
        body: "While public attention focused on COVID-19, antimicrobial resistance (AMR) continued its steady advance. The Lancet published estimates attributing 1.27 million deaths directly to AMR in 2019, with 4.95 million deaths associated with bacterial AMR. Projections for 2050 range from 10 to 40 million annual deaths under high-resistance scenarios. AMR is a classic collective action problem: individual incentives to use antibiotics are strong; incentives to invest in stewardship, new antibiotic development, or AMR surveillance are weak. The pipeline for new antibiotics has been largely empty for 40 years, as pharmaceutical economics systematically undervalue treatments designed to be used rarely and for short durations.",
      },
      {
        heading: "Mental Health: The Neglected Dimension of Global Burden",
        body: "Mental health disorders account for approximately 14% of global disability-adjusted life years lost, yet receive less than 2% of national health budgets in most low- and middle-income countries. The treatment gap — the proportion of people with diagnosable conditions who receive no treatment — exceeds 75% in most of the world. STEAMI intelligence synthesis identifies mental health as a critical area where the gap between problem magnitude and institutional response is growing rather than closing, particularly following the documented global deterioration in mental health indicators following the COVID-19 pandemic. This represents both a humanitarian challenge and an economic one: untreated mental health conditions represent one of the largest sources of lost productivity globally.",
      },
    ],
    keySignals: [
      "Under 40% of global deaths have registered cause-of-death information",
      "AMR directly responsible for 1.27M deaths annually — projected to reach 10M+ by 2050",
      "Mental health treatment gap: 75%+ in most LMICs",
      "COVID-19 caused measurable global mental health deterioration — recovery incomplete",
      "Health security index: only 13 countries score above 70/100 on pandemic preparedness",
    ],
    implications: [
      "Global health security requires surveillance infrastructure investment in data-poor regions",
      "AMR demands new public-private models for antibiotic development that don't rely purely on market incentives",
      "Mental health integration into primary healthcare is highest-leverage scalable intervention",
    ],
    tags: [
      "Pandemic Preparedness",
      "AMR",
      "Mental Health",
      "Health Surveillance",
    ],
    cardAnim: "waveform",
  },
  {
    id: "ep-004",
    title: "Synthetic Biology and the Coming Age of Programmable Life",
    eyebrow: "EMERGING TECHNOLOGY INTELLIGENCE",
    domain: "Emerging Technology",
    accentColor: "#a78bfa",
    readTime: "5 min read",
    heroSymbol: "◈",
    summary:
      "The convergence of CRISPR gene editing, automated DNA synthesis, and AI-driven protein design is creating a new technological paradigm. STEAMI maps the transformative potential and the profound governance challenges of programmable biology.",
    lead: "Synthetic biology — the engineering of biological systems for new functions — has transitioned from a laboratory curiosity to an industrial platform in less than a decade. The convergence of three enabling technologies has driven this transition: CRISPR-Cas9 gene editing tools that can modify genomes with unprecedented precision, automated DNA synthesis that can produce arbitrary genetic sequences at rapidly falling cost, and artificial intelligence-powered protein structure prediction (exemplified by AlphaFold) that bridges genetic sequence and functional molecular structure.",
    sections: [
      {
        heading: "The Platform Nature of Synthetic Biology",
        body: "Unlike most previous technological revolutions, synthetic biology is a platform technology — meaning its applications span virtually every sector of the economy. In medicine: engineered microorganisms producing insulin, cancer-fighting T-cells reprogrammed to target specific tumours, gene therapies correcting inherited disorders. In agriculture: crops edited for drought resistance, pest resistance, or enhanced nutritional profiles. In materials: spider silk proteins produced by bacteria for ultra-strong lightweight materials, biodegradable plastics synthesised from engineered yeast. In energy: microorganisms engineered to produce hydrogen or hydrocarbon fuels from sunlight and CO2. The breadth of application domains means synthetic biology's economic and social impact is likely to be comparable to the digital revolution, unfolding over a similar 30-to-50-year timeframe.",
      },
      {
        heading: "The Biosecurity Dimension",
        body: "The same capabilities that enable beneficial applications also lower the barriers to the creation of biological weapons or accidental creation of dangerous organisms. The dual-use dilemma in synthetic biology is more acute than in most technologies because the tools are increasingly accessible, the expertise required is dispersing globally, and biological systems can self-replicate in ways digital systems cannot. A synthetic pathogen, once released, cannot be recalled like software. STEAMI analysis of international biosecurity governance identifies a fundamental tension between the drive to democratise access to biotechnology tools for beneficial purposes and the need to prevent their misuse. Current governance approaches, developed primarily around state-level bioweapons programs, are poorly adapted to the emerging landscape of distributed, low-cost biological engineering capabilities.",
      },
      {
        heading: "The Ethical Architecture of Engineered Life",
        body: "Beyond biosecurity, synthetic biology raises profound ethical questions that extend into environmental philosophy, theology, and political theory. The prospect of creating novel organisms with no evolutionary history raises questions about the moral status of engineered life. The potential for germline gene editing — inheritable genetic modifications passed to future generations — raises intergenerational justice concerns. Environmental release of engineered organisms (for example, gene drives designed to eliminate disease-carrying mosquito populations) raises sovereignty questions about who has the right to make permanent modifications to shared ecosystems. These are not merely academic questions; they will increasingly present as concrete policy decisions requiring governance frameworks that do not yet exist.",
      },
    ],
    keySignals: [
      "DNA synthesis cost has fallen 100,000x in 20 years — approaching commodity pricing",
      "AlphaFold has predicted structures for 200M+ proteins — transforming drug discovery",
      "Synthetic biology market projected to reach $30B+ by 2030",
      "Biosecurity governance lags capability by an estimated 10-15 years",
      "First gene-edited humans: He Jiankui case — governance failure at individual, institutional, and national level",
    ],
    implications: [
      "Healthcare systems will be transformed by programmable cell therapies and personalised genetic medicine",
      "Agricultural systems face both opportunity (resilience) and risk (ecological release) from synthetic biology",
      "International biosecurity governance requires urgent modernisation to address non-state actors and dual-use research",
    ],
    tags: ["CRISPR", "Biotech", "Biosecurity", "Gene Editing"],
    cardAnim: "cascade",
  },
  {
    id: "ep-005",
    title:
      "Education Systems at the Breaking Point: Reimagining Learning for a Complex World",
    eyebrow: "TALENT & KNOWLEDGE SYSTEMS",
    domain: "Education Intelligence",
    accentColor: "#f59e0b",
    readTime: "5 min read",
    heroSymbol: "△",
    summary:
      "The global education system was designed for industrial-era requirements. As AI automates cognitive labour and climate change reshapes economies, STEAMI examines the structural misalignment between how we educate and what the world now demands.",
    lead: "The architecture of mass education — age-graded cohorts, subject-siloed curricula, standardised assessment, credential-based gatekeeping — was largely designed between 1850 and 1950 to meet the labour requirements of industrial economies. It was optimised to produce literate, numerate workers capable of following instructions, tolerating repetitive tasks, and functioning within hierarchical organisations. The world that system was designed for has been transforming rapidly for decades. The pace of that transformation is now accelerating.",
    sections: [
      {
        heading: "The Automation Adjacency Problem",
        body: "Labour economists have spent the past decade mapping which occupational tasks are most susceptible to automation. The consistent finding is that routinised cognitive and physical tasks — precisely those targeted by industrial education systems — are highest-risk. What AI systems are currently least capable of replicating is a specific combination of skills: complex social interaction, creative synthesis across domains, ethical reasoning under uncertainty, and physical manipulation in unstructured environments. The educational implication is clear: systems that optimise for reliable information retrieval, rule-following, and standardised procedural competence are preparing students for the jobs most likely to be automated. Yet curriculum reform is extraordinarily slow — subject areas, pedagogical traditions, and assessment systems are deeply institutionalised and resistant to change.",
      },
      {
        heading: "The Access Dimension: Education as an Equity Mechanism",
        body: "Global primary school enrolment has reached historically high levels — a genuine achievement of development policy. Yet enrolment statistics mask profound quality differentials. Learning-adjusted years of schooling — a metric that combines enrolment duration with actual learning outcomes — varies from over 10 years in Singapore and Finland to under 4 years in parts of sub-Saharan Africa and South Asia. This means children in different parts of the world are completing the same nominal years of schooling while acquiring dramatically different cognitive capabilities. The quality gap is arguably more important than the enrolment gap, and far less well-addressed by current development programming. HUMANON's talent incubation philosophy directly addresses this by focusing on learning quality and real-world application rather than credential accumulation.",
      },
      {
        heading: "What a Redesigned System Could Look Like",
        body: "A growing body of educational research, from neuroscience, behavioural economics, and educational technology, is converging on an alternative vision of effective learning. It is characterised by: mastery-based progression rather than age-graded cohorts; project-based and inquiry-driven learning that develops synthesis and application skills; personalised learning trajectories supported by adaptive technology; mentored engagement with real problems rather than simulated exercises; and portfolio-based assessment rather than standardised testing. None of these ideas are new — progressive education has advocated many of them for a century. What is new is the combination of technological infrastructure to deliver them at scale and increasing economic urgency as the credential system decouples from labour market value.",
      },
    ],
    keySignals: [
      "Learning-adjusted years of schooling gap: 10+ years (Finland) vs <4 years (parts of SSA)",
      "AI tutoring systems showing 2-sigma learning improvement in controlled trials",
      "Credential inflation: degree requirements rising for jobs that previously required none",
      "Teacher shortage projected to reach 69 million globally by 2030 (UNESCO)",
      "Skills half-life decreasing: estimated 5-year average before technical skills require significant update",
    ],
    implications: [
      "Credential-based gatekeeping in hiring is increasingly counterproductive as credentials decouple from competence",
      "Educational technology can narrow quality gaps but requires pedagogy-first rather than technology-first implementation",
      "Lifelong learning infrastructure becomes critical as skills obsolescence accelerates",
    ],
    tags: [
      "Education Reform",
      "Talent Systems",
      "Future of Work",
      "Learning Design",
    ],
    cardAnim: "grid",
  },
  {
    id: "ep-006",
    title: "Digital Infrastructure and the New Geopolitics of Data",
    eyebrow: "TECHNOLOGY SYSTEMS INTELLIGENCE",
    domain: "Technology Geopolitics",
    accentColor: "#06b6d4",
    readTime: "5 min read",
    heroSymbol: "◫",
    summary:
      "Undersea cables, cloud server locations, semiconductor supply chains, and platform data flows have become the contested terrain of 21st-century geopolitics. STEAMI maps the emerging landscape of digital infrastructure as strategic resource.",
    lead: "The internet was designed with a vision of borderless, decentralised information flow. The physical infrastructure that carries it — undersea cables, data centres, satellite constellations, semiconductor fabrication facilities — is anything but borderless. It is concentrated, contested, and increasingly weaponised as a tool of geopolitical competition. Understanding the geography of digital infrastructure is no longer optional for institutions planning across a 10-year horizon.",
    sections: [
      {
        heading: "The Chokepoint Architecture of Global Data",
        body: "Approximately 97% of global internet traffic crosses undersea cables — roughly 400 cables totalling over 1.3 million kilometres. These cables are not evenly distributed. Traffic between North America, Europe, and East Asia passes through a small number of critical transit points: the Strait of Malacca, the Red Sea, the Strait of Gibraltar, the English Channel. Cable cuts — whether by fishing trawlers, earthquakes, or deliberate sabotage — have demonstrably disrupted internet connectivity for entire regions. Recent incidents in the Red Sea have highlighted the fragility of this infrastructure and the limited options for rapid repair. Satellite constellations (Starlink, Project Kuiper) offer some redundancy but cannot yet replicate the bandwidth of fibre for bulk data transfer.",
      },
      {
        heading: "Semiconductor Sovereignty and the Chip Wars",
        body: "The semiconductor industry has produced the most extreme geographic concentration of any critical technology. Leading-edge chip fabrication — currently defined by process nodes below 7nm — is essentially monopolised by TSMC in Taiwan, with Samsung in South Korea as the only other producer. The United States, once dominant in semiconductor manufacturing, retains leadership only in chip design (Intel, Qualcomm, Nvidia, AMD) and equipment (ASML's EUV lithography machines, made exclusively in the Netherlands). This concentration creates profound strategic vulnerabilities. The US CHIPS Act, EU Chips Act, and Chinese semiconductor investment programs represent an unprecedented attempt to reshore or diversify semiconductor production — with timelines of 5-10 years at minimum and uncertain prospects of success.",
      },
      {
        heading: "Data Localisation and the Splinternet",
        body: "Alongside physical infrastructure, the governance of data flows is becoming a major geopolitical fault line. The concept of 'data localisation' — requirements that data about a country's citizens be stored and processed within its jurisdiction — has spread from a handful of authoritarian states to become mainstream policy in Europe (GDPR), India (Personal Data Protection Bill), and many other jurisdictions. The result is a progressive 'splinternet' — a fragmentation of the formerly unified global internet into partially separate national or regional architectures. For multinational institutions, this creates compliance complexity, limits on cross-border data analysis, and potential fragmentation of digital services. For smaller states, it raises questions about whether genuine digital sovereignty is achievable given concentration of cloud infrastructure in US and Chinese hands.",
      },
    ],
    keySignals: [
      "97% of global internet traffic traverses ~400 undersea cables — high chokepoint risk",
      "TSMC produces 90%+ of leading-edge chips — single point of failure for global AI hardware",
      "CHIPS Act: $52B US investment, targeting 20% domestic advanced chip production by 2030",
      "Data localisation laws now active in 100+ jurisdictions — fragmenting global data flows",
      "Starlink: 5,000+ satellites — first credible redundancy to undersea cable infrastructure",
    ],
    implications: [
      "Digital infrastructure geography is now a board-level risk issue for any institution with global operations",
      "Semiconductor supply chain diversification will take a decade — window of strategic vulnerability remains",
      "Splinternet trend favours platforms with strong local infrastructure over global aggregators",
    ],
    tags: [
      "Digital Infrastructure",
      "Semiconductors",
      "Data Geopolitics",
      "Undersea Cables",
    ],
    cardAnim: "flow",
  },
  {
    id: "ep-007",
    title:
      "The Inequality Equation: Why Wealth Concentration Threatens Systemic Stability",
    eyebrow: "EQUITY SYSTEMS INTELLIGENCE",
    domain: "Economic Equity",
    accentColor: "#f97316",
    readTime: "5 min read",
    heroSymbol: "◭",
    summary:
      "Global wealth inequality has reached historic extremes. STEAMI examines the economic, political, and social mechanisms through which concentrated wealth undermines the institutional foundations of stable, innovative societies.",
    lead: "The world's billionaires have more than doubled their collective wealth since 2020. Oxfam's 2024 inequality report documented that the richest 1% now own more wealth than the bottom 95% of humanity combined. These are not merely statistical observations — extreme wealth concentration has measurable effects on political institutions, economic dynamism, social cohesion, and inter-generational mobility that create systemic risks extending far beyond any simple moral objection to inequality.",
    sections: [
      {
        heading: "The Political Economy of Extreme Concentration",
        body: "A body of empirical political science research has documented the mechanisms through which extreme wealth concentration translates into political power that perpetuates and amplifies that concentration. Campaign finance systems in many democracies allow wealthy individuals and corporations to substantially shape electoral outcomes and legislative priorities. Regulatory capture — the phenomenon of regulated industries gaining effective control over their regulators — is well-documented in finance, energy, pharmaceuticals, and technology. The revolving door between industry and regulatory agencies creates structural incentives for regulatory accommodation rather than enforcement. These mechanisms compound over time: policies that reduce wealth concentration become harder to enact precisely as wealth concentration increases the political resources available to resist them.",
      },
      {
        heading: "Innovation and the Dynamism Paradox",
        body: "A common argument holds that wealth concentration is acceptable — even beneficial — because high returns attract capital into innovation. The empirical evidence on this relationship is substantially more nuanced. Economic historians studying Gilded Age America, pre-war Europe, and contemporary data find an inverted U-shaped relationship between inequality and innovation. Moderate inequality creates incentives for effort and risk-taking. Extreme inequality creates barriers: it concentrates capital in asset appreciation and rent-seeking rather than productive investment; it reduces demand through middle-class compression; it raises barriers to entry for would-be innovators without access to inherited capital; and it concentrates political power in ways that protect incumbents from disruptive competition. The STEAMI EQUIS intelligence stream specifically tracks these dynamics as they relate to science and technology system health.",
      },
      {
        heading: "Intergenerational Mobility and the Opportunity Architecture",
        body: "Perhaps the most consequential effect of extreme inequality is its impact on intergenerational mobility — the ability of individuals to achieve economic outcomes independent of the circumstances of their birth. Research across OECD countries consistently finds that higher inequality is associated with lower intergenerational mobility (the 'Great Gatsby Curve'). The mechanisms are multiple: unequal access to quality education, nutrition, healthcare, and social networks; reduced public investment in the goods that enable mobility as tax bases erode and political priorities shift; and direct transfer of economic advantage through inheritance and social capital. A society with low mobility wastes human capital systematically — the talents of people born into constrained circumstances are underdeveloped and underdeployed.",
      },
    ],
    keySignals: [
      "Top 1% own more wealth than bottom 95% combined (2024)",
      "Billionaire wealth doubled 2020-2024 while poverty reduction stalled",
      "Great Gatsby Curve: correlation r=0.6 between inequality and intergenerational immobility across OECD",
      "Tax-to-GDP ratios in wealthy nations trending down while corporate concentration increases",
      "Global wealth tax proposals gaining traction at G20 level — implementation uncertain",
    ],
    implications: [
      "Institutions operating in high-inequality contexts face political instability risk as legitimacy of economic arrangements is contested",
      "Talent development programs require explicit equity architecture to access full human capital depth of societies",
      "Philanthrocapitalism expanding into areas of traditional public policy — with accountability gaps",
    ],
    tags: [
      "Wealth Inequality",
      "Political Economy",
      "Social Mobility",
      "Systemic Risk",
    ],
    cardAnim: "ripple",
  },
  {
    id: "ep-008",
    title: "Water Security in the 21st Century: The Invisible Resource Crisis",
    eyebrow: "ENVIRONMENTAL SYSTEMS INTELLIGENCE",
    domain: "Environmental Security",
    accentColor: "#0ea5e9",
    readTime: "5 min read",
    heroSymbol: "◌",
    summary:
      "Two billion people lack access to safely managed drinking water. Groundwater aquifers are depleting globally. Climate change is altering precipitation patterns in ways that compound existing water stress. STEAMI maps the converging dimensions of the global water security crisis.",
    lead: "Water is the fundamental substrate of human civilisation. Every major historical civilisation emerged in and organised around reliable water sources. Every major historical civilisation that collapsed left evidence of water stress among its terminal conditions. The contemporary global water system — comprising groundwater aquifers, glaciers, rivers, reservoirs, and precipitation patterns — is under simultaneous pressure from population growth, agricultural intensification, industrial demand, and climate-driven hydrological change in ways that have no historical precedent.",
    sections: [
      {
        heading: "The Groundwater Depletion Crisis",
        body: "Approximately 2 billion people depend primarily on groundwater for drinking water. Agriculture — which accounts for 70% of global freshwater withdrawals — depends on groundwater for approximately 40% of its supply. Many of the world's most productive agricultural regions are sustained by 'fossil' aquifers — geological formations accumulated over thousands to millions of years that are being extracted at rates hundreds to thousands of times faster than natural recharge. The Ogallala Aquifer, which underlies America's Great Plains and sustains a significant fraction of US grain production, is declining at rates that threaten agricultural viability within 50 years in some areas. Similar dynamics apply to aquifers in India's Punjab (which produces 25% of Indian wheat), Pakistan, China's North Plain, and Iran. Unlike surface water depletion, which is visible, groundwater depletion is largely invisible until wells fail.",
      },
      {
        heading: "Climate Change and Hydrological Disruption",
        body: "Climate change is not simply making the world warmer — it is fundamentally altering the distribution of water in space and time. The atmospheric physics is straightforward: a warmer atmosphere holds more water vapour (roughly 7% more per degree of warming), leading to more intense precipitation events when rain or snow does fall, but also more intense and prolonged droughts in the intervening periods. The result is described by hydrologists as 'wet places getting wetter, dry places getting drier' with important caveats about regional variation and seasonal timing. Glaciers — which provide regulated water flow to rivers across Asia, South America, and Europe — are retreating globally. Himalayan glaciers feed rivers used by 800 million people; their accelerating retreat will initially increase river flow (from enhanced melt) before triggering severe reduction as glacier mass decreases.",
      },
      {
        heading: "Water, Conflict, and Geopolitics",
        body: "The connection between water stress and conflict is empirically well-established at the local level and increasingly relevant at the interstate level. Of the 276 major international river basins, 158 lack any cooperative governance framework. The Nile basin — shared among 11 countries — is under acute tension as Ethiopia's Grand Renaissance Dam alters downstream flows to Egypt and Sudan. The Mekong River, shared among China, Myanmar, Laos, Thailand, Cambodia, and Vietnam, is subject to Chinese upstream dam operations that significantly affect downstream water availability and fisheries. The Indus Waters Treaty between India and Pakistan — a landmark 1960 agreement — is under increasing strain as climate change alters flows. Water stress does not deterministically cause conflict, but it consistently appears as a contributing factor in environments where other conflict drivers are present.",
      },
    ],
    keySignals: [
      "2B people lack safely managed drinking water (WHO/UNICEF 2023)",
      "Ogallala Aquifer: some zones have <25 years of irrigation-viable depth remaining",
      "700M+ people live in water-scarce conditions; projected 5.7B by 2050",
      "Himalayan glacier melt accelerating — peak water flow expected 2050s for major rivers",
      "Water-related conflicts documented in 45+ countries 2010-2023",
    ],
    implications: [
      "Agricultural systems dependent on non-renewable groundwater face existential transition requirements",
      "Water infrastructure investment requirements in developing world far exceed current financing flows",
      "Climate adaptation planning must integrate water security as a primary rather than secondary variable",
    ],
    tags: [
      "Water Security",
      "Groundwater",
      "Hydrological Risk",
      "Resource Geopolitics",
    ],
    cardAnim: "fractal",
  },
  {
    id: "ep-009",
    title:
      "The Disinformation Ecosystem: Intelligence, Narrative, and the Epistemological Crisis",
    eyebrow: "INFORMATION ENVIRONMENT INTELLIGENCE",
    domain: "Information Systems",
    accentColor: "#e879f9",
    readTime: "5 min read",
    heroSymbol: "◊",
    summary:
      "The global information environment has shifted from a problem of information scarcity to information superabundance — with synthetic media, algorithmic amplification, and epistemic tribalism creating novel challenges to the shared factual foundations of democratic governance.",
    lead: "For most of human history, the primary challenge in knowledge systems was scarcity: getting enough accurate information to make good decisions. The information revolution of the past three decades has eliminated scarcity but created a new and perhaps more insidious problem: an abundance of information of radically uneven quality, amplified by systems optimised for engagement rather than accuracy, in a social environment where epistemic tribalism — the tendency to evaluate truth claims based on their source rather than their content — is intensifying.",
    sections: [
      {
        heading: "The Algorithmic Amplification Engine",
        body: "Social media platforms optimising for engagement have, through the ordinary operation of their recommendation systems, created infrastructure for the amplification of emotionally engaging content regardless of its accuracy. The underlying mechanism is not conspiratorial — it emerges from the straightforward observation that content provoking strong emotional responses (outrage, fear, excitement) generates more clicks, shares, and comments than calm factual reporting. Over time, recommendation systems trained on engagement signals learn to preferentially surface emotionally activating content. Studies consistently find that false and misleading content spreads faster and further than accurate corrections on major social platforms. This is not primarily a problem of malicious actors — though they exist and exploit the dynamics — but of systemic incentive misalignment between platform economics and information quality.",
      },
      {
        heading: "Synthetic Media and the Verification Crisis",
        body: "Generative AI has added a qualitatively new dimension to the disinformation challenge: the ability to create highly realistic synthetic media (audio, video, images, text) at trivial cost and scale. Deepfake technology capable of placing real individuals into fabricated contexts has existed since 2018, but the quality and accessibility of these tools has improved dramatically. The implications extend beyond individual manipulation events: the mere existence of convincing deepfake technology creates 'liar's dividend' — the ability of real evidence to be discredited by claiming it is synthetic. In high-stakes contexts (elections, legal proceedings, military incidents) this creates profound verification challenges. Current AI-detection tools are engaged in an accelerating arms race with AI-generation tools, with no stable equilibrium in sight.",
      },
      {
        heading: "Institutional Responses and Their Limitations",
        body: "Responses to the disinformation crisis have multiplied: platform content moderation, fact-checking organisations, media literacy education, legal frameworks targeting malicious falsehoods. Each has documented limitations. Content moderation at platform scale is necessarily imperfect and subject to both over- and under-enforcement. Fact-checking reaches primarily audiences already predisposed to trust corrective information. Media literacy education has shown modest effects in controlled settings but limited scalability. Legal approaches face fundamental tensions with free expression principles. STEAMI's information environment intelligence stream focuses on understanding these dynamics as a prerequisite for institutional decision-making in contexts where information environment quality is a material variable.",
      },
    ],
    keySignals: [
      "False news spreads 6x faster than accurate information on Twitter/X (MIT Media Lab)",
      "Deepfake detection gap: current tools 65-75% accurate — insufficient for high-stakes verification",
      "Trust in media at historic lows across OECD countries (Reuters Institute 2023)",
      "Epistemic polarisation measurable across 24 countries — widening 2015-2023",
      "State-sponsored information operations documented from 81 countries",
    ],
    implications: [
      "Institutional communications require explicit information environment strategy — not just accuracy but verifiability",
      "Decision processes in high-stakes domains need structured epistemic protocols resistant to narrative manipulation",
      "Shared factual foundations for democratic deliberation require active maintenance — they do not persist automatically",
    ],
    tags: [
      "Disinformation",
      "AI Media",
      "Epistemic Systems",
      "Information Governance",
    ],
    cardAnim: "heatmap",
  },
  {
    id: "ep-010",
    title:
      "The Energy Transition: Scale, Speed, and the Structural Challenges of Decarbonisation",
    eyebrow: "CLIMATE & ENERGY SYSTEMS",
    domain: "Energy Systems",
    accentColor: "#d4a017",
    readTime: "5 min read",
    heroSymbol: "⬡",
    summary:
      "Solar and wind costs have fallen 90%+ in a decade. Yet the energy transition faces structural challenges — in grid infrastructure, material supply chains, and political economy — that threaten to make it slower and more difficult than cost curves alone suggest.",
    lead: "The energy transition is happening faster than most analysts predicted and slower than most scenarios require. Solar photovoltaic costs have fallen approximately 90% in the past decade, with wind following a similar trajectory. Utility-scale solar is now the cheapest source of new electricity generation in most of the world. Electric vehicle adoption is following an S-curve characteristic of major technological transitions. And yet global CO2 emissions from energy have not yet peaked, and the pace of transition remains substantially below what climate science identifies as necessary to maintain any reasonable probability of staying within 1.5°C of warming.",
    sections: [
      {
        heading: "The Grid Transformation Challenge",
        body: "The electricity grids of most countries were designed around controllable, dispatchable generation — power plants that produce electricity on demand. Wind and solar are variable: they produce when the wind blows and the sun shines, not necessarily when demand peaks. Managing a grid with high shares of variable renewable energy requires fundamental transformation: massive investment in storage (batteries, pumped hydro, hydrogen), extensive transmission infrastructure to balance supply and demand across large geographic areas, and sophisticated demand-response systems that shift flexible consumption to periods of high renewable output. These investments are technically feasible and economically justified, but they require long planning horizons, coordinated regulatory action, and upfront capital that markets often fail to mobilise at the necessary pace and scale.",
      },
      {
        heading: "Critical Mineral Supply Chains",
        body: "The clean energy transition requires a massive scaling of specific materials: lithium, cobalt, nickel, and manganese for batteries; copper for electrification; silicon and silver for solar; rare earth elements for wind turbine magnets and EV motors. The International Energy Agency projects that demand for these materials will need to increase 4- to 6-fold by 2040 under net-zero scenarios. Current mining investment and production capacity is insufficient by a wide margin. The geographic concentration of critical mineral reserves — lithium in the 'lithium triangle' of Chile, Argentina, and Bolivia; cobalt in the Democratic Republic of Congo; rare earths in China — creates supply chain vulnerabilities and political dependencies that mirror or exceed those of the current fossil fuel system. Environmental and social impacts of mining at the required scale are substantial and inadequately addressed in most net-zero scenarios.",
      },
      {
        heading: "Political Economy and the Incumbency Problem",
        body: "The fossil fuel industry represents accumulated capital investment of tens of trillions of dollars, employment of hundreds of millions of people, and political influence proportional to its economic scale. Its interests are fundamentally threatened by accelerated decarbonisation. Analysis of lobbying expenditure, political contributions, and regulatory engagement consistently shows fossil fuel interests deploying resources to slow transition-relevant regulation, expand fossil fuel infrastructure, and maintain public subsidies (which the IMF estimates at $7 trillion annually when health and climate externalities are included). The transition also creates genuine economic and social disruption in fossil fuel-dependent communities and countries that requires managed transition support to be politically sustainable. STEMONEF's TERRA and EQUIS programs both engage with these dimensions — the environmental science and the equity and economic architecture needed to make transition politically viable.",
      },
    ],
    keySignals: [
      "Solar LCOE down 90% 2010-2023 — now cheapest electricity source in history",
      "IEA: critical mineral demand must increase 4-6x for net-zero — mining pipeline insufficient",
      "Global fossil fuel subsidies: $7T annually including externalities (IMF 2023)",
      "Grid-scale battery storage deployment growing 75% YoY — from low base",
      "Energy transition job creation exceeds fossil fuel job losses globally — but geographic mismatch acute",
    ],
    implications: [
      "Grid transformation investment is the binding constraint on renewable penetration — not generation cost",
      "Critical mineral supply chains require investment and governance that parallels semiconductor strategy",
      "Just transition frameworks are political prerequisites for socially sustainable decarbonisation",
    ],
    tags: [
      "Energy Transition",
      "Climate Policy",
      "Renewable Energy",
      "Critical Minerals",
    ],
    cardAnim: "scan",
  },
];

// ─── Card Animation Components ───────────────────────────────────────────────
function CardAnimPulse({ color }: { color: string }) {
  return (
    <div
      style={{ width: 32, height: 32, position: "relative" }}
      aria-hidden="true"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        aria-hidden="true"
        focusable="false"
      >
        <circle
          cx="16"
          cy="16"
          r="4"
          fill={color}
          style={{ animation: "ep-pulse-core 2s ease-in-out infinite" }}
        />
        <circle
          cx="16"
          cy="16"
          r="8"
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.5"
          style={{ animation: "ep-pulse-ring1 2s ease-in-out infinite" }}
        />
        <circle
          cx="16"
          cy="16"
          r="13"
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          opacity="0.25"
          style={{ animation: "ep-pulse-ring2 2s ease-in-out infinite 0.4s" }}
        />
      </svg>
    </div>
  );
}
function CardAnimScan({ color }: { color: string }) {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        position: "relative",
        overflow: "hidden",
        borderRadius: 2,
      }}
      aria-hidden="true"
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: `1px solid ${color}30`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          animation: "ep-scan-line 2s linear infinite",
        }}
      />
    </div>
  );
}
function CardAnimCascade({ color }: { color: string }) {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        display: "flex",
        gap: 3,
        alignItems: "flex-end",
      }}
      aria-hidden="true"
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            width: 4,
            background: `${color}60`,
            borderRadius: 1,
            height: 8 + i * 5,
            animation: `ep-cascade-dot 1.4s ease-in-out infinite ${i * 0.18}s`,
          }}
        />
      ))}
    </div>
  );
}
function CardAnimWaveform({ color }: { color: string }) {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        display: "flex",
        gap: 2,
        alignItems: "center",
      }}
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            width: 3,
            background: color,
            borderRadius: 1,
            animation: `ep-wave-bar 1.2s ease-in-out infinite ${i * 0.12}s`,
          }}
        />
      ))}
    </div>
  );
}
function CardAnimOrbit({ color }: { color: string }) {
  return (
    <div
      style={{ width: 32, height: 32, position: "relative" }}
      aria-hidden="true"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        aria-hidden="true"
        focusable="false"
      >
        <circle
          cx="16"
          cy="16"
          r="12"
          fill="none"
          stroke={`${color}30`}
          strokeWidth="1"
          strokeDasharray="4 3"
        />
        <circle
          cx="16"
          cy="4"
          r="3"
          fill={color}
          style={{
            transformOrigin: "16px 16px",
            animation: "ep-orbit-dot 3s linear infinite",
          }}
        />
        <circle cx="16" cy="16" r="2.5" fill={`${color}60`} />
      </svg>
    </div>
  );
}
function CardAnimGrid({ color }: { color: string }) {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 2,
      }}
      aria-hidden="true"
    >
      {[
        "g0",
        "g1",
        "g2",
        "g3",
        "g4",
        "g5",
        "g6",
        "g7",
        "g8",
        "g9",
        "ga",
        "gb",
        "gc",
        "gd",
        "ge",
        "gf",
      ].map((k, i) => (
        <div
          key={k}
          style={{
            background: `${color}40`,
            borderRadius: 1,
            animation: `ep-grid-blink 2.4s ease-in-out infinite ${(i * 0.13) % 2.4}s`,
          }}
        />
      ))}
    </div>
  );
}
function CardAnimFlow({ color }: { color: string }) {
  return (
    <div style={{ width: 32, height: 32 }} aria-hidden="true">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M2 8 Q10 4 16 16 Q22 28 30 24"
          fill="none"
          stroke={`${color}50`}
          strokeWidth="1.5"
          strokeDasharray="5 3"
          style={{ animation: "ep-flow-dash 2s linear infinite" }}
        />
        <path
          d="M2 16 Q10 12 16 20 Q22 28 30 16"
          fill="none"
          stroke={`${color}30`}
          strokeWidth="1"
          strokeDasharray="3 4"
          style={{ animation: "ep-flow-dash 2.5s linear infinite 0.5s" }}
        />
      </svg>
    </div>
  );
}
function CardAnimRipple({ color }: { color: string }) {
  return (
    <div
      style={{ width: 32, height: 32, position: "relative" }}
      aria-hidden="true"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        aria-hidden="true"
        focusable="false"
      >
        {[5, 10, 15].map((r, i) => (
          <circle
            key={r}
            cx="16"
            cy="16"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="1"
            style={{
              animation: `ep-ripple 2.5s ease-out infinite ${i * 0.7}s`,
              transformOrigin: "16px 16px",
            }}
          />
        ))}
      </svg>
    </div>
  );
}
function CardAnimFractal({ color }: { color: string }) {
  return (
    <div style={{ width: 32, height: 32 }} aria-hidden="true">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        aria-hidden="true"
        focusable="false"
        style={{ animation: "ep-fractal-spin 8s linear infinite" }}
      >
        <polygon
          points="16,3 29,27 3,27"
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.8"
        />
        <polygon
          points="16,9 24,24 8,24"
          fill="none"
          stroke={color}
          strokeWidth="0.7"
          opacity="0.5"
          style={{ animation: "ep-fractal-spin 4s linear infinite reverse" }}
        />
      </svg>
    </div>
  );
}
function CardAnimHeatmap({ color }: { color: string }) {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 2,
      }}
      aria-hidden="true"
    >
      {(["h0", "h1", "h2", "h3", "h4", "h5", "h6", "h7", "h8"] as const).map(
        (k, i) => (
          <div
            key={k}
            style={{
              background: `${color}${Math.floor(20 + (i % 3) * 25)
                .toString(16)
                .padStart(2, "0")}`,
              borderRadius: 1,
              animation: `ep-heatmap-fade 3s ease-in-out infinite ${(i * 0.3) % 3}s`,
            }}
          />
        ),
      )}
    </div>
  );
}

function EditorialCardAnim({
  type,
  color,
}: { type: EditorialPiece["cardAnim"]; color: string }) {
  switch (type) {
    case "pulse":
      return <CardAnimPulse color={color} />;
    case "scan":
      return <CardAnimScan color={color} />;
    case "cascade":
      return <CardAnimCascade color={color} />;
    case "waveform":
      return <CardAnimWaveform color={color} />;
    case "orbit":
      return <CardAnimOrbit color={color} />;
    case "grid":
      return <CardAnimGrid color={color} />;
    case "flow":
      return <CardAnimFlow color={color} />;
    case "ripple":
      return <CardAnimRipple color={color} />;
    case "fractal":
      return <CardAnimFractal color={color} />;
    case "heatmap":
      return <CardAnimHeatmap color={color} />;
    default:
      return null;
  }
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SteamiPage({ onBack }: SteamiPageProps) {
  const { data: feeds, isLoading: feedsLoading } = useGetPublicFeeds();
  const [libraryFilter, setLibraryFilter] = useState("All");
  const [selectedBrief, setSelectedBrief] = useState<FeedEntry | null>(null);
  const [viewMode, setViewMode] = useState<"signals" | "editorial">(
    "editorial",
  );
  const [selectedEditorial, setSelectedEditorial] =
    useState<EditorialPiece | null>(null);
  const [editorialReadProgress, setEditorialReadProgress] = useState(0);
  const [expandedEditorialSection, setExpandedEditorialSection] = useState<
    number | null
  >(0);
  const libraryRef = useRef<HTMLDivElement>(null);

  // Compute unique domains
  const allDomains = useMemo(() => {
    if (!feeds) return [];
    return [...new Set(feeds.map((f) => f.domain))];
  }, [feeds]);

  const filteredFeeds = useMemo(() => {
    if (!feeds) return [];
    if (libraryFilter === "All") return feeds;
    return feeds.filter((f) => f.domain === libraryFilter);
  }, [feeds, libraryFilter]);

  const handleFilterLibrary = useCallback(
    (domain: string) => {
      // Map stream labels to feed domains
      const mapping: Record<string, string> = {
        "AI Governance": "AI Governance",
        "Climate Systems": "Climate Systems",
        "Emerging Technologies": "Emerging Technologies",
        "Global Health Intelligence": "Global Health Intelligence",
        "Future Infrastructure": "Future Infrastructure",
      };
      const targetDomain = mapping[domain] ?? domain;
      // Check if domain exists in feeds, otherwise just filter "All"
      const exists = allDomains.includes(targetDomain);
      setLibraryFilter(exists ? targetDomain : "All");
      setTimeout(() => {
        libraryRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    },
    [allDomains],
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    const els = document.querySelectorAll(".steami-reveal");
    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: "var(--neural-bg)", minHeight: "100vh" }}>
      {/* Sticky nav */}
      <div
        className="sticky top-[65px] z-40 px-6 py-3 flex items-center justify-between"
        style={{
          background: "rgba(4,5,14,0.92)",
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <button
          type="button"
          data-ocid="steami.back.button"
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
          STEAMI™ Intelligence Platform
        </div>
      </div>

      {/* ── SECTION 1: HERO ── */}
      <section
        className="relative min-h-screen flex items-center px-6 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, rgba(8,14,40,0.97) 0%, rgba(4,5,14,1) 70%)",
        }}
      >
        <HeroCanvas />
        <div
          className="neural-grid-bg absolute inset-0 opacity-20"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full pt-20 pb-24">
          <div
            className="font-mono-geist text-xs tracking-[0.45em] uppercase mb-8 animate-fade-in-up"
            style={{ color: "rgba(74,126,247,0.7)" }}
          >
            ◆ INTELLIGENCE &amp; KNOWLEDGE PLATFORM
          </div>

          <h1
            className="font-display font-light text-gradient-hero mb-3 animate-fade-in-up"
            style={{
              fontSize: "clamp(4rem, 13vw, 8rem)",
              letterSpacing: "0.1em",
              lineHeight: 0.9,
              animationDelay: "0.1s",
            }}
          >
            STEAMI™
          </h1>

          <p
            className="font-serif-instrument italic text-2xl md:text-3xl mb-6 animate-fade-in-up"
            style={{
              color: "rgba(212,160,23,0.85)",
              letterSpacing: "0.03em",
              animationDelay: "0.18s",
              maxWidth: "520px",
            }}
          >
            Intelligence Finds Its Voice.
          </p>

          <p
            className="text-base mb-10 animate-fade-in-up"
            style={{
              color: "rgba(255,255,255,0.45)",
              fontFamily: "Sora, sans-serif",
              maxWidth: "480px",
              lineHeight: 1.7,
              animationDelay: "0.26s",
            }}
          >
            The intelligence and knowledge synthesis platform of STEMONEF
            Enterprises.
          </p>

          {/* CTA buttons */}
          <div
            className="flex flex-wrap gap-4 mb-10 animate-fade-in-up"
            style={{ animationDelay: "0.34s" }}
          >
            <button
              type="button"
              data-ocid="steami.hero.primary_button"
              onClick={() => {
                libraryRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-7 py-3 font-mono-geist text-xs tracking-[0.2em] uppercase transition-all duration-300 rounded-sm"
              style={{
                background: "rgba(74,126,247,0.1)",
                border: "1px solid rgba(74,126,247,0.5)",
                color: "rgba(138,180,255,0.9)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "rgba(74,126,247,0.18)";
                el.style.boxShadow = "0 0 20px rgba(74,126,247,0.25)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "rgba(74,126,247,0.1)";
                el.style.boxShadow = "none";
              }}
            >
              Explore Intelligence Streams
            </button>
            <button
              type="button"
              data-ocid="steami.hero.secondary_button"
              onClick={() => {
                document
                  .querySelector("#steami-architecture")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-7 py-3 font-mono-geist text-xs tracking-[0.2em] uppercase transition-all duration-300 rounded-sm"
              style={{
                background: "rgba(212,160,23,0.08)",
                border: "1px solid rgba(212,160,23,0.4)",
                color: "rgba(212,160,23,0.85)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "rgba(212,160,23,0.15)";
                el.style.boxShadow = "0 0 20px rgba(212,160,23,0.2)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "rgba(212,160,23,0.08)";
                el.style.boxShadow = "none";
              }}
            >
              View Knowledge Architecture
            </button>
          </div>

          {/* Positioning statement */}
          <div
            className="glass-strong p-6 max-w-xl rounded-sm animate-fade-in-up"
            style={{
              borderLeft: "3px solid rgba(74,126,247,0.6)",
              animationDelay: "0.42s",
            }}
          >
            <div
              className="font-mono-geist text-[9px] tracking-[0.35em] uppercase mb-2"
              style={{ color: "rgba(74,126,247,0.6)" }}
            >
              PLATFORM DEFINITION
            </div>
            <p
              className="font-mono-geist text-sm leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.75)",
                letterSpacing: "0.04em",
              }}
            >
              STEAMI is <span style={{ color: "#d4a017" }}>not media</span>. It
              is a{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #4a7ef7, #8ab4ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: 600,
                }}
              >
                decision-grade intelligence system
              </span>
              .
            </p>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent, var(--neural-bg))",
          }}
          aria-hidden="true"
        />
      </section>

      {/* ── SECTION 2: INTELLIGENCE ARCHITECTURE — LANDMARK ── */}
      <section id="steami-architecture" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 steami-reveal reveal">
            <div
              className="font-mono-geist text-[9px] tracking-[0.5em] uppercase mb-5"
              style={{ color: "rgba(74,126,247,0.65)" }}
            >
              ◆ SYSTEM DESIGN
            </div>
            <h2
              className="font-display font-light text-gradient-hero mb-5"
              style={{
                fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                letterSpacing: "0.07em",
                lineHeight: 1.0,
              }}
            >
              Intelligence Architecture
            </h2>
            {/* Landmark ruled accent */}
            <div className="flex items-center gap-4 mb-5" aria-hidden="true">
              <div
                style={{
                  width: "3rem",
                  height: "2px",
                  background:
                    "linear-gradient(90deg, rgba(74,126,247,0.7), rgba(74,126,247,0.2))",
                }}
              />
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "rgba(255,255,255,0.06)",
                }}
              />
            </div>
            <p
              className="text-sm max-w-2xl"
              style={{
                color: "rgba(255,255,255,0.4)",
                fontFamily: "Sora, sans-serif",
                lineHeight: 1.7,
              }}
            >
              STEAMI's intelligence system is structured across five distinct
              stages. Hover each stage to explore its activities.
            </p>
          </div>
          <div
            className="steami-reveal reveal"
            style={{ transitionDelay: "0.1s" }}
          >
            <ArchitecturePipeline />
          </div>
        </div>
      </section>

      {/* ── SECTION 3: SIGNAL INGESTION — DENSE ── */}
      <section
        className="py-20 px-6"
        style={{ background: "rgba(8,12,32,0.4)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 steami-reveal reveal">
            <div className="flex items-center gap-3 mb-2">
              <div
                style={{
                  width: "18px",
                  height: "1px",
                  background: "rgba(74,126,247,0.5)",
                }}
                aria-hidden="true"
              />
              <div
                className="font-mono-geist text-[9px] tracking-[0.4em] uppercase"
                style={{ color: "rgba(74,126,247,0.55)" }}
              >
                INPUT SOURCES
              </div>
            </div>
            <h2
              className="font-display font-light mb-2"
              style={{
                fontSize: "clamp(1.9rem, 4vw, 3rem)",
                letterSpacing: "0.07em",
                color: "rgba(255,255,255,0.88)",
              }}
            >
              Signal Ingestion Layer
            </h2>
            <p
              className="text-xs max-w-xl"
              style={{
                color: "rgba(255,255,255,0.38)",
                fontFamily: "Sora, sans-serif",
                lineHeight: 1.65,
              }}
            >
              Intelligence signals flow into the synthesis engine from five
              primary source categories. Hover each node to explore the input
              stream.
            </p>
          </div>
          <div
            className="steami-reveal reveal"
            style={{ transitionDelay: "0.1s" }}
          >
            <SignalIngestionSVG />
          </div>
        </div>
      </section>

      {/* ── SECTION 4: KNOWLEDGE SYNTHESIS ENGINE ── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 steami-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.45em] uppercase mb-3"
              style={{ color: "rgba(74,126,247,0.65)" }}
            >
              ◆ SYNTHESIS PIPELINE
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light text-gradient-hero mb-3"
              style={{ letterSpacing: "0.08em" }}
            >
              Knowledge Synthesis Engine
            </h2>
            <p
              className="text-sm max-w-2xl"
              style={{
                color: "rgba(255,255,255,0.4)",
                fontFamily: "Sora, sans-serif",
                lineHeight: 1.7,
              }}
            >
              The synthesis pipeline converts raw intelligence signals into
              decision-grade knowledge products through five systematic stages.
            </p>
          </div>
          <div
            className="steami-reveal reveal"
            style={{ transitionDelay: "0.12s" }}
          >
            <SynthesisPipeline />
          </div>
        </div>
      </section>

      {/* ── SECTION 5: INSIGHT STREAMS ── */}
      <section
        className="py-24 px-6"
        style={{ background: "rgba(8,12,32,0.4)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 steami-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.45em] uppercase mb-3"
              style={{ color: "rgba(74,126,247,0.7)" }}
            >
              ◆ ACTIVE INTELLIGENCE DOMAINS
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light mb-3"
              style={{
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Insight Streams
            </h2>
            <p
              className="text-sm max-w-2xl"
              style={{
                color: "rgba(255,255,255,0.4)",
                fontFamily: "Sora, sans-serif",
                lineHeight: 1.7,
              }}
            >
              STEAMI maintains active intelligence domains across five strategic
              areas. Each stream continuously ingests, processes and distributes
              intelligence signals.
            </p>
          </div>
          <div
            className="steami-reveal reveal"
            style={{ transitionDelay: "0.1s" }}
          >
            <InsightStreams onFilterLibrary={handleFilterLibrary} />
          </div>
        </div>
      </section>

      {/* ── SECTION 6: STEAMI INTELLIGENCE (R&D) ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 steami-reveal reveal">
            <div className="flex items-center gap-4 mb-3">
              <div
                className="font-mono-geist text-[10px] tracking-[0.45em] uppercase"
                style={{ color: "rgba(74,126,247,0.65)" }}
              >
                ◆ INTELLIGENCE LAYER
              </div>
              <span
                className="px-3 py-1 rounded-full font-mono-geist text-[9px] tracking-[0.15em] uppercase"
                style={{
                  background: "rgba(212,160,23,0.1)",
                  border: "1px solid rgba(212,160,23,0.35)",
                  color: "#d4a017",
                }}
              >
                Decision-Grade Intelligence
              </span>
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light text-gradient-hero mb-3"
              style={{ letterSpacing: "0.08em" }}
            >
              STEAMI Intelligence
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Focus Areas */}
            <div
              className="glass-strong p-8 rounded-sm steami-reveal reveal"
              style={{ borderTop: "2px solid rgba(74,126,247,0.4)" }}
            >
              <div
                className="font-mono-geist text-[9px] tracking-[0.35em] uppercase mb-6"
                style={{ color: "rgba(74,126,247,0.7)" }}
              >
                FOCUS AREAS
              </div>
              <div className="space-y-4">
                {FOCUS_AREAS.map((area) => (
                  <div
                    key={area.label}
                    className="flex items-start gap-4 p-4 rounded-sm transition-all duration-250"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.background = `${area.color}0a`;
                      el.style.borderColor = `${area.color}30`;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.background = "rgba(255,255,255,0.02)";
                      el.style.borderColor = "rgba(255,255,255,0.05)";
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 animate-node-pulse"
                      style={{ background: area.color }}
                    />
                    <div>
                      <div
                        className="font-mono-geist text-[9px] tracking-[0.15em] uppercase mb-1"
                        style={{ color: area.color }}
                      >
                        {area.label}
                      </div>
                      <p
                        className="text-[10px] leading-relaxed"
                        style={{
                          color: "rgba(255,255,255,0.4)",
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

            {/* Right: Output Products */}
            <div
              className="glass p-8 rounded-sm steami-reveal reveal flex flex-col gap-6"
              style={{
                transitionDelay: "0.1s",
                borderTop: "2px solid rgba(212,160,23,0.3)",
              }}
            >
              <div
                className="font-mono-geist text-[9px] tracking-[0.35em] uppercase mb-2"
                style={{ color: "rgba(212,160,23,0.7)" }}
              >
                OUTPUT PRODUCTS
              </div>

              {/* Intelligence Briefs */}
              <div
                className="p-6 rounded-sm"
                style={{
                  background: "rgba(212,160,23,0.06)",
                  border: "1px solid rgba(212,160,23,0.3)",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-2 h-2 rounded-full animate-node-pulse"
                    style={{ background: "#d4a017" }}
                  />
                  <div
                    className="font-mono-geist text-[9px] tracking-[0.2em] uppercase"
                    style={{ color: "rgba(212,160,23,0.5)" }}
                  >
                    RESTRICTED ACCESS
                  </div>
                </div>
                <div
                  className="font-display text-xl font-light mb-2"
                  style={{ color: "#d4a017", letterSpacing: "0.08em" }}
                >
                  Intelligence Briefs
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontFamily: "Sora, sans-serif",
                  }}
                >
                  Confidential, decision-grade intelligence products produced
                  for institutional partners, government clients and STEMONEF
                  leadership.
                </p>
              </div>

              {/* Validated Frameworks */}
              <div
                className="p-6 rounded-sm"
                style={{
                  background: "rgba(34,211,176,0.06)",
                  border: "1px solid rgba(34,211,176,0.3)",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-2 h-2 rounded-full animate-node-pulse"
                    style={{ background: "#22d3b0" }}
                  />
                  <div
                    className="font-mono-geist text-[9px] tracking-[0.2em] uppercase"
                    style={{ color: "rgba(34,211,176,0.5)" }}
                  >
                    PUBLIC ACCESS
                  </div>
                </div>
                <div
                  className="font-display text-xl font-light mb-2"
                  style={{ color: "#22d3b0", letterSpacing: "0.08em" }}
                >
                  Validated Frameworks
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontFamily: "Sora, sans-serif",
                  }}
                >
                  Publicly accessible analytical frameworks and methodologies
                  developed through the STEAMI synthesis process.
                </p>
              </div>

              <p
                className="text-xs leading-relaxed mt-2"
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                STEAMI Intelligence is the analytical core of the platform —
                transforming raw data into structured, actionable knowledge
                products that enable evidence-based decisions at institutional
                scale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: STEAMI NETWORK ── */}
      <section
        className="py-24 px-6"
        style={{ background: "rgba(8,12,32,0.4)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 steami-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.45em] uppercase mb-3"
              style={{ color: "rgba(74,126,247,0.7)" }}
            >
              ◆ DISTRIBUTION LAYER
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light mb-3"
              style={{
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              STEAMI Network
            </h2>
            <p
              className="text-sm max-w-2xl"
              style={{
                color: "rgba(255,255,255,0.4)",
                fontFamily: "Sora, sans-serif",
                lineHeight: 1.7,
              }}
            >
              STEAMI Network is the distribution layer that translates
              intelligence products into accessible knowledge across six
              channels.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DISTRIBUTION_CHANNELS.map((ch, i) => (
              <div
                key={ch.label}
                className="relative overflow-hidden glass p-6 rounded-sm steami-reveal reveal cursor-default"
                style={
                  {
                    transitionDelay: `${i * 0.07}s`,
                    "--scan-delay": `${i * 1.8}s`,
                  } as React.CSSProperties
                }
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = `${ch.color}0a`;
                  el.style.borderColor = `${ch.color}45`;
                  el.style.boxShadow = `0 0 20px ${ch.color}15`;
                  el.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "";
                  el.style.borderColor = "";
                  el.style.boxShadow = "none";
                  el.style.transform = "none";
                }}
              >
                {/* Scan line */}
                <div
                  className="animate-card-scan absolute inset-x-0 top-0 h-[1px] pointer-events-none"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${ch.color}60, transparent)`,
                  }}
                  aria-hidden="true"
                />

                <div className="flex items-start justify-between mb-4">
                  <div
                    className="text-3xl animate-glyph-pulse"
                    style={{ color: ch.color }}
                    aria-hidden="true"
                  >
                    {ch.glyph}
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-sm font-mono-geist text-[8px] tracking-[0.15em] uppercase"
                    style={{
                      background: `${ch.color}10`,
                      color: ch.color,
                      border: `1px solid ${ch.color}30`,
                    }}
                  >
                    {ch.type}
                  </span>
                </div>

                <h3
                  className="font-display text-lg font-light mb-3"
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {ch.label}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontFamily: "Sora, sans-serif",
                  }}
                >
                  {ch.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 8: FEEDBACK LOOP — LANDMARK ── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 steami-reveal reveal">
            <div
              className="font-mono-geist text-[9px] tracking-[0.5em] uppercase mb-5"
              style={{ color: "rgba(74,126,247,0.65)" }}
            >
              ◆ FEEDBACK LOOP
            </div>
            <h2
              className="font-display font-light text-gradient-hero mb-5"
              style={{
                fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                letterSpacing: "0.07em",
                lineHeight: 1.0,
              }}
            >
              Intelligence Cycle
            </h2>
            {/* Landmark ruled accent */}
            <div className="flex items-center gap-4" aria-hidden="true">
              <div
                style={{
                  width: "3rem",
                  height: "2px",
                  background:
                    "linear-gradient(90deg, rgba(74,126,247,0.7), rgba(74,126,247,0.2))",
                }}
              />
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "rgba(255,255,255,0.06)",
                }}
              />
            </div>
          </div>
          <div
            className="steami-reveal reveal"
            style={{ transitionDelay: "0.1s" }}
          >
            <FeedbackLoopSVG />
          </div>
          <p
            className="text-center text-sm mt-10"
            style={{
              color: "rgba(255,255,255,0.3)",
              fontFamily: "Sora, sans-serif",
              letterSpacing: "0.04em",
              maxWidth: "480px",
              margin: "2.5rem auto 0",
            }}
          >
            This loop continuously refines the quality and relevance of every
            intelligence product published by STEAMI.
          </p>
        </div>
      </section>

      {/* ── SECTION 9: INTELLIGENCE LIBRARY ── */}
      <section
        className="py-24 px-6"
        style={{ background: "rgba(8,12,32,0.4)" }}
      >
        <div className="max-w-7xl mx-auto" ref={libraryRef}>
          {/* Section header */}
          <div className="mb-10 steami-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.45em] uppercase mb-1"
              style={{ color: "rgba(74,126,247,0.7)" }}
            >
              ◆ KNOWLEDGE REPOSITORY
            </div>
            <div
              className="font-mono-geist text-[9px] tracking-[0.3em] uppercase mb-4"
              style={{ color: "rgba(212,160,23,0.55)" }}
            >
              EDITORIAL INTELLIGENCE · STEAMI DEEP-DIVES
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light mb-3"
              style={{
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Intelligence Library
            </h2>
            <p
              className="text-sm max-w-2xl"
              style={{
                color: "rgba(255,255,255,0.4)",
                fontFamily: "Sora, sans-serif",
                lineHeight: 1.7,
              }}
            >
              Published intelligence briefs and deep-dive editorial pieces from
              the STEAMI platform — covering AI governance, climate systems,
              global health, emerging technologies, and the systemic forces
              shaping our world.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div
            className="flex gap-0 mb-8 steami-reveal reveal"
            style={{
              transitionDelay: "0.05s",
              display: "inline-flex",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              data-ocid="steami.library.viewmode.tab"
              onClick={() => setViewMode("editorial")}
              className="px-5 py-2.5 font-mono-geist text-[9px] tracking-[0.2em] uppercase transition-all duration-200"
              style={{
                background:
                  viewMode === "editorial"
                    ? "rgba(212,160,23,0.18)"
                    : "transparent",
                color:
                  viewMode === "editorial"
                    ? "#d4a017"
                    : "rgba(255,255,255,0.3)",
                borderRight: "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
                borderBottom:
                  viewMode === "editorial"
                    ? "2px solid #d4a017"
                    : "2px solid transparent",
              }}
            >
              ◆ Editorial Deep-Dives
            </button>
            <button
              type="button"
              data-ocid="steami.library.viewmode.tab"
              onClick={() => setViewMode("signals")}
              className="px-5 py-2.5 font-mono-geist text-[9px] tracking-[0.2em] uppercase transition-all duration-200"
              style={{
                background:
                  viewMode === "signals"
                    ? "rgba(74,126,247,0.12)"
                    : "transparent",
                color:
                  viewMode === "signals"
                    ? "rgba(138,180,255,0.9)"
                    : "rgba(255,255,255,0.3)",
                cursor: "pointer",
                borderBottom:
                  viewMode === "signals"
                    ? "2px solid #4a7ef7"
                    : "2px solid transparent",
              }}
            >
              ◈ Intelligence Signals
            </button>
          </div>

          {/* ─ EDITORIAL VIEW ─ */}
          {viewMode === "editorial" && (
            <div>
              {/* Featured Card — ep-001 full width */}
              <div
                data-ocid="steami.editorial.card.1"
                className="relative overflow-hidden rounded-sm mb-6 steami-reveal reveal"
                style={{
                  background: "rgba(74,126,247,0.04)",
                  border: "1px solid rgba(74,126,247,0.2)",
                  borderLeft: "3px solid #4a7ef7",
                }}
              >
                {/* Scan line sweep */}
                <div
                  className="animate-card-scan absolute inset-x-0 top-0 h-[1px] pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(74,126,247,0.8), transparent)",
                  }}
                  aria-hidden="true"
                />
                <div className="flex flex-col lg:flex-row gap-0">
                  {/* Left content */}
                  <div className="flex-1 p-8 lg:p-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="font-mono-geist text-[8px] tracking-[0.35em] uppercase px-2 py-0.5 rounded-sm"
                        style={{
                          background: "rgba(74,126,247,0.12)",
                          color: "#4a7ef7",
                          border: "1px solid rgba(74,126,247,0.25)",
                        }}
                      >
                        {EDITORIAL_PIECES[0].eyebrow}
                      </span>
                      <span
                        className="font-mono-geist text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-sm"
                        style={{
                          background: "rgba(212,160,23,0.1)",
                          color: "#d4a017",
                          border: "1px solid rgba(212,160,23,0.25)",
                        }}
                      >
                        FEATURED DEEP-DIVE
                      </span>
                    </div>
                    <h3
                      className="font-display font-light mb-4 leading-tight"
                      style={{
                        fontSize: "clamp(1.6rem,4vw,2.6rem)",
                        letterSpacing: "0.05em",
                        color: "rgba(255,255,255,0.92)",
                      }}
                    >
                      {EDITORIAL_PIECES[0].title}
                    </h3>
                    <p
                      className="text-sm mb-6 leading-relaxed"
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontFamily: "Sora, sans-serif",
                        maxWidth: "42ch",
                      }}
                    >
                      {EDITORIAL_PIECES[0].summary}
                    </p>
                    <div className="flex items-center gap-4 mb-6">
                      <span
                        className="px-2 py-0.5 rounded-sm font-mono-geist text-[8px] tracking-[0.18em] uppercase"
                        style={{
                          background: "rgba(74,126,247,0.1)",
                          color: "#4a7ef7",
                          border: "1px solid rgba(74,126,247,0.2)",
                        }}
                      >
                        {EDITORIAL_PIECES[0].domain}
                      </span>
                      <span
                        className="font-mono-geist text-[8px]"
                        style={{ color: "rgba(255,255,255,0.25)" }}
                      >
                        {EDITORIAL_PIECES[0].readTime}
                      </span>
                    </div>
                    <button
                      type="button"
                      data-ocid="steami.editorial.open_modal_button.1"
                      onClick={() => {
                        setSelectedEditorial(EDITORIAL_PIECES[0]);
                        setExpandedEditorialSection(0);
                        setEditorialReadProgress(0);
                      }}
                      className="px-6 py-3 rounded-sm font-mono-geist text-[9px] tracking-[0.2em] uppercase transition-all duration-200"
                      style={{
                        background: "rgba(74,126,247,0.15)",
                        border: "1px solid rgba(74,126,247,0.4)",
                        color: "#7aa8ff",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "rgba(74,126,247,0.25)";
                        (e.currentTarget as HTMLButtonElement).style.color =
                          "#fff";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "rgba(74,126,247,0.15)";
                        (e.currentTarget as HTMLButtonElement).style.color =
                          "#7aa8ff";
                      }}
                    >
                      Open Deep Dive →
                    </button>
                  </div>
                  {/* Right SVG visualization — governance network */}
                  <div
                    className="hidden lg:flex items-center justify-center p-8"
                    style={{
                      width: 320,
                      flexShrink: 0,
                      background: "rgba(74,126,247,0.03)",
                    }}
                  >
                    <svg
                      width="260"
                      height="200"
                      viewBox="0 0 260 200"
                      aria-hidden="true"
                    >
                      {/* Node connections */}
                      <line
                        x1="130"
                        y1="100"
                        x2="60"
                        y2="40"
                        stroke="rgba(74,126,247,0.2)"
                        strokeWidth="1"
                        strokeDasharray="4 3"
                        style={{ animation: "ep-flow-dash 3s linear infinite" }}
                      />
                      <line
                        x1="130"
                        y1="100"
                        x2="200"
                        y2="40"
                        stroke="rgba(74,126,247,0.2)"
                        strokeWidth="1"
                        strokeDasharray="4 3"
                        style={{
                          animation: "ep-flow-dash 2.5s linear infinite 0.5s",
                        }}
                      />
                      <line
                        x1="130"
                        y1="100"
                        x2="40"
                        y2="120"
                        stroke="rgba(74,126,247,0.15)"
                        strokeWidth="1"
                        strokeDasharray="3 4"
                        style={{
                          animation: "ep-flow-dash 3.5s linear infinite 0.2s",
                        }}
                      />
                      <line
                        x1="130"
                        y1="100"
                        x2="220"
                        y2="120"
                        stroke="rgba(74,126,247,0.15)"
                        strokeWidth="1"
                        strokeDasharray="3 4"
                        style={{
                          animation: "ep-flow-dash 4s linear infinite 0.8s",
                        }}
                      />
                      <line
                        x1="130"
                        y1="100"
                        x2="90"
                        y2="170"
                        stroke="rgba(212,160,23,0.2)"
                        strokeWidth="1"
                        strokeDasharray="4 3"
                        style={{
                          animation: "ep-flow-dash 2.8s linear infinite 1s",
                        }}
                      />
                      <line
                        x1="130"
                        y1="100"
                        x2="170"
                        y2="170"
                        stroke="rgba(212,160,23,0.2)"
                        strokeWidth="1"
                        strokeDasharray="4 3"
                        style={{
                          animation: "ep-flow-dash 3.2s linear infinite 0.4s",
                        }}
                      />
                      {/* Peripheral nodes */}
                      {[
                        { cx: 60, cy: 40, label: "EU", c: "#4a7ef7" },
                        { cx: 200, cy: 40, label: "US", c: "#4a7ef7" },
                        { cx: 40, cy: 120, label: "CN", c: "#4a7ef7" },
                        { cx: 220, cy: 120, label: "G7", c: "#4a7ef7" },
                        { cx: 90, cy: 170, label: "UN", c: "#d4a017" },
                        { cx: 170, cy: 170, label: "ISO", c: "#d4a017" },
                      ].map((n) => (
                        <g key={n.label}>
                          <circle
                            cx={n.cx}
                            cy={n.cy}
                            r="18"
                            fill="rgba(4,5,14,0.9)"
                            stroke={n.c}
                            strokeWidth="1"
                            opacity="0.7"
                            style={{
                              animation:
                                "ep-pulse-core 2.5s ease-in-out infinite",
                            }}
                          />
                          <text
                            x={n.cx}
                            y={n.cy + 4}
                            textAnchor="middle"
                            fontSize="8"
                            fill={n.c}
                            fontFamily="Geist Mono, monospace"
                            letterSpacing="0.1em"
                          >
                            {n.label}
                          </text>
                        </g>
                      ))}
                      {/* Center node */}
                      <circle
                        cx="130"
                        cy="100"
                        r="26"
                        fill="rgba(4,5,14,0.95)"
                        stroke="#4a7ef7"
                        strokeWidth="1.5"
                        style={{
                          animation: "ep-pulse-ring1 3s ease-in-out infinite",
                        }}
                      />
                      <circle
                        cx="130"
                        cy="100"
                        r="18"
                        fill="rgba(74,126,247,0.08)"
                        stroke="#4a7ef7"
                        strokeWidth="1"
                      />
                      <text
                        x="130"
                        y="96"
                        textAnchor="middle"
                        fontSize="7"
                        fill="rgba(255,255,255,0.6)"
                        fontFamily="Geist Mono, monospace"
                        letterSpacing="0.15em"
                      >
                        AI GOV
                      </text>
                      <text
                        x="130"
                        y="107"
                        textAnchor="middle"
                        fontSize="6"
                        fill="rgba(74,126,247,0.8)"
                        fontFamily="Geist Mono, monospace"
                        letterSpacing="0.1em"
                      >
                        NETWORK
                      </text>
                    </svg>
                  </div>
                </div>
              </div>

              {/* 9-card grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {EDITORIAL_PIECES.slice(1).map((piece, idx) => {
                  const cardIdx = idx + 2; // 2..10
                  return (
                    <div
                      key={piece.id}
                      data-ocid={`steami.editorial.card.${cardIdx}`}
                      className="relative overflow-hidden rounded-sm cursor-default transition-all duration-300 steami-reveal reveal"
                      style={{
                        background: "rgba(255,255,255,0.025)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderLeft: `3px solid ${piece.accentColor}`,
                        transitionDelay: `${idx * 0.05}s`,
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.background = `${piece.accentColor}06`;
                        el.style.borderColor = `${piece.accentColor}30`;
                        el.style.borderLeftColor = piece.accentColor;
                        el.style.transform = "translateY(-4px)";
                        el.style.boxShadow = `0 12px 32px rgba(0,0,0,0.4), 0 0 20px ${piece.accentColor}10`;
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.background = "rgba(255,255,255,0.025)";
                        el.style.borderColor = "rgba(255,255,255,0.06)";
                        el.style.borderLeftColor = piece.accentColor;
                        el.style.transform = "none";
                        el.style.boxShadow = "none";
                      }}
                    >
                      {/* Hero symbol watermark */}
                      <div
                        className="absolute pointer-events-none select-none"
                        style={{
                          right: 16,
                          top: 12,
                          fontSize: "4.5rem",
                          lineHeight: 1,
                          color: piece.accentColor,
                          opacity: 0.05,
                          fontFamily: "sans-serif",
                        }}
                        aria-hidden="true"
                      >
                        {piece.heroSymbol}
                      </div>

                      <div className="p-6">
                        {/* Top row: eyebrow + anim + readtime */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div
                              className="font-mono-geist text-[7.5px] tracking-[0.3em] uppercase mb-1"
                              style={{ color: `${piece.accentColor}90` }}
                            >
                              {piece.eyebrow}
                            </div>
                            <span
                              className="font-mono-geist text-[7px]"
                              style={{ color: "rgba(255,255,255,0.2)" }}
                            >
                              {piece.readTime}
                            </span>
                          </div>
                          <EditorialCardAnim
                            type={piece.cardAnim}
                            color={piece.accentColor}
                          />
                        </div>

                        {/* Domain badge */}
                        <div className="mb-3">
                          <span
                            className="px-2 py-0.5 rounded-sm font-mono-geist text-[7px] tracking-[0.15em] uppercase"
                            style={{
                              background: `${piece.accentColor}12`,
                              color: piece.accentColor,
                              border: `1px solid ${piece.accentColor}25`,
                            }}
                          >
                            {piece.domain}
                          </span>
                        </div>

                        {/* Title */}
                        <h3
                          className="font-display font-light mb-3 line-clamp-3"
                          style={{
                            fontSize: "1.05rem",
                            letterSpacing: "0.04em",
                            color: "rgba(255,255,255,0.88)",
                            lineHeight: 1.35,
                          }}
                        >
                          {piece.title}
                        </h3>

                        {/* Summary */}
                        <p
                          className="text-xs leading-relaxed mb-4 line-clamp-2"
                          style={{
                            color: "rgba(255,255,255,0.38)",
                            fontFamily: "Sora, sans-serif",
                          }}
                        >
                          {piece.summary}
                        </p>

                        {/* Tags row */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {piece.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 rounded-sm font-mono-geist text-[7px] tracking-[0.1em] uppercase"
                              style={{
                                background: "rgba(255,255,255,0.04)",
                                color: "rgba(255,255,255,0.22)",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                          <span
                            className="px-1.5 py-0.5 rounded-sm font-mono-geist text-[7px] tracking-[0.1em] uppercase"
                            style={{
                              background: `${piece.accentColor}10`,
                              color: `${piece.accentColor}90`,
                            }}
                          >
                            {piece.keySignals.length} SIGNALS
                          </span>
                        </div>

                        {/* CTA */}
                        <button
                          type="button"
                          data-ocid={`steami.editorial.open_modal_button.${cardIdx}`}
                          onClick={() => {
                            setSelectedEditorial(piece);
                            setExpandedEditorialSection(0);
                            setEditorialReadProgress(0);
                          }}
                          className="font-mono-geist text-[8px] tracking-[0.18em] uppercase transition-all duration-200"
                          style={{
                            background: "none",
                            border: "none",
                            color: `${piece.accentColor}60`,
                            cursor: "pointer",
                            padding: 0,
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.color =
                              piece.accentColor;
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.color =
                              `${piece.accentColor}60`;
                          }}
                        >
                          Read Deep Dive →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─ SIGNALS VIEW ─ */}
          {viewMode === "signals" && (
            <div>
              {/* Filter tabs */}
              <div
                className="flex flex-wrap gap-2 mb-8 steami-reveal reveal"
                data-ocid="steami.library.tab"
                style={{ transitionDelay: "0.08s" }}
              >
                {["All", ...allDomains].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setLibraryFilter(d)}
                    className="px-4 py-2 rounded-sm font-mono-geist text-[9px] tracking-[0.2em] uppercase transition-all duration-250"
                    style={{
                      background:
                        libraryFilter === d
                          ? "rgba(74,126,247,0.15)"
                          : "rgba(255,255,255,0.03)",
                      border: `1px solid ${libraryFilter === d ? "rgba(74,126,247,0.5)" : "rgba(255,255,255,0.08)"}`,
                      color:
                        libraryFilter === d
                          ? "rgba(138,180,255,0.9)"
                          : "rgba(255,255,255,0.35)",
                      cursor: "pointer",
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
              {feedsLoading ? (
                <div
                  data-ocid="steami.library.loading_state"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="p-6 rounded-sm"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <Skeleton
                        className="h-3 w-20 mb-4"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                      />
                      <Skeleton
                        className="h-5 w-full mb-2"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                      />
                      <Skeleton
                        className="h-4 w-3/4 mb-2"
                        style={{ background: "rgba(255,255,255,0.04)" }}
                      />
                      <Skeleton
                        className="h-4 w-1/2 mb-6"
                        style={{ background: "rgba(255,255,255,0.04)" }}
                      />
                      <Skeleton
                        className="h-3 w-24"
                        style={{ background: "rgba(255,255,255,0.04)" }}
                      />
                    </div>
                  ))}
                </div>
              ) : filteredFeeds.length === 0 ? (
                <div
                  data-ocid="steami.library.empty_state"
                  className="text-center py-20 rounded-sm"
                  style={{
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <div
                    className="text-4xl mb-4"
                    style={{ color: "rgba(74,126,247,0.3)" }}
                  >
                    ◈
                  </div>
                  <p
                    className="font-mono-geist text-xs tracking-[0.2em] uppercase mb-2"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  >
                    {libraryFilter === "All"
                      ? "No intelligence signals published yet."
                      : `No signals in the "${libraryFilter}" domain yet.`}
                  </p>
                  <p
                    className="font-mono-geist text-[8px] tracking-[0.15em] uppercase"
                    style={{ color: "rgba(212,160,23,0.4)" }}
                  >
                    Switch to Editorial Deep-Dives to explore 10 in-depth
                    intelligence pieces.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFeeds.map((feed, i) => {
                    const domainColor = getDomainColor(feed.domain);
                    return (
                      <div
                        key={String(feed.id)}
                        data-ocid={`steami.library.card.${i + 1}`}
                        className="relative overflow-hidden rounded-sm p-6 cursor-default transition-all duration-300"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: `1px solid ${domainColor}25`,
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.background = `${domainColor}08`;
                          el.style.borderColor = `${domainColor}50`;
                          el.style.transform = "translateY(-3px)";
                          el.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3), 0 0 16px ${domainColor}10`;
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.background = "rgba(255,255,255,0.03)";
                          el.style.borderColor = `${domainColor}25`;
                          el.style.transform = "none";
                          el.style.boxShadow = "none";
                        }}
                      >
                        <div
                          className="animate-card-scan absolute inset-x-0 top-0 h-[1px] pointer-events-none"
                          style={{
                            background: `linear-gradient(90deg, transparent, ${domainColor}60, transparent)`,
                          }}
                          aria-hidden="true"
                        />
                        <div className="flex items-start justify-between mb-4">
                          <span
                            className="px-2 py-0.5 rounded-sm font-mono-geist text-[8px] tracking-[0.2em] uppercase"
                            style={{
                              background: `${domainColor}12`,
                              color: domainColor,
                              border: `1px solid ${domainColor}30`,
                            }}
                          >
                            {feed.domain}
                          </span>
                          {feed.isFeatured && (
                            <span
                              className="px-2 py-0.5 rounded-sm font-mono-geist text-[8px] tracking-[0.15em] uppercase"
                              style={{
                                background: "rgba(212,160,23,0.1)",
                                color: "#d4a017",
                                border: "1px solid rgba(212,160,23,0.3)",
                              }}
                            >
                              Featured
                            </span>
                          )}
                        </div>
                        <h3
                          className="font-display text-xl font-light mb-3 line-clamp-2"
                          style={{
                            color: "rgba(255,255,255,0.88)",
                            letterSpacing: "0.04em",
                            lineHeight: 1.3,
                          }}
                        >
                          {feed.title}
                        </h3>
                        <p
                          className="text-xs leading-relaxed mb-4 line-clamp-3"
                          style={{
                            color: "rgba(255,255,255,0.4)",
                            fontFamily: "Sora, sans-serif",
                          }}
                        >
                          {feed.summary}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {feed.domain
                            .split(" ")
                            .slice(0, 3)
                            .map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded-sm font-mono-geist text-[7px] tracking-[0.15em] uppercase"
                                style={{
                                  background: "rgba(255,255,255,0.04)",
                                  color: "rgba(255,255,255,0.25)",
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span
                            className="font-mono-geist text-[9px]"
                            style={{ color: "rgba(255,255,255,0.2)" }}
                          >
                            {formatFeedDate(feed.timestamp)}
                          </span>
                          <button
                            type="button"
                            data-ocid={`steami.library.open_modal_button.${i + 1}`}
                            onClick={() => setSelectedBrief(feed)}
                            className="font-mono-geist text-[9px] tracking-[0.15em] uppercase transition-colors duration-200"
                            style={{
                              background: "none",
                              border: "none",
                              color: `${domainColor}70`,
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.color = domainColor;
                            }}
                            onMouseLeave={(e) => {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.color = `${domainColor}70`;
                            }}
                          >
                            View Brief →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Intelligence Brief Dialog (admin signals) */}
      <Dialog
        open={!!selectedBrief}
        onOpenChange={(open) => {
          if (!open) setSelectedBrief(null);
        }}
      >
        <DialogContent
          data-ocid="steami.library.dialog"
          className="max-w-2xl rounded-sm"
          style={{
            background: "rgba(4,5,14,0.97)",
            border: "1px solid rgba(74,126,247,0.2)",
            backdropFilter: "blur(24px)",
          }}
        >
          {selectedBrief && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="px-2 py-0.5 rounded-sm font-mono-geist text-[8px] tracking-[0.2em] uppercase"
                    style={{
                      background: `${getDomainColor(selectedBrief.domain)}12`,
                      color: getDomainColor(selectedBrief.domain),
                      border: `1px solid ${getDomainColor(selectedBrief.domain)}30`,
                    }}
                  >
                    {selectedBrief.domain}
                  </span>
                  {selectedBrief.isFeatured && (
                    <span
                      className="px-2 py-0.5 rounded-sm font-mono-geist text-[8px] tracking-[0.15em] uppercase"
                      style={{
                        background: "rgba(212,160,23,0.1)",
                        color: "#d4a017",
                        border: "1px solid rgba(212,160,23,0.3)",
                      }}
                    >
                      Featured
                    </span>
                  )}
                </div>
                <DialogTitle
                  className="font-display font-light text-2xl text-left"
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    letterSpacing: "0.04em",
                    lineHeight: 1.3,
                  }}
                >
                  {selectedBrief.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontFamily: "Sora, sans-serif",
                  }}
                >
                  {selectedBrief.summary}
                </p>
                <div
                  className="font-mono-geist text-[9px]"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  Published: {formatFeedDate(selectedBrief.timestamp)}
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  data-ocid="steami.library.close_button"
                  onClick={() => setSelectedBrief(null)}
                  className="px-5 py-2 font-mono-geist text-[9px] tracking-[0.2em] uppercase transition-all duration-200 rounded-sm"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.4)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(255,255,255,0.7)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(255,255,255,0.4)";
                  }}
                >
                  Close
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Editorial Deep-Dive Dialog */}
      <Dialog
        open={!!selectedEditorial}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedEditorial(null);
            setEditorialReadProgress(0);
            setExpandedEditorialSection(0);
          }
        }}
      >
        <DialogContent
          data-ocid="steami.editorial.dialog"
          className="rounded-sm p-0 overflow-hidden"
          style={{
            maxWidth: "780px",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            background: "rgba(4,5,14,0.98)",
            border: selectedEditorial
              ? `1px solid ${selectedEditorial.accentColor}30`
              : "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(32px)",
          }}
        >
          {selectedEditorial &&
            (() => {
              const ep = selectedEditorial;
              return (
                <>
                  {/* Header bar */}
                  <div
                    style={{
                      flexShrink: 0,
                      height: 56,
                      background: `linear-gradient(90deg, ${ep.accentColor}22, ${ep.accentColor}08, transparent)`,
                      borderBottom: `1px solid ${ep.accentColor}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0 24px",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <span
                        style={{
                          fontSize: "1.4rem",
                          color: ep.accentColor,
                          opacity: 0.7,
                        }}
                        aria-hidden="true"
                      >
                        {ep.heroSymbol}
                      </span>
                      <span
                        className="font-mono-geist text-[7.5px] tracking-[0.35em] uppercase"
                        style={{ color: `${ep.accentColor}90` }}
                      >
                        {ep.eyebrow}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-sm font-mono-geist text-[7px] tracking-[0.15em] uppercase"
                        style={{
                          background: `${ep.accentColor}12`,
                          color: ep.accentColor,
                          border: `1px solid ${ep.accentColor}25`,
                        }}
                      >
                        {ep.domain}
                      </span>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <span
                        className="font-mono-geist text-[7.5px]"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      >
                        {ep.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Reading progress bar */}
                  <div
                    style={{
                      height: 2,
                      background: "rgba(255,255,255,0.05)",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${editorialReadProgress}%`,
                        background: ep.accentColor,
                        transition: "width 0.1s linear",
                      }}
                    />
                  </div>

                  {/* Scrollable body */}
                  <div
                    style={{
                      flex: 1,
                      overflowY: "auto",
                      padding: "32px 32px 40px",
                    }}
                    onScroll={(e) => {
                      const el = e.currentTarget;
                      const pct =
                        (el.scrollTop /
                          Math.max(1, el.scrollHeight - el.clientHeight)) *
                        100;
                      setEditorialReadProgress(Math.round(pct));
                    }}
                  >
                    {/* Title */}
                    <DialogTitle
                      className="font-display font-light mb-6"
                      style={{
                        fontSize: "clamp(1.4rem,3.5vw,1.9rem)",
                        letterSpacing: "0.04em",
                        color: "rgba(255,255,255,0.92)",
                        lineHeight: 1.25,
                      }}
                    >
                      {ep.title}
                    </DialogTitle>

                    {/* Lead paragraph */}
                    <p
                      className="text-sm leading-[1.85] mb-8 italic"
                      style={{
                        color: "rgba(255,255,255,0.65)",
                        fontFamily: "Sora, sans-serif",
                        borderLeft: `2px solid ${ep.accentColor}60`,
                        paddingLeft: 16,
                      }}
                    >
                      {ep.lead}
                    </p>

                    {/* Sections accordion */}
                    <div className="space-y-2 mb-8">
                      {ep.sections.map((sec, si) => (
                        <div
                          key={sec.heading}
                          style={{
                            border: `1px solid ${expandedEditorialSection === si ? `${ep.accentColor}30` : "rgba(255,255,255,0.06)"}`,
                            borderRadius: 2,
                            overflow: "hidden",
                            transition: "border-color 0.2s",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedEditorialSection(
                                expandedEditorialSection === si ? null : si,
                              )
                            }
                            className="w-full text-left px-5 py-4 flex items-center justify-between transition-colors duration-200"
                            style={{
                              background:
                                expandedEditorialSection === si
                                  ? `${ep.accentColor}08`
                                  : "rgba(255,255,255,0.02)",
                              cursor: "pointer",
                              border: "none",
                            }}
                          >
                            <span
                              className="font-mono-geist text-[9px] tracking-[0.3em] uppercase"
                              style={{
                                color:
                                  expandedEditorialSection === si
                                    ? ep.accentColor
                                    : "rgba(255,255,255,0.45)",
                              }}
                            >
                              {sec.heading}
                            </span>
                            <span
                              style={{
                                color:
                                  expandedEditorialSection === si
                                    ? ep.accentColor
                                    : "rgba(255,255,255,0.2)",
                                fontSize: "0.6rem",
                              }}
                            >
                              {expandedEditorialSection === si ? "▲" : "▼"}
                            </span>
                          </button>
                          {expandedEditorialSection === si && (
                            <div
                              className="px-5 pb-5 pt-2"
                              style={{ background: `${ep.accentColor}04` }}
                            >
                              <p
                                className="text-sm leading-[1.8]"
                                style={{
                                  color: "rgba(255,255,255,0.62)",
                                  fontFamily: "Sora, sans-serif",
                                }}
                              >
                                {sec.body}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Key Signals panel */}
                    <div
                      className="mb-6 p-5 rounded-sm"
                      style={{
                        background: `${ep.accentColor}06`,
                        border: `1px solid ${ep.accentColor}20`,
                      }}
                    >
                      <div
                        className="font-mono-geist text-[8px] tracking-[0.4em] uppercase mb-4"
                        style={{ color: `${ep.accentColor}80` }}
                      >
                        ◆ KEY SIGNALS
                      </div>
                      <ul className="space-y-2.5">
                        {ep.keySignals.map((sig) => (
                          <li
                            key={sig}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 10,
                            }}
                          >
                            <span
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                background: ep.accentColor,
                                flexShrink: 0,
                                marginTop: 5,
                              }}
                              aria-hidden="true"
                            />
                            <span
                              className="font-mono-geist text-[9px] leading-relaxed"
                              style={{ color: "rgba(255,255,255,0.55)" }}
                            >
                              {sig}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Implications panel */}
                    <div
                      className="mb-8 p-5 rounded-sm"
                      style={{
                        background: "rgba(212,160,23,0.04)",
                        border: "1px solid rgba(212,160,23,0.15)",
                      }}
                    >
                      <div
                        className="font-mono-geist text-[8px] tracking-[0.4em] uppercase mb-4"
                        style={{ color: "rgba(212,160,23,0.7)" }}
                      >
                        ▶ STRATEGIC IMPLICATIONS
                      </div>
                      <ul className="space-y-3">
                        {ep.implications.map((impl) => (
                          <li
                            key={impl}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 10,
                            }}
                          >
                            <span
                              className="font-mono-geist text-[10px]"
                              style={{
                                color: "#d4a017",
                                flexShrink: 0,
                                marginTop: 1,
                              }}
                            >
                              →
                            </span>
                            <span
                              className="text-xs leading-relaxed"
                              style={{
                                color: "rgba(255,255,255,0.55)",
                                fontFamily: "Sora, sans-serif",
                              }}
                            >
                              {impl}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {ep.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-sm font-mono-geist text-[7.5px] tracking-[0.15em] uppercase"
                          style={{
                            background: `${ep.accentColor}10`,
                            color: `${ep.accentColor}80`,
                            border: `1px solid ${ep.accentColor}20`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Close button */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        data-ocid="steami.editorial.close_button"
                        onClick={() => {
                          setSelectedEditorial(null);
                          setEditorialReadProgress(0);
                          setExpandedEditorialSection(0);
                        }}
                        className="px-6 py-2.5 rounded-sm font-mono-geist text-[8px] tracking-[0.2em] uppercase transition-all duration-200"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "rgba(255,255,255,0.4)",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.background = "rgba(255,255,255,0.08)";
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "rgba(255,255,255,0.7)";
                        }}
                        onMouseLeave={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.background = "rgba(255,255,255,0.04)";
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "rgba(255,255,255,0.4)";
                        }}
                      >
                        Close Brief
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
        </DialogContent>
      </Dialog>

      {/* ── SECTION 10: ETHICAL GOVERNANCE — DENSE ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 steami-reveal reveal">
            <div className="flex items-center gap-3 mb-2">
              <div
                style={{
                  width: "18px",
                  height: "1px",
                  background: "rgba(74,126,247,0.5)",
                }}
                aria-hidden="true"
              />
              <div
                className="font-mono-geist text-[9px] tracking-[0.4em] uppercase"
                style={{ color: "rgba(74,126,247,0.55)" }}
              >
                ETHOS REVIEW
              </div>
            </div>
            <h2
              className="font-display font-light mb-2"
              style={{
                fontSize: "clamp(1.9rem, 4vw, 3rem)",
                letterSpacing: "0.07em",
                color: "rgba(255,255,255,0.88)",
              }}
            >
              Ethical Intelligence Governance
            </h2>
            <p
              className="text-xs max-w-xl leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.38)",
                fontFamily: "Sora, sans-serif",
                lineHeight: 1.65,
              }}
            >
              All STEAMI intelligence outputs pass through ETHOS review before
              publication. This ensures every knowledge product meets rigorous
              ethical and accuracy standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ETHICS_PRINCIPLES.map((principle, i) => (
              <div
                key={principle.name}
                data-ocid={`steami.ethics.card.${i + 1}`}
                className="relative overflow-hidden glass-strong p-7 rounded-sm steami-reveal reveal cursor-default"
                style={
                  {
                    transitionDelay: `${i * 0.08}s`,
                    "--scan-delay": `${i * 2.2}s`,
                    borderTop: "2px solid rgba(74,126,247,0.25)",
                  } as React.CSSProperties
                }
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderTopColor = "rgba(74,126,247,0.6)";
                  el.style.boxShadow =
                    "0 0 20px rgba(74,126,247,0.1), 0 8px 24px rgba(0,0,0,0.35)";
                  el.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderTopColor = "rgba(74,126,247,0.25)";
                  el.style.boxShadow = "none";
                  el.style.transform = "none";
                }}
              >
                {/* Scan line */}
                <div
                  className="animate-card-scan absolute inset-x-0 top-0 h-[1px] pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(74,126,247,0.6), transparent)",
                  }}
                  aria-hidden="true"
                />

                <div
                  className="text-3xl mb-4 animate-glyph-pulse"
                  style={{ color: "rgba(74,126,247,0.5)" }}
                  aria-hidden="true"
                >
                  {principle.glyph}
                </div>

                <h3
                  className="font-display text-xl font-light mb-3"
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {principle.name}
                </h3>

                <p
                  className="text-xs leading-relaxed mb-4"
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontFamily: "Sora, sans-serif",
                  }}
                >
                  {principle.desc}
                </p>

                <div className="flex items-center gap-2">
                  <div
                    className="w-1 h-1 rounded-full"
                    style={{ background: "rgba(74,126,247,0.5)" }}
                  />
                  <span
                    className="font-mono-geist text-[8px] tracking-[0.2em] uppercase"
                    style={{ color: "rgba(74,126,247,0.4)" }}
                  >
                    ETHOS CERTIFIED
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEGAL FOOTER ── */}
      <div
        className="py-10 px-6"
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
