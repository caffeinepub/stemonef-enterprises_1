import { useState } from "react";
import { useLogPathwayInterest } from "../hooks/useQueries";

const PATHWAYS = [
  {
    id: "research",
    label: "Research & Innovation",
    icon: "◈",
    description:
      "Contribute to EPOCHS-led systemic inquiry and knowledge synthesis.",
    color: "rgba(74,126,247,0.8)",
    glow: "rgba(74,126,247,0.25)",
  },
  {
    id: "talent",
    label: "Talent & Field Growth",
    icon: "◇",
    description:
      "Join the HUMANON pipeline — from learner to field-deployed change agent.",
    color: "rgba(34,211,176,0.8)",
    glow: "rgba(34,211,176,0.25)",
  },
  {
    id: "intelligence",
    label: "Intelligence & Policy",
    icon: "◆",
    description:
      "Access STEAMI intelligence briefings and contribute to policy translation.",
    color: "rgba(167,139,250,0.8)",
    glow: "rgba(167,139,250,0.25)",
  },
  {
    id: "climate",
    label: "Climate & Sustainability",
    icon: "⬡",
    description:
      "Engage with TERRA's ecological research and planetary health initiatives.",
    color: "rgba(52,211,153,0.8)",
    glow: "rgba(52,211,153,0.25)",
  },
  {
    id: "media",
    label: "Media & Storytelling",
    icon: "▷",
    description:
      "Partner with NOVA to translate mission complexity into cultural narrative.",
    color: "rgba(212,160,23,0.8)",
    glow: "rgba(212,160,23,0.25)",
  },
  {
    id: "equity",
    label: "Equity & Support",
    icon: "◎",
    description:
      "Explore EQUIS ethical investment and funding alignment pathways.",
    color: "rgba(248,113,113,0.8)",
    glow: "rgba(248,113,113,0.25)",
  },
];

interface PathwaySectionProps {
  onPathwaySelect?: (pathway: string) => void;
}

export default function PathwaySection({
  onPathwaySelect,
}: PathwaySectionProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const logPathway = useLogPathwayInterest();

  const handleSelect = (pathwayId: string, pathwayLabel: string) => {
    setSelected(pathwayId);
    logPathway.mutate(pathwayLabel);
    onPathwaySelect?.(pathwayId);
  };

  return (
    <section
      data-ocid="pathway.section"
      id="pathway"
      className="relative py-28 px-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <div
            className="font-mono-geist text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: "rgba(212,160,23,0.7)" }}
          >
            ◆ ADAPTIVE PATHWAY ENGINE
          </div>
          <h2
            className="font-display text-4xl md:text-5xl font-light text-gradient-hero mb-4"
            style={{ letterSpacing: "0.08em" }}
          >
            Choose Your Path
          </h2>
          <p
            className="max-w-xl text-sm leading-relaxed"
            style={{
              color: "rgba(255,255,255,0.4)",
              fontFamily: "Sora, sans-serif",
            }}
          >
            Select the domain most aligned with your interest. The system will
            orient toward your sector.
          </p>
        </div>

        {/* Pathway grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {PATHWAYS.map((pathway, i) => {
            const isSelected = selected === pathway.id;
            return (
              <button
                type="button"
                key={pathway.id}
                data-ocid={`pathway.item.${i + 1}`}
                onClick={() => handleSelect(pathway.id, pathway.label)}
                className="text-left p-6 rounded-sm transition-all duration-300 reveal group"
                style={{
                  background: isSelected
                    ? `${pathway.glow.replace("0.25", "0.08")}`
                    : "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: isSelected
                    ? `1px solid ${pathway.color.replace("0.8", "0.5")}`
                    : "1px solid rgba(255,255,255,0.06)",
                  boxShadow: isSelected ? `0 0 25px ${pathway.glow}` : "none",
                  cursor: "pointer",
                  animationDelay: `${i * 0.08}s`,
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = `${pathway.glow.replace("0.25", "0.06")}`;
                    el.style.borderColor = pathway.color.replace("0.8", "0.3");
                    el.style.boxShadow = `0 0 20px ${pathway.glow.replace("0.25", "0.15")}`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = "rgba(255,255,255,0.03)";
                    el.style.borderColor = "rgba(255,255,255,0.06)";
                    el.style.boxShadow = "none";
                  }
                }}
              >
                {/* Icon */}
                <div
                  className="text-2xl mb-4 transition-all duration-300"
                  style={{ color: pathway.color }}
                >
                  {pathway.icon}
                </div>

                {/* Label */}
                <h3
                  className="font-display text-base font-light mb-2"
                  style={{
                    letterSpacing: "0.08em",
                    color: isSelected ? pathway.color : "rgba(255,255,255,0.8)",
                  }}
                >
                  {pathway.label}
                </h3>

                {/* Description */}
                <p
                  className="text-xs leading-relaxed"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontFamily: "Sora, sans-serif",
                  }}
                >
                  {pathway.description}
                </p>

                {/* Selected indicator */}
                {isSelected && (
                  <div
                    className="mt-4 flex items-center gap-2 text-[10px] tracking-widest uppercase"
                    style={{
                      color: pathway.color,
                      fontFamily: "Geist Mono, monospace",
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
                      style={{ background: pathway.color }}
                    />
                    ACTIVE
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
