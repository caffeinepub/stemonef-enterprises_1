import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { HumanonMentor, HumanonProject } from "../backend.d";
import {
  useGetHumanonMentors,
  useGetHumanonProjects,
  useGetHumanonStats,
  useSubmitCollaborationRequest,
} from "../hooks/useQueries";

// ─── Constants ────────────────────────────────────────────────────────────────
const LEGAL_NOTE =
  "EPOCHS™, HUMANON™, STEAMI™ and all associated initiatives operate under the parent institution THE STEMONEF™ ENTERPRISES.";

const TEAL = "#22d3b0";
const GOLD = "#d4a017";
const BLUE = "#4a7ef7";

const REGION_DATA = [
  { name: "West Africa", count: 8, x: 44, y: 52 },
  { name: "South Asia", count: 7, x: 67, y: 48 },
  { name: "Europe", count: 6, x: 50, y: 30 },
  { name: "East Asia", count: 5, x: 78, y: 38 },
  { name: "North America", count: 3, x: 18, y: 35 },
  { name: "Latin America", count: 1, x: 26, y: 65 },
];

const PATHWAYS = [
  {
    num: "01",
    title: "Student Research Track",
    duration: "6–12 months",
    eligibility: "Enrolled in STEM degree, minimum year 2",
    contributions: "Research assistance, data collection, literature synthesis",
    outcomes: "Co-authorship credits, mentor connection, certificate",
    color: TEAL,
  },
  {
    num: "02",
    title: "Early Career Research Track",
    duration: "12–18 months",
    eligibility:
      "Relevant degree + demonstrated research interest, within 3 years post-graduation",
    contributions: "Independent research modules, pilot study design",
    outcomes: "Published research credit, direct industry connection",
    color: BLUE,
  },
  {
    num: "03",
    title: "Industry Collaboration Track",
    duration: "6–9 months part-time",
    eligibility: "2+ years industry experience",
    contributions: "Problem framing, industry validation of research outputs",
    outcomes: "Co-developed solutions, research partnership certificate",
    color: GOLD,
  },
  {
    num: "04",
    title: "Career Transition Track",
    duration: "12 months",
    eligibility: "3+ years professional experience in any domain",
    contributions: "Applied research in area of prior expertise",
    outcomes: "Domain transfer credentials, research portfolio",
    color: "#a78bfa",
  },
  {
    num: "05",
    title: "International Scholar Track",
    duration: "9–18 months",
    eligibility: "Strong academic record + language proficiency",
    contributions:
      "Cross-cultural research perspectives, global dataset contribution",
    outcomes: "Global research credential, network access",
    color: "#34d399",
  },
];

const TIMELINE_STEPS = [
  {
    label: "Application",
    detail:
      "Submit via HUMANON portal. Reviewed within 3 weeks. Matched based on research domain interest.",
  },
  {
    label: "Matching",
    detail:
      "Algorithm + human curation matches each participant to an active research project and team.",
  },
  {
    label: "Mentorship",
    detail:
      "Assigned a professional mentor from our partner network for bi-weekly check-ins.",
  },
  {
    label: "Skill Dev",
    detail:
      "Access to structured learning modules aligned to your research domain.",
  },
  {
    label: "Research Output",
    detail:
      "Produce a documented research contribution — paper, dataset, prototype, or policy brief.",
  },
  {
    label: "Placement",
    detail:
      "Direct connection to partner organizations, with placement rate tracked per cohort.",
  },
];

const INDUSTRY_STEPS = [
  {
    label: "Industry Problem",
    desc: "Organizations submit real unsolved challenges to HUMANON.",
    color: GOLD,
  },
  {
    label: "HUMANON Research Team",
    desc: "A matched team of participants begins structured research.",
    color: BLUE,
  },
  {
    label: "Mentor Guidance",
    desc: "Industry and academic mentors guide the research trajectory.",
    color: TEAL,
  },
  {
    label: "Research Output",
    desc: "The team delivers a documented outcome.",
    color: "#a78bfa",
  },
  {
    label: "Industry Feedback",
    desc: "Partners validate and may adopt outputs; feedback improves future cohorts.",
    color: "#34d399",
  },
];

const METRICS_LABELS = [
  { key: "participantsEnrolled", label: "Participants Enrolled", color: TEAL },
  { key: "projectsCompleted", label: "Research Projects", color: BLUE },
  { key: "industryPartners", label: "Industry Partners", color: GOLD },
  { key: "careerPlacements", label: "Career Placements", color: "#a78bfa" },
  { key: "countriesRepresented", label: "Countries", color: "#34d399" },
] as const;

const METRIC_BARS = [
  { label: "Career Placement Rate", value: 87, color: GOLD },
  { label: "Research Output", value: 72, color: BLUE },
  { label: "Partner Satisfaction", value: 94, color: TEAL },
  { label: "Skill Development", value: 91, color: "#a78bfa" },
  { label: "Network Expansion", value: 78, color: "#34d399" },
];

