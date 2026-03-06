import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSubmitCollaborationRequest } from "../hooks/useQueries";

// ─── Types ────────────────────────────────────────────────────────────────────

type PathwayKey = "collaborate" | "partner" | "support";

interface Pathway {
  key: PathwayKey;
  label: string;
  icon: string;
  color: string;
  glowRgb: string;
  eyebrow: string;
  status: string;
  title: string;
  description: string;
  bullets: string[];
  flow: string[];
  primaryLabel: string;
  primaryPage: string;
  secondaryLabel: string;
  angle: number; // degrees on the orbital ring
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PATHWAYS: Pathway[] = [
  {
    key: "collaborate",
    label: "Collaborate",
    icon: "✦",
    color: "#4a7ef7",
    glowRgb: "74,126,247",
    eyebrow: "PATHWAY 01 · RESEARCH COLLABORATION",
    status: "STATUS: ACTIVE",
    title: "Collaborate",
    description:
      "Work directly with STEMONEF research, intelligence, and innovation programs. Our collaboration framework enables scientific partnerships, co-developed projects, and cross-institutional knowledge exchange.",
    bullets: [
      "Research collaboration",
      "Scientific partnerships",
      "Knowledge exchange",
      "Project co-development",
    ],
    flow: ["Interest", "Research Intake", "Active Project", "Global Impact"],
    primaryLabel: "EXPLORE EPOCHS",
    primaryPage: "epochs",
    secondaryLabel: "JOIN COLLABORATION",
    angle: 270,
  },
  {
    key: "partner",
    label: "Partner",
    icon: "◈",
    color: "#d4a017",
    glowRgb: "212,160,23",
    eyebrow: "PATHWAY 02 · INSTITUTIONAL ALLIANCE",
    status: "STATUS: ACTIVE",
    title: "Partner",
    description:
      "Organizations and institutions can align with STEMONEF to co-develop programs, research initiatives, and global impact projects. Partnership structures are built for long-term institutional alignment.",
    bullets: [
      "Institutional alliances",
      "Research partnerships",
      "Climate initiatives",
      "Strategic collaboration",
    ],
    flow: [
      "Alliance",
      "Program Development",
      "Joint Research",
      "Institutional Impact",
    ],
    primaryLabel: "EXPLORE PARTNERSHIPS",
    primaryPage: "steami",
    secondaryLabel: "BECOME A PARTNER",
    angle: 30,
  },
  {
    key: "support",
    label: "Support",
    icon: "◎",
    color: "rgba(20,210,180,0.9)",
    glowRgb: "20,210,180",
    eyebrow: "PATHWAY 03 · MISSION SUPPORT",
    status: "STATUS: OPEN",
    title: "Support",
    description:
      "Mission-aligned supporters help sustain the research, education, and humanitarian initiatives of the STEMONEF ecosystem. Support pathways are designed for philanthropic, ethical, and programmatic alignment.",
    bullets: [
      "Philanthropic contributions",
      "Ethical investment",
      "Program sponsorship",
    ],
    flow: [
      "Investment",
      "Program Funding",
      "Initiative Launch",
      "Societal Benefit",
    ],
    primaryLabel: "SUPPORT INITIATIVES",
    primaryPage: "equis",
    secondaryLabel: "EXPLORE FUNDING",
    angle: 150,
  },
];

const FORM_PATHWAYS = [
  "Research & Innovation",
  "Talent & Field Growth",
  "Intelligence & Policy",
  "Climate & Sustainability",
  "Media & Storytelling",
  "Equity & Support",
];

// ─── Collaboration Form ───────────────────────────────────────────────────────

interface CollabFormProps {
  type: "Collaborate" | "Partner";
  onClose: () => void;
}

function CollaborationForm({ type, onClose }: CollabFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pathway, setPathway] = useState("");
  const [message, setMessage] = useState("");
  const submit = useSubmitCollaborationRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !pathway || !message) {
      toast.error("Please complete all fields.");
      return;
    }
    try {
      await submit.mutateAsync({ name, email, pathway, message });
      toast.success("Request submitted. We will be in touch.");
      onClose();
    } catch {
      toast.error("Submission failed. Please try again.");
    }
  };

  const monoStyle = { fontFamily: "Geist Mono, monospace" };
  const fieldStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Sora, sans-serif",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{ color: "rgba(212,160,23,0.7)", ...monoStyle }}
        >
          Full Name
        </Label>
        <Input
          data-ocid="cta.input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="mt-1.5"
          style={fieldStyle}
          required
        />
      </div>
      <div>
        <Label
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{ color: "rgba(212,160,23,0.7)", ...monoStyle }}
        >
          Email Address
        </Label>
        <Input
          data-ocid="cta.input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="mt-1.5"
          style={fieldStyle}
          required
        />
      </div>
      <div>
        <Label
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{ color: "rgba(212,160,23,0.7)", ...monoStyle }}
        >
          Engagement Pathway
        </Label>
        <Select value={pathway} onValueChange={setPathway}>
          <SelectTrigger
            data-ocid="cta.select"
            className="mt-1.5"
            style={fieldStyle}
          >
            <SelectValue placeholder="Select pathway" />
          </SelectTrigger>
          <SelectContent
            style={{
              background: "rgba(8,10,24,0.98)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {FORM_PATHWAYS.map((p) => (
              <SelectItem
                key={p}
                value={p}
                style={{ color: "rgba(255,255,255,0.7)", ...monoStyle }}
              >
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{ color: "rgba(212,160,23,0.7)", ...monoStyle }}
        >
          Message
        </Label>
        <Textarea
          data-ocid="cta.textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your interest or proposal..."
          rows={4}
          className="mt-1.5 resize-none"
          style={fieldStyle}
          required
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          data-ocid="cta.submit_button"
          disabled={submit.isPending}
          className="flex-1 py-3 text-xs tracking-widest uppercase transition-all duration-200"
          style={{
            background: submit.isPending
              ? "rgba(212,160,23,0.05)"
              : "rgba(212,160,23,0.12)",
            border: "1px solid rgba(212,160,23,0.5)",
            color: submit.isPending ? "rgba(212,160,23,0.4)" : "#d4a017",
            ...monoStyle,
            letterSpacing: "0.2em",
            cursor: submit.isPending ? "not-allowed" : "pointer",
            borderRadius: "2px",
          }}
        >
          {submit.isPending ? "SUBMITTING..." : `SUBMIT ${type.toUpperCase()}`}
        </button>
        <button
          type="button"
          data-ocid="cta.cancel_button"
          onClick={onClose}
          className="px-6 py-3 text-xs tracking-widest uppercase transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.5)",
            ...monoStyle,
            letterSpacing: "0.15em",
            cursor: "pointer",
            borderRadius: "2px",
          }}
        >
          CANCEL
        </button>
      </div>
    </form>
  );
}

