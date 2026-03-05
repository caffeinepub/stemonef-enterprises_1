import { useCallback, useEffect, useRef, useState } from "react";

/* ─── Types ────────────────────────────────────────────────────────────────── */
interface Pillar {
  id: string;
  label: string;
  description: string;
  activeSystems: string[];
  shortLabel: string;
}

interface ImpactDomain {
  label: string;
  color: string;
  pillars: number[]; // indices into PILLARS array
}

interface RevenueStream {
  label: string;
  color: string;
  pillars: number[];
  detail: string;
}

interface Particle {
  x: number;
  y: number;
  progress: number;
  lane: number;
  opacity: number;
  speed: number;
  direction: "ltr" | "rtl";
}

/* ─── Static Data ──────────────────────────────────────────────────────────── */
const PILLARS: Pillar[] = [
  {
    id: "EPOCHS",
    label: "EPOCHS",
    shortLabel: "EPO",
    description: "Research & Innovation Organization",
    activeSystems: ["GAIA", "EIOS"],
  },
  {
    id: "HUMANON",
    label: "HUMANON",
    shortLabel: "HMN",
    description: "Humanitarian Development Network",
    activeSystems: ["ATLAS", "MERIDIAN"],
  },
  {
    id: "STEAMI",
    label: "STEAMI",
    shortLabel: "STM",
    description: "Intelligence Synthesis Engine",
    activeSystems: ["NEXUS", "SIGNAL"],
  },
  {
    id: "NOVA",
    label: "NOVA",
    shortLabel: "NVA",
    description: "Deep Innovation Laboratory",
    activeSystems: ["PULSE", "IGNITE"],
  },
  {
    id: "TERRA",
    label: "TERRA",
    shortLabel: "TRA",
    description: "Climate & Environmental Research",
    activeSystems: ["GAIA-ENV", "CLIMATE-X"],
  },
  {
    id: "EQUIS",
    label: "EQUIS",
    shortLabel: "EQS",
    description: "Equity & Investment Architecture",
    activeSystems: ["CAPITAL", "FLOW"],
  },
  {
    id: "ETHOS",
    label: "ETHOS",
    shortLabel: "ETH",
    description: "Ethical Governance Framework",
    activeSystems: ["COMPASS", "CHARTER"],
  },
];

const IMPACT_DOMAINS: ImpactDomain[] = [
  { label: "Climate Systems", color: "rgba(52,211,153,0.85)", pillars: [4, 0] },
  { label: "Global Health", color: "rgba(248,113,113,0.85)", pillars: [1, 6] },
  {
    label: "Poverty Reduction",
    color: "rgba(167,139,250,0.85)",
    pillars: [1, 5],
  },
  {
    label: "Education Access",
    color: "rgba(212,160,23,0.85)",
    pillars: [0, 3],
  },
  { label: "Ethical AI", color: "rgba(96,165,250,0.85)", pillars: [2, 6] },
];

const REVENUE_STREAMS: RevenueStream[] = [
  {
    label: "Deep Technology",
    color: "rgba(74,126,247,0.85)",
    pillars: [0, 5],
    detail: "R&D → Product Licensing",
  },
  {
    label: "Intelligence Services",
    color: "rgba(167,139,250,0.85)",
    pillars: [2, 3],
    detail: "Synthesis → Advisory",
  },
  {
    label: "Media Production",
    color: "rgba(212,160,23,0.85)",
    pillars: [1, 3],
    detail: "Content → Distribution",
  },
  {
    label: "Equity Investments",
    color: "rgba(52,211,153,0.85)",
    pillars: [5, 4],
    detail: "Capital → Impact Funds",
  },
];

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
const SVG_SIZE_DESK = 350;
const SVG_SIZE_MOB = 280;
const RING_RADIUS = 110;
// SVG center coordinate = 175 (SVG_SIZE_DESK / 2)

function nodePosition(
  index: number,
  total: number,
  radius: number,
  cx: number,
  cy: number,
) {
  const angle = -Math.PI / 2 + (index / total) * 2 * Math.PI;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
    angle,
  };
}

/* ─── CSS Keyframes injected as a <style> tag ──────────────────────────────── */
const ENGINE_STYLES = `
@keyframes engine-rotate {
  to { transform: rotate(360deg); }
}
@keyframes engine-rotate-rev {
  to { transform: rotate(-360deg); }
}
@keyframes node-pulse-ring {
  0%, 100% { opacity: 0; }
  50% { opacity: 0.45; }
}
@keyframes node-pulse-core {
  0%, 100% { opacity: 1; r: 4; }
  50% { opacity: 0.55; r: 5.5; }
}
@keyframes signal-flow {
  0% { stroke-dashoffset: 40; }
  100% { stroke-dashoffset: 0; }
}
@keyframes orbit-glow {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.4; }
}
@keyframes data-tick {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
@keyframes core-ring-pulse {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.55; }
}
@keyframes scan-sweep {
  0% { transform: translateY(-100%); opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.2; }
  100% { transform: translateY(200%); opacity: 0; }
}
`;

