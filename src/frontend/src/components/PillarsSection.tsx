import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import type { Pillar } from "../backend.d";
import { useGetAllPillars } from "../hooks/useQueries";

const FALLBACK_PILLARS: Pillar[] = [
  {
    id: 1n,
    name: "EPOCHS",
    mandate:
      "Advanced Research & Development division driving systemic inquiry across social, technological, and environmental domains.",
    strategicRole:
      "Serves as the intellectual engine of STEMONEF, generating foundational knowledge that powers all other pillars.",
    operationalModel:
      "Operates through interdisciplinary research clusters, peer-reviewed output cycles, and strategic knowledge partnerships.",
    initiatives:
      "Project ATLAS (global systems mapping), Initiative FORGE (applied research translation), Lab NEXUS (cross-domain synthesis).",
    futureDirection:
      "Expanding into quantum social modeling and predictive institutional analysis by 2026.",
    governanceNote:
      "All research output subject to ETHOS ethical review. Data sovereignty protocols enforced.",
  },
  {
    id: 2n,
    name: "HUMANON",
    mandate:
      "Talent Incubation & Field Development system cultivating the next generation of mission-driven change agents.",
    strategicRole:
      "Human capital pipeline ensuring STEMONEF sustains long-term operational capacity and social impact.",
    operationalModel:
      "Structured progression from learner cohorts through research residencies to full field deployment.",
    initiatives:
      "Fellows Program (50+ active fellows), Mentorship Matrix, Field Academy, Global Talent Exchange.",
    futureDirection:
      "Targeting 500 active field contributors across 30 countries by 2027.",
    governanceNote:
      "All talent protocols governed by equity and inclusion framework. Zero discrimination policy enforced.",
  },
  {
    id: 3n,
    name: "STEAMI",
    mandate:
      "Intelligence & Knowledge Platform synthesizing cross-domain data into actionable institutional insight.",
    strategicRole:
      "Central intelligence infrastructure enabling evidence-based decision-making across all STEMONEF operations.",
    operationalModel:
      "Continuous data ingestion, AI-assisted synthesis, structured intelligence reporting, and policy translation services.",
    initiatives:
      "Intelligence Briefs (weekly), Domain Watch System, Policy Translation Unit, Strategic Foresight Lab.",
    futureDirection:
      "Deploying sovereign AI models for ethical intelligence synthesis with full auditability.",
    governanceNote:
      "All intelligence products reviewed for bias, accuracy, and ethical alignment before release.",
  },
  {
    id: 4n,
    name: "NOVA",
    mandate:
      "Media Translation & Storytelling division converting complex institutional knowledge into accessible public narratives.",
    strategicRole:
      "Builds public trust, drives institutional visibility, and translates mission complexity into cultural resonance.",
    operationalModel:
      "Documentary production, editorial publishing, digital media strategy, and strategic communications.",
    initiatives:
      "The STEMONEF Report (quarterly), NOVA Documentary Series, Public Dialogue Forums, Media Partners Network.",
    futureDirection:
      "Establishing an independent media institute with editorial autonomy and global distribution.",
    governanceNote:
      "Editorial independence guaranteed. No commercial or political interference in content.",
  },
  {
    id: 5n,
    name: "TERRA",
    mandate:
      "Climate & Natural Life Research division addressing ecological systems, biodiversity, and planetary sustainability.",
    strategicRole:
      "Anchors STEMONEF's environmental mandate, generating science-led policy recommendations and field interventions.",
    operationalModel:
      "Field research stations, ecological monitoring systems, climate policy analysis, and restoration project management.",
    initiatives:
      "Project GAIA (planetary health index), Reforestation Pilot (12 sites), Ocean Systems Lab, Climate Equity Framework.",
    futureDirection:
      "Building the first Social-Ecological Resilience Index spanning 50 nations by 2028.",
    governanceNote:
      "All interventions follow precautionary principle. Indigenous knowledge rights protected.",
  },
  {
    id: 6n,
    name: "EQUIS",
    mandate:
      "Equity & Sustainable Funding system mobilizing ethical capital toward mission-aligned initiatives.",
    strategicRole:
      "Financial sustainability engine ensuring STEMONEF operates with independence and long-term resilience.",
    operationalModel:
      "Impact investment facilitation, ethical venture partnerships, grant management, and revenue reinvestment allocation.",
    initiatives:
      "Impact Fund (active), Deep Tech Licensing Program, Equity Partnership Network, Regenerative Finance Model.",
    futureDirection:
      "Establishing a STEMONEF Endowment Fund targeting $50M in ethical capital by 2029.",
    governanceNote:
      "All capital sources screened against ethical investment criteria. Profit reinvestment is constitutionally mandated.",
  },
  {
    id: 7n,
    name: "ETHOS",
    mandate:
      "Ethical Oversight & Governance body ensuring institutional integrity across all STEMONEF operations.",
    strategicRole:
      "Constitutional conscience of the enterprise — reviewing, auditing, and enforcing ethical standards system-wide.",
    operationalModel:
      "Independent review panels, continuous compliance monitoring, public ethics reporting, and governance advisory.",
    initiatives:
      "Ethics Charter (published), Annual Accountability Report, Independent Review Board, Whistleblower Protection System.",
    futureDirection:
      "Developing the first AI Ethics Certification standard for social science institutions globally.",
    governanceNote:
      "ETHOS operates with full independence. No pillar or executive can override its determinations.",
  },
];

