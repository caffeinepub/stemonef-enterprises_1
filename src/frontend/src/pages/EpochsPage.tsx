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
              {/* Node dot with Stage 6 hover ripple */}
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      border: `1px solid ${epoch.accentColor.replace("0.8", "0.4")}`,
                      animation: "epochNodePulse 2s ease-out infinite",
                    }}
                    aria-hidden="true"
                  />
                )}
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
              </div>
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
  const contentRef = useRef<HTMLDivElement>(null);

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
        <div className="flex items-center gap-2.5">
          <div
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: open ? accentColor : "rgba(255,255,255,0.2)",
              boxShadow: open ? `0 0 6px ${accentColor}` : "none",
              transition: "all 0.3s ease",
              flexShrink: 0,
            }}
          />
          <span
            className="font-mono-geist"
            style={{
              fontSize: "9px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: open ? accentColor : "rgba(255,255,255,0.5)",
              transition: "color 0.25s ease",
            }}
          >
            {label}
          </span>
        </div>
        <span
          style={{
            color: open ? accentColor : "rgba(255,255,255,0.3)",
            fontSize: "10px",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition:
              "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), color 0.25s ease",
            display: "inline-block",
          }}
        >
          ▾
        </span>
      </button>
      {/* Smooth max-height accordion */}
      <div
        ref={contentRef}
        style={{
          maxHeight: open ? "400px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          className="px-4 pb-4 pt-1"
          style={{
            animation: open ? "deepDiveOpen 0.35s ease forwards" : "none",
            borderLeft: `2px solid ${accentColor.replace("0.8", "0.25")}`,
            marginLeft: "16px",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.58)",
              fontFamily: "Sora, sans-serif",
              lineHeight: 1.75,
            }}
          >
            {content}
          </p>
        </div>
      </div>
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
  // Stage 6: reveal animation state
  const [blockVisible, setBlockVisible] = useState(false);

  // Intersection observer for active epoch tracking + Stage 6 entrance
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onVisible(epoch.id);
          setBlockVisible(true);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
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
          "background 0.6s ease, border-color 0.6s ease, box-shadow 0.6s ease, opacity 0.7s ease, transform 0.7s cubic-bezier(0.34,1.2,0.64,1)",
        boxShadow: isActive
          ? `0 0 40px ${epoch.accentColor.replace("0.8", "0.06")}, 0 8px 40px rgba(0,0,0,0.4)`
          : "0 4px 24px rgba(0,0,0,0.3)",
        // Stage 6 entrance animation
        opacity: blockVisible ? 1 : 0,
        transform: blockVisible
          ? "translateY(0) perspective(600px) rotateX(0deg)"
          : `translateY(28px) perspective(600px) rotateX(${index % 2 === 0 ? "1.5deg" : "-1.5deg"})`,
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
  impactClass?: "Foundational" | "Applied" | "Critical";
  methodology?: string;
  keyFindings?: string[];
  status?: "Active" | "Published" | "Under Review";
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
    impactClass: "Foundational",
    methodology:
      "Multi-variable climate simulation, satellite-ground truth fusion, ensemble modeling",
    keyFindings: [
      "50-year projections validated against 30 years of historical data",
      "Ocean-atmosphere coupling improves regional accuracy by 18%",
      "Aerosol feedback integration reduces projection uncertainty by 12%",
      "High-resolution outputs available at 5km grid resolution",
      "Framework open-sourced for partner institution replication",
    ],
    status: "Published",
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
    impactClass: "Applied",
    methodology:
      "Distributed systems design, field deployment benchmarking, mesh protocol evaluation",
    keyFindings: [
      "Sub-second telemetry across 1,000+ nodes demonstrated in field",
      "Mesh protocol maintains 96% uptime during connectivity disruptions",
      "Edge compute nodes reduce central processing load by 84%",
      "Low-power radio achieves 15km range in open terrain",
      "Offline resilience confirmed across 48-hour connectivity blackouts",
    ],
    status: "Published",
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
    impactClass: "Critical",
    methodology:
      "Systematic literature review, quantitative bias auditing, stakeholder consultation",
    keyFindings: [
      "Seven-point audit framework validated across 12 clinical AI systems",
      "Training data bias identified as primary variance driver in 83% of cases",
      "Demographic parity gaps reduced by 41% after framework remediation",
      "Calibration errors correlate with deployment context shift in all cases reviewed",
      "Framework adopted as standard by three partner health networks",
    ],
    status: "Published",
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
    impactClass: "Foundational",
    methodology:
      "Multi-sensor oceanographic synthesis, satellite altimetry, deep-sea array deployment",
    keyFindings: [
      "Baseline indices established across four major ocean basins",
      "Sea surface temperature anomaly: +0.8°C above 1990 baseline",
      "Ocean pH decline of 0.11 units since pre-industrial baseline confirmed",
      "Dissolved oxygen decline of 6.2% in tropical thermocline zones",
      "Biomass density reduction of 18% in surveyed Pacific sectors",
    ],
    status: "Published",
  },
  {
    id: 5,
    title: "AI-Assisted Diagnostic Pathways in Low-Resource Settings",
    description:
      "Investigates the deployment of lightweight AI diagnostic models in underserved health systems across Sub-Saharan Africa and South Asia. The research focuses on model compression techniques, federated learning protocols that preserve patient privacy without central data aggregation, and community health worker integration workflows. Trials demonstrate 34% improvement in early-stage disease detection with 91% model uptime on sub-threshold hardware.",
    domain: "Medical Systems",
    project: "STEMESA",
    authors: "EPOCHS Medical Intelligence Division",
    publicationDate: "2025-10",
    tags: ["AI", "diagnostics", "global-health", "federated-learning"],
    impactClass: "Critical",
    methodology:
      "Randomized field trials, federated learning benchmarks, ethnographic workflow analysis",
    keyFindings: [
      "34% improvement in early-stage disease detection in field trials",
      "Federated model achieves 91% uptime on low-spec hardware",
      "Privacy-preserving protocol eliminates need for central patient data",
      "Community health worker acceptance rate: 87% after 3-week onboarding",
      "Model compression reduces inference overhead by 68% vs. baseline",
    ],
    status: "Published",
  },
  {
    id: 6,
    title: "Biodiversity Collapse Risk Index: Tropical Corridor Analysis",
    description:
      "Longitudinal multi-species monitoring study across six tropical biodiversity corridors spanning three continents. Combines satellite imagery, acoustic sensor networks, and field surveys to construct a composite Biodiversity Collapse Risk Index (BCRI). The index integrates habitat fragmentation rates, invasive species pressure, climate velocity, and keystone species population dynamics to produce 20-year forward projections at sub-watershed resolution.",
    domain: "Climate",
    project: "GAIA",
    authors: "LAB INVOS — Environmental Intelligence Team",
    publicationDate: "2025-09",
    tags: ["biodiversity", "tropical", "risk-index", "remote-sensing"],
    impactClass: "Foundational",
    methodology:
      "Multi-source satellite telemetry, acoustic bioacoustic networks, longitudinal field surveys",
    keyFindings: [
      "Three of six monitored corridors show critical BCRI scores (>0.75)",
      "Habitat fragmentation contributes 47% of variance in collapse risk",
      "Invasive species pressure amplifies climate stress by a factor of 2.3x",
      "Keystone predator populations have declined 31% since 2015 baseline",
      "Sub-watershed projections identify 14 corridors as imminent priority zones",
    ],
    status: "Active",
  },
  {
    id: 7,
    title: "Edge AI for Autonomous Environmental Sensing Networks",
    description:
      "Architecture and performance evaluation of a novel edge-compute AI framework deployed across 2,400 distributed environmental monitoring stations. The framework enables on-device anomaly detection, adaptive sampling rates, and peer-to-peer model synchronization without cloud dependency. Field evaluation across Arctic, desert, and rainforest biomes demonstrates robust sensor uptime and latency performance unachievable through centralized architectures.",
    domain: "Deep Technology",
    project: "EIOS",
    authors: "LAB NEIA — Deep Technology Division",
    publicationDate: "2025-11",
    tags: ["edge-AI", "IoT", "autonomous-sensing", "distributed-systems"],
    impactClass: "Applied",
    methodology:
      "Distributed systems benchmarking, on-device ML evaluation, multi-biome field deployment",
    keyFindings: [
      "On-device anomaly detection achieves 94.2% accuracy with 180ms latency",
      "Adaptive sampling reduces data transmission by 73% vs. fixed-rate systems",
      "Peer-to-peer model sync maintains accuracy within 1.8% of centralized baseline",
      "System uptime: 98.7% across all three biomes over 18-month evaluation period",
      "Energy consumption per sensor reduced by 61% through intelligent duty cycling",
    ],
    status: "Published",
  },
  {
    id: 8,
    title: "Algorithmic Accountability in Public Sector Decision Systems",
    description:
      "Systematic audit of algorithmic decision-making systems deployed in public sector contexts including social services allocation, criminal justice risk scoring, and immigration processing. The study develops a five-dimension Algorithmic Accountability Framework (AAF) assessing transparency, auditability, contestability, proportionality, and demographic equity. Findings reveal critical governance gaps in 71% of audited systems and propose legislative and technical remediation pathways.",
    domain: "Ethical AI",
    project: "STEMESA",
    authors: "EPOCHS Ethics Division — Policy Research Unit",
    publicationDate: "2025-08",
    tags: ["accountability", "public-sector", "audit", "governance", "equity"],
    impactClass: "Critical",
    methodology:
      "Multi-site algorithmic audit, legislative analysis, stakeholder interviews, quantitative equity assessment",
    keyFindings: [
      "71% of audited systems lack adequate contestability mechanisms",
      "Demographic disparity ratios exceed acceptable thresholds in 58% of risk-scoring systems",
      "Transparency scores below 0.4 in all criminal justice deployments surveyed",
      "Five-dimension AAF framework provides actionable remediation roadmap",
      "Proposed legislative changes adopted by 2 jurisdictions during study period",
    ],
    status: "Under Review",
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
    const nodes: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      color: number;
    }[] = [];
    // Drift lines (Stage 6 background motion field)
    const driftLines: {
      x: number;
      y: number;
      len: number;
      speed: number;
      alpha: number;
      angle: number;
    }[] = [];

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
        color: i % 3, // 0=blue, 1=gold, 2=teal
      });
    }

    // Create subtle diagonal drift lines
    for (let i = 0; i < 12; i++) {
      driftLines.push({
        x: Math.random() * (canvas.width || 800),
        y: Math.random() * (canvas.height || 600),
        len: 60 + Math.random() * 80,
        speed: 0.15 + Math.random() * 0.25,
        alpha: 0.04 + Math.random() * 0.06,
        angle: Math.PI * 0.22 + (Math.random() - 0.5) * 0.3,
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

      // Draw drift lines (Stage 6 subtle background motion)
      for (const dl of driftLines) {
        ctx.save();
        ctx.globalAlpha = dl.alpha;
        ctx.beginPath();
        ctx.moveTo(dl.x, dl.y);
        ctx.lineTo(
          dl.x + Math.cos(dl.angle) * dl.len,
          dl.y + Math.sin(dl.angle) * dl.len,
        );
        ctx.strokeStyle = "rgba(74,126,247,0.9)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.restore();
        dl.x += Math.cos(dl.angle) * dl.speed;
        dl.y += Math.sin(dl.angle) * dl.speed;
        if (dl.x > canvas.width + 100 || dl.y > canvas.height + 100) {
          dl.x = -100 + Math.random() * 200;
          dl.y = Math.random() * canvas.height;
        }
      }

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

        const colors = [
          "rgba(74,126,247,0.55)",
          "rgba(212,160,23,0.35)",
          "rgba(52,211,153,0.35)",
        ];
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = colors[n.color];
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
      style={{ opacity: 0.4 }}
      tabIndex={-1}
    />
  );
}

// biome-ignore lint/correctness/noUnusedVariables: kept for future EIOS pipeline visualization
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

// ── Radar Chart Widget (SVG-based) ────────────────────────────────────────────
function RadarChartWidget() {
  const axes = [
    { label: "Climate Change", value: 0.82 },
    { label: "Biodiversity", value: 0.71 },
    { label: "Ocean Acidification", value: 0.68 },
    { label: "Freshwater", value: 0.55 },
    { label: "Land Use", value: 0.74 },
    { label: "Nitrogen Cycle", value: 0.63 },
  ];
  const [hoveredAxis, setHoveredAxis] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const cx = 160;
  const cy = 160;
  const R = 115;
  const n = axes.length;

  function axisPoint(i: number, frac: number) {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * R * frac,
      y: cy + Math.sin(angle) * R * frac,
    };
  }
  function labelPoint(i: number) {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    const dist = R + 22;
    return { x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist };
  }

  // Reference rings
  const rings = [0.25, 0.5, 0.75, 1.0];
  const ringPaths = rings.map((frac) => {
    const pts = axes.map((_, i) => axisPoint(i, frac));
    return {
      path: `${pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")} Z`,
      frac,
    };
  });

  // Safe zone polygon (0.5 for all)
  const safePts = axes.map((_, i) => axisPoint(i, 0.5));
  const safePath = `${safePts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")} Z`;

  // Current values polygon
  const valuePts = axes.map((ax, i) => axisPoint(i, ax.value));
  const valuePath = `${valuePts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")} Z`;

  // Polygon perimeter for stroke-dashoffset animation
  const perimApprox = valuePts.reduce((acc, p, i) => {
    const next = valuePts[(i + 1) % n];
    return acc + Math.hypot(next.x - p.x, next.y - p.y);
  }, 0);

  return (
    <div
      className="p-6 rounded-sm epochs-reveal reveal"
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
        PLANETARY BOUNDARY ASSESSMENT
      </div>
      <div
        className="text-xs mb-2"
        style={{
          color: "rgba(255,255,255,0.35)",
          fontFamily: "Sora, sans-serif",
        }}
      >
        Current stress levels vs. safe operating boundaries
      </div>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <svg
            viewBox="0 0 320 320"
            width="280"
            height="280"
            style={{ overflow: "visible" }}
            role="img"
            aria-label="Planetary boundary radar chart"
          >
            <title>Planetary Boundary Assessment Radar</title>
            {/* Ring backgrounds */}
            {ringPaths.map(({ path, frac }) => (
              <path
                key={`ring-${frac}`}
                d={path}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={1}
              />
            ))}
            {/* Axis lines */}
            {axes.map((ax, i) => {
              const end = axisPoint(i, 1.0);
              const isHov = hoveredAxis === i;
              return (
                <line
                  key={`axis-${ax.label}`}
                  x1={cx}
                  y1={cy}
                  x2={end.x}
                  y2={end.y}
                  stroke={
                    isHov ? "rgba(74,126,247,0.6)" : "rgba(255,255,255,0.1)"
                  }
                  strokeWidth={isHov ? 1.5 : 0.75}
                  style={{ transition: "stroke 0.2s, stroke-width 0.2s" }}
                />
              );
            })}
            {/* Safe zone polygon (dashed gold) */}
            <path
              d={safePath}
              fill="rgba(212,160,23,0.05)"
              stroke="rgba(212,160,23,0.45)"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            {/* Current values polygon */}
            <path
              d={valuePath}
              fill="rgba(74,126,247,0.15)"
              stroke="rgba(74,126,247,0.8)"
              strokeWidth={2}
              strokeLinejoin="round"
              style={{
                strokeDasharray: mounted ? `${perimApprox}` : `${perimApprox}`,
                strokeDashoffset: mounted ? "0" : `${perimApprox}`,
                transition: "stroke-dashoffset 1.6s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
            {/* Value dots */}
            {valuePts.map((p, i) => {
              const isHov = hoveredAxis === i;
              return (
                <circle
                  key={`dot-${axes[i].label}`}
                  cx={p.x}
                  cy={p.y}
                  r={isHov ? 6 : 3.5}
                  fill={isHov ? "rgba(74,126,247,0.9)" : "rgba(74,126,247,0.7)"}
                  style={{ transition: "r 0.2s, fill 0.2s", cursor: "pointer" }}
                  onMouseEnter={() => setHoveredAxis(i)}
                  onMouseLeave={() => setHoveredAxis(null)}
                />
              );
            })}
            {/* Axis labels */}
            {axes.map((ax, i) => {
              const lp = labelPoint(i);
              const isHov = hoveredAxis === i;
              return (
                <g
                  key={`label-${ax.label}`}
                  onMouseEnter={() => setHoveredAxis(i)}
                  onMouseLeave={() => setHoveredAxis(null)}
                  style={{ cursor: "pointer" }}
                >
                  <text
                    x={lp.x}
                    y={lp.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="8.5"
                    fontFamily='"Geist Mono", monospace'
                    fill={
                      isHov ? "rgba(74,126,247,0.95)" : "rgba(255,255,255,0.45)"
                    }
                    style={{ transition: "fill 0.2s" }}
                  >
                    {ax.label.toUpperCase()}
                  </text>
                  {isHov && (
                    <text
                      x={lp.x}
                      y={lp.y + 13}
                      textAnchor="middle"
                      fontSize="8"
                      fontFamily='"Geist Mono", monospace'
                      fill="rgba(212,160,23,0.9)"
                    >
                      {(ax.value * 100).toFixed(0)}%
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        {/* Legend */}
        <div className="flex-1 space-y-2.5">
          <div
            className="font-mono-geist text-[8px] tracking-[0.2em] uppercase mb-3"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            STRESS INDICATORS
          </div>
          {axes.map((ax, i) => {
            const isHov = hoveredAxis === i;
            const pct = ax.value * 100;
            const barColor =
              pct >= 70
                ? "rgba(239,100,68,0.7)"
                : pct >= 50
                  ? "rgba(212,160,23,0.7)"
                  : "rgba(34,211,153,0.7)";
            return (
              <div
                key={ax.label}
                onMouseEnter={() => setHoveredAxis(i)}
                onMouseLeave={() => setHoveredAxis(null)}
                style={{
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                  opacity: hoveredAxis === null || isHov ? 1 : 0.5,
                }}
              >
                <div className="flex justify-between mb-0.5">
                  <span
                    className="font-mono-geist text-[8px]"
                    style={{
                      color: isHov
                        ? "rgba(74,126,247,0.95)"
                        : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {ax.label}
                  </span>
                  <span
                    className="font-mono-geist text-[8px]"
                    style={{ color: barColor }}
                  >
                    {pct.toFixed(0)}%
                  </span>
                </div>
                <div
                  className="h-1 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: barColor,
                      transition: "width 1s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-1.5">
              <div
                className="w-4 h-0.5"
                style={{
                  background: "rgba(212,160,23,0.6)",
                  borderBottom: "1px dashed rgba(212,160,23,0.6)",
                }}
              />
              <span
                className="font-mono-geist text-[7px]"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Safe boundary
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="w-4 h-0.5"
                style={{ background: "rgba(74,126,247,0.8)" }}
              />
              <span
                className="font-mono-geist text-[7px]"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Current state
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Animated Chart Widgets ────────────────────────────────────────────────────
function BarChartWidget({
  title,
  subtitle,
}: { title: string; subtitle: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shimmerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const bars = [0.55, 0.58, 0.62, 0.68, 0.72, 0.79];
    const labels = ["1960", "1980", "2000", "2010", "2020", "2024"];
    let progress = 0;
    let animId: number;
    let hoveredBar: number | null = null;
    let shimmerProgress = 0;
    let isShimmering = false;

    const HERO_INTERVAL = 1000 / 30;
    let lastDraw = 0;

    function drawFrame(bars: number[], alphaBoost: number[] = []) {
      if (!ctx || !canvas) return;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const chartH = H - 24; // leave space for labels
      const leftPad = 32;
      const barW = (W - leftPad) / (bars.length * 2);

      // Y-axis gridlines
      for (const gy of [0.25, 0.5, 0.75]) {
        const yPos = chartH - gy * chartH;
        ctx.beginPath();
        ctx.setLineDash([3, 5]);
        ctx.moveTo(leftPad, yPos);
        ctx.lineTo(W, yPos);
        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
        // Y-axis label
        ctx.font = '8px "Geist Mono", monospace';
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(`${gy.toFixed(2)}°`, leftPad - 4, yPos);
      }

      // Dashed baseline at 0.5
      const baseY = chartH - 0.5 * chartH;
      ctx.beginPath();
      ctx.setLineDash([4, 6]);
      ctx.moveTo(leftPad, baseY);
      ctx.lineTo(W, baseY);
      ctx.strokeStyle = "rgba(212,160,23,0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);

      // Bars
      for (let i = 0; i < bars.length; i++) {
        const h = bars[i];
        const x = leftPad + i * barW * 2 + barW * 0.5;
        const bh = h * chartH * progress;
        const isHov = hoveredBar === i;
        const boost = alphaBoost[i] ?? 0;

        if (isHov) {
          // highlight vertical stripe
          ctx.fillStyle = "rgba(74,126,247,0.06)";
          ctx.fillRect(x - 2, 0, barW + 4, chartH);
        }

        const grad = ctx.createLinearGradient(x, chartH, x, chartH - bh);
        grad.addColorStop(0, `rgba(74,126,247,${0.85 + boost})`);
        grad.addColorStop(1, `rgba(74,126,247,${0.3 + boost * 0.5})`);
        ctx.fillStyle = grad;
        ctx.fillRect(x, chartH - bh, barW, bh);

        // Period labels
        ctx.font = '8px "Geist Mono", monospace';
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(labels[i], x + barW / 2, chartH + 4);

        // Tooltip on hover
        if (isHov && progress >= 1) {
          const tipText = `${labels[i]}: +${h.toFixed(2)}°C`;
          const tipW = tipText.length * 5.5 + 10;
          const tipX = Math.min(x + barW / 2 - tipW / 2, W - tipW - 4);
          const tipY = chartH - bh - 28;
          ctx.fillStyle = "rgba(10,14,30,0.9)";
          ctx.beginPath();
          ctx.roundRect(tipX, tipY, tipW, 18, 2);
          ctx.fill();
          ctx.font = '8px "Geist Mono", monospace';
          ctx.fillStyle = "rgba(255,255,255,0.85)";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(tipText, tipX + tipW / 2, tipY + 9);
        }
      }
    }

    function animLoop(ts: number) {
      if (ts - lastDraw < HERO_INTERVAL) {
        animId = requestAnimationFrame(animLoop);
        return;
      }
      lastDraw = ts;
      progress = Math.min(progress + 0.03, 1);
      drawFrame(bars);
      if (progress < 1) animId = requestAnimationFrame(animLoop);
      else {
        // Start shimmer loop after animation
        shimmerRef.current = setInterval(() => {
          isShimmering = true;
          shimmerProgress = 0;
          function shimmerStep() {
            if (!isShimmering) return;
            shimmerProgress = Math.min(shimmerProgress + 0.05, 1);
            const boost = Math.sin(shimmerProgress * Math.PI) * 0.15;
            drawFrame(
              bars,
              bars.map(() => boost),
            );
            if (shimmerProgress < 1) requestAnimationFrame(shimmerStep);
            else isShimmering = false;
          }
          shimmerStep();
        }, 6000);
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
      const leftPad = 32;
      const barW = (canvas.width - leftPad) / (bars.length * 2);
      let found: number | null = null;
      bars.forEach((_, i) => {
        const x = leftPad + i * barW * 2 + barW * 0.5;
        if (mx >= x && mx <= x + barW) found = i;
      });
      if (found !== hoveredBar) {
        hoveredBar = found;
        if (progress >= 1) drawFrame(bars);
      }
    };
    const onMouseLeave = () => {
      hoveredBar = null;
      if (progress >= 1) drawFrame(bars);
    };

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    animId = requestAnimationFrame(animLoop);

    return () => {
      cancelAnimationFrame(animId);
      if (shimmerRef.current) clearInterval(shimmerRef.current);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
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
      <canvas ref={canvasRef} className="w-full" style={{ height: "160px" }} />
      <div className="flex flex-wrap gap-2 mt-3">
        <span
          className="font-mono-geist text-[8px] tracking-[0.1em] px-2 py-0.5 rounded-sm"
          style={{
            background: "rgba(74,126,247,0.08)",
            border: "1px solid rgba(74,126,247,0.2)",
            color: "rgba(74,126,247,0.8)",
          }}
        >
          Trend: +0.24°C/decade
        </span>
        <span
          className="font-mono-geist text-[8px] tracking-[0.1em] px-2 py-0.5 rounded-sm"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          Source: NASA GISS
        </span>
      </div>
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
    const points = [0.38, 0.41, 0.46, 0.52, 0.59, 0.65, 0.71, 0.78];
    const yLabels = ["350", "375", "400", "420"];
    let progress = 0;
    let animId: number;
    let pulseAnimId: number;
    let pulseT = 0;
    const HERO_INTERVAL = 1000 / 30;
    let lastDraw = 0;

    function drawMain() {
      if (!ctx || !canvas) return;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const chartH = H - 16;
      const leftPad = 30;
      const chartW = W - leftPad;

      // Y-axis labels
      yLabels.forEach((lbl, li) => {
        const yFrac = li / (yLabels.length - 1);
        const yPos = chartH - yFrac * chartH;
        ctx.font = '8px "Geist Mono", monospace';
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(lbl, leftPad - 4, yPos);
        // gridline
        ctx.beginPath();
        ctx.setLineDash([2, 5]);
        ctx.moveTo(leftPad, yPos);
        ctx.lineTo(W, yPos);
        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
      });

      const visible = Math.min(
        Math.ceil(progress * (points.length + 1)),
        points.length,
      );
      const partialFrac =
        progress * (points.length + 1) -
        Math.floor(progress * (points.length + 1));

      // Line
      ctx.beginPath();
      for (let i = 0; i < visible; i++) {
        let x: number;
        let y: number;
        if (i < visible - 1 || progress >= 1) {
          x = leftPad + (i / (points.length - 1)) * chartW;
          y = chartH - points[i] * chartH;
        } else {
          // interpolate last segment
          const prevX = leftPad + ((i - 1) / (points.length - 1)) * chartW;
          const nextX = leftPad + (i / (points.length - 1)) * chartW;
          const prevY = chartH - points[i - 1] * chartH;
          const nextY = chartH - points[i] * chartH;
          x = prevX + (nextX - prevX) * partialFrac;
          y = prevY + (nextY - prevY) * partialFrac;
        }
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(212,160,23,0.8)";
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.stroke();

      // Area fill (animates in after line)
      if (visible > 1 && progress >= 0.5) {
        const areaAlpha = (progress - 0.5) * 2;
        ctx.beginPath();
        for (let i = 0; i < visible; i++) {
          const x = leftPad + (i / (points.length - 1)) * chartW;
          const y = chartH - points[i] * chartH;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.lineTo(
          leftPad + ((visible - 1) / (points.length - 1)) * chartW,
          chartH,
        );
        ctx.lineTo(leftPad, chartH);
        ctx.closePath();
        const areaGrad = ctx.createLinearGradient(0, 0, 0, chartH);
        areaGrad.addColorStop(0, `rgba(212,160,23,${0.18 * areaAlpha})`);
        areaGrad.addColorStop(1, "transparent");
        ctx.fillStyle = areaGrad;
        ctx.fill();
      }

      // Data point dots
      for (let i = 0; i < visible; i++) {
        const x = leftPad + (i / (points.length - 1)) * chartW;
        const y = chartH - points[i] * chartH;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.fill();
      }

      return visible;
    }

    function pulseDot() {
      if (!ctx || !canvas) return;
      const W = canvas.width;
      const H = canvas.height;
      const chartH = H - 16;
      const leftPad = 30;
      const chartW = W - leftPad;

      drawMain();
      pulseT += 0.05;
      const r = 3 + Math.sin(pulseT) * 3;
      const lastX = leftPad + chartW;
      const lastY = chartH - points[points.length - 1] * chartH;
      // Outer glow
      const grd = ctx.createRadialGradient(
        lastX,
        lastY,
        0,
        lastX,
        lastY,
        r * 2.5,
      );
      grd.addColorStop(0, "rgba(212,160,23,0.4)");
      grd.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(lastX, lastY, r * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
      // Core dot
      ctx.beginPath();
      ctx.arc(lastX, lastY, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(212,160,23,0.9)";
      ctx.fill();

      pulseAnimId = requestAnimationFrame(pulseDot);
    }

    function animLoop(ts: number) {
      if (ts - lastDraw < HERO_INTERVAL) {
        animId = requestAnimationFrame(animLoop);
        return;
      }
      lastDraw = ts;
      progress = Math.min(progress + 0.025, 1);
      drawMain();
      if (progress < 1) animId = requestAnimationFrame(animLoop);
      else pulseAnimId = requestAnimationFrame(pulseDot);
    }

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    animId = requestAnimationFrame(animLoop);

    return () => {
      cancelAnimationFrame(animId);
      cancelAnimationFrame(pulseAnimId);
    };
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
      <canvas ref={canvasRef} className="w-full" style={{ height: "160px" }} />
      <div className="flex flex-wrap gap-2 mt-3">
        <span
          className="font-mono-geist text-[8px] tracking-[0.1em] px-2 py-0.5 rounded-sm"
          style={{
            background: "rgba(212,160,23,0.1)",
            border: "1px solid rgba(212,160,23,0.25)",
            color: "rgba(212,160,23,0.9)",
          }}
        >
          ↑ +2.4 ppm/yr
        </span>
        <span
          className="font-mono-geist text-[8px] tracking-[0.1em] px-2 py-0.5 rounded-sm"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          Source: NOAA
        </span>
      </div>
    </div>
  );
}

function HBarChartWidget({
  title,
  subtitle,
}: { title: string; subtitle: string }) {
  const regions = [
    {
      label: "Boreal",
      pct: 72,
      baseline: 81,
      color: "rgba(34,211,176,0.7)",
      delta: "-9%",
    },
    {
      label: "Tropical",
      pct: 48,
      baseline: 67,
      color: "rgba(74,126,247,0.7)",
      delta: "-19%",
    },
    {
      label: "Temperate",
      pct: 61,
      baseline: 71,
      color: "rgba(212,160,23,0.7)",
      delta: "-10%",
    },
    {
      label: "Savanna",
      pct: 34,
      baseline: 52,
      color: "rgba(167,139,250,0.7)",
      delta: "-18%",
    },
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

      {/* Column headers */}
      <div className="grid grid-cols-[80px_1fr_48px] gap-2 mb-2">
        {["REGION", "CURRENT / BASELINE", "DELTA"].map((h) => (
          <span
            key={h}
            className="font-mono-geist text-[7px] tracking-[0.2em] uppercase"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            {h}
          </span>
        ))}
      </div>

      <div className="space-y-3">
        {regions.map((r, ri) => (
          <div
            key={r.label}
            className="grid grid-cols-[80px_1fr_48px] gap-2 items-center"
          >
            <span
              className="font-mono-geist text-[9px]"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              {r.label}
            </span>
            <div className="space-y-1 overflow-hidden relative">
              {/* Current bar */}
              <div
                className="h-2 rounded-sm overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  position: "relative",
                }}
              >
                <div
                  className="h-full rounded-sm transition-all duration-1000"
                  style={{
                    width: animated ? `${r.pct}%` : "0%",
                    background: r.color,
                    transitionDelay: `${ri * 0.12}s`,
                    position: "relative",
                  }}
                >
                  <div
                    className="absolute inset-0 animate-card-scan"
                    style={{
                      background:
                        "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.25) 50%,transparent 100%)",
                    }}
                  />
                </div>
              </div>
              {/* Baseline bar (dashed) */}
              <div
                className="h-1.5 rounded-sm overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px dashed ${r.color.replace("0.7", "0.25")}`,
                }}
              >
                <div
                  className="h-full rounded-sm transition-all duration-1000"
                  style={{
                    width: animated ? `${r.baseline}%` : "0%",
                    background: r.color.replace("0.7", "0.18"),
                    transitionDelay: `${ri * 0.12 + 0.1}s`,
                  }}
                />
              </div>
              <div className="flex justify-between">
                <span
                  className="font-mono-geist text-[7px]"
                  style={{ color: r.color }}
                >
                  {r.pct}%
                </span>
                <span
                  className="font-mono-geist text-[7px]"
                  style={{ color: "rgba(255,255,255,0.2)" }}
                >
                  {r.baseline}%
                </span>
              </div>
            </div>
            <span
              className="font-mono-geist text-[8px] tracking-tight text-center px-1.5 py-0.5 rounded-sm"
              style={{
                background: "rgba(239,100,68,0.1)",
                border: "1px solid rgba(239,100,68,0.25)",
                color: "rgba(239,130,80,0.9)",
              }}
            >
              {r.delta}
            </span>
          </div>
        ))}
      </div>
      <div
        className="mt-3 font-mono-geist text-[7px] tracking-[0.15em]"
        style={{ color: "rgba(255,255,255,0.2)" }}
      >
        Source: Global Forest Watch 2024
      </div>
    </div>
  );
}

function GaugeWidget({ title, subtitle }: { title: string; subtitle: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const score = 67;
  const HERO_INTERVAL = 1000 / 30;
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let progress = 0;
    let animId: number;
    let lastDraw = 0;

    function draw(ts: number) {
      if (!ctx || !canvas) return;
      if (ts - lastDraw < HERO_INTERVAL) {
        animId = requestAnimationFrame(draw);
        return;
      }
      lastDraw = ts;
      progress = Math.min(progress + 0.02, 1);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height * 0.72;
      const r = Math.min(canvas.width, canvas.height) * 0.5;
      const startAngle = Math.PI;
      const fullEndAngle = Math.PI * 2;

      // Color zone arcs
      const zones = [
        { from: 0, to: 0.4, color: "rgba(239,68,68,0.5)" },
        { from: 0.4, to: 0.7, color: "rgba(212,160,23,0.5)" },
        { from: 0.7, to: 1.0, color: "rgba(34,211,153,0.5)" },
      ];
      for (const zone of zones) {
        ctx.beginPath();
        ctx.arc(
          cx,
          cy,
          r,
          startAngle + zone.from * Math.PI,
          startAngle + zone.to * Math.PI,
        );
        ctx.strokeStyle = zone.color;
        ctx.lineWidth = 12;
        ctx.lineCap = "butt";
        ctx.stroke();
      }

      // Track background (subtle)
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, fullEndAngle);
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 12;
      ctx.stroke();

      // Tick marks at every 10 units
      for (let t = 0; t <= 100; t += 10) {
        const angle = startAngle + (t / 100) * Math.PI;
        const isLarge = t % 50 === 0;
        const innerR = r - (isLarge ? 18 : 12);
        const outerR = r + 2;
        ctx.beginPath();
        ctx.moveTo(
          cx + Math.cos(angle) * innerR,
          cy + Math.sin(angle) * innerR,
        );
        ctx.lineTo(
          cx + Math.cos(angle) * outerR,
          cy + Math.sin(angle) * outerR,
        );
        ctx.strokeStyle = isLarge
          ? "rgba(255,255,255,0.3)"
          : "rgba(255,255,255,0.12)";
        ctx.lineWidth = isLarge ? 2 : 1;
        ctx.stroke();
      }

      // Value arc (animates)
      const endAngle = startAngle + Math.PI * (score / 100) * progress;
      const grad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
      grad.addColorStop(0, "rgba(74,126,247,0.9)");
      grad.addColorStop(0.6, "rgba(212,160,23,0.85)");
      grad.addColorStop(1, "rgba(34,211,153,0.85)");
      ctx.beginPath();
      ctx.arc(cx, cy, r - 2, startAngle, endAngle);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.stroke();

      // Needle pointer
      const needleAngle = startAngle + Math.PI * (score / 100) * progress;
      const needleLen = r - 16;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(
        cx + Math.cos(needleAngle) * needleLen,
        cy + Math.sin(needleAngle) * needleLen,
      );
      ctx.strokeStyle = "rgba(255,255,255,0.8)";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();
      // Needle center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fill();

      // Score text (count-up)
      const displayScore = Math.round(score * progress);
      ctx.font = `bold ${r * 0.38}px "Geist Mono", monospace`;
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${displayScore}`, cx, cy - r * 0.08);
      ctx.font = `${r * 0.16}px "Geist Mono", monospace`;
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillText("/ 100", cx, cy + r * 0.22);
      ctx.font = `${r * 0.13}px "Geist Mono", monospace`;
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.fillText("COMPOSITE", cx, cy + r * 0.42);

      if (progress < 1) animId = requestAnimationFrame(draw);
    }
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, []);
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
      <canvas ref={canvasRef} className="w-full" style={{ height: "140px" }} />
      <div className="flex flex-wrap gap-2 mt-3">
        <span
          className="font-mono-geist text-[8px] tracking-[0.1em] px-2 py-0.5 rounded-sm"
          style={{
            background: "rgba(74,126,247,0.08)",
            border: "1px solid rgba(74,126,247,0.2)",
            color: "rgba(74,126,247,0.85)",
          }}
        >
          pH: 8.04
        </span>
        <span
          className="font-mono-geist text-[8px] tracking-[0.1em] px-2 py-0.5 rounded-sm"
          style={{
            background: "rgba(212,160,23,0.08)",
            border: "1px solid rgba(212,160,23,0.2)",
            color: "rgba(212,160,23,0.85)",
          }}
        >
          SST: +0.8°C
        </span>
        <span
          className="font-mono-geist text-[8px] tracking-[0.1em] px-2 py-0.5 rounded-sm"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "rgba(239,130,80,0.9)",
          }}
        >
          O₂: -6.2%
        </span>
      </div>
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

// ── Stage 3: Interactive Civilization Timeline Engine ─────────────────────────
// Discovery lineages: shows causal chains like Electricity → Electronics → AI
interface DiscoveryNode {
  id: string;
  label: string;
  year: string;
  domain: string;
  domainColor: string;
  description: string;
  epochId: number;
}
interface DiscoveryLineage {
  id: string;
  title: string;
  color: string;
  nodes: string[]; // node ids in order
}

const DISCOVERY_NODES: DiscoveryNode[] = [
  {
    id: "geometry",
    label: "Euclidean Geometry",
    year: "300 BC",
    domain: "Mathematics",
    domainColor: "#d4a017",
    description:
      "Deductive proof system — the first formal language of exact reasoning.",
    epochId: 1,
  },
  {
    id: "gravity",
    label: "Law of Gravitation",
    year: "1687",
    domain: "Physics",
    domainColor: "#d4a017",
    description:
      "Newton's universal gravitation unified terrestrial and celestial mechanics.",
    epochId: 1,
  },
  {
    id: "calculus",
    label: "Calculus",
    year: "1666",
    domain: "Mathematics",
    domainColor: "#d4a017",
    description:
      "Infinitesimal calculus gave science a language for continuous change.",
    epochId: 1,
  },
  {
    id: "steam",
    label: "Steam Engine",
    year: "1769",
    domain: "Engineering",
    domainColor: "#94a3b8",
    description:
      "Watt's condensing engine converted thermodynamic theory into productive power.",
    epochId: 2,
  },
  {
    id: "thermo",
    label: "Thermodynamics",
    year: "1824",
    domain: "Physics",
    domainColor: "#94a3b8",
    description:
      "Carnot's efficiency theorem established limits on all heat engines.",
    epochId: 2,
  },
  {
    id: "evolution",
    label: "Theory of Evolution",
    year: "1859",
    domain: "Biology",
    domainColor: "#94a3b8",
    description:
      "Darwin's natural selection unified all of biology under a single explanatory framework.",
    epochId: 2,
  },
  {
    id: "electromag",
    label: "Electromagnetism",
    year: "1865",
    domain: "Physics",
    domainColor: "#4a7ef7",
    description:
      "Maxwell's equations unified electricity, magnetism, and light as one phenomenon.",
    epochId: 3,
  },
  {
    id: "electricity",
    label: "Electric Power Grid",
    year: "1882",
    domain: "Engineering",
    domainColor: "#4a7ef7",
    description:
      "Edison and Tesla's systems converted electromagnetic theory into civilization-wide energy infrastructure.",
    epochId: 3,
  },
  {
    id: "quantum",
    label: "Quantum Mechanics",
    year: "1925",
    domain: "Physics",
    domainColor: "#4a7ef7",
    description:
      "Heisenberg and Schrödinger's formalism explained atomic structure — foundation of all modern electronics.",
    epochId: 3,
  },
  {
    id: "transistor",
    label: "Transistor",
    year: "1947",
    domain: "Engineering",
    domainColor: "#34d399",
    description:
      "Bell Labs' semiconductor switch replaced vacuum tubes — the fundamental unit of all digital computation.",
    epochId: 4,
  },
  {
    id: "dna",
    label: "DNA Double Helix",
    year: "1953",
    domain: "Biology",
    domainColor: "#34d399",
    description:
      "Watson and Crick's structure revealed information storage in biological systems.",
    epochId: 4,
  },
  {
    id: "computing",
    label: "Stored-Program Computer",
    year: "1945",
    domain: "Computation",
    domainColor: "#34d399",
    description:
      "Von Neumann architecture — a universal machine that runs any algorithm.",
    epochId: 4,
  },
  {
    id: "internet",
    label: "Internet Protocol",
    year: "1974",
    domain: "Networks",
    domainColor: "#a78bfa",
    description:
      "TCP/IP created a universal language for networked machines — the substrate of the information economy.",
    epochId: 5,
  },
  {
    id: "genome",
    label: "Human Genome Project",
    year: "2003",
    domain: "Biology",
    domainColor: "#a78bfa",
    description:
      "First complete map of human genetic information — launched precision medicine.",
    epochId: 5,
  },
  {
    id: "smartphone",
    label: "Mobile Computing",
    year: "2007",
    domain: "Computation",
    domainColor: "#a78bfa",
    description:
      "Smartphone integration of GPS, sensors, and internet put global knowledge infrastructure in every pocket.",
    epochId: 5,
  },
  {
    id: "transformer",
    label: "Transformer Architecture",
    year: "2017",
    domain: "AI",
    domainColor: "#f97316",
    description:
      "Attention-mechanism neural networks enabled large-language models and general-purpose AI reasoning.",
    epochId: 6,
  },
  {
    id: "crispr",
    label: "CRISPR-Cas9",
    year: "2012",
    domain: "Biology",
    domainColor: "#f97316",
    description:
      "Programmable gene editing — precise, cheap, and broadly applicable to any organism.",
    epochId: 6,
  },
  {
    id: "quantum2",
    label: "Quantum Supremacy",
    year: "2019",
    domain: "Computation",
    domainColor: "#f97316",
    description:
      "Google's 53-qubit processor solved problems intractable for classical computers.",
    epochId: 6,
  },
];

const DISCOVERY_LINEAGES: DiscoveryLineage[] = [
  {
    id: "physics-to-ai",
    title: "Physics → Computation → AI",
    color: "#4a7ef7",
    nodes: [
      "gravity",
      "calculus",
      "electromag",
      "quantum",
      "transistor",
      "computing",
      "internet",
      "transformer",
    ],
  },
  {
    id: "bio-to-gene",
    title: "Evolution → Genetics → Genomics",
    color: "#34d399",
    nodes: ["evolution", "dna", "genome", "crispr"],
  },
  {
    id: "energy-chain",
    title: "Thermodynamics → Electric Age → Digital",
    color: "#d4a017",
    nodes: ["thermo", "steam", "electricity", "transistor", "smartphone"],
  },
];

function CivilizationTimelineEngine() {
  const [activeLineage, setActiveLineage] = useState<string>("physics-to-ai");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [entered, setEntered] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Intersection observer for entrance animation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setEntered(true);
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Canvas: animated connection lines
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lineage = DISCOVERY_LINEAGES.find((l) => l.id === activeLineage);
    if (!lineage) return;

    let animFrame: number;
    let phase = 0;

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
      ctx.clearRect(0, 0, W, H);

      const nodeIds = lineage.nodes;
      const count = nodeIds.length;
      if (count < 2) {
        animFrame = requestAnimationFrame(draw);
        return;
      }

      // Layout: nodes spaced horizontally across canvas
      const padding = 60;
      const spacing = (W - padding * 2) / (count - 1);
      const y = H / 2;

      // Draw connection lines with dash animation
      phase = (phase + 0.5) % 30;
      for (let i = 0; i < count - 1; i++) {
        const x1 = padding + i * spacing;
        const x2 = padding + (i + 1) * spacing;
        const n1 = nodeIds[i];
        const n2 = nodeIds[i + 1];
        const isHovered = hoveredNode === n1 || hoveredNode === n2;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.setLineDash([6, 8]);
        ctx.lineDashOffset = -phase;
        ctx.strokeStyle = isHovered ? lineage.color : `${lineage.color}55`;
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.shadowColor = lineage.color;
        ctx.shadowBlur = isHovered ? 8 : 2;
        ctx.stroke();
        ctx.restore();

        // Arrow at midpoint
        const mx = (x1 + x2) / 2;
        ctx.save();
        ctx.fillStyle = isHovered ? lineage.color : `${lineage.color}66`;
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("→", mx, y - 10);
        ctx.restore();
      }

      animFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animFrame);
  }, [activeLineage, hoveredNode]);

  const activeLineageData = DISCOVERY_LINEAGES.find(
    (l) => l.id === activeLineage,
  )!;
  const lineageNodeIds = new Set(activeLineageData.nodes);

  const selectedNodeData = selectedNode
    ? DISCOVERY_NODES.find((n) => n.id === selectedNode)
    : null;

  // Group nodes by epoch for the visual layout
  const epochGroups = [1, 2, 3, 4, 5, 6].map((epId) => ({
    epochId: epId,
    epoch: CIVILIZATION_EPOCHS.find((e) => e.id === epId)!,
    nodes: DISCOVERY_NODES.filter((n) => n.epochId === epId),
  }));

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(4,5,14,0) 0%, rgba(6,8,20,0.8) 50%, rgba(4,5,14,0) 100%)",
      }}
      aria-label="Interactive Civilization Timeline Engine"
    >
      {/* Background field */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {(
          [
            "p0",
            "p1",
            "p2",
            "p3",
            "p4",
            "p5",
            "p6",
            "p7",
            "p8",
            "p9",
            "p10",
            "p11",
            "p12",
            "p13",
            "p14",
            "p15",
            "p16",
            "p17",
            "p18",
            "p19",
            "p20",
            "p21",
            "p22",
            "p23",
          ] as const
        ).map((pid, i) => (
          <div
            key={pid}
            className="absolute rounded-full"
            style={{
              width: `${(i % 2) + 1}px`,
              height: `${(i % 2) + 1}px`,
              left: `${(i / 24) * 100}%`,
              top: `${20 + Math.sin(i * 0.7) * 40}%`,
              background:
                i % 3 === 0 ? "#d4a017" : i % 3 === 1 ? "#4a7ef7" : "#34d399",
              opacity: 0.25,
              animation: `pulse ${2 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Section header */}
        <div
          className="mb-12"
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <div
            className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
            style={{ color: "rgba(212,160,23,0.7)" }}
          >
            ◈ STAGE 3 — INTERACTIVE CIVILIZATION TIMELINE ENGINE
          </div>
          <h2
            className="font-display font-light mb-4"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "rgba(255,255,255,0.92)",
              letterSpacing: "0.06em",
            }}
          >
            The Architecture of Scientific Progress
          </h2>
          <p
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: "clamp(12px, 1.4vw, 14px)",
              color: "rgba(255,255,255,0.4)",
              maxWidth: "580px",
              lineHeight: 1.85,
            }}
          >
            Navigate the causal chains of discovery. Select a knowledge lineage
            to trace how each breakthrough enabled the next — from Newtonian
            mechanics to artificial general intelligence. Each node is a
            civilizational turning point. Each arrow is a dependency forged
            across centuries.
          </p>
        </div>

        {/* Lineage selector */}
        <div
          className="flex flex-wrap gap-3 mb-8"
          style={{
            opacity: entered ? 1 : 0,
            transition: "opacity 0.8s ease 0.2s",
          }}
        >
          {DISCOVERY_LINEAGES.map((lin) => (
            <button
              key={lin.id}
              type="button"
              data-ocid={`epochs.timeline3.lineage.${lin.id}`}
              onClick={() => {
                setActiveLineage(lin.id);
                setSelectedNode(null);
              }}
              className="transition-all duration-300"
              style={{
                padding: "8px 16px",
                borderRadius: "2px",
                border: `1px solid ${activeLineage === lin.id ? lin.color : "rgba(255,255,255,0.1)"}`,
                background:
                  activeLineage === lin.id
                    ? `${lin.color}18`
                    : "rgba(255,255,255,0.03)",
                color:
                  activeLineage === lin.id
                    ? lin.color
                    : "rgba(255,255,255,0.45)",
                fontFamily: "Sora, sans-serif",
                fontSize: "11px",
                letterSpacing: "0.06em",
                cursor: "pointer",
                boxShadow:
                  activeLineage === lin.id ? `0 0 16px ${lin.color}33` : "none",
              }}
            >
              {lin.title}
            </button>
          ))}
        </div>

        {/* Main timeline engine */}
        <div
          className="relative"
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(32px)",
            transition: "opacity 0.9s ease 0.3s, transform 0.9s ease 0.3s",
          }}
        >
          {/* Canvas for animated connection lines */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ width: "100%", height: "100%", zIndex: 1 }}
          />

          {/* Epoch columns — responsive, horizontal scroll on mobile */}
          <div
            className="relative"
            style={{
              overflowX: "auto",
              overflowY: "visible",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              zIndex: 2,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, minmax(140px, 1fr))",
                gap: "12px",
                minWidth: "840px",
                minHeight: "340px",
              }}
            >
              {epochGroups.map(({ epochId, epoch, nodes }) => (
                <div
                  key={epochId}
                  className="flex flex-col gap-2"
                  style={{
                    borderLeft: `1px solid ${epoch.accentColor.replace("0.8", "0.12")}`,
                    paddingLeft: "10px",
                  }}
                >
                  {/* Epoch label */}
                  <div
                    className="font-mono-geist text-[8px] tracking-[0.2em] uppercase mb-1"
                    style={{ color: epoch.accentColor.replace("0.8", "0.6") }}
                  >
                    {epoch.shortLabel}
                    <div
                      style={{
                        color: "rgba(255,255,255,0.2)",
                        fontSize: "7px",
                        marginTop: "2px",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {epoch.period}
                    </div>
                  </div>

                  {/* Discovery nodes */}
                  {nodes.map((node) => {
                    const isInLineage = lineageNodeIds.has(node.id);
                    const isHovered = hoveredNode === node.id;
                    const isSelected = selectedNode === node.id;

                    return (
                      <button
                        key={node.id}
                        type="button"
                        data-ocid={`epochs.timeline3.node.${node.id}`}
                        onClick={() =>
                          setSelectedNode(isSelected ? null : node.id)
                        }
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        className="text-left transition-all duration-300"
                        style={{
                          background: isSelected
                            ? `${node.domainColor}22`
                            : isHovered
                              ? `${node.domainColor}14`
                              : isInLineage
                                ? "rgba(255,255,255,0.04)"
                                : "rgba(255,255,255,0.02)",
                          border: isSelected
                            ? `1px solid ${node.domainColor}`
                            : isHovered
                              ? `1px solid ${node.domainColor}88`
                              : isInLineage
                                ? `1px solid ${node.domainColor}33`
                                : "1px solid rgba(255,255,255,0.06)",
                          borderRadius: "2px",
                          padding: "8px",
                          cursor: "pointer",
                          boxShadow:
                            isSelected || isHovered
                              ? `0 0 12px ${node.domainColor}33`
                              : "none",
                          opacity: isInLineage ? 1 : 0.45,
                          transform: isHovered ? "translateX(2px)" : "none",
                        }}
                      >
                        {/* Domain dot + label */}
                        <div className="flex items-center gap-1.5 mb-1">
                          <div
                            style={{
                              width: "5px",
                              height: "5px",
                              borderRadius: "50%",
                              background: node.domainColor,
                              boxShadow:
                                isHovered || isSelected
                                  ? `0 0 6px ${node.domainColor}`
                                  : "none",
                              flexShrink: 0,
                            }}
                          />
                          <span
                            className="font-mono-geist"
                            style={{
                              fontSize: "7px",
                              color: node.domainColor,
                              letterSpacing: "0.15em",
                              textTransform: "uppercase",
                            }}
                          >
                            {node.domain}
                          </span>
                        </div>

                        <div
                          style={{
                            fontFamily: "Sora, sans-serif",
                            fontSize: "9px",
                            color:
                              isSelected || isHovered
                                ? "rgba(255,255,255,0.9)"
                                : "rgba(255,255,255,0.65)",
                            lineHeight: 1.4,
                            fontWeight: 500,
                          }}
                        >
                          {node.label}
                        </div>
                        <div
                          className="font-mono-geist"
                          style={{
                            fontSize: "7px",
                            color: "rgba(255,255,255,0.25)",
                            marginTop: "2px",
                          }}
                        >
                          {node.year}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            {/* closes inner grid */}
          </div>
          {/* closes scroll wrapper */}
        </div>

        {/* Selected node detail panel */}
        {selectedNodeData && (
          <div
            className="mt-8 p-6 rounded-sm relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${selectedNodeData.domainColor}10, rgba(4,5,14,0.8))`,
              border: `1px solid ${selectedNodeData.domainColor}44`,
              boxShadow: `0 0 32px ${selectedNodeData.domainColor}18`,
              animation: "fadeInUp 0.35s ease",
            }}
            data-ocid="epochs.timeline3.node.detail.panel"
          >
            <div
              className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
              style={{
                background: `linear-gradient(90deg, transparent, ${selectedNodeData.domainColor}66, transparent)`,
              }}
              aria-hidden="true"
            />

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="px-2 py-1 font-mono-geist text-[8px] tracking-[0.2em] uppercase"
                    style={{
                      background: `${selectedNodeData.domainColor}20`,
                      border: `1px solid ${selectedNodeData.domainColor}44`,
                      color: selectedNodeData.domainColor,
                      borderRadius: "2px",
                    }}
                  >
                    {selectedNodeData.domain}
                  </div>
                  <span
                    className="font-mono-geist text-[9px]"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {selectedNodeData.year}
                  </span>
                  <span
                    className="font-mono-geist text-[9px]"
                    style={{ color: "rgba(255,255,255,0.2)" }}
                  >
                    · Epoch {selectedNodeData.epochId}
                  </span>
                </div>

                <h3
                  className="font-display text-xl font-light mb-3"
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {selectedNodeData.label}
                </h3>

                <p
                  style={{
                    fontFamily: "Sora, sans-serif",
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.65)",
                    lineHeight: 1.8,
                    maxWidth: "640px",
                  }}
                >
                  {selectedNodeData.description}
                </p>
              </div>

              <button
                type="button"
                data-ocid="epochs.timeline3.node.detail.close_button"
                onClick={() => setSelectedNode(null)}
                style={{
                  background: "none",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.4)",
                  padding: "6px 14px",
                  borderRadius: "2px",
                  cursor: "pointer",
                  fontFamily: "Sora, sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.06em",
                  flexShrink: 0,
                }}
              >
                CLOSE ×
              </button>
            </div>

            {/* Lineages that contain this node */}
            {(() => {
              const containing = DISCOVERY_LINEAGES.filter((l) =>
                l.nodes.includes(selectedNodeData.id),
              );
              if (!containing.length) return null;
              return (
                <div
                  className="mt-4 pt-4"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="font-mono-geist text-[8px] tracking-[0.2em] uppercase mb-2"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  >
                    PART OF LINEAGE
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {containing.map((lin) => (
                      <button
                        key={lin.id}
                        type="button"
                        data-ocid={`epochs.timeline3.node.lineage.${lin.id}`}
                        onClick={() => setActiveLineage(lin.id)}
                        style={{
                          padding: "4px 10px",
                          background: `${lin.color}18`,
                          border: `1px solid ${lin.color}44`,
                          color: lin.color,
                          borderRadius: "2px",
                          fontFamily: "Sora, sans-serif",
                          fontSize: "10px",
                          cursor: "pointer",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {lin.title}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Lineage legend / flow summary */}
        <div
          className="mt-10 p-5 rounded-sm"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            opacity: entered ? 1 : 0,
            transition: "opacity 0.8s ease 0.6s",
          }}
        >
          <div
            className="font-mono-geist text-[9px] tracking-[0.3em] uppercase mb-4"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            ACTIVE LINEAGE — {activeLineageData.title}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {activeLineageData.nodes.map((nodeId, i) => {
              const node = DISCOVERY_NODES.find((n) => n.id === nodeId);
              if (!node) return null;
              const isLast = i === activeLineageData.nodes.length - 1;
              return (
                <div key={nodeId} className="flex items-center gap-2">
                  <button
                    type="button"
                    data-ocid={`epochs.timeline3.legend.${nodeId}`}
                    onClick={() => setSelectedNode(nodeId)}
                    onMouseEnter={() => setHoveredNode(nodeId)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="transition-all duration-200"
                    style={{
                      padding: "4px 10px",
                      background:
                        hoveredNode === nodeId || selectedNode === nodeId
                          ? `${node.domainColor}22`
                          : "rgba(255,255,255,0.04)",
                      border: `1px solid ${hoveredNode === nodeId || selectedNode === nodeId ? node.domainColor : "rgba(255,255,255,0.1)"}`,
                      borderRadius: "2px",
                      color:
                        hoveredNode === nodeId || selectedNode === nodeId
                          ? node.domainColor
                          : "rgba(255,255,255,0.6)",
                      fontFamily: "Sora, sans-serif",
                      fontSize: "10px",
                      cursor: "pointer",
                      letterSpacing: "0.04em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {node.label}
                  </button>
                  {!isLast && (
                    <span
                      className="font-mono-geist text-[10px]"
                      style={{ color: activeLineageData.color, opacity: 0.7 }}
                    >
                      →
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Stage 4: Scientific Constellation Map ────────────────────────────────────
interface ConstellationNodeDef {
  id: string;
  label: string;
  shortLabel: string;
  domain: string;
  domainColor: string;
  epochId: number;
  cx: number;
  cy: number;
  size: number;
  description: string;
  connections: string[];
}

const CONSTELLATION_NODES: ConstellationNodeDef[] = [
  {
    id: "cn-gravity",
    label: "Newtonian Gravity",
    shortLabel: "Gravity",
    domain: "Physics",
    domainColor: "#d4a017",
    epochId: 1,
    cx: 18,
    cy: 18,
    size: 3,
    description:
      "Universal gravitation — unified terrestrial and celestial mechanics under one law.",
    connections: ["cn-calculus", "cn-electromag", "cn-relativity"],
  },
  {
    id: "cn-calculus",
    label: "Calculus",
    shortLabel: "Calculus",
    domain: "Mathematics",
    domainColor: "#d4a017",
    epochId: 1,
    cx: 12,
    cy: 32,
    size: 2,
    description:
      "Infinitesimal calculus — the mathematical language of change and motion.",
    connections: ["cn-gravity", "cn-thermo", "cn-quantum"],
  },
  {
    id: "cn-electromag",
    label: "Electromagnetism",
    shortLabel: "EM Theory",
    domain: "Physics",
    domainColor: "#4a7ef7",
    epochId: 3,
    cx: 28,
    cy: 22,
    size: 3,
    description:
      "Maxwell unified electricity, magnetism, and light as manifestations of one field.",
    connections: [
      "cn-gravity",
      "cn-quantum",
      "cn-transistor",
      "cn-electricity",
    ],
  },
  {
    id: "cn-relativity",
    label: "Relativity",
    shortLabel: "Relativity",
    domain: "Physics",
    domainColor: "#4a7ef7",
    epochId: 3,
    cx: 22,
    cy: 38,
    size: 2,
    description:
      "Einstein's special and general relativity redefined space, time, and gravity.",
    connections: ["cn-gravity", "cn-quantum", "cn-gps"],
  },
  {
    id: "cn-quantum",
    label: "Quantum Mechanics",
    shortLabel: "Quantum",
    domain: "Physics",
    domainColor: "#4a7ef7",
    epochId: 3,
    cx: 35,
    cy: 30,
    size: 3,
    description:
      "The probabilistic framework governing atomic and subatomic phenomena — foundation of all modern electronics.",
    connections: ["cn-electromag", "cn-transistor", "cn-laser", "cn-quantum2"],
  },
  {
    id: "cn-steam",
    label: "Steam Engine",
    shortLabel: "Steam",
    domain: "Engineering",
    domainColor: "#94a3b8",
    epochId: 2,
    cx: 14,
    cy: 52,
    size: 2,
    description:
      "Watt's steam engine converted thermodynamic theory into productive mechanical power.",
    connections: ["cn-thermo", "cn-electricity"],
  },
  {
    id: "cn-thermo",
    label: "Thermodynamics",
    shortLabel: "Thermo",
    domain: "Physics",
    domainColor: "#94a3b8",
    epochId: 2,
    cx: 22,
    cy: 55,
    size: 2,
    description:
      "Laws governing energy conversion — fundamental to all heat engines and refrigeration.",
    connections: ["cn-steam", "cn-calculus", "cn-electricity"],
  },
  {
    id: "cn-electricity",
    label: "Electric Grid",
    shortLabel: "Electric",
    domain: "Engineering",
    domainColor: "#4a7ef7",
    epochId: 3,
    cx: 30,
    cy: 48,
    size: 2,
    description:
      "Edison and Tesla's power distribution networks created civilizational energy infrastructure.",
    connections: ["cn-electromag", "cn-steam", "cn-transistor"],
  },
  {
    id: "cn-transistor",
    label: "Transistor",
    shortLabel: "Transistor",
    domain: "Engineering",
    domainColor: "#34d399",
    epochId: 4,
    cx: 45,
    cy: 32,
    size: 3,
    description:
      "Bell Labs' semiconductor switch — the fundamental logic unit of all digital computation.",
    connections: [
      "cn-quantum",
      "cn-electricity",
      "cn-computing",
      "cn-integrated",
    ],
  },
  {
    id: "cn-integrated",
    label: "Integrated Circuit",
    shortLabel: "IC Chip",
    domain: "Engineering",
    domainColor: "#34d399",
    epochId: 4,
    cx: 52,
    cy: 22,
    size: 2,
    description:
      "Kilby and Noyce's IC miniaturized thousands of transistors onto a single silicon substrate.",
    connections: ["cn-transistor", "cn-computing", "cn-internet"],
  },
  {
    id: "cn-computing",
    label: "Stored-Program Computer",
    shortLabel: "Computing",
    domain: "Computation",
    domainColor: "#34d399",
    epochId: 4,
    cx: 55,
    cy: 42,
    size: 3,
    description:
      "Von Neumann architecture — a universal machine that executes any algorithm.",
    connections: ["cn-transistor", "cn-integrated", "cn-internet", "cn-ai"],
  },
  {
    id: "cn-internet",
    label: "Internet Protocol",
    shortLabel: "Internet",
    domain: "Networks",
    domainColor: "#a78bfa",
    epochId: 5,
    cx: 65,
    cy: 30,
    size: 3,
    description:
      "TCP/IP created a universal protocol for networked machines — the information economy's substrate.",
    connections: ["cn-computing", "cn-integrated", "cn-ai", "cn-smartphone"],
  },
  {
    id: "cn-ai",
    label: "Neural Networks / AI",
    shortLabel: "AI",
    domain: "AI",
    domainColor: "#f97316",
    epochId: 6,
    cx: 75,
    cy: 42,
    size: 3,
    description:
      "Deep learning and transformer architectures — AI systems that generalize across domains.",
    connections: [
      "cn-computing",
      "cn-internet",
      "cn-quantum2",
      "cn-transformer",
    ],
  },
  {
    id: "cn-transformer",
    label: "Transformer Architecture",
    shortLabel: "Transformer",
    domain: "AI",
    domainColor: "#f97316",
    epochId: 6,
    cx: 82,
    cy: 32,
    size: 2,
    description:
      "Attention-based neural architecture enabling large language models and general AI reasoning.",
    connections: ["cn-ai", "cn-internet"],
  },
  {
    id: "cn-evolution",
    label: "Theory of Evolution",
    shortLabel: "Evolution",
    domain: "Biology",
    domainColor: "#94a3b8",
    epochId: 2,
    cx: 25,
    cy: 72,
    size: 2,
    description:
      "Natural selection — the unifying explanatory framework for all of biology.",
    connections: ["cn-dna", "cn-genetics"],
  },
  {
    id: "cn-dna",
    label: "DNA Double Helix",
    shortLabel: "DNA",
    domain: "Biology",
    domainColor: "#34d399",
    epochId: 4,
    cx: 42,
    cy: 68,
    size: 3,
    description:
      "Watson and Crick's discovery — information storage architecture of all life.",
    connections: ["cn-evolution", "cn-genetics", "cn-genome", "cn-crispr"],
  },
  {
    id: "cn-genetics",
    label: "Mendelian Genetics",
    shortLabel: "Genetics",
    domain: "Biology",
    domainColor: "#34d399",
    epochId: 2,
    cx: 35,
    cy: 78,
    size: 2,
    description:
      "Mendel's laws of inheritance — the mathematical basis of genetic trait transmission.",
    connections: ["cn-evolution", "cn-dna"],
  },
  {
    id: "cn-genome",
    label: "Human Genome",
    shortLabel: "Genome",
    domain: "Biology",
    domainColor: "#a78bfa",
    epochId: 5,
    cx: 55,
    cy: 72,
    size: 2,
    description:
      "First complete map of human DNA — launched precision medicine and genomic research.",
    connections: ["cn-dna", "cn-crispr", "cn-computing"],
  },
  {
    id: "cn-crispr",
    label: "CRISPR-Cas9",
    shortLabel: "CRISPR",
    domain: "Biology",
    domainColor: "#f97316",
    epochId: 6,
    cx: 68,
    cy: 68,
    size: 3,
    description:
      "Programmable gene editing — precise, cheap, applicable to any organism.",
    connections: ["cn-dna", "cn-genome"],
  },
  {
    id: "cn-laser",
    label: "Laser Technology",
    shortLabel: "Laser",
    domain: "Physics",
    domainColor: "#4a7ef7",
    epochId: 4,
    cx: 42,
    cy: 48,
    size: 1,
    description:
      "Coherent light amplification — enabling fiber optics, surgery, manufacturing, and sensing.",
    connections: ["cn-quantum", "cn-internet"],
  },
  {
    id: "cn-gps",
    label: "GPS Navigation",
    shortLabel: "GPS",
    domain: "Engineering",
    domainColor: "#94a3b8",
    epochId: 5,
    cx: 62,
    cy: 52,
    size: 1,
    description:
      "Relativistic corrections applied to satellite timing — precision location for civilization.",
    connections: ["cn-relativity", "cn-smartphone", "cn-internet"],
  },
  {
    id: "cn-smartphone",
    label: "Smartphone",
    shortLabel: "Smartphone",
    domain: "Computation",
    domainColor: "#a78bfa",
    epochId: 5,
    cx: 72,
    cy: 58,
    size: 2,
    description:
      "Convergent device integrating computing, internet, GPS, and camera — knowledge at scale.",
    connections: ["cn-internet", "cn-gps", "cn-ai"],
  },
  {
    id: "cn-quantum2",
    label: "Quantum Computing",
    shortLabel: "Quantum Comp",
    domain: "Computation",
    domainColor: "#f97316",
    epochId: 6,
    cx: 85,
    cy: 52,
    size: 2,
    description:
      "Quantum processors exploit superposition and entanglement for problem classes beyond classical compute.",
    connections: ["cn-quantum", "cn-ai"],
  },
];

const DOMAIN_FILTERS_LIST = [
  "All",
  "Physics",
  "Mathematics",
  "Engineering",
  "Computation",
  "Biology",
  "Networks",
  "AI",
] as const;
type DomainFilterType = (typeof DOMAIN_FILTERS_LIST)[number];

function ScientificConstellationMap() {
  const [activeEpochFilter, setActiveEpochFilter] = useState<number | null>(
    null,
  );
  const [activeDomain, setActiveDomain] = useState<DomainFilterType>("All");
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [entered, setEntered] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setEntered(true);
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const visibleNodes = CONSTELLATION_NODES.filter((n) => {
    if (activeEpochFilter !== null && n.epochId !== activeEpochFilter)
      return false;
    if (activeDomain !== "All" && n.domain !== activeDomain) return false;
    return true;
  });
  const visibleIds = new Set(visibleNodes.map((n) => n.id));

  const selectedNodeData = selectedNodeId
    ? CONSTELLATION_NODES.find((n) => n.id === selectedNodeId)
    : null;
  const hoveredNodeData = hoveredNodeId
    ? CONSTELLATION_NODES.find((n) => n.id === hoveredNodeId)
    : null;

  const highlightConnections = new Set<string>();
  const activeId = hoveredNodeId || selectedNodeId;
  if (activeId) {
    const nd = CONSTELLATION_NODES.find((n) => n.id === activeId);
    if (nd) {
      for (const cid of nd.connections) {
        highlightConnections.add(cid);
      }
    }
    highlightConnections.add(activeId);
  }

  const nodeRadius = (size: number) => 4 + size * 3;

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(4,5,14,0) 0%, rgba(4,6,18,0.9) 50%, rgba(4,5,14,0) 100%)",
      }}
      aria-label="Scientific Constellation Map"
    >
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div
          className="mb-10"
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <div
            className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
            style={{ color: "rgba(212,160,23,0.7)" }}
          >
            ◈ STAGE 4 — SCIENTIFIC CONSTELLATION MAP
          </div>
          <h2
            className="font-display text-3xl md:text-4xl font-light mb-4"
            style={{ color: "rgba(255,255,255,0.92)", letterSpacing: "0.06em" }}
          >
            Knowledge Constellations Across Time
          </h2>
          <p
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: "13px",
              color: "rgba(255,255,255,0.4)",
              maxWidth: "520px",
              lineHeight: 1.8,
            }}
          >
            Each node is a discovery. Each line is a dependency. Hover to
            illuminate connected discoveries. Click to read the detail. Filter
            by epoch or domain to reveal specific knowledge networks.
          </p>
        </div>

        {/* Epoch + domain filters */}
        <div
          className="flex flex-wrap gap-y-3 gap-x-2 mb-8"
          style={{
            opacity: entered ? 1 : 0,
            transition: "opacity 0.8s ease 0.2s",
          }}
        >
          <div className="flex flex-wrap gap-1.5 mr-4">
            {([null, 1, 2, 3, 4, 5, 6] as const).map((epId) => {
              const label =
                epId === null
                  ? "All Epochs"
                  : (CIVILIZATION_EPOCHS.find((e) => e.id === epId)
                      ?.shortLabel ?? `Epoch ${epId}`);
              const isActive = activeEpochFilter === epId;
              const rawColor =
                epId === null
                  ? "#ffffff"
                  : (CIVILIZATION_EPOCHS.find((e) => e.id === epId)
                      ?.accentColor ?? "#fff");
              const color = rawColor.replace("0.8", "1");
              return (
                <button
                  key={epId === null ? "ep-all" : `ep-${epId}`}
                  type="button"
                  data-ocid={`epochs.constellation.epoch_filter.${epId === null ? "all" : epId}`}
                  onClick={() => setActiveEpochFilter(epId)}
                  style={{
                    padding: "5px 11px",
                    borderRadius: "2px",
                    border: `1px solid ${isActive ? color : "rgba(255,255,255,0.1)"}`,
                    background: isActive
                      ? `${color}18`
                      : "rgba(255,255,255,0.03)",
                    color: isActive ? color : "rgba(255,255,255,0.4)",
                    fontFamily: "Sora, sans-serif",
                    fontSize: "10px",
                    letterSpacing: "0.06em",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {DOMAIN_FILTERS_LIST.map((domain) => {
              const isActive = activeDomain === domain;
              const nodeInDomain = CONSTELLATION_NODES.find(
                (n) => n.domain === domain,
              );
              const color =
                domain === "All"
                  ? "#ffffff"
                  : (nodeInDomain?.domainColor ?? "#fff");
              return (
                <button
                  key={`dom-${domain}`}
                  type="button"
                  data-ocid={`epochs.constellation.domain_filter.${domain.toLowerCase()}`}
                  onClick={() => setActiveDomain(domain)}
                  style={{
                    padding: "5px 11px",
                    borderRadius: "2px",
                    border: `1px solid ${isActive ? color : "rgba(255,255,255,0.08)"}`,
                    background: isActive
                      ? `${color}15`
                      : "rgba(255,255,255,0.02)",
                    color: isActive ? color : "rgba(255,255,255,0.35)",
                    fontFamily: "Sora, sans-serif",
                    fontSize: "10px",
                    letterSpacing: "0.05em",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {domain}
                </button>
              );
            })}
          </div>
        </div>

        {/* SVG Constellation */}
        <div
          className="relative rounded-sm overflow-hidden"
          style={{
            background: "rgba(4,5,14,0.6)",
            border: "1px solid rgba(255,255,255,0.06)",
            opacity: entered ? 1 : 0,
            transition: "opacity 0.9s ease 0.35s",
          }}
        >
          <svg
            viewBox="0 0 100 90"
            className="w-full"
            style={{ height: "clamp(300px, 50vw, 540px)" }}
            aria-label="Scientific knowledge constellation visualization"
            role="img"
          >
            <title>Scientific Knowledge Constellation</title>
            <defs>
              <radialGradient id="constBg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(74,126,247,0.12)" />
                <stop offset="100%" stopColor="rgba(4,5,14,0)" />
              </radialGradient>
              {CONSTELLATION_NODES.map((n) => (
                <radialGradient
                  key={`cng-${n.id}`}
                  id={`cng-${n.id}`}
                  cx="50%"
                  cy="50%"
                  r="50%"
                >
                  <stop
                    offset="0%"
                    stopColor={n.domainColor}
                    stopOpacity="0.95"
                  />
                  <stop
                    offset="100%"
                    stopColor={n.domainColor}
                    stopOpacity="0.15"
                  />
                </radialGradient>
              ))}
              <filter id="cn-glow">
                <feGaussianBlur stdDeviation="1.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="cn-glow-strong">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Animated pulse ring keyframes */}
              <style>{`
                @keyframes cnNodePulse { 0%,100%{r:0;opacity:0.7} 100%{r:8;opacity:0} }
                @keyframes cnOrbit { from{transform-origin:50% 50%; transform:rotate(0deg)} to{transform-origin:50% 50%; transform:rotate(360deg)} }
                @keyframes cnDrift { 0%,100%{opacity:0.08} 50%{opacity:0.22} }
                @keyframes cnWave { 0%{opacity:0;stroke-width:0.08} 50%{opacity:0.35;stroke-width:0.3} 100%{opacity:0;stroke-width:0.08} }
              `}</style>
            </defs>

            <rect x="0" y="0" width="100" height="90" fill="url(#constBg)" />

            {/* Star field — Stage 6: twinkle animation */}
            {[
              { x: 5, y: 8, d: "0s" },
              { x: 15, y: 3, d: "0.7s" },
              { x: 30, y: 6, d: "1.4s" },
              { x: 50, y: 4, d: "0.3s" },
              { x: 70, y: 7, d: "2.1s" },
              { x: 85, y: 5, d: "0.9s" },
              { x: 95, y: 10, d: "1.8s" },
              { x: 3, y: 45, d: "0.5s" },
              { x: 8, y: 70, d: "1.2s" },
              { x: 18, y: 85, d: "2.4s" },
              { x: 45, y: 88, d: "0.6s" },
              { x: 65, y: 82, d: "1.9s" },
              { x: 80, y: 87, d: "0.2s" },
              { x: 93, y: 75, d: "1.5s" },
              { x: 50, y: 50, d: "2.8s" },
              { x: 20, y: 60, d: "0.4s" },
              { x: 75, y: 25, d: "1.1s" },
              { x: 90, y: 40, d: "2.6s" },
              { x: 10, y: 25, d: "0.8s" },
              { x: 40, y: 15, d: "1.7s" },
            ].map((star) => (
              <circle
                key={`s${star.x}-${star.y}`}
                cx={star.x}
                cy={star.y}
                r="0.12"
                fill="rgba(255,255,255,0.25)"
                style={{
                  animation: `starTwinkle ${2.5 + Math.sin(star.x) * 1.2}s ease-in-out infinite`,
                  animationDelay: star.d,
                }}
              />
            ))}

            {/* Animated orbital wave rings around central area */}
            {[20, 35, 50].map((r, i) => (
              <circle
                key={`wave-${r}`}
                cx="50"
                cy="45"
                r={r}
                fill="none"
                stroke="rgba(74,126,247,0.06)"
                strokeWidth="0.15"
                strokeDasharray="3 5"
                style={{
                  animation: `cnDrift ${4 + i * 1.5}s ease-in-out infinite`,
                  animationDelay: `${i * 1.2}s`,
                }}
              />
            ))}
            {/* Drifting knowledge wave lines */}
            {[
              { x1: 0, y1: 15, x2: 100, y2: 25, id: "drift-15-25" },
              { x1: 0, y1: 60, x2: 100, y2: 50, id: "drift-60-50" },
              { x1: 0, y1: 80, x2: 100, y2: 72, id: "drift-80-72" },
            ].map((line, i) => (
              <line
                key={line.id}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="rgba(74,126,247,0.04)"
                strokeWidth="0.2"
                strokeDasharray="8 12"
                style={{
                  animation: `cnWave ${6 + i * 2}s ease-in-out infinite`,
                  animationDelay: `${i * 2}s`,
                }}
              />
            ))}
            {/* Connection lines */}
            {CONSTELLATION_NODES.flatMap((node) =>
              node.connections
                .filter((cid) => cid > node.id)
                .map((cid) => {
                  const target = CONSTELLATION_NODES.find((n) => n.id === cid);
                  if (!target) return null;
                  const bothVisible =
                    visibleIds.has(node.id) && visibleIds.has(cid);
                  const isHighlighted =
                    highlightConnections.has(node.id) &&
                    highlightConnections.has(cid);
                  return (
                    <line
                      key={`cl-${node.id}-${cid}`}
                      x1={node.cx}
                      y1={node.cy}
                      x2={target.cx}
                      y2={target.cy}
                      stroke={
                        isHighlighted
                          ? node.domainColor
                          : "rgba(255,255,255,0.07)"
                      }
                      strokeWidth={isHighlighted ? 0.35 : 0.12}
                      opacity={
                        bothVisible ? (isHighlighted ? 0.9 : 0.45) : 0.04
                      }
                      strokeDasharray={isHighlighted ? "none" : "0.8 1.5"}
                      filter={isHighlighted ? "url(#cn-glow)" : undefined}
                      style={{ transition: "all 0.3s ease" }}
                    />
                  );
                }),
            )}

            {/* Nodes */}
            {CONSTELLATION_NODES.map((node) => {
              const isVisible = visibleIds.has(node.id);
              const isHov = hoveredNodeId === node.id;
              const isSel = selectedNodeId === node.id;
              const isConn =
                highlightConnections.has(node.id) && !isHov && !isSel;
              const r = nodeRadius(node.size);
              return (
                <g
                  key={`cn-g-${node.id}`}
                  data-ocid={`epochs.constellation.node.${node.id.replace("cn-", "")}`}
                  style={{
                    cursor: "pointer",
                    opacity: isVisible ? 1 : 0.08,
                    transition: "opacity 0.4s ease",
                  }}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() =>
                    setSelectedNodeId(
                      selectedNodeId === node.id ? null : node.id,
                    )
                  }
                  tabIndex={0}
                  aria-label={node.label}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      setSelectedNodeId(
                        selectedNodeId === node.id ? null : node.id,
                      );
                  }}
                >
                  {(isHov || isSel) && (
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r={r / 2 + 3}
                      fill="none"
                      stroke={node.domainColor}
                      strokeWidth="0.25"
                      opacity="0.35"
                      style={{ animation: "pulse 1.8s ease-in-out infinite" }}
                    />
                  )}
                  {isConn && (
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r={r / 2 + 1.5}
                      fill="none"
                      stroke={node.domainColor}
                      strokeWidth="0.18"
                      opacity="0.3"
                    />
                  )}
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r={r / 2}
                    fill={`url(#cng-${node.id})`}
                    stroke={
                      isHov || isSel
                        ? node.domainColor
                        : `${node.domainColor}44`
                    }
                    strokeWidth={isHov || isSel ? 0.35 : 0.18}
                    filter={
                      isHov || isSel || isConn ? "url(#cn-glow)" : undefined
                    }
                    style={{ transition: "all 0.25s ease" }}
                  />
                  {(isHov || isSel || node.size === 3) && (
                    <text
                      x={node.cx}
                      y={node.cy + r / 2 + 2.5}
                      textAnchor="middle"
                      fill={
                        isHov || isSel
                          ? "rgba(255,255,255,0.9)"
                          : "rgba(255,255,255,0.45)"
                      }
                      fontSize="2"
                      fontFamily="monospace"
                      style={{ pointerEvents: "none" }}
                    >
                      {node.shortLabel}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Hover tooltip */}
          {hoveredNodeData && !selectedNodeId && (
            <div
              className="absolute bottom-4 left-4 pointer-events-none"
              style={{
                background: "rgba(4,5,14,0.94)",
                border: `1px solid ${hoveredNodeData.domainColor}44`,
                borderRadius: "2px",
                padding: "10px 14px",
                maxWidth: "260px",
                boxShadow: `0 0 20px ${hoveredNodeData.domainColor}22`,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: hoveredNodeData.domainColor,
                    flexShrink: 0,
                  }}
                />
                <span
                  className="font-mono-geist"
                  style={{
                    fontSize: "7px",
                    color: hoveredNodeData.domainColor,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  {hoveredNodeData.domain} · Epoch {hoveredNodeData.epochId}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.85)",
                  fontWeight: 500,
                  marginBottom: "4px",
                }}
              >
                {hoveredNodeData.label}
              </div>
              <div
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.6,
                }}
              >
                {hoveredNodeData.description}
              </div>
              <div
                className="mt-2 font-mono-geist"
                style={{ fontSize: "8px", color: "rgba(255,255,255,0.22)" }}
              >
                {hoveredNodeData.connections.length} connection
                {hoveredNodeData.connections.length !== 1 ? "s" : ""} — click to
                explore
              </div>
            </div>
          )}
        </div>

        {/* Selected node detail */}
        {selectedNodeData && (
          <div
            className="mt-6 p-6 rounded-sm relative overflow-hidden"
            data-ocid="epochs.constellation.detail.panel"
            style={{
              background: `linear-gradient(135deg, ${selectedNodeData.domainColor}10, rgba(4,5,14,0.95))`,
              border: `1px solid ${selectedNodeData.domainColor}40`,
              boxShadow: `0 0 40px ${selectedNodeData.domainColor}14`,
              animation: "fadeInUp 0.3s ease",
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-[1px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${selectedNodeData.domainColor}55, transparent)`,
              }}
            />
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: selectedNodeData.domainColor,
                      boxShadow: `0 0 8px ${selectedNodeData.domainColor}`,
                    }}
                  />
                  <span
                    className="font-mono-geist text-[8px] tracking-[0.2em] uppercase"
                    style={{ color: selectedNodeData.domainColor }}
                  >
                    {selectedNodeData.domain}
                  </span>
                  <span
                    className="font-mono-geist text-[9px]"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  >
                    Epoch {selectedNodeData.epochId} —{" "}
                    {
                      CIVILIZATION_EPOCHS.find(
                        (e) => e.id === selectedNodeData.epochId,
                      )?.period
                    }
                  </span>
                </div>
                <h3
                  className="font-display text-xl font-light mb-2"
                  style={{
                    color: "rgba(255,255,255,0.92)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {selectedNodeData.label}
                </h3>
                <p
                  style={{
                    fontFamily: "Sora, sans-serif",
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.6)",
                    lineHeight: 1.8,
                    maxWidth: "600px",
                  }}
                >
                  {selectedNodeData.description}
                </p>
              </div>
              <button
                type="button"
                data-ocid="epochs.constellation.detail.close_button"
                onClick={() => setSelectedNodeId(null)}
                style={{
                  background: "none",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.4)",
                  padding: "6px 14px",
                  borderRadius: "2px",
                  cursor: "pointer",
                  fontFamily: "Sora, sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.06em",
                  flexShrink: 0,
                }}
              >
                CLOSE ×
              </button>
            </div>
            {selectedNodeData.connections.length > 0 && (
              <div
                className="pt-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="font-mono-geist text-[8px] tracking-[0.2em] uppercase mb-3"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  CONNECTED DISCOVERIES
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedNodeData.connections.map((cid) => {
                    const cn = CONSTELLATION_NODES.find((n) => n.id === cid);
                    if (!cn) return null;
                    return (
                      <button
                        key={`detail-conn-${cid}`}
                        type="button"
                        data-ocid={`epochs.constellation.detail.connection.${cid.replace("cn-", "")}`}
                        onClick={() => setSelectedNodeId(cid)}
                        style={{
                          padding: "5px 12px",
                          background: `${cn.domainColor}15`,
                          border: `1px solid ${cn.domainColor}40`,
                          color: cn.domainColor,
                          borderRadius: "2px",
                          fontFamily: "Sora, sans-serif",
                          fontSize: "10px",
                          cursor: "pointer",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {cn.shortLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Domain legend */}
        <div
          className="mt-8 flex flex-wrap gap-4"
          style={{
            opacity: entered ? 1 : 0,
            transition: "opacity 0.8s ease 0.5s",
          }}
        >
          {(
            [
              "Physics",
              "Mathematics",
              "Engineering",
              "Computation",
              "Biology",
              "Networks",
              "AI",
            ] as const
          ).map((domain) => {
            const nodeInDomain = CONSTELLATION_NODES.find(
              (n) => n.domain === domain,
            );
            const color = nodeInDomain?.domainColor ?? "#fff";
            const count = CONSTELLATION_NODES.filter(
              (n) => n.domain === domain,
            ).length;
            return (
              <div key={`legend-${domain}`} className="flex items-center gap-2">
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: color,
                    boxShadow: `0 0 4px ${color}`,
                  }}
                />
                <span
                  className="font-mono-geist"
                  style={{
                    fontSize: "9px",
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  {domain} ({count})
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Stage 5: Civilization Signal Dashboard ────────────────────────────────────
interface CivilizationSignalDashboardProps {
  activeEpochId: number;
}

interface SignalIndicator {
  id: string;
  title: string;
  subtitle: string;
  stages: { label: string; epochId: number; detail: string }[];
  color: string;
  glowColor: string;
  visualType: "chain" | "bars" | "line" | "radar";
  metricLabel: string;
  metricValues: number[]; // one per epoch 1-6
}

const CIVILIZATION_SIGNALS: SignalIndicator[] = [
  {
    id: "energy",
    title: "Energy Systems",
    subtitle: "Civilization's thermodynamic substrate",
    stages: [
      {
        label: "Biomass & Animal Power",
        epochId: 1,
        detail: "Muscle, wind, and wood — energy bound by biological limits.",
      },
      {
        label: "Steam & Coal",
        epochId: 2,
        detail:
          "Fossil thermodynamics unlock concentrated ancient solar energy.",
      },
      {
        label: "Electricity & Nuclear",
        epochId: 3,
        detail:
          "Electromagnetic infrastructure and nuclear binding energy rewire civilization.",
      },
      {
        label: "Digital Grid Integration",
        epochId: 4,
        detail: "Computation enables optimized distribution networks.",
      },
      {
        label: "Renewable Scaling",
        epochId: 5,
        detail:
          "Solar and wind reach grid parity; storage becomes the constraint.",
      },
      {
        label: "Fusion & Post-Carbon",
        epochId: 6,
        detail:
          "NIF ignition milestone signals the approach of energy abundance.",
      },
    ],
    color: "#d4a017",
    glowColor: "rgba(212,160,23,",
    visualType: "chain",
    metricLabel: "Energy Density (relative)",
    metricValues: [4, 18, 42, 60, 74, 95],
  },
  {
    id: "information",
    title: "Information Density",
    subtitle: "Knowledge encoding and transmission velocity",
    stages: [
      {
        label: "Oral & Manuscript",
        epochId: 1,
        detail:
          "Knowledge transmission limited by human memory and handwriting speed.",
      },
      {
        label: "Printing Press Era",
        epochId: 2,
        detail:
          "Mechanical reproduction democratizes knowledge at continental scale.",
      },
      {
        label: "Telegraph & Radio",
        epochId: 3,
        detail:
          "Electromagnetic signals collapse geographic latency of information.",
      },
      {
        label: "Digital Computing",
        epochId: 4,
        detail:
          "Binary encoding compresses all human knowledge into replicable bits.",
      },
      {
        label: "Internet & Mobile",
        epochId: 5,
        detail:
          "Planetary nervous system: every mind connected to the sum of human knowledge.",
      },
      {
        label: "AI Synthesis",
        epochId: 6,
        detail:
          "Language models collapse the reading cost of civilizational knowledge.",
      },
    ],
    color: "#4a7ef7",
    glowColor: "rgba(74,126,247,",
    visualType: "bars",
    metricLabel: "Information Transmission (bit/s equivalent)",
    metricValues: [2, 10, 28, 55, 78, 100],
  },
  {
    id: "computation",
    title: "Computation Capability",
    subtitle: "Cognitive processing power per unit energy",
    stages: [
      {
        label: "Mechanical Calculation",
        epochId: 1,
        detail:
          "Slide rules and mechanical calculators — analog approximation.",
      },
      {
        label: "Electromechanical",
        epochId: 2,
        detail:
          "Relay-based systems; Hollerith punch-card tabulation for census data.",
      },
      {
        label: "Vacuum Tube Logic",
        epochId: 3,
        detail: "ENIAC and early mainframes: 5,000 operations per second.",
      },
      {
        label: "Transistor & Integrated Circuit",
        epochId: 4,
        detail:
          "Moore's Law drives 10× density gain every 5 years for 50 years.",
      },
      {
        label: "GPU Parallel Compute",
        epochId: 5,
        detail:
          "Deep learning unlocked by massively parallel GPU architectures.",
      },
      {
        label: "Neural & Quantum",
        epochId: 6,
        detail:
          "Neuromorphic chips approach brain-like efficiency; quantum advantage demonstrated.",
      },
    ],
    color: "#22d3ee",
    glowColor: "rgba(34,211,238,",
    visualType: "line",
    metricLabel: "Relative FLOPS (log scale)",
    metricValues: [1, 5, 14, 35, 68, 100],
  },
  {
    id: "connectivity",
    title: "Human Connectivity",
    subtitle: "Density of coordinated human interaction",
    stages: [
      {
        label: "Local Tribal Networks",
        epochId: 1,
        detail:
          "Knowledge exchange bounded by walking distance and seasonal trade routes.",
      },
      {
        label: "National Infrastructure",
        epochId: 2,
        detail:
          "Railway and postal systems create nation-scale economic integration.",
      },
      {
        label: "Global Broadcast",
        epochId: 3,
        detail:
          "Radio and telephone create simultaneous planetary communication.",
      },
      {
        label: "Early Internet",
        epochId: 4,
        detail:
          "ARPANET and academic networks: the first global digital community.",
      },
      {
        label: "Planetary Social Layer",
        epochId: 5,
        detail:
          "5 billion people online; real-time collective intelligence emerges.",
      },
      {
        label: "AI-Augmented Network",
        epochId: 6,
        detail:
          "Direct-to-cell satellite, AI agents, and ambient computing approach universal reach.",
      },
    ],
    color: "#a78bfa",
    glowColor: "rgba(167,139,250,",
    visualType: "radar",
    metricLabel: "Connectivity Density (relative)",
    metricValues: [3, 12, 30, 52, 80, 100],
  },
];

// Signal chain viz (horizontal progress chain)
function SignalChainViz({
  signal,
  activeEpochId,
}: { signal: SignalIndicator; activeEpochId: number }) {
  const [entered, setEntered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setEntered(true);
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const activeIdx = activeEpochId - 1;

  return (
    <div ref={ref} className="overflow-x-auto pb-2">
      <div className="flex items-center gap-0 min-w-max">
        {signal.stages.map((stage, i) => {
          const isActive = i === activeIdx;
          const isPassed = i < activeIdx;
          return (
            <div key={stage.label} className="flex items-center">
              <div
                title={stage.detail}
                className="flex flex-col items-center gap-1.5 transition-all duration-500 cursor-default"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Stage dot */}
                <div
                  className={isActive ? "civ-signal-dot" : ""}
                  style={{
                    width: isActive ? "14px" : "8px",
                    height: isActive ? "14px" : "8px",
                    borderRadius: "50%",
                    background:
                      isActive || isPassed
                        ? signal.color
                        : "rgba(255,255,255,0.12)",
                    border: `1.5px solid ${isActive ? signal.color : isPassed ? `${signal.color}88` : "rgba(255,255,255,0.18)"}`,
                    boxShadow: isActive
                      ? `0 0 14px ${signal.color}, 0 0 28px ${signal.glowColor}0.3)`
                      : "none",
                    color: signal.color,
                    transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)",
                    flexShrink: 0,
                  }}
                />
                {/* Label */}
                <div
                  style={{
                    opacity: entered ? 1 : 0,
                    transform: entered ? "translateY(0)" : "translateY(8px)",
                    transition: `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`,
                    maxWidth: "80px",
                    textAlign: "center",
                  }}
                >
                  <div
                    className="font-mono-geist"
                    style={{
                      fontSize: "8px",
                      letterSpacing: "0.06em",
                      color: isActive
                        ? signal.color
                        : isPassed
                          ? "rgba(255,255,255,0.45)"
                          : "rgba(255,255,255,0.2)",
                      lineHeight: 1.3,
                      fontWeight: isActive ? 600 : 400,
                      transition: "color 0.4s ease",
                    }}
                  >
                    {stage.label}
                  </div>
                  {isActive && (
                    <div
                      className="font-mono-geist"
                      style={{
                        fontSize: "7px",
                        color: "rgba(255,255,255,0.3)",
                        marginTop: "3px",
                        letterSpacing: "0.08em",
                        animation: "epochFadeIn 0.4s ease forwards",
                      }}
                    >
                      {stage.detail.slice(0, 40)}…
                    </div>
                  )}
                </div>
              </div>
              {/* Connector line */}
              {i < signal.stages.length - 1 && (
                <div
                  style={{
                    width: "32px",
                    height: "1px",
                    background:
                      i < activeIdx
                        ? `linear-gradient(90deg, ${signal.color}99, ${signal.color}55)`
                        : "rgba(255,255,255,0.06)",
                    marginBottom: "18px",
                    position: "relative",
                    flexShrink: 0,
                    transition: "background 0.5s ease",
                  }}
                >
                  {i < activeIdx && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-1px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "4px",
                        height: "3px",
                        color: signal.color,
                        fontSize: "6px",
                        lineHeight: 1,
                        fontFamily: "monospace",
                      }}
                    >
                      →
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Signal bars viz (animated bar chart)
function SignalBarsViz({
  signal,
  activeEpochId,
}: { signal: SignalIndicator; activeEpochId: number }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setAnimated(true);
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const activeIdx = activeEpochId - 1;
  const maxVal = Math.max(...signal.metricValues);

  return (
    <div ref={ref} className="flex items-end gap-2" style={{ height: "72px" }}>
      {signal.stages.map((stage, i) => {
        const isActive = i === activeIdx;
        const pct = (signal.metricValues[i] / maxVal) * 100;
        return (
          <div
            key={stage.label}
            className="flex flex-col items-center gap-1 flex-1"
            title={stage.detail}
          >
            <div
              style={{
                width: "100%",
                height: animated ? `${pct * 0.6}px` : "2px",
                minHeight: "2px",
                maxHeight: "60px",
                background: isActive
                  ? `linear-gradient(180deg, ${signal.color}, ${signal.glowColor}0.4))`
                  : i < activeIdx
                    ? `${signal.color}66`
                    : "rgba(255,255,255,0.08)",
                borderRadius: "2px 2px 0 0",
                transition: `height 0.7s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.08}s, background 0.5s ease`,
                boxShadow: isActive ? `0 0 10px ${signal.color}` : "none",
                alignSelf: "flex-end",
                position: "relative",
                overflow: "visible",
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    top: "-16px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: signal.color,
                    boxShadow: `0 0 8px ${signal.color}`,
                    animation: "civilSignalPulse 1.8s ease-in-out infinite",
                    color: signal.color,
                  }}
                />
              )}
            </div>
            <div
              className="font-mono-geist text-center"
              style={{
                fontSize: "6px",
                color: isActive ? signal.color : "rgba(255,255,255,0.2)",
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
                transition: "color 0.4s ease",
              }}
            >
              {stage.epochId}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Line chart viz (exponential growth curve)
function SignalLineViz({
  signal,
  activeEpochId,
}: { signal: SignalIndicator; activeEpochId: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setAnimated(true);
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!animated) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const W = canvas.width;
    const H = canvas.height;
    const vals = signal.metricValues;
    const maxV = Math.max(...vals);
    let progress = 0;
    let animId: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, W, H);
      progress = Math.min(progress + 0.025, 1);
      const visible = Math.max(2, Math.ceil(progress * vals.length));

      // Area fill
      ctx.beginPath();
      for (let i = 0; i < visible; i++) {
        const x = (i / (vals.length - 1)) * W;
        const y = H - (vals[i] / maxV) * (H - 8) - 4;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      const lastX = ((visible - 1) / (vals.length - 1)) * W;
      ctx.lineTo(lastX, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      const areaGrad = ctx.createLinearGradient(0, 0, 0, H);
      areaGrad.addColorStop(0, `${signal.glowColor}0.2)`);
      areaGrad.addColorStop(1, `${signal.glowColor}0.01)`);
      ctx.fillStyle = areaGrad;
      ctx.fill();

      // Line
      ctx.beginPath();
      for (let i = 0; i < visible; i++) {
        const x = (i / (vals.length - 1)) * W;
        const y = H - (vals[i] / maxV) * (H - 8) - 4;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = signal.color;
      ctx.lineWidth = 2;
      ctx.shadowColor = signal.color;
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Epoch dots
      for (let i = 0; i < visible; i++) {
        const x = (i / (vals.length - 1)) * W;
        const y = H - (vals[i] / maxV) * (H - 8) - 4;
        const isActive = i === activeEpochId - 1;
        ctx.beginPath();
        ctx.arc(x, y, isActive ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? signal.color : `${signal.color}88`;
        ctx.shadowColor = isActive ? signal.color : "transparent";
        ctx.shadowBlur = isActive ? 10 : 0;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (progress < 1) animId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animId);
  }, [animated, activeEpochId, signal]);

  return (
    <div ref={ref} style={{ height: "72px" }}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

// Radar ring viz (concentric rings representing connectivity layers)
function SignalRadarViz({
  signal,
  activeEpochId,
}: { signal: SignalIndicator; activeEpochId: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setAnimated(true);
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!animated) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const maxR = Math.min(W, H) * 0.42;
    let t = 0;
    let animId: number;
    const FRAME_INTERVAL = 1000 / 30;
    let lastFrame = 0;

    function draw(timestamp = 0) {
      if (!ctx || !canvas) return;
      if (timestamp - lastFrame < FRAME_INTERVAL) {
        animId = requestAnimationFrame(draw);
        return;
      }
      lastFrame = timestamp;
      ctx.clearRect(0, 0, W, H);
      t += 0.018;

      // Draw rings per epoch
      for (let i = 0; i < 6; i++) {
        const r = (maxR / 6) * (i + 1);
        const isActive = i === activeEpochId - 1;
        const isPassed = i < activeEpochId - 1;
        const alpha = isPassed ? 0.35 : isActive ? 0.7 : 0.12;
        const lw = isActive ? 1.8 : 0.8;

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = isActive
          ? signal.color
          : isPassed
            ? `${signal.color}88`
            : "rgba(255,255,255,0.1)";
        ctx.lineWidth = lw;
        ctx.globalAlpha = alpha + (isActive ? Math.sin(t * 2) * 0.1 : 0);
        ctx.stroke();
        ctx.globalAlpha = 1;

        if (isActive) {
          // Glow ring
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.shadowColor = signal.color;
          ctx.shadowBlur = 12;
          ctx.strokeStyle = signal.color;
          ctx.lineWidth = 0.8;
          ctx.globalAlpha = 0.35;
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }
      }

      // Pulsing ring emanating from active ring
      const activeR = (maxR / 6) * activeEpochId;
      const pulse = (t % (Math.PI * 2)) / (Math.PI * 2);
      ctx.beginPath();
      ctx.arc(cx, cy, activeR * (1 + pulse * 0.35), 0, Math.PI * 2);
      ctx.strokeStyle = signal.color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = (1 - pulse) * 0.4;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = signal.color;
      ctx.shadowColor = signal.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Rotating scan line
      const scanAngle = t * 0.6;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(scanAngle);
      const scanGrad = ctx.createLinearGradient(0, 0, activeR, 0);
      scanGrad.addColorStop(0, `${signal.color}00`);
      scanGrad.addColorStop(0.7, `${signal.color}44`);
      scanGrad.addColorStop(1, `${signal.color}00`);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(activeR, 0);
      ctx.strokeStyle = scanGrad;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.55;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.restore();

      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animId);
  }, [animated, activeEpochId, signal]);

  return (
    <div ref={ref} style={{ height: "90px" }}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

function CivilizationSignalDashboard({
  activeEpochId,
}: CivilizationSignalDashboardProps) {
  const [entered, setEntered] = useState(false);
  const [hoveredSignalId, setHoveredSignalId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setEntered(true);
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const activeEpoch = CIVILIZATION_EPOCHS.find((e) => e.id === activeEpochId);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 relative overflow-hidden"
      aria-label="Civilization Signals Dashboard"
      style={{
        background:
          "linear-gradient(180deg, rgba(4,5,14,0) 0%, rgba(6,6,22,0.9) 50%, rgba(4,5,14,0) 100%)",
      }}
    >
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(74,126,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(74,126,247,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div
          className="mb-14"
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <div
            className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
            style={{ color: "rgba(212,160,23,0.7)" }}
          >
            ◈ STAGE 5 — CIVILIZATION SIGNALS DASHBOARD
          </div>
          <h2
            className="font-display text-3xl md:text-4xl font-light mb-4"
            style={{ color: "rgba(255,255,255,0.92)", letterSpacing: "0.06em" }}
          >
            Civilization Signals
          </h2>
          <p
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: "13px",
              color: "rgba(255,255,255,0.4)",
              maxWidth: "540px",
              lineHeight: 1.85,
            }}
          >
            Long-term indicators of technological civilization. Each signal
            tracks a structural dimension of human progress across all six
            epochs — updating dynamically as you scroll through the timeline.
          </p>

          {/* Active epoch indicator */}
          <div
            className="flex items-center gap-3 mt-5"
            style={{
              opacity: entered ? 1 : 0,
              transition: "opacity 0.7s ease 0.3s",
            }}
          >
            <div
              className="civ-signal-dot"
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: activeEpoch?.accentColor ?? "#d4a017",
                color: activeEpoch?.accentColor ?? "#d4a017",
                flexShrink: 0,
              }}
            />
            <span
              className="font-mono-geist text-[10px] tracking-[0.2em] uppercase"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              TRACKING EPOCH {activeEpochId} — {activeEpoch?.label ?? ""}
            </span>
          </div>
        </div>

        {/* Signal cards grid — always responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-7">
          {CIVILIZATION_SIGNALS.map((signal, i) => {
            const isHovered = hoveredSignalId === signal.id;
            const activeStage = signal.stages[activeEpochId - 1];
            const currentValue = signal.metricValues[activeEpochId - 1];
            const maxValue = Math.max(...signal.metricValues);
            const pct = Math.round((currentValue / maxValue) * 100);

            return (
              <div
                key={signal.id}
                data-ocid={`epochs.signals.dashboard.card.${i + 1}`}
                onMouseEnter={() => setHoveredSignalId(signal.id)}
                onMouseLeave={() => setHoveredSignalId(null)}
                style={{
                  opacity: entered ? 1 : 0,
                  transform: entered ? "translateY(0)" : "translateY(32px)",
                  transition: `opacity 0.7s ease ${0.1 + i * 0.1}s, transform 0.7s ease ${0.1 + i * 0.1}s`,
                }}
              >
                <div
                  className="relative rounded-sm overflow-hidden h-full"
                  style={{
                    background: isHovered
                      ? `linear-gradient(135deg, ${signal.glowColor}0.07) 0%, rgba(4,5,14,0.85) 100%)`
                      : "rgba(255,255,255,0.025)",
                    border: `1px solid ${isHovered ? `${signal.color}55` : "rgba(255,255,255,0.07)"}`,
                    backdropFilter: "blur(16px)",
                    boxShadow: isHovered
                      ? `0 0 32px ${signal.glowColor}0.1), 0 8px 40px rgba(0,0,0,0.4)`
                      : "0 2px 16px rgba(0,0,0,0.3)",
                    transition: "all 0.4s ease",
                    padding: "24px",
                  }}
                >
                  {/* Scan-line sweep on hover */}
                  {isHovered && (
                    <div
                      className="pointer-events-none absolute left-0 right-0 dashboard-sweep-line"
                      style={{
                        height: "1px",
                        background: `linear-gradient(90deg, transparent, ${signal.color}55, transparent)`,
                        top: "40%",
                        zIndex: 1,
                      }}
                      aria-hidden="true"
                    />
                  )}

                  {/* Card top accent */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      background: `linear-gradient(90deg, transparent, ${signal.color}, transparent)`,
                      opacity: isHovered ? 1 : 0.4,
                      transition: "opacity 0.4s ease",
                    }}
                  />

                  {/* Header row */}
                  <div className="flex items-start justify-between gap-4 mb-5 relative z-10">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: signal.color,
                            boxShadow: `0 0 8px ${signal.color}`,
                            animation:
                              "civilSignalPulse 2.2s ease-in-out infinite",
                            color: signal.color,
                            flexShrink: 0,
                          }}
                        />
                        <h3
                          className="font-display text-lg font-light"
                          style={{
                            color: "rgba(255,255,255,0.9)",
                            letterSpacing: "0.06em",
                          }}
                        >
                          {signal.title}
                        </h3>
                      </div>
                      <p
                        className="font-mono-geist"
                        style={{
                          fontSize: "9px",
                          color: "rgba(255,255,255,0.3)",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                        }}
                      >
                        {signal.subtitle}
                      </p>
                    </div>

                    {/* Signal strength readout */}
                    <div
                      className="flex-shrink-0 flex flex-col items-end gap-1"
                      style={{
                        padding: "8px 12px",
                        background: `${signal.glowColor}0.08)`,
                        border: `1px solid ${signal.glowColor}0.2)`,
                        borderRadius: "3px",
                      }}
                    >
                      <div
                        className="font-mono-geist"
                        style={{
                          fontSize: "18px",
                          fontWeight: 700,
                          color: signal.color,
                          lineHeight: 1,
                        }}
                      >
                        {pct}
                        <span style={{ fontSize: "10px", opacity: 0.6 }}>
                          %
                        </span>
                      </div>
                      <div
                        className="font-mono-geist"
                        style={{
                          fontSize: "7px",
                          color: "rgba(255,255,255,0.3)",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                        }}
                      >
                        SIGNAL
                      </div>
                    </div>
                  </div>

                  {/* Current stage display — enhanced with epoch progression */}
                  <div
                    className="mb-4 px-3 py-3 rounded-sm relative z-10"
                    style={{
                      background: `${signal.glowColor}0.06)`,
                      border: `1px solid ${signal.glowColor}0.2)`,
                      borderLeft: `3px solid ${signal.color}`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div
                        className="font-mono-geist text-[8px] tracking-[0.2em] uppercase"
                        style={{ color: signal.color }}
                      >
                        EPOCH {activeEpochId} — ACTIVE STAGE
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5, 6].map((ep) => (
                          <div
                            key={ep}
                            style={{
                              width: "4px",
                              height: "4px",
                              borderRadius: "50%",
                              background:
                                ep <= activeEpochId
                                  ? signal.color
                                  : "rgba(255,255,255,0.1)",
                              opacity: ep === activeEpochId ? 1 : 0.4,
                              transition: "all 0.4s ease",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: "Sora, sans-serif",
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.85)",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      {activeStage?.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "Sora, sans-serif",
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.5)",
                        lineHeight: 1.6,
                      }}
                    >
                      {activeStage?.detail}
                    </div>
                    {/* All stages mini list */}
                    <div
                      className="mt-3 pt-3"
                      style={{
                        borderTop: `1px solid ${signal.glowColor}0.12)`,
                      }}
                    >
                      <div
                        className="font-mono-geist text-[7px] tracking-[0.2em] uppercase mb-2"
                        style={{ color: "rgba(255,255,255,0.2)" }}
                      >
                        ALL STAGES
                      </div>
                      <div className="space-y-1">
                        {signal.stages.map((st, si) => (
                          <div
                            key={st.label}
                            className="flex items-start gap-2"
                          >
                            <div
                              style={{
                                width: "4px",
                                height: "4px",
                                borderRadius: "50%",
                                flexShrink: 0,
                                marginTop: "4px",
                                background:
                                  si + 1 === activeEpochId
                                    ? signal.color
                                    : si + 1 < activeEpochId
                                      ? `${signal.color}66`
                                      : "rgba(255,255,255,0.1)",
                                boxShadow:
                                  si + 1 === activeEpochId
                                    ? `0 0 5px ${signal.color}`
                                    : "none",
                              }}
                            />
                            <span
                              className="font-mono-geist"
                              style={{
                                fontSize: "8px",
                                letterSpacing: "0.04em",
                                color:
                                  si + 1 === activeEpochId
                                    ? "rgba(255,255,255,0.75)"
                                    : "rgba(255,255,255,0.25)",
                                fontWeight:
                                  si + 1 === activeEpochId ? 600 : 400,
                              }}
                            >
                              {st.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Signal-strength progress bar */}
                  <div className="mb-5 relative z-10">
                    <div className="flex justify-between mb-1.5">
                      <span
                        className="font-mono-geist text-[8px] tracking-[0.15em] uppercase"
                        style={{ color: "rgba(255,255,255,0.25)" }}
                      >
                        {signal.metricLabel}
                      </span>
                      <span
                        className="font-mono-geist text-[8px]"
                        style={{ color: signal.color }}
                      >
                        {pct}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: "4px",
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: "2px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, ${signal.glowColor}0.6), ${signal.color})`,
                          borderRadius: "2px",
                          boxShadow: `0 0 8px ${signal.color}`,
                          transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Visualization */}
                  <div className="relative z-10">
                    <div
                      className="font-mono-geist text-[8px] tracking-[0.2em] uppercase mb-3"
                      style={{ color: "rgba(255,255,255,0.2)" }}
                    >
                      {signal.visualType === "chain"
                        ? "PROGRESSION CHAIN"
                        : signal.visualType === "bars"
                          ? "EPOCH SIGNAL BARS"
                          : signal.visualType === "line"
                            ? "CAPABILITY CURVE"
                            : "CONNECTIVITY RINGS"}
                    </div>
                    {signal.visualType === "chain" && (
                      <SignalChainViz
                        signal={signal}
                        activeEpochId={activeEpochId}
                      />
                    )}
                    {signal.visualType === "bars" && (
                      <SignalBarsViz
                        signal={signal}
                        activeEpochId={activeEpochId}
                      />
                    )}
                    {signal.visualType === "line" && (
                      <SignalLineViz
                        signal={signal}
                        activeEpochId={activeEpochId}
                      />
                    )}
                    {signal.visualType === "radar" && (
                      <SignalRadarViz
                        signal={signal}
                        activeEpochId={activeEpochId}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom telemetry bar */}
        <div
          className="mt-10 p-5 rounded-sm"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            opacity: entered ? 1 : 0,
            transition: "opacity 0.8s ease 0.5s",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none dashboard-sweep-line"
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(212,160,23,0.3), transparent)",
              top: "50%",
            }}
            aria-hidden="true"
          />
          <div className="flex flex-wrap items-center justify-between gap-4 relative">
            <div
              className="font-mono-geist text-[9px] tracking-[0.3em] uppercase"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              ◈ CIVILIZATION SIGNALS — EPOCH {activeEpochId} / 6
            </div>
            <div className="flex flex-wrap gap-6">
              {CIVILIZATION_SIGNALS.map((sig) => {
                const val = sig.metricValues[activeEpochId - 1];
                const max = Math.max(...sig.metricValues);
                const pct = Math.round((val / max) * 100);
                return (
                  <div key={sig.id} className="flex items-center gap-2">
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: sig.color,
                        boxShadow: `0 0 5px ${sig.color}`,
                      }}
                    />
                    <span
                      className="font-mono-geist text-[9px]"
                      style={{
                        color: "rgba(255,255,255,0.35)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {sig.title.split(" ")[0].toUpperCase()} {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Main Page Component ───────────────────────────────────────────────────────
export default function EpochsPage({ onBack }: EpochsPageProps) {
  const [hoveredGaia, setHoveredGaia] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null);
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);
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

  // Legacy vars kept for potential future use — now replaced by inline data
  const _gaiaFocusAreas = [
    "Climate modeling and prediction",
    "Sustainable healthcare",
    "Environmental impact assessment",
    "Carbon capture systems",
    "Renewable energy integration",
  ];
  void _gaiaFocusAreas;

  const _pipelineSteps = [
    "Intelligence Platforms",
    "Operating Systems",
    "IoT Networks",
    "Analytics Infrastructure",
    "Sustainability Enterprise Systems",
  ];
  void _pipelineSteps;

  const _researchSignals = [
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
  void _researchSignals;

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
        @keyframes civilSignalPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); box-shadow: 0 0 8px currentColor; }
          50% { opacity: 1; transform: scale(1.18); box-shadow: 0 0 22px currentColor, 0 0 40px currentColor; }
        }
        @keyframes dashboardSweep {
          0% { transform: translateX(-100%); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes signalBarRise {
          from { transform: scaleY(0); opacity: 0; }
          to { transform: scaleY(1); opacity: 1; }
        }
        @keyframes radarRing {
          0% { transform: scale(0.3); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.18; r: 0.12; }
          50% { opacity: 0.7; r: 0.22; }
        }
        @keyframes deepDiveOpen {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes driftRight {
          from { transform: translateX(-40px); opacity: 0; }
          to { transform: translateX(40px); opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes signalChainPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212,160,23,0); }
          50% { box-shadow: 0 0 0 6px rgba(212,160,23,0.2); }
        }
        @keyframes connectFlash {
          0% { stroke-dashoffset: 100; opacity: 0.4; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        .dashboard-sweep-line {
          animation: dashboardSweep 3.5s ease-in-out infinite;
        }
        .signal-bar-rise {
          transform-origin: bottom;
          animation: signalBarRise 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .radar-ring-pulse {
          animation: radarRing 2s ease-out infinite;
        }
        .civ-signal-dot {
          animation: civilSignalPulse 2.5s ease-in-out infinite;
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
          {/* Section header — enhanced responsive + animated */}
          <div
            className="mb-12 epochs-reveal reveal"
            style={{ overflow: "hidden" }}
          >
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{
                color: "rgba(212,160,23,0.7)",
                animation: "signalFadeIn 0.6s ease forwards",
              }}
            >
              ◈ CIVILIZATION EXPLORATION INTERFACE
            </div>
            <h2
              className="font-display font-light text-gradient-hero mb-4"
              style={{
                fontSize: "clamp(2rem, 6vw, 4.5rem)",
                letterSpacing: "0.08em",
                animation: "fadeInUp 0.7s ease 0.1s both",
              }}
            >
              The Architecture of Human Progress
            </h2>
            <p
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: "clamp(13px, 1.5vw, 15px)",
                color: "rgba(255,255,255,0.45)",
                maxWidth: "620px",
                lineHeight: 1.85,
                animation: "fadeInUp 0.7s ease 0.2s both",
              }}
            >
              Six epochs of scientific and technological transformation, each
              one constructing the cognitive, material, and institutional
              substrate for the next. Navigate through time — from the first
              principles of natural philosophy to the emergent systems of
              planetary intelligence.
            </p>
            {/* Animated epoch progress indicators */}
            <div
              className="flex flex-wrap gap-2 mt-6"
              style={{ animation: "fadeInUp 0.7s ease 0.35s both" }}
            >
              {[
                { label: "Foundations", color: "rgba(212,160,23,0.8)" },
                { label: "Industrial", color: "rgba(148,163,184,0.8)" },
                { label: "Electrical", color: "rgba(129,140,248,0.8)" },
                { label: "Computing", color: "rgba(34,211,238,0.8)" },
                { label: "Networked", color: "rgba(74,126,247,0.8)" },
                { label: "Planetary", color: "rgba(52,211,153,0.8)" },
              ].map((ep, i) => (
                <div
                  key={ep.label}
                  className="flex items-center gap-1.5 px-3 py-1.5"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${ep.color.replace("0.8", "0.25")}`,
                    borderRadius: "2px",
                    animation: `fadeInUp 0.5s ease ${0.4 + i * 0.07}s both`,
                  }}
                >
                  <div
                    style={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      background: ep.color,
                      boxShadow: `0 0 5px ${ep.color}`,
                    }}
                  />
                  <span
                    className="font-mono-geist"
                    style={{
                      fontSize: "8px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: ep.color,
                    }}
                  >
                    {ep.label}
                  </span>
                </div>
              ))}
            </div>
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

            {/* Epoch blocks column — responsive right padding */}
            <div
              className="flex-1 min-w-0"
              style={{ paddingRight: "clamp(0px, 18vw, 240px)" }}
            >
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

      {/* ── Stage 3: Interactive Civilization Timeline Engine ─────────────── */}
      <CivilizationTimelineEngine />

      {/* ── Stage 4: Scientific Constellation Map ─────────────────────────── */}
      <ScientificConstellationMap />

      {/* ── Stage 5: Civilization Signals Dashboard ───────────────────────── */}
      <CivilizationSignalDashboard activeEpochId={activeEpochId} />

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

      {/* ── Project GAIA — Full Detail ─────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(52,211,153,0.04) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-7xl mx-auto relative">
          <div className="mb-12 epochs-reveal reveal">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div
                className="font-mono-geist text-[9px] tracking-[0.35em] uppercase px-3 py-1.5"
                style={{
                  background: "rgba(52,211,153,0.08)",
                  border: "1px solid rgba(52,211,153,0.25)",
                  color: "rgba(52,211,153,0.8)",
                  borderRadius: "2px",
                }}
              >
                ◈ ACTIVE RESEARCH INITIATIVE
              </div>
              <div
                className="font-mono-geist text-[9px] tracking-[0.25em] uppercase px-3 py-1.5"
                style={{
                  background: "rgba(212,160,23,0.08)",
                  border: "1px solid rgba(212,160,23,0.25)",
                  color: "rgba(212,160,23,0.8)",
                  borderRadius: "2px",
                }}
              >
                ◆ LAB INVOS · LAB NEIA
              </div>
            </div>
            <h2
              className="font-display font-light text-gradient-hero mb-3"
              style={{
                fontSize: "clamp(2rem, 5vw, 4rem)",
                letterSpacing: "0.08em",
              }}
            >
              PROJECT GAIA
            </h2>
            <p
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: "15px",
                color: "rgba(255,255,255,0.5)",
                maxWidth: "680px",
                lineHeight: 1.8,
              }}
            >
              A long-horizon climate and sustainability research initiative.
              GAIA maps the planetary systems that support civilizational
              continuity — integrating atmospheric science, ocean dynamics,
              biodiversity, and energy systems into a unified research
              framework.
            </p>
          </div>

          {/* Research streams — detailed cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {[
              {
                node: "01",
                title: "Climate Modeling & Prediction",
                desc: "Comprehensive multi-variable atmospheric models incorporating ocean-atmosphere coupling, aerosol feedback loops, and land-use dynamics across 50-year projection horizons.",
                tags: ["GCM", "CFD", "Ensemble Modeling"],
                color: "rgba(52,211,153,0.8)",
                status: "Active",
              },
              {
                node: "02",
                title: "Planetary Boundary Assessment",
                desc: "Quantitative monitoring of the nine planetary boundaries identified by Rockström et al — tracking civilization's position relative to safe operating limits for Earth-system processes.",
                tags: ["Systems Earth", "Biodiversity", "Nitrogen Cycle"],
                color: "rgba(52,211,153,0.8)",
                status: "Active",
              },
              {
                node: "03",
                title: "Sustainable Healthcare Research",
                desc: "Intersection of climate change and human health — analyzing how shifting disease vectors, air quality, and water systems affect healthcare system resilience globally.",
                tags: ["Epidemiology", "One Health", "Climate Medicine"],
                color: "rgba(52,211,153,0.8)",
                status: "In Development",
              },
              {
                node: "04",
                title: "Environmental Impact Assessment",
                desc: "Methodological frameworks for evaluating cumulative and cascading environmental impacts of large-scale technological deployment — from renewables to carbon capture.",
                tags: ["LCA", "EIA", "Systems Analysis"],
                color: "rgba(52,211,153,0.8)",
                status: "Active",
              },
              {
                node: "05",
                title: "Carbon Capture Systems",
                desc: "Technical and economic analysis of carbon dioxide removal pathways — from direct air capture and enhanced weathering to bioenergy with carbon capture and storage.",
                tags: ["CDR", "DAC", "BECCS", "Mineralization"],
                color: "rgba(52,211,153,0.8)",
                status: "Research Phase",
              },
              {
                node: "06",
                title: "Renewable Energy Integration",
                desc: "Grid-scale modeling of variable renewable energy integration — storage systems, demand-response, and the transition away from dispatchable fossil-fuel baseload.",
                tags: ["Grid Modeling", "Storage", "Transition Economics"],
                color: "rgba(52,211,153,0.8)",
                status: "Active",
              },
            ].map((stream, i) => (
              <div
                key={stream.node}
                data-ocid={`epochs.gaia.card.${i + 1}`}
                className="epochs-reveal reveal"
                style={{ transitionDelay: `${i * 0.08}s` }}
                onMouseEnter={() => setHoveredGaia(i)}
                onMouseLeave={() => setHoveredGaia(null)}
              >
                <div
                  className="p-6 rounded-sm h-full transition-all duration-400 relative overflow-hidden"
                  style={{
                    background:
                      hoveredGaia === i
                        ? "rgba(52,211,153,0.08)"
                        : "rgba(52,211,153,0.03)",
                    border:
                      hoveredGaia === i
                        ? "1px solid rgba(52,211,153,0.4)"
                        : "1px solid rgba(52,211,153,0.12)",
                    backdropFilter: "blur(14px)",
                    boxShadow:
                      hoveredGaia === i
                        ? "0 0 28px rgba(52,211,153,0.1), 0 8px 40px rgba(0,0,0,0.4)"
                        : "none",
                    transform: hoveredGaia === i ? "translateY(-4px)" : "none",
                  }}
                >
                  {hoveredGaia === i && (
                    <div
                      className="animate-card-scan absolute left-0 right-0 pointer-events-none"
                      aria-hidden="true"
                      style={{
                        height: "1px",
                        background:
                          "linear-gradient(90deg, transparent, rgba(52,211,153,0.5), transparent)",
                        zIndex: 1,
                      }}
                    />
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full animate-node-pulse"
                        style={{
                          background: stream.color,
                          animationDelay: `${i * 0.25}s`,
                        }}
                      />
                      <div
                        className="font-mono-geist text-[8px] tracking-[0.2em] uppercase"
                        style={{ color: "rgba(52,211,153,0.6)" }}
                      >
                        NODE {stream.node}
                      </div>
                    </div>
                    <span
                      className="font-mono-geist text-[7px] tracking-[0.15em] uppercase px-2 py-0.5"
                      style={{
                        background:
                          stream.status === "Active"
                            ? "rgba(52,211,153,0.12)"
                            : "rgba(212,160,23,0.1)",
                        border: `1px solid ${stream.status === "Active" ? "rgba(52,211,153,0.3)" : "rgba(212,160,23,0.2)"}`,
                        color:
                          stream.status === "Active"
                            ? "rgba(52,211,153,0.8)"
                            : "rgba(212,160,23,0.7)",
                        borderRadius: "2px",
                      }}
                    >
                      {stream.status}
                    </span>
                  </div>
                  <h3
                    className="font-display text-base font-light mb-2"
                    style={{
                      color: "rgba(255,255,255,0.9)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {stream.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "Sora, sans-serif",
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.5)",
                      lineHeight: 1.7,
                    }}
                  >
                    {stream.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {stream.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono-geist text-[7px] tracking-[0.12em] uppercase px-2 py-0.5"
                        style={{
                          background: "rgba(52,211,153,0.06)",
                          border: "1px solid rgba(52,211,153,0.15)",
                          color: "rgba(52,211,153,0.6)",
                          borderRadius: "2px",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* GAIA metrics bar */}
          <div
            className="epochs-reveal reveal p-6 rounded-sm"
            style={{
              background: "rgba(52,211,153,0.03)",
              border: "1px solid rgba(52,211,153,0.12)",
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { val: "6", label: "Research Streams", sub: "Active" },
                { val: "2", label: "Laboratories", sub: "INVOS + NEIA" },
                {
                  val: "50yr",
                  label: "Projection Horizon",
                  sub: "Climate Modeling",
                },
                {
                  val: "9",
                  label: "Planetary Boundaries",
                  sub: "Being Monitored",
                },
              ].map((m) => (
                <div key={m.label} className="text-center">
                  <div
                    className="font-mono-geist text-2xl font-bold mb-1"
                    style={{ color: "rgba(52,211,153,0.9)" }}
                  >
                    {m.val}
                  </div>
                  <div
                    style={{
                      fontFamily: "Sora, sans-serif",
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    {m.label}
                  </div>
                  <div
                    className="font-mono-geist text-[8px] tracking-[0.15em] uppercase mt-0.5"
                    style={{ color: "rgba(255,255,255,0.2)" }}
                  >
                    {m.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Active Labs — Full Detail ─────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Ambient background */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(180deg, rgba(4,5,14,0) 0%, rgba(6,8,24,0.7) 50%, rgba(4,5,14,0) 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(74,126,247,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(74,126,247,0.025) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="max-w-7xl mx-auto relative">
          <div className="mb-14 epochs-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ RESEARCH LABORATORIES — STEMONEF EPOCHS
            </div>
            <h2
              className="font-display font-light text-gradient-hero mb-4"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                letterSpacing: "0.08em",
              }}
            >
              Active Labs
            </h2>
            <p
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: "14px",
                color: "rgba(255,255,255,0.4)",
                maxWidth: "600px",
                lineHeight: 1.8,
              }}
            >
              Two purpose-built research environments operating in parallel —
              one focused on fundamental scientific inquiry, the other on
              translating breakthroughs into deployable solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LAB INVOS — Research Laboratory */}
            <div
              className="epochs-reveal reveal"
              style={{ transitionDelay: "0.1s" }}
            >
              <div
                className="h-full rounded-sm overflow-hidden relative"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(74,126,247,0.2)",
                  backdropFilter: "blur(16px)",
                }}
              >
                {/* Top accent bar */}
                <div
                  style={{
                    height: "3px",
                    background:
                      "linear-gradient(90deg, rgba(74,126,247,0.8), rgba(74,126,247,0.2), transparent)",
                  }}
                />
                {/* Animated scan line */}
                <div
                  className="animate-card-scan absolute left-0 right-0 pointer-events-none"
                  aria-hidden="true"
                  style={{
                    height: "1px",
                    background:
                      "linear-gradient(90deg, transparent, rgba(74,126,247,0.4), transparent)",
                    zIndex: 1,
                  }}
                />
                <div className="p-8">
                  {/* Lab header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div
                        className="font-mono-geist text-[9px] tracking-[0.35em] uppercase mb-1"
                        style={{ color: "rgba(74,126,247,0.7)" }}
                      >
                        LABORATORY I — RESEARCH
                      </div>
                      <h3
                        className="font-display text-3xl font-light"
                        style={{
                          letterSpacing: "0.15em",
                          color: "rgba(255,255,255,0.95)",
                        }}
                      >
                        LAB INVOS
                      </h3>
                      <p
                        className="font-mono-geist text-[10px] mt-1"
                        style={{
                          color: "rgba(212,160,23,0.7)",
                          letterSpacing: "0.12em",
                        }}
                      >
                        Investigative &amp; Observational Science
                      </p>
                    </div>
                    {/* Animated status indicator */}
                    <div className="flex flex-col items-end gap-2">
                      <div
                        className="flex items-center gap-2 px-3 py-1.5"
                        style={{
                          background: "rgba(74,126,247,0.08)",
                          border: "1px solid rgba(74,126,247,0.25)",
                          borderRadius: "2px",
                        }}
                      >
                        <div
                          className="civ-signal-dot"
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "#4a7ef7",
                            color: "#4a7ef7",
                          }}
                        />
                        <span
                          className="font-mono-geist text-[8px] tracking-[0.2em] uppercase"
                          style={{ color: "rgba(74,126,247,0.8)" }}
                        >
                          ACTIVE
                        </span>
                      </div>
                      <div
                        className="font-mono-geist text-[8px]"
                        style={{
                          color: "rgba(255,255,255,0.2)",
                          letterSpacing: "0.1em",
                        }}
                      >
                        EST. 2024
                      </div>
                    </div>
                  </div>

                  {/* Mission statement */}
                  <div
                    className="mb-6 p-4"
                    style={{
                      background: "rgba(74,126,247,0.05)",
                      border: "1px solid rgba(74,126,247,0.12)",
                      borderLeft: "3px solid rgba(74,126,247,0.6)",
                      borderRadius: "2px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Sora, sans-serif",
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.65)",
                        lineHeight: 1.75,
                      }}
                    >
                      LAB INVOS conducts fundamental scientific research across
                      climate systems, environmental science, and sustainability
                      frameworks. Its mission is to build the epistemic
                      foundation that practical interventions require —
                      rigorous, reproducible, and ethically reviewed.
                    </p>
                  </div>

                  {/* Research streams */}
                  <div className="mb-6">
                    <div
                      className="font-mono-geist text-[8px] tracking-[0.25em] uppercase mb-3"
                      style={{ color: "rgba(255,255,255,0.25)" }}
                    >
                      ◈ ACTIVE RESEARCH STREAMS
                    </div>
                    <div className="space-y-3">
                      {[
                        {
                          area: "Fundamental Climate Science",
                          desc: "Multi-variable atmospheric modeling, ocean-atmosphere coupling dynamics, and climate sensitivity analysis.",
                          pct: 72,
                        },
                        {
                          area: "Environmental Monitoring Systems",
                          desc: "Distributed sensor network architectures for real-time environmental telemetry at continental scale.",
                          pct: 58,
                        },
                        {
                          area: "Sustainability Theory",
                          desc: "Formal frameworks for evaluating long-term sustainability of technological and social systems.",
                          pct: 45,
                        },
                        {
                          area: "Data Analysis Methodologies",
                          desc: "Statistical and computational methods for extracting signals from complex environmental datasets.",
                          pct: 80,
                        },
                        {
                          area: "Interdisciplinary Climate Research",
                          desc: "Bridging climatology, economics, political science, and systems biology to model coupled human-earth systems.",
                          pct: 62,
                        },
                      ].map((stream) => (
                        <div key={stream.area}>
                          <div className="flex items-start justify-between gap-3 mb-1.5">
                            <div className="flex items-start gap-2.5 flex-1">
                              <div
                                style={{
                                  width: "4px",
                                  height: "4px",
                                  borderRadius: "50%",
                                  background: "rgba(74,126,247,0.8)",
                                  flexShrink: 0,
                                  marginTop: "5px",
                                }}
                              />
                              <div>
                                <div
                                  style={{
                                    fontFamily: "Sora, sans-serif",
                                    fontSize: "12px",
                                    color: "rgba(255,255,255,0.8)",
                                    fontWeight: 500,
                                  }}
                                >
                                  {stream.area}
                                </div>
                                <div
                                  style={{
                                    fontFamily: "Sora, sans-serif",
                                    fontSize: "11px",
                                    color: "rgba(255,255,255,0.35)",
                                    lineHeight: 1.5,
                                  }}
                                >
                                  {stream.desc}
                                </div>
                              </div>
                            </div>
                            <span
                              className="font-mono-geist text-[9px] flex-shrink-0"
                              style={{ color: "rgba(74,126,247,0.7)" }}
                            >
                              {stream.pct}%
                            </span>
                          </div>
                          <div
                            style={{
                              height: "2px",
                              background: "rgba(255,255,255,0.05)",
                              borderRadius: "1px",
                              overflow: "hidden",
                              marginLeft: "14px",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${stream.pct}%`,
                                background:
                                  "linear-gradient(90deg, rgba(74,126,247,0.4), rgba(74,126,247,0.8))",
                                transition: "width 1.2s ease",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Output metrics */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Active Studies", value: "4" },
                      { label: "Data Nodes", value: "12+" },
                      { label: "Domains", value: "5" },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="text-center p-3"
                        style={{
                          background: "rgba(74,126,247,0.05)",
                          border: "1px solid rgba(74,126,247,0.12)",
                          borderRadius: "2px",
                        }}
                      >
                        <div
                          className="font-mono-geist text-lg font-bold"
                          style={{ color: "#4a7ef7" }}
                        >
                          {m.value}
                        </div>
                        <div
                          className="font-mono-geist text-[8px] tracking-[0.15em] uppercase mt-1"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                        >
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* LAB NEIA — Development Laboratory */}
            <div
              className="epochs-reveal reveal"
              style={{ transitionDelay: "0.2s" }}
            >
              <div
                className="h-full rounded-sm overflow-hidden relative"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(167,139,250,0.2)",
                  backdropFilter: "blur(16px)",
                }}
              >
                <div
                  style={{
                    height: "3px",
                    background:
                      "linear-gradient(90deg, rgba(167,139,250,0.8), rgba(167,139,250,0.2), transparent)",
                  }}
                />
                <div
                  className="animate-card-scan absolute left-0 right-0 pointer-events-none"
                  aria-hidden="true"
                  style={{
                    height: "1px",
                    background:
                      "linear-gradient(90deg, transparent, rgba(167,139,250,0.4), transparent)",
                    zIndex: 1,
                  }}
                />
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div
                        className="font-mono-geist text-[9px] tracking-[0.35em] uppercase mb-1"
                        style={{ color: "rgba(167,139,250,0.7)" }}
                      >
                        LABORATORY II — DEVELOPMENT
                      </div>
                      <h3
                        className="font-display text-3xl font-light"
                        style={{
                          letterSpacing: "0.15em",
                          color: "rgba(255,255,255,0.95)",
                        }}
                      >
                        LAB NEIA
                      </h3>
                      <p
                        className="font-mono-geist text-[10px] mt-1"
                        style={{
                          color: "rgba(212,160,23,0.7)",
                          letterSpacing: "0.12em",
                        }}
                      >
                        New Energy &amp; Intervention Architecture
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div
                        className="flex items-center gap-2 px-3 py-1.5"
                        style={{
                          background: "rgba(167,139,250,0.08)",
                          border: "1px solid rgba(167,139,250,0.25)",
                          borderRadius: "2px",
                        }}
                      >
                        <div
                          className="civ-signal-dot"
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "#a78bfa",
                            color: "#a78bfa",
                          }}
                        />
                        <span
                          className="font-mono-geist text-[8px] tracking-[0.2em] uppercase"
                          style={{ color: "rgba(167,139,250,0.8)" }}
                        >
                          ACTIVE
                        </span>
                      </div>
                      <div
                        className="font-mono-geist text-[8px]"
                        style={{
                          color: "rgba(255,255,255,0.2)",
                          letterSpacing: "0.1em",
                        }}
                      >
                        EST. 2024
                      </div>
                    </div>
                  </div>

                  <div
                    className="mb-6 p-4"
                    style={{
                      background: "rgba(167,139,250,0.05)",
                      border: "1px solid rgba(167,139,250,0.12)",
                      borderLeft: "3px solid rgba(167,139,250,0.6)",
                      borderRadius: "2px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Sora, sans-serif",
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.65)",
                        lineHeight: 1.75,
                      }}
                    >
                      LAB NEIA operates at the boundary between research and
                      deployment. It takes validated scientific outputs and
                      translates them into testable prototypes, field-ready
                      interventions, and scalable sustainability solutions —
                      closing the gap between discovery and impact.
                    </p>
                  </div>

                  <div className="mb-6">
                    <div
                      className="font-mono-geist text-[8px] tracking-[0.25em] uppercase mb-3"
                      style={{ color: "rgba(255,255,255,0.25)" }}
                    >
                      ◈ ACTIVE DEVELOPMENT STREAMS
                    </div>
                    <div className="space-y-3">
                      {[
                        {
                          area: "Sustainable Technology Prototyping",
                          desc: "Rapid iteration of low-carbon infrastructure prototypes validated against INVOS research baselines.",
                          pct: 65,
                        },
                        {
                          area: "Climate Solution Testing",
                          desc: "Field-scale testing of carbon capture, soil restoration, and renewable energy integration approaches.",
                          pct: 55,
                        },
                        {
                          area: "Environmental Intervention Scaling",
                          desc: "Frameworks for replicating successful local interventions across regional and national contexts.",
                          pct: 48,
                        },
                        {
                          area: "Implementation Partnerships",
                          desc: "Co-development agreements with institutional partners for joint deployment of validated solutions.",
                          pct: 38,
                        },
                      ].map((stream) => (
                        <div key={stream.area}>
                          <div className="flex items-start justify-between gap-3 mb-1.5">
                            <div className="flex items-start gap-2.5 flex-1">
                              <div
                                style={{
                                  width: "4px",
                                  height: "4px",
                                  borderRadius: "50%",
                                  background: "rgba(167,139,250,0.8)",
                                  flexShrink: 0,
                                  marginTop: "5px",
                                }}
                              />
                              <div>
                                <div
                                  style={{
                                    fontFamily: "Sora, sans-serif",
                                    fontSize: "12px",
                                    color: "rgba(255,255,255,0.8)",
                                    fontWeight: 500,
                                  }}
                                >
                                  {stream.area}
                                </div>
                                <div
                                  style={{
                                    fontFamily: "Sora, sans-serif",
                                    fontSize: "11px",
                                    color: "rgba(255,255,255,0.35)",
                                    lineHeight: 1.5,
                                  }}
                                >
                                  {stream.desc}
                                </div>
                              </div>
                            </div>
                            <span
                              className="font-mono-geist text-[9px] flex-shrink-0"
                              style={{ color: "rgba(167,139,250,0.7)" }}
                            >
                              {stream.pct}%
                            </span>
                          </div>
                          <div
                            style={{
                              height: "2px",
                              background: "rgba(255,255,255,0.05)",
                              borderRadius: "1px",
                              overflow: "hidden",
                              marginLeft: "14px",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${stream.pct}%`,
                                background:
                                  "linear-gradient(90deg, rgba(167,139,250,0.4), rgba(167,139,250,0.8))",
                                transition: "width 1.2s ease",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Prototypes", value: "3+" },
                      { label: "Field Sites", value: "2" },
                      { label: "Partners", value: "4" },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="text-center p-3"
                        style={{
                          background: "rgba(167,139,250,0.05)",
                          border: "1px solid rgba(167,139,250,0.12)",
                          borderRadius: "2px",
                        }}
                      >
                        <div
                          className="font-mono-geist text-lg font-bold"
                          style={{ color: "#a78bfa" }}
                        >
                          {m.value}
                        </div>
                        <div
                          className="font-mono-geist text-[8px] tracking-[0.15em] uppercase mt-1"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                        >
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECT EIOS — Full System Architecture ───────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 30% 50%, rgba(212,160,23,0.04) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-7xl mx-auto relative">
          <div className="mb-12 epochs-reveal reveal">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div
                className="font-mono-geist text-[9px] tracking-[0.35em] uppercase px-3 py-1.5"
                style={{
                  background: "rgba(212,160,23,0.08)",
                  border: "1px solid rgba(212,160,23,0.25)",
                  color: "rgba(212,160,23,0.8)",
                  borderRadius: "2px",
                }}
              >
                ◆ DEEP TECHNOLOGY INITIATIVE
              </div>
              <div
                className="font-mono-geist text-[9px] tracking-[0.25em] uppercase px-3 py-1.5"
                style={{
                  background: "rgba(34,211,238,0.08)",
                  border: "1px solid rgba(34,211,238,0.25)",
                  color: "rgba(34,211,238,0.8)",
                  borderRadius: "2px",
                }}
              >
                ◈ LAB NEIA — INTELLIGENCE SYSTEMS
              </div>
            </div>
            <h2
              className="font-display font-light text-gradient-hero mb-3"
              style={{
                fontSize: "clamp(2rem, 5vw, 4rem)",
                letterSpacing: "0.08em",
              }}
            >
              PROJECT EIOS
            </h2>
            <p
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: "15px",
                color: "rgba(255,255,255,0.5)",
                maxWidth: "680px",
                lineHeight: 1.8,
              }}
            >
              Environmental Intelligence &amp; Operating Systems. EIOS designs
              the technological nervous system for planetary monitoring —
              combining IoT sensor networks, edge computing, AI analytics, and
              enterprise sustainability platforms into a unified intelligence
              architecture.
            </p>
          </div>

          {/* System Architecture — 5-layer pipeline */}
          <div
            className="mb-10 epochs-reveal reveal"
            style={{ transitionDelay: "0.1s" }}
          >
            <div
              className="font-mono-geist text-[9px] tracking-[0.3em] uppercase mb-6"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              ◈ SYSTEM ARCHITECTURE — 5-LAYER STACK
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                {
                  layer: "L1",
                  title: "Intelligence Platforms",
                  desc: "Unified data intelligence platforms aggregating signals from distributed environmental networks. Semantic search, pattern recognition, and automated reporting.",
                  color: "#d4a017",
                  icon: "◈",
                  tech: ["ML/AI", "NLP", "Analytics"],
                },
                {
                  layer: "L2",
                  title: "Operating Systems",
                  desc: "Embedded OS frameworks purpose-built for edge-compute environmental nodes. Low-power, resilient, and capable of offline-first operation in remote field conditions.",
                  color: "#22d3ee",
                  icon: "◆",
                  tech: ["Embedded", "RTOS", "Edge"],
                },
                {
                  layer: "L3",
                  title: "IoT Networks",
                  desc: "Mesh sensor architectures using LoRaWAN, Zigbee, and LTE-M protocols. Sub-second telemetry from thousands of field stations with satellite backup.",
                  color: "#4a7ef7",
                  icon: "◇",
                  tech: ["LoRaWAN", "Mesh", "5G"],
                },
                {
                  layer: "L4",
                  title: "Analytics Infrastructure",
                  desc: "Time-series database systems, real-time stream processing, and visualization pipelines capable of handling petabyte-scale environmental datasets.",
                  color: "#a78bfa",
                  icon: "▣",
                  tech: ["TimeSeries", "Streaming", "BI"],
                },
                {
                  layer: "L5",
                  title: "Sustainability Enterprise Systems",
                  desc: "Enterprise-grade platforms enabling organizations to measure, report, and reduce their environmental footprint aligned with emerging regulatory frameworks.",
                  color: "#34d399",
                  icon: "◉",
                  tech: ["ESG", "Reporting", "Carbon"],
                },
              ].map((layer, i) => (
                <div
                  key={layer.layer}
                  className="relative"
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <div
                    className="p-5 rounded-sm h-full relative overflow-hidden"
                    style={{
                      background: `${layer.color}08`,
                      border: `1px solid ${layer.color}25`,
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <div
                      className="animate-card-scan absolute left-0 right-0 pointer-events-none"
                      aria-hidden="true"
                      style={{
                        height: "1px",
                        background: `linear-gradient(90deg, transparent, ${layer.color}44, transparent)`,
                        animationDelay: `${i * 0.7}s`,
                      }}
                    />
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="font-mono-geist text-[18px]"
                        style={{ color: layer.color }}
                      >
                        {layer.icon}
                      </div>
                      <div
                        className="font-mono-geist text-[8px] tracking-[0.2em] uppercase"
                        style={{ color: `${layer.color}88` }}
                      >
                        {layer.layer}
                      </div>
                    </div>
                    <h4
                      className="font-display text-sm font-light mb-2"
                      style={{
                        color: "rgba(255,255,255,0.9)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {layer.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: "Sora, sans-serif",
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.45)",
                        lineHeight: 1.65,
                      }}
                    >
                      {layer.desc}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {layer.tech.map((t) => (
                        <span
                          key={t}
                          className="font-mono-geist text-[7px] tracking-[0.1em] uppercase px-1.5 py-0.5"
                          style={{
                            background: `${layer.color}12`,
                            border: `1px solid ${layer.color}25`,
                            color: `${layer.color}AA`,
                            borderRadius: "2px",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    {/* Layer connector arrow (not on last) */}
                    {i < 4 && (
                      <div
                        className="hidden md:block absolute -right-1.5 top-1/2 -translate-y-1/2 z-10 font-mono-geist text-[10px]"
                        style={{ color: "rgba(255,255,255,0.2)" }}
                      >
                        →
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EIOS status metrics */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 epochs-reveal reveal"
            style={{ transitionDelay: "0.2s" }}
          >
            {[
              { val: "5", label: "Architecture Layers", color: "#d4a017" },
              { val: "IoT+AI", label: "Core Technology", color: "#22d3ee" },
              { val: "∞", label: "Sensor Scalability", color: "#4a7ef7" },
              { val: "CDev", label: "Development Phase", color: "#34d399" },
            ].map((m) => (
              <div
                key={m.label}
                className="p-4 rounded-sm text-center"
                style={{
                  background: `${m.color}06`,
                  border: `1px solid ${m.color}18`,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  className="font-mono-geist text-2xl font-bold mb-1"
                  style={{ color: m.color }}
                >
                  {m.val}
                </div>
                <div
                  className="font-mono-geist text-[8px] tracking-[0.15em] uppercase"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECT STEMESA — Ethical AI Framework ────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 70% 50%, rgba(167,139,250,0.04) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-7xl mx-auto relative">
          <div className="mb-12 epochs-reveal reveal">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div
                className="font-mono-geist text-[9px] tracking-[0.35em] uppercase px-3 py-1.5"
                style={{
                  background: "rgba(167,139,250,0.08)",
                  border: "1px solid rgba(167,139,250,0.25)",
                  color: "rgba(167,139,250,0.8)",
                  borderRadius: "2px",
                }}
              >
                ◈ ETHICAL AI INITIATIVE
              </div>
              <div
                className="font-mono-geist text-[9px] tracking-[0.25em] uppercase px-3 py-1.5"
                style={{
                  background: "rgba(212,160,23,0.08)",
                  border: "1px solid rgba(212,160,23,0.25)",
                  color: "rgba(212,160,23,0.8)",
                  borderRadius: "2px",
                }}
              >
                ◆ CONCEPTUAL DEVELOPMENT STAGE
              </div>
            </div>
            <h2
              className="font-display font-light text-gradient-hero mb-3"
              style={{
                fontSize: "clamp(2rem, 5vw, 4rem)",
                letterSpacing: "0.08em",
              }}
            >
              PROJECT STEMESA
            </h2>
            <p
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: "15px",
                color: "rgba(255,255,255,0.5)",
                maxWidth: "700px",
                lineHeight: 1.8,
              }}
            >
              Systems, Technology, Ethics, Medicine, Education &amp; Societal
              Advancement. STEMESA builds ethical frameworks for AI systems
              operating in high-stakes domains — healthcare, education, and
              social decision-making — ensuring that artificial intelligence
              amplifies human capability without reproducing systemic inequity.
            </p>
          </div>

          {/* 6 research domains — detailed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {[
              {
                id: "01",
                title: "Brain Research & Neural Science",
                desc: "Computational models of cognition, neural correlates of decision-making, and the neuroscience of learning — informing more human-aligned AI architectures.",
                tags: ["Neuroscience", "BCI", "Cognitive AI"],
                color: "#a78bfa",
              },
              {
                id: "02",
                title: "Cognitive Modeling",
                desc: "Formal models of human reasoning, memory consolidation, attention, and belief formation — the substrate for AI systems that genuinely understand human context.",
                tags: ["Cognitive Sci", "Mental Models", "ACT-R"],
                color: "#a78bfa",
              },
              {
                id: "03",
                title: "Human-AI Interaction",
                desc: "Research into trust, transparency, and appropriate reliance in human-AI collaboration — designing interactions that preserve human agency and informed consent.",
                tags: ["HCI", "Trust", "Explainability"],
                color: "#a78bfa",
              },
              {
                id: "04",
                title: "Healthcare AI Systems",
                desc: "Audit frameworks for clinical AI — covering training data provenance, demographic representation gaps, deployment-context shift, and failure mode analysis in diagnostic systems.",
                tags: ["Clinical AI", "Safety", "Auditing"],
                color: "#a78bfa",
              },
              {
                id: "05",
                title: "Bias Mitigation Frameworks",
                desc: "Systematic methods for identifying, measuring, and reducing algorithmic bias across the data pipeline — from collection and labeling to training, evaluation, and deployment.",
                tags: ["Fairness", "Debiasing", "Audit"],
                color: "#a78bfa",
              },
              {
                id: "06",
                title: "Explainable AI Frameworks",
                desc: "Mechanistic interpretability methods enabling non-technical stakeholders to understand AI decisions — critical for regulatory compliance and meaningful human oversight.",
                tags: ["XAI", "SHAP", "Interpretability"],
                color: "#a78bfa",
              },
            ].map((domain, i) => (
              <div
                key={domain.id}
                className="epochs-reveal reveal"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div
                  className="p-6 rounded-sm h-full relative overflow-hidden transition-all duration-300"
                  style={{
                    background: "rgba(167,139,250,0.04)",
                    border: "1px solid rgba(167,139,250,0.15)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div
                    className="animate-card-scan absolute left-0 right-0 pointer-events-none"
                    aria-hidden="true"
                    style={{
                      height: "1px",
                      background:
                        "linear-gradient(90deg, transparent, rgba(167,139,250,0.35), transparent)",
                      animationDelay: `${i * 0.5}s`,
                    }}
                  />
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="font-mono-geist text-[8px] tracking-[0.2em] uppercase"
                      style={{ color: "rgba(167,139,250,0.6)" }}
                    >
                      DOMAIN {domain.id}
                    </div>
                    <div
                      className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
                      style={{ background: "#a78bfa" }}
                    />
                  </div>
                  <h4
                    className="font-display text-base font-light mb-2"
                    style={{
                      color: "rgba(255,255,255,0.9)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {domain.title}
                  </h4>
                  <p
                    style={{
                      fontFamily: "Sora, sans-serif",
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.45)",
                      lineHeight: 1.7,
                    }}
                  >
                    {domain.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {domain.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono-geist text-[7px] tracking-[0.12em] uppercase px-2 py-0.5"
                        style={{
                          background: "rgba(167,139,250,0.08)",
                          border: "1px solid rgba(167,139,250,0.2)",
                          color: "rgba(167,139,250,0.65)",
                          borderRadius: "2px",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* STEMESA principles strip */}
          <div
            className="epochs-reveal reveal p-6 rounded-sm"
            style={{
              background: "rgba(167,139,250,0.03)",
              border: "1px solid rgba(167,139,250,0.12)",
              borderLeft: "3px solid rgba(167,139,250,0.5)",
            }}
          >
            <div
              className="font-mono-geist text-[9px] tracking-[0.3em] uppercase mb-4"
              style={{ color: "rgba(167,139,250,0.6)" }}
            >
              ◈ CORE ETHICAL PRINCIPLES
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  p: "Human Primacy",
                  d: "AI systems must augment, not replace, human agency in high-stakes decisions.",
                },
                {
                  p: "Transparent Reasoning",
                  d: "All AI decisions affecting human welfare must be explainable to those affected.",
                },
                {
                  p: "Equitable Outcomes",
                  d: "Systems must demonstrate equivalent performance across all demographic groups.",
                },
                {
                  p: "Reversible Deployment",
                  d: "Every AI system must have a defined mechanism for human override and rollback.",
                },
              ].map((pr) => (
                <div key={pr.p}>
                  <div
                    style={{
                      fontFamily: "Sora, sans-serif",
                      fontSize: "12px",
                      color: "rgba(167,139,250,0.9)",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    {pr.p}
                  </div>
                  <div
                    style={{
                      fontFamily: "Sora, sans-serif",
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.4)",
                      lineHeight: 1.6,
                    }}
                  >
                    {pr.d}
                  </div>
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
      <section
        className="py-24 px-6 relative overflow-hidden"
        id="research-network"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgba(74,126,247,0.04) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-7xl mx-auto relative">
          <div className="mb-12 epochs-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◈ INTERACTIVE KNOWLEDGE MAP
            </div>
            <h2
              className="font-display font-light text-gradient-hero mb-3"
              style={{
                fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
                letterSpacing: "0.08em",
              }}
            >
              Research Domain Network
            </h2>
            <p
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: "14px",
                color: "rgba(255,255,255,0.4)",
                maxWidth: "560px",
                lineHeight: 1.8,
              }}
            >
              Five interconnected research domains forming the knowledge
              substrate of the EPOCHS program. Each domain is a node; each
              connection is a live research dependency. Click a domain node to
              filter the Research Library.
            </p>
          </div>

          {/* Canvas + domain info side by side on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div
              className="lg:col-span-2 glass-strong rounded-sm epochs-reveal reveal overflow-hidden"
              style={{
                border: "1px solid rgba(74,126,247,0.15)",
                transitionDelay: "0.1s",
              }}
            >
              <DomainNetworkCanvas
                activeFilter={activeFilter}
                onNodeClick={handleNodeClick}
              />
            </div>
            {/* Domain info panel */}
            <div
              className="space-y-3 epochs-reveal reveal"
              style={{ transitionDelay: "0.2s" }}
            >
              {[
                {
                  label: "Climate",
                  color: "#4a7ef7",
                  desc: "Atmospheric modeling, ocean systems, planetary boundaries, climate risk.",
                },
                {
                  label: "Deep Technology",
                  color: "#d4a017",
                  desc: "IoT, embedded systems, edge intelligence, sensor networks.",
                },
                {
                  label: "Ethical AI",
                  color: "#a78bfa",
                  desc: "Bias auditing, fairness frameworks, explainability, human-AI collaboration.",
                },
                {
                  label: "Environmental Intelligence",
                  color: "#22d3b0",
                  desc: "Ecosystem monitoring, biodiversity data, environmental impact assessment.",
                },
                {
                  label: "Medical Systems",
                  color: "#f87171",
                  desc: "Healthcare AI, clinical decision support, medical data ethics.",
                },
              ].map((dom) => (
                <button
                  type="button"
                  key={dom.label}
                  className="p-4 rounded-sm cursor-pointer transition-all duration-250 text-left w-full"
                  style={{
                    background:
                      activeFilter === dom.label
                        ? `${dom.color}12`
                        : "rgba(255,255,255,0.025)",
                    border: `1px solid ${activeFilter === dom.label ? `${dom.color}44` : "rgba(255,255,255,0.07)"}`,
                    backdropFilter: "blur(10px)",
                  }}
                  onClick={() =>
                    handleNodeClick(
                      activeFilter === dom.label ? null : dom.label,
                    )
                  }
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: dom.color,
                        boxShadow: `0 0 6px ${dom.color}`,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      className="font-mono-geist text-[10px] tracking-[0.15em] uppercase"
                      style={{
                        color:
                          activeFilter === dom.label
                            ? dom.color
                            : "rgba(255,255,255,0.65)",
                      }}
                    >
                      {dom.label}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "Sora, sans-serif",
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.35)",
                      lineHeight: 1.55,
                    }}
                  >
                    {dom.desc}
                  </p>
                </button>
              ))}
            </div>
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

      {/* ── B. Research Signals — Detailed Telemetry ────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(74,126,247,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(74,126,247,0.025) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="max-w-7xl mx-auto relative">
          <div className="mb-12 epochs-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ ACTIVE SIGNALS — LIVE RESEARCH TELEMETRY
            </div>
            <h2
              className="font-display font-light text-gradient-hero mb-3"
              style={{
                fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
                letterSpacing: "0.08em",
              }}
            >
              Research Signals
            </h2>
            <p
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: "14px",
                color: "rgba(255,255,255,0.4)",
                maxWidth: "560px",
                lineHeight: 1.8,
              }}
            >
              Active research fronts across EPOCHS domains. Each signal
              represents a live inquiry — a convergence of data, analysis, and
              emerging insight that will eventually become publishable output.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: "Climate Risk Modeling",
                domain: "Climate",
                source: "LAB INVOS",
                insight:
                  "Emerging nonlinear feedback loops in boreal permafrost systems are being incorporated into next-generation climate sensitivity estimates.",
                strength: 4,
                trend: "↑",
                pulse: "#4a7ef7",
                updated: "Active",
                tags: ["GCM", "Permafrost", "Feedback"],
              },
              {
                title: "Ocean System Monitoring",
                domain: "Environmental",
                source: "PROJECT GAIA",
                insight:
                  "Novel multi-sensor buoy configurations are achieving 40% improvement in deep-ocean heat flux measurement resolution.",
                strength: 3,
                trend: "↑",
                pulse: "#22d3b0",
                updated: "Active",
                tags: ["Oceanography", "Sensors", "Heat Flux"],
              },
              {
                title: "Neural Decision Mapping",
                domain: "Ethical AI",
                source: "PROJECT STEMESA",
                insight:
                  "Preliminary computational models show how cognitive bias patterns in clinical staff can be amplified — or mitigated — by decision-support AI interface design.",
                strength: 3,
                trend: "→",
                pulse: "#a78bfa",
                updated: "In Progress",
                tags: ["Bias", "HCI", "Clinical"],
              },
              {
                title: "Environmental Data Synthesis",
                domain: "Environmental Intelligence",
                source: "LAB NEIA",
                insight:
                  "Cross-domain synthesis of satellite, airborne, and ground sensor data is enabling sub-hectare land-use classification at continental scale.",
                strength: 4,
                trend: "↑",
                pulse: "#22d3b0",
                updated: "Active",
                tags: ["Remote Sensing", "Fusion", "Land Use"],
              },
              {
                title: "AI Governance Landscape",
                domain: "Ethical AI",
                source: "PROJECT STEMESA",
                insight:
                  "Regulatory frameworks across 40 jurisdictions are being mapped to identify convergence patterns for a proposed universal AI ethics minimum standard.",
                strength: 5,
                trend: "↑",
                pulse: "#a78bfa",
                updated: "Active",
                tags: ["Regulation", "Policy", "Governance"],
              },
              {
                title: "Carbon Capture Feasibility",
                domain: "Climate",
                source: "PROJECT GAIA",
                insight:
                  "Techno-economic models suggest enhanced rock weathering on agricultural land could remove 2–4 GtCO₂/yr at cost-competitive prices by 2040.",
                strength: 3,
                trend: "↑",
                pulse: "#4a7ef7",
                updated: "Preliminary",
                tags: ["CDR", "Agriculture", "Economics"],
              },
              {
                title: "IoT Sensor Architecture",
                domain: "Deep Technology",
                source: "PROJECT EIOS",
                insight:
                  "Prototype mesh networks using LoRaWAN achieve 99.2% uptime in remote montane environments — exceeding reliability benchmarks for commercial deployments.",
                strength: 4,
                trend: "↑",
                pulse: "#d4a017",
                updated: "Field Testing",
                tags: ["IoT", "LoRaWAN", "Reliability"],
              },
              {
                title: "Medical AI Bias Audit",
                domain: "Medical Systems",
                source: "PROJECT STEMESA",
                insight:
                  "Systematic audit of 12 commercially deployed diagnostic AI systems finds demographic performance gaps of 8–23% across ethnicity and gender subgroups.",
                strength: 5,
                trend: "↑",
                pulse: "#f87171",
                updated: "Peer Review",
                tags: ["Healthcare", "Fairness", "Audit"],
              },
            ].map((sig, i) => (
              <div
                key={sig.title}
                data-ocid={`epochs.signal.card.${i + 1}`}
                className="epochs-reveal reveal"
                style={{ transitionDelay: `${i * 0.07}s` }}
              >
                <div
                  className="p-6 rounded-sm h-full relative overflow-hidden transition-all duration-300 group"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {/* Animated scan line */}
                  <div
                    className="animate-card-scan absolute left-0 right-0 pointer-events-none z-10"
                    aria-hidden="true"
                    style={{
                      height: "1px",
                      background: `linear-gradient(90deg, transparent, ${sig.pulse}55, transparent)`,
                      animationDelay: `${i * 1.1}s`,
                    }}
                  />
                  {/* Top color accent */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      background: `linear-gradient(90deg, ${sig.pulse}88, ${sig.pulse}22, transparent)`,
                    }}
                  />

                  {/* Domain + source */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full animate-pulse-glow"
                        style={{ background: sig.pulse }}
                      />
                      <span
                        className="font-mono-geist text-[8px] tracking-[0.2em] uppercase"
                        style={{ color: `${sig.pulse}99` }}
                      >
                        {sig.domain}
                      </span>
                    </div>
                    <span
                      className="font-mono-geist text-[7px] tracking-[0.15em] uppercase px-2 py-0.5"
                      style={{
                        background: `${sig.pulse}12`,
                        border: `1px solid ${sig.pulse}25`,
                        color: `${sig.pulse}88`,
                        borderRadius: "2px",
                      }}
                    >
                      {sig.updated}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="font-display text-base font-light mb-1.5"
                    style={{
                      color: "rgba(255,255,255,0.88)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {sig.title}
                  </h3>

                  {/* Source */}
                  <div
                    className="font-mono-geist text-[8px] tracking-[0.15em] uppercase mb-3"
                    style={{ color: "rgba(255,255,255,0.2)" }}
                  >
                    ◆ {sig.source}
                  </div>

                  {/* Insight text */}
                  <p
                    style={{
                      fontFamily: "Sora, sans-serif",
                      fontSize: "11.5px",
                      color: "rgba(255,255,255,0.5)",
                      lineHeight: 1.7,
                    }}
                  >
                    {sig.insight}
                  </p>

                  {/* Signal strength bars */}
                  <div className="flex items-center gap-1 mt-4">
                    <span
                      className="font-mono-geist text-[7px] tracking-[0.15em] uppercase mr-1"
                      style={{ color: "rgba(255,255,255,0.2)" }}
                    >
                      SIGNAL
                    </span>
                    {[1, 2, 3, 4, 5].map((b) => (
                      <div
                        key={b}
                        style={{
                          width: "10px",
                          height: "4px",
                          borderRadius: "1px",
                          background:
                            b <= sig.strength
                              ? sig.pulse
                              : "rgba(255,255,255,0.08)",
                          boxShadow:
                            b <= sig.strength ? `0 0 4px ${sig.pulse}` : "none",
                        }}
                      />
                    ))}
                    <span
                      className="font-mono-geist text-[8px] ml-1"
                      style={{ color: sig.pulse }}
                    >
                      {sig.trend}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {sig.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono-geist text-[7px] tracking-[0.1em] uppercase px-1.5 py-0.5"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          color: "rgba(255,255,255,0.3)",
                          borderRadius: "2px",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Bottom color line */}
                  <div
                    className="mt-4 h-px w-full"
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

          {/* Repository telemetry bar */}
          <div
            className="flex flex-wrap items-center gap-4 mb-6 epochs-reveal reveal"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              paddingBottom: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
                style={{ background: "#4a7ef7" }}
              />
              <span
                className="font-mono-geist text-[9px] tracking-[0.2em] uppercase"
                style={{ color: "rgba(74,126,247,0.7)" }}
              >
                SYSTEM ACTIVE
              </span>
            </div>
            {[
              { label: "ENTRIES", val: "08" },
              { label: "DOMAINS", val: "05" },
              { label: "INDEXED", val: "2025-11" },
              { label: "GOVERNANCE", val: "E.L.P.I.S" },
            ].map((m) => (
              <div
                key={m.label}
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <span
                  className="font-mono-geist text-[8px] tracking-[0.15em] uppercase"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  {m.label}:
                </span>
                <span
                  className="font-mono-geist text-[9px]"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {m.val}
                </span>
              </div>
            ))}
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
              onMouseEnter={() => setHoveredFilter("__all__")}
              onMouseLeave={() => setHoveredFilter(null)}
              className="font-mono-geist text-[10px] tracking-[0.2em] uppercase px-4 py-2 rounded-sm transition-all duration-200"
              style={{
                background: !activeFilter
                  ? "rgba(74,126,247,0.15)"
                  : hoveredFilter === "__all__"
                    ? "rgba(74,126,247,0.07)"
                    : "rgba(255,255,255,0.03)",
                border: `1px solid ${!activeFilter ? "rgba(74,126,247,0.45)" : hoveredFilter === "__all__" ? "rgba(74,126,247,0.3)" : "rgba(255,255,255,0.1)"}`,
                color: !activeFilter
                  ? "rgba(74,126,247,0.9)"
                  : hoveredFilter === "__all__"
                    ? "rgba(74,126,247,0.7)"
                    : "rgba(255,255,255,0.45)",
                cursor: "pointer",
                boxShadow:
                  hoveredFilter === "__all__" && !activeFilter
                    ? "0 0 10px rgba(74,126,247,0.15)"
                    : "none",
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
                onMouseEnter={() => setHoveredFilter(domain)}
                onMouseLeave={() => setHoveredFilter(null)}
                className="font-mono-geist text-[10px] tracking-[0.2em] uppercase px-4 py-2 rounded-sm transition-all duration-200"
                style={{
                  background:
                    activeFilter === domain
                      ? "rgba(74,126,247,0.15)"
                      : hoveredFilter === domain
                        ? "rgba(74,126,247,0.07)"
                        : "rgba(255,255,255,0.03)",
                  border: `1px solid ${activeFilter === domain ? "rgba(74,126,247,0.45)" : hoveredFilter === domain ? "rgba(74,126,247,0.3)" : "rgba(255,255,255,0.1)"}`,
                  color:
                    activeFilter === domain
                      ? "rgba(74,126,247,0.9)"
                      : hoveredFilter === domain
                        ? "rgba(74,126,247,0.7)"
                        : "rgba(255,255,255,0.45)",
                  cursor: "pointer",
                  boxShadow:
                    hoveredFilter === domain && activeFilter !== domain
                      ? "0 0 10px rgba(74,126,247,0.15)"
                      : "none",
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
                        style={{
                          borderTop: "1px solid rgba(74,126,247,0.1)",
                          borderLeft: "3px solid rgba(74,126,247,0.4)",
                          transition: "border-left-color 0.4s ease",
                        }}
                      >
                        {/* Status + ImpactClass badges */}
                        <div className="flex flex-wrap gap-2 mt-4 mb-3">
                          {entry.status && (
                            <span
                              className="font-mono-geist text-[8px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-sm"
                              style={{
                                background:
                                  entry.status === "Published"
                                    ? "rgba(74,126,247,0.1)"
                                    : entry.status === "Active"
                                      ? "rgba(34,211,153,0.1)"
                                      : "rgba(212,160,23,0.1)",
                                border: `1px solid ${entry.status === "Published" ? "rgba(74,126,247,0.3)" : entry.status === "Active" ? "rgba(34,211,153,0.3)" : "rgba(212,160,23,0.3)"}`,
                                color:
                                  entry.status === "Published"
                                    ? "rgba(74,126,247,0.9)"
                                    : entry.status === "Active"
                                      ? "rgba(34,211,153,0.9)"
                                      : "rgba(212,160,23,0.9)",
                              }}
                            >
                              ● {entry.status}
                            </span>
                          )}
                          {entry.impactClass && (
                            <span
                              className="font-mono-geist text-[8px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-sm"
                              style={{
                                background:
                                  entry.impactClass === "Critical"
                                    ? "rgba(239,100,68,0.1)"
                                    : entry.impactClass === "Applied"
                                      ? "rgba(74,126,247,0.1)"
                                      : "rgba(212,160,23,0.1)",
                                border: `1px solid ${entry.impactClass === "Critical" ? "rgba(239,100,68,0.35)" : entry.impactClass === "Applied" ? "rgba(74,126,247,0.3)" : "rgba(212,160,23,0.3)"}`,
                                color:
                                  entry.impactClass === "Critical"
                                    ? "rgba(239,130,80,0.95)"
                                    : entry.impactClass === "Applied"
                                      ? "rgba(74,126,247,0.9)"
                                      : "rgba(212,160,23,0.9)",
                              }}
                            >
                              ◈ {entry.impactClass}
                            </span>
                          )}
                        </div>

                        {/* Abstract */}
                        <p
                          className="text-sm leading-relaxed"
                          style={{
                            color: "rgba(255,255,255,0.65)",
                            fontFamily: "Sora, sans-serif",
                            lineHeight: "1.75",
                          }}
                        >
                          {entry.description}
                        </p>

                        {/* Methodology */}
                        {entry.methodology && (
                          <div className="mt-4">
                            <span
                              className="font-mono-geist text-[8px] tracking-[0.25em] uppercase px-2 py-0.5 rounded-sm"
                              style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "rgba(255,255,255,0.35)",
                              }}
                            >
                              METHODOLOGY
                            </span>
                            <p
                              className="text-xs mt-2"
                              style={{
                                color: "rgba(255,255,255,0.4)",
                                fontFamily: "Sora, sans-serif",
                                fontStyle: "italic",
                              }}
                            >
                              {entry.methodology}
                            </p>
                          </div>
                        )}

                        {/* Key Findings */}
                        {entry.keyFindings && entry.keyFindings.length > 0 && (
                          <div className="mt-4">
                            <div
                              className="font-mono-geist text-[8px] tracking-[0.25em] uppercase mb-2"
                              style={{ color: "rgba(212,160,23,0.6)" }}
                            >
                              KEY FINDINGS
                            </div>
                            <ul className="space-y-1.5">
                              {entry.keyFindings.map((finding, fi) => (
                                <li
                                  key={`finding-${entry.id}-${fi}`}
                                  className="flex items-start gap-2 text-xs animate-fade-in-up"
                                  style={{
                                    color: "rgba(255,255,255,0.6)",
                                    fontFamily: "Sora, sans-serif",
                                    animationDelay: `${fi * 60}ms`,
                                    animationFillMode: "both",
                                  }}
                                >
                                  <span
                                    style={{
                                      color: "#d4a017",
                                      flexShrink: 0,
                                      marginTop: "1px",
                                    }}
                                  >
                                    ▸
                                  </span>
                                  <span>{finding}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {entry.tags.map((tag, ti) => (
                            <span
                              key={tag}
                              className="font-mono-geist text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 rounded-sm animate-fade-in-up"
                              style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "rgba(255,255,255,0.4)",
                                animationDelay: `${ti * 40}ms`,
                                animationFillMode: "both",
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
      <section className="py-20 px-6 relative overflow-hidden">
        {/* Background radial atmosphere */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "600px",
              height: "600px",
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(74,126,247,0.04) 0%, transparent 70%)",
              animation: "radarRing 12s ease-out infinite",
            }}
          />
        </div>
        <div className="max-w-7xl mx-auto relative">
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
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#d4a017",
                    animation: "pulse 2s ease-in-out infinite",
                    boxShadow: "0 0 8px #d4a017",
                    flexShrink: 0,
                  }}
                />
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

          {/* Full-width Radar Chart */}
          <div className="mt-4">
            <RadarChartWidget />
          </div>

          {/* Data Sources footnote */}
          <div
            className="mt-8 pt-4 epochs-reveal reveal"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div
              className="font-mono-geist text-[8px] tracking-[0.2em] uppercase mb-3"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              DATA REFERENCE NODES
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "IPCC AR6 — 2021",
                "NASA GISS Surface Temp.",
                "NOAA Global Carbon",
                "Global Forest Watch 2024",
                "IUCN Red List 2025",
              ].map((src) => (
                <span
                  key={src}
                  className="font-mono-geist text-[8px] tracking-[0.1em] px-2.5 py-1"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.35)",
                    borderRadius: "2px",
                  }}
                >
                  {src}
                </span>
              ))}
            </div>
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

      {/* ── F. Scientific Integrity & Governance — Full Framework ────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(212,160,23,0.04) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-6xl mx-auto relative">
          <div className="mb-14 epochs-reveal reveal">
            <div
              className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              ◆ RESEARCH GOVERNANCE — ELPIS OVERSIGHT
            </div>
            <h2
              className="font-display font-light text-gradient-hero mb-4"
              style={{
                fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
                letterSpacing: "0.08em",
              }}
            >
              Scientific Integrity &amp; Governance
            </h2>
            <p
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: "14px",
                color: "rgba(255,255,255,0.45)",
                maxWidth: "640px",
                lineHeight: 1.8,
              }}
            >
              EPOCHS operates under a multi-layer governance system designed to
              ensure that every research output meets the highest standards of
              scientific integrity, ethical compliance, and societal
              accountability. Governance is not a constraint on research — it is
              the infrastructure that makes research trustworthy.
            </p>
          </div>

          {/* 5-pillar governance framework */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            {[
              {
                pillar: "01",
                title: "Pre-Publication Ethical Review",
                desc: "Every research output undergoes mandatory ethical review by the E.L.P.I.S Council before any publication or public release. Review covers methodology, data provenance, and potential societal impact.",
                icon: "◈",
                color: "#d4a017",
              },
              {
                pillar: "02",
                title: "Bias Auditing Protocol",
                desc: "Quantitative bias auditing of all analytical outputs, particularly in AI and data-driven research. Demographic parity, predictive equality, and calibration are assessed across relevant subgroups.",
                icon: "◆",
                color: "#4a7ef7",
              },
              {
                pillar: "03",
                title: "External Peer Validation",
                desc: "Independent domain experts external to STEMONEF validate both methodology and conclusions. No research output is released as final without at least two independent review cycles.",
                icon: "◇",
                color: "#22d3ee",
              },
              {
                pillar: "04",
                title: "Societal Impact Assessment",
                desc: "Structured analysis of second- and third-order consequences of research findings — particularly for outputs in AI, climate policy, and medical systems.",
                icon: "▣",
                color: "#a78bfa",
              },
              {
                pillar: "05",
                title: "Public Accountability Reporting",
                desc: "Annual transparency reports publishing summary information on active research programs, ethical review outcomes, audit results, and governance decisions.",
                icon: "◉",
                color: "#34d399",
              },
            ].map((pil, i) => (
              <div
                key={pil.pillar}
                className="epochs-reveal reveal"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div
                  className="p-5 rounded-sm h-full relative overflow-hidden"
                  style={{
                    background: `${pil.color}06`,
                    border: `1px solid ${pil.color}20`,
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div
                    className="animate-card-scan absolute left-0 right-0 pointer-events-none"
                    aria-hidden="true"
                    style={{
                      height: "1px",
                      background: `linear-gradient(90deg, transparent, ${pil.color}44, transparent)`,
                      animationDelay: `${i * 0.6}s`,
                    }}
                  />
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xl" style={{ color: pil.color }}>
                      {pil.icon}
                    </div>
                    <div
                      className="font-mono-geist text-[8px] tracking-[0.2em] uppercase"
                      style={{ color: `${pil.color}66` }}
                    >
                      P.{pil.pillar}
                    </div>
                  </div>
                  <h4
                    className="font-display text-sm font-light mb-2"
                    style={{
                      color: "rgba(255,255,255,0.9)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {pil.title}
                  </h4>
                  <p
                    style={{
                      fontFamily: "Sora, sans-serif",
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.4)",
                      lineHeight: 1.65,
                    }}
                  >
                    {pil.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Governance body statement */}
          <div
            className="epochs-reveal reveal p-8 rounded-sm relative overflow-hidden"
            style={{
              background: "rgba(212,160,23,0.04)",
              border: "1px solid rgba(212,160,23,0.18)",
              borderLeft: "4px solid rgba(212,160,23,0.6)",
            }}
          >
            <div
              className="animate-card-scan absolute left-0 right-0 pointer-events-none z-10"
              aria-hidden="true"
              style={{
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(212,160,23,0.35), transparent)",
              }}
            />
            <div className="flex items-center gap-3 mb-5">
              <div
                className="flex items-center gap-2 px-3 py-1.5"
                style={{
                  background: "rgba(212,160,23,0.1)",
                  border: "1px solid rgba(212,160,23,0.3)",
                  borderRadius: "2px",
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
                  E.L.P.I.S COUNCIL — GOVERNING BODY
                </span>
              </div>
            </div>
            <p
              className="text-base leading-relaxed mb-5"
              style={{
                fontFamily: "Sora, sans-serif",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.85,
              }}
            >
              All EPOCHS research operates under the STEMONEF Ethics Framework,
              governed by the E.L.P.I.S Council — an independent oversight body
              whose mandate includes ethical review, accountability reporting,
              and the power to pause research that fails governance standards.
              Research outputs undergo mandatory pre-publication ethical review,
              quantitative bias auditing, and independent external peer
              validation before release. No research output is made public
              without independent verification of both its methodology and its
              potential societal implications.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Review Layers", val: "5" },
                { label: "Governance Body", val: "E.L.P.I.S" },
                { label: "Audit Framework", val: "Multi-Layer" },
                { label: "Public Reporting", val: "Annual" },
              ].map((m) => (
                <div
                  key={m.label}
                  className="text-center p-3"
                  style={{
                    background: "rgba(212,160,23,0.05)",
                    border: "1px solid rgba(212,160,23,0.12)",
                    borderRadius: "2px",
                  }}
                >
                  <div
                    className="font-mono-geist text-lg font-bold mb-1"
                    style={{ color: "rgba(212,160,23,0.9)" }}
                  >
                    {m.val}
                  </div>
                  <div
                    className="font-mono-geist text-[8px] tracking-[0.15em] uppercase"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CINEMATIC CONTINUATION ENDING ─────────────────────────────────── */}
      <section
        className="py-32 px-6 relative overflow-hidden"
        aria-label="Continuation — The Next Epoch"
      >
        {/* Ambient particle canvas */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(74,126,247,0.06) 0%, rgba(212,160,23,0.03) 40%, transparent 70%)",
            }}
          />
          {/* Animated rings */}
          {[180, 300, 440, 580].map((r, i) => (
            <div
              key={r}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: `${r}px`,
                height: `${r}px`,
                borderRadius: "50%",
                border: `1px solid rgba(74,126,247,${0.06 - i * 0.012})`,
                transform: "translate(-50%, -50%)",
                animation: `radarRing ${8 + i * 2.5}s ease-out infinite`,
                animationDelay: `${i * 2}s`,
              }}
            />
          ))}
          {/* Drifting particles */}
          {[
            {
              id: "ep-p-a0",
              left: 0,
              top: 20,
              w: 1,
              c: "#4a7ef7",
              dur: 2.5,
              delay: 0,
            },
            {
              id: "ep-p-a1",
              left: 4,
              top: 58,
              w: 2,
              c: "#d4a017",
              dur: 3.3,
              delay: 0.3,
            },
            {
              id: "ep-p-a2",
              left: 8,
              top: 31,
              w: 1,
              c: "#34d399",
              dur: 4.1,
              delay: 0.6,
            },
            {
              id: "ep-p-a3",
              left: 12,
              top: 75,
              w: 2,
              c: "#4a7ef7",
              dur: 2.5,
              delay: 0.9,
            },
            {
              id: "ep-p-a4",
              left: 17,
              top: 44,
              w: 1,
              c: "#d4a017",
              dur: 3.3,
              delay: 1.2,
            },
            {
              id: "ep-p-a5",
              left: 21,
              top: 22,
              w: 2,
              c: "#34d399",
              dur: 4.1,
              delay: 1.5,
            },
            {
              id: "ep-p-a6",
              left: 25,
              top: 68,
              w: 1,
              c: "#4a7ef7",
              dur: 2.5,
              delay: 1.8,
            },
            {
              id: "ep-p-a7",
              left: 29,
              top: 37,
              w: 2,
              c: "#d4a017",
              dur: 3.3,
              delay: 2.1,
            },
            {
              id: "ep-p-a8",
              left: 33,
              top: 55,
              w: 1,
              c: "#34d399",
              dur: 4.1,
              delay: 2.4,
            },
            {
              id: "ep-p-a9",
              left: 37,
              top: 28,
              w: 2,
              c: "#4a7ef7",
              dur: 2.5,
              delay: 2.7,
            },
            {
              id: "ep-p-b0",
              left: 42,
              top: 72,
              w: 1,
              c: "#d4a017",
              dur: 3.3,
              delay: 3.0,
            },
            {
              id: "ep-p-b1",
              left: 46,
              top: 41,
              w: 2,
              c: "#34d399",
              dur: 4.1,
              delay: 3.3,
            },
            {
              id: "ep-p-b2",
              left: 50,
              top: 20,
              w: 1,
              c: "#4a7ef7",
              dur: 2.5,
              delay: 3.6,
            },
            {
              id: "ep-p-b3",
              left: 54,
              top: 63,
              w: 2,
              c: "#d4a017",
              dur: 3.3,
              delay: 3.9,
            },
            {
              id: "ep-p-b4",
              left: 58,
              top: 34,
              w: 1,
              c: "#34d399",
              dur: 4.1,
              delay: 4.2,
            },
            {
              id: "ep-p-b5",
              left: 62,
              top: 78,
              w: 2,
              c: "#4a7ef7",
              dur: 2.5,
              delay: 4.5,
            },
            {
              id: "ep-p-b6",
              left: 67,
              top: 47,
              w: 1,
              c: "#d4a017",
              dur: 3.3,
              delay: 4.8,
            },
            {
              id: "ep-p-b7",
              left: 71,
              top: 25,
              w: 2,
              c: "#34d399",
              dur: 4.1,
              delay: 5.1,
            },
            {
              id: "ep-p-b8",
              left: 75,
              top: 61,
              w: 1,
              c: "#4a7ef7",
              dur: 2.5,
              delay: 5.4,
            },
            {
              id: "ep-p-b9",
              left: 79,
              top: 38,
              w: 2,
              c: "#d4a017",
              dur: 3.3,
              delay: 5.7,
            },
            {
              id: "ep-p-c0",
              left: 83,
              top: 73,
              w: 1,
              c: "#34d399",
              dur: 4.1,
              delay: 6.0,
            },
            {
              id: "ep-p-c1",
              left: 87,
              top: 29,
              w: 2,
              c: "#4a7ef7",
              dur: 2.5,
              delay: 6.3,
            },
            {
              id: "ep-p-c2",
              left: 92,
              top: 56,
              w: 1,
              c: "#d4a017",
              dur: 3.3,
              delay: 6.6,
            },
            {
              id: "ep-p-c3",
              left: 96,
              top: 42,
              w: 2,
              c: "#34d399",
              dur: 4.1,
              delay: 6.9,
            },
          ].map((p) => (
            <div
              key={p.id}
              style={{
                position: "absolute",
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: `${p.w}px`,
                height: `${p.w}px`,
                borderRadius: "50%",
                background: p.c,
                opacity: 0.3,
                animation: `civilSignalPulse ${p.dur}s ease-in-out infinite`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-5xl mx-auto relative text-center">
          {/* Eyebrow */}
          <div
            className="font-mono-geist text-[10px] tracking-[0.5em] uppercase mb-6 animate-fade-in-up"
            style={{ color: "rgba(212,160,23,0.7)" }}
          >
            ◈ STAGE 7 — THE CONTINUING MISSION
          </div>

          {/* Main statement */}
          <h2
            className="font-display font-light text-gradient-hero mb-6"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 6rem)",
              letterSpacing: "0.08em",
              lineHeight: 0.95,
              animation: "fadeInUp 0.8s ease 0.1s both",
            }}
          >
            The Next Epoch
            <br />
            <span style={{ color: "rgba(74,126,247,0.9)" }}>Begins Now</span>
          </h2>

          {/* Philosophical statement */}
          <p
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: "clamp(14px, 1.8vw, 17px)",
              color: "rgba(255,255,255,0.5)",
              maxWidth: "680px",
              margin: "0 auto 48px",
              lineHeight: 1.9,
              animation: "fadeInUp 0.8s ease 0.25s both",
            }}
          >
            Civilizations are not built in epochs — they are built in decisions.
            Each research output, each collaboration, each governance framework,
            each act of scientific courage shapes the trajectory of the next
            hundred years. EPOCHS exists at this frontier: not to describe the
            past, but to architect the future.
          </p>

          {/* Pillar connection nodes */}
          <div
            className="flex flex-wrap justify-center gap-4 mb-12"
            style={{ animation: "fadeInUp 0.8s ease 0.4s both" }}
          >
            {[
              {
                label: "EPOCHS",
                color: "#4a7ef7",
                desc: "Research & Innovation",
              },
              {
                label: "HUMANON",
                color: "#34d399",
                desc: "Talent Development",
              },
              {
                label: "STEAMI",
                color: "#d4a017",
                desc: "Intelligence Synthesis",
              },
              { label: "TERRA", color: "#22d3ee", desc: "Climate Systems" },
              { label: "EQUIS", color: "#a78bfa", desc: "Equity & Funding" },
              { label: "NOVA", color: "#f97316", desc: "Innovation Lab" },
            ].map((pillar, i) => (
              <div
                key={pillar.label}
                style={{
                  padding: "10px 18px",
                  background: `${pillar.color}10`,
                  border: `1px solid ${pillar.color}30`,
                  borderRadius: "2px",
                  animation: `fadeInUp 0.5s ease ${0.5 + i * 0.08}s both`,
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  className="font-mono-geist text-[10px] tracking-[0.25em] uppercase"
                  style={{ color: pillar.color }}
                >
                  {pillar.label}
                </div>
                <div
                  style={{
                    fontFamily: "Sora, sans-serif",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.3)",
                    marginTop: "2px",
                  }}
                >
                  {pillar.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Forward trajectory statement */}
          <div
            className="mb-12 p-6 rounded-sm mx-auto max-w-3xl"
            style={{
              background: "rgba(74,126,247,0.05)",
              border: "1px solid rgba(74,126,247,0.15)",
              borderLeft: "3px solid rgba(74,126,247,0.6)",
              textAlign: "left",
              animation: "fadeInUp 0.8s ease 0.6s both",
            }}
          >
            <div
              className="font-mono-geist text-[8px] tracking-[0.3em] uppercase mb-3"
              style={{ color: "rgba(74,126,247,0.6)" }}
            >
              ◈ FORWARD TRAJECTORY — 2025–2035
            </div>
            <p
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: "13px",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.85,
              }}
            >
              Over the next decade, EPOCHS will scale its research programs
              across climate science, ethical AI, and environmental
              intelligence. Laboratory outputs will transition from conceptual
              development into deployable solutions. The Intelligence Archive
              will grow into a navigable map of civilizational knowledge. And
              the governance frameworks established today will become the
              institutional standards of tomorrow.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                "Climate Modeling v3",
                "GAIA Field Deployments",
                "EIOS Commercial Phase",
                "STEMESA Governance Standard",
              ].map((item) => (
                <span
                  key={item}
                  className="font-mono-geist text-[8px] tracking-[0.12em] uppercase px-2 py-0.5"
                  style={{
                    background: "rgba(74,126,247,0.08)",
                    border: "1px solid rgba(74,126,247,0.2)",
                    color: "rgba(74,126,247,0.7)",
                    borderRadius: "2px",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div
            className="flex flex-wrap justify-center gap-4"
            style={{ animation: "fadeInUp 0.8s ease 0.75s both" }}
          >
            <a
              href="/humanon"
              className="font-mono-geist text-[11px] tracking-[0.25em] uppercase transition-all duration-300 inline-flex items-center gap-2"
              style={{
                background: "rgba(74,126,247,0.12)",
                border: "1px solid rgba(74,126,247,0.4)",
                color: "rgba(74,126,247,0.9)",
                padding: "12px 24px",
                borderRadius: "2px",
                textDecoration: "none",
              }}
            >
              EXPLORE HUMANON ↗
            </a>
            <a
              href="/steami"
              className="font-mono-geist text-[11px] tracking-[0.25em] uppercase transition-all duration-300 inline-flex items-center gap-2"
              style={{
                background: "rgba(212,160,23,0.1)",
                border: "1px solid rgba(212,160,23,0.35)",
                color: "rgba(212,160,23,0.9)",
                padding: "12px 24px",
                borderRadius: "2px",
                textDecoration: "none",
              }}
            >
              ENTER STEAMI ↗
            </a>
            <a
              href="/"
              className="font-mono-geist text-[11px] tracking-[0.25em] uppercase transition-all duration-300 inline-flex items-center gap-2"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.5)",
                padding: "12px 24px",
                borderRadius: "2px",
                textDecoration: "none",
              }}
            >
              RETURN TO STEMONEF
            </a>
          </div>

          {/* Continuation signal — subtle blinking line */}
          <div className="mt-16 flex items-center justify-center gap-3">
            <div
              style={{
                height: "1px",
                width: "80px",
                background:
                  "linear-gradient(90deg, transparent, rgba(74,126,247,0.3))",
              }}
            />
            <div
              className="civ-signal-dot"
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#4a7ef7",
                color: "#4a7ef7",
              }}
            />
            <span
              className="font-mono-geist text-[9px] tracking-[0.4em] uppercase"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              THE MISSION CONTINUES
            </span>
            <div
              className="civ-signal-dot"
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#d4a017",
                color: "#d4a017",
                animationDelay: "0.8s",
              }}
            />
            <div
              style={{
                height: "1px",
                width: "80px",
                background:
                  "linear-gradient(90deg, rgba(212,160,23,0.3), transparent)",
              }}
            />
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
