import { useCallback, useEffect, useRef, useState } from "react";

// ── Civilization Epoch Data ──────────────────────────────────────────────────
interface EpochData {
  id: number;
  label: string;
  period: string;
  shortLabel: string;
  ambientColor: string;
  accentColor: string;
  scientificContext: string;
  keyBreakthroughs: string[];
  keySignals: string[];
  strategicImplications: string;
  forwardTrajectory: string;
  deepDives: {
    principles: string;
    technologies: string;
    consequences: string;
    questions: string;
  };
}

const CIVILIZATION_EPOCHS: EpochData[] = [
  {
    id: 1,
    label: "Early Scientific Foundations",
    period: "Antiquity–1650s",
    shortLabel: "Foundations",
    ambientColor: "rgba(212,160,23,0.04)",
    accentColor: "rgba(212,160,23,0.8)",
    scientificContext:
      "The emergence of systematic observation and rational inquiry as frameworks for understanding nature. Greek natural philosophy, Islamic preservation and expansion of knowledge, and the European Scientific Revolution established empirical method as civilization's primary epistemic tool.",
    keyBreakthroughs: [
      "Euclidean geometry and deductive logic",
      "Archimedes' mechanics and hydrostatics",
      "Al-Haytham's optics and experimental method",
      "Copernican heliocentrism",
      "Galileo's kinematics",
      "Vesalius's anatomical atlas",
      "Kepler's orbital laws",
      "Newton's laws of motion and universal gravitation",
      "Leibniz and Newton's calculus",
    ],
    keySignals: [
      "Observational astronomy replaces cosmological dogma",
      "Mathematical formalism applied to physical motion",
      "Printing press enables knowledge propagation at scale",
      "Royal societies institutionalize peer verification",
      "Separation of natural philosophy from theological authority",
    ],
    strategicImplications:
      "Established the epistemic infrastructure — empirical testing, mathematical modeling, institutional verification — that all subsequent science inherits. This epoch didn't just discover facts; it invented the method of discovery.",
    forwardTrajectory:
      "Created the analytical mechanics and mathematical tools that directly enabled the Industrial Revolution's engineering breakthroughs.",
    deepDives: {
      principles:
        "Inertia, gravitational attraction, geometric optics, deductive proof, experimental falsification",
      technologies:
        "Printing press, telescope, microscope, pendulum clock, calculating machines",
      consequences:
        "Secular epistemology displaces theological authority over natural knowledge; mathematics becomes the language of physics",
      questions:
        "What is the nature of gravitational action at a distance? How do living systems differ from mechanical ones?",
    },
  },
  {
    id: 2,
    label: "Industrial Transformation",
    period: "1700s–1860s",
    shortLabel: "Industrial",
    ambientColor: "rgba(100,116,139,0.04)",
    accentColor: "rgba(148,163,184,0.8)",
    scientificContext:
      "Thermodynamics and mechanical engineering combined to convert scientific understanding of energy into large-scale productive systems. Coal, steam, and iron created an energy regime that reorganized labor, geography, and economic structure across civilization.",
    keyBreakthroughs: [
      "Watt's steam engine efficiency redesign",
      "Faraday's electromagnetic induction",
      "Carnot's thermodynamic efficiency theory",
      "Dalton's atomic theory",
      "Pasteur's germ theory",
      "Darwin's evolutionary framework",
      "Maxwell's electromagnetic field equations",
      "Bessemer steel process",
    ],
    keySignals: [
      "Steam power decouples production from biological energy limits",
      "Factory system concentrates labor and capital",
      "Railway networks create national economic integration",
      "Germ theory enables evidence-based medicine",
      "Thermodynamic limits formalized — entropy as universal constraint",
    ],
    strategicImplications:
      "Industrial transformation proved that energy conversion at scale could reorganize civilization. Simultaneously, Darwin and Pasteur revealed that life itself operated on discoverable scientific principles — dissolving the final boundary between physics and biology.",
    forwardTrajectory:
      "Faraday and Maxwell's electromagnetic discoveries directly spawned electrical infrastructure and wireless communication in the following epoch.",
    deepDives: {
      principles:
        "Thermodynamic laws, electromagnetic field theory, atomic theory, natural selection, germ-disease causation",
      technologies:
        "Steam engine, railway, telegraph, precision machining, chemical manufacturing",
      consequences:
        "Fossil fuel dependency as the foundational energy substrate of industrial civilization; urbanization accelerates; life expectancy increases with sanitation science",
      questions:
        "What is the ultimate source of the sun's energy? What carries electromagnetic waves through space?",
    },
  },
  {
    id: 3,
    label: "Electrical & Electronic Age",
    period: "1860s–1945",
    shortLabel: "Electrical",
    ambientColor: "rgba(99,102,241,0.05)",
    accentColor: "rgba(129,140,248,0.8)",
    scientificContext:
      "Electromagnetism was tamed into infrastructure. Simultaneously, quantum mechanics and relativity fundamentally restructured physics' conception of matter, energy, space, and time — revealing a universe far stranger than classical mechanics had implied.",
    keyBreakthroughs: [
      "Edison and Tesla's electrical infrastructure",
      "Hertz's radio wave demonstration",
      "Einstein's special and general relativity",
      "Planck's quantum hypothesis",
      "Bohr's atomic model",
      "Rutherford's nuclear structure",
      "Fleming's penicillin",
      "Heisenberg's uncertainty principle",
      "Schrödinger's wave mechanics",
      "Turing's computability theory",
    ],
    keySignals: [
      "Electrical grids restructure urban infrastructure and daily life",
      "Radio creates planetary-scale simultaneous communication",
      "Quantum mechanics invalidates classical determinism at small scales",
      "Relativity unifies space, time, mass, and energy",
      "Nuclear binding energy identified as civilization-altering force",
    ],
    strategicImplications:
      "The quantum revolution was not merely a scientific advance — it was an epistemic rupture. Determinism collapsed at the subatomic level. Probability replaced certainty as the fundamental description of nature. Meanwhile, electrification created the infrastructure substrate that all subsequent digital civilization depends upon.",
    forwardTrajectory:
      "Quantum mechanics directly enabled semiconductor physics, which enabled transistors, which enabled computing.",
    deepDives: {
      principles:
        "Wave-particle duality, uncertainty principle, relativistic spacetime, nuclear binding energy, electromagnetic wave propagation",
      technologies:
        "Electrical grid, radio, cathode ray tubes, vacuum tubes, early aircraft, penicillin",
      consequences:
        "Atomic weapons introduce existential risk as a structural feature of advanced civilization; quantum physics enables electronics revolution",
      questions:
        "How to interpret quantum measurement and the collapse of the wave function? What is the quantum theory of gravity?",
    },
  },
  {
    id: 4,
    label: "Computing Revolution",
    period: "1945–1995",
    shortLabel: "Computing",
    ambientColor: "rgba(6,182,212,0.04)",
    accentColor: "rgba(34,211,238,0.8)",
    scientificContext:
      "Information was formalized as a measurable physical quantity. The transistor, integrated circuit, and software created a new class of general-purpose machines that could model, simulate, and process any computable process — effectively creating a new layer of cognitive infrastructure for civilization.",
    keyBreakthroughs: [
      "Von Neumann architecture",
      "Shannon's information theory",
      "Transistor invention (Shockley, Bardeen, Brattain)",
      "Integrated circuit (Kilby, Noyce)",
      "ARPANET",
      "Unix operating system",
      "DNA structure (Watson, Crick)",
      "Recombinant DNA",
      "Personal computer",
      "World Wide Web foundation (Berners-Lee)",
    ],
    keySignals: [
      "Information formalized as measurable physical quantity",
      "Moore's Law drives exponential performance scaling",
      "Software creates a programmable cognitive layer",
      "Molecular biology reveals genetic information architecture",
      "Computer simulation enables complex system modeling",
    ],
    strategicImplications:
      "Computing redefined intelligence itself as an information process. The same information-theoretic framework that Shannon applied to communication channels was shown to underlie both computation and biological genetics — revealing a deep structural unity between information, life, and mind.",
    forwardTrajectory:
      "The internet infrastructure and software systems built in this epoch became the substrate for the networked intelligence explosion of the 1990s–2020s.",
    deepDives: {
      principles:
        "Information entropy, Boolean logic, computability limits (Gödel, Turing), molecular genetics, complexity theory",
      technologies:
        "Transistor, integrated circuit, DRAM, fiber optics, TCP/IP protocol stack, Unix/Linux, database systems",
      consequences:
        "Global knowledge becomes digitizable and searchable; economic value shifts toward information goods; AI becomes a structural research agenda",
      questions:
        "What are the limits of computation? Can consciousness be computed? What is the relationship between information and physical entropy?",
    },
  },
  {
    id: 5,
    label: "Networked Intelligence",
    period: "1995–2020s",
    shortLabel: "Networked",
    ambientColor: "rgba(74,126,247,0.05)",
    accentColor: "rgba(74,126,247,0.8)",
    scientificContext:
      "The internet connected computing infrastructure into a planetary cognitive network. Mobile computing made this network personally ambient. Machine learning, trained on the accumulated data of networked civilization, began demonstrating emergent capabilities that classical AI research had failed to produce through symbolic approaches.",
    keyBreakthroughs: [
      "World Wide Web deployment",
      "Search engine algorithms",
      "Human Genome Project completion",
      "CRISPR-Cas9 gene editing",
      "Deep learning and neural network renaissance",
      "Smartphone and mobile internet",
      "Cloud computing infrastructure",
      "AlphaFold protein structure prediction",
      "Gravitational wave detection",
      "Large language model emergence",
    ],
    keySignals: [
      "Planetary-scale data collection creates training substrate for machine intelligence",
      "CRISPR enables programmable biological systems",
      "Cloud computing decouples compute from physical hardware ownership",
      "Deep learning surpasses human performance on narrow cognitive benchmarks",
      "Gravitational wave astronomy opens new observational channel",
    ],
    strategicImplications:
      "For the first time, scientific instruments, data collection, modeling, and publication became globally networked. Science itself became a distributed, real-time, collaborative system. Simultaneously, machine learning created tools that accelerate every other domain of scientific discovery.",
    forwardTrajectory:
      "Networked intelligence infrastructure, biological programmability, and AI acceleration collectively define the substrate conditions for the emerging planetary technology epoch.",
    deepDives: {
      principles:
        "Statistical learning theory, gradient descent optimization, transformer attention mechanisms, CRISPR molecular mechanisms, gravitational wave physics",
      technologies:
        "Internet protocols, smartphone hardware, GPU compute, transformer architectures, cloud infrastructure, gene sequencing platforms",
      consequences:
        "Scientific knowledge production accelerates nonlinearly; AI introduces automation risk across cognitive labor categories; biological programmability introduces biosecurity risk",
      questions:
        "What are the emergent properties of sufficiently large language models? How do we align machine intelligence with human values at scale?",
    },
  },
  {
    id: 6,
    label: "Emerging Planetary Technologies",
    period: "2020s–Present",
    shortLabel: "Planetary",
    ambientColor: "rgba(52,211,153,0.05)",
    accentColor: "rgba(52,211,153,0.8)",
    scientificContext:
      "Civilization now operates multiple interacting technological frontiers simultaneously: artificial general intelligence, quantum computing, synthetic biology, space industrialization, and planetary-scale environmental engineering. The defining challenge is not capability development but governance — ensuring that planetary-scale technological power is directed by planetary-scale ethical frameworks.",
    keyBreakthroughs: [
      "Large language model emergence and multimodal AI",
      "Quantum error correction advances",
      "mRNA vaccine platforms",
      "Commercial space industrialization",
      "Nuclear fusion milestone (NIF ignition)",
      "Neuromorphic computing",
      "Whole-brain emulation research",
      "Carbon capture technology maturation",
      "Direct-to-cell satellite internet",
    ],
    keySignals: [
      "AI systems demonstrate emergent general reasoning capabilities",
      "Quantum advantage demonstrated for specific problem classes",
      "Synthetic biology enables programmable organism design",
      "Commercial space reduces launch cost by orders of magnitude",
      "Fusion energy transitions from perpetual future to engineering problem",
    ],
    strategicImplications:
      "Humanity is constructing infrastructure at planetary scale — artificial intelligence networks, biotechnology platforms, space systems, and energy grids — while existing governance frameworks remain nationally scoped. The central civilizational challenge of this epoch is the co-evolution of capability and governance at planetary scale.",
    forwardTrajectory:
      "The convergence of AI, quantum systems, synthetic biology, and space infrastructure will define the trajectory of civilization over the next 50–100 years. The decisions made in this decade about the governance of these systems will determine whether they amplify or destabilize civilization.",
    deepDives: {
      principles:
        "Quantum error correction, transformer scaling laws, synthetic genomics, fusion plasma physics, neuromorphic computation",
      technologies:
        "GPU/TPU clusters, CRISPR platforms, reusable launch vehicles, mRNA platforms, quantum processors, carbon capture systems",
      consequences:
        "Potential for accelerating disease elimination, energy abundance, and space-based civilization; existential risk from misaligned AI and synthetic biology",
      questions:
        "Can we build beneficial AGI? What is the correct governance architecture for planetary-scale technologies? Is consciousness substrate-independent?",
    },
  },
];

