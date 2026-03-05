import { useState } from "react";

interface AICompanionProps {
  isOpen: boolean;
  onClose: () => void;
  currentSection: string;
}

const PREDEFINED_PROMPTS = [
  {
    id: "model",
    label: "What is STEMONEF's enterprise model?",
    answer: `STEMONEF ENTERPRISES operates as a **Social Science Enterprise** — a hybrid institutional system that integrates Research & Development, Intelligence Synthesis, Ethical Oversight, Media Translation, Talent Incubation, Climate Research, Equity Funding, and Humanitarian Development.

The enterprise model is structured around seven interdependent pillars: EPOCHS (R&D), HUMANON (Talent), STEAMI (Intelligence), NOVA (Media), TERRA (Climate), EQUIS (Equity), and ETHOS (Governance).

Revenue generated through commercial arms (Deep Tech, Intelligence Services, Media Production, Equity Investments) is constitutionally reinvested into mission-critical impact programs. This creates a self-sustaining institutional cycle.`,
  },
  {
    id: "reinvestment",
    label: "How does revenue reinvestment work?",
    answer: `STEMONEF's revenue architecture is governed by the EQUIS pillar, which oversees all capital flows.

Commercial revenues from Deep Technology licensing, Intelligence Service contracts, NOVA Media productions, and EQUIS equity investments are pooled into the **STEMONEF Impact Fund**.

An independent allocation board — governed by ETHOS — distributes these funds according to quarterly mission priorities across EPOCHS, HUMANON, TERRA, and humanitarian programs.

All financial flows are published in the Annual Accountability Report, ensuring full public transparency.`,
  },
  {
    id: "ethics",
    label: "How are ethics enforced?",
    answer: `Ethical enforcement is the exclusive domain of **ETHOS** — STEMONEF's independent governance pillar.

ETHOS operates with constitutional independence — no executive, pillar, or external stakeholder can override its determinations.

Enforcement mechanisms include:
• Pre-deployment ethical review for all research outputs
• Quarterly compliance audits across all pillars
• Independent whistleblower protection system
• Public Ethics Charter with binding institutional commitments
• Annual external accountability review

ETHOS is developing the first AI Ethics Certification standard for social science institutions globally.`,
  },
  {
    id: "climate",
    label: "Which vertical aligns with climate research?",
    answer: `**TERRA** is STEMONEF's dedicated Climate & Natural Life Research division.

Active climate initiatives include:
• **Project GAIA** — Planetary health index spanning 50 nations
• Reforestation Pilot — 12 active sites
• Ocean Systems Lab — Deep marine ecosystem monitoring
• Climate Equity Framework — Ensuring just transition for vulnerable populations

TERRA research feeds directly into STEAMI's intelligence synthesis, enabling evidence-based climate policy translation. EPOCHS provides the foundational research infrastructure.

For direct climate collaboration, select the **Climate & Sustainability** pathway.`,
  },
  {
    id: "collaborate",
    label: "How can I collaborate?",
    answer: `STEMONEF engages institutional partners, research collaborators, ethical investors, industry alliances, and mission-aligned talent through structured pathways.

**To collaborate:**
1. Select your alignment pathway (Research, Talent, Intelligence, Climate, Media, or Equity)
2. Submit a collaboration inquiry via the engagement form
3. An institutional liaison will review and respond within 5 working days

**Partnership opportunities** are available for organizations seeking co-research, co-production, or strategic alignment with STEMONEF's mission verticals.

Use the "Build the Future With Us" section to initiate contact.`,
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

export default function AICompanion({
  isOpen,
  onClose,
  currentSection,
}: AICompanionProps) {
  const [activeAnswer, setActiveAnswer] = useState<string | null>(null);

  const contextualSuggestion = SECTION_SUGGESTIONS[currentSection] || null;

  return (
    <>
      {/* Sliding panel */}
      <div
        data-ocid="companion.panel"
        className={`fixed right-0 top-0 bottom-0 z-50 flex flex-col ${isOpen ? "animate-slide-in-right" : "hidden"}`}
        style={{
          width: "min(420px, 90vw)",
          background: "rgba(4,6,18,0.97)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderLeft: "1px solid rgba(74,126,247,0.15)",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div
          className="p-6 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <div
              className="font-mono-geist text-[9px] tracking-[0.4em] uppercase mb-1"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              INTELLIGENCE COMPANION
            </div>
            <div
              className="font-display text-base font-light"
              style={{
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              STEMONEF System
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
                className="font-mono-geist text-[9px]"
                style={{
                  color: "rgba(52,211,153,0.7)",
                  letterSpacing: "0.1em",
                }}
              >
                ACTIVE
              </span>
            </div>
            <button
              type="button"
              data-ocid="companion.close_button"
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
                fontSize: "18px",
                lineHeight: 1,
                padding: "4px",
              }}
              aria-label="Close companion"
            >
              ×
            </button>
          </div>
        </div>

        {/* Contextual suggestion */}
        {contextualSuggestion && (
          <div
            className="mx-6 mt-4 p-3 rounded-sm"
            style={{
              background: "rgba(74,126,247,0.08)",
              border: "1px solid rgba(74,126,247,0.15)",
            }}
          >
            <div
              className="font-mono-geist text-[9px] tracking-[0.3em] uppercase mb-1"
              style={{ color: "rgba(74,126,247,0.6)" }}
            >
              CONTEXT SIGNAL
            </div>
            <p
              className="text-xs leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.5)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              {contextualSuggestion}
            </p>
          </div>
        )}

        {/* Prompt list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <div
            className="font-mono-geist text-[9px] tracking-[0.35em] uppercase mb-4"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            ASK THE SYSTEM
          </div>

          {PREDEFINED_PROMPTS.map((prompt) => (
            <div key={prompt.id}>
              <button
                type="button"
                data-ocid="companion.button"
                onClick={() =>
                  setActiveAnswer(activeAnswer === prompt.id ? null : prompt.id)
                }
                className="w-full text-left p-4 rounded-sm transition-all duration-200"
                style={{
                  background:
                    activeAnswer === prompt.id
                      ? "rgba(212,160,23,0.08)"
                      : "rgba(255,255,255,0.03)",
                  border: `1px solid ${activeAnswer === prompt.id ? "rgba(212,160,23,0.3)" : "rgba(255,255,255,0.07)"}`,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (activeAnswer !== prompt.id) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255,255,255,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeAnswer !== prompt.id) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255,255,255,0.03)";
                  }
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className="text-xs leading-relaxed"
                    style={{
                      color:
                        activeAnswer === prompt.id
                          ? "rgba(212,160,23,0.9)"
                          : "rgba(255,255,255,0.6)",
                      fontFamily: "Sora, sans-serif",
                    }}
                  >
                    {prompt.label}
                  </span>
                  <span
                    className="text-xs flex-shrink-0 mt-0.5 transition-transform duration-200"
                    style={{
                      color: "rgba(255,255,255,0.3)",
                      transform:
                        activeAnswer === prompt.id ? "rotate(180deg)" : "none",
                    }}
                  >
                    ▾
                  </span>
                </div>
              </button>

              {/* Answer block */}
              {activeAnswer === prompt.id && (
                <div
                  className="p-4 mt-1 rounded-sm animate-fade-in-up"
                  style={{
                    background: "rgba(4,6,18,0.9)",
                    border: "1px solid rgba(74,126,247,0.1)",
                    borderTop: "none",
                    borderRadius: "0 0 2px 2px",
                  }}
                >
                  <div
                    className="font-mono-geist text-[8px] tracking-[0.35em] uppercase mb-2"
                    style={{ color: "rgba(74,126,247,0.6)" }}
                  >
                    SYSTEM RESPONSE
                  </div>
                  <div
                    className="text-xs leading-relaxed"
                    style={{
                      color: "rgba(255,255,255,0.55)",
                      fontFamily: "Geist Mono, monospace",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {prompt.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="p-4 text-center"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p
            className="font-mono-geist text-[9px]"
            style={{ color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}
          >
            STEMONEF Intelligence Interface — Rule-Based Advisory System
          </p>
        </div>
      </div>
    </>
  );
}