// ─── Particle Canvas ──────────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  colorIndex: number;
  colorPhase: number;
}

const PARTICLE_COLORS = [
  [74, 126, 247],
  [212, 160, 23],
  [20, 210, 180],
];

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Init particles
    particlesRef.current = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: 1 + Math.random() * 2,
      opacity: 0.2 + Math.random() * 0.2,
      colorIndex: Math.floor(Math.random() * PARTICLE_COLORS.length),
      colorPhase: Math.random() * Math.PI * 2,
    }));

    const draw = (timestamp: number) => {
      if (document.hidden) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }
      const elapsed = timestamp - lastFrameRef.current;
      if (elapsed < 33) {
        // 30 FPS cap
        animRef.current = requestAnimationFrame(draw);
        return;
      }
      lastFrameRef.current = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.colorPhase += 0.005;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const [r, g, b] = PARTICLE_COLORS[p.colorIndex];
        const alpha = p.opacity * (0.7 + 0.3 * Math.sin(p.colorPhase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

// ─── Orbital SVG Engine ───────────────────────────────────────────────────────

interface OrbitalEngineProps {
  activePathway: PathwayKey | null;
  lockedPathway: PathwayKey | null;
  onHover: (key: PathwayKey | null) => void;
  onNodeClick: (key: PathwayKey) => void;
  animStep: number;
}

function OrbitalEngine({
  activePathway,
  lockedPathway,
  onHover,
  onNodeClick,
  animStep,
}: OrbitalEngineProps) {
  const cx = 260;
  const cy = 260;
  const R = 160; // orbital ring radius
  const innerR = 100;
  const size = 520;

  const highlighted = lockedPathway ?? activePathway;

  const TICK_ANGLES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => ({
    id: `tick-pos-${i}`,
    angle: (i / 12) * Math.PI * 2 - Math.PI / 2,
  }));
  const RADIAL_ANGLES = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({
    id: `radial-pos-${i}`,
    angle: (i / 8) * Math.PI * 2,
  }));

  return (
    <div
      className="relative mx-auto select-none"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: "visible" }}
        aria-label="STEMONEF Engagement Gateway orbital diagram"
        role="img"
      >
        <defs>
          {/* Glow filters */}
          {PATHWAYS.map((p) => (
            <filter
              key={p.key}
              id={`glow-${p.key}`}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
          <filter id="glow-center" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-gold" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(212,160,23,0.25)" />
            <stop offset="100%" stopColor="rgba(4,5,14,0.0)" />
          </radialGradient>
        </defs>

        {/* Ambient glow behind engine */}
        <circle
          cx={cx}
          cy={cy}
          r={220}
          fill="url(#centerGrad)"
          opacity={animStep >= 1 ? 1 : 0}
          style={{ transition: "opacity 0.8s ease" }}
        />

        {/* Outer dashed ring — slow rotation via CSS */}
        <circle
          cx={cx}
          cy={cy}
          r={R + 30}
          fill="none"
          stroke="rgba(212,160,23,0.2)"
          strokeWidth="1"
          strokeDasharray="4 8"
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            animation: "spin-cw 40s linear infinite",
            opacity: animStep >= 2 ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        />

        {/* Inner counter-rotating dashed ring */}
        <circle
          cx={cx}
          cy={cy}
          r={R - 20}
          fill="none"
          stroke="rgba(74,126,247,0.15)"
          strokeWidth="1"
          strokeDasharray="3 12"
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            animation: "spin-ccw 30s linear infinite",
            opacity: animStep >= 2 ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        />

        {/* Main orbital ring */}
        <circle
          cx={cx}
          cy={cy}
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="1.5"
          opacity={animStep >= 2 ? 1 : 0}
          style={{ transition: "opacity 0.6s ease" }}
        />

        {/* Gold tick marks at 12 positions */}
        {TICK_ANGLES.map(({ id, angle }) => {
          const inner = R - 8;
          const outer = R + 8;
          return (
            <line
              key={id}
              x1={cx + Math.cos(angle) * inner}
              y1={cy + Math.sin(angle) * inner}
              x2={cx + Math.cos(angle) * outer}
              y2={cy + Math.sin(angle) * outer}
              stroke="rgba(212,160,23,0.4)"
              strokeWidth="1.5"
              opacity={animStep >= 2 ? 1 : 0}
              style={{ transition: "opacity 0.6s ease" }}
            />
          );
        })}

        {/* Connector lines from center to each node */}
        {PATHWAYS.map((p) => {
          const angle = (p.angle - 90) * (Math.PI / 180);
          const nx = cx + Math.cos(angle) * R;
          const ny = cy + Math.sin(angle) * R;
          const isActive = highlighted === p.key;
          return (
            <line
              key={p.key}
              x1={cx}
              y1={cy}
              x2={nx}
              y2={ny}
              stroke={isActive ? p.color : "rgba(255,255,255,0.06)"}
              strokeWidth={isActive ? 1.5 : 1}
              strokeDasharray={isActive ? "none" : "4 6"}
              opacity={animStep >= 2 ? 1 : 0}
              style={{ transition: "all 0.4s ease, opacity 0.6s ease" }}
            />
          );
        })}

        {/* Radial signal lines from core — gold accent */}
        {RADIAL_ANGLES.map(({ id, angle }) => {
          const r1 = 42;
          const r2 = innerR - 10;
          return (
            <line
              key={id}
              x1={cx + Math.cos(angle) * r1}
              y1={cy + Math.sin(angle) * r1}
              x2={cx + Math.cos(angle) * r2}
              y2={cy + Math.sin(angle) * r2}
              stroke="rgba(212,160,23,0.2)"
              strokeWidth="1"
              opacity={animStep >= 1 ? 1 : 0}
              style={{ transition: "opacity 0.8s ease" }}
            />
          );
        })}

        {/* Center glow circle */}
        <circle
          cx={cx}
          cy={cy}
          r={innerR}
          fill="rgba(4,5,14,0.9)"
          stroke="rgba(212,160,23,0.35)"
          strokeWidth="1.5"
          filter="url(#glow-center)"
          opacity={animStep >= 1 ? 1 : 0}
          style={{
            transition: "opacity 0.6s ease",
            transform: animStep >= 1 ? "scale(1)" : "scale(0.3)",
            transformOrigin: `${cx}px ${cy}px`,
          }}
        />
        <circle
          cx={cx}
          cy={cy}
          r={innerR - 12}
          fill="none"
          stroke="rgba(212,160,23,0.15)"
          strokeWidth="1"
          strokeDasharray="3 6"
          opacity={animStep >= 1 ? 1 : 0}
          style={{
            transition: "opacity 0.5s ease",
            transformOrigin: `${cx}px ${cy}px`,
            animation: "spin-cw 20s linear infinite",
          }}
        />
        {/* Pulsing center rings */}
        <circle
          cx={cx}
          cy={cy}
          r={innerR - 5}
          fill="none"
          stroke="rgba(212,160,23,0.2)"
          strokeWidth="1"
          opacity={animStep >= 1 ? 1 : 0}
          style={{
            transition: "opacity 0.5s ease",
            animation: "pulse-ring 2.5s ease-out infinite",
          }}
        />

        {/* Center SE monogram */}
        {animStep >= 1 && (
          <>
            <text
              x={cx}
              y={cy - 14}
              textAnchor="middle"
              fill="#d4a017"
              fontSize="22"
              fontFamily="Fraunces, serif"
              fontWeight="300"
              letterSpacing="4"
            >
              SE
            </text>
            <text
              x={cx}
              y={cy + 6}
              textAnchor="middle"
              fill="rgba(255,255,255,0.6)"
              fontSize="7"
              fontFamily="Geist Mono, monospace"
              letterSpacing="3"
            >
              STEMONEF
            </text>
            <text
              x={cx}
              y={cy + 20}
              textAnchor="middle"
              fill="rgba(212,160,23,0.5)"
              fontSize="6"
              fontFamily="Geist Mono, monospace"
              letterSpacing="2"
            >
              ENGAGEMENT CORE
            </text>
          </>
        )}

        {/* Pathway nodes */}
        {PATHWAYS.map((p, i) => {
          const angle = (p.angle - 90) * (Math.PI / 180);
          const nx = cx + Math.cos(angle) * R;
          const ny = cy + Math.sin(angle) * R;
          const isActive = highlighted === p.key;
          const delay = 0.1 * i;

          // Parse color to rgb for glow
          const nodeStyle = {
            transform:
              animStep >= 3
                ? `translate(${nx}px, ${ny}px)`
                : `translate(${cx}px, ${cy}px)`,
            transformOrigin: "0px 0px",
            transition: `transform 0.6s cubic-bezier(0.34,1.56,0.64,1) ${delay}s, opacity 0.4s ease ${delay}s`,
            opacity: animStep >= 3 ? 1 : 0,
          };

          return (
            <g
              key={p.key}
              style={nodeStyle}
              onMouseEnter={() => onHover(p.key)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onNodeClick(p.key)}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && onNodeClick(p.key)
              }
              tabIndex={0}
              aria-label={`${p.label} pathway`}
              cursor="pointer"
            >
              {/* Outer glow ring */}
              <circle
                r={isActive ? 34 : 28}
                fill="none"
                stroke={p.color}
                strokeWidth={isActive ? 2 : 1}
                opacity={isActive ? 0.6 : 0.2}
                style={{ transition: "all 0.3s ease" }}
                filter={isActive ? `url(#glow-${p.key})` : undefined}
              />
              {/* Rotating dashed ring around node */}
              <circle
                r={isActive ? 40 : 34}
                fill="none"
                stroke={p.color}
                strokeWidth="1"
                strokeDasharray="3 8"
                opacity={isActive ? 0.4 : 0.1}
                style={{
                  transition: "all 0.3s ease",
                  transformOrigin: "0px 0px",
                  animation: `spin-${i % 2 === 0 ? "cw" : "ccw"} ${15 + i * 3}s linear infinite`,
                }}
              />
              {/* Inner fill circle */}
              <circle
                r={22}
                fill={isActive ? `rgba(${p.glowRgb},0.15)` : "rgba(4,5,14,0.9)"}
                stroke={p.color}
                strokeWidth={isActive ? 1.5 : 1}
                opacity={isActive ? 1 : 0.7}
                style={{ transition: "all 0.3s ease" }}
              />
              {/* Icon */}
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fill={p.color}
                fontSize={isActive ? "18" : "15"}
                fontFamily="monospace"
                opacity={isActive ? 1 : 0.8}
                style={{ transition: "all 0.3s ease" }}
              >
                {p.icon}
              </text>
              {/* Label below */}
              <text
                y={34}
                textAnchor="middle"
                fill={isActive ? p.color : "rgba(255,255,255,0.6)"}
                fontSize="8"
                fontFamily="Geist Mono, monospace"
                letterSpacing="2"
                style={{ transition: "fill 0.3s ease" }}
              >
                {p.label.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>

      {/* CSS keyframes injected inline */}
      <style>{`
        @keyframes spin-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-ccw {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes pulse-ring {
          0% { r: 70; opacity: 0.4; }
          100% { r: 120; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Pathway Detail Panel ─────────────────────────────────────────────────────

interface PathwayPanelProps {
  pathway: Pathway;
  onNavigate?: (page: string) => void;
  onOpenForm: (type: "Collaborate" | "Partner") => void;
}

function PathwayPanel({
  pathway: p,
  onNavigate,
  onOpenForm,
}: PathwayPanelProps) {
  const monoStyle = { fontFamily: "Geist Mono, monospace" };
  const sora = { fontFamily: "Sora, sans-serif" };

  return (
    <div
      data-ocid={`cta.${p.key}_panel`}
      className="rounded-sm overflow-hidden"
      style={{
        border: `1px solid rgba(${p.glowRgb},0.35)`,
        background: "rgba(4,5,14,0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: `0 0 60px rgba(${p.glowRgb},0.08), 0 24px 64px rgba(0,0,0,0.7)`,
      }}
    >
      {/* Top bar */}
      <div
        className="h-px w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${p.color}, transparent)`,
        }}
      />

      <div className="p-8">
        {/* Eyebrow + status */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <span
            className="text-[9px] tracking-[0.35em] uppercase"
            style={{ color: `rgba(${p.glowRgb},0.7)`, ...monoStyle }}
          >
            {p.eyebrow}
          </span>
          <span
            className="px-3 py-1 text-[8px] tracking-[0.25em] uppercase rounded-sm"
            style={{
              border: `1px solid rgba(${p.glowRgb},0.4)`,
              color: p.color,
              background: `rgba(${p.glowRgb},0.07)`,
              ...monoStyle,
            }}
          >
            {p.status}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-display font-light mb-4"
          style={{
            fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.92)",
          }}
        >
          {p.title}
        </h3>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: "rgba(255,255,255,0.55)", ...sora }}
        >
          {p.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Bullets */}
          <div>
            <div
              className="text-[9px] tracking-[0.3em] uppercase mb-3"
              style={{ color: `rgba(${p.glowRgb},0.6)`, ...monoStyle }}
            >
              ENGAGEMENT AREAS
            </div>
            <ul className="space-y-2">
              {p.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-xs"
                  style={{ color: "rgba(255,255,255,0.65)", ...sora }}
                >
                  <span style={{ color: p.color, marginTop: "2px" }}>▸</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Flow diagram */}
          <div>
            <div
              className="text-[9px] tracking-[0.3em] uppercase mb-3"
              style={{ color: `rgba(${p.glowRgb},0.6)`, ...monoStyle }}
            >
              CONTRIBUTION FLOW
            </div>
            <div className="flex flex-col gap-1.5">
              {p.flow.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 flex items-center justify-center text-[8px] rounded-sm flex-shrink-0"
                    style={{
                      background: `rgba(${p.glowRgb},0.12)`,
                      border: `1px solid rgba(${p.glowRgb},0.3)`,
                      color: p.color,
                      ...monoStyle,
                    }}
                  >
                    {i + 1}
                  </div>
                  <span
                    className="text-[10px]"
                    style={{ color: "rgba(255,255,255,0.6)", ...monoStyle }}
                  >
                    {step}
                  </span>
                  {i < p.flow.length - 1 && (
                    <span
                      style={{
                        color: `rgba(${p.glowRgb},0.4)`,
                        ...monoStyle,
                        fontSize: "8px",
                      }}
                    >
                      ↓
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            data-ocid={`cta.${p.key}_primary_button`}
            onClick={() => onNavigate?.(p.primaryPage)}
            className="flex-1 py-3 text-xs tracking-widest uppercase transition-all duration-200"
            style={{
              background: `rgba(${p.glowRgb},0.12)`,
              border: `1px solid rgba(${p.glowRgb},0.5)`,
              color: p.color,
              ...monoStyle,
              letterSpacing: "0.2em",
              cursor: "pointer",
              borderRadius: "2px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                `rgba(${p.glowRgb},0.2)`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                `rgba(${p.glowRgb},0.12)`;
            }}
          >
            {p.primaryLabel}
          </button>
          <button
            type="button"
            data-ocid={`cta.${p.key}_secondary_button`}
            onClick={() => {
              if (p.key === "collaborate") onOpenForm("Collaborate");
              else if (p.key === "partner") onOpenForm("Partner");
              else onNavigate?.(p.primaryPage);
            }}
            className="flex-1 py-3 text-xs tracking-widest uppercase transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.65)",
              ...monoStyle,
              letterSpacing: "0.15em",
              cursor: "pointer",
              borderRadius: "2px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(255,255,255,0.9)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.04)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(255,255,255,0.65)";
            }}
          >
            {p.secondaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile Card ──────────────────────────────────────────────────────────────

interface MobileCardProps {
  pathway: Pathway;
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate?: (page: string) => void;
  onOpenForm: (type: "Collaborate" | "Partner") => void;
}

function MobileCard({
  pathway: p,
  isExpanded,
  onToggle,
  onNavigate,
  onOpenForm,
}: MobileCardProps) {
  const monoStyle = { fontFamily: "Geist Mono, monospace" };
  const sora = { fontFamily: "Sora, sans-serif" };

  return (
    <div
      className="rounded-sm overflow-hidden transition-all duration-300"
      style={{
        border: `1px solid rgba(${p.glowRgb},${isExpanded ? 0.4 : 0.2})`,
        background: isExpanded ? "rgba(4,5,14,0.92)" : "rgba(4,5,14,0.7)",
        borderLeft: `3px solid ${p.color}`,
        boxShadow: isExpanded ? `0 0 40px rgba(${p.glowRgb},0.08)` : "none",
      }}
    >
      {/* Header row */}
      <button
        type="button"
        className="w-full flex items-center justify-between p-5 text-left"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <span className="text-xl" style={{ color: p.color }}>
            {p.icon}
          </span>
          <div>
            <div
              className="text-sm font-medium"
              style={{
                color: "rgba(255,255,255,0.9)",
                ...monoStyle,
                letterSpacing: "0.15em",
              }}
            >
              {p.label.toUpperCase()}
            </div>
            <div
              className="text-[8px] tracking-[0.2em] mt-0.5"
              style={{ color: `rgba(${p.glowRgb},0.6)`, ...monoStyle }}
            >
              {p.eyebrow}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="hidden sm:block px-2 py-0.5 text-[7px] tracking-widest uppercase rounded-sm"
            style={{
              border: `1px solid rgba(${p.glowRgb},0.4)`,
              color: p.color,
              ...monoStyle,
            }}
          >
            {p.status.replace("STATUS: ", "")}
          </span>
          <span
            className="text-xs transition-transform duration-300"
            style={{
              color: `rgba(${p.glowRgb},0.7)`,
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▼
          </span>
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-5 pb-5">
          <div
            className="h-px mb-5"
            style={{
              background: `linear-gradient(90deg, ${p.color}, transparent)`,
              opacity: 0.3,
            }}
          />
          <p
            className="text-xs leading-relaxed mb-5"
            style={{ color: "rgba(255,255,255,0.55)", ...sora }}
          >
            {p.description}
          </p>
          <ul className="space-y-1.5 mb-5">
            {p.bullets.map((b) => (
              <li
                key={b}
                className="flex items-center gap-2 text-xs"
                style={{ color: "rgba(255,255,255,0.6)", ...sora }}
              >
                <span style={{ color: p.color }}>▸</span>
                {b}
              </li>
            ))}
          </ul>
          {/* Flow */}
          <div className="flex flex-wrap gap-1.5 items-center mb-5">
            {p.flow.map((step, i) => (
              <span key={step} className="flex items-center gap-1.5">
                <span
                  className="px-2 py-0.5 text-[8px] tracking-wide rounded-sm"
                  style={{
                    background: `rgba(${p.glowRgb},0.08)`,
                    border: `1px solid rgba(${p.glowRgb},0.2)`,
                    color: "rgba(255,255,255,0.6)",
                    ...monoStyle,
                  }}
                >
                  {step}
                </span>
                {i < p.flow.length - 1 && (
                  <span
                    style={{ color: `rgba(${p.glowRgb},0.5)`, fontSize: "8px" }}
                  >
                    →
                  </span>
                )}
              </span>
            ))}
          </div>
          {/* CTAs */}
          <div className="flex gap-2">
            <button
              type="button"
              data-ocid={`cta.${p.key}_primary_button`}
              onClick={() => onNavigate?.(p.primaryPage)}
              className="flex-1 py-2.5 text-[9px] tracking-widest uppercase transition-all duration-200"
              style={{
                background: `rgba(${p.glowRgb},0.1)`,
                border: `1px solid rgba(${p.glowRgb},0.45)`,
                color: p.color,
                ...monoStyle,
                cursor: "pointer",
                borderRadius: "2px",
              }}
            >
              {p.primaryLabel}
            </button>
            <button
              type="button"
              data-ocid={`cta.${p.key}_secondary_button`}
              onClick={() => {
                if (p.key === "collaborate") onOpenForm("Collaborate");
                else if (p.key === "partner") onOpenForm("Partner");
                else onNavigate?.(p.primaryPage);
              }}
              className="flex-1 py-2.5 text-[9px] tracking-widest uppercase transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.55)",
                ...monoStyle,
                cursor: "pointer",
                borderRadius: "2px",
              }}
            >
              {p.secondaryLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Engagement Flow Bar ──────────────────────────────────────────────────────

function EngagementFlowBar() {
  const monoStyle = { fontFamily: "Geist Mono, monospace" };
  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
      {PATHWAYS.map((p) => (
        <div
          key={p.key}
          className="p-4 rounded-sm"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: `1px solid rgba(${p.glowRgb},0.15)`,
            borderLeft: `2px solid rgba(${p.glowRgb},0.5)`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span style={{ color: p.color, fontSize: "12px" }}>{p.icon}</span>
            <span
              className="text-[9px] tracking-[0.25em] uppercase"
              style={{ color: p.color, ...monoStyle }}
            >
              {p.label}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 items-center">
            {p.flow.map((step, i) => (
              <span key={step} className="flex items-center gap-1">
                <span
                  className="text-[8px]"
                  style={{ color: "rgba(255,255,255,0.45)", ...monoStyle }}
                >
                  {step}
                </span>
                {i < p.flow.length - 1 && (
                  <span
                    style={{
                      color: `rgba(${p.glowRgb},0.5)`,
                      fontSize: "7px",
                      ...monoStyle,
                    }}
                  >
                    →
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface CTASectionProps {
  onNavigate?: (page: string) => void;
}

export default function CTASection({ onNavigate }: CTASectionProps) {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll activation state machine
  const [animStep, setAnimStep] = useState(0);
  const [interactionUnlocked, setInteractionUnlocked] = useState(false);
  const activatedRef = useRef(false);

  // Pathway interaction state
  const [hoveredPathway, setHoveredPathway] = useState<PathwayKey | null>(null);
  const [lockedPathway, setLockedPathway] = useState<PathwayKey | null>(null);
  const [expandedMobileCard, setExpandedMobileCard] =
    useState<PathwayKey | null>(null);

  // Form / dialog state
  const [modalType, setModalType] = useState<"Collaborate" | "Partner" | null>(
    null,
  );

  // Active pathway (locked takes priority over hovered)
  const activePathway = lockedPathway ?? hoveredPathway;

  // Find active pathway data
  const activePathwayData =
    PATHWAYS.find((p) => p.key === activePathway) ?? null;

  // Intersection observer for scroll activation
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !activatedRef.current) {
          activatedRef.current = true;
          // Step 0 immediate
          setAnimStep(0);
          setTimeout(() => setAnimStep(1), 200);
          setTimeout(() => setAnimStep(2), 600);
          setTimeout(() => setAnimStep(3), 900);
          setTimeout(() => {
            setAnimStep(4);
            setInteractionUnlocked(true);
          }, 1400);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Node click handler: toggle lock
  const handleNodeClick = (key: PathwayKey) => {
    if (!interactionUnlocked) return;
    setLockedPathway((prev) => (prev === key ? null : key));
  };

  const handleHover = (key: PathwayKey | null) => {
    if (!interactionUnlocked) return;
    setHoveredPathway(key);
  };

  const monoStyle = { fontFamily: "Geist Mono, monospace" };
  const soraStyle = { fontFamily: "Sora, sans-serif" };

  return (
    <section
      ref={sectionRef}
      data-ocid="cta.section"
      id="cta"
      className="relative py-28 px-6 overflow-hidden"
    >
      {/* Backgrounds */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(4,5,14,0.9)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(74,126,247,0.04) 0%, transparent 65%), radial-gradient(ellipse 40% 40% at 80% 20%, rgba(212,160,23,0.03) 0%, transparent 60%)",
        }}
      />
      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(74,126,247,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(74,126,247,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.5,
        }}
      />

      {/* Particle canvas (desktop only) */}
      {!isMobile && <ParticleCanvas />}

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section intro */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-3 text-[9px] tracking-[0.4em] uppercase mb-6 px-4 py-2 rounded-sm"
            style={{
              color: "rgba(212,160,23,0.8)",
              border: "1px solid rgba(212,160,23,0.2)",
              background: "rgba(212,160,23,0.04)",
              ...monoStyle,
            }}
          >
            <span>◆</span>
            <span>ENGAGEMENT GATEWAY</span>
            <span>◆</span>
          </div>

          <h2
            className="font-display font-light mb-6"
            style={{
              fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
              letterSpacing: "0.08em",
              lineHeight: 1.05,
            }}
          >
            <span
              style={{
                background:
                  "linear-gradient(135deg, #fff 0%, rgba(74,126,247,0.9) 40%, rgba(212,160,23,0.95) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Build the Future
            </span>
            <br />
            <span
              style={{
                color: "rgba(255,255,255,0.45)",
                letterSpacing: "0.12em",
              }}
            >
              With Us.
            </span>
          </h2>

          <p
            className="max-w-2xl mx-auto text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.45)", ...soraStyle }}
          >
            STEMONEF advances science, intelligence, and human progress through
            global collaboration. Institutions, researchers, innovators, and
            mission-aligned partners can participate through structured
            engagement pathways.{" "}
            <span style={{ color: "rgba(255,255,255,0.6)" }}>
              Select how you want to shape the future.
            </span>
          </p>
        </div>

        {/* ── Desktop: Orbital Engine + Panel ── */}
        {!isMobile && (
          <>
            {/* System status bar */}
            <div
              className="flex items-center justify-center gap-6 mb-10 text-[8px] tracking-[0.3em] uppercase"
              style={{ color: "rgba(255,255,255,0.3)", ...monoStyle }}
            >
              <span className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block"
                  style={{
                    background: "#20d2b4",
                    boxShadow: "0 0 6px #20d2b4",
                    animation: "ping-dot 2s ease infinite",
                  }}
                />
                SYSTEM STATUS: ACTIVE
              </span>
              <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
              <span>3 ENGAGEMENT PATHWAYS</span>
              <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
              <span>GATEWAY: ONLINE</span>
              <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
              <span>PARTICIPATION: OPEN</span>
            </div>

            <div className="flex flex-col items-center">
              {/* Orbital Engine */}
              <OrbitalEngine
                activePathway={activePathway}
                lockedPathway={lockedPathway}
                onHover={handleHover}
                onNodeClick={handleNodeClick}
                animStep={animStep}
              />

              {/* Instruction hint */}
              {!activePathway && interactionUnlocked && (
                <p
                  className="text-[9px] tracking-[0.3em] uppercase mt-4 mb-8"
                  style={{ color: "rgba(255,255,255,0.2)", ...monoStyle }}
                >
                  Hover or click a node to reveal pathway details
                </p>
              )}
              {activePathway && !lockedPathway && (
                <p
                  className="text-[9px] tracking-[0.3em] uppercase mt-4 mb-8"
                  style={{
                    color: `rgba(${activePathwayData?.glowRgb ?? "255,255,255"},0.4)`,
                    ...monoStyle,
                  }}
                >
                  Click to lock pathway · Click again to release
                </p>
              )}
              {lockedPathway && (
                <p
                  className="text-[9px] tracking-[0.3em] uppercase mt-4 mb-8"
                  style={{
                    color: `rgba(${activePathwayData?.glowRgb ?? "255,255,255"},0.5)`,
                    ...monoStyle,
                  }}
                >
                  Pathway locked · Click node again to release
                </p>
              )}

              {/* Active pathway panel */}
              {activePathwayData && (
                <div
                  className="w-full max-w-3xl"
                  style={{
                    animation: "slide-up 0.4s cubic-bezier(0.34,1.2,0.64,1)",
                  }}
                >
                  <PathwayPanel
                    pathway={activePathwayData}
                    onNavigate={onNavigate}
                    onOpenForm={(type) => setModalType(type)}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Mobile: Expanding Cards ── */}
        {isMobile && (
          <div className="space-y-4">
            {PATHWAYS.map((p) => (
              <MobileCard
                key={p.key}
                pathway={p}
                isExpanded={expandedMobileCard === p.key}
                onToggle={() =>
                  setExpandedMobileCard((prev) =>
                    prev === p.key ? null : p.key,
                  )
                }
                onNavigate={onNavigate}
                onOpenForm={(type) => setModalType(type)}
              />
            ))}
          </div>
        )}

        {/* Engagement flow visualization */}
        <EngagementFlowBar />

        {/* Closing tagline */}
        <div className="mt-14 text-center">
          <div
            className="inline-flex items-center gap-4"
            style={{ color: "rgba(255,255,255,0.2)", ...monoStyle }}
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-current opacity-40" />
            <p className="text-[9px] tracking-[0.3em] uppercase">
              Every collaboration, partnership, and contribution strengthens the
              global mission of STEMONEF.
            </p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-current opacity-40" />
          </div>
        </div>
      </div>

      {/* Collaboration / Partnership dialog */}
      <Dialog
        open={!!modalType}
        onOpenChange={(open) => !open && setModalType(null)}
      >
        <DialogContent
          data-ocid="cta.dialog"
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          style={{
            background: "rgba(4,6,18,0.98)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(212,160,23,0.2)",
            boxShadow:
              "0 0 60px rgba(212,160,23,0.1), 0 24px 64px rgba(0,0,0,0.9)",
          }}
        >
          {modalType && (
            <>
              <DialogHeader>
                <div
                  className="text-[10px] tracking-[0.4em] uppercase mb-2"
                  style={{ color: "rgba(212,160,23,0.7)", ...monoStyle }}
                >
                  ENGAGEMENT REQUEST
                </div>
                <DialogTitle
                  className="font-display text-2xl font-light"
                  style={{
                    letterSpacing: "0.15em",
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  {modalType === "Collaborate"
                    ? "Collaboration"
                    : "Partnership"}{" "}
                  Inquiry
                </DialogTitle>
              </DialogHeader>
              <CollaborationForm
                type={modalType}
                onClose={() => setModalType(null)}
              />
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Inline keyframes for slide-up and ping-dot */}
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ping-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
      `}</style>
    </section>
  );
}