// ── Reading Progress Bar ─────────────────────────────────────────────────────
function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[2px] pointer-events-none"
      style={{ background: "rgba(4,5,14,0.5)" }}
      aria-hidden="true"
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          background:
            "linear-gradient(90deg, rgba(74,126,247,0.8), rgba(212,160,23,0.8))",
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
}

// ── Civilization Timeline Sidebar ────────────────────────────────────────────
interface CivilizationTimelineProps {
  epochs: EpochData[];
  activeEpochId: number;
  scrollProgress: number;
  onNodeClick: (epochId: number) => void;
}

function CivilizationTimeline({
  epochs,
  activeEpochId,
  scrollProgress,
  onNodeClick,
}: CivilizationTimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <>
      {/* Desktop: sticky vertical sidebar */}
      <div
        className="hidden lg:flex flex-col items-center sticky top-[80px] self-start"
        style={{ width: "80px", minHeight: "600px" }}
        aria-label="Epoch timeline navigation"
      >
        {/* SVG spine with animated draw-in */}
        <svg
          ref={svgRef}
          className="absolute left-1/2 -translate-x-1/2 top-0"
          width="2"
          height="100%"
          style={{ overflow: "visible" }}
          aria-hidden="true"
        >
          <line
            x1="1"
            y1="0"
            x2="1"
            y2="100%"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="2"
          />
          <line
            x1="1"
            y1="0"
            x2="1"
            y2="100%"
            stroke="url(#timelineGrad)"
            strokeWidth="2"
            strokeDasharray="600"
            strokeDashoffset={600 - scrollProgress * 6}
            style={{ transition: "stroke-dashoffset 0.3s ease-out" }}
          />
          <defs>
            <linearGradient
              id="timelineGrad"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
              gradientUnits="objectBoundingBox"
            >
              <stop offset="0%" stopColor="rgba(212,160,23,0.9)" />
              <stop offset="50%" stopColor="rgba(74,126,247,0.9)" />
              <stop offset="100%" stopColor="rgba(52,211,153,0.9)" />
            </linearGradient>
          </defs>
        </svg>

        {epochs.map((epoch, i) => {
          const isActive = epoch.id === activeEpochId;
          const isPassed = epoch.id < activeEpochId;
          return (
            <button
              key={epoch.id}
              type="button"
              data-ocid={`epochs.timeline.node.${i + 1}`}
              onClick={() => onNodeClick(epoch.id)}
              className="relative flex flex-col items-center group"
              style={{
                flex: 1,
                padding: "8px 0",
                background: "none",
                border: "none",
                cursor: "pointer",
                minHeight: "90px",
              }}
              title={epoch.label}
              aria-label={`Navigate to ${epoch.label}`}
              aria-current={isActive ? "step" : undefined}
            >
              {/* Node dot */}
              <div
                style={{
                  width: isActive ? "14px" : "8px",
                  height: isActive ? "14px" : "8px",
                  borderRadius: "50%",
                  background: isActive
                    ? epoch.accentColor
                    : isPassed
                      ? "rgba(74,126,247,0.5)"
                      : "rgba(255,255,255,0.12)",
                  border: isActive
                    ? `2px solid ${epoch.accentColor}`
                    : "1px solid rgba(255,255,255,0.2)",
                  boxShadow: isActive
                    ? `0 0 12px ${epoch.accentColor}, 0 0 24px ${epoch.accentColor.replace("0.8", "0.3")}`
                    : isPassed
                      ? "0 0 6px rgba(74,126,247,0.3)"
                      : "none",
                  transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  zIndex: 2,
                  position: "relative",
                }}
              />
              {/* Label on hover / active */}
              <div
                className="mt-1.5 text-center transition-all duration-300"
                style={{
                  opacity: isActive ? 1 : 0.4,
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                }}
              >
                <div
                  className="font-mono-geist"
                  style={{
                    fontSize: "7px",
                    letterSpacing: "0.15em",
                    color: isActive
                      ? epoch.accentColor
                      : "rgba(255,255,255,0.5)",
                    textTransform: "uppercase",
                    lineHeight: 1.3,
                    maxWidth: "60px",
                    textAlign: "center",
                  }}
                >
                  {epoch.shortLabel}
                </div>
                <div
                  className="font-mono-geist"
                  style={{
                    fontSize: "6px",
                    color: "rgba(255,255,255,0.25)",
                    letterSpacing: "0.1em",
                    marginTop: "2px",
                  }}
                >
                  {epoch.period.split("–")[0]}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile: horizontal scrollable nodes */}
      <div
        className="flex lg:hidden gap-3 overflow-x-auto pb-3 mb-6"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {epochs.map((epoch, i) => {
          const isActive = epoch.id === activeEpochId;
          return (
            <button
              key={epoch.id}
              type="button"
              data-ocid={`epochs.timeline.mobile.node.${i + 1}`}
              onClick={() => onNodeClick(epoch.id)}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 transition-all duration-300"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 12px",
                borderBottom: isActive
                  ? `2px solid ${epoch.accentColor}`
                  : "2px solid transparent",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: isActive
                    ? epoch.accentColor
                    : "rgba(255,255,255,0.2)",
                  boxShadow: isActive ? `0 0 8px ${epoch.accentColor}` : "none",
                  transition: "all 0.3s ease",
                }}
              />
              <span
                className="font-mono-geist"
                style={{
                  fontSize: "8px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: isActive ? epoch.accentColor : "rgba(255,255,255,0.4)",
                  whiteSpace: "nowrap",
                }}
              >
                {epoch.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

// ── Floating Epoch Signals Panel ─────────────────────────────────────────────
interface FloatingEpochSignalsPanelProps {
  activeEpoch: EpochData | undefined;
}

function FloatingEpochSignalsPanel({
  activeEpoch,
}: FloatingEpochSignalsPanelProps) {
  const [displayedEpoch, setDisplayedEpoch] = useState<EpochData | undefined>(
    activeEpoch,
  );
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!activeEpoch) return;
    if (!displayedEpoch) {
      setDisplayedEpoch(activeEpoch);
      setVisible(true);
      return;
    }
    if (activeEpoch.id !== displayedEpoch.id) {
      setAnimating(true);
      const timeout = setTimeout(() => {
        setDisplayedEpoch(activeEpoch);
        setAnimating(false);
        setVisible(true);
      }, 250);
      return () => clearTimeout(timeout);
    }
  }, [activeEpoch, displayedEpoch]);

  if (!displayedEpoch) return null;

  return (
    <div
      data-ocid="epochs.signals.panel"
      className="hidden lg:block fixed z-30"
      style={{
        right: "24px",
        top: "50%",
        transform: "translateY(-50%)",
        width: "220px",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
    >
      <div
        style={{
          background: "rgba(4,5,14,0.88)",
          border: "1px solid rgba(74,126,247,0.18)",
          backdropFilter: "blur(20px)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        {/* Panel header */}
        <div
          style={{
            padding: "10px 14px",
            borderBottom: "1px solid rgba(74,126,247,0.12)",
            background: "rgba(74,126,247,0.05)",
          }}
        >
          <div
            className="font-mono-geist"
            style={{
              fontSize: "8px",
              letterSpacing: "0.3em",
              color: "rgba(212,160,23,0.8)",
              textTransform: "uppercase",
            }}
          >
            ◈ EPOCH SIGNALS
          </div>
          <div
            className="font-mono-geist mt-1"
            style={{
              fontSize: "9px",
              color: displayedEpoch.accentColor,
              letterSpacing: "0.12em",
              opacity: animating ? 0 : 1,
              transition: "opacity 0.25s ease",
            }}
          >
            {displayedEpoch.shortLabel.toUpperCase()}
          </div>
        </div>

        {/* Signals list */}
        <div
          style={{
            padding: "10px 14px",
            opacity: animating ? 0 : 1,
            transition: "opacity 0.25s ease",
          }}
        >
          {displayedEpoch.keySignals.map((signal, i) => (
            <div
              key={signal}
              className="flex items-start gap-2 mb-2.5"
              style={{
                animation: animating
                  ? "none"
                  : "signalFadeIn 0.4s ease forwards",
                animationDelay: `${i * 0.07}s`,
                opacity: 0,
              }}
            >
              <div
                style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: displayedEpoch.accentColor,
                  flexShrink: 0,
                  marginTop: "4px",
                }}
              />
              <span
                className="font-mono-geist"
                style={{
                  fontSize: "8px",
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.5,
                  letterSpacing: "0.05em",
                }}
              >
                {signal}
              </span>
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <div
          style={{
            padding: "8px 14px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div className="flex justify-between mb-1.5">
            <span
              className="font-mono-geist"
              style={{ fontSize: "7px", color: "rgba(255,255,255,0.3)" }}
            >
              EPOCH {displayedEpoch.id} / 6
            </span>
            <span
              className="font-mono-geist"
              style={{ fontSize: "7px", color: "rgba(255,255,255,0.3)" }}
            >
              {displayedEpoch.period}
            </span>
          </div>
          <div
            style={{
              height: "2px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "1px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(displayedEpoch.id / 6) * 100}%`,
                background: displayedEpoch.accentColor,
                transition: "width 0.6s ease",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Expandable Deep Dive Section ─────────────────────────────────────────────
interface DeepDiveProps {
  label: string;
  content: string;
  accentColor: string;
  index: number;
}

function DeepDiveSection({
  label,
  content,
  accentColor,
  index,
}: DeepDiveProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        transitionDelay: `${index * 0.05}s`,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3 px-4 transition-all duration-200"
        style={{
          background: open ? "rgba(255,255,255,0.03)" : "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
        aria-expanded={open}
      >
        <span
          className="font-mono-geist"
          style={{
            fontSize: "9px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: open ? accentColor : "rgba(255,255,255,0.5)",
            transition: "color 0.2s ease",
          }}
        >
          {label}
        </span>
        <span
          style={{
            color: "rgba(255,255,255,0.3)",
            fontSize: "10px",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s ease",
            display: "inline-block",
          }}
        >
          ▾
        </span>
      </button>
      {open && (
        <div
          className="px-4 pb-4"
          style={{
            animation: "epochFadeIn 0.3s ease forwards",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.55)",
              fontFamily: "Sora, sans-serif",
              lineHeight: 1.7,
            }}
          >
            {content}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Single Epoch Block ───────────────────────────────────────────────────────
interface EpochBlockProps {
  epoch: EpochData;
  index: number;
  isActive: boolean;
  onVisible: (epochId: number) => void;
}

function EpochBlock({ epoch, index, isActive, onVisible }: EpochBlockProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection observer for active epoch tracking
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onVisible(epoch.id);
      },
      { threshold: 0.3, rootMargin: "0px 0px -10% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [epoch.id, onVisible]);

  const deepDiveItems = [
    { label: "Scientific Principles", content: epoch.deepDives.principles },
    { label: "Enabling Technologies", content: epoch.deepDives.technologies },
    {
      label: "Long-Term Consequences",
      content: epoch.deepDives.consequences,
    },
    {
      label: "Unresolved Questions",
      content: epoch.deepDives.questions,
    },
  ];

  return (
    <div
      ref={sectionRef}
      id={`epoch-${epoch.id}`}
      data-ocid={`epochs.civilization.item.${index + 1}`}
      style={{
        background: isActive
          ? epoch.ambientColor.replace("0.04", "0.06").replace("0.05", "0.07")
          : epoch.ambientColor,
        border: `1px solid ${isActive ? epoch.accentColor.replace("0.8", "0.2") : "rgba(255,255,255,0.06)"}`,
        borderRadius: "4px",
        marginBottom: "48px",
        overflow: "hidden",
        transition:
          "background 0.6s ease, border-color 0.6s ease, box-shadow 0.6s ease",
        boxShadow: isActive
          ? `0 0 40px ${epoch.accentColor.replace("0.8", "0.06")}, 0 8px 40px rgba(0,0,0,0.4)`
          : "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      {/* Epoch header */}
      <div
        style={{
          padding: "32px 36px 24px",
          borderBottom: `1px solid ${epoch.accentColor.replace("0.8", "0.12")}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Scan line animation */}
        {isActive && (
          <div
            className="animate-card-scan pointer-events-none absolute left-0 right-0"
            style={{
              height: "1px",
              background: `linear-gradient(90deg, transparent, ${epoch.accentColor.replace("0.8", "0.4")}, transparent)`,
              top: 0,
            }}
            aria-hidden="true"
          />
        )}

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div
              className="font-mono-geist mb-2"
              style={{
                fontSize: "9px",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: epoch.accentColor,
              }}
            >
              ◈ EPOCH {String(epoch.id).padStart(2, "0")} — {epoch.period}
            </div>
            <h2
              className="font-display font-light"
              style={{
                fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)",
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.92)",
                lineHeight: 1.1,
              }}
            >
              {epoch.label}
            </h2>
          </div>
          <div
            style={{
              width: isActive ? "12px" : "8px",
              height: isActive ? "12px" : "8px",
              borderRadius: "50%",
              background: isActive
                ? epoch.accentColor
                : "rgba(255,255,255,0.15)",
              boxShadow: isActive
                ? `0 0 16px ${epoch.accentColor}, 0 0 32px ${epoch.accentColor.replace("0.8", "0.3")}`
                : "none",
              transition: "all 0.4s ease",
              flexShrink: 0,
              marginTop: "4px",
            }}
          />
        </div>
      </div>

      {/* Epoch body */}
      <div style={{ padding: "28px 36px" }}>
        {/* Scientific Context */}
        <div className="mb-8">
          <div
            className="font-mono-geist mb-3"
            style={{
              fontSize: "8px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(212,160,23,0.7)",
            }}
          >
            ◆ SCIENTIFIC CONTEXT
          </div>
          <p
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.72)",
              fontFamily: "Sora, sans-serif",
              lineHeight: 1.75,
            }}
          >
            {epoch.scientificContext}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Key Breakthroughs */}
          <div>
            <div
              className="font-mono-geist mb-4"
              style={{
                fontSize: "8px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(74,126,247,0.8)",
              }}
            >
              ◈ KEY BREAKTHROUGHS
            </div>
            <ul className="space-y-2">
              {epoch.keyBreakthroughs.map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <div
                    style={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      background: epoch.accentColor,
                      flexShrink: 0,
                      marginTop: "6px",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.65)",
                      fontFamily: "Sora, sans-serif",
                      lineHeight: 1.5,
                    }}
                  >
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Signals */}
          <div>
            <div
              className="font-mono-geist mb-4"
              style={{
                fontSize: "8px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(212,160,23,0.8)",
              }}
            >
              ◈ KEY SIGNALS
            </div>
            <ul className="space-y-2">
              {epoch.keySignals.map((s) => (
                <li
                  key={s}
                  style={{
                    padding: "8px 12px",
                    background: "rgba(212,160,23,0.05)",
                    border: "1px solid rgba(212,160,23,0.12)",
                    borderRadius: "3px",
                  }}
                >
                  <span
                    className="font-mono-geist"
                    style={{
                      fontSize: "9px",
                      color: "rgba(255,255,255,0.65)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Strategic Implications */}
        <div
          className="mb-8 p-5"
          style={{
            background: "rgba(74,126,247,0.04)",
            border: "1px solid rgba(74,126,247,0.12)",
            borderLeft: `3px solid ${epoch.accentColor}`,
            borderRadius: "3px",
          }}
        >
          <div
            className="font-mono-geist mb-3"
            style={{
              fontSize: "8px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(74,126,247,0.8)",
            }}
          >
            ◆ STRATEGIC IMPLICATIONS
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.7)",
              fontFamily: "Sora, sans-serif",
              lineHeight: 1.75,
            }}
          >
            {epoch.strategicImplications}
          </p>
        </div>

        {/* Forward Trajectory */}
        <div
          className="mb-8 p-5"
          style={{
            background: `${epoch.ambientColor.replace("0.04", "0.08").replace("0.05", "0.1")}`,
            border: `1px solid ${epoch.accentColor.replace("0.8", "0.15")}`,
            borderRadius: "3px",
          }}
        >
          <div
            className="font-mono-geist mb-2"
            style={{
              fontSize: "8px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: epoch.accentColor,
            }}
          >
            ◈ FORWARD TRAJECTORY
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.65)",
              fontFamily: "Sora, sans-serif",
              lineHeight: 1.7,
              fontStyle: "italic",
            }}
          >
            {epoch.forwardTrajectory}
          </p>
        </div>

        {/* Deep Dive expandable sections */}
        <div>
          <div
            className="font-mono-geist mb-3"
            style={{
              fontSize: "8px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            ◇ DEEP DIVE
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            {deepDiveItems.map((item, i) => (
              <DeepDiveSection
                key={item.label}
                label={item.label}
                content={item.content}
                accentColor={epoch.accentColor}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface EpochsPageProps {
  onBack: () => void;
}

const LEGAL_NOTE =
  "EPOCHS™, HUMANON™, STEAMI™ and all associated initiatives operate under the parent institution THE STEMONEF™ ENTERPRISES.";

// ── Static research library ──────────────────────────────────────────────────
interface ResearchEntry {
  id: number;
  title: string;
  description: string;
  domain: string;
  project: string;
  authors: string;
  publicationDate: string;
  tags: string[];
}

const RESEARCH_LIBRARY: ResearchEntry[] = [
  {
    id: 1,
    title: "Climate Modeling Framework v2",
    description:
      "Comprehensive multi-variable climate modeling system incorporating ocean-atmosphere coupling, aerosol feedback loops, and land-use change data across 50-year projection horizons. The framework integrates satellite telemetry with on-ground sensor networks to produce high-resolution regional climate projections.",
    domain: "Climate",
    project: "GAIA",
    authors: "EPOCHS Research Team",
    publicationDate: "2025-11",
    tags: ["climate", "modeling", "prediction"],
  },
  {
    id: 2,
    title: "Distributed IoT Environmental Monitoring",
    description:
      "Architecture for large-scale environmental sensor networks employing edge-compute nodes, mesh communication protocols, and low-power long-range radio. The system supports sub-second environmental telemetry across thousands of distributed field stations with offline resilience.",
    domain: "Deep Technology",
    project: "EIOS",
    authors: "LAB NEIA",
    publicationDate: "2025-10",
    tags: ["IoT", "monitoring", "deep-tech"],
  },
  {
    id: 3,
    title: "Bias Mitigation in Healthcare AI",
    description:
      "Systematic review of bias sources in clinical AI systems covering training-data provenance, demographic representation gaps, and deployment-context shift. Includes a seven-point audit framework applicable to diagnostic, triage, and treatment-recommendation models.",
    domain: "Ethical AI",
    project: "STEMESA",
    authors: "EPOCHS Ethics Division",
    publicationDate: "2025-09",
    tags: ["ethics", "AI", "healthcare"],
  },
  {
    id: 4,
    title: "Ocean Health Index: Baseline Report",
    description:
      "First-phase oceanographic data synthesis combining satellite altimetry, buoy networks, and deep-sea sensor arrays across four ocean basins. Establishes baseline indices for sea surface temperature anomaly, pH, dissolved oxygen, and biomass density.",
    domain: "Environmental Intelligence",
    project: "GAIA",
    authors: "LAB INVOS",
    publicationDate: "2025-08",
    tags: ["ocean", "environment", "baseline"],
  },
];

const RESEARCH_DOMAINS = [
  "Climate",
  "Deep Technology",
  "Ethical AI",
  "Environmental Intelligence",
  "Medical Systems",
] as const;

// ── Sub-components ────────────────────────────────────────────────────────────

function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let lastHeroBg = 0;
    const HERO_INTERVAL = 1000 / 30;
    const nodes: { x: number; y: number; vx: number; vy: number; r: number }[] =
      [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 28; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2.5 + 1,
      });
    }

    function draw(timestamp = 0) {
      if (!canvas || !ctx) return;
      if (timestamp - lastHeroBg < HERO_INTERVAL) {
        animId = requestAnimationFrame(draw);
        return;
      }
      lastHeroBg = timestamp;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(74,126,247,0.5)";
        ctx.fill();
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(74,126,247,${0.12 * (1 - dist / 160)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.35 }}
      tabIndex={-1}
    />
  );
}

function PipelineNode({
  label,
  index,
  total,
}: { label: string; index: number; total: number }) {
  const isLast = index === total - 1;
  return (
    <div className="flex items-center">
      <div
        className="flex flex-col items-center gap-1"
        style={{ animationDelay: `${index * 0.15}s` }}
      >
        <div
          className="px-4 py-3 rounded-sm text-center animate-fade-in-up"
          style={{
            background: "rgba(74,126,247,0.08)",
            border: "1px solid rgba(74,126,247,0.25)",
            backdropFilter: "blur(12px)",
            minWidth: "140px",
            animationDelay: `${index * 0.18}s`,
          }}
        >
          <div
            className="font-mono-geist text-[9px] tracking-[0.2em] uppercase mb-1"
            style={{ color: "rgba(212,160,23,0.7)" }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>
          <div
            className="font-mono-geist text-xs"
            style={{ color: "rgba(255,255,255,0.8)", letterSpacing: "0.05em" }}
          >
            {label}
          </div>
        </div>
      </div>
      {!isLast && (
        <div className="flex items-center mx-2">
          <div
            className="progress-flow-line"
            style={{ width: "40px", height: "1px" }}
          />
          <span
            className="font-mono-geist text-xs ml-1"
            style={{ color: "rgba(212,160,23,0.6)" }}
          >
            →
          </span>
        </div>
      )}
    </div>
  );
}

// ── Interactive Research Domain Network ──────────────────────────────────────
interface DomainNetworkProps {
  activeFilter: string | null;
  onNodeClick: (domain: string | null) => void;
}

function DomainNetworkCanvas({
  activeFilter,
  onNodeClick,
}: DomainNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeFilterRef = useRef(activeFilter);

  useEffect(() => {
    activeFilterRef.current = activeFilter;
  }, [activeFilter]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;
    let lastFrame = 0;
    const FRAME_INTERVAL = 1000 / 30; // 30 FPS cap

    const domainNodes = [
      { label: "Climate", color: "#4a7ef7", x: 0.5, y: 0.2 },
      { label: "Deep Technology", color: "#d4a017", x: 0.2, y: 0.5 },
      { label: "Ethical AI", color: "#a78bfa", x: 0.8, y: 0.5 },
      {
        label: "Environmental Intelligence",
        color: "#22d3b0",
        x: 0.3,
        y: 0.82,
      },
      { label: "Medical Systems", color: "#f87171", x: 0.7, y: 0.82 },
    ];

    const connections = [
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 3],
      [2, 4],
      [3, 4],
      [1, 2],
    ];

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    function draw(timestamp = 0) {
      if (!canvas || !ctx) return;
      // 30 FPS cap
      if (timestamp - lastFrame < FRAME_INTERVAL) {
        animId = requestAnimationFrame(draw);
        return;
      }
      lastFrame = timestamp;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.02;

      const w = canvas.width;
      const h = canvas.height;
      const nodeR = Math.min(w, h) * 0.065;

      // Draw connections
      for (const [a, b] of connections) {
        const na = domainNodes[a];
        const nb = domainNodes[b];
        const ax = na.x * w;
        const ay = na.y * h;
        const bx = nb.x * w;
        const by = nb.y * h;
        const isActive =
          activeFilterRef.current === na.label ||
          activeFilterRef.current === nb.label;
        const lineAlpha = isActive ? 0.35 : 0.12;

        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.strokeStyle = `rgba(74,126,247,${lineAlpha + Math.sin(t + a + b) * 0.04})`;
        ctx.lineWidth = isActive ? 1.5 : 0.7;
        ctx.stroke();

        // Animated data pulse on active connection
        if (isActive) {
          const progress = (t * 0.5) % 1;
          const px = ax + (bx - ax) * progress;
          const py = ay + (by - ay) * progress;
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(212,160,23,0.8)";
          ctx.fill();
        }
      }

      // Draw nodes
      for (const node of domainNodes) {
        const nx = node.x * w;
        const ny = node.y * h;
        const isActive = activeFilterRef.current === node.label;
        const pulse = Math.sin(t * 1.5) * 0.12 + 1;
        const r = nodeR * (isActive ? 1.15 * pulse : 1);

        // Glow
        const glowGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, r * 2.2);
        const alpha = isActive ? 0.35 : 0.12;
        glowGrad.addColorStop(
          0,
          `${node.color}${Math.round(alpha * 255)
            .toString(16)
            .padStart(2, "0")}`,
        );
        glowGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(nx, ny, r * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(nx, ny, r, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? `${node.color}40` : "rgba(4,5,14,0.85)";
        ctx.fill();
        ctx.strokeStyle = isActive ? node.color : `${node.color}88`;
        ctx.lineWidth = isActive ? 2.5 : 1.2;
        ctx.stroke();

        // Inner pulse dot
        ctx.beginPath();
        ctx.arc(
          nx,
          ny,
          4 + (isActive ? Math.sin(t * 2) * 2 : 0),
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = node.color;
        ctx.fill();

        // Label
        ctx.font = `${Math.max(9, r * 0.38)}px "Geist Mono", monospace`;
        ctx.fillStyle = isActive
          ? "rgba(255,255,255,0.95)"
          : "rgba(255,255,255,0.6)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Word-wrap label across 2 lines if needed
        const words = node.label.split(" ");
        if (words.length > 2) {
          const mid = Math.ceil(words.length / 2);
          const line1 = words.slice(0, mid).join(" ");
          const line2 = words.slice(mid).join(" ");
          ctx.fillText(line1, nx, ny + r + 16);
          ctx.fillText(line2, nx, ny + r + 28);
        } else {
          ctx.fillText(node.label, nx, ny + r + 16);
        }
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const w = canvas.width;
      const h = canvas.height;
      const nodeR = Math.min(w, h) * 0.065;

      // Must match the draw loop node list exactly
      const domainNodes = [
        { label: "Climate", x: 0.5, y: 0.2 },
        { label: "Deep Technology", x: 0.2, y: 0.5 },
        { label: "Ethical AI", x: 0.8, y: 0.5 },
        { label: "Environmental Intelligence", x: 0.3, y: 0.82 },
        { label: "Medical Systems", x: 0.7, y: 0.82 },
      ];

      for (const node of domainNodes) {
        const nx = node.x * w;
        const ny = node.y * h;
        const dist = Math.sqrt((mx - nx) ** 2 + (my - ny) ** 2);
        if (dist < nodeR * 1.3) {
          onNodeClick(activeFilter === node.label ? null : node.label);
          return;
        }
      }
      onNodeClick(null);
    },
    [activeFilter, onNodeClick],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLCanvasElement>) => {
      if (e.key === "Escape") onNodeClick(null);
    },
    [onNodeClick],
  );

  return (
    <div ref={containerRef} className="w-full" style={{ height: "320px" }}>
      <canvas
        ref={canvasRef}
        data-ocid="epochs.domain_network.canvas_target"
        className="w-full h-full cursor-pointer"
        tabIndex={0}
        role="img"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label="Interactive research domain network. Click a node to filter the research library."
      />
    </div>
  );
}

// ── Animated Chart Widgets ────────────────────────────────────────────────────
function BarChartWidget({
  title,
  subtitle,
}: { title: string; subtitle: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const bars = [0.55, 0.58, 0.62, 0.68, 0.72, 0.79];
    let progress = 0;
    let animId: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      progress = Math.min(progress + 0.025, 1);
      const barW = canvas.width / (bars.length * 2);
      bars.forEach((h, i) => {
        const x = i * barW * 2 + barW * 0.5;
        const bh = h * canvas.height * progress;
        const grad = ctx.createLinearGradient(
          x,
          canvas.height,
          x,
          canvas.height - bh,
        );
        grad.addColorStop(0, "rgba(74,126,247,0.8)");
        grad.addColorStop(1, "rgba(74,126,247,0.25)");
        ctx.fillStyle = grad;
        ctx.fillRect(x, canvas.height - bh, barW, bh);
      });
      if (progress < 1) animId = requestAnimationFrame(draw);
    }
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);
  return (
    <div
      className="p-5 rounded-sm epochs-reveal reveal"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(74,126,247,0.15)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="font-mono-geist text-[9px] tracking-[0.3em] uppercase mb-1"
        style={{ color: "rgba(212,160,23,0.7)" }}
      >
        {title}
      </div>
      <div
        className="text-xs mb-4"
        style={{
          color: "rgba(255,255,255,0.35)",
          fontFamily: "Sora, sans-serif",
        }}
      >
        {subtitle}
      </div>
      <canvas ref={canvasRef} className="w-full" style={{ height: "80px" }} />
    </div>
  );
}

function LineChartWidget({
  title,
  subtitle,
}: { title: string; subtitle: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const points = [0.4, 0.42, 0.48, 0.52, 0.58, 0.64, 0.71, 0.76];
    let progress = 0;
    let animId: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      progress = Math.min(progress + 0.02, 1);
      const visible = Math.ceil(progress * points.length);
      ctx.beginPath();
      for (let i = 0; i < visible; i++) {
        const x = (i / (points.length - 1)) * canvas.width;
        const y = canvas.height - points[i] * canvas.height;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(212,160,23,0.7)";
      ctx.lineWidth = 2;
      ctx.stroke();
      // Area fill
      if (visible > 1) {
        const last = visible - 1;
        ctx.lineTo((last / (points.length - 1)) * canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        const areaGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        areaGrad.addColorStop(0, "rgba(212,160,23,0.15)");
        areaGrad.addColorStop(1, "transparent");
        ctx.fillStyle = areaGrad;
        ctx.fill();
      }
      if (progress < 1) animId = requestAnimationFrame(draw);
    }
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);
  return (
    <div
      className="p-5 rounded-sm epochs-reveal reveal"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(212,160,23,0.15)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="font-mono-geist text-[9px] tracking-[0.3em] uppercase mb-1"
        style={{ color: "rgba(212,160,23,0.7)" }}
      >
        {title}
      </div>
      <div
        className="text-xs mb-4"
        style={{
          color: "rgba(255,255,255,0.35)",
          fontFamily: "Sora, sans-serif",
        }}
      >
        {subtitle}
      </div>
      <canvas ref={canvasRef} className="w-full" style={{ height: "80px" }} />
    </div>
  );
}

function HBarChartWidget({
  title,
  subtitle,
}: { title: string; subtitle: string }) {
  const regions = [
    { label: "Boreal", pct: 72, color: "rgba(34,211,176,0.7)" },
    { label: "Tropical", pct: 48, color: "rgba(74,126,247,0.7)" },
    { label: "Temperate", pct: 61, color: "rgba(212,160,23,0.7)" },
    { label: "Savanna", pct: 34, color: "rgba(167,139,250,0.7)" },
  ];
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setAnimated(true);
      },
      { threshold: 0.3 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className="p-5 rounded-sm epochs-reveal reveal"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(34,211,176,0.15)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="font-mono-geist text-[9px] tracking-[0.3em] uppercase mb-1"
        style={{ color: "rgba(212,160,23,0.7)" }}
      >
        {title}
      </div>
      <div
        className="text-xs mb-4"
        style={{
          color: "rgba(255,255,255,0.35)",
          fontFamily: "Sora, sans-serif",
        }}
      >
        {subtitle}
      </div>
      <div className="space-y-2.5">
        {regions.map((r) => (
          <div key={r.label}>
            <div className="flex justify-between mb-1">
              <span
                className="font-mono-geist text-[9px]"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {r.label}
              </span>
              <span
                className="font-mono-geist text-[9px]"
                style={{ color: r.color }}
              >
                {r.pct}%
              </span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: animated ? `${r.pct}%` : "0%",
                  background: r.color,
                  transitionDelay: "0.2s",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GaugeWidget({ title, subtitle }: { title: string; subtitle: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score] = useState(67);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let progress = 0;
    let animId: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      progress = Math.min(progress + 0.018, 1);
      const cx = canvas.width / 2;
      const cy = canvas.height * 0.75;
      const r = Math.min(canvas.width, canvas.height) * 0.55;
      const startAngle = Math.PI;
      const endAngle = Math.PI + Math.PI * (score / 100) * progress;

      // Track
      ctx.beginPath();
      ctx.arc(cx, cy, r, Math.PI, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.stroke();

      // Value arc
      const grad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
      grad.addColorStop(0, "rgba(74,126,247,0.8)");
      grad.addColorStop(1, "rgba(34,211,176,0.8)");
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 10;
      ctx.stroke();

      // Score text
      ctx.font = `bold ${r * 0.42}px "Geist Mono", monospace`;
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${Math.round(score * progress)}`, cx, cy - r * 0.12);
      ctx.font = `${r * 0.18}px "Geist Mono", monospace`;
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillText("/ 100", cx, cy + r * 0.2);

      if (progress < 1) animId = requestAnimationFrame(draw);
    }
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    draw();
    return () => cancelAnimationFrame(animId);
  }, [score]);
  return (
    <div
      className="p-5 rounded-sm epochs-reveal reveal"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(34,211,176,0.15)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="font-mono-geist text-[9px] tracking-[0.3em] uppercase mb-1"
        style={{ color: "rgba(212,160,23,0.7)" }}
      >
        {title}
      </div>
      <div
        className="text-xs mb-2"
        style={{
          color: "rgba(255,255,255,0.35)",
          fontFamily: "Sora, sans-serif",
        }}
      >
        {subtitle}
      </div>
      <canvas ref={canvasRef} className="w-full" style={{ height: "100px" }} />
    </div>
  );
}

// ── Collaboration Gateway Card ────────────────────────────────────────────────
function CollabCard({
  glyph,
  title,
  desc,
  index,
}: { glyph: string; title: string; desc: string; index: number }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="epochs-reveal reveal"
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div
        className="p-7 rounded-sm h-full transition-all duration-300"
        style={{
          background: hovered
            ? "rgba(74,126,247,0.07)"
            : "rgba(255,255,255,0.025)",
          border: `1px solid ${hovered ? "rgba(74,126,247,0.35)" : "rgba(255,255,255,0.07)"}`,
          backdropFilter: "blur(12px)",
          boxShadow: hovered
            ? "0 0 24px rgba(74,126,247,0.12), 0 8px 40px rgba(0,0,0,0.4)"
            : "none",
          transform: hovered ? "translateY(-3px)" : "none",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="text-2xl mb-4 animate-glyph-pulse"
          style={{ color: "rgba(74,126,247,0.7)" }}
          aria-hidden="true"
        >
          {glyph}
        </div>
        <h3
          className="font-display text-lg font-light mb-2"
          style={{ letterSpacing: "0.1em", color: "rgba(255,255,255,0.88)" }}
        >
          {title}
        </h3>
        <p
          className="text-sm leading-relaxed mb-4"
          style={{
            color: "rgba(255,255,255,0.5)",
            fontFamily: "Sora, sans-serif",
          }}
        >
          {desc}
        </p>
        <button
          type="button"
          data-ocid={`epochs.collab.card.${index + 1}`}
          onClick={() => setOpen(!open)}
          className="font-mono-geist text-[10px] tracking-[0.25em] uppercase transition-all duration-200"
          style={{
            background: "none",
            border: "1px solid rgba(74,126,247,0.3)",
            color: "rgba(74,126,247,0.7)",
            padding: "6px 14px",
            cursor: "pointer",
            borderRadius: "2px",
          }}
        >
          {open ? "CLOSE ↑" : "LEARN MORE ↓"}
        </button>
        {open && (
          <div
            className="mt-4 p-4 rounded-sm animate-fade-in-up"
            style={{
              background: "rgba(74,126,247,0.06)",
              border: "1px solid rgba(74,126,247,0.18)",
            }}
          >
            <p
              className="text-xs leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.55)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              To initiate a collaboration, submit a proposal through the
              STEMONEF engagement system. All partnership proposals undergo an
              ethical alignment review before engagement begins. Institutional
              collaborations include a co-governance agreement ensuring research
              sovereignty is maintained.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page Component ───────────────────────────────────────────────────────
export default function EpochsPage({ onBack }: EpochsPageProps) {
  const [hoveredGaia, setHoveredGaia] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  // Civilization timeline state
  const [activeEpochId, setActiveEpochId] = useState(1);
  const [timelineScrollProgress, setTimelineScrollProgress] = useState(0);

  // Parallax refs
  const heroBgRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroCanvasRef = useRef<HTMLDivElement>(null);
  const timelineSectionRef = useRef<HTMLElement>(null);

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
    const revealEls = document.querySelectorAll(".epochs-reveal");
    for (const el of revealEls) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Parallax scroll + timeline progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Parallax layers
      if (heroBgRef.current) {
        heroBgRef.current.style.transform = `translateY(${scrollY * 0.15}px)`;
      }
      if (heroTextRef.current) {
        heroTextRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
      if (heroCanvasRef.current) {
        heroCanvasRef.current.style.transform = `translateY(${scrollY * 0.05}px)`;
      }

      // Timeline progress
      const section = timelineSectionRef.current;
      if (section) {
        const rect = section.getBoundingClientRect();
        const sectionTop = scrollY + rect.top;
        const sectionHeight = section.offsetHeight;
        const progress = Math.max(
          0,
          Math.min(100, ((scrollY - sectionTop) / sectionHeight) * 100),
        );
        setTimelineScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleEpochVisible = useCallback((epochId: number) => {
    setActiveEpochId(epochId);
  }, []);

  const handleTimelineNodeClick = useCallback((epochId: number) => {
    const el = document.getElementById(`epoch-${epochId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const gaiaFocusAreas = [
    "Climate modeling and prediction",
    "Sustainable healthcare",
    "Environmental impact assessment",
    "Carbon capture systems",
    "Renewable energy integration",
  ];

  const pipelineSteps = [
    "Intelligence Platforms",
    "Operating Systems",
    "IoT Networks",
    "Analytics Infrastructure",
    "Sustainability Enterprise Systems",
  ];

  const researchSignals = [
    {
      title: "Climate Risk Modeling",
      domain: "Climate",
      pulse: "#4a7ef7",
      delay: "0s",
    },
    {
      title: "Ocean System Monitoring",
      domain: "Environmental",
      pulse: "#22d3b0",
      delay: "0.08s",
    },
    {
      title: "Neural Decision Mapping",
      domain: "Ethical AI",
      pulse: "#a78bfa",
      delay: "0.16s",
    },
    {
      title: "Environmental Data Synthesis",
      domain: "Environmental Intelligence",
      pulse: "#22d3b0",
      delay: "0.24s",
    },
  ];

  const collabCards = [
    {
      glyph: "◈",
      title: "Research Partnerships",
      desc: "Collaborate on fundamental and applied research across EPOCHS domains — from climate systems to ethical AI frameworks.",
    },
    {
      glyph: "◆",
      title: "Industry Collaboration",
      desc: "Integrate research outputs into product and technology development pipelines, bridging science and application.",
    },
    {
      glyph: "◇",
      title: "Field Deployment",
      desc: "Partner with EPOCHS labs to scale solutions in real-world environments, validating research at operational scale.",
    },
    {
      glyph: "▣",
      title: "Academic Collaboration",
      desc: "Engage through curriculum co-development, joint publications, and talent exchange across EPOCHS research domains.",
    },
  ];

  const filteredLibrary = activeFilter
    ? RESEARCH_LIBRARY.filter((e) => e.domain === activeFilter)
    : RESEARCH_LIBRARY;

  const handleNodeClick = useCallback((domain: string | null) => {
    setActiveFilter(domain);
    setExpandedEntry(null);
  }, []);

  const activeEpoch = CIVILIZATION_EPOCHS.find((e) => e.id === activeEpochId);

  return (
    <div
      ref={revealRef}
      style={{ background: "var(--neural-bg)", minHeight: "100vh" }}
    >
      {/* Keyframe styles for civilization system */}
      <style>{`
        @keyframes signalFadeIn {
          from { opacity: 0; transform: translateX(6px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes epochFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes epochNodePulse {
          0% { box-shadow: 0 0 0 0 rgba(74,126,247,0.6); }
          70% { box-shadow: 0 0 0 10px rgba(74,126,247,0); }
          100% { box-shadow: 0 0 0 0 rgba(74,126,247,0); }
        }
      `}</style>

      {/* Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Floating Epoch Signals Panel */}
      <FloatingEpochSignalsPanel activeEpoch={activeEpoch} />

      {/* Section Nav */}
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
          data-ocid="epochs.back.button"
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
          EPOCHS
        </div>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[90vh] flex items-center px-6 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, rgba(10,18,50,0.9) 0%, rgba(4,5,14,1) 60%)",
        }}
      >
        {/* Canvas parallax wrapper */}
        <div
          ref={heroCanvasRef}
          className="absolute inset-0 will-change-transform"
          aria-hidden="true"
        >
          <AnimatedBackground />
        </div>

        {/* Grid background parallax layer */}
        <div
          ref={heroBgRef}
          className="neural-grid-bg absolute inset-0 opacity-30 will-change-transform"
          style={{ top: "-20%", bottom: "-20%" }}
          aria-hidden="true"
        />

        {/* Hero text with parallax */}
        <div
          ref={heroTextRef}
          className="relative z-10 max-w-7xl mx-auto w-full pt-16 pb-20 will-change-transform"
        >
          <div
            className="font-mono-geist text-xs tracking-[0.4em] uppercase mb-6 animate-fade-in-up"
            style={{ color: "rgba(212,160,23,0.7)" }}
          >
            ◈ RESEARCH & INNOVATION ORGANIZATION
          </div>

          <h1
            className="font-display font-light text-gradient-hero mb-3 animate-fade-in-up"
            style={{
              fontSize: "clamp(4rem, 12vw, 9rem)",
              letterSpacing: "0.1em",
              lineHeight: 0.9,
              animationDelay: "0.1s",
            }}
          >
            EPOCHS
          </h1>

          {/* Civilization Interface subtitle */}
          <div
            className="animate-fade-in-up mb-4"
            style={{ animationDelay: "0.18s" }}
          >
            <span
              className="font-display"
              style={{
                fontSize: "clamp(0.9rem, 2vw, 1.25rem)",
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.5)",
                fontFamily: "Sora, sans-serif",
                textTransform: "uppercase",
              }}
            >
              THE CIVILIZATION EXPLORATION INTERFACE
            </span>
          </div>

          <p
            className="font-display text-2xl md:text-3xl font-light mb-3 animate-fade-in-up"
            style={{
              color: "rgba(255,255,255,0.65)",
              letterSpacing: "0.06em",
              maxWidth: "700px",
              animationDelay: "0.2s",
            }}
          >
            Emergent Projects ON Climate, Human &amp; Systems Research
          </p>

          {/* Philosophical subtitle */}
          <p
            className="animate-fade-in-up mb-8"
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: "14px",
              color: "rgba(255,255,255,0.42)",
              maxWidth: "560px",
              lineHeight: 1.75,
              animationDelay: "0.28s",
            }}
          >
            Tracing the architecture of human discovery — from the first
            principles of natural philosophy to the emergent systems of
            planetary intelligence.
          </p>

          <div
            className="flex flex-wrap items-center gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.35s" }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "10px 20px",
                background: "rgba(74,126,247,0.08)",
                border: "1px solid rgba(74,126,247,0.2)",
                borderRadius: "2px",
              }}
            >
              <span
                className="font-mono-geist text-xs tracking-[0.25em] uppercase"
                style={{ color: "rgba(138,180,255,0.8)" }}
              >
                Primary Research &amp; Innovation Organization of STEMONEF
                Enterprises
              </span>
            </div>

            {/* CTA scroll button */}
            <button
              type="button"
              data-ocid="epochs.hero.primary_button"
              onClick={() => {
                const el = document.getElementById("civilization-timeline");
                if (el)
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="font-mono-geist text-xs tracking-[0.2em] uppercase transition-all duration-300"
              style={{
                background: "rgba(212,160,23,0.1)",
                border: "1px solid rgba(212,160,23,0.35)",
                color: "rgba(212,160,23,0.9)",
                padding: "10px 22px",
                borderRadius: "2px",
                cursor: "pointer",
                letterSpacing: "0.2em",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(212,160,23,0.18)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(212,160,23,0.7)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(212,160,23,0.1)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(212,160,23,0.35)";
              }}
            >
              ENTER THE TIMELINE ↓
            </button>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent, var(--neural-bg))",
          }}
        />
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ── CIVILIZATION EXPLORATION INTERFACE ───────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section
        ref={timelineSectionRef}
        id="civilization-timeline"
        className="py-20 px-6 relative"
        style={{
          background:
            "linear-gradient(180deg, rgba(4,5,14,0) 0%, rgba(8,10,28,0.5) 50%, rgba(4,5,14,0) 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="mb-12 epochs-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◈ CIVILIZATION EXPLORATION INTERFACE
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light text-gradient-hero mb-4"
              style={{ letterSpacing: "0.08em" }}
            >
              The Architecture of Human Progress
            </h2>
            <p
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: "14px",
                color: "rgba(255,255,255,0.45)",
                maxWidth: "560px",
                lineHeight: 1.75,
              }}
            >
              Six epochs of scientific and technological transformation — each
              one building the cognitive, material, and institutional substrate
              for the next.
            </p>
          </div>

          {/* Mobile timeline nav */}
          <CivilizationTimeline
            epochs={CIVILIZATION_EPOCHS}
            activeEpochId={activeEpochId}
            scrollProgress={timelineScrollProgress}
            onNodeClick={handleTimelineNodeClick}
          />

          {/* Desktop: flex layout with sticky timeline sidebar */}
          <div className="hidden lg:flex gap-8 relative">
            {/* Sticky timeline sidebar */}
            <div style={{ width: "80px", flexShrink: 0 }}>
              <CivilizationTimeline
                epochs={CIVILIZATION_EPOCHS}
                activeEpochId={activeEpochId}
                scrollProgress={timelineScrollProgress}
                onNodeClick={handleTimelineNodeClick}
              />
            </div>

            {/* Epoch blocks column */}
            <div className="flex-1 min-w-0" style={{ paddingRight: "240px" }}>
              {CIVILIZATION_EPOCHS.map((epoch, i) => (
                <EpochBlock
                  key={epoch.id}
                  epoch={epoch}
                  index={i}
                  isActive={activeEpochId === epoch.id}
                  onVisible={handleEpochVisible}
                />
              ))}
            </div>
          </div>

          {/* Mobile: epoch blocks without sidebar */}
          <div className="lg:hidden">
            {CIVILIZATION_EPOCHS.map((epoch, i) => (
              <EpochBlock
                key={epoch.id}
                epoch={epoch}
                index={i}
                isActive={activeEpochId === epoch.id}
                onVisible={handleEpochVisible}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}

      {/* ── Mission ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div
            className="epochs-reveal reveal"
            style={{ transitionDelay: "0s" }}
          >
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-4"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ MISSION
            </div>
          </div>
          <div
            className="glass-strong p-10 rounded-sm epochs-reveal reveal"
            style={{
              borderLeft: "3px solid rgba(74,126,247,0.5)",
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
              Conduct research across climate, technology, and medical domains
              while maintaining the highest ethical standards and translating
              discoveries into practical societal solutions.
            </p>
          </div>
        </div>
      </section>

      {/* ── Project GAIA ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 epochs-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◈ ACTIVE RESEARCH INITIATIVE
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              PROJECT GAIA
            </h2>
            <p
              className="mt-3 text-sm"
              style={{
                color: "rgba(255,255,255,0.4)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              Climate &amp; Sustainability Research
            </p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {gaiaFocusAreas.map((area, i) => (
                <div
                  key={area}
                  data-ocid={`epochs.gaia.card.${i + 1}`}
                  className="epochs-reveal reveal relative"
                  style={{ transitionDelay: `${i * 0.08}s` }}
                  onMouseEnter={() => setHoveredGaia(i)}
                  onMouseLeave={() => setHoveredGaia(null)}
                >
                  <div
                    className="p-6 rounded-sm h-full transition-all duration-300"
                    style={{
                      background:
                        hoveredGaia === i
                          ? "rgba(52,211,153,0.1)"
                          : "rgba(52,211,153,0.04)",
                      border:
                        hoveredGaia === i
                          ? "1px solid rgba(52,211,153,0.4)"
                          : "1px solid rgba(52,211,153,0.12)",
                      backdropFilter: "blur(12px)",
                      boxShadow:
                        hoveredGaia === i
                          ? "0 0 20px rgba(52,211,153,0.1), 0 8px 32px rgba(0,0,0,0.4)"
                          : "none",
                      transform:
                        hoveredGaia === i ? "translateY(-4px)" : "none",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className="w-2 h-2 rounded-full animate-node-pulse"
                        style={{
                          background: "rgba(52,211,153,0.8)",
                          animationDelay: `${i * 0.3}s`,
                        }}
                      />
                      <div
                        className="font-mono-geist text-[9px] tracking-[0.2em] uppercase"
                        style={{ color: "rgba(52,211,153,0.7)" }}
                      >
                        NODE {String(i + 1).padStart(2, "0")}
                      </div>
                    </div>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        fontFamily: "Sora, sans-serif",
                      }}
                    >
                      {area}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Labs ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 epochs-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ RESEARCH LABORATORIES
            </div>
            <h2
              className="font-display text-4xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              Active Labs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LAB INVOS */}
            <div
              className="glass-strong p-8 rounded-sm epochs-reveal reveal"
              style={{
                borderTop: "2px solid rgba(74,126,247,0.5)",
                transitionDelay: "0.1s",
              }}
            >
              <div
                className="font-mono-geist text-[10px] tracking-[0.35em] uppercase mb-2"
                style={{ color: "rgba(74,126,247,0.7)" }}
              >
                LABORATORY I
              </div>
              <h3
                className="font-display text-2xl font-light mb-2"
                style={{
                  letterSpacing: "0.15em",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                LAB INVOS
              </h3>
              <p
                className="text-xs mb-6"
                style={{
                  color: "rgba(212,160,23,0.7)",
                  fontFamily: "Geist Mono, monospace",
                  letterSpacing: "0.1em",
                }}
              >
                Research-Focused Laboratory
              </p>
              <ul className="space-y-3">
                {[
                  "Fundamental climate science",
                  "Environmental monitoring systems",
                  "Sustainability theory",
                  "Data analysis methodologies",
                  "Interdisciplinary climate research",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div
                      className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
                      style={{ background: "rgba(74,126,247,0.7)" }}
                    />
                    <span
                      className="text-sm"
                      style={{
                        color: "rgba(255,255,255,0.6)",
                        fontFamily: "Sora, sans-serif",
                      }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* LAB NEIA */}
            <div
              className="glass-strong p-8 rounded-sm epochs-reveal reveal"
              style={{
                borderTop: "2px solid rgba(167,139,250,0.5)",
                transitionDelay: "0.2s",
              }}
            >
              <div
                className="font-mono-geist text-[10px] tracking-[0.35em] uppercase mb-2"
                style={{ color: "rgba(167,139,250,0.7)" }}
              >
                LABORATORY II
              </div>
              <h3
                className="font-display text-2xl font-light mb-2"
                style={{
                  letterSpacing: "0.15em",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                LAB NEIA
              </h3>
              <p
                className="text-xs mb-6"
                style={{
                  color: "rgba(212,160,23,0.7)",
                  fontFamily: "Geist Mono, monospace",
                  letterSpacing: "0.1em",
                }}
              >
                Development-Focused Laboratory
              </p>
              <ul className="space-y-3">
                {[
                  "Sustainable technology prototyping",
                  "Climate solution testing",
                  "Environmental intervention scaling",
                  "Implementation partnerships",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div
                      className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
                      style={{ background: "rgba(167,139,250,0.7)" }}
                    />
                    <span
                      className="text-sm"
                      style={{
                        color: "rgba(255,255,255,0.6)",
                        fontFamily: "Sora, sans-serif",
                      }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Project EIOS ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 epochs-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ DEEP TECHNOLOGY INITIATIVE
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              PROJECT EIOS
            </h2>
            <p
              className="mt-3 text-sm"
              style={{
                color: "rgba(255,255,255,0.4)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              Deep Technology &amp; Intelligence Systems
            </p>
          </div>

          <div
            className="glass p-8 rounded-sm epochs-reveal reveal overflow-x-auto"
            style={{ transitionDelay: "0.1s" }}
          >
            <div className="flex items-center flex-nowrap gap-0 min-w-max mx-auto justify-start lg:justify-center">
              {pipelineSteps.map((step, i) => (
                <PipelineNode
                  key={step}
                  label={step}
                  index={i}
                  total={pipelineSteps.length}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Project STEMESA ───────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 epochs-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◈ ETHICAL AI INITIATIVE
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              PROJECT STEMESA
            </h2>
            <p
              className="mt-3 text-sm"
              style={{
                color: "rgba(255,255,255,0.4)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              Ethical AI Development
            </p>
          </div>

          <div
            className="glass-strong p-8 rounded-sm epochs-reveal reveal relative overflow-hidden"
            style={{
              borderLeft: "3px solid rgba(212,160,23,0.4)",
              transitionDelay: "0.15s",
            }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm mb-6"
              style={{
                background: "rgba(212,160,23,0.1)",
                border: "1px solid rgba(212,160,23,0.3)",
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
                style={{ background: "#d4a017" }}
              />
              <span
                className="font-mono-geist text-[10px] tracking-[0.3em] uppercase text-gradient-gold"
                style={{ letterSpacing: "0.2em" }}
              >
                Conceptual Development Stage
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                "Brain research",
                "Cognitive modeling",
                "Human-AI interaction",
                "Healthcare AI",
                "Bias mitigation",
                "Explainable AI frameworks",
              ].map((topic) => (
                <div
                  key={topic}
                  className="flex items-center gap-3 py-3 px-4"
                  style={{
                    background: "rgba(212,160,23,0.04)",
                    border: "1px solid rgba(212,160,23,0.1)",
                    borderRadius: "2px",
                  }}
                >
                  <div
                    className="w-1 h-1 rounded-full flex-shrink-0"
                    style={{ background: "rgba(212,160,23,0.6)" }}
                  />
                  <span
                    className="text-sm"
                    style={{
                      color: "rgba(255,255,255,0.65)",
                      fontFamily: "Sora, sans-serif",
                    }}
                  >
                    {topic}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ── NEW SECTIONS ─────────────────────────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════ */}

      {/* ── A. Interactive Research Domain Network ──────────────────────── */}
      <section className="py-20 px-6" id="research-network">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 epochs-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◈ INTERACTIVE KNOWLEDGE MAP
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              Research Domain Network
            </h2>
            <p
              className="mt-3 text-sm"
              style={{
                color: "rgba(255,255,255,0.4)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              Click a node to filter the Research Library below
            </p>
          </div>

          <div
            className="glass-strong rounded-sm epochs-reveal reveal overflow-hidden"
            style={{
              border: "1px solid rgba(74,126,247,0.12)",
              transitionDelay: "0.1s",
            }}
          >
            <DomainNetworkCanvas
              activeFilter={activeFilter}
              onNodeClick={handleNodeClick}
            />
          </div>

          {activeFilter && (
            <div className="mt-4 flex items-center gap-3 animate-fade-in-up">
              <span
                className="font-mono-geist text-xs tracking-[0.2em] uppercase"
                style={{ color: "rgba(74,126,247,0.7)" }}
              >
                Active filter:
              </span>
              <span
                className="font-mono-geist text-xs px-3 py-1 rounded-sm"
                style={{
                  background: "rgba(74,126,247,0.1)",
                  border: "1px solid rgba(74,126,247,0.3)",
                  color: "rgba(74,126,247,0.9)",
                }}
              >
                {activeFilter}
              </span>
              <button
                type="button"
                data-ocid="epochs.filter.button"
                onClick={() => setActiveFilter(null)}
                className="font-mono-geist text-[10px] tracking-widest uppercase"
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.35)",
                  cursor: "pointer",
                  letterSpacing: "0.15em",
                }}
              >
                CLEAR ×
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── B. Research Signals ───────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 epochs-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ ACTIVE SIGNALS
            </div>
            <h2
              className="font-display text-4xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              Research Signals
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {researchSignals.map((sig, i) => (
              <div
                key={sig.title}
                data-ocid={`epochs.signal.card.${i + 1}`}
                className="epochs-reveal reveal animate-fade-in-up"
                style={{ transitionDelay: sig.delay }}
              >
                <div
                  className="p-6 rounded-sm h-full relative overflow-hidden transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {/* Scan line animation */}
                  <div
                    className="animate-card-scan pointer-events-none absolute left-0 right-0 z-10"
                    style={{
                      height: "1px",
                      background: `linear-gradient(90deg, transparent, ${sig.pulse}55, transparent)`,
                      ["--scan-delay" as string]: `${i * 1.5}s`,
                    }}
                    aria-hidden="true"
                  />
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="w-2 h-2 rounded-full animate-pulse-glow"
                      style={{ background: sig.pulse }}
                    />
                    <span
                      className="font-mono-geist text-[9px] tracking-[0.2em] uppercase"
                      style={{ color: `${sig.pulse}99` }}
                    >
                      {sig.domain}
                    </span>
                  </div>
                  <h3
                    className="font-display text-base font-light"
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {sig.title}
                  </h3>
                  <div
                    className="mt-3 h-px w-full"
                    style={{
                      background: `linear-gradient(90deg, ${sig.pulse}44, transparent)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── C. EPOCHS Research Library ────────────────────────────────────── */}
      <section className="py-20 px-6" id="research-library">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 epochs-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◈ KNOWLEDGE REPOSITORY
            </div>
            <h2
              className="font-display text-4xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              EPOCHS Research Library
            </h2>
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap gap-2 mb-8 epochs-reveal reveal">
            <button
              type="button"
              data-ocid="epochs.library.filter.tab"
              onClick={() => {
                setActiveFilter(null);
                setExpandedEntry(null);
              }}
              className="font-mono-geist text-[10px] tracking-[0.2em] uppercase px-4 py-2 rounded-sm transition-all duration-200"
              style={{
                background: !activeFilter
                  ? "rgba(74,126,247,0.15)"
                  : "rgba(255,255,255,0.03)",
                border: `1px solid ${!activeFilter ? "rgba(74,126,247,0.45)" : "rgba(255,255,255,0.1)"}`,
                color: !activeFilter
                  ? "rgba(74,126,247,0.9)"
                  : "rgba(255,255,255,0.45)",
                cursor: "pointer",
              }}
            >
              All
            </button>
            {RESEARCH_DOMAINS.map((domain) => (
              <button
                key={domain}
                type="button"
                data-ocid={`epochs.library.${domain.toLowerCase().replace(/\s+/g, "-")}.tab`}
                onClick={() => {
                  setActiveFilter(domain);
                  setExpandedEntry(null);
                }}
                className="font-mono-geist text-[10px] tracking-[0.2em] uppercase px-4 py-2 rounded-sm transition-all duration-200"
                style={{
                  background:
                    activeFilter === domain
                      ? "rgba(74,126,247,0.15)"
                      : "rgba(255,255,255,0.03)",
                  border: `1px solid ${activeFilter === domain ? "rgba(74,126,247,0.45)" : "rgba(255,255,255,0.1)"}`,
                  color:
                    activeFilter === domain
                      ? "rgba(74,126,247,0.9)"
                      : "rgba(255,255,255,0.45)",
                  cursor: "pointer",
                }}
              >
                {domain}
              </button>
            ))}
          </div>

          {/* Library entries */}
          <div className="space-y-3">
            {filteredLibrary.length === 0 && (
              <div
                data-ocid="epochs.library.empty_state"
                className="py-12 text-center font-mono-geist text-xs"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                No research entries found for this domain.
              </div>
            )}
            {filteredLibrary.map((entry, i) => {
              const isExpanded = expandedEntry === entry.id;
              return (
                <div
                  key={entry.id}
                  data-ocid={`epochs.library.item.${i + 1}`}
                  className="epochs-reveal reveal"
                  style={{ transitionDelay: `${i * 0.06}s` }}
                >
                  <div
                    className="rounded-sm overflow-hidden transition-all duration-300"
                    style={{
                      background: "rgba(255,255,255,0.025)",
                      border: `1px solid ${isExpanded ? "rgba(74,126,247,0.3)" : "rgba(255,255,255,0.07)"}`,
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <button
                      type="button"
                      data-ocid={`epochs.library.toggle.${i + 1}`}
                      onClick={() =>
                        setExpandedEntry(isExpanded ? null : entry.id)
                      }
                      className="w-full text-left p-6 flex items-start justify-between gap-4 transition-all duration-200"
                      style={{
                        background: isExpanded
                          ? "rgba(74,126,247,0.05)"
                          : "transparent",
                        cursor: "pointer",
                        border: "none",
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span
                            className="font-mono-geist text-[9px] tracking-[0.25em] uppercase px-2 py-0.5 rounded-sm"
                            style={{
                              background: "rgba(74,126,247,0.1)",
                              border: "1px solid rgba(74,126,247,0.2)",
                              color: "rgba(74,126,247,0.8)",
                            }}
                          >
                            {entry.domain}
                          </span>
                          <span
                            className="font-mono-geist text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-sm"
                            style={{
                              background: "rgba(212,160,23,0.08)",
                              border: "1px solid rgba(212,160,23,0.2)",
                              color: "rgba(212,160,23,0.7)",
                            }}
                          >
                            {entry.project}
                          </span>
                        </div>
                        <h3
                          className="font-display text-lg font-light"
                          style={{
                            color: "rgba(255,255,255,0.85)",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {entry.title}
                        </h3>
                        <p
                          className="text-xs mt-1"
                          style={{
                            color: "rgba(255,255,255,0.35)",
                            fontFamily: "Sora, sans-serif",
                          }}
                        >
                          {entry.authors} · {entry.publicationDate}
                        </p>
                      </div>
                      <div
                        className="font-mono-geist text-sm flex-shrink-0 mt-1"
                        style={{
                          color: "rgba(255,255,255,0.3)",
                          transform: isExpanded ? "rotate(180deg)" : "none",
                          transition: "transform 0.2s",
                        }}
                      >
                        ▾
                      </div>
                    </button>

                    {isExpanded && (
                      <div
                        className="px-6 pb-6 animate-fade-in-up"
                        style={{ borderTop: "1px solid rgba(74,126,247,0.1)" }}
                      >
                        <p
                          className="text-sm leading-relaxed mt-4"
                          style={{
                            color: "rgba(255,255,255,0.6)",
                            fontFamily: "Sora, sans-serif",
                          }}
                        >
                          {entry.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {entry.tags.map((tag) => (
                            <span
                              key={tag}
                              className="font-mono-geist text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 rounded-sm"
                              style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "rgba(255,255,255,0.4)",
                              }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── D. Climate Intelligence Dashboard ────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 epochs-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ DATA INTELLIGENCE LAYER
            </div>
            <div className="flex flex-wrap items-center gap-4 mb-2">
              <h2
                className="font-display text-4xl font-light text-gradient-hero"
                style={{ letterSpacing: "0.08em" }}
              >
                Climate Intelligence Dashboard
              </h2>
              <span
                className="font-mono-geist text-[9px] tracking-[0.25em] uppercase px-3 py-1.5 rounded-sm"
                style={{
                  background: "rgba(212,160,23,0.1)",
                  border: "1px solid rgba(212,160,23,0.3)",
                  color: "rgba(212,160,23,0.8)",
                }}
              >
                ◈ LIVE DATA INTEGRATION — FUTURE RELEASE
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BarChartWidget
              title="Global Temperature Anomaly"
              subtitle="6-period rolling baseline deviation (°C)"
            />
            <LineChartWidget
              title="Carbon Emission Trends"
              subtitle="Cumulative atmospheric CO₂ trajectory index"
            />
            <HBarChartWidget
              title="Forest Coverage Metrics"
              subtitle="% coverage by region — current vs baseline"
            />
            <GaugeWidget
              title="Ocean Health Indicators"
              subtitle="Composite marine ecosystem health index"
            />
          </div>
        </div>
      </section>

      {/* ── E. Collaboration Gateway ─────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 epochs-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◈ PARTNERSHIP ARCHITECTURE
            </div>
            <h2
              className="font-display text-4xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              Collaboration Gateway
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {collabCards.map((card, i) => (
              <CollabCard key={card.title} {...card} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── F. Scientific Integrity ───────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 epochs-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ RESEARCH GOVERNANCE
            </div>
            <h2
              className="font-display text-4xl font-light text-gradient-hero"
              style={{ letterSpacing: "0.08em" }}
            >
              Scientific Integrity &amp; Governance
            </h2>
          </div>

          <div
            className="glass-strong p-8 rounded-sm epochs-reveal reveal relative overflow-hidden"
            style={{
              borderLeft: "3px solid rgba(212,160,23,0.5)",
              transitionDelay: "0.1s",
            }}
          >
            <div
              className="animate-card-scan pointer-events-none absolute left-0 right-0 z-10"
              style={{
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(212,160,23,0.35), transparent)",
              }}
              aria-hidden="true"
            />
            <div className="flex items-center gap-3 mb-6">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm"
                style={{
                  background: "rgba(212,160,23,0.1)",
                  border: "1px solid rgba(212,160,23,0.3)",
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
                  style={{ background: "#d4a017" }}
                />
                <span
                  className="font-mono-geist text-[9px] tracking-[0.3em] uppercase"
                  style={{ color: "#d4a017" }}
                >
                  ETHOS Governed
                </span>
              </div>
            </div>
            <p
              className="text-base leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.7)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              All EPOCHS research operates under the STEMONEF Ethics Framework,
              governed by the ETHOS pillar. Research outputs undergo mandatory
              pre-publication ethical review, bias auditing, and external peer
              validation before release. No research output is made public
              without independent verification of both its methodology and its
              potential societal implications.
            </p>
          </div>
        </div>
      </section>

      {/* Legal Footer Note */}
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
