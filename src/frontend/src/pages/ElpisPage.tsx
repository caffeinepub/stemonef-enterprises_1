import { Skeleton } from "@/components/ui/skeleton";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { ElpisCouncilMember } from "../backend.d";
import {
  useGetElpisAnnouncements,
  useGetElpisCouncilMembers,
  useGetElpisGuidanceAreas,
  useSubmitCollaborationRequest,
} from "../hooks/useQueries";

interface ElpisPageProps {
  onBack: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const GOLD = "#d4a017";
const BLUE = "#4a7ef7";
const TEAL = "#22d3b0";
const PURPLE = "#a78bfa";

const GOVERNANCE_PRINCIPLES = [
  {
    glyph: "◈",
    title: "Scientific Integrity",
    color: GOLD,
    description:
      "All research outputs are subject to methodological review, reproducibility standards, and independent validation before publication or policy application. No exception is made for operational urgency.",
  },
  {
    glyph: "◆",
    title: "Ethical Responsibility",
    color: BLUE,
    description:
      "Every initiative is assessed against the STEMONEF Ethics Charter, with binding recommendations that may pause or redirect programs where ethical alignment cannot be confirmed.",
  },
  {
    glyph: "◇",
    title: "Global Collaboration",
    color: TEAL,
    description:
      "The council actively champions equity in international partnerships, ensuring knowledge creation benefits are distributed fairly and no region is systematically excluded.",
  },
  {
    glyph: "◎",
    title: "Transparency",
    color: PURPLE,
    description:
      "Governance decisions, advisory opinions, and policy guidance documents are published in full and subject to public review. No advisory guidance is issued in private.",
  },
  {
    glyph: "◉",
    title: "Long-Term Impact",
    color: GOLD,
    description:
      "Short-term considerations are always weighed against generational impact — STEMONEF's mission extends beyond current institutional cycles and must remain viable across decades.",
  },
];

const OVERSIGHT_AREAS = [
  {
    title: "Research Ethics",
    color: GOLD,
    icon: "◈",
    description:
      "Independent review of research methodologies, data collection practices, and publication standards across all EPOCHS initiatives.",
    detail:
      "The E.L.P.I.S research ethics panel conducts quarterly audits of active research streams, maintains a published register of reviewed projects, and issues formal methodological opinions on new domains.",
  },
  {
    title: "Technology Governance",
    color: BLUE,
    icon: "◆",
    description:
      "Assessment of AI systems, data infrastructure, and technology deployments for bias, safety, and societal alignment.",
    detail:
      "Includes algorithmic bias reviews, data sovereignty assessments, and pre-deployment technology impact analyses for all STEAMI intelligence systems and EPOCHS computational tools.",
  },
  {
    title: "Climate Responsibility",
    color: TEAL,
    icon: "◇",
    description:
      "Ensuring TERRA and EPOCHS climate initiatives meet or exceed international environmental standards and treaty commitments.",
    detail:
      "E.L.P.I.S holds direct advisory authority over TERRA programme scope and ensures that EPOCHS climate research aligns with IPCC standards and regional environmental agreements.",
  },
  {
    title: "Data Integrity",
    color: PURPLE,
    icon: "◎",
    description:
      "Governance of how STEAMI collects, processes, stores, and distributes intelligence to prevent manipulation or misrepresentation.",
    detail:
      "Includes data provenance auditing, source attribution standards, and review of STEAMI's synthesis methodology to ensure intelligence outputs are not misleading or incomplete.",
  },
  {
    title: "Public Impact",
    color: "#34d399",
    icon: "◉",
    description:
      "Evaluation of whether STEMONEF's knowledge outputs reach and benefit underserved communities and advance global equity.",
    detail:
      "The council publishes an annual Public Impact Assessment examining reach, accessibility, language equity, and whether STEMONEF initiatives are disproportionately benefitting wealthy institutions.",
  },
];

const REVIEW_STEPS = [
  {
    label: "Initiative Proposal",
    detail:
      "Operational teams present new initiatives with full documentation — scope, methodology, resource requirements, and anticipated societal impact. All proposals are registered in the E.L.P.I.S governance log.",
  },
  {
    label: "Advisory Review",
    detail:
      "The full E.L.P.I.S council reviews the proposal against the Ethics Charter and relevant policy frameworks. A minimum of three council members must participate. Review period: up to 30 days.",
  },
  {
    label: "Ethical Assessment",
    detail:
      "A formal written assessment is produced documenting specific concerns, recommendations, and any conditions attached to approval. Assessments are published in the governance record.",
  },
  {
    label: "Strategic Recommendations",
    detail:
      "Advisory guidance is issued — binding unless an executive override is formally documented with justification. Overrides are rare and themselves reviewed by the council at next sitting.",
  },
  {
    label: "Implementation Guidance",
    detail:
      "Ongoing check-ins during programme rollout with milestone reviews at 6 and 12 months. E.L.P.I.S may issue supplementary guidance as implementation context evolves.",
  },
];

const POLICY_DOMAIN_COLORS: Record<string, string> = {
  "AI Ethics": BLUE,
  "Climate Policy": TEAL,
  "Science Education": GOLD,
  "Technology Governance": PURPLE,
  "Global Research Collaboration": "#34d399",
};

const FALLBACK_GUIDANCE_AREAS = [
  {
    id: BigInt(1),
    domain: "AI Ethics",
    description:
      "The council provides binding guidance on responsible AI deployment across STEAMI intelligence systems, including algorithmic accountability, data fairness, and automated decision-making limits.",
    contribution:
      "Quarterly AI ethics audits; published framework papers; advisory board review of all autonomous systems prior to deployment.",
  },
  {
    id: BigInt(2),
    domain: "Climate Policy",
    description:
      "E.L.P.I.S ensures STEMONEF climate research meets international standards and translates into actionable policy-grade outputs aligned with global treaty commitments.",
    contribution:
      "TERRA programme oversight; annual climate policy translation reports; liaison with international environmental bodies.",
  },
  {
    id: BigInt(3),
    domain: "Science Education",
    description:
      "Guidance on HUMANON curriculum design, mentor standards, and research quality thresholds for participant outputs ensures that educational value is never compromised for throughput.",
    contribution:
      "HUMANON participant outcome reviews; educational standards documentation; co-design of research training modules.",
  },
  {
    id: BigInt(4),
    domain: "Technology Governance",
    description:
      "Comprehensive oversight of how STEMONEF builds, procures, and deploys technology — including data infrastructure, communication platforms, and intelligence tools.",
    contribution:
      "Technology risk assessments; pre-deployment sign-off process; published technology governance standards.",
  },
  {
    id: BigInt(5),
    domain: "Global Research Collaboration",
    description:
      "The council monitors international partnerships for equity and alignment — ensuring that collaboration is genuinely mutual, not extractive, and that credit is appropriately distributed.",
    contribution:
      "Partnership equity audits; co-authorship standards; published guidance on equitable collaboration protocols.",
  },
];

const IMPACT_STATS = [
  {
    value: "6",
    label: "Council Members",
    sublabel: "Expert Advisors",
    color: GOLD,
  },
  {
    value: "5",
    label: "Governance Domains",
    sublabel: "Active Oversight Areas",
    color: BLUE,
  },
  {
    value: "2",
    label: "Published Frameworks",
    sublabel: "Ethics & Governance",
    color: TEAL,
  },
  {
    value: "3",
    label: "Active Reviews",
    sublabel: "Ongoing Oversight",
    color: PURPLE,
  },
];

// ─── Hero Canvas ──────────────────────────────────────────────────────────────
function ElpisHeroCanvas() {
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

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    // Governance nodes — slowly drifting
    type GovNode = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      isGold: boolean;
      phase: number;
    };