const PILLAR_COLORS = [
  {
    line: "#4a7ef7",
    glow: "rgba(74,126,247,0.3)",
    bg: "rgba(74,126,247,0.06)",
  },
  {
    line: "#22d3b0",
    glow: "rgba(34,211,176,0.3)",
    bg: "rgba(34,211,176,0.06)",
  },
  {
    line: "#a78bfa",
    glow: "rgba(167,139,250,0.3)",
    bg: "rgba(167,139,250,0.06)",
  },
  {
    line: "#d4a017",
    glow: "rgba(212,160,23,0.3)",
    bg: "rgba(212,160,23,0.06)",
  },
  {
    line: "#34d399",
    glow: "rgba(52,211,153,0.3)",
    bg: "rgba(52,211,153,0.06)",
  },
  {
    line: "#f472b6",
    glow: "rgba(244,114,182,0.3)",
    bg: "rgba(244,114,182,0.06)",
  },
  {
    line: "#60a5fa",
    glow: "rgba(96,165,250,0.3)",
    bg: "rgba(96,165,250,0.06)",
  },
];

function PillarCard({
  pillar,
  index,
  onClick,
}: {
  pillar: Pillar;
  index: number;
  onClick: () => void;
}) {
  const color = PILLAR_COLORS[index % PILLAR_COLORS.length];

  return (
    <button
      type="button"
      data-ocid={`pillars.item.${index + 1}`}
      onClick={onClick}
      className="text-left w-full group transition-all duration-300 reveal"
      style={{
        animationDelay: `${index * 0.1}s`,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
      }}
    >
      <div
        className="h-full p-6 rounded-sm transition-all duration-300 relative overflow-hidden"
        style={{
          background: `radial-gradient(ellipse 80% 80% at 110% 110%, ${color.glow.replace("0.3", "0.08")} 0%, rgba(4,5,14,0.6) 60%)`,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderLeft: `2px solid ${color.line}`,
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.background = `radial-gradient(ellipse 100% 100% at 110% 110%, ${color.glow.replace("0.3", "0.18")} 0%, rgba(4,5,14,0.75) 65%)`;
          el.style.boxShadow = `0 0 25px ${color.glow.replace("0.3", "0.2")}, 0 8px 32px rgba(0,0,0,0.5)`;
          el.style.borderColor = `${color.line}55`;
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.background = `radial-gradient(ellipse 80% 80% at 110% 110%, ${color.glow.replace("0.3", "0.08")} 0%, rgba(4,5,14,0.6) 60%)`;
          el.style.boxShadow = "none";
          el.style.borderColor = "rgba(255,255,255,0.07)";
        }}
      >
        {/* Watermark number — oversized, behind content */}
        <div
          className="absolute font-display font-light select-none pointer-events-none"
          style={{
            fontSize: "7rem",
            lineHeight: 1,
            color: color.line,
            opacity: 0.04,
            right: "-8px",
            bottom: "-16px",
            letterSpacing: "-0.02em",
          }}
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Pillar glyph top-right corner */}
        <div
          className="absolute top-4 right-5 font-mono-geist text-[10px] font-bold select-none pointer-events-none"
          style={{ color: color.line, opacity: 0.25, letterSpacing: "0.05em" }}
          aria-hidden="true"
        >
          {["◈", "◇", "◆", "▷", "⬡", "◎", "◉"][index % 7]}
        </div>

        {/* Index */}
        <div
          className="font-mono-geist text-[10px] mb-3"
          style={{ color: color.line, letterSpacing: "0.2em" }}
        >
          {String(index + 1).padStart(2, "0")} /{" "}
          <span style={{ color: "rgba(255,255,255,0.25)" }}>07</span>
        </div>

        {/* Name */}
        <h3
          className="font-display text-xl font-light mb-3 transition-all duration-300"
          style={{
            letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.92)",
          }}
        >
          {pillar.name}
        </h3>

        {/* Mandate preview */}
        <p
          className="text-xs leading-relaxed line-clamp-3"
          style={{
            color: "rgba(255,255,255,0.38)",
            fontFamily: "Sora, sans-serif",
          }}
        >
          {pillar.mandate}
        </p>

        {/* Expand hint */}
        <div
          className="mt-5 flex items-center gap-2 text-[10px] tracking-widest uppercase transition-all duration-200"
          style={{
            color: color.line,
            opacity: 0.55,
            fontFamily: "Geist Mono, monospace",
          }}
        >
          <span>View Mandate</span>
          <span>→</span>
        </div>
      </div>
    </button>
  );
}

