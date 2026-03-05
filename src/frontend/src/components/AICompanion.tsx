import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getTopInteractions, recordInteraction } from "../ai/behaviorTracker";
import { mountLivingField, unmountLivingField } from "../ai/field/LivingField";
import type { FieldMode } from "../ai/field/LivingField";
import type { LivingFieldEngine } from "../ai/field/fieldEngine";
import { INTELLIGENCE_STEPS } from "../ai/intelligenceMode";
import { detectActiveSection } from "../ai/scrollContext";
import { semanticSearch } from "../ai/semanticEngine";

// ── Types ─────────────────────────────────────────────────────────────────────

type CompanionMode = "intelligence" | "graph" | "cosmic";

interface AICompanionProps {
  isOpen: boolean;
  onClose: () => void;
  currentSection: string;
  onScrollTo: (id: string) => void;
  onNavigatePillar: (page: string) => void;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PREDEFINED_PROMPTS = [
  {
    id: "model",
    label: "What is STEMONEF's enterprise model?",
    answer: `STEMONEF ENTERPRISES operates as a Social Science Enterprise — a hybrid institutional system that integrates Research & Development, Intelligence Synthesis, Ethical Oversight, Media Translation, Talent Incubation, Climate Research, Equity Funding, and Humanitarian Development.

The enterprise model is structured around seven interdependent pillars: EPOCHS (R&D), HUMANON (Talent), STEAMI (Intelligence), NOVA (Media), TERRA (Climate), EQUIS (Equity), and ETHOS (Governance).

Revenue generated through commercial arms is constitutionally reinvested into mission-critical impact programs. This creates a self-sustaining institutional cycle.`,
  },
  {
    id: "reinvestment",
    label: "How does revenue reinvestment work?",
    answer: `STEMONEF's revenue architecture is governed by the EQUIS pillar, which oversees all capital flows.

Commercial revenues from Deep Technology licensing, Intelligence Service contracts, NOVA Media productions, and EQUIS equity investments are pooled into the STEMONEF Impact Fund.

An independent allocation board — governed by ETHOS — distributes these funds according to quarterly mission priorities across EPOCHS, HUMANON, TERRA, and humanitarian programs.

All financial flows are published in the Annual Accountability Report, ensuring full public transparency.`,
  },
  {
    id: "ethics",
    label: "How are ethics enforced?",
    answer: `Ethical enforcement is the exclusive domain of ETHOS — STEMONEF's independent governance pillar.

ETHOS operates with constitutional independence — no executive, pillar, or external stakeholder can override its determinations.

Enforcement mechanisms include:
• Pre-deployment ethical review for all research outputs
• Quarterly compliance audits across all pillars
• Independent whistleblower protection system
• Public Ethics Charter with binding institutional commitments
• Annual external accountability review`,
  },
  {
    id: "climate",
    label: "Which vertical aligns with climate research?",
    answer: `TERRA is STEMONEF's dedicated Climate & Natural Life Research division.

Active climate initiatives include:
• Project GAIA — Planetary health index spanning 50 nations
• Reforestation Pilot — 12 active sites
• Ocean Systems Lab — Deep marine ecosystem monitoring
• Climate Equity Framework — Ensuring just transition for vulnerable populations

TERRA research feeds directly into STEAMI's intelligence synthesis, enabling evidence-based climate policy translation.`,
  },
  {
    id: "collaborate",
    label: "How can I collaborate?",
    answer: `STEMONEF engages institutional partners, research collaborators, ethical investors, industry alliances, and mission-aligned talent through structured pathways.

To collaborate:
1. Select your alignment pathway (Research, Talent, Intelligence, Climate, Media, or Equity)
2. Submit a collaboration inquiry via the engagement form
3. An institutional liaison will review and respond within 5 working days

Partnership opportunities are available for organizations seeking co-research, co-production, or strategic alignment with STEMONEF's mission verticals.`,
  },
];

const SECTION_SUGGESTIONS: Record<string, string> = {
  pillars: "Explore EPOCHS R&D or ETHOS governance frameworks in detail.",
  feed: "Review the latest climate or AI intelligence briefs from STEAMI.",
  mission:
    "Understand how revenue reinvestment sustains the impact architecture.",
  pathway:
    "Your selected pathway connects to HUMANON's talent progression system.",
  humanon: "The HUMANON pipeline accepts applications from all domains.",
  cta: "Collaboration inquiries are reviewed by institutional liaisons within 5 days.",
};

// ── Graph data ─────────────────────────────────────────────────────────────────

interface GraphNode {
  id: string;
  label: string;
  type: "core" | "pillar" | "project" | "section";
  x: number;
  y: number;
  page?: string;
  section?: string;
}

const GRAPH_NODES: GraphNode[] = [
  { id: "stemonef", label: "STEMONEF", type: "core", x: 0.5, y: 0.45 },
  {
    id: "epochs",
    label: "EPOCHS",
    type: "pillar",
    x: 0.2,
    y: 0.25,
    page: "epochs",
  },
  {
    id: "humanon",
    label: "HUMANON",
    type: "pillar",
    x: 0.5,
    y: 0.15,
    page: "humanon",
  },
  {
    id: "steami",
    label: "STEAMI",
    type: "pillar",
    x: 0.8,
    y: 0.25,
    page: "steami",
  },
  { id: "nova", label: "NOVA", type: "pillar", x: 0.85, y: 0.55, page: "nova" },
  {
    id: "terra",
    label: "TERRA",
    type: "pillar",
    x: 0.7,
    y: 0.78,
    page: "terra",
  },
  {
    id: "equis",
    label: "EQUIS",
    type: "pillar",
    x: 0.3,
    y: 0.78,
    page: "equis",
  },
  { id: "gaia", label: "Project GAIA", type: "project", x: 0.1, y: 0.55 },
  {
    id: "briefs",
    label: "Intel Briefs",
    type: "section",
    x: 0.92,
    y: 0.42,
    section: "feed",
  },
  {
    id: "cta",
    label: "Collaborate",
    type: "section",
    x: 0.5,
    y: 0.88,
    section: "cta",
  },
];

const GRAPH_EDGES: [string, string][] = [
  ["stemonef", "epochs"],
  ["stemonef", "humanon"],
  ["stemonef", "steami"],
  ["stemonef", "nova"],
  ["stemonef", "terra"],
  ["stemonef", "equis"],
  ["epochs", "gaia"],
  ["steami", "briefs"],
  ["stemonef", "cta"],
];

// ── Cosmic data ────────────────────────────────────────────────────────────────

interface CosmicNode {
  id: string;
  label: string;
  ring: 1 | 2;
  startAngle: number;
  speed: number;
  color: string;
  page: string;
  mandate: string;
  initiatives: string[];
}

const COSMIC_NODES: CosmicNode[] = [
  {
    id: "epochs",
    label: "EPOCHS",
    ring: 1,
    startAngle: 0,
    speed: 0.0003,
    color: "#4a7ef7",
    page: "epochs",
    mandate: "Research & Innovation",
    initiatives: ["Project GAIA", "LAB INVOS", "STEMESA"],
  },
  {
    id: "humanon",
    label: "HUMANON",
    ring: 1,
    startAngle: Math.PI * 0.66,
    speed: 0.00025,
    color: "#64c8f7",
    page: "humanon",
    mandate: "Talent Incubation",
    initiatives: ["Research Placement", "Industry Mentorship"],
  },
  {
    id: "steami",
    label: "STEAMI",
    ring: 1,
    startAngle: Math.PI * 1.33,
    speed: 0.00035,
    color: "#d4a017",
    page: "steami",
    mandate: "Intelligence Synthesis",
    initiatives: ["Intel Briefs", "Foresight Reports"],
  },
  {
    id: "nova",
    label: "NOVA",
    ring: 2,
    startAngle: Math.PI * 0.2,
    speed: 0.00018,
    color: "#a78bfa",
    page: "nova",
    mandate: "Media & Storytelling",
    initiatives: ["Launching Soon"],
  },
  {
    id: "terra",
    label: "TERRA",
    ring: 2,
    startAngle: Math.PI * 0.9,
    speed: 0.00022,
    color: "#34d399",
    page: "terra",
    mandate: "Climate Research",
    initiatives: ["Launching Soon"],
  },
  {
    id: "equis",
    label: "EQUIS",
    ring: 2,
    startAngle: Math.PI * 1.5,
    speed: 0.00015,
    color: "#fb923c",
    page: "equis",
    mandate: "Equity & Capital",
    initiatives: ["Launching Soon"],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitialMode(): CompanionMode {
  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return "intelligence";
  }
  const stored = localStorage.getItem("stemonef_companion_mode");
  if (stored === "graph" || stored === "cosmic" || stored === "intelligence") {
    return stored as CompanionMode;
  }
  return "intelligence";
}

function modeToFieldMode(mode: CompanionMode, section: string): FieldMode {
  if (mode === "cosmic") return "cosmic";
  const map: Record<string, FieldMode> = {
    epochs: "epochs",
    humanon: "humanon",
    steami: "steami",
  };
  return map[section] ?? "default";
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AICompanion({
  isOpen,
  onClose,
  currentSection: propSection,
  onScrollTo,
  onNavigatePillar,
}: AICompanionProps) {
  const [mode, setMode] = useState<CompanionMode>(getInitialMode);
  const [activeAnswer, setActiveAnswer] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [detectedSection, setDetectedSection] = useState(propSection);
  const [stepIndex, setStepIndex] = useState(0);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  const [isTablet, setIsTablet] = useState(
    typeof window !== "undefined"
      ? window.innerWidth >= 768 && window.innerWidth < 1024
      : false,
  );
  const [tooltipNode, setTooltipNode] = useState<GraphNode | null>(null);
  const [hoveredCosmicId, setHoveredCosmicId] = useState<string | null>(null);

  // Canvas refs
  const fieldCanvasRef = useRef<HTMLCanvasElement>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement>(null);
  const cosmicCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDialogElement>(null);

  // Engine ref (persists across renders without triggering re-render)
  const engineRef = useRef<LivingFieldEngine | null>(null);

  // Animation refs for graph/cosmic
  const graphFrameRef = useRef<number>(0);
  const cosmicFrameRef = useRef<number>(0);
  const graphLastRef = useRef<number>(0);
  const cosmicLastRef = useRef<number>(0);
  const cosmicAnglesRef = useRef<number[]>(
    COSMIC_NODES.map((n) => n.startAngle),
  );
  const graphDashRef = useRef<number>(0);

  // Responsive tracking
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsTablet(w >= 768 && w < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Refresh recommendations whenever panel opens
  useEffect(() => {
    if (isOpen) {
      setRecommendations(getTopInteractions().slice(0, 3));
    }
  }, [isOpen]);

  // Live scroll detection (intelligence mode only)
  useEffect(() => {
    if (!isOpen || mode !== "intelligence") return;
    const handler = () => setDetectedSection(detectActiveSection());
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [isOpen, mode]);

  // Keep in sync with prop
  useEffect(() => {
    setDetectedSection(propSection);
  }, [propSection]);

  // Mode persistence
  const handleModeChange = useCallback(
    (newMode: CompanionMode) => {
      // On mobile always stay in intelligence
      if (isMobile && newMode !== "intelligence") return;
      setMode(newMode);
      localStorage.setItem("stemonef_companion_mode", newMode);
    },
    [isMobile],
  );

  // ── Living Field engine ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !fieldCanvasRef.current) return;
    // Defer by one rAF so the dialog has been painted and has real dimensions
    let rafId: number;
    rafId = requestAnimationFrame(() => {
      if (!fieldCanvasRef.current) return;
      try {
        const engine = mountLivingField(fieldCanvasRef.current);
        engineRef.current = engine;
      } catch {
        // Canvas unavailable — degrade gracefully
      }
    });
    return () => {
      cancelAnimationFrame(rafId);
      unmountLivingField();
      engineRef.current = null;
    };
  }, [isOpen]);

  // Sync field mode
  useEffect(() => {
    if (!engineRef.current) return;
    engineRef.current.setMode(modeToFieldMode(mode, detectedSection));
  }, [mode, detectedSection]);

  // Resize field canvas when container changes
  useEffect(() => {
    if (!isOpen || !fieldCanvasRef.current || !containerRef.current) return;
    const ro = new ResizeObserver(() => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect && engineRef.current) {
        engineRef.current.resize(rect.width, rect.height);
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [isOpen]);

  // ── Knowledge Graph canvas ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || mode !== "graph" || !graphCanvasRef.current) return;
    // Wait one rAF so the expanded overlay has settled into its final dimensions
    // before we read getBoundingClientRect for the first resize()
    let setupRafId: number;
    const canvas = graphCanvasRef.current;

    // Hoist handlers so cleanup can reference them outside the rAF callback
    let graphMoveHandler: ((e: MouseEvent) => void) | null = null;
    let graphClickHandler: ((e: MouseEvent) => void) | null = null;

    setupRafId = requestAnimationFrame(() => {
      if (!canvas.getContext("2d")) return;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      let hoveredNode: string | null = null;
      const FPS = 30;
      const FRAME_MS = 1000 / FPS;

      function resize() {
        const dpr = window.devicePixelRatio || 1;
        const parent = canvas.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        ctx.scale(dpr, dpr);
      }

      resize();

      function getNodePos(node: GraphNode) {
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;
        return { x: node.x * w, y: node.y * h };
      }

      function nodeRadius(node: GraphNode) {
        if (node.type === "core") return 16;
        if (node.type === "pillar") return 10;
        return 7;
      }

      function nodeColor(node: GraphNode): string {
        if (node.type === "core") return "#d4a017";
        if (node.type === "pillar") return "#4a7ef7";
        if (node.type === "section") return "#64c8f7";
        return "rgba(200,220,255,0.7)";
      }

      function drawFrame(t: number) {
        if (t - graphLastRef.current < FRAME_MS) {
          graphFrameRef.current = requestAnimationFrame(drawFrame);
          return;
        }
        graphLastRef.current = t;
        graphDashRef.current += 0.3;

        const dpr = window.devicePixelRatio || 1;
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;

        ctx.clearRect(0, 0, w, h);

        // Draw edges
        for (const [aId, bId] of GRAPH_EDGES) {
          const na = GRAPH_NODES.find((n) => n.id === aId);
          const nb = GRAPH_NODES.find((n) => n.id === bId);
          if (!na || !nb) continue;
          const pa = getNodePos(na);
          const pb = getNodePos(nb);
          ctx.save();
          ctx.setLineDash([4, 8]);
          ctx.lineDashOffset = -graphDashRef.current;
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.strokeStyle = "rgba(74,126,247,0.25)";
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
        }

        // Draw nodes
        for (const node of GRAPH_NODES) {
          const pos = getNodePos(node);
          const r = nodeRadius(node);
          const isHovered = hoveredNode === node.id;
          const pulse = Math.sin(t * 0.002 + node.x * 10) * 0.5 + 0.5;
          const glowR = r + pulse * 4 + (isHovered ? 8 : 0);
          const color = nodeColor(node);

          // Glow halo
          const grad = ctx.createRadialGradient(
            pos.x,
            pos.y,
            0,
            pos.x,
            pos.y,
            glowR * 2,
          );
          const glowAlpha = isHovered ? 0.5 : 0.2;
          grad.addColorStop(
            0,
            `${color.replace(")", `,${glowAlpha})`).replace("rgb", "rgba")}`,
          );
          grad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, glowR * 2, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          // Core circle
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, r + (isHovered ? 2 : 0), 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = isHovered ? 1 : 0.85;
          ctx.fill();
          ctx.globalAlpha = 1;

          // Label
          ctx.font = `${isHovered ? "bold " : ""}9px "Geist Mono", monospace`;
          ctx.textAlign = "center";
          ctx.fillStyle = isHovered
            ? "rgba(255,255,255,0.95)"
            : "rgba(255,255,255,0.6)";
          ctx.fillText(node.label, pos.x, pos.y + r + 12);
        }

        graphFrameRef.current = requestAnimationFrame(drawFrame);
      }

      graphFrameRef.current = requestAnimationFrame(drawFrame);

      // Assign to outer-scoped refs so cleanup can deregister them
      graphMoveHandler = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        hoveredNode = null;
        for (const node of GRAPH_NODES) {
          const pos = getNodePos(node);
          const r = nodeRadius(node);
          const dx = mx - pos.x;
          const dy = my - pos.y;
          if (Math.sqrt(dx * dx + dy * dy) <= r + 8) {
            hoveredNode = node.id;
            break;
          }
        }
        canvas.style.cursor = hoveredNode ? "pointer" : "default";
      };

      graphClickHandler = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        for (const node of GRAPH_NODES) {
          const pos = getNodePos(node);
          const r = nodeRadius(node);
          const dx = mx - pos.x;
          const dy = my - pos.y;
          if (Math.sqrt(dx * dx + dy * dy) <= r + 8) {
            if (node.type === "pillar" && node.page) {
              onNavigatePillar(node.page);
            } else if (node.type === "section" && node.section) {
              onScrollTo(node.section);
            } else if (node.type === "project") {
              setTooltipNode(node);
            }
            break;
          }
        }
      };

      canvas.addEventListener("mousemove", graphMoveHandler);
      canvas.addEventListener("click", graphClickHandler);

      const ro = new ResizeObserver(resize);
      if (canvas.parentElement) ro.observe(canvas.parentElement);
    }); // close requestAnimationFrame wrapper

    return () => {
      cancelAnimationFrame(setupRafId);
      cancelAnimationFrame(graphFrameRef.current);
      if (graphMoveHandler)
        canvas.removeEventListener("mousemove", graphMoveHandler);
      if (graphClickHandler)
        canvas.removeEventListener("click", graphClickHandler);
    };
  }, [isOpen, mode, onNavigatePillar, onScrollTo]);