    const nodes: GovNode[] = Array.from({ length: 50 }, (_, i) => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: 1.5 + Math.random() * 2.5,
      alpha: 0.2 + Math.random() * 0.5,
      isGold: i < 15,
      phase: Math.random() * Math.PI * 2,
    }));

    // Concentric pulse rings
    const rings = [
      { baseRadius: 80, speed: 0.004, phase: 0 },
      { baseRadius: 160, speed: 0.003, phase: Math.PI / 3 },
      { baseRadius: 260, speed: 0.002, phase: Math.PI / 1.5 },
    ];

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

      const w = W();
      const h = H();
      ctx.clearRect(0, 0, w, h);

      // Concentric rings from center-right
      const cx = w * 0.72;
      const cy = h * 0.45;
      const t = now * 0.001;

      for (const ring of rings) {
        const pulse = Math.sin(t * ring.speed * 300 + ring.phase) * 0.5 + 0.5;
        const r = ring.baseRadius + pulse * 20;
        const alpha = 0.04 + pulse * 0.06;

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212,160,23,${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Second ring slightly offset
        ctx.beginPath();
        ctx.arc(cx, cy, r * 1.08, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(74,126,247,${alpha * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Draw connections between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const lineAlpha = ((120 - dist) / 120) * 0.12;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            const isGoldPair = nodes[i].isGold || nodes[j].isGold;
            ctx.strokeStyle = isGoldPair
              ? `rgba(212,160,23,${lineAlpha})`
              : `rgba(74,126,247,${lineAlpha * 0.7})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        const pulse = Math.sin(t * 2 + node.phase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
        const color = node.isGold
          ? `rgba(212,160,23,${node.alpha * pulse})`
          : `rgba(74,126,247,${node.alpha * 0.6 * pulse})`;
        ctx.fillStyle = color;
        ctx.fill();

        // Update position
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > w) node.vx *= -1;
        if (node.y < 0 || node.y > h) node.vy *= -1;
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
    // biome-ignore lint/a11y/noAriaHiddenOnFocusable: decorative canvas, tabIndex=-1 makes it non-focusable
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6 }}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

// ─── Council Overview Orbit SVG ───────────────────────────────────────────────
function CouncilOrbitSVG() {
  const [orbitAngle, setOrbitAngle] = useState(0);

  useEffect(() => {
    let raf = 0;
    let last = 0;
    const FPS = 30;
    const FRAME_MS = 1000 / FPS;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      if (now - last < FRAME_MS) return;
      last = now;
      setOrbitAngle((a) => (a + 0.4) % 360);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const DOMAINS = [
    { label: "Science", color: GOLD, angle: 0 },
    { label: "Policy", color: BLUE, angle: 72 },
    { label: "Technology", color: TEAL, angle: 144 },
    { label: "Ethics", color: PURPLE, angle: 216 },
    { label: "Education", color: "#34d399", angle: 288 },
  ];

  const cx = 160;
  const cy = 160;
  const orbitR = 105;
  const dotR = 6;

  return (
    <svg
      viewBox="0 0 320 320"
      className="w-full max-w-xs mx-auto"
      aria-hidden="true"
    >
      {/* Orbit ring */}
      <circle
        cx={cx}
        cy={cy}
        r={orbitR}
        fill="none"
        stroke="rgba(212,160,23,0.12)"
        strokeWidth="1"
        strokeDasharray="4 6"
      />
      {/* Outer ring */}
      <circle
        cx={cx}
        cy={cy}
        r={orbitR + 18}
        fill="none"
        stroke="rgba(74,126,247,0.06)"
        strokeWidth="1"
      />

      {/* Center node */}
      <circle
        cx={cx}
        cy={cy}
        r={36}
        fill="rgba(212,160,23,0.06)"
        stroke="rgba(212,160,23,0.35)"
        strokeWidth="1.5"
      />
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        fill="rgba(212,160,23,0.85)"
        fontSize="7"
        fontFamily="Geist Mono, monospace"
        letterSpacing="2"
      >
        E.L.P.I.S
      </text>
      <text
        x={cx}
        y={cy + 8}
        textAnchor="middle"
        fill="rgba(255,255,255,0.3)"
        fontSize="5.5"
        fontFamily="Sora, sans-serif"
      >
        COUNCIL
      </text>

      {/* Domain nodes */}
      {DOMAINS.map((d) => {
        const rad = ((d.angle - 90) * Math.PI) / 180;
        const nx = cx + orbitR * Math.cos(rad);
        const ny = cy + orbitR * Math.sin(rad);
        return (
          <g key={d.label}>
            <line
              x1={cx}
              y1={cy}
              x2={nx}
              y2={ny}
              stroke={`${d.color}22`}
              strokeWidth="0.8"
              strokeDasharray="3 4"
            />
            <circle cx={nx} cy={ny} r={dotR + 5} fill={`${d.color}10`} />
            <circle
              cx={nx}
              cy={ny}
              r={dotR}
              fill={`${d.color}30`}
              stroke={d.color}
              strokeWidth="1"
            />
            <text
              x={nx}
              y={ny + dotR + 11}
              textAnchor="middle"
              fill={`${d.color}cc`}
              fontSize="6"
              fontFamily="Sora, sans-serif"
            >
              {d.label}
            </text>
          </g>
        );
      })}

      {/* Traveling dot */}
      {(() => {
        const rad = ((orbitAngle - 90) * Math.PI) / 180;
        const tx = cx + orbitR * Math.cos(rad);
        const ty = cy + orbitR * Math.sin(rad);
        return (
          <circle cx={tx} cy={ty} r={3} fill={GOLD} opacity="0.8">
            <animate
              attributeName="r"
              values="2;3.5;2"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        );
      })()}
    </svg>
  );
}

// ─── Advisory Structure Diagram ───────────────────────────────────────────────
function AdvisoryStructureDiagram() {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const nodes = [
    {
      label: "STEMONEF ENTERPRISES",
      sub: "Parent institution — strategic mission and operational oversight",
      color: BLUE,
    },
    {
      label: "STRATEGIC INITIATIVES",
      sub: "Programme leads across EPOCHS, HUMANON, STEAMI, TERRA, NOVA, EQUIS",
      color: TEAL,
    },
    {
      label: "E.L.P.I.S ADVISORY COUNCIL",
      sub: "Independent governance body — ethics, policy, and integrity oversight",
      color: GOLD,
    },
    {
      label: "ETHICAL & POLICY GUIDANCE",
      sub: "Published advisory outputs — binding recommendations and strategic guidance documents",
      color: PURPLE,
    },
  ];

  return (
    <div className="flex flex-col items-center gap-0 max-w-lg mx-auto">
      {nodes.map((node, i) => (
        <div key={node.label} className="flex flex-col items-center w-full">
          {/* Node card */}
          <div
            data-ocid={`elpis.structure.card.${i + 1}`}
            className="w-full p-4 rounded-sm transition-all duration-300 cursor-default"
            style={{
              background:
                hoveredNode === i
                  ? `${node.color}12`
                  : "rgba(255,255,255,0.03)",
              border: `1px solid ${hoveredNode === i ? `${node.color}55` : "rgba(255,255,255,0.07)"}`,
              backdropFilter: "blur(12px)",
            }}
            onMouseEnter={() => setHoveredNode(i)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <div
              className="font-mono-geist text-xs tracking-[0.2em] uppercase mb-1"
              style={{ color: node.color }}
            >
              {node.label}
            </div>
            <div
              className="text-xs leading-relaxed"
              style={{
                color:
                  hoveredNode === i
                    ? "rgba(255,255,255,0.55)"
                    : "rgba(255,255,255,0.25)",
                fontFamily: "Sora, sans-serif",
                maxHeight: hoveredNode === i ? "80px" : "0px",
                overflow: "hidden",
                transition: "max-height 0.3s ease, color 0.3s ease",
              }}
            >
              {node.sub}
            </div>
          </div>

          {/* Connector */}
          {i < nodes.length - 1 && (
            <div
              className="flex flex-col items-center"
              style={{ height: "40px" }}
            >
              <div
                className="relative overflow-hidden"
                style={{
                  width: "2px",
                  height: "100%",
                  background: "rgba(255,255,255,0.06)",
                }}
              >
                {/* Traveling gold dot via CSS */}
                <div
                  style={{
                    position: "absolute",
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: GOLD,
                    left: "-2px",
                    animation: `elpis-travel-dot 2s linear ${i * 0.4}s infinite`,
                    boxShadow: `0 0 6px ${GOLD}`,
                  }}
                />
              </div>
              <span style={{ color: `${GOLD}60`, fontSize: "10px" }}>↓</span>
            </div>
          )}
        </div>
      ))}
      <style>{`
        @keyframes elpis-travel-dot {
          0% { top: -6px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Process Flow ─────────────────────────────────────────────────────────────
function ReviewProcessFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const [locked, setLocked] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!locked) {
        setActiveStep((s) => (s + 1) % REVIEW_STEPS.length);
      }
    }, 2500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [locked]);

  return (
    <div>
      {/* Step indicators */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {REVIEW_STEPS.map((step, i) => (
          <button
            key={step.label}
            type="button"
            data-ocid={`elpis.review.step.${i + 1}`}
            className="transition-all duration-300 px-3 py-1.5 rounded-sm font-mono-geist text-[10px] tracking-widest uppercase"
            style={{
              background:
                activeStep === i ? `${GOLD}22` : "rgba(255,255,255,0.03)",
              border: `1px solid ${activeStep === i ? `${GOLD}66` : "rgba(255,255,255,0.08)"}`,
              color: activeStep === i ? GOLD : "rgba(255,255,255,0.35)",
              cursor: "pointer",
            }}
            onClick={() => {
              setActiveStep(i);
              setLocked(true);
              setTimeout(() => setLocked(false), 8000);
            }}
          >
            {String(i + 1).padStart(2, "0")} {step.label}
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div
        className="p-6 rounded-sm"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${GOLD}33`,
          minHeight: "100px",
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-8 h-8 rounded-sm flex items-center justify-center font-mono-geist text-xs font-bold"
            style={{
              background: `${GOLD}20`,
              border: `1px solid ${GOLD}44`,
              color: GOLD,
            }}
          >
            {String(activeStep + 1).padStart(2, "0")}
          </div>
          <h4
            className="font-display text-lg font-light tracking-wide"
            style={{ color: "rgba(255,255,255,0.9)" }}
          >
            {REVIEW_STEPS[activeStep].label}
          </h4>
        </div>
        <p
          className="text-sm leading-relaxed"
          style={{
            color: "rgba(255,255,255,0.5)",
            fontFamily: "Sora, sans-serif",
          }}
        >
          {REVIEW_STEPS[activeStep].detail}
        </p>
      </div>

      {/* Progress bar */}
      <div
        className="mt-3 h-0.5 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.05)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${((activeStep + 1) / REVIEW_STEPS.length) * 100}%`,
            background: `linear-gradient(90deg, ${GOLD}, ${BLUE})`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Member Card ──────────────────────────────────────────────────────────────
function MemberCard({
  member,
  index,
}: { member: ElpisCouncilMember; index: number }) {
  const [expanded, setExpanded] = useState(false);

  const expertiseList = member.expertise
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  return (
    <div
      data-ocid={`elpis.member.item.${index + 1}`}
      className="elpis-reveal reveal transition-all duration-300"
      style={{ transitionDelay: `${index * 0.08}s` }}
    >
      <div
        className="rounded-sm overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${expanded ? `${GOLD}44` : "rgba(255,255,255,0.07)"}`,
          transition: "border-color 0.3s ease",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          if (!expanded)
            el.style.boxShadow = `0 0 20px ${GOLD}0d, 0 8px 32px rgba(0,0,0,0.4)`;
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          if (!expanded) el.style.boxShadow = "none";
        }}
      >
        {/* Card header */}
        <button
          type="button"
          data-ocid={`elpis.member.toggle.${index + 1}`}
          className="w-full p-5 text-left transition-all duration-200"
          style={{ background: "none", border: "none", cursor: "pointer" }}
          onClick={() => setExpanded((e) => !e)}
        >
          {/* Scan line */}
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, ${GOLD}44, transparent)`,
              animation: expanded
                ? "card-scan 4s ease-in-out infinite"
                : "none",
            }}
            aria-hidden="true"
          />

          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Domain badge */}
              <div className="mb-2">
                <span
                  className="font-mono-geist text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-sm"
                  style={{
                    background: `${GOLD}18`,
                    border: `1px solid ${GOLD}33`,
                    color: GOLD,
                  }}
                >
                  {member.domain}
                </span>
              </div>
              {/* Name */}
              <div
                className="font-display text-lg font-light mb-1"
                style={{
                  color: "rgba(255,255,255,0.9)",
                  letterSpacing: "0.04em",
                }}
              >
                {member.name}
              </div>
              {/* Organization */}
              <div
                className="font-mono-geist text-[10px] tracking-widest mb-1"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {member.organization}
              </div>
              {/* Role */}
              <div
                className="text-xs"
                style={{ color: `${BLUE}cc`, fontFamily: "Sora, sans-serif" }}
              >
                {member.role}
              </div>
            </div>

            {/* Expand toggle */}
            <div
              className="flex-shrink-0 w-6 h-6 flex items-center justify-center transition-transform duration-300"
              style={{
                color: GOLD,
                transform: expanded ? "rotate(45deg)" : "rotate(0deg)",
                fontSize: "14px",
              }}
            >
              +
            </div>
          </div>
        </button>

        {/* Expanded biography */}
        <div
          style={{
            maxHeight: expanded ? "400px" : "0",
            overflow: "hidden",
            transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div
            className="px-5 pb-5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p
              className="text-sm leading-relaxed mt-4 mb-4"
              style={{
                color: "rgba(255,255,255,0.5)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              {member.biography}
            </p>
            {expertiseList.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {expertiseList.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono-geist text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm"
                    style={{
                      background: `${BLUE}15`,
                      border: `1px solid ${BLUE}30`,
                      color: `${BLUE}cc`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Engage Card (CTA with inline form) ──────────────────────────────────────
function EngageCard({
  title,
  glyph,
  description,
  color,
  pathway,
  fields,
  ocid,
}: {
  title: string;
  glyph: string;
  description: string;
  color: string;
  pathway: string;
  fields: { label: string; key: string; type?: string; options?: string[] }[];
  ocid: string;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const submitReq = useSubmitCollaborationRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name ?? form.nominatorName ?? "Anonymous";
    const email = form.email ?? "";
    const message = Object.entries(form)
      .map(([k, v]) => `${k}: ${v}`)
      .join(" | ");
    try {
      await submitReq.mutateAsync({ name, email, pathway, message });
      setSubmitted(true);
      toast.success("Request submitted successfully");
    } catch {
      toast.error("Failed to submit request");
    }
  };

  return (
    <div
      data-ocid={`elpis.${ocid}.card`}
      className="rounded-sm transition-all duration-300"
      style={{
        background: open ? `${color}0a` : "rgba(255,255,255,0.03)",
        border: `1px solid ${open ? `${color}44` : "rgba(255,255,255,0.07)"}`,
      }}
      onMouseEnter={(e) => {
        if (!open)
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            `0 0 24px ${color}15`;
      }}
      onMouseLeave={(e) => {
        if (!open) (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Card header */}
      <div className="p-6">
        <div
          className="text-2xl mb-3"
          style={{ color: `${color}88` }}
          aria-hidden="true"
        >
          {glyph}
        </div>
        <h3
          className="font-display text-xl font-light mb-2"
          style={{ color: "rgba(255,255,255,0.9)", letterSpacing: "0.04em" }}
        >
          {title}
        </h3>
        <p
          className="text-sm leading-relaxed mb-4"
          style={{
            color: "rgba(255,255,255,0.45)",
            fontFamily: "Sora, sans-serif",
          }}
        >
          {description}
        </p>

        {!submitted ? (
          <button
            type="button"
            data-ocid={`elpis.${ocid}.open_modal_button`}
            className="font-mono-geist text-[10px] tracking-[0.2em] uppercase px-4 py-2 rounded-sm transition-all duration-200"
            style={{
              background: open ? `${color}25` : "rgba(255,255,255,0.04)",
              border: `1px solid ${color}44`,
              color: open ? color : "rgba(255,255,255,0.5)",
              cursor: "pointer",
            }}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close Form ×" : `${title} →`}
          </button>
        ) : (
          <div
            data-ocid={`elpis.${ocid}.success_state`}
            className="font-mono-geist text-[10px] tracking-widest uppercase px-4 py-2 rounded-sm"
            style={{
              background: `${TEAL}15`,
              border: `1px solid ${TEAL}44`,
              color: TEAL,
            }}
          >
            ✓ Submitted Successfully
          </div>
        )}
      </div>

      {/* Inline form */}
      <div
        style={{
          maxHeight: open && !submitted ? "600px" : "0",
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <form
          data-ocid={`elpis.${ocid}.dialog`}
          onSubmit={handleSubmit}
          className="px-6 pb-6 flex flex-col gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="pt-4" />
          {fields.map((field) => (
            <div key={field.key}>
              <label
                htmlFor={`engage-${ocid}-${field.key}`}
                className="font-mono-geist text-[9px] tracking-[0.2em] uppercase mb-1 block"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {field.label}
              </label>
              {field.options ? (
                <select
                  id={`engage-${ocid}-${field.key}`}
                  data-ocid={`elpis.${ocid}.select`}
                  value={form[field.key] ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [field.key]: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-sm text-xs font-mono-geist"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.7)",
                    outline: "none",
                  }}
                  required
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  id={`engage-${ocid}-${field.key}`}
                  data-ocid={`elpis.${ocid}.textarea`}
                  value={form[field.key] ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [field.key]: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 rounded-sm text-xs resize-none"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.7)",
                    fontFamily: "Sora, sans-serif",
                    outline: "none",
                  }}
                  required
                />
              ) : (
                <input
                  id={`engage-${ocid}-${field.key}`}
                  type={field.type ?? "text"}
                  data-ocid={`elpis.${ocid}.input`}
                  value={form[field.key] ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [field.key]: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-sm text-xs font-mono-geist"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.7)",
                    outline: "none",
                  }}
                  required
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            data-ocid={`elpis.${ocid}.submit_button`}
            disabled={submitReq.isPending}
            className="mt-2 font-mono-geist text-[10px] tracking-[0.2em] uppercase px-4 py-2.5 rounded-sm transition-all duration-200"
            style={{
              background: submitReq.isPending
                ? "rgba(255,255,255,0.04)"
                : `${color}20`,
              border: `1px solid ${color}55`,
              color: submitReq.isPending ? "rgba(255,255,255,0.3)" : color,
              cursor: submitReq.isPending ? "not-allowed" : "pointer",
            }}
          >
            {submitReq.isPending ? "Submitting…" : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Animated Count-Up ────────────────────────────────────────────────────────
function AnimatedStat({
  value,
  label,
  sublabel,
  color,
}: { value: string; label: string; sublabel: string; color: string }) {
  const [displayed, setDisplayed] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  const isNumeric = !Number.isNaN(Number(value));

  useEffect(() => {
    if (!isNumeric) {
      setDisplayed(value);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animated.current) {
          animated.current = true;
          const target = Number(value);
          let current = 0;
          const step = Math.max(1, Math.floor(target / 30));
          const interval = setInterval(() => {
            current = Math.min(current + step, target);
            setDisplayed(String(current));
            if (current >= target) clearInterval(interval);
          }, 40);
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, isNumeric]);

  return (
    <div
      ref={ref}
      className="text-center p-6 rounded-sm"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${color}22`,
      }}
    >
      <div className="font-display text-5xl font-light mb-1" style={{ color }}>
        {displayed}
      </div>
      <div
        className="font-mono-geist text-xs tracking-widest uppercase mb-1"
        style={{ color: "rgba(255,255,255,0.7)" }}
      >
        {label}
      </div>
      <div
        className="text-xs"
        style={{
          color: "rgba(255,255,255,0.3)",
          fontFamily: "Sora, sans-serif",
        }}
      >
        {sublabel}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ElpisPage({ onBack }: ElpisPageProps) {
  const { data: members, isLoading: membersLoading } =
    useGetElpisCouncilMembers();
  const { data: guidanceAreas, isLoading: guidanceLoading } =
    useGetElpisGuidanceAreas();
  const { data: announcements, isLoading: announcementsLoading } =
    useGetElpisAnnouncements();

  const [expandedOversight, setExpandedOversight] = useState<number | null>(
    null,
  );
  const [expandedGuidance, setExpandedGuidance] = useState<number | null>(null);
  const [expandedPrinciple, setExpandedPrinciple] = useState<number | null>(
    null,
  );

  const displayGuidance =
    guidanceAreas && guidanceAreas.length > 0
      ? guidanceAreas
      : FALLBACK_GUIDANCE_AREAS;

  const formatDate = useCallback((ts: bigint) => {
    const ms = Number(ts);
    if (ms > 1e12) {
      return new Date(ms).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    return "—";
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-observe on data change
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
    const els = document.querySelectorAll(".elpis-reveal");
    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, [members, guidanceAreas, announcements]);

  return (
    <div style={{ background: "var(--neural-bg)", minHeight: "100vh" }}>
      {/* ── Sticky Top Bar ────────────────────────────────────────────────── */}
      <div
        className="sticky top-[65px] z-40 px-6 py-3 flex items-center justify-between"
        style={{
          background: "rgba(4,5,14,0.92)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <button
          type="button"
          data-ocid="elpis.back.button"
          onClick={onBack}
          className="flex items-center gap-2 font-mono-geist text-xs tracking-widest uppercase transition-all duration-200"
          style={{
            color: "rgba(255,255,255,0.4)",
            background: "none",
            border: "none",
            cursor: "pointer",
            letterSpacing: "0.15em",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = GOLD;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "rgba(255,255,255,0.4)";
          }}
        >
          ← STEMONEF
        </button>
        <div
          className="font-mono-geist text-xs tracking-[0.4em] uppercase"
          style={{ color: `${GOLD}99` }}
        >
          E.L.P.I.S
        </div>
        <div className="flex items-center gap-3">
          <span
            className="font-mono-geist text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-sm"
            style={{
              background: `${GOLD}12`,
              border: `1px solid ${GOLD}33`,
              color: `${GOLD}cc`,
            }}
          >
            Advisory Council
          </span>
        </div>
      </div>

      {/* ── Section 1: Hero ───────────────────────────────────────────────── */}
      <section
        className="relative min-h-[85vh] flex items-center overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, rgba(8,6,25,0.95) 0%, rgba(4,5,14,1) 60%)",
        }}
      >
        <ElpisHeroCanvas />
        <div
          className="neural-grid-bg absolute inset-0 opacity-15"
          aria-hidden="true"
        />

        {/* Ambient gold glow at center-right */}
        <div
          className="absolute"
          style={{
            right: "15%",
            top: "30%",
            width: "480px",
            height: "480px",
            background:
              "radial-gradient(circle, rgba(212,160,23,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute"
          style={{
            right: "20%",
            top: "38%",
            width: "280px",
            height: "280px",
            background:
              "radial-gradient(circle, rgba(74,126,247,0.04) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-20 pb-24">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div
              className="font-mono-geist text-[10px] tracking-[0.5em] uppercase mb-6 animate-fade-in-up"
              style={{ color: `${GOLD}99` }}
            >
              ◆ GOVERNANCE COUNCIL · EST. STEMONEF
            </div>

            {/* Main title */}
            <h1
              className="font-display font-light text-gradient-gold mb-3 animate-fade-in-up"
              style={{
                fontSize: "clamp(4rem, 12vw, 9rem)",
                letterSpacing: "0.18em",
                lineHeight: 0.88,
                animationDelay: "0.1s",
              }}
            >
              E.L.P.I.S
            </h1>

            {/* Subtitle */}
            <p
              className="font-display text-xl md:text-2xl font-light mb-4 animate-fade-in-up"
              style={{
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.06em",
                animationDelay: "0.2s",
              }}
            >
              Ethical Leadership, Policy &amp; Innovation Stewardship
            </p>

            {/* Subtext */}
            <p
              className="text-base leading-relaxed mb-10 animate-fade-in-up max-w-2xl"
              style={{
                color: "rgba(255,255,255,0.38)",
                fontFamily: "Sora, sans-serif",
                animationDelay: "0.3s",
              }}
            >
              The independent advisory council guiding the ethical and strategic
              direction of STEMONEF Enterprises. Ensuring every initiative
              remains scientifically responsible, ethically grounded, and
              socially beneficial.
            </p>

            {/* CTA buttons */}
            <div
              className="flex flex-wrap gap-4 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <button
                type="button"
                data-ocid="elpis.hero.primary_button"
                className="font-mono-geist text-xs tracking-[0.2em] uppercase px-6 py-3 rounded-sm transition-all duration-300"
                style={{
                  background: `${GOLD}18`,
                  border: `1px solid ${GOLD}55`,
                  color: GOLD,
                  cursor: "pointer",
                }}
                onClick={() =>
                  document
                    .getElementById("elpis-members")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = `${GOLD}28`;
                  el.style.boxShadow = `0 0 20px ${GOLD}22`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = `${GOLD}18`;
                  el.style.boxShadow = "none";
                }}
              >
                Explore Council →
              </button>
              <button
                type="button"
                data-ocid="elpis.hero.secondary_button"
                className="font-mono-geist text-xs tracking-[0.2em] uppercase px-6 py-3 rounded-sm transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                }}
                onClick={() =>
                  document
                    .getElementById("elpis-principles")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "rgba(255,255,255,0.07)";
                  el.style.color = "rgba(255,255,255,0.8)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "rgba(255,255,255,0.03)";
                  el.style.color = "rgba(255,255,255,0.5)";
                }}
              >
                View Governance Principles
              </button>
            </div>

            {/* Decorative glyph line */}
            <div
              className="mt-12 flex items-center gap-4 animate-fade-in-up"
              style={{ animationDelay: "0.5s" }}
            >
              <div
                className="h-px flex-1 max-w-48"
                style={{
                  background: `linear-gradient(90deg, ${GOLD}44, transparent)`,
                }}
              />
              <span
                className="font-mono-geist text-[10px] tracking-[0.35em] uppercase"
                style={{ color: `${GOLD}55` }}
              >
                ◈ INDEPENDENT · ADVISORY · BINDING
              </span>
              <div
                className="h-px flex-1 max-w-48"
                style={{
                  background: `linear-gradient(270deg, ${BLUE}33, transparent)`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Fade to next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent, var(--neural-bg))",
          }}
        />
      </section>

      {/* ── Section 2: Council Overview ───────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="elpis-reveal reveal mb-12">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: `${GOLD}99` }}
            >
              ◆ COUNCIL OVERVIEW
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light"
              style={{
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.06em",
              }}
            >
              A Global Advisory Architecture
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: text + domain chips */}
            <div
              className="elpis-reveal reveal"
              style={{ transitionDelay: "0.1s" }}
            >
              {/* Domain pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  { label: "Science", color: GOLD, glyph: "◈" },
                  { label: "Public Policy", color: BLUE, glyph: "◆" },
                  { label: "Technology", color: TEAL, glyph: "◇" },
                  { label: "Ethics", color: PURPLE, glyph: "◎" },
                  { label: "Education", color: "#34d399", glyph: "◉" },
                ].map((d) => (
                  <span
                    key={d.label}
                    className="flex items-center gap-1.5 font-mono-geist text-[9px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-sm"
                    style={{
                      background: `${d.color}12`,
                      border: `1px solid ${d.color}33`,
                      color: d.color,
                    }}
                  >
                    <span style={{ opacity: 0.6 }}>{d.glyph}</span>
                    {d.label}
                  </span>
                ))}
              </div>

              <p
                className="text-base leading-relaxed mb-5"
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                E.L.P.I.S brings together world-leading experts from science,
                public policy, technology, ethics, and education to ensure every
                STEMONEF initiative meets the highest standards of global
                ethical responsibility and societal benefit.
              </p>
              <p
                className="text-base leading-relaxed mb-5"
                style={{
                  color: "rgba(255,255,255,0.38)",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                The council operates independently of operational management,
                providing binding advisory guidance that may halt, redirect, or
                require modification of any programme within the STEMONEF
                enterprise. No initiative proceeds without review.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "rgba(255,255,255,0.28)",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                Membership is drawn from institutions recognised for independent
                expertise. Members serve in an advisory capacity, with no
                financial interest in STEMONEF operational outcomes. All
                advisory opinions are published in the governance register.
              </p>
            </div>

            {/* Right: orbit SVG */}
            <div
              className="elpis-reveal reveal flex items-center justify-center"
              style={{ transitionDelay: "0.2s" }}
            >
              <CouncilOrbitSVG />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Governance Principles ─────────────────────────────── */}
      <section
        id="elpis-principles"
        className="py-24 px-6"
        style={{ background: "rgba(255,255,255,0.012)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="elpis-reveal reveal mb-12">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: `${GOLD}99` }}
            >
              ◈ GOVERNANCE PRINCIPLES
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light"
              style={{
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.06em",
              }}
            >
              Pillars of Stewardship
            </h2>
            <p
              className="mt-3 text-sm max-w-xl"
              style={{
                color: "rgba(255,255,255,0.35)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              Five foundational commitments that govern every advisory decision.
              Non-negotiable. Publicly recorded.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {GOVERNANCE_PRINCIPLES.map((principle, i) => (
              <button
                key={principle.title}
                type="button"
                data-ocid={`elpis.principle.card.${i + 1}`}
                className="elpis-reveal reveal rounded-sm overflow-hidden cursor-pointer transition-all duration-300 text-left w-full"
                style={{
                  background:
                    expandedPrinciple === i
                      ? `${principle.color}0e`
                      : "rgba(255,255,255,0.03)",
                  border: `1px solid ${expandedPrinciple === i ? `${principle.color}44` : `${principle.color}22`}`,
                  transitionDelay: `${i * 0.08}s`,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.transform = "translateY(-3px)";
                  el.style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${principle.color}0d`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.transform = "none";
                  el.style.boxShadow = "none";
                }}
                onClick={() =>
                  setExpandedPrinciple(expandedPrinciple === i ? null : i)
                }
              >
                <div className="p-6">
                  {/* Glyph */}
                  <div
                    className="text-2xl mb-4 animate-glyph-pulse"
                    style={{
                      color: `${principle.color}77`,
                      animationDelay: `${i * 0.3}s`,
                    }}
                    aria-hidden="true"
                  >
                    {principle.glyph}
                  </div>

                  {/* Title */}
                  <h3
                    className="font-display text-lg font-light mb-2 tracking-wide"
                    style={{ color: principle.color, letterSpacing: "0.08em" }}
                  >
                    {principle.title}
                  </h3>

                  {/* Collapsible description */}
                  <div
                    style={{
                      maxHeight: expandedPrinciple === i ? "200px" : "0px",
                      overflow: "hidden",
                      transition: "max-height 0.35s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: "rgba(255,255,255,0.45)",
                        fontFamily: "Sora, sans-serif",
                        paddingTop: "4px",
                      }}
                    >
                      {principle.description}
                    </p>
                  </div>

                  {/* Expand indicator */}
                  <div
                    className="mt-3 font-mono-geist text-[9px] tracking-widest uppercase transition-all duration-200"
                    style={{ color: `${principle.color}66` }}
                  >
                    {expandedPrinciple === i ? "— collapse" : "+ read more"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Advisory Structure ────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="elpis-reveal reveal mb-12">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: `${GOLD}99` }}
            >
              ◆ ADVISORY STRUCTURE
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light"
              style={{
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.06em",
              }}
            >
              Governance Relationship
            </h2>
            <p
              className="mt-3 text-sm max-w-xl"
              style={{
                color: "rgba(255,255,255,0.35)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              How E.L.P.I.S relates to the broader STEMONEF enterprise
              structure. Hover each node to expand details.
            </p>
          </div>

          <div
            className="elpis-reveal reveal max-w-lg mx-auto"
            style={{ transitionDelay: "0.15s" }}
          >
            <AdvisoryStructureDiagram />
          </div>
        </div>
      </section>

      {/* ── Section 5: Council Members ────────────────────────────────────── */}
      <section
        id="elpis-members"
        className="py-24 px-6"
        style={{ background: "rgba(255,255,255,0.012)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="elpis-reveal reveal mb-12">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: `${GOLD}99` }}
            >
              ◈ ADVISORY INTELLIGENCE
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light"
              style={{
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.06em",
              }}
            >
              The Minds Behind the Mandate
            </h2>
            <p
              className="mt-3 text-sm max-w-xl"
              style={{
                color: "rgba(255,255,255,0.35)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              Each node in the E.L.P.I.S network represents a field of
              independent expertise. Click any profile to surface biography and
              domain signals.
            </p>
          </div>

          {membersLoading ? (
            <div
              data-ocid="elpis.members.loading_state"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {(["sk-a", "sk-b", "sk-c", "sk-d", "sk-e", "sk-f"] as const).map(
                (sk) => (
                  <div
                    key={sk}
                    className="rounded-sm p-5"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <Skeleton
                      className="h-4 w-24 mb-3"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    />
                    <Skeleton
                      className="h-6 w-40 mb-2"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    />
                    <Skeleton
                      className="h-3 w-32 mb-1"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    />
                    <Skeleton
                      className="h-3 w-28"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    />
                  </div>
                ),
              )}
            </div>
          ) : !members || members.length === 0 ? (
            <div
              data-ocid="elpis.members.empty_state"
              className="text-center py-16 rounded-sm"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div className="text-3xl mb-3" style={{ color: `${GOLD}44` }}>
                ◈
              </div>
              <div
                className="font-mono-geist text-xs tracking-[0.3em] uppercase mb-2"
                style={{ color: `${GOLD}66` }}
              >
                Council forming
              </div>
              <p
                className="text-sm"
                style={{
                  color: "rgba(255,255,255,0.25)",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                Advisory board composition finalised upon institutional launch.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {members.map((member, i) => (
                <MemberCard key={String(member.id)} member={member} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Section 6: Oversight Framework ───────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="elpis-reveal reveal mb-12">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: `${GOLD}99` }}
            >
              ◆ OVERSIGHT FRAMEWORK
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light"
              style={{
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.06em",
              }}
            >
              Areas of Independent Review
            </h2>
            <p
              className="mt-3 text-sm max-w-xl"
              style={{
                color: "rgba(255,255,255,0.35)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              Five domains where E.L.P.I.S holds formal oversight authority.
              Click any area to expand details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {OVERSIGHT_AREAS.map((area, i) => (
              <button
                key={area.title}
                type="button"
                data-ocid={`elpis.oversight.card.${i + 1}`}
                className="elpis-reveal reveal rounded-sm overflow-hidden cursor-pointer transition-all duration-300 text-left w-full"
                style={{
                  background:
                    expandedOversight === i
                      ? `${area.color}0a`
                      : "rgba(255,255,255,0.03)",
                  border: `1px solid ${expandedOversight === i ? `${area.color}33` : "rgba(255,255,255,0.06)"}`,
                  borderLeft: `3px solid ${expandedOversight === i ? area.color : `${area.color}55`}`,
                  transitionDelay: `${i * 0.08}s`,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.transform = "translateY(-2px)";
                  el.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.transform = "none";
                  el.style.boxShadow = "none";
                }}
                onClick={() =>
                  setExpandedOversight(expandedOversight === i ? null : i)
                }
              >
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="text-lg"
                      style={{ color: `${area.color}88` }}
                      aria-hidden="true"
                    >
                      {area.icon}
                    </span>
                    <h3
                      className="font-display text-base font-light tracking-wide"
                      style={{ color: area.color }}
                    >
                      {area.title}
                    </h3>
                  </div>
                  <p
                    className="text-sm leading-relaxed mb-3"
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      fontFamily: "Sora, sans-serif",
                    }}
                  >
                    {area.description}
                  </p>

                  {/* Expandable detail */}
                  <div
                    style={{
                      maxHeight: expandedOversight === i ? "200px" : "0",
                      overflow: "hidden",
                      transition: "max-height 0.35s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    <div
                      style={{
                        borderTop: "1px solid rgba(255,255,255,0.05)",
                        paddingTop: "12px",
                        marginTop: "4px",
                      }}
                    >
                      <p
                        className="text-xs leading-relaxed"
                        style={{
                          color: "rgba(255,255,255,0.35)",
                          fontFamily: "Sora, sans-serif",
                        }}
                      >
                        {area.detail}
                      </p>
                    </div>
                  </div>

                  <div
                    className="mt-2 font-mono-geist text-[9px] tracking-widest uppercase"
                    style={{ color: `${area.color}55` }}
                  >
                    {expandedOversight === i ? "— collapse" : "+ details"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 7: Decision Review System ────────────────────────────── */}
      <section
        className="py-24 px-6"
        style={{ background: "rgba(255,255,255,0.012)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="elpis-reveal reveal mb-12">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: `${GOLD}99` }}
            >
              ◇ DECISION REVIEW SYSTEM
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light"
              style={{
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.06em",
              }}
            >
              How Initiatives Are Reviewed
            </h2>
            <p
              className="mt-3 text-sm max-w-xl"
              style={{
                color: "rgba(255,255,255,0.35)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              A structured 5-step process ensuring every STEMONEF initiative
              receives thorough ethical and policy review. Auto-cycling — click
              any step to lock.
            </p>
          </div>

          <div
            className="elpis-reveal reveal max-w-3xl"
            style={{ transitionDelay: "0.15s" }}
          >
            <ReviewProcessFlow />
          </div>
        </div>
      </section>

      {/* ── Section 8: Policy Guidance Areas ─────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="elpis-reveal reveal mb-12">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: `${GOLD}99` }}
            >
              ◈ POLICY GUIDANCE
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light"
              style={{
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.06em",
              }}
            >
              Domains of Expertise
            </h2>
            <p
              className="mt-3 text-sm max-w-xl"
              style={{
                color: "rgba(255,255,255,0.35)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              Five policy domains where the council contributes structured
              guidance.
              {guidanceLoading && (
                <span style={{ color: `${GOLD}66`, marginLeft: "8px" }}>
                  Loading…
                </span>
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayGuidance.map((area, i) => {
              const color = POLICY_DOMAIN_COLORS[area.domain] ?? GOLD;
              return (
                <button
                  type="button"
                  key={String(area.id)}
                  data-ocid={`elpis.guidance.card.${i + 1}`}
                  className="elpis-reveal reveal rounded-sm overflow-hidden cursor-pointer transition-all duration-300 text-left w-full"
                  style={{
                    background:
                      expandedGuidance === i
                        ? `${color}0e`
                        : "rgba(255,255,255,0.03)",
                    border: `1px solid ${expandedGuidance === i ? `${color}44` : "rgba(255,255,255,0.07)"}`,
                    transitionDelay: `${i * 0.08}s`,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.transform = "translateY(-3px)";
                    el.style.boxShadow = `0 8px 32px rgba(0,0,0,0.35), 0 0 24px ${color}0d`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.transform = "none";
                    el.style.boxShadow = "none";
                  }}
                  onClick={() =>
                    setExpandedGuidance(expandedGuidance === i ? null : i)
                  }
                >
                  <div className="p-6">
                    <span
                      className="font-mono-geist text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-sm mb-4 inline-block"
                      style={{
                        background: `${color}18`,
                        border: `1px solid ${color}33`,
                        color,
                      }}
                    >
                      {area.domain}
                    </span>
                    <p
                      className="text-sm leading-relaxed mb-3"
                      style={{
                        color: "rgba(255,255,255,0.45)",
                        fontFamily: "Sora, sans-serif",
                      }}
                    >
                      {area.description}
                    </p>

                    {/* Expanded contribution */}
                    <div
                      style={{
                        maxHeight: expandedGuidance === i ? "200px" : "0",
                        overflow: "hidden",
                        transition:
                          "max-height 0.35s cubic-bezier(0.16,1,0.3,1)",
                      }}
                    >
                      <div
                        style={{
                          borderTop: "1px solid rgba(255,255,255,0.05)",
                          paddingTop: "12px",
                          marginTop: "4px",
                        }}
                      >
                        <div
                          className="font-mono-geist text-[9px] tracking-[0.2em] uppercase mb-2"
                          style={{ color: `${color}88` }}
                        >
                          How the council contributes
                        </div>
                        <p
                          className="text-xs leading-relaxed"
                          style={{
                            color: "rgba(255,255,255,0.35)",
                            fontFamily: "Sora, sans-serif",
                          }}
                        >
                          {area.contribution}
                        </p>
                      </div>
                    </div>

                    <div
                      className="mt-3 font-mono-geist text-[9px] tracking-widest uppercase"
                      style={{ color: `${color}55` }}
                    >
                      {expandedGuidance === i
                        ? "— collapse"
                        : "+ council contribution"}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 9: Institutional Impact + Announcements ──────────────── */}
      <section
        className="py-24 px-6"
        style={{ background: "rgba(255,255,255,0.012)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="elpis-reveal reveal mb-12">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: `${GOLD}99` }}
            >
              ◉ INSTITUTIONAL IMPACT
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light"
              style={{
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.06em",
              }}
            >
              Governance in Action
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Stats */}
            <div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {IMPACT_STATS.map((stat) => (
                  <AnimatedStat key={stat.label} {...stat} />
                ))}
              </div>

              {/* Impact statements */}
              <div className="space-y-3">
                {[
                  {
                    text: "Advising research programs across all STEMONEF verticals",
                    color: GOLD,
                  },
                  {
                    text: "Shaping ethical frameworks adopted organisation-wide",
                    color: BLUE,
                  },
                  {
                    text: "Supporting responsible innovation from inception through deployment",
                    color: TEAL,
                  },
                  {
                    text: "Guiding strategic policy engagement with international bodies",
                    color: PURPLE,
                  },
                ].map((item, i) => (
                  <div
                    key={item.text}
                    className="elpis-reveal reveal flex items-start gap-3 p-4 rounded-sm"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      transitionDelay: `${i * 0.1}s`,
                    }}
                  >
                    <div
                      className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
                      style={{ background: item.color }}
                    />
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: "rgba(255,255,255,0.45)",
                        fontFamily: "Sora, sans-serif",
                      }}
                    >
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Announcements */}
            <div>
              <div
                className="font-mono-geist text-[10px] tracking-[0.3em] uppercase mb-4"
                style={{ color: `${GOLD}77` }}
              >
                ◆ GOVERNANCE ANNOUNCEMENTS
              </div>

              {announcementsLoading ? (
                <div
                  data-ocid="elpis.announcements.loading_state"
                  className="space-y-3"
                >
                  {(["ann-sk-a", "ann-sk-b", "ann-sk-c"] as const).map((sk) => (
                    <div
                      key={sk}
                      className="p-4 rounded-sm"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <Skeleton
                        className="h-3 w-20 mb-2"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                      />
                      <Skeleton
                        className="h-5 w-48 mb-2"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                      />
                      <Skeleton
                        className="h-3 w-full"
                        style={{ background: "rgba(255,255,255,0.04)" }}
                      />
                    </div>
                  ))}
                </div>
              ) : !announcements || announcements.length === 0 ? (
                <div
                  data-ocid="elpis.announcements.empty_state"
                  className="py-12 text-center rounded-sm"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div
                    className="font-mono-geist text-xs tracking-[0.3em] uppercase"
                    style={{ color: "rgba(255,255,255,0.2)" }}
                  >
                    No announcements published yet
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {announcements.map((ann, i) => {
                    const catColors: Record<string, string> = {
                      "Advisory Opinion": GOLD,
                      "Policy Guidance": BLUE,
                      "Governance Update": TEAL,
                      "Ethical Review": PURPLE,
                    };
                    const color = catColors[ann.category] ?? GOLD;
                    return (
                      <div
                        key={String(ann.id)}
                        data-ocid={`elpis.announcement.item.${i + 1}`}
                        className="p-4 rounded-sm transition-all duration-200"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.07)",
                        }}
                        onMouseEnter={(e) => {
                          (
                            e.currentTarget as HTMLDivElement
                          ).style.borderColor = `${color}33`;
                        }}
                        onMouseLeave={(e) => {
                          (
                            e.currentTarget as HTMLDivElement
                          ).style.borderColor = "rgba(255,255,255,0.07)";
                        }}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <span
                            className="font-mono-geist text-[8px] tracking-[0.2em] uppercase px-1.5 py-0.5 rounded-sm"
                            style={{
                              background: `${color}18`,
                              border: `1px solid ${color}33`,
                              color,
                            }}
                          >
                            {ann.category}
                          </span>
                          <span
                            className="font-mono-geist text-[9px]"
                            style={{
                              color: "rgba(255,255,255,0.2)",
                              flexShrink: 0,
                            }}
                          >
                            {formatDate(ann.publishedAt)}
                          </span>
                        </div>
                        <div
                          className="font-display text-base font-light mb-1"
                          style={{ color: "rgba(255,255,255,0.8)" }}
                        >
                          {ann.title}
                        </div>
                        <p
                          className="text-xs leading-relaxed"
                          style={{
                            color: "rgba(255,255,255,0.35)",
                            fontFamily: "Sora, sans-serif",
                          }}
                        >
                          {ann.summary}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 10: Engage With E.L.P.I.S ───────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="elpis-reveal reveal mb-12 text-center">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: `${GOLD}99` }}
            >
              ◆ ENGAGE
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light"
              style={{
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.06em",
              }}
            >
              Engage With E.L.P.I.S
            </h2>
            <p
              className="mt-3 text-sm max-w-xl mx-auto"
              style={{
                color: "rgba(255,255,255,0.35)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              Open pathways for collaboration, advisory nomination, and
              governance inquiry. All requests are formally logged and reviewed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <EngageCard
              title="Suggest Collaboration"
              glyph="◈"
              description="Propose a formal collaboration with E.L.P.I.S on policy development, ethical framework design, or research governance."
              color={GOLD}
              pathway="ELPIS Collaboration"
              ocid="collab"
              fields={[
                { label: "Your Name", key: "name" },
                { label: "Email Address", key: "email", type: "email" },
                { label: "Organization", key: "organization" },
                { label: "Proposal", key: "message", type: "textarea" },
              ]}
            />

            <EngageCard
              title="Nominate Advisor"
              glyph="◆"
              description="Nominate an expert for consideration to join the E.L.P.I.S advisory council. Nominations are reviewed at the next sitting."
              color={BLUE}
              pathway="ELPIS Nomination"
              ocid="nominate"
              fields={[
                { label: "Your Name", key: "name" },
                { label: "Your Email", key: "email", type: "email" },
                { label: "Nominee Name", key: "nomineeName" },
                { label: "Nominee Domain", key: "nomineeDomain" },
                {
                  label: "Reason for Nomination",
                  key: "message",
                  type: "textarea",
                },
              ]}
            />

            <EngageCard
              title="Contact Governance Office"
              glyph="◎"
              description="Reach the E.L.P.I.S governance office directly for policy inquiries, ethics concerns, institutional partnerships, or general questions."
              color={TEAL}
              pathway="ELPIS Governance"
              ocid="contact"
              fields={[
                { label: "Your Name", key: "name" },
                { label: "Email Address", key: "email", type: "email" },
                {
                  label: "Inquiry Type",
                  key: "inquiryType",
                  options: [
                    "Policy Inquiry",
                    "Ethics Concern",
                    "Partnership",
                    "General",
                  ],
                },
                { label: "Message", key: "message", type: "textarea" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── Legal Footer ──────────────────────────────────────────────────── */}
      <div
        className="py-10 px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Gold separator line */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className="h-px flex-1"
              style={{
                background: `linear-gradient(90deg, ${GOLD}33, transparent)`,
              }}
            />
            <span
              className="font-mono-geist text-[9px] tracking-[0.4em] uppercase"
              style={{ color: `${GOLD}44` }}
            >
              ◆
            </span>
            <div
              className="h-px flex-1"
              style={{
                background: `linear-gradient(270deg, ${GOLD}33, transparent)`,
              }}
            />
          </div>

          <p
            className="font-mono-geist text-[9px] text-center leading-relaxed"
            style={{ color: "rgba(255,255,255,0.18)", letterSpacing: "0.07em" }}
          >
            E.L.P.I.S™ operates as an independent advisory council under the
            governance charter of THE STEMONEF™ ENTERPRISES. All advisory
            guidance is published and subject to public review.
          </p>
          <p
            className="font-mono-geist text-[9px] text-center mt-2"
            style={{ color: "rgba(255,255,255,0.1)", letterSpacing: "0.07em" }}
          >
            EPOCHS™ · HUMANON™ · STEAMI™ · TERRA™ · NOVA™ · EQUIS™ — All
            initiatives operate under THE STEMONEF™ ENTERPRISES governance
            charter.
          </p>
          <p
            className="text-center mt-4 text-xs"
            style={{
              color: "rgba(255,255,255,0.15)",
              fontFamily: "Sora, sans-serif",
            }}
          >
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: `${GOLD}77` }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