/* ─── NodeTooltip ──────────────────────────────────────────────────────────── */
interface TooltipProps {
  pillar: Pillar;
  x: number;
  y: number;
  svgSize: number;
}
function NodeTooltip({ pillar, x, y, svgSize }: TooltipProps) {
  const isBottom = y > svgSize / 2;
  const tipStyle: React.CSSProperties = {
    position: "absolute",
    left: `${(x / svgSize) * 100}%`,
    top: isBottom
      ? `${(y / svgSize) * 100 - 28}%`
      : `${(y / svgSize) * 100 + 8}%`,
    transform: "translateX(-50%)",
    background: "rgba(4,5,14,0.97)",
    border: "1px solid rgba(212,160,23,0.45)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    padding: "10px 14px",
    borderRadius: "2px",
    minWidth: "180px",
    maxWidth: "220px",
    zIndex: 50,
    pointerEvents: "none",
    animation: "fade-in-up 0.2s ease forwards",
    boxShadow: "0 0 30px rgba(212,160,23,0.12), 0 8px 32px rgba(0,0,0,0.8)",
  };

  return (
    <div data-ocid="enterprise.node.tooltip" style={tipStyle}>
      <div
        style={{
          fontFamily: "Geist Mono, monospace",
          fontSize: "11px",
          color: "rgba(212,160,23,0.95)",
          letterSpacing: "0.2em",
          marginBottom: "4px",
          fontWeight: 500,
        }}
      >
        {pillar.label}
      </div>
      <div
        style={{
          fontFamily: "Sora, sans-serif",
          fontSize: "10px",
          color: "rgba(255,255,255,0.55)",
          marginBottom: "6px",
          lineHeight: 1.5,
        }}
      >
        {pillar.description}
      </div>
      <div
        style={{
          fontFamily: "Geist Mono, monospace",
          fontSize: "9px",
          color: "rgba(74,126,247,0.8)",
          letterSpacing: "0.1em",
        }}
      >
        ACTIVE:{" "}
        <span style={{ color: "rgba(74,126,247,0.6)" }}>
          {pillar.activeSystems.join(" · ")}
        </span>
      </div>
    </div>
  );
}

/* ─── Central Engine SVG ───────────────────────────────────────────────────── */
interface EngineSVGProps {
  highlightedPillars: number[];
  hoveredNode: number | null;
  onNodeHover: (index: number | null) => void;
  svgSize: number;
  visible: boolean;
}

