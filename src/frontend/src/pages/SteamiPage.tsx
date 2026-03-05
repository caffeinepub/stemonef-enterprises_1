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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SteamiPage({ onBack }: SteamiPageProps) {
  const { data: feeds, isLoading: feedsLoading } = useGetPublicFeeds();
  const [libraryFilter, setLibraryFilter] = useState("All");
  const [selectedBrief, setSelectedBrief] = useState<FeedEntry | null>(null);
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
          <div className="mb-14 steami-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.45em] uppercase mb-3"
              style={{ color: "rgba(74,126,247,0.7)" }}
            >
              ◆ KNOWLEDGE REPOSITORY
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
              Published intelligence briefs, research summaries and knowledge
              products from the STEAMI platform.
            </p>
          </div>

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

          {/* Library cards */}
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
                className="font-mono-geist text-xs tracking-[0.2em] uppercase"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                {libraryFilter === "All"
                  ? "No intelligence briefs published yet. Check back as STEAMI publishes its first intelligence outputs."
                  : `No intelligence briefs in the "${libraryFilter}" domain yet.`}
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
                    {/* Scan line */}
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

                    {/* Tags */}
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
                          (e.currentTarget as HTMLButtonElement).style.color =
                            domainColor;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color =
                            `${domainColor}70`;
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
      </section>

      {/* Intelligence Brief Dialog */}
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
                <div className="flex items-center gap-4">
                  <div
                    className="font-mono-geist text-[9px]"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  >
                    Published: {formatFeedDate(selectedBrief.timestamp)}
                  </div>
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