// ─── Helper: animated metric bar ─────────────────────────────────────────────
function MetricBar({
  label,
  value,
  color,
  index,
}: {
  label: string;
  value: number;
  color: string;
  index: number;
}) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimated(true), index * 120);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between">
        <span
          className="font-mono-geist text-[10px] tracking-[0.1em] uppercase"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          {label}
        </span>
        <span className="font-mono-geist text-sm font-bold" style={{ color }}>
          {value}%
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: animated ? `${value}%` : "0%",
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 8px ${color}44`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Helper: count-up number ─────────────────────────────────────────────────
function CountUp({ target, color }: { target: number; color: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const start = performance.now();
          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - (1 - progress) ** 3;
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(target);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span
      ref={ref}
      className="font-display font-light tabular-nums"
      style={{
        fontSize: "clamp(2.5rem,6vw,4rem)",
        color,
        lineHeight: 1,
      }}
    >
      {count}+
    </span>
  );
}

// ─── World Map SVG (simplified) ──────────────────────────────────────────────
function WorldMap() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="relative w-full" style={{ paddingBottom: "50%" }}>
      <svg
        viewBox="0 0 100 50"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="World map showing HUMANON participant regions"
      >
        {/* Continent silhouettes — simplified polygons */}
        {/* North America */}
        <polygon
          points="8,18 22,15 28,18 30,25 25,32 18,35 12,30 6,25"
          fill="rgba(74,126,247,0.08)"
          stroke="rgba(74,126,247,0.25)"
          strokeWidth="0.3"
        />
        {/* South America */}
        <polygon
          points="22,36 30,33 34,40 32,50 26,52 20,48 18,42"
          fill="rgba(74,126,247,0.08)"
          stroke="rgba(74,126,247,0.25)"
          strokeWidth="0.3"
        />
        {/* Europe */}
        <polygon
          points="44,20 54,18 56,24 52,28 44,27 42,24"
          fill="rgba(74,126,247,0.08)"
          stroke="rgba(74,126,247,0.25)"
          strokeWidth="0.3"
        />
        {/* Africa */}
        <polygon
          points="42,28 54,28 58,35 56,45 50,50 44,48 38,40 36,33"
          fill="rgba(74,126,247,0.08)"
          stroke="rgba(74,126,247,0.25)"
          strokeWidth="0.3"
        />
        {/* Asia */}
        <polygon
          points="55,14 82,12 88,20 84,28 74,30 66,28 58,24 55,20"
          fill="rgba(74,126,247,0.08)"
          stroke="rgba(74,126,247,0.25)"
          strokeWidth="0.3"
        />
        {/* Australia */}
        <polygon
          points="72,38 82,36 86,42 82,46 74,46 70,42"
          fill="rgba(74,126,247,0.08)"
          stroke="rgba(74,126,247,0.25)"
          strokeWidth="0.3"
        />

        {/* Connection lines between active regions */}
        {REGION_DATA.map((r, i) =>
          REGION_DATA.slice(i + 1).map((r2) => (
            <line
              key={`${r.name}-${r2.name}`}
              x1={r.x}
              y1={r.y}
              x2={r2.x}
              y2={r2.y}
              stroke="rgba(34,211,176,0.06)"
              strokeWidth="0.2"
              strokeDasharray="1 2"
            />
          )),
        )}

        {/* Region dots */}
        {REGION_DATA.map((region, i) => (
          <g key={region.name}>
            {/* Pulse ring */}
            <circle
              cx={region.x}
              cy={region.y}
              r={hovered === i ? 3.5 : 2}
              fill="none"
              stroke={TEAL}
              strokeWidth="0.4"
              opacity="0.4"
              style={{ transition: "r 0.3s ease" }}
            />
            {/* Core dot */}
            <circle
              cx={region.x}
              cy={region.y}
              r={1.2}
              fill={hovered === i ? TEAL : "rgba(34,211,176,0.7)"}
              style={{
                cursor: "pointer",
                transition: "fill 0.2s ease",
                filter: hovered === i ? `drop-shadow(0 0 3px ${TEAL})` : "none",
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
            {/* Tooltip */}
            {hovered === i && (
              <g>
                <rect
                  x={region.x - 8}
                  y={region.y - 9}
                  width="16"
                  height="7"
                  rx="0.5"
                  fill="rgba(4,5,14,0.9)"
                  stroke="rgba(34,211,176,0.4)"
                  strokeWidth="0.2"
                />
                <text
                  x={region.x}
                  y={region.y - 5.5}
                  textAnchor="middle"
                  fontSize="1.5"
                  fill={TEAL}
                  fontFamily="Geist Mono, monospace"
                >
                  {region.name}
                </text>
                <text
                  x={region.x}
                  y={region.y - 3.5}
                  textAnchor="middle"
                  fontSize="1.4"
                  fill="rgba(255,255,255,0.7)"
                  fontFamily="Geist Mono, monospace"
                >
                  {region.count} fellows
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─── Hero Canvas ─────────────────────────────────────────────────────────────
function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  const FPS = 30;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const NODE_COUNT = isMobile ? 40 : 80;

  const nodes = useRef<
    Array<{ x: number; y: number; vx: number; vy: number; color: string }>
  >([]);

  const initNodes = useCallback(
    (w: number, h: number) => {
      const colors = [
        ...Array(Math.floor(NODE_COUNT * 0.3)).fill(BLUE),
        ...Array(Math.floor(NODE_COUNT * 0.5)).fill(TEAL),
        ...Array(Math.ceil(NODE_COUNT * 0.2)).fill(GOLD),
      ];
      nodes.current = colors.map((color) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        color,
      }));
    },
    [NODE_COUNT],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
      initNodes(canvas.offsetWidth, canvas.offsetHeight);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (timestamp: number) => {
      if (document.hidden) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }
      const elapsed = timestamp - lastTimeRef.current;
      if (elapsed < 1000 / FPS) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }
      lastTimeRef.current = timestamp;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Update + draw nodes
      for (const n of nodes.current) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      // Draw connections
      for (let i = 0; i < nodes.current.length; i++) {
        for (let j = i + 1; j < nodes.current.length; j++) {
          const a = nodes.current[i];
          const b = nodes.current[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.25;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(34,211,176,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const n of nodes.current) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `${n.color}cc`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    const handleVisibility = () => {
      if (!document.hidden) {
        lastTimeRef.current = performance.now();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [initNodes]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.4 }}
    />
  );
}

// ─── Join Form ────────────────────────────────────────────────────────────────
type JoinVariant = "participant" | "mentor" | "industry";

function JoinForm({
  variant,
  onClose,
}: {
  variant: JoinVariant;
  onClose: () => void;
}) {
  const submit = useSubmitCollaborationRequest();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [track, setTrack] = useState(PATHWAYS[0].title);
  const [domain, setDomain] = useState("");
  const [organization, setOrganization] = useState("");
  const [sector, setSector] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Name and email are required");
      return;
    }
    const pathway =
      variant === "participant"
        ? track
        : variant === "mentor"
          ? "Mentor"
          : "Industry Partner";
    const fullMessage =
      variant === "participant"
        ? message
        : variant === "mentor"
          ? `Domain: ${domain}\nOrganization: ${organization}\n${message}`
          : `Sector: ${sector}\n${message}`;
    try {
      await submit.mutateAsync({ name, email, pathway, message: fullMessage });
      toast.success("Application submitted successfully");
      onClose();
    } catch {
      toast.error("Submission failed. Please try again.");
    }
  };

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Sora, sans-serif",
    fontSize: "13px",
    padding: "10px 12px",
    borderRadius: "2px",
    width: "100%",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "Geist Mono, monospace",
    fontSize: "9px",
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.4)",
    display: "block",
    marginBottom: "6px",
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
      <div>
        <label htmlFor="join-name" style={labelStyle}>
          Full Name
        </label>
        <input
          id="join-name"
          data-ocid="humanon.join.form.input"
          style={inputStyle}
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="join-email" style={labelStyle}>
          Email
        </label>
        <input
          id="join-email"
          data-ocid="humanon.join.form.input"
          style={inputStyle}
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {variant === "participant" && (
        <div>
          <label htmlFor="join-track" style={labelStyle}>
            Participation Track
          </label>
          <select
            id="join-track"
            style={{
              ...inputStyle,
              backgroundImage: "none",
              WebkitAppearance: "none",
            }}
            value={track}
            onChange={(e) => setTrack(e.target.value)}
          >
            {PATHWAYS.map((p) => (
              <option
                key={p.num}
                value={p.title}
                style={{ background: "#04050e" }}
              >
                {p.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {variant === "mentor" && (
        <>
          <div>
            <label htmlFor="join-domain" style={labelStyle}>
              Research Domain
            </label>
            <input
              id="join-domain"
              data-ocid="humanon.join.form.input"
              style={inputStyle}
              placeholder="e.g. Climate Science, AI Ethics"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="join-org" style={labelStyle}>
              Organization
            </label>
            <input
              id="join-org"
              data-ocid="humanon.join.form.input"
              style={inputStyle}
              placeholder="Your current organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />
          </div>
        </>
      )}

      {variant === "industry" && (
        <div>
          <label htmlFor="join-sector" style={labelStyle}>
            Industry Sector
          </label>
          <input
            id="join-sector"
            data-ocid="humanon.join.form.input"
            style={inputStyle}
            placeholder="e.g. Healthcare, Energy, Technology"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
          />
        </div>
      )}

      <div>
        <label htmlFor="join-message" style={labelStyle}>
          {variant === "industry" ? "Challenge Description" : "Message"}
        </label>
        <textarea
          id="join-message"
          data-ocid="humanon.join.form.textarea"
          style={{ ...inputStyle, resize: "none", minHeight: "80px" }}
          placeholder={
            variant === "industry"
              ? "Describe the unsolved challenge you'd like HUMANON to address..."
              : "Tell us about yourself and your goals..."
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
        />
      </div>

      <button
        type="submit"
        data-ocid="humanon.join.form.submit_button"
        disabled={submit.isPending}
        style={{
          width: "100%",
          padding: "12px",
          background:
            variant === "participant"
              ? "rgba(34,211,176,0.12)"
              : variant === "mentor"
                ? "rgba(212,160,23,0.12)"
                : "rgba(74,126,247,0.12)",
          border: `1px solid ${
            variant === "participant"
              ? "rgba(34,211,176,0.4)"
              : variant === "mentor"
                ? "rgba(212,160,23,0.4)"
                : "rgba(74,126,247,0.4)"
          }`,
          color:
            variant === "participant"
              ? TEAL
              : variant === "mentor"
                ? GOLD
                : BLUE,
          fontFamily: "Geist Mono, monospace",
          letterSpacing: "0.2em",
          fontSize: "11px",
          textTransform: "uppercase",
          cursor: submit.isPending ? "not-allowed" : "pointer",
          borderRadius: "2px",
          opacity: submit.isPending ? 0.6 : 1,
          transition: "all 0.2s ease",
        }}
      >
        {submit.isPending ? "SUBMITTING..." : "SUBMIT APPLICATION"}
      </button>
    </form>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────
const DOMAIN_COLORS: Record<string, string> = {
  Climate: "#34d399",
  "Deep Technology": BLUE,
  "Ethical AI": "#a78bfa",
  Health: "#f87171",
  "Environmental Intelligence": TEAL,
  "Medical Systems": "#fb923c",
};

function getDomainColor(domain: string): string {
  for (const [key, val] of Object.entries(DOMAIN_COLORS)) {
    if (domain.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return TEAL;
}

function ProjectCardSkeleton() {
  return (
    <div
      className="rounded-sm overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <Skeleton className="h-1 w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-8 w-8/12" />
      </div>
    </div>
  );
}

function MentorCardSkeleton() {
  return (
    <div
      className="rounded-sm p-5"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderLeft: "2px solid rgba(34,211,176,0.2)",
      }}
    >
      <Skeleton className="h-5 w-2/3 mb-2" />
      <Skeleton className="h-3 w-1/3 mb-3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

// ─── Seed data for when backend returns empty ─────────────────────────────────
const SEED_MENTORS: HumanonMentor[] = [
  {
    id: 1n,
    name: "Dr. Amara Osei-Bonsu",
    domain: "Climate Systems",
    organization: "EPOCHS Research",
    role: "Senior Research Lead",
    profileUrl: "",
  },
  {
    id: 2n,
    name: "Priya Nair",
    domain: "Ethical AI",
    organization: "STEAMI Intelligence",
    role: "AI Ethics Researcher",
    profileUrl: "",
  },
  {
    id: 3n,
    name: "James Whitfield",
    domain: "Deep Technology",
    organization: "NOVA Ventures",
    role: "Systems Architect",
    profileUrl: "",
  },
  {
    id: 4n,
    name: "Dr. Chen Wei",
    domain: "Medical Systems",
    organization: "EPOCHS LAB NEIA",
    role: "Biomedical Researcher",
    profileUrl: "",
  },
  {
    id: 5n,
    name: "Sofia Rodrigues",
    domain: "Environmental Intelligence",
    organization: "TERRA Systems",
    role: "Environmental Analyst",
    profileUrl: "",
  },
  {
    id: 6n,
    name: "Marcus Ibe",
    domain: "Research Development",
    organization: "HUMANON Network",
    role: "Program Director",
    profileUrl: "",
  },
];

const SEED_PROJECTS: HumanonProject[] = [
  {
    id: 1n,
    title: "Coastal Carbon Capture Index",
    researchDomain: "Climate",
    participantTeam: "Cohort 1 — 4 researchers",
    summary:
      "A systematic framework for measuring carbon sequestration potential in West African coastal ecosystems using satellite data and ground truth sampling.",
    outcome:
      "Published methodology accepted by two regional environmental bodies.",
    mentorsInvolved: "Dr. Amara Osei-Bonsu, Sofia Rodrigues",
    publishedAt: BigInt(Date.now()),
  },
  {
    id: 2n,
    title: "Explainable Diagnostic AI for Low-Resource Clinics",
    researchDomain: "Ethical AI",
    participantTeam: "Cohort 1 — 3 researchers",
    summary:
      "Development of an explainable AI model for disease screening in resource-constrained medical settings, with bias audit integrated into the pipeline.",
    outcome:
      "Prototype validated in partnership with two pilot clinics. Bias audit framework open-sourced.",
    mentorsInvolved: "Priya Nair, Dr. Chen Wei",
    publishedAt: BigInt(Date.now()),
  },
  {
    id: 3n,
    title: "IoT Mesh for Environmental Monitoring",
    researchDomain: "Deep Technology",
    participantTeam: "Cohort 2 — 5 researchers",
    summary:
      "Low-power sensor mesh architecture for real-time environmental monitoring in remote areas without reliable internet infrastructure.",
    outcome:
      "Deployed as pilot network across 3 sites. Network documentation published.",
    mentorsInvolved: "James Whitfield, Marcus Ibe",
    publishedAt: BigInt(Date.now()),
  },
  {
    id: 4n,
    title: "Cross-Cultural Research Methodology Atlas",
    researchDomain: "Environmental Intelligence",
    participantTeam: "Cohort 2 — 6 researchers",
    summary:
      "A collaborative documentation of research methodology adaptations needed when conducting environmental studies across different cultural and regulatory contexts.",
    outcome:
      "Atlas adopted as internal reference framework. Three participant-authored papers in review.",
    mentorsInvolved: "Sofia Rodrigues, Dr. Amara Osei-Bonsu",
    publishedAt: BigInt(Date.now()),
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
interface HumanonPageProps {
  onBack: () => void;
}

export default function HumanonPage({ onBack }: HumanonPageProps) {
  // Animation cycles
  const [activeTimelineStep, setActiveTimelineStep] = useState(0);
  const [activeIndustryStep, setActiveIndustryStep] = useState(0);

  // Overview cards expand
  const [expandedOverview, setExpandedOverview] = useState<number | null>(null);

  // Pathway cards expand
  const [expandedPathway, setExpandedPathway] = useState<number | null>(null);

  // Project modal
  const [selectedProject, setSelectedProject] = useState<HumanonProject | null>(
    null,
  );

  // Join forms
  const [joinVariant, setJoinVariant] = useState<JoinVariant | null>(null);

  // Backend data
  const { data: mentors, isLoading: mentorsLoading } = useGetHumanonMentors();
  const { data: projects, isLoading: projectsLoading } =
    useGetHumanonProjects();
  const { data: stats } = useGetHumanonStats();

  const displayMentors = mentors && mentors.length > 0 ? mentors : SEED_MENTORS;
  const displayProjects =
    projects && projects.length > 0 ? projects : SEED_PROJECTS;

  // Section reveal
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
    const els = document.querySelectorAll(".humanon-reveal");
    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Timeline auto-cycle
  useEffect(() => {
    const interval = setInterval(
      () => setActiveTimelineStep((p) => (p + 1) % TIMELINE_STEPS.length),
      2000,
    );
    return () => clearInterval(interval);
  }, []);

  // Industry steps auto-cycle
  useEffect(() => {
    const interval = setInterval(
      () => setActiveIndustryStep((p) => (p + 1) % INDUSTRY_STEPS.length),
      2000,
    );
    return () => clearInterval(interval);
  }, []);

  const overviewData = [
    {
      glyph: "◈",
      title: "Research Participation",
      preview: "Genuine, unsolved research problems.",
      detail:
        "HUMANON connects participants to genuine, unsolved research problems across climate, health, and technology domains — not simulations. Every engagement is anchored in real scientific uncertainty, producing verifiable outputs that advance the field.",
    },
    {
      glyph: "◇",
      title: "Industry Mentorship",
      preview: "Guidance from active practitioners.",
      detail:
        "Structured guidance from active professionals and researchers who are themselves working on the problems participants are tackling. Not retired advisors — practitioners whose own careers are invested in the same domains.",
    },
    {
      glyph: "◆",
      title: "Career Development",
      preview: "Structured exit with credentials.",
      detail:
        "Structured growth track that exits with verifiable research credentials, industry connections, and documented outcomes. Career placement is tracked per cohort and reported transparently.",
    },
  ];

  return (
    <div style={{ background: "var(--neural-bg)", minHeight: "100vh" }}>
      {/* ── Sticky Section Nav ── */}
      <div
        className="sticky top-[65px] z-40 px-6 py-3 flex items-center justify-between"
        style={{
          background: "rgba(4,5,14,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <button
          type="button"
          data-ocid="humanon.back.button"
          onClick={onBack}
          className="flex items-center gap-2 font-mono-geist text-xs tracking-widest uppercase transition-all duration-200"
          style={{
            color: "rgba(255,255,255,0.4)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "rgba(212,160,23,0.9)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "rgba(255,255,255,0.4)";
          }}
        >
          ← STEMONEF
        </button>
        <nav className="hidden md:flex items-center gap-6">
          {[
            { label: "Pathways", href: "#humanon-pathways" },
            { label: "Mentors", href: "#humanon-mentors" },
            { label: "Projects", href: "#humanon-projects" },
            { label: "Join", href: "#humanon-join" },
          ].map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="font-mono-geist text-[10px] tracking-[0.2em] uppercase transition-colors duration-200"
              style={{
                color: "rgba(255,255,255,0.35)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = TEAL;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "rgba(255,255,255,0.35)";
              }}
            >
              {label}
            </a>
          ))}
        </nav>
        <div
          className="font-mono-geist text-xs tracking-[0.3em] uppercase"
          style={{ color: `${TEAL}b3` }}
        >
          HUMANON™
        </div>
      </div>

      {/* ═══════════════════════════════════ */}
      {/* SECTION 1 — HERO                   */}
      {/* ═══════════════════════════════════ */}
      <section
        className="relative min-h-screen flex items-center px-6 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, rgba(8,28,36,0.95) 0%, rgba(4,5,14,1) 55%)",
        }}
      >
        <HeroCanvas />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 30% 50%, rgba(34,211,176,0.04) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full pt-24 pb-28">
          <div
            className="font-mono-geist text-xs tracking-[0.45em] uppercase mb-8 animate-fade-in-up"
            style={{ color: `${TEAL}b3`, animationDelay: "0s" }}
          >
            ◇ TALENT &amp; FIELD INCUBATION INITIATIVE
          </div>

          <h1
            className="font-display font-light mb-6 animate-fade-in-up"
            style={{
              fontSize: "clamp(3.5rem,11vw,8rem)",
              letterSpacing: "0.08em",
              lineHeight: 0.9,
              background: `linear-gradient(135deg, ${TEAL} 0%, #8ab4ff 50%, #ffffff 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animationDelay: "0.1s",
            }}
          >
            HUMANON
          </h1>

          <p
            className="font-display text-2xl md:text-3xl font-light mb-6 animate-fade-in-up"
            style={{
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "0.04em",
              maxWidth: "600px",
              animationDelay: "0.2s",
            }}
          >
            Connecting Potential to Purpose.
          </p>

          <p
            className="text-base leading-relaxed max-w-xl mb-12 animate-fade-in-up"
            style={{
              color: "rgba(255,255,255,0.45)",
              fontFamily: "Sora, sans-serif",
              animationDelay: "0.3s",
            }}
          >
            The global talent and field incubation initiative of STEMONEF
            Enterprises.
          </p>

          <div
            className="flex flex-wrap gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <button
              type="button"
              data-ocid="humanon.hero.explore_button"
              onClick={() =>
                document
                  .getElementById("humanon-pathways")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                padding: "14px 32px",
                background: "rgba(34,211,176,0.1)",
                border: "1px solid rgba(34,211,176,0.4)",
                color: TEAL,
                fontFamily: "Geist Mono, monospace",
                letterSpacing: "0.2em",
                fontSize: "11px",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: "2px",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "rgba(34,211,176,0.18)";
                el.style.boxShadow = "0 0 24px rgba(34,211,176,0.2)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "rgba(34,211,176,0.1)";
                el.style.boxShadow = "none";
              }}
            >
              Explore Pathways
            </button>
            <button
              type="button"
              data-ocid="humanon.hero.apply_button"
              onClick={() =>
                document
                  .getElementById("humanon-join")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                padding: "14px 32px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.8)",
                fontFamily: "Geist Mono, monospace",
                letterSpacing: "0.2em",
                fontSize: "11px",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: "2px",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "rgba(255,255,255,0.08)";
                el.style.borderColor = "rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "rgba(255,255,255,0.04)";
                el.style.borderColor = "rgba(255,255,255,0.15)";
              }}
            >
              Apply to HUMANON
            </button>
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

      {/* ═══════════════════════════════════ */}
      {/* SECTION 2 — TALENT ECOSYSTEM       */}
      {/* ═══════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 humanon-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: `${GOLD}b3` }}
            >
              ◆ TALENT ECOSYSTEM
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light"
              style={{
                letterSpacing: "0.06em",
                background: `linear-gradient(135deg, ${TEAL}, #ffffff)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              What HUMANON Builds
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {overviewData.map((item, i) => {
              const isOpen = expandedOverview === i;
              return (
                <div
                  key={item.title}
                  data-ocid={`humanon.overview.card.${i + 1}`}
                  className="humanon-reveal reveal"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedOverview(isOpen ? null : i)}
                    className="w-full text-left rounded-sm transition-all duration-300"
                    style={{
                      background: isOpen
                        ? "rgba(34,211,176,0.06)"
                        : "rgba(255,255,255,0.03)",
                      border: `1px solid ${isOpen ? "rgba(34,211,176,0.35)" : "rgba(255,255,255,0.08)"}`,
                      borderTop: `2px solid ${isOpen ? TEAL : "rgba(34,211,176,0.3)"}`,
                      padding: "24px",
                      cursor: "pointer",
                      boxShadow: isOpen
                        ? "0 0 24px rgba(34,211,176,0.08)"
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isOpen) {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.background = "rgba(255,255,255,0.05)";
                        el.style.transform = "translateY(-3px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isOpen) {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.background = "rgba(255,255,255,0.03)";
                        el.style.transform = "none";
                      }
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span
                        className="text-2xl animate-glyph-pulse"
                        style={{ color: `${TEAL}80` }}
                        aria-hidden="true"
                      >
                        {item.glyph}
                      </span>
                      <span
                        style={{
                          fontFamily: "Geist Mono, monospace",
                          fontSize: "16px",
                          color: `${TEAL}80`,
                          transform: isOpen ? "rotate(180deg)" : "none",
                          transition: "transform 0.3s ease",
                          display: "inline-block",
                        }}
                      >
                        ▾
                      </span>
                    </div>
                    <div
                      className="font-mono-geist text-[10px] tracking-[0.2em] uppercase mb-2"
                      style={{ color: TEAL }}
                    >
                      {item.title}
                    </div>
                    <p
                      className="text-xs leading-relaxed"
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontFamily: "Sora, sans-serif",
                      }}
                    >
                      {item.preview}
                    </p>

                    {isOpen && (
                      <div
                        className="mt-4 pt-4 animate-fade-in-up"
                        style={{ borderTop: "1px solid rgba(34,211,176,0.15)" }}
                      >
                        <p
                          className="text-sm leading-relaxed"
                          style={{
                            color: "rgba(255,255,255,0.65)",
                            fontFamily: "Sora, sans-serif",
                          }}
                        >
                          {item.detail}
                        </p>
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════ */}
      {/* SECTION 3 — GLOBAL MAP             */}
      {/* ═══════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 humanon-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: `${GOLD}b3` }}
            >
              ◈ GLOBAL REACH
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light mb-4"
              style={{
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Where HUMANON Operates
            </h2>
          </div>

          {/* Desktop map */}
          <div
            className="hidden md:block humanon-reveal reveal glass-strong rounded-sm p-6"
            style={{ transitionDelay: "0.1s" }}
          >
            <WorldMap />
            <p
              className="font-mono-geist text-[9px] text-center mt-4"
              style={{
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.1em",
              }}
            >
              Map reflects active HUMANON cohort locations. Data updated per
              cohort cycle.
            </p>
          </div>

          {/* Mobile list */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {REGION_DATA.map((region, i) => (
              <div
                key={region.name}
                className="humanon-reveal reveal flex items-center justify-between px-5 py-4 rounded-sm"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderLeft: `2px solid ${TEAL}`,
                  transitionDelay: `${i * 0.06}s`,
                }}
              >
                <div>
                  <div
                    className="font-mono-geist text-[10px] tracking-[0.15em] uppercase"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    {region.name}
                  </div>
                </div>
                <div
                  className="font-display text-xl font-light"
                  style={{ color: TEAL }}
                >
                  {region.count}
                  <span
                    className="font-mono-geist text-xs ml-1"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    fellows
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════ */}
      {/* SECTION 4 — PARTICIPATION PATHWAYS */}
      {/* ═══════════════════════════════════ */}
      <section id="humanon-pathways" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 humanon-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: `${GOLD}b3` }}
            >
              ◇ PARTICIPATION PATHWAYS
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light"
              style={{
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Five Entry Routes into HUMANON
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PATHWAYS.map((pw, i) => {
              const isOpen = expandedPathway === i;
              return (
                <div
                  key={pw.num}
                  data-ocid={`humanon.pathway.card.${i + 1}`}
                  className={`humanon-reveal reveal ${i === 4 ? "md:col-span-2" : ""}`}
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedPathway(isOpen ? null : i)}
                    className="w-full text-left rounded-sm transition-all duration-300"
                    style={{
                      background: isOpen
                        ? `rgba(${pw.color === TEAL ? "34,211,176" : pw.color === BLUE ? "74,126,247" : pw.color === GOLD ? "212,160,23" : pw.color === "#a78bfa" ? "167,139,250" : "52,211,153"},0.06)`
                        : "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderLeft: `3px solid ${pw.color}`,
                      padding: "24px",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.transform = "translateX(3px)";
                      el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.transform = "none";
                      el.style.boxShadow = "none";
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4 mb-4">
                        <span
                          className="font-mono-geist text-sm font-bold"
                          style={{
                            color: `${pw.color}99`,
                            letterSpacing: "0.1em",
                          }}
                        >
                          {pw.num}
                        </span>
                        <div>
                          <div
                            className="font-display text-lg font-light tracking-wide"
                            style={{ color: "rgba(255,255,255,0.88)" }}
                          >
                            {pw.title}
                          </div>
                          <span
                            className="inline-block mt-1 font-mono-geist text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-sm"
                            style={{
                              background: `${pw.color}18`,
                              color: pw.color,
                              border: `1px solid ${pw.color}33`,
                            }}
                          >
                            {pw.duration}
                          </span>
                        </div>
                      </div>
                      <span
                        style={{
                          fontFamily: "Geist Mono, monospace",
                          fontSize: "16px",
                          color: "rgba(255,255,255,0.3)",
                          transform: isOpen ? "rotate(180deg)" : "none",
                          transition: "transform 0.3s ease",
                          display: "inline-block",
                          flexShrink: 0,
                        }}
                      >
                        ▾
                      </span>
                    </div>

                    {isOpen && (
                      <div className="mt-2 space-y-3 animate-fade-in-up text-left">
                        {[
                          { label: "Eligibility", val: pw.eligibility },
                          { label: "Contributions", val: pw.contributions },
                          { label: "Outcomes", val: pw.outcomes },
                        ].map(({ label, val }) => (
                          <div key={label}>
                            <div
                              className="font-mono-geist text-[9px] tracking-[0.2em] uppercase mb-1"
                              style={{ color: `${pw.color}99` }}
                            >
                              {label}
                            </div>
                            <p
                              className="text-xs leading-relaxed"
                              style={{
                                color: "rgba(255,255,255,0.6)",
                                fontFamily: "Sora, sans-serif",
                              }}
                            >
                              {val}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════ */}
      {/* SECTION 5 — PROGRAM STRUCTURE      */}
      {/* ═══════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 humanon-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: `${GOLD}b3` }}
            >
              ◈ PROGRAM STRUCTURE
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light"
              style={{
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              How HUMANON Works
            </h2>
          </div>

          {/* Desktop horizontal timeline */}
          <div
            className="hidden md:block humanon-reveal reveal"
            style={{ transitionDelay: "0.1s" }}
          >
            <div className="relative flex items-start justify-between gap-2">
              {TIMELINE_STEPS.map((step, i) => {
                const isActive = activeTimelineStep === i;
                return (
                  <div
                    key={step.label}
                    className="flex-1 flex flex-col items-center relative"
                  >
                    {/* Connector line */}
                    {i < TIMELINE_STEPS.length - 1 && (
                      <div
                        className="absolute top-6 left-1/2 w-full h-px"
                        style={{
                          background: isActive
                            ? `linear-gradient(90deg, ${TEAL}, rgba(34,211,176,0.2))`
                            : "rgba(255,255,255,0.08)",
                          transition: "background 0.5s ease",
                          zIndex: 0,
                        }}
                      />
                    )}

                    {/* Node circle */}
                    <div
                      className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 mb-3"
                      style={{
                        background: isActive
                          ? "rgba(34,211,176,0.15)"
                          : "rgba(255,255,255,0.04)",
                        border: `2px solid ${isActive ? TEAL : "rgba(255,255,255,0.12)"}`,
                        boxShadow: isActive
                          ? "0 0 20px rgba(34,211,176,0.3)"
                          : "none",
                      }}
                    >
                      <span
                        className="font-mono-geist text-[10px]"
                        style={{
                          color: isActive ? TEAL : "rgba(255,255,255,0.3)",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Label */}
                    <div
                      className="font-mono-geist text-[9px] tracking-[0.15em] uppercase text-center transition-colors duration-500"
                      style={{
                        color: isActive
                          ? "rgba(255,255,255,0.9)"
                          : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {step.label}
                    </div>

                    {/* Detail tooltip */}
                    {isActive && (
                      <div
                        className="absolute top-16 z-20 p-3 rounded-sm animate-fade-in-up"
                        style={{
                          background: "rgba(4,5,14,0.95)",
                          border: "1px solid rgba(34,211,176,0.3)",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                          width: "160px",
                          left: "50%",
                          transform: "translateX(-50%)",
                        }}
                      >
                        <p
                          className="text-[10px] leading-relaxed"
                          style={{
                            color: "rgba(255,255,255,0.65)",
                            fontFamily: "Sora, sans-serif",
                          }}
                        >
                          {step.detail}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ height: "110px" }} />
          </div>

          {/* Mobile vertical timeline */}
          <div className="md:hidden space-y-4 humanon-reveal reveal">
            {TIMELINE_STEPS.map((step, i) => {
              const isActive = activeTimelineStep === i;
              return (
                <div
                  key={step.label}
                  className="flex gap-4 transition-all duration-500"
                  style={{
                    background: isActive
                      ? "rgba(34,211,176,0.05)"
                      : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isActive ? "rgba(34,211,176,0.3)" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: "2px",
                    padding: "16px",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: isActive
                        ? "rgba(34,211,176,0.15)"
                        : "rgba(255,255,255,0.04)",
                      border: `1px solid ${isActive ? TEAL : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    <span
                      className="font-mono-geist text-[9px]"
                      style={{
                        color: isActive ? TEAL : "rgba(255,255,255,0.3)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <div
                      className="font-mono-geist text-[10px] tracking-[0.15em] uppercase mb-1"
                      style={{
                        color: isActive ? TEAL : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {step.label}
                    </div>
                    <p
                      className="text-xs leading-relaxed"
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontFamily: "Sora, sans-serif",
                      }}
                    >
                      {step.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* SECTION 6 — INDUSTRY COLLABORATION     */}
      {/* ═══════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 humanon-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: `${GOLD}b3` }}
            >
              ◆ INDUSTRY MODEL
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light"
              style={{
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              The Pipeline
            </h2>
          </div>

          {/* Desktop horizontal flow */}
          <div
            className="hidden md:flex items-stretch gap-2 humanon-reveal reveal"
            style={{ transitionDelay: "0.1s" }}
          >
            {INDUSTRY_STEPS.map((step, i) => {
              const isActive = activeIndustryStep === i;
              return (
                <div
                  key={step.label}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className="w-full flex-1 p-5 rounded-sm text-center transition-all duration-500"
                    style={{
                      background: isActive
                        ? `${step.color}14`
                        : "rgba(255,255,255,0.03)",
                      border: `1px solid ${isActive ? `${step.color}55` : "rgba(255,255,255,0.07)"}`,
                      boxShadow: isActive ? `0 0 24px ${step.color}20` : "none",
                      transform: isActive ? "scale(1.03)" : "scale(1)",
                    }}
                  >
                    <div
                      className="font-mono-geist text-[9px] tracking-[0.2em] uppercase mb-2"
                      style={{ color: "rgba(255,255,255,0.25)" }}
                    >
                      STEP {String(i + 1).padStart(2, "0")}
                    </div>
                    <div
                      className="font-display text-sm font-light tracking-wide uppercase mb-3 transition-colors duration-500"
                      style={{
                        color: isActive ? step.color : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {step.label}
                    </div>
                    <p
                      className="text-[10px] leading-relaxed"
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontFamily: "Sora, sans-serif",
                      }}
                    >
                      {step.desc}
                    </p>
                  </div>
                  {i < INDUSTRY_STEPS.length - 1 && (
                    <div
                      className="font-mono-geist text-xs mt-2"
                      style={{
                        color: isActive ? step.color : "rgba(255,255,255,0.15)",
                        transition: "color 0.5s ease",
                      }}
                    >
                      →
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile vertical stack */}
          <div className="md:hidden flex flex-col gap-0 humanon-reveal reveal">
            {INDUSTRY_STEPS.map((step, i) => {
              const isActive = activeIndustryStep === i;
              return (
                <div key={step.label} className="flex flex-col items-center">
                  <div
                    className="w-full px-6 py-5 rounded-sm text-center transition-all duration-500"
                    style={{
                      background: isActive
                        ? `${step.color}14`
                        : "rgba(255,255,255,0.03)",
                      border: `1px solid ${isActive ? `${step.color}55` : "rgba(255,255,255,0.07)"}`,
                      boxShadow: isActive ? `0 0 20px ${step.color}22` : "none",
                      transform: isActive ? "scale(1.02)" : "scale(1)",
                    }}
                  >
                    <div
                      className="font-mono-geist text-[9px] tracking-[0.2em] uppercase mb-1"
                      style={{ color: "rgba(255,255,255,0.25)" }}
                    >
                      STEP {String(i + 1).padStart(2, "0")}
                    </div>
                    <div
                      className="font-display text-base font-light uppercase"
                      style={{
                        color: isActive ? step.color : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {step.label}
                    </div>
                  </div>
                  {i < INDUSTRY_STEPS.length - 1 && (
                    <div
                      className="py-2 font-mono-geist text-xs"
                      style={{
                        color: isActive ? step.color : "rgba(255,255,255,0.15)",
                      }}
                    >
                      ↓
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════ */}
      {/* SECTION 7 — MENTOR NETWORK         */}
      {/* ═══════════════════════════════════ */}
      <section id="humanon-mentors" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 humanon-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: `${GOLD}b3` }}
            >
              ◇ MENTOR NETWORK
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light mb-3"
              style={{
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Guided by Practitioners
            </h2>
            <p
              className="text-sm"
              style={{
                color: "rgba(255,255,255,0.45)",
                fontFamily: "Sora, sans-serif",
                maxWidth: "500px",
              }}
            >
              Every HUMANON participant is matched with an active professional
              or researcher — not a retired academic.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mentorsLoading
              ? ["m1", "m2", "m3", "m4", "m5", "m6"].map((k) => (
                  <MentorCardSkeleton key={k} />
                ))
              : displayMentors.map((mentor, i) => (
                  <div
                    key={String(mentor.id)}
                    className="humanon-reveal reveal rounded-sm p-5 transition-all duration-300"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderLeft: `2px solid ${TEAL}`,
                      transitionDelay: `${i * 0.06}s`,
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.transform = "translateY(-4px)";
                      el.style.borderLeftColor = `${TEAL}cc`;
                      el.style.boxShadow =
                        "0 8px 32px rgba(0,0,0,0.3), 0 0 20px rgba(34,211,176,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.transform = "none";
                      el.style.borderLeftColor = TEAL;
                      el.style.boxShadow = "none";
                    }}
                  >
                    <div
                      className="font-display text-lg font-light mb-2"
                      style={{
                        color: "rgba(255,255,255,0.88)",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {mentor.name}
                    </div>
                    <span
                      className="inline-block font-mono-geist text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-sm mb-3"
                      style={{
                        background: `${TEAL}18`,
                        color: TEAL,
                        border: `1px solid ${TEAL}33`,
                      }}
                    >
                      {mentor.domain}
                    </span>
                    <div
                      className="font-mono-geist text-[10px] mb-1"
                      style={{
                        color: "rgba(255,255,255,0.35)",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {mentor.organization}
                    </div>
                    <div
                      className="text-xs"
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontFamily: "Sora, sans-serif",
                      }}
                    >
                      {mentor.role}
                    </div>
                    {mentor.profileUrl && (
                      <a
                        href={mentor.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 font-mono-geist text-[9px] tracking-[0.15em] uppercase"
                        style={{ color: `${TEAL}80`, textDecoration: "none" }}
                      >
                        → Profile
                      </a>
                    )}
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════ */}
      {/* SECTION 8 — PARTICIPANT PROJECTS   */}
      {/* ═══════════════════════════════════ */}
      <section id="humanon-projects" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 humanon-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: `${GOLD}b3` }}
            >
              ◈ PARTICIPANT PROJECTS
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light mb-3"
              style={{
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Work That Matters
            </h2>
            <p
              className="text-sm"
              style={{
                color: "rgba(255,255,255,0.45)",
                fontFamily: "Sora, sans-serif",
                maxWidth: "500px",
              }}
            >
              These are real research contributions made by HUMANON
              participants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projectsLoading
              ? ["p1", "p2", "p3", "p4"].map((k) => (
                  <ProjectCardSkeleton key={k} />
                ))
              : displayProjects.map((project, i) => {
                  const domainColor = getDomainColor(project.researchDomain);
                  return (
                    <div
                      key={String(project.id)}
                      data-ocid={`humanon.project.card.${i + 1}`}
                      className="humanon-reveal reveal rounded-sm overflow-hidden transition-all duration-300"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        transitionDelay: `${i * 0.08}s`,
                        position: "relative",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.transform = "translateY(-3px)";
                        el.style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)";
                        const scanLine = el.querySelector(
                          ".scan-line",
                        ) as HTMLDivElement;
                        if (scanLine) scanLine.style.opacity = "1";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.transform = "none";
                        el.style.boxShadow = "none";
                        const scanLine = el.querySelector(
                          ".scan-line",
                        ) as HTMLDivElement;
                        if (scanLine) scanLine.style.opacity = "0";
                      }}
                    >
                      {/* Scan line */}
                      <div
                        className="scan-line absolute inset-0 pointer-events-none"
                        style={{
                          background: `linear-gradient(to bottom, transparent 0%, ${domainColor}15 50%, transparent 100%)`,
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                          zIndex: 0,
                        }}
                      />

                      {/* Domain accent bar */}
                      <div
                        style={{
                          height: "3px",
                          background: `linear-gradient(90deg, ${domainColor}cc, transparent)`,
                        }}
                      />

                      <div className="p-6 relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <h3
                            className="font-display text-xl font-light"
                            style={{
                              color: "rgba(255,255,255,0.88)",
                              lineHeight: 1.3,
                              flex: 1,
                            }}
                          >
                            {project.title}
                          </h3>
                        </div>

                        <span
                          className="inline-block font-mono-geist text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-sm mb-3"
                          style={{
                            background: `${domainColor}18`,
                            color: domainColor,
                            border: `1px solid ${domainColor}33`,
                          }}
                        >
                          {project.researchDomain}
                        </span>

                        <div
                          className="font-mono-geist text-[10px] mb-3"
                          style={{
                            color: "rgba(255,255,255,0.35)",
                            letterSpacing: "0.08em",
                          }}
                        >
                          {project.participantTeam}
                        </div>

                        <p
                          className="text-sm leading-relaxed mb-5"
                          style={{
                            color: "rgba(255,255,255,0.55)",
                            fontFamily: "Sora, sans-serif",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {project.summary}
                        </p>

                        <button
                          type="button"
                          data-ocid={`humanon.project.open_modal_button.${i + 1}`}
                          onClick={() => setSelectedProject(project)}
                          className="font-mono-geist text-[10px] tracking-[0.2em] uppercase transition-all duration-200"
                          style={{
                            background: "none",
                            border: `1px solid ${domainColor}44`,
                            color: domainColor,
                            padding: "7px 16px",
                            cursor: "pointer",
                            borderRadius: "2px",
                          }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLButtonElement;
                            el.style.background = `${domainColor}12`;
                            el.style.borderColor = `${domainColor}88`;
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLButtonElement;
                            el.style.background = "none";
                            el.style.borderColor = `${domainColor}44`;
                          }}
                        >
                          View Project →
                        </button>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════ */}
      {/* SECTION 9 — SUCCESS METRICS        */}
      {/* ═══════════════════════════════════ */}
      <section id="humanon-metrics" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 humanon-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: `${GOLD}b3` }}
            >
              ◆ SUCCESS METRICS
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light"
              style={{
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Measured Impact
            </h2>
          </div>

          {/* Counter grid */}
          <div
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12 humanon-reveal reveal"
            style={{ transitionDelay: "0.1s" }}
          >
            {METRICS_LABELS.map((m, i) => {
              const statsMap: Record<string, bigint> = stats
                ? {
                    participantsEnrolled: stats.participantsEnrolled,
                    projectsCompleted: stats.projectsCompleted,
                    industryPartners: stats.industryPartners,
                    careerPlacements: stats.careerPlacements,
                    countriesRepresented: stats.countriesRepresented,
                  }
                : {};
              const rawVal = stats
                ? Number(statsMap[m.key] ?? 0n)
                : [30, 8, 4, 22, 6][i];
              return (
                <div
                  key={m.key}
                  className="glass-strong rounded-sm p-5 text-center"
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <CountUp target={rawVal} color={m.color} />
                  <div
                    className="font-mono-geist text-[9px] tracking-[0.2em] uppercase mt-3"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    {m.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Metric bars */}
          <div
            className="glass-strong p-8 rounded-sm humanon-reveal reveal space-y-7"
            style={{ transitionDelay: "0.2s" }}
          >
            {METRIC_BARS.map((m, i) => (
              <MetricBar
                key={m.label}
                label={m.label}
                value={m.value}
                color={m.color}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════ */}
      {/* SECTION 10 — JOIN HUMANON          */}
      {/* ═══════════════════════════════════ */}
      <section id="humanon-join" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 humanon-reveal reveal text-center">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: `${GOLD}b3` }}
            >
              ◇ JOIN THE ECOSYSTEM
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light mb-4"
              style={{
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Build the Future With Us
            </h2>
            <p
              className="text-sm"
              style={{
                color: "rgba(255,255,255,0.45)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              Three ways to participate in HUMANON's global research ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Participant */}
            <div
              className="humanon-reveal reveal rounded-sm p-7 flex flex-col"
              style={{
                background: "rgba(34,211,176,0.04)",
                border: "1px solid rgba(34,211,176,0.15)",
                borderTop: `2px solid ${TEAL}`,
              }}
            >
              <div className="text-3xl mb-4" style={{ color: `${TEAL}80` }}>
                ◈
              </div>
              <h3
                className="font-display text-xl font-light mb-2"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                Apply as Participant
              </h3>
              <p
                className="text-sm leading-relaxed mb-6 flex-1"
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                Begin a structured research journey. Open to students,
                researchers, and career transitioners globally.
              </p>
              <button
                type="button"
                data-ocid="humanon.join.participant_button"
                onClick={() => setJoinVariant("participant")}
                style={{
                  padding: "12px",
                  background: "rgba(34,211,176,0.1)",
                  border: "1px solid rgba(34,211,176,0.35)",
                  color: TEAL,
                  fontFamily: "Geist Mono, monospace",
                  letterSpacing: "0.15em",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  borderRadius: "2px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "rgba(34,211,176,0.18)";
                  el.style.boxShadow = "0 0 20px rgba(34,211,176,0.15)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "rgba(34,211,176,0.1)";
                  el.style.boxShadow = "none";
                }}
              >
                Start Application
              </button>
            </div>

            {/* Mentor */}
            <div
              className="humanon-reveal reveal rounded-sm p-7 flex flex-col"
              style={{
                background: "rgba(212,160,23,0.04)",
                border: "1px solid rgba(212,160,23,0.15)",
                borderTop: `2px solid ${GOLD}`,
                transitionDelay: "0.1s",
              }}
            >
              <div className="text-3xl mb-4" style={{ color: `${GOLD}80` }}>
                ◇
              </div>
              <h3
                className="font-display text-xl font-light mb-2"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                Become a Mentor
              </h3>
              <p
                className="text-sm leading-relaxed mb-6 flex-1"
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                Share your expertise with emerging researchers making real
                contributions.
              </p>
              <button
                type="button"
                data-ocid="humanon.join.mentor_button"
                onClick={() => setJoinVariant("mentor")}
                style={{
                  padding: "12px",
                  background: "rgba(212,160,23,0.1)",
                  border: "1px solid rgba(212,160,23,0.35)",
                  color: GOLD,
                  fontFamily: "Geist Mono, monospace",
                  letterSpacing: "0.15em",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  borderRadius: "2px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "rgba(212,160,23,0.18)";
                  el.style.boxShadow = "0 0 20px rgba(212,160,23,0.15)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "rgba(212,160,23,0.1)";
                  el.style.boxShadow = "none";
                }}
              >
                Register as Mentor
              </button>
            </div>

            {/* Industry */}
            <div
              className="humanon-reveal reveal rounded-sm p-7 flex flex-col"
              style={{
                background: "rgba(74,126,247,0.04)",
                border: "1px solid rgba(74,126,247,0.15)",
                borderTop: `2px solid ${BLUE}`,
                transitionDelay: "0.2s",
              }}
            >
              <div className="text-3xl mb-4" style={{ color: `${BLUE}80` }}>
                ◆
              </div>
              <h3
                className="font-display text-xl font-light mb-2"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                Partner as Industry
              </h3>
              <p
                className="text-sm leading-relaxed mb-6 flex-1"
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                Bring your unsolved challenges to HUMANON's research teams.
              </p>
              <button
                type="button"
                data-ocid="humanon.join.industry_button"
                onClick={() => setJoinVariant("industry")}
                style={{
                  padding: "12px",
                  background: "rgba(74,126,247,0.1)",
                  border: "1px solid rgba(74,126,247,0.35)",
                  color: BLUE,
                  fontFamily: "Geist Mono, monospace",
                  letterSpacing: "0.15em",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  borderRadius: "2px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "rgba(74,126,247,0.18)";
                  el.style.boxShadow = "0 0 20px rgba(74,126,247,0.15)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "rgba(74,126,247,0.1)";
                  el.style.boxShadow = "none";
                }}
              >
                Propose Partnership
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════ */}
      {/* LEGAL FOOTER                       */}
      {/* ═══════════════════════════════════ */}
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

      {/* ═══════════════════════════════════ */}
      {/* PROJECT DETAIL MODAL               */}
      {/* ═══════════════════════════════════ */}
      <Dialog
        open={!!selectedProject}
        onOpenChange={(open) => {
          if (!open) setSelectedProject(null);
        }}
      >
        <DialogContent
          data-ocid="humanon.project.dialog"
          className="max-w-2xl w-full"
          style={{
            background: "rgba(4,5,14,0.97)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "4px",
          }}
        >
          {selectedProject && (
            <>
              <DialogHeader>
                <div
                  style={{
                    height: "3px",
                    background: `linear-gradient(90deg, ${getDomainColor(selectedProject.researchDomain)}, transparent)`,
                    marginBottom: "16px",
                    marginLeft: "-24px",
                    marginRight: "-24px",
                  }}
                />
                <DialogTitle asChild>
                  <h2
                    className="font-display text-2xl font-light"
                    style={{ color: "rgba(255,255,255,0.9)", lineHeight: 1.3 }}
                  >
                    {selectedProject.title}
                  </h2>
                </DialogTitle>
                <span
                  className="inline-block font-mono-geist text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-sm mt-2"
                  style={{
                    background: `${getDomainColor(selectedProject.researchDomain)}18`,
                    color: getDomainColor(selectedProject.researchDomain),
                    border: `1px solid ${getDomainColor(selectedProject.researchDomain)}33`,
                  }}
                >
                  {selectedProject.researchDomain}
                </span>
              </DialogHeader>

              <div className="space-y-5 mt-4">
                <div>
                  <div
                    className="font-mono-geist text-[9px] tracking-[0.25em] uppercase mb-2"
                    style={{ color: `${GOLD}99` }}
                  >
                    Participant Team
                  </div>
                  <p
                    className="text-sm"
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontFamily: "Sora, sans-serif",
                    }}
                  >
                    {selectedProject.participantTeam}
                  </p>
                </div>

                <div>
                  <div
                    className="font-mono-geist text-[9px] tracking-[0.25em] uppercase mb-2"
                    style={{ color: `${GOLD}99` }}
                  >
                    Research Overview
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: "rgba(255,255,255,0.65)",
                      fontFamily: "Sora, sans-serif",
                    }}
                  >
                    {selectedProject.summary}
                  </p>
                </div>

                <div
                  className="p-4 rounded-sm"
                  style={{
                    background: "rgba(34,211,176,0.05)",
                    border: "1px solid rgba(34,211,176,0.15)",
                  }}
                >
                  <div
                    className="font-mono-geist text-[9px] tracking-[0.25em] uppercase mb-2"
                    style={{ color: TEAL }}
                  >
                    Research Outcome
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontFamily: "Sora, sans-serif",
                    }}
                  >
                    {selectedProject.outcome}
                  </p>
                </div>

                {selectedProject.mentorsInvolved && (
                  <div>
                    <div
                      className="font-mono-geist text-[9px] tracking-[0.25em] uppercase mb-2"
                      style={{ color: `${GOLD}99` }}
                    >
                      Mentors Involved
                    </div>
                    <p
                      className="text-sm"
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontFamily: "Sora, sans-serif",
                      }}
                    >
                      {selectedProject.mentorsInvolved}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  data-ocid="humanon.project.close_button"
                  onClick={() => setSelectedProject(null)}
                  style={{
                    padding: "8px 20px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "Geist Mono, monospace",
                    letterSpacing: "0.15em",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    borderRadius: "2px",
                  }}
                >
                  CLOSE
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════ */}
      {/* JOIN FORM MODAL                    */}
      {/* ═══════════════════════════════════ */}
      <Dialog
        open={!!joinVariant}
        onOpenChange={(open) => {
          if (!open) setJoinVariant(null);
        }}
      >
        <DialogContent
          className="max-w-md w-full"
          style={{
            background: "rgba(4,5,14,0.97)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "4px",
          }}
        >
          {joinVariant && (
            <>
              <DialogHeader>
                <DialogTitle asChild>
                  <h2
                    className="font-display text-xl font-light"
                    style={{ color: "rgba(255,255,255,0.9)" }}
                  >
                    {joinVariant === "participant"
                      ? "Apply as Participant"
                      : joinVariant === "mentor"
                        ? "Register as Mentor"
                        : "Propose Industry Partnership"}
                  </h2>
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <JoinForm
                  variant={joinVariant}
                  onClose={() => setJoinVariant(null)}
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