  // ── Cosmic System canvas ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || mode !== "cosmic" || !cosmicCanvasRef.current) return;
    // Defer by one rAF so the expanded overlay has painted and has real dimensions
    let setupRafId: number;
    const canvas = cosmicCanvasRef.current;

    // Hoist handlers so cleanup can reference them outside the rAF callback
    let cosmicMoveHandler: ((e: MouseEvent) => void) | null = null;
    let cosmicClickHandler: ((e: MouseEvent) => void) | null = null;

    setupRafId = requestAnimationFrame(() => {
      if (!canvas.getContext("2d")) return;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      const FPS = 30;
      const FRAME_MS = 1000 / FPS;

      // Trail storage: last N positions per planet
      const trails: { x: number; y: number }[][] = COSMIC_NODES.map(() => []);

      function resize() {
        const dpr = window.devicePixelRatio || 1;
        const parent = canvas.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        ctx.scale(dpr, dpr);
      }

      resize();

      let hoveredPlanet: string | null = null;

      function getCenter() {
        const dpr = window.devicePixelRatio || 1;
        return { cx: canvas.width / dpr / 2, cy: canvas.height / dpr / 2 };
      }

      function ringRadius(ring: 1 | 2) {
        const dpr = window.devicePixelRatio || 1;
        const minDim = Math.min(canvas.width / dpr, canvas.height / dpr);
        return ring === 1 ? minDim * 0.28 : minDim * 0.44;
      }

      function getPlanetPos(node: CosmicNode, angle: number) {
        const { cx, cy } = getCenter();
        const r = ringRadius(node.ring);
        return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
      }

      function drawFrame(t: number) {
        if (t - cosmicLastRef.current < FRAME_MS) {
          cosmicFrameRef.current = requestAnimationFrame(drawFrame);
          return;
        }
        const dt = t - cosmicLastRef.current;
        cosmicLastRef.current = t;

        const dpr = window.devicePixelRatio || 1;
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;
        const { cx, cy } = getCenter();

        ctx.clearRect(0, 0, w, h);

        // Orbit rings
        for (const ring of [1, 2] as const) {
          const r = ringRadius(ring);
          ctx.save();
          ctx.setLineDash([4, 12]);
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255,255,255,0.06)";
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
        }

        // Update angles & draw trails + planets
        for (let i = 0; i < COSMIC_NODES.length; i++) {
          const node = COSMIC_NODES[i];
          cosmicAnglesRef.current[i] += node.speed * dt;
          const angle = cosmicAnglesRef.current[i];
          const pos = getPlanetPos(node, angle);

          // Trail
          trails[i].push({ ...pos });
          if (trails[i].length > 5) trails[i].shift();
          for (let j = 0; j < trails[i].length - 1; j++) {
            const tp = trails[i][j];
            const alpha = ((j + 1) / trails[i].length) * 0.2;
            ctx.beginPath();
            ctx.arc(tp.x, tp.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `${node.color}${Math.round(alpha * 255)
              .toString(16)
              .padStart(2, "0")}`;
            ctx.fill();
          }

          const isHovered = hoveredPlanet === node.id;
          const planetR = node.ring === 1 ? 7 : 5;

          // Planet glow
          const glowGrad = ctx.createRadialGradient(
            pos.x,
            pos.y,
            0,
            pos.x,
            pos.y,
            planetR * 4,
          );
          glowGrad.addColorStop(0, `${node.color}66`);
          glowGrad.addColorStop(1, `${node.color}00`);
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, planetR * (isHovered ? 5 : 4), 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();

          // Planet core
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, planetR + (isHovered ? 2 : 0), 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.fill();

          // Planet label
          ctx.font = '8px "Geist Mono", monospace';
          ctx.textAlign = "center";
          ctx.fillStyle = isHovered
            ? "rgba(255,255,255,0.95)"
            : "rgba(255,255,255,0.55)";
          ctx.fillText(node.label, pos.x, pos.y + planetR + 11);
        }

        // Central star — STEMONEF
        const starPulse = Math.sin(t * 0.002) * 0.5 + 0.5;
        const starR = 14 + starPulse * 3;

        const starGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, starR * 3);
        starGrad.addColorStop(0, "rgba(212,160,23,0.9)");
        starGrad.addColorStop(0.4, "rgba(212,160,23,0.3)");
        starGrad.addColorStop(1, "rgba(212,160,23,0)");
        ctx.beginPath();
        ctx.arc(cx, cy, starR * 3, 0, Math.PI * 2);
        ctx.fillStyle = starGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, starR, 0, Math.PI * 2);
        ctx.fillStyle = "#d4a017";
        ctx.fill();

        ctx.font = 'bold 8px "Geist Mono", monospace';
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.fillText("STEMONEF", cx, cy + starR + 12);

        cosmicFrameRef.current = requestAnimationFrame(drawFrame);
      }