function EngineSVG({
  highlightedPillars,
  hoveredNode,
  onNodeHover,
  svgSize,
  visible,
}: EngineSVGProps) {
  const scale = svgSize / SVG_SIZE_DESK;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const ringR = RING_RADIUS * scale;
  const outerR = 130 * scale;
  const innerR = 85 * scale;

  const nodes = PILLARS.map((_, i) => nodePosition(i, 7, ringR, cx, cy));

  return (
    <div
      data-ocid="enterprise.engine.canvas_target"
      style={{ position: "relative", width: svgSize, height: svgSize }}
    >
      <svg
        role="img"
        aria-label="STEMONEF Enterprise Engine — interactive pillar network visualization"
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        style={{
          overflow: "visible",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.85)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
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
          <filter id="glow-strong">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(212,160,23,0.25)" />
            <stop offset="100%" stopColor="rgba(74,126,247,0.05)" />
          </radialGradient>
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(74,126,247,0.06)" />
            <stop offset="100%" stopColor="rgba(4,5,14,0)" />
          </radialGradient>
        </defs>

        {/* ── Ambient background glow ── */}
        <circle cx={cx} cy={cy} r={ringR * 1.35} fill="url(#bgGrad)" />

        {/* ── Outermost decorative ring ── */}
        <circle
          cx={cx}
          cy={cy}
          r={outerR}
          stroke="rgba(74,126,247,0.1)"
          strokeWidth="0.5"
          fill="none"
          style={{ animation: "orbit-glow 5s ease-in-out infinite" }}
        />

        {/* ── Tick marks (12-clock positions) ── */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * 2 * Math.PI - Math.PI / 2;
          const r1 = outerR - 3 * scale;
          const r2 = outerR + 3 * scale;
          const tickDeg = Math.round((i / 12) * 360);
          return (
            <line
              key={`tick-${tickDeg}`}
              x1={cx + r1 * Math.cos(a)}
              y1={cy + r1 * Math.sin(a)}
              x2={cx + r2 * Math.cos(a)}
              y2={cy + r2 * Math.sin(a)}
              stroke="rgba(212,160,23,0.25)"
              strokeWidth="0.8"
            />
          );
        })}

        {/* ── Rotating dashed ring ── */}
        <g
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            willChange: "transform",
            animation: "engine-rotate 40s linear infinite",
          }}
        >
          <circle
            cx={cx}
            cy={cy}
            r={ringR}
            stroke="rgba(74,126,247,0.2)"
            strokeWidth="0.8"
            strokeDasharray="3 8"
            fill="none"
          />
        </g>

        {/* ── Counter-rotating inner ring ── */}
        <g
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            willChange: "transform",
            animation: "engine-rotate-rev 60s linear infinite",
          }}
        >
          <circle
            cx={cx}
            cy={cy}
            r={innerR}
            stroke="rgba(212,160,23,0.08)"
            strokeWidth="0.5"
            strokeDasharray="2 10"
            fill="none"
          />
        </g>

        {/* ── Connection lines between adjacent nodes ── */}
        {nodes.map((n, i) => {
          const next = nodes[(i + 1) % 7];
          const isActive =
            highlightedPillars.includes(i) ||
            highlightedPillars.includes((i + 1) % 7);
          const isHovered = hoveredNode === i || hoveredNode === (i + 1) % 7;
          return (
            <line
              key={`conn-${PILLARS[i].id}-${PILLARS[(i + 1) % 7].id}`}
              x1={n.x}
              y1={n.y}
              x2={next.x}
              y2={next.y}
              stroke={
                isHovered
                  ? "rgba(212,160,23,0.4)"
                  : isActive
                    ? "rgba(74,126,247,0.5)"
                    : "rgba(74,126,247,0.07)"
              }
              strokeWidth={isHovered ? 1.4 : isActive ? 1.1 : 0.5}
              style={{ transition: "stroke 0.3s ease, stroke-width 0.3s ease" }}
            />
          );
        })}

        {/* ── Cross-connections (every other node) for the "web" effect ── */}
        {nodes.map((n, i) => {
          const skip2 = nodes[(i + 2) % 7];
          const isActive =
            highlightedPillars.includes(i) &&
            highlightedPillars.includes((i + 2) % 7);
          return (
            <line
              key={`cross-${PILLARS[i].id}-${PILLARS[(i + 2) % 7].id}`}
              x1={n.x}
              y1={n.y}
              x2={skip2.x}
              y2={skip2.y}
              stroke={
                isActive ? "rgba(74,126,247,0.2)" : "rgba(74,126,247,0.03)"
              }
              strokeWidth={isActive ? 0.8 : 0.3}
              strokeDasharray="2 6"
              style={{ transition: "stroke 0.3s ease" }}
            />
          );
        })}

        {/* ── Signal pulse lines from center ── */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const a = (deg * Math.PI) / 180;
          return (
            <line
              key={`sig-${deg}`}
              x1={cx}
              y1={cy}
              x2={cx + ringR * 0.65 * Math.cos(a)}
              y2={cy + ringR * 0.65 * Math.sin(a)}
              stroke="rgba(212,160,23,0.06)"
              strokeWidth="0.5"
              strokeDasharray="2 6"
            />
          );
        })}

        {/* ── Pillar nodes ── */}
        {nodes.map((pos, i) => {
          const isHighlighted = highlightedPillars.includes(i);
          const isHovered = hoveredNode === i;
          const pillar = PILLARS[i];
          const labelR = 26 * scale;

          const nodeCircleR = 10 * scale;
          const glowCircleR = 16 * scale;
          const pulseRingR = 14 * scale;

          const nodeColor = isHovered
            ? {
                fill: "rgba(212,160,23,0.18)",
                stroke: "#d4a017",
                glow: "rgba(212,160,23,0.3)",
              }
            : isHighlighted
              ? {
                  fill: "rgba(74,126,247,0.18)",
                  stroke: "#4a7ef7",
                  glow: "rgba(74,126,247,0.22)",
                }
              : {
                  fill: "rgba(4,5,14,0.9)",
                  stroke: "rgba(74,126,247,0.35)",
                  glow: "rgba(74,126,247,0.04)",
                };

          const labelX = pos.x + labelR * Math.cos(pos.angle);
          const labelY = pos.y + labelR * Math.sin(pos.angle);

          return (
            <g
              key={pillar.id}
              onMouseEnter={() => onNodeHover(i)}
              onMouseLeave={() => onNodeHover(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Outer ambient glow */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={glowCircleR}
                fill={nodeColor.glow}
                style={{ transition: "fill 0.3s ease" }}
              />

              {/* Pulse ring — CSS animated */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={pulseRingR}
                fill="none"
                stroke={
                  isHovered
                    ? "rgba(212,160,23,0.35)"
                    : isHighlighted
                      ? "rgba(74,126,247,0.35)"
                      : "rgba(74,126,247,0.15)"
                }
                strokeWidth="0.8"
                style={{
                  animation: `node-pulse-ring ${2.5 + i * 0.3}s ease-in-out ${i * 0.4}s infinite`,
                  transition: "stroke 0.3s ease",
                }}
              />

              {/* Main node circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={nodeCircleR}
                fill={nodeColor.fill}
                stroke={nodeColor.stroke}
                strokeWidth={isHighlighted || isHovered ? 1.5 : 1}
                filter={
                  isHovered
                    ? "url(#glow-gold)"
                    : isHighlighted
                      ? "url(#glow-blue)"
                      : undefined
                }
                style={{
                  transition:
                    "fill 0.3s ease, stroke 0.3s ease, stroke-width 0.3s ease",
                }}
              />

              {/* Node inner dot */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={3 * scale}
                fill={
                  isHovered
                    ? "rgba(212,160,23,0.9)"
                    : isHighlighted
                      ? "rgba(74,126,247,0.9)"
                      : "rgba(74,126,247,0.4)"
                }
                style={{ transition: "fill 0.3s ease" }}
              />

              {/* Label */}
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={7 * scale}
                fontFamily="Geist Mono, monospace"
                fill={
                  isHovered
                    ? "rgba(212,160,23,0.9)"
                    : isHighlighted
                      ? "rgba(255,255,255,0.85)"
                      : "rgba(255,255,255,0.45)"
                }
                style={{
                  transition: "fill 0.3s ease",
                  userSelect: "none",
                  letterSpacing: "0.05em",
                }}
              >
                {pillar.shortLabel}
              </text>
            </g>
          );
        })}

        {/* ── Central core ── */}
        {/* Outer ring */}
        <circle
          cx={cx}
          cy={cy}
          r={28 * scale}
          stroke="rgba(212,160,23,0.22)"
          strokeWidth="1"
          strokeDasharray="3 6"
          fill="none"
          style={{ animation: "core-ring-pulse 3s ease-in-out infinite" }}
        />
        {/* Middle ring */}
        <circle
          cx={cx}
          cy={cy}
          r={20 * scale}
          stroke="rgba(74,126,247,0.3)"
          strokeWidth="1"
          fill="none"
        />
        {/* Inner fill */}
        <circle cx={cx} cy={cy} r={12 * scale} fill="rgba(212,160,23,0.1)" />
        <circle cx={cx} cy={cy} r={12 * scale} fill="url(#coreGrad)" />
        {/* Pulsing center dot */}
        <circle
          cx={cx}
          cy={cy}
          r={4 * scale}
          fill="rgba(212,160,23,0.9)"
          filter="url(#glow-gold)"
          style={{ animation: "node-pulse-core 2s ease-in-out infinite" }}
        />
        {/* "SE" label */}
        <text
          x={cx}
          y={cy + 14 * scale}
          textAnchor="middle"
          fontSize={6 * scale}
          fontFamily="Geist Mono, monospace"
          fill="rgba(212,160,23,0.65)"
          style={{ userSelect: "none", letterSpacing: "0.15em" }}
        >
          SE
        </text>
      </svg>

      {/* ── Tooltip overlay ── */}
      {hoveredNode !== null &&
        (() => {
          const pos = nodes[hoveredNode];
          return (
            <NodeTooltip
              pillar={PILLARS[hoveredNode]}
              x={pos.x}
              y={pos.y}
              svgSize={svgSize}
            />
          );
        })()}
    </div>
  );
}

/* ─── Canvas Particle Flow ─────────────────────────────────────────────────── */
interface ParticleCanvasProps {
  active: boolean;
}

function ParticleCanvas({ active }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }, []);

  useEffect(() => {
    resize();
    const ro = new ResizeObserver(resize);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [resize]);

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const FRAME_MS = 1000 / 30;
    const MAX_PARTICLES = 40;
    const SPAWN_INTERVAL = 800;

    const draw = (now: number) => {
      if (document.hidden) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      if (now - lastFrameRef.current < FRAME_MS) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      lastFrameRef.current = now;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Lane positions (3 horizontal lanes at 35%, 50%, 65% of height)
      const laneY = [h * 0.35, h * 0.5, h * 0.65];

      // Draw faint guide lines
      for (const ly of laneY) {
        ctx.beginPath();
        ctx.moveTo(0, ly);
        ctx.lineTo(w, ly);
        ctx.strokeStyle = "rgba(74,126,247,0.04)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Spawn new particle
      if (
        now - lastSpawnRef.current > SPAWN_INTERVAL &&
        particlesRef.current.length < MAX_PARTICLES
      ) {
        const lane = Math.floor(Math.random() * 3);
        const dir = lane % 2 === 0 ? "ltr" : "rtl";
        particlesRef.current.push({
          x: dir === "ltr" ? -4 : w + 4,
          y: laneY[lane],
          progress: 0,
          lane,
          opacity: 0.7,
          speed: 0.0008 + Math.random() * 0.0006,
          direction: dir,
        });
        lastSpawnRef.current = now;
      }

      // Draw + update particles
      particlesRef.current = particlesRef.current.filter((p) => p.progress < 1);
      for (const p of particlesRef.current) {
        p.progress += p.speed;
        p.x =
          p.direction === "ltr"
            ? p.progress * (w + 8) - 4
            : (1 - p.progress) * (w + 8) - 4;

        // Fade in/out
        const fade =
          p.progress < 0.1
            ? p.progress / 0.1
            : p.progress > 0.9
              ? (1 - p.progress) / 0.1
              : 1;
        const alpha = p.opacity * fade;

        // Gold for ltr (revenue→impact), blue for rtl
        const color =
          p.direction === "ltr"
            ? `rgba(212,160,23,${(alpha * 0.65).toFixed(2)})`
            : `rgba(74,126,247,${(alpha * 0.55).toFixed(2)})`;

        // Draw particle with trail
        const trailLen = 18;
        const dx = p.direction === "ltr" ? -trailLen : trailLen;

        const grad = ctx.createLinearGradient(p.x + dx, p.y, p.x, p.y);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(1, color);

        ctx.beginPath();
        ctx.moveTo(p.x + dx, p.y);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    const handleVisibility = () => {
      if (!document.hidden) {
        lastFrameRef.current = performance.now();
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [active]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────────── */
export default function EnterpriseEngine() {
  const sectionRef = useRef<HTMLElement>(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [hoveredImpact, setHoveredImpact] = useState<number | null>(null);
  const [hoveredRevenue, setHoveredRevenue] = useState<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [flowActive, setFlowActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Scroll activation
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setAnimationStep(1), 0);
          setTimeout(() => setAnimationStep(2), 300);
          setTimeout(() => setAnimationStep(3), 700);
          setTimeout(() => {
            setAnimationStep(4);
            setFlowActive(true);
          }, 1200);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Compute highlighted pillars
  const highlightedPillars: number[] = (() => {
    if (hoveredNode !== null) return [hoveredNode];
    if (hoveredImpact !== null) return IMPACT_DOMAINS[hoveredImpact].pillars;
    if (hoveredRevenue !== null) return REVENUE_STREAMS[hoveredRevenue].pillars;
    return [];
  })();

  const svgSize = isMobile ? SVG_SIZE_MOB : SVG_SIZE_DESK;

  return (
    <>
      <style>{ENGINE_STYLES}</style>

      <section
        ref={sectionRef}
        data-ocid="enterprise.section"
        id="mission"
        className="relative py-28 px-6 overflow-hidden"
        style={{ background: "#04050e" }}
      >
        {/* ── Canvas particle flow (behind everything) ── */}
        <ParticleCanvas active={flowActive} />

        {/* ── Ambient background layers ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(74,126,247,0.04) 0%, transparent 65%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(74,126,247,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(74,126,247,0.025) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* ── Scan line sweep over section ── */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, rgba(74,126,247,0.15), rgba(212,160,23,0.1), transparent)",
            animation: "scan-sweep 8s ease-in-out infinite",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        <div className="max-w-7xl mx-auto relative" style={{ zIndex: 3 }}>
          {/* ── Section Header ── */}
          <div className="mb-16">
            <div
              className="font-mono-geist text-xs tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ ENTERPRISE ARCHITECTURE
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              STEMONEF Enterprise Engine
            </h2>
            <p
              className="mt-3 text-sm"
              style={{
                color: "rgba(255,255,255,0.4)",
                fontFamily: "Sora, sans-serif",
                maxWidth: "500px",
                lineHeight: "1.75",
              }}
            >
              The operational architecture of a self-sustaining enterprise —
              where intelligence, impact, and innovation form a closed loop.
            </p>
          </div>

          {/* ── Main Three-Column Layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 items-center">
            {/* ── LEFT: Impact Architecture ── */}
            <div
              className="lg:col-span-2 p-7 rounded-sm relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderLeft: "2px solid rgba(52,211,153,0.4)",
                opacity: animationStep >= 1 ? 1 : 0,
                transform:
                  animationStep >= 1 ? "translateX(0)" : "translateX(-20px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
              }}
            >
              {/* Card scan line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(52,211,153,0.4), transparent)",
                  animation: "scan-sweep 6s ease-in-out 0.5s infinite",
                }}
              />

              {/* Header */}
              <div
                className="font-mono-geist text-[9px] tracking-[0.4em] uppercase mb-1"
                style={{ color: "rgba(52,211,153,0.85)" }}
              >
                IMPACT ARCHITECTURE
              </div>
              <div
                className="font-mono-geist text-[8px] tracking-[0.2em] mb-5"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                ── HUMANITARIAN & ENVIRONMENTAL SYSTEMS
              </div>

              {/* Impact domain rows */}
              <div className="space-y-1">
                {IMPACT_DOMAINS.map((domain, i) => (
                  <div
                    key={domain.label}
                    data-ocid={`enterprise.impact.item.${i + 1}`}
                    onMouseEnter={() => setHoveredImpact(i)}
                    onMouseLeave={() => setHoveredImpact(null)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 10px",
                      borderRadius: "1px",
                      cursor: "pointer",
                      borderLeft:
                        hoveredImpact === i
                          ? `2px solid ${domain.color}`
                          : "2px solid transparent",
                      background:
                        hoveredImpact === i
                          ? "rgba(52,211,153,0.06)"
                          : "transparent",
                      transition: "all 0.2s ease",
                      position: "relative",
                    }}
                  >
                    {/* Color dot */}
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: domain.color,
                        flexShrink: 0,
                        boxShadow:
                          hoveredImpact === i
                            ? `0 0 8px ${domain.color}`
                            : "none",
                        transition: "box-shadow 0.2s ease",
                      }}
                    />
                    {/* Label */}
                    <span
                      style={{
                        fontFamily: "Sora, sans-serif",
                        fontSize: "12px",
                        color:
                          hoveredImpact === i
                            ? "rgba(255,255,255,0.9)"
                            : "rgba(255,255,255,0.6)",
                        flex: 1,
                        transition: "color 0.2s ease",
                      }}
                    >
                      {domain.label}
                    </span>
                    {/* Hover arrow */}
                    <span
                      style={{
                        fontFamily: "Geist Mono, monospace",
                        fontSize: "10px",
                        color: domain.color,
                        opacity: hoveredImpact === i ? 1 : 0,
                        transform:
                          hoveredImpact === i
                            ? "translateX(0)"
                            : "translateX(-6px)",
                        transition: "opacity 0.2s ease, transform 0.2s ease",
                      }}
                    >
                      →
                    </span>
                    {/* Hover pillar tags */}
                    {hoveredImpact === i && (
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: "50%",
                          transform: "translate(calc(100% + 8px), -50%)",
                          display: "flex",
                          gap: 4,
                          zIndex: 10,
                          pointerEvents: "none",
                        }}
                      >
                        {domain.pillars.map((pi) => (
                          <span
                            key={pi}
                            style={{
                              fontFamily: "Geist Mono, monospace",
                              fontSize: "8px",
                              color: "rgba(74,126,247,0.85)",
                              background: "rgba(74,126,247,0.1)",
                              border: "1px solid rgba(74,126,247,0.3)",
                              padding: "2px 5px",
                              borderRadius: "1px",
                              letterSpacing: "0.1em",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {PILLARS[pi].shortLabel}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Stats footer */}
              <div
                style={{
                  marginTop: "18px",
                  paddingTop: "14px",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="font-mono-geist text-[8px] tracking-[0.3em] uppercase mb-3"
                  style={{ color: "rgba(52,211,153,0.6)" }}
                >
                  ACTIVE IMPACT PATHWAYS{" "}
                  <span
                    style={{
                      color: "rgba(212,160,23,0.8)",
                      fontWeight: 700,
                      fontSize: "10px",
                    }}
                  >
                    05
                  </span>
                </div>
                {[
                  ["REACH", "127 countries active"],
                  ["BENEFICIARIES", "2.4M+ engaged"],
                  ["PARTNERS", "89 institutional nodes"],
                ].map(([key, val]) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "3px 0",
                    }}
                  >
                    <span
                      className="font-mono-geist"
                      style={{
                        fontSize: "8px",
                        color: "rgba(255,255,255,0.3)",
                        letterSpacing: "0.15em",
                      }}
                    >
                      {key}
                    </span>
                    <span
                      className="font-mono-geist"
                      style={{
                        fontSize: "9px",
                        color: "rgba(255,255,255,0.55)",
                      }}
                    >
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── CENTER: Engine SVG ── */}
            <div
              className="lg:col-span-3 flex flex-col items-center justify-center"
              style={{ position: "relative" }}
            >
              {/* Status badge above */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 16,
                  opacity: animationStep >= 3 ? 1 : 0,
                  transition: "opacity 0.5s ease 0.3s",
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "rgba(52,211,153,0.9)",
                    boxShadow: "0 0 8px rgba(52,211,153,0.7)",
                    animation: "node-pulse-ring 2s ease-in-out infinite",
                    display: "inline-block",
                  }}
                />
                <span
                  className="font-mono-geist"
                  style={{
                    fontSize: "8px",
                    color: "rgba(52,211,153,0.7)",
                    letterSpacing: "0.25em",
                  }}
                >
                  SYSTEM OPERATIONAL
                </span>
              </div>

              <EngineSVG
                highlightedPillars={highlightedPillars}
                hoveredNode={hoveredNode}
                onNodeHover={setHoveredNode}
                svgSize={svgSize}
                visible={animationStep >= 3}
              />

              {/* Cycle labels below engine */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 16,
                  opacity: animationStep >= 4 ? 1 : 0,
                  transition: "opacity 0.5s ease",
                }}
              >
                {(
                  [
                    { label: "IMPACT", pos: 0 },
                    { label: "→", pos: 1 },
                    { label: "RESEARCH", pos: 2 },
                    { label: "→", pos: 3 },
                    { label: "REVENUE", pos: 4 },
                    { label: "→", pos: 5 },
                    { label: "REINVEST", pos: 6 },
                  ] as { label: string; pos: number }[]
                ).map(({ label, pos }) => (
                  <span
                    key={`cycle-${pos}`}
                    className="font-mono-geist"
                    style={{
                      fontSize: "7px",
                      color:
                        label === "→"
                          ? "rgba(74,126,247,0.4)"
                          : pos === 0
                            ? "rgba(52,211,153,0.6)"
                            : pos === 6
                              ? "rgba(52,211,153,0.6)"
                              : pos === 4
                                ? "rgba(212,160,23,0.6)"
                                : "rgba(255,255,255,0.35)",
                      letterSpacing: "0.2em",
                      animationDelay: `${pos * 0.15}s`,
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Revenue Engine ── */}
            <div
              className="lg:col-span-2 p-7 rounded-sm relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRight: "2px solid rgba(74,126,247,0.4)",
                opacity: animationStep >= 2 ? 1 : 0,
                transform:
                  animationStep >= 2 ? "translateX(0)" : "translateX(20px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
              }}
            >
              {/* Card scan line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(74,126,247,0.4), transparent)",
                  animation: "scan-sweep 7s ease-in-out 1.5s infinite",
                }}
              />

              {/* Header */}
              <div
                className="font-mono-geist text-[9px] tracking-[0.4em] uppercase mb-1"
                style={{ color: "rgba(74,126,247,0.85)" }}
              >
                REVENUE ENGINE
              </div>
              <div
                className="font-mono-geist text-[8px] tracking-[0.2em] mb-5"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                ── CAPITAL & SUSTAINABILITY SYSTEMS
              </div>

              {/* Revenue stream rows */}
              <div className="space-y-1">
                {REVENUE_STREAMS.map((stream, i) => (
                  <div
                    key={stream.label}
                    data-ocid={`enterprise.revenue.item.${i + 1}`}
                    onMouseEnter={() => setHoveredRevenue(i)}
                    onMouseLeave={() => setHoveredRevenue(null)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 10px",
                      borderRadius: "1px",
                      cursor: "pointer",
                      borderRight:
                        hoveredRevenue === i
                          ? `2px solid ${stream.color}`
                          : "2px solid transparent",
                      background:
                        hoveredRevenue === i
                          ? "rgba(74,126,247,0.06)"
                          : "transparent",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {/* Hover arrow */}
                    <span
                      style={{
                        fontFamily: "Geist Mono, monospace",
                        fontSize: "10px",
                        color: stream.color,
                        opacity: hoveredRevenue === i ? 1 : 0,
                        transform:
                          hoveredRevenue === i
                            ? "translateX(0)"
                            : "translateX(6px)",
                        transition: "opacity 0.2s ease, transform 0.2s ease",
                      }}
                    >
                      ←
                    </span>
                    {/* Label */}
                    <span
                      style={{
                        fontFamily: "Sora, sans-serif",
                        fontSize: "12px",
                        color:
                          hoveredRevenue === i
                            ? "rgba(255,255,255,0.9)"
                            : "rgba(255,255,255,0.6)",
                        flex: 1,
                        transition: "color 0.2s ease",
                      }}
                    >
                      {stream.label}
                    </span>
                    {/* Connector line */}
                    <div
                      style={{
                        flex: "0 0 24px",
                        height: 1,
                        background: `linear-gradient(90deg, transparent, ${stream.color})`,
                        opacity: hoveredRevenue === i ? 0.8 : 0.3,
                        transition: "opacity 0.2s ease",
                      }}
                    />
                    {/* Color dot */}
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: stream.color,
                        flexShrink: 0,
                        boxShadow:
                          hoveredRevenue === i
                            ? `0 0 8px ${stream.color}`
                            : "none",
                        transition: "box-shadow 0.2s ease",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Detail rows */}
              <div
                style={{
                  marginTop: "18px",
                  paddingTop: "14px",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {[
                  ["REVENUE CYCLE", "Quarterly reinvestment"],
                  ["ALLOCATION", "78% to Impact Architecture"],
                  ["GROWTH RATE", "+34% YoY"],
                  ["TRANSPARENCY", "Public audit trails"],
                ].map(([key, val]) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "3px 0",
                    }}
                  >
                    <span
                      className="font-mono-geist"
                      style={{
                        fontSize: "8px",
                        color: "rgba(255,255,255,0.3)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {key}
                    </span>
                    <span
                      className="font-mono-geist"
                      style={{
                        fontSize: "9px",
                        color: "rgba(255,255,255,0.55)",
                      }}
                    >
                      {val}
                    </span>
                  </div>
                ))}
              </div>

              {/* Sustainability Index bar */}
              <div style={{ marginTop: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <span
                    className="font-mono-geist"
                    style={{
                      fontSize: "8px",
                      color: "rgba(255,255,255,0.35)",
                      letterSpacing: "0.2em",
                    }}
                  >
                    SUSTAINABILITY INDEX
                  </span>
                  <span
                    className="font-mono-geist"
                    style={{ fontSize: "9px", color: "rgba(212,160,23,0.8)" }}
                  >
                    78%
                  </span>
                </div>
                <div
                  style={{
                    height: 3,
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "1px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: animationStep >= 4 ? "78%" : "0%",
                      background:
                        "linear-gradient(90deg, rgba(212,160,23,0.6), rgba(212,160,23,0.9))",
                      borderRadius: "1px",
                      transition:
                        "width 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
                      boxShadow: "0 0 6px rgba(212,160,23,0.4)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Tagline Block ── */}
          <div className="mt-14 text-center max-w-2xl mx-auto">
            <div
              className="font-mono-geist text-xs tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.5)" }}
            >
              THE STEMONEF ENTERPRISE ENGINE
            </div>
            <p
              className="text-sm"
              style={{
                color: "rgba(255,255,255,0.35)",
                fontFamily: "Sora, sans-serif",
                lineHeight: "1.8",
              }}
            >
              A self-sustaining system where research, intelligence, and
              innovation generate revenue that is reinvested into global
              humanitarian and environmental impact.
            </p>

            {/* Stat boxes */}
            <div className="mt-6 flex items-center justify-center gap-8">
              {[
                { label: "PILLARS", value: "7" },
                { label: "DOMAINS", value: "5" },
                { label: "REVENUE STREAMS", value: "4" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div
                    className="font-mono-geist text-xl"
                    style={{ color: "rgba(212,160,23,0.8)" }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="font-mono-geist tracking-[0.3em] uppercase mt-1"
                    style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Constitutional mandate caption */}
            <div
              className="mt-8 mx-auto"
              style={{
                maxWidth: "460px",
                padding: "12px 20px",
                border: "1px solid rgba(212,160,23,0.12)",
                background: "rgba(212,160,23,0.03)",
                borderRadius: "1px",
              }}
            >
              <p
                className="font-mono-geist"
                style={{
                  fontSize: "9px",
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.08em",
                  lineHeight: "1.7",
                }}
              >
                All revenue streams are constitutionally mandated to reinvest
                profits into STEMONEF's humanitarian and environmental impact
                architecture.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