export default function PillarsSection() {
  const { data: pillars, isLoading } = useGetAllPillars();
  const displayPillars =
    pillars && pillars.length > 0 ? pillars : FALLBACK_PILLARS;
  const [selectedPillar, setSelectedPillar] = useState<Pillar | null>(null);

  return (
    <section
      data-ocid="pillars.section"
      id="pillars"
      className="relative py-28 px-6"
    >
      {/* Section header */}
      <div className="max-w-7xl mx-auto mb-16">
        <div
          className="font-mono-geist text-xs tracking-[0.4em] uppercase mb-4"
          style={{ color: "rgba(212,160,23,0.7)" }}
        >
          ◆ STRUCTURAL ARCHITECTURE
        </div>
        <h2
          className="font-display text-4xl md:text-5xl font-light mb-4 text-gradient-hero"
          style={{ letterSpacing: "0.08em" }}
        >
          Seven Pillars
        </h2>
        <p
          className="max-w-xl text-sm leading-relaxed"
          style={{
            color: "rgba(255,255,255,0.4)",
            fontFamily: "Sora, sans-serif",
          }}
        >
          STEMONEF operates through seven interdependent structural pillars,
          each carrying a distinct mandate while contributing to a unified
          institutional mission.
        </p>
      </div>

      {/* Pillar grid */}
      {isLoading ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 7 }).map((_item, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders with no stable ID
              key={i}
              data-ocid="pillars.loading_state"
              className="h-48 rounded-sm"
              style={{
                background: "rgba(255,255,255,0.03)",
                animation: "node-pulse 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayPillars.map((pillar, i) => (
            <PillarCard
              key={String(pillar.id)}
              pillar={pillar}
              index={i}
              onClick={() => setSelectedPillar(pillar)}
            />
          ))}
        </div>
      )}

      {/* SVG connection lines overlay - decorative */}
      <div className="max-w-7xl mx-auto relative mt-8 hidden xl:block">
        <svg
          role="img"
          aria-label="Pillar connection lines"
          className="w-full pillar-connection-svg animate-breathing"
          height="2"
          style={{ overflow: "visible" }}
        >
          <line
            x1="7%"
            y1="0"
            x2="93%"
            y2="0"
            stroke="rgba(74,126,247,0.15)"
            strokeWidth="1"
            strokeDasharray="8 8"
          />
        </svg>
      </div>

      {/* Pillar Detail Modal */}
      <Dialog
        open={!!selectedPillar}
        onOpenChange={(open) => !open && setSelectedPillar(null)}
      >
        <DialogContent
          data-ocid="pillars.dialog"
          className="max-w-2xl max-h-[85vh] overflow-y-auto"
          style={{
            background: "rgba(6,8,20,0.97)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(74,126,247,0.2)",
            boxShadow:
              "0 0 60px rgba(74,126,247,0.1), 0 24px 64px rgba(0,0,0,0.8)",
          }}
        >
          {selectedPillar && (
            <>
              <DialogHeader>
                <div
                  className="font-mono-geist text-[10px] tracking-[0.4em] uppercase mb-2"
                  style={{ color: "rgba(212,160,23,0.7)" }}
                >
                  PILLAR MANDATE
                </div>
                <DialogTitle
                  className="font-display text-3xl font-light"
                  style={{
                    letterSpacing: "0.2em",
                    background: "linear-gradient(135deg, #4a7ef7, #ffffff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {selectedPillar.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {[
                  { label: "MANDATE", content: selectedPillar.mandate },
                  {
                    label: "STRATEGIC ROLE",
                    content: selectedPillar.strategicRole,
                  },
                  {
                    label: "OPERATIONAL MODEL",
                    content: selectedPillar.operationalModel,
                  },
                  {
                    label: "ACTIVE INITIATIVES",
                    content: selectedPillar.initiatives,
                  },
                  {
                    label: "FUTURE DIRECTION",
                    content: selectedPillar.futureDirection,
                  },
                  {
                    label: "GOVERNANCE & ETHICS",
                    content: selectedPillar.governanceNote,
                  },
                ].map(({ label, content }) => (
                  <div key={label}>
                    <div
                      className="font-mono-geist text-[9px] tracking-[0.35em] uppercase mb-2"
                      style={{ color: "rgba(212,160,23,0.6)" }}
                    >
                      {label}
                    </div>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: "rgba(255,255,255,0.65)",
                        fontFamily: "Sora, sans-serif",
                      }}
                    >
                      {content}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className="mt-6 pt-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <button
                  type="button"
                  data-ocid="pillars.close_button"
                  onClick={() => setSelectedPillar(null)}
                  className="px-6 py-2 text-xs tracking-widest uppercase transition-all duration-200"
                  style={{
                    background: "rgba(74,126,247,0.08)",
                    border: "1px solid rgba(74,126,247,0.3)",
                    color: "rgba(74,126,247,0.8)",
                    fontFamily: "Geist Mono, monospace",
                    letterSpacing: "0.15em",
                    cursor: "pointer",
                    borderRadius: "2px",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(74,126,247,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(74,126,247,0.08)";
                  }}
                >
                  Close
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