      cosmicFrameRef.current = requestAnimationFrame(drawFrame);

      // Assign to outer-scoped refs so cleanup can deregister them
      cosmicMoveHandler = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        hoveredPlanet = null;
        for (let i = 0; i < COSMIC_NODES.length; i++) {
          const node = COSMIC_NODES[i];
          const pos = getPlanetPos(node, cosmicAnglesRef.current[i]);
          const r = node.ring === 1 ? 7 : 5;
          const dx = mx - pos.x;
          const dy = my - pos.y;
          if (Math.sqrt(dx * dx + dy * dy) <= r + 10) {
            hoveredPlanet = node.id;
            setHoveredCosmicId(node.id);
            break;
          }
        }
        if (!hoveredPlanet) setHoveredCosmicId(null);
        canvas.style.cursor = hoveredPlanet ? "pointer" : "default";
      };

      cosmicClickHandler = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        for (let i = 0; i < COSMIC_NODES.length; i++) {
          const node = COSMIC_NODES[i];
          const pos = getPlanetPos(node, cosmicAnglesRef.current[i]);
          const r = node.ring === 1 ? 7 : 5;
          const dx = mx - pos.x;
          const dy = my - pos.y;
          if (Math.sqrt(dx * dx + dy * dy) <= r + 10) {
            onNavigatePillar(node.page);
            break;
          }
        }
      };

      canvas.addEventListener("mousemove", cosmicMoveHandler);
      canvas.addEventListener("click", cosmicClickHandler);

      const ro = new ResizeObserver(resize);
      if (canvas.parentElement) ro.observe(canvas.parentElement);
    }); // close requestAnimationFrame wrapper

    return () => {
      cancelAnimationFrame(setupRafId);
      cancelAnimationFrame(cosmicFrameRef.current);
      if (cosmicMoveHandler)
        canvas.removeEventListener("mousemove", cosmicMoveHandler);
      if (cosmicClickHandler)
        canvas.removeEventListener("click", cosmicClickHandler);
    };
  }, [isOpen, mode, onNavigatePillar]);

  // ── Mouse tracking for living field ─────────────────────────────────────────
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (!engineRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      engineRef.current.setMouse(e.clientX - rect.left, e.clientY - rect.top);
    },
    [],
  );

  // ── Companion logic ───────────────────────────────────────────────────────────
  const contextualSuggestion = SECTION_SUGGESTIONS[detectedSection] ?? null;

  const filteredPrompts = useMemo(
    () => semanticSearch(query, PREDEFINED_PROMPTS),
    [query],
  );

  const recommendedPrompts = useMemo(
    () =>
      PREDEFINED_PROMPTS.filter((p) => recommendations.includes(p.id)).slice(
        0,
        3,
      ),
    [recommendations],
  );

  const togglePrompt = useCallback((id: string) => {
    recordInteraction(id);
    setRecommendations(getTopInteractions().slice(0, 3));
    setActiveAnswer((prev) => (prev === id ? null : id));
  }, []);

  const nextStep = useCallback(() => {
    setStepIndex((prev) => Math.min(prev + 1, INTELLIGENCE_STEPS.length - 1));
  }, []);

  const prevStep = useCallback(() => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleKeyClose = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        if (tooltipNode) {
          setTooltipNode(null);
        } else {
          onClose();
        }
      }
    },
    [onClose, tooltipNode],
  );

  if (!isOpen) return null;

  const currentStep = INTELLIGENCE_STEPS[stepIndex];
  const progress = ((stepIndex + 1) / INTELLIGENCE_STEPS.length) * 100;
  const isVisualMode = mode === "graph" || mode === "cosmic";

  // ── Container positioning ────────────────────────────────────────────────────
  let containerStyle: React.CSSProperties;
  let showBackdrop = false;

  // z-index 9999 ensures the companion floats above pillar page 3D hero canvases
  // (which live in normal stacking context with no explicit z-index)
  if (isVisualMode) {
    if (isMobile) {
      containerStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
      };
    } else if (isTablet) {
      containerStyle = {
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100vw",
        height: "80vh",
        zIndex: 9999,
      };
      showBackdrop = true;
    } else {
      // Desktop — centered overlay
      containerStyle = {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(1050px, 94vw)",
        height: "min(620px, 90vh)",
        zIndex: 9999,
      };
      showBackdrop = true;
    }
  } else {
    // Intelligence mode — right side panel
    containerStyle = {
      position: "fixed",
      right: 0,
      top: 0,
      bottom: 0,
      width: "min(420px, 90vw)",
      zIndex: 9999,
    };
  }

  const hoveredCosmicNode = COSMIC_NODES.find((n) => n.id === hoveredCosmicId);

  return (
    <>
      {/* Backdrop for visual modes */}
      {showBackdrop && (
        <button
          type="button"
          className="fixed inset-0"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            border: "none",
            cursor: "default",
            padding: 0,
            zIndex: 9998,
          }}
          onClick={onClose}
          aria-label="Close companion"
        />
      )}

      {/* Main companion dialog */}
      <dialog
        ref={containerRef}
        aria-label="AI Companion"
        data-ocid="companion.panel"
        onKeyDown={handleKeyClose}
        open
        onMouseMove={handleMouseMove}
        style={{
          ...containerStyle,
          background: "rgba(4,6,18,0.97)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(74,126,247,0.15)",
          boxShadow: isVisualMode
            ? "0 0 80px rgba(74,126,247,0.15), 0 20px 60px rgba(0,0,0,0.8)"
            : "-8px 0 40px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        tabIndex={-1}
      >
        {/* Living Intelligence Field (canvas background) */}
        <canvas
          ref={fieldCanvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Content layer */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* HEADER */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              flexShrink: 0,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "Geist Mono, monospace",
                  fontSize: "8px",
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: "rgba(212,160,23,0.7)",
                  marginBottom: "3px",
                }}
              >
                STEMONEF Intelligence Interface
              </div>
              <div
                style={{
                  fontFamily: "Fraunces, serif",
                  fontSize: "15px",
                  fontWeight: 300,
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                Mission Control Node
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Status indicator */}
              <div className="flex items-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
                  style={{ background: "#34d399" }}
                />
                <span
                  style={{
                    fontFamily: "Geist Mono, monospace",
                    fontSize: "8px",
                    color: "rgba(52,211,153,0.7)",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  ACTIVE
                </span>
              </div>

              {/* Close button */}
              <button
                type="button"
                data-ocid="companion.close_button"
                onClick={onClose}
                aria-label="Close companion"
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.4)",
                  cursor: "pointer",
                  fontSize: "20px",
                  lineHeight: 1,
                  padding: "4px",
                }}
              >
                ×
              </button>
            </div>
          </div>

          {/* MODE SWITCHER */}
          <div
            className="flex gap-1 px-5 py-3"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              flexShrink: 0,
            }}
          >
            {(
              [
                { key: "intelligence", label: "INTELLIGENCE" },
                { key: "graph", label: "KNOWLEDGE GRAPH" },
                { key: "cosmic", label: "COSMIC SYSTEM" },
              ] as const
            ).map(({ key, label }) => {
              const isActive = mode === key;
              const isDisabled = isMobile && key !== "intelligence";
              return (
                <button
                  key={key}
                  type="button"
                  data-ocid="companion.tab"
                  onClick={() => handleModeChange(key)}
                  disabled={isDisabled}
                  style={{
                    flex: 1,
                    padding: "6px 4px",
                    background: isActive
                      ? "rgba(74,126,247,0.15)"
                      : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isActive ? "rgba(74,126,247,0.5)" : "rgba(255,255,255,0.07)"}`,
                    borderRadius: "2px",
                    fontFamily: "Geist Mono, monospace",
                    fontSize: "7px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    color: isActive
                      ? "rgba(255,255,255,0.9)"
                      : "rgba(255,255,255,0.35)",
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    opacity: isDisabled ? 0.4 : 1,
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap" as const,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Mobile notice — explain why Graph/Cosmic are locked */}
          {isMobile && (
            <div
              style={{
                marginLeft: "20px",
                marginRight: "20px",
                marginTop: "8px",
                padding: "8px 12px",
                background: "rgba(212,160,23,0.06)",
                border: "1px solid rgba(212,160,23,0.15)",
                borderRadius: "2px",
                flexShrink: 0,
              }}
            >
              <p
                style={{
                  fontFamily: "Geist Mono, monospace",
                  fontSize: "8px",
                  lineHeight: 1.6,
                  color: "rgba(212,160,23,0.6)",
                  margin: 0,
                  letterSpacing: "0.05em",
                }}
              >
                Knowledge Graph and Cosmic System are available on desktop for
                optimal rendering performance.
              </p>
            </div>
          )}

          {/* MAIN VIEW */}
          <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            {/* ── Intelligence Mode ──────────────────────────────────────── */}
            {mode === "intelligence" && (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {/* Context Signal */}
                {contextualSuggestion && !query && (
                  <div
                    className="mx-5 mt-4"
                    style={{
                      background: "rgba(74,126,247,0.08)",
                      border: "1px solid rgba(74,126,247,0.15)",
                      borderRadius: "2px",
                      padding: "10px 12px",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "Geist Mono, monospace",
                        fontSize: "7px",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase" as const,
                        color: "rgba(74,126,247,0.6)",
                        marginBottom: "4px",
                      }}
                    >
                      CONTEXT SIGNAL
                    </div>
                    <p
                      style={{
                        fontFamily: "Sora, sans-serif",
                        fontSize: "11px",
                        lineHeight: 1.6,
                        color: "rgba(255,255,255,0.5)",
                        margin: 0,
                      }}
                    >
                      {contextualSuggestion}
                    </p>
                  </div>
                )}

                {/* Search input */}
                <div className="px-5 mt-4" style={{ flexShrink: 0 }}>
                  <input
                    type="text"
                    placeholder="Search the system..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    data-ocid="companion.search_input"
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(74,126,247,0.2)",
                      borderRadius: "2px",
                      padding: "8px 12px",
                      color: "rgba(255,255,255,0.7)",
                      fontFamily: "Geist Mono, monospace",
                      fontSize: "11px",
                      outline: "none",
                      boxSizing: "border-box" as const,
                    }}
                  />
                </div>

                {/* Scrollable area: Prompts + Mission Control */}
                <div
                  style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}
                >
                  {/* Recommendations */}
                  {recommendedPrompts.length > 0 && !query && (
                    <div style={{ marginBottom: "16px" }}>
                      <div
                        style={{
                          fontFamily: "Geist Mono, monospace",
                          fontSize: "7px",
                          letterSpacing: "0.35em",
                          textTransform: "uppercase" as const,
                          color: "rgba(212,160,23,0.5)",
                          marginBottom: "10px",
                        }}
                      >
                        RECOMMENDED FOR YOU
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        {recommendedPrompts.map((prompt) => (
                          <PromptItem
                            key={`rec-${prompt.id}`}
                            prompt={prompt}
                            isActive={activeAnswer === prompt.id}
                            onToggle={togglePrompt}
                            accent="gold"
                          />
                        ))}
                      </div>
                      <div
                        style={{
                          fontFamily: "Geist Mono, monospace",
                          fontSize: "7px",
                          letterSpacing: "0.35em",
                          textTransform: "uppercase" as const,
                          color: "rgba(255,255,255,0.2)",
                          marginTop: "14px",
                          marginBottom: "10px",
                        }}
                      >
                        ALL TOPICS
                      </div>
                    </div>
                  )}

                  {/* Label when no recommendations */}
                  {recommendedPrompts.length === 0 && !query && (
                    <div
                      style={{
                        fontFamily: "Geist Mono, monospace",
                        fontSize: "7px",
                        letterSpacing: "0.35em",
                        textTransform: "uppercase" as const,
                        color: "rgba(255,255,255,0.25)",
                        marginBottom: "12px",
                      }}
                    >
                      ASK THE SYSTEM
                    </div>
                  )}

                  {/* Search result label */}
                  {query && (
                    <div
                      style={{
                        fontFamily: "Geist Mono, monospace",
                        fontSize: "7px",
                        letterSpacing: "0.35em",
                        textTransform: "uppercase" as const,
                        color: "rgba(74,126,247,0.5)",
                        marginBottom: "12px",
                      }}
                    >
                      RESULTS — {filteredPrompts.length} found
                    </div>
                  )}

                  {/* Prompts */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {filteredPrompts.length > 0 ? (
                      filteredPrompts.map((prompt) => (
                        <PromptItem
                          key={prompt.id}
                          prompt={prompt}
                          isActive={activeAnswer === prompt.id}
                          onToggle={togglePrompt}
                          accent="blue"
                        />
                      ))
                    ) : query ? (
                      <p
                        style={{
                          fontFamily: "Sora, sans-serif",
                          fontSize: "11px",
                          color: "rgba(255,255,255,0.3)",
                        }}
                      >
                        No results found. Try different keywords.
                      </p>
                    ) : null}
                  </div>

                  {/* Mission Control Panel */}
                  <div
                    style={{
                      marginTop: "20px",
                      background: "rgba(212,160,23,0.06)",
                      border: "1px solid rgba(212,160,23,0.2)",
                      borderRadius: "2px",
                      padding: "16px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "Geist Mono, monospace",
                        fontSize: "7px",
                        letterSpacing: "0.35em",
                        textTransform: "uppercase" as const,
                        color: "rgba(212,160,23,0.6)",
                        marginBottom: "12px",
                      }}
                    >
                      MISSION CONTROL
                    </div>

                    {/* Progress bar */}
                    <div
                      style={{
                        width: "100%",
                        height: "2px",
                        background: "rgba(255,255,255,0.08)",
                        borderRadius: "1px",
                        marginBottom: "12px",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          borderRadius: "1px",
                          background:
                            "linear-gradient(90deg, rgba(74,126,247,0.8), rgba(212,160,23,0.8))",
                          width: `${progress}%`,
                          transition: "width 0.5s ease",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        fontFamily: "Geist Mono, monospace",
                        fontSize: "7px",
                        color: "rgba(74,126,247,0.6)",
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.1em",
                        marginBottom: "4px",
                      }}
                    >
                      MISSION {currentStep.missionNumber} of{" "}
                      {INTELLIGENCE_STEPS.length}
                    </div>

                    <div
                      style={{
                        fontFamily: "Fraunces, serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.85)",
                        marginBottom: "8px",
                      }}
                    >
                      {currentStep.title}
                    </div>

                    <p
                      style={{
                        fontFamily: "Sora, sans-serif",
                        fontSize: "11px",
                        lineHeight: 1.65,
                        color: "rgba(255,255,255,0.5)",
                        margin: "0 0 14px 0",
                      }}
                    >
                      {currentStep.description}
                    </p>

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        type="button"
                        data-ocid="companion.secondary_button"
                        onClick={prevStep}
                        disabled={stepIndex === 0}
                        style={{
                          flex: 1,
                          padding: "7px 4px",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "2px",
                          color:
                            stepIndex === 0
                              ? "rgba(255,255,255,0.2)"
                              : "rgba(255,255,255,0.5)",
                          cursor: stepIndex === 0 ? "not-allowed" : "pointer",
                          fontFamily: "Geist Mono, monospace",
                          fontSize: "9px",
                        }}
                      >
                        ← PREV
                      </button>

                      <button
                        type="button"
                        data-ocid="companion.primary_button"
                        onClick={() => onScrollTo(currentStep.targetSection)}
                        style={{
                          flex: 2,
                          padding: "7px 4px",
                          background: "rgba(212,160,23,0.12)",
                          border: "1px solid rgba(212,160,23,0.35)",
                          borderRadius: "2px",
                          color: "rgba(212,160,23,0.9)",
                          cursor: "pointer",
                          fontFamily: "Geist Mono, monospace",
                          fontSize: "9px",
                        }}
                      >
                        {currentStep.focusLabel}
                      </button>

                      <button
                        type="button"
                        data-ocid="companion.secondary_button"
                        onClick={
                          stepIndex === INTELLIGENCE_STEPS.length - 1
                            ? () => setStepIndex(0)
                            : nextStep
                        }
                        style={{
                          flex: 1,
                          padding: "7px 4px",
                          background: "rgba(74,126,247,0.12)",
                          border: "1px solid rgba(74,126,247,0.3)",
                          borderRadius: "2px",
                          color: "rgba(74,126,247,0.9)",
                          cursor: "pointer",
                          fontFamily: "Geist Mono, monospace",
                          fontSize: "9px",
                        }}
                      >
                        {stepIndex === INTELLIGENCE_STEPS.length - 1
                          ? "RESET"
                          : "NEXT →"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Knowledge Graph Mode ───────────────────────────────────── */}
            {mode === "graph" && (
              <div
                style={{ position: "relative", height: "100%", width: "100%" }}
              >
                <canvas
                  ref={graphCanvasRef}
                  data-ocid="companion.canvas_target"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                  }}
                />

                {/* Graph legend */}
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {[
                    { color: "#d4a017", label: "Core Institution" },
                    { color: "#4a7ef7", label: "Pillar (click to visit)" },
                    { color: "#64c8f7", label: "Section (click to scroll)" },
                    { color: "rgba(200,220,255,0.7)", label: "Project" },
                  ].map(({ color, label }) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <div
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: color,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "Geist Mono, monospace",
                          fontSize: "7px",
                          color: "rgba(255,255,255,0.35)",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tooltip for project nodes */}
                {tooltipNode && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "20px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "240px",
                      background: "rgba(4,6,18,0.98)",
                      border: "1px solid rgba(74,126,247,0.3)",
                      borderRadius: "2px",
                      padding: "14px",
                    }}
                    data-ocid="companion.popover"
                  >
                    <div
                      style={{
                        fontFamily: "Geist Mono, monospace",
                        fontSize: "7px",
                        letterSpacing: "0.35em",
                        textTransform: "uppercase" as const,
                        color: "rgba(74,126,247,0.6)",
                        marginBottom: "6px",
                      }}
                    >
                      PROJECT NODE INFO
                    </div>
                    <div
                      style={{
                        fontFamily: "Fraunces, serif",
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.85)",
                        marginBottom: "6px",
                      }}
                    >
                      {tooltipNode.label}
                    </div>
                    <p
                      style={{
                        fontFamily: "Sora, sans-serif",
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.5)",
                        lineHeight: 1.55,
                        margin: "0 0 10px 0",
                      }}
                    >
                      Climate &amp; Sustainability Research — monitoring
                      planetary systems across 50 nations.
                    </p>
                    <button
                      type="button"
                      data-ocid="companion.close_button"
                      onClick={() => setTooltipNode(null)}
                      style={{
                        background: "rgba(74,126,247,0.1)",
                        border: "1px solid rgba(74,126,247,0.25)",
                        borderRadius: "2px",
                        padding: "5px 12px",
                        fontFamily: "Geist Mono, monospace",
                        fontSize: "8px",
                        color: "rgba(74,126,247,0.7)",
                        cursor: "pointer",
                      }}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Cosmic System Mode ─────────────────────────────────────── */}
            {mode === "cosmic" && (
              <div
                style={{ position: "relative", height: "100%", width: "100%" }}
              >
                <canvas
                  ref={cosmicCanvasRef}
                  data-ocid="companion.canvas_target"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                  }}
                />

                {/* Hovered planet tooltip */}
                {hoveredCosmicNode && (
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "16px",
                      width: "200px",
                      background: "rgba(4,6,18,0.97)",
                      border: `1px solid ${hoveredCosmicNode.color}44`,
                      borderRadius: "2px",
                      padding: "12px",
                      pointerEvents: "none",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "Fraunces, serif",
                        fontSize: "13px",
                        color: hoveredCosmicNode.color,
                        marginBottom: "4px",
                      }}
                    >
                      {hoveredCosmicNode.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "Sora, sans-serif",
                        fontSize: "10px",
                        color: "rgba(255,255,255,0.5)",
                        marginBottom: "8px",
                      }}
                    >
                      {hoveredCosmicNode.mandate}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "3px",
                      }}
                    >
                      {hoveredCosmicNode.initiatives.map((init) => (
                        <div
                          key={init}
                          style={{
                            fontFamily: "Geist Mono, monospace",
                            fontSize: "8px",
                            color: "rgba(255,255,255,0.35)",
                          }}
                        >
                          • {init}
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        fontFamily: "Geist Mono, monospace",
                        fontSize: "7px",
                        color: "rgba(255,255,255,0.2)",
                        marginTop: "8px",
                      }}
                    >
                      Click to visit pillar
                    </div>
                  </div>
                )}

                {/* Instructions */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontFamily: "Geist Mono, monospace",
                    fontSize: "7px",
                    color: "rgba(255,255,255,0.2)",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase" as const,
                    whiteSpace: "nowrap" as const,
                  }}
                >
                  Hover to inspect · Click to navigate
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div
            style={{
              padding: "10px 20px",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "Geist Mono, monospace",
                fontSize: "7px",
                color: "rgba(255,255,255,0.18)",
                letterSpacing: "0.1em",
              }}
            >
              STEMONEF Intelligence Interface — Mission Control Node
            </span>

            {/* Mode indicator dots */}
            <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
              {(["intelligence", "graph", "cosmic"] as const).map((m) => (
                <div
                  key={m}
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background:
                      m === mode
                        ? m === "cosmic"
                          ? "#d4a017"
                          : m === "graph"
                            ? "#64c8f7"
                            : "#4a7ef7"
                        : "rgba(255,255,255,0.12)",
                    transition: "background 0.3s ease",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}

// ── Sub-component: PromptItem ─────────────────────────────────────────────────

interface PromptItemProps {
  prompt: { id: string; label: string; answer: string };
  isActive: boolean;
  onToggle: (id: string) => void;
  accent: "blue" | "gold";
}

function PromptItem({ prompt, isActive, onToggle, accent }: PromptItemProps) {
  const accentBorder =
    accent === "gold" ? "rgba(212,160,23,0.3)" : "rgba(74,126,247,0.2)";
  const activeText =
    accent === "gold" ? "rgba(212,160,23,0.9)" : "rgba(74,126,247,0.9)";

  return (
    <div>
      <button
        type="button"
        data-ocid="companion.button"
        onClick={() => onToggle(prompt.id)}
        className="w-full text-left transition-all duration-200"
        style={{
          background: isActive
            ? "rgba(212,160,23,0.06)"
            : "rgba(255,255,255,0.03)",
          border: `1px solid ${isActive ? accentBorder : "rgba(255,255,255,0.07)"}`,
          borderRadius: "2px",
          cursor: "pointer",
          padding: "12px",
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255,255,255,0.05)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255,255,255,0.03)";
          }
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <span
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: "11px",
              lineHeight: 1.5,
              color: isActive ? activeText : "rgba(255,255,255,0.6)",
            }}
          >
            {prompt.label}
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.3)",
              transform: isActive ? "rotate(180deg)" : "none",
              transition: "transform 0.2s ease",
              flexShrink: 0,
              marginTop: "2px",
              fontSize: "12px",
            }}
          >
            ▾
          </span>
        </div>
      </button>

      {isActive && (
        <div
          className="animate-fade-in-up"
          style={{
            background: "rgba(4,6,18,0.9)",
            border: "1px solid rgba(74,126,247,0.1)",
            borderTop: "none",
            borderRadius: "0 0 2px 2px",
            padding: "12px",
          }}
        >
          <div
            style={{
              fontFamily: "Geist Mono, monospace",
              fontSize: "7px",
              letterSpacing: "0.35em",
              textTransform: "uppercase" as const,
              color: "rgba(74,126,247,0.6)",
              marginBottom: "8px",
            }}
          >
            SYSTEM RESPONSE
          </div>
          <div
            style={{
              fontFamily: "Geist Mono, monospace",
              fontSize: "11px",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.55)",
              whiteSpace: "pre-line",
            }}
          >
            {prompt.answer}
          </div>
        </div>
      )}
    </div>
  );
}
