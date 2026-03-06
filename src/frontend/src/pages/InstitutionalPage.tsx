import { useEffect, useRef, useState } from "react";

export type InstitutionalView =
  | "ethics-charter"
  | "accountability-report"
  | "impact-fund"
  | "talent-pipeline"
  | "intelligence-feed"
  | "privacy-policy";

interface InstitutionalPageProps {
  page: InstitutionalView;
  onBack: () => void;
}

// ─── Animated canvas header ────────────────────────────────────────────────────
function InstitutionalCanvas({ color }: { color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const lastRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Node = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      opacity: number;
    };
    const nodes: Node[] = Array.from({ length: 18 }, () => ({
      x: Math.random() * (canvas.width || 800),
      y: Math.random() * (canvas.height || 240),
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.25,
      r: 2 + Math.random() * 3,
      opacity: 0.15 + Math.random() * 0.4,
    }));

    const draw = (ts: number) => {
      if (document.hidden) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      if (ts - lastRef.current < 33) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      lastRef.current = ts;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = color;
            ctx.globalAlpha = (1 - dist / 140) * 0.15;
            ctx.lineWidth = 0.6;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
      // Draw nodes
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = n.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      tabIndex={-1}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

// ─── PAGE CONFIGS ──────────────────────────────────────────────────────────────
const PAGE_CONFIGS: Record<
  InstitutionalView,
  {
    title: string;
    subtitle: string;
    color: string;
    eyebrow: string;
    sections: { heading: string; body: string | string[] }[];
  }
> = {
  "ethics-charter": {
    title: "Ethics Charter",
    subtitle:
      "The foundational ethical principles governing all STEMONEF operations, research conduct, and institutional decisions.",
    color: "#4a7ef7",
    eyebrow: "INSTITUTIONAL GOVERNANCE",
    sections: [
      {
        heading: "Preamble",
        body: "STEMONEF ENTERPRISES is constituted on the principle that scientific, technological, and institutional progress must be inseparable from ethical accountability. This charter establishes the ethical framework within which all activities — research, intelligence synthesis, talent development, investment, and public engagement — are conducted.",
      },
      {
        heading: "I. Scientific Integrity",
        body: [
          "All research outputs are subject to rigorous peer validation and transparent methodology disclosure.",
          "Data fabrication, selective reporting, or manipulation of findings is absolutely prohibited.",
          "Researchers have an obligation to disclose conflicts of interest, funding sources, and institutional affiliations.",
          "STEMONEF upholds open science principles — publishing methodologies and, where feasible, raw datasets.",
        ],
      },
      {
        heading: "II. Human Dignity & Non-Maleficence",
        body: [
          "No program, research initiative, or intelligence operation may cause harm to individuals, communities, or populations.",
          "Human participants in research must provide informed, voluntary, and revocable consent.",
          "All AI systems developed or deployed within STEMONEF must embed fairness, explainability, and non-discrimination principles.",
          "Vulnerable populations receive elevated protection in all research and program contexts.",
        ],
      },
      {
        heading: "III. Environmental Responsibility",
        body: [
          "STEMONEF is committed to net-positive environmental impact across all operations.",
          "No initiative may knowingly accelerate ecological degradation, biodiversity loss, or climate instability.",
          "Environmental impact assessments are mandatory for all large-scale programs.",
          "TERRA's planetary monitoring function serves as the institutional environmental conscience.",
        ],
      },
      {
        heading: "IV. Equity & Justice",
        body: [
          "Access to knowledge, opportunity, and the benefits of research must be distributed equitably.",
          "Programs must actively counteract systemic inequalities in education, health, and economic participation.",
          "EQUIS, the ethical capital pillar, ensures that investment and funding strategies align with equity mandates.",
          "Hiring, promotion, and collaboration must be free from discrimination on any protected characteristic.",
        ],
      },
      {
        heading: "V. Transparency & Accountability",
        body: [
          "STEMONEF publishes annual accountability reports detailing institutional performance against ethical commitments.",
          "The E.L.P.I.S Council serves as the independent ethical oversight body, with authority to review and challenge institutional decisions.",
          "Whistleblower protections are guaranteed for all persons who report ethical violations in good faith.",
          "This charter is subject to review every two years and may be strengthened — but not weakened — by institutional consensus.",
        ],
      },
      {
        heading: "Enforcement & Oversight",
        body: "Breaches of this charter are investigated by the E.L.P.I.S Governance Office. Findings are published in the Annual Accountability Report. Serious violations may result in suspension, removal from programs, or public disclosure, depending on severity. The charter is not advisory — it is constitutive of institutional identity.",
      },
    ],
  },
  "accountability-report": {
    title: "Accountability Report",
    subtitle:
      "Annual institutional transparency report tracking STEMONEF's performance against its ethical, operational, and impact commitments.",
    color: "#d4a017",
    eyebrow: "2024 — 2025 REPORT CYCLE",
    sections: [
      {
        heading: "Executive Summary",
        body: "STEMONEF ENTERPRISES entered its formal operational phase in 2024. This inaugural accountability report covers institutional establishment, pillar activation, governance structure formation, and early program development. As a recently constituted institution, all metrics reflect a foundation-phase trajectory. Full operational reporting will commence upon program launch.",
      },
      {
        heading: "Institutional Status",
        body: [
          "STATUS: Foundation & Development Phase",
          "Active Pillars: EPOCHS, HUMANON, STEAMI (Intelligence Active) — NOVA, TERRA, EQUIS (Development Phase)",
          "Governance: E.L.P.I.S Council constituted with initial advisory members",
          "Ethics Charter: Ratified and in effect from 2024",
          "Geographic Presence: 2 countries active",
        ],
      },
      {
        heading: "Research & Intelligence",
        body: [
          "STEAMI Intelligence Unit: Operational — publishing public intelligence signals",
          "EPOCHS Research Network: Program design phase — no published outputs yet",
          "Research integrity protocols: Established and active",
          "Knowledge dissemination: INTELLIARCHIVE framework in preparation",
        ],
      },
      {
        heading: "Talent & Development",
        body: [
          "HUMANON Program: Participant cohort design underway",
          "Mentor network: Recruitment in progress",
          "Industry collaboration framework: Under negotiation",
          "Participant intake: Not yet commenced — expected in the next program cycle",
        ],
      },
      {
        heading: "Environmental Commitment",
        body: [
          "TERRA Climate Research: Program architecture established",
          "Environmental impact baseline: Under development",
          "Carbon commitment: Net-zero operations target adopted",
          "Climate data systems: Infrastructure design phase",
        ],
      },
      {
        heading: "Ethics & Governance",
        body: [
          "Ethics Charter breaches reported: Zero",
          "E.L.P.I.S Council sessions held: Formative consultations completed",
          "Whistleblower cases: None received",
          "Governance review schedule: Established — annual review confirmed",
        ],
      },
      {
        heading: "Looking Forward",
        body: "The 2025–2026 report cycle will document first program cohort launches, early research outputs, and measurable impact indicators as STEMONEF moves from foundation phase into active operation. All commitments made in this report are binding institutional obligations reviewed annually by the E.L.P.I.S Council.",
      },
    ],
  },
  "impact-fund": {
    title: "Impact Fund",
    subtitle:
      "STEMONEF's ethical capital mechanism for directing investment and philanthropic resources toward mission-aligned impact programs.",
    color: "#34d399",
    eyebrow: "EQUIS / ETHICAL CAPITAL",
    sections: [
      {
        heading: "What Is the Impact Fund?",
        body: "The STEMONEF Impact Fund is the institutional vehicle through which ethical capital — comprising philanthropic contributions, mission-aligned investments, and program sponsorships — is allocated to STEMONEF's six operational pillars. It is governed by the EQUIS pillar, with independent oversight from the E.L.P.I.S Council.",
      },
      {
        heading: "Fund Architecture",
        body: [
          "Research Endowment — sustains EPOCHS long-cycle scientific research",
          "Talent Development Fund — underwrites HUMANON cohort programs and mentor stipends",
          "Intelligence Operations — supports STEAMI's global monitoring and synthesis infrastructure",
          "Climate Action Reserve — finances TERRA's ecological monitoring and intervention pilots",
          "Technology Innovation Fund — enables NOVA's experimental technology development",
          "Equity & Access Fund — ensures STEMONEF programs reach underserved communities",
        ],
      },
      {
        heading: "Investment Principles",
        body: [
          "Capital is only accepted from sources that meet STEMONEF's ethical screening criteria.",
          "No investment that conflicts with the Ethics Charter is accepted, regardless of value.",
          "Investment terms include transparency requirements — all major funders are publicly disclosed.",
          "Returns on ethical investments are reinvested into program operations, not distributed as profit.",
          "The fund operates under a long-term horizon — minimum 10-year program commitments.",
        ],
      },
      {
        heading: "Philanthropic Participation",
        body: "Individuals, foundations, and institutions that share STEMONEF's commitment to science, equity, and planetary health can participate through philanthropic contribution. All contributions are allocated to named fund categories and reported in the Annual Accountability Report. Minimum thresholds apply for named contributions.",
      },
      {
        heading: "Current Status",
        body: [
          "Fund Status: Establishment Phase",
          "First Cohort Allocations: Pending program launch",
          "Investment Framework: Under E.L.P.I.S review",
          "Disclosure Policy: Full public disclosure of all funders above minimum threshold",
          "Enquiries: Contact the EQUIS office for partnership and funding discussions",
        ],
      },
      {
        heading: "How to Participate",
        body: "STEMONEF welcomes mission-aligned funders. Please contact the EQUIS office to discuss participation options, ethical screening, and allocation preferences. All enquiries are treated with confidentiality. No commitment is required at the enquiry stage.",
      },
    ],
  },
  "talent-pipeline": {
    title: "Talent Pipeline",
    subtitle:
      "STEMONEF's structured pathway for developing the next generation of researchers, analysts, innovators, and mission-aligned professionals.",
    color: "#a78bfa",
    eyebrow: "HUMANON / TALENT DEVELOPMENT",
    sections: [
      {
        heading: "The STEMONEF Talent System",
        body: "STEMONEF's Talent Pipeline is the institutional mechanism through which emerging professionals — researchers, intelligence analysts, climate scientists, technology innovators, and policy specialists — are identified, developed, and embedded into the STEMONEF ecosystem and the wider world of mission-driven work.",
      },
      {
        heading: "Pathways",
        body: [
          "Research Pathway — embedded in EPOCHS research programs; develops scientific inquiry, methodology, and publication skills",
          "Intelligence Pathway — integrated with STEAMI; trains analytical synthesis, policy translation, and signal monitoring",
          "Climate Pathway — attached to TERRA; develops climate systems expertise, field research, and ecological analysis",
          "Technology Pathway — placed within NOVA; builds experimental technology, applied AI, and systems engineering skills",
          "Policy & Governance Pathway — aligned with E.L.P.I.S; develops institutional governance, ethics review, and policy design",
          "Media & Storytelling Pathway — translates research and intelligence into public-facing communication",
        ],
      },
      {
        heading: "Program Structure",
        body: [
          "Stage 1 — Orientation & Domain Alignment (4 weeks)",
          "Stage 2 — Embedded Mentorship with a STEMONEF senior researcher or analyst (12 weeks)",
          "Stage 3 — Independent Project Development with supervision (8 weeks)",
          "Stage 4 — Output & Integration — publication, presentation, or program contribution",
          "Stage 5 — Alumni Network — ongoing connection to STEMONEF community and opportunities",
        ],
      },
      {
        heading: "Who Can Apply?",
        body: [
          "Undergraduate and postgraduate students in relevant disciplines",
          "Early-career professionals transitioning to mission-driven work",
          "Independent researchers seeking institutional affiliation",
          "Professionals from partner institutions with secondment agreements",
          "Applications are open globally — STEMONEF actively seeks geographic and disciplinary diversity",
        ],
      },
      {
        heading: "Mentor Network",
        body: "STEMONEF's Talent Pipeline is anchored by a network of senior researchers, intelligence professionals, and domain experts who serve as mentors and supervisors. Mentors are drawn from STEMONEF's own pillars and from partner academic and institutional networks.",
      },
      {
        heading: "How to Apply",
        body: "Applications for the HUMANON Talent Pipeline open with each program cohort. Visit the HUMANON page to register your interest. Selection is based on alignment with STEMONEF's mission, domain relevance, and potential for contribution — not solely on academic credentials.",
      },
    ],
  },
  "intelligence-feed": {
    title: "Intelligence Feed",
    subtitle:
      "About STEMONEF's Live Intelligence Signal Network — how signals are produced, verified, and made available.",
    color: "#22d3ee",
    eyebrow: "STEAMI / INTELLIGENCE ARCHITECTURE",
    sections: [
      {
        heading: "What Is the Intelligence Feed?",
        body: "The STEMONEF Intelligence Feed is a continuous output of synthesised insights produced by STEAMI — the Strategic, Technological, and Environmental Analysis & Monitoring Intelligence pillar. Each signal represents the distillation of cross-domain research monitoring, policy tracking, and analytical synthesis into a structured intelligence brief.",
      },
      {
        heading: "Signal Types",
        body: [
          "AI & Technology Signals — monitoring regulatory developments, technology adoption patterns, and innovation frontiers",
          "Climate Signals — tracking planetary tipping points, ecological data, and climate policy developments",
          "Policy & Governance Signals — synthesising emerging legislative frameworks, governance models, and institutional responses",
          "Research Signals — highlighting significant academic outputs, longitudinal study results, and scientific developments",
          "Global Systems Signals — analysing geopolitical, economic, and humanitarian systems at the macro level",
        ],
      },
      {
        heading: "How Signals Are Produced",
        body: [
          "Stage 1 — Source Monitoring: STEAMI's intelligence systems continuously monitor academic journals, policy documents, institutional reports, and open data sources across monitored domains",
          "Stage 2 — Signal Identification: Analysts identify patterns, emerging developments, and cross-domain intersections of institutional significance",
          "Stage 3 — Synthesis & Analysis: Raw intelligence is synthesised into structured briefs with domain classification, confidence assessment, and implication mapping",
          "Stage 4 — Ethical Review: Signals are reviewed to ensure they do not amplify misinformation, breach privacy, or serve harmful purposes",
          "Stage 5 — Publication: Approved signals are published to the live feed and archived in INTELLIARCHIVE",
        ],
      },
      {
        heading: "Signal Confidence & Classification",
        body: [
          "PRIORITY signals represent high-confidence, high-significance developments requiring immediate institutional attention",
          "Standard signals represent confirmed developments of ongoing relevance",
          "All signals are time-stamped and include source attribution",
          "Confidence levels are derived from source quality, corroboration, and analytical consensus",
        ],
      },
      {
        heading: "Access & Distribution",
        body: "The public Intelligence Feed provides open access to published signals. STEMONEF partner institutions and registered members receive access to expanded briefings, including full analytical reports, implication assessments, and custom domain briefings. Contact STEAMI to enquire about institutional intelligence subscriptions.",
      },
      {
        heading: "Editorial Independence",
        body: "STEAMI operates with full editorial independence from STEMONEF's funding sources and commercial activities. Intelligence signals are produced on the basis of analytical merit alone. The E.L.P.I.S Council has oversight authority over intelligence ethics and methodology.",
      },
    ],
  },
  "privacy-policy": {
    title: "Privacy Policy",
    subtitle:
      "How STEMONEF collects, processes, and protects personal data across all platforms and services.",
    color: "#f59e0b",
    eyebrow: "DATA GOVERNANCE",
    sections: [
      {
        heading: "Introduction",
        body: "STEMONEF ENTERPRISES is committed to protecting the privacy and personal data of all individuals who interact with our platforms, programs, and services. This policy explains what data we collect, how we use it, and the rights you hold over your personal information.",
      },
      {
        heading: "Data We Collect",
        body: [
          "Account Data — name, email address, and authentication credentials when you create an account",
          "Program Data — application information, participation records, and program outputs for enrolled participants",
          "Interaction Data — pages visited, features used, and engagement patterns to improve platform functionality",
          "Communications Data — messages sent through contact forms, program enquiries, and institutional communications",
          "Research Data — de-identified participation data used for program evaluation and institutional research",
        ],
      },
      {
        heading: "How We Use Your Data",
        body: [
          "Account management and authentication",
          "Program delivery, mentorship matching, and cohort management",
          "Intelligence feed personalisation and saved signal management",
          "Institutional communications — updates, briefings, and program announcements",
          "Anonymised research to improve STEMONEF programs and measure institutional impact",
          "Legal compliance and safety obligations",
        ],
      },
      {
        heading: "Data Sharing",
        body: [
          "STEMONEF does not sell personal data to third parties",
          "Data may be shared with partner institutions for program delivery purposes, with your consent",
          "De-identified, aggregated data may be used in public research and accountability reporting",
          "Legal obligations may require disclosure to regulatory authorities in specific circumstances",
        ],
      },
      {
        heading: "Your Rights",
        body: [
          "Right of Access — you may request a copy of all personal data held about you",
          "Right of Rectification — you may correct inaccurate or incomplete data",
          "Right of Erasure — you may request deletion of your data, subject to legal retention obligations",
          "Right to Object — you may object to certain processing activities",
          "Right to Data Portability — you may request your data in a machine-readable format",
          "Right to Withdraw Consent — you may withdraw consent for optional data processing at any time",
        ],
      },
      {
        heading: "Data Retention",
        body: "Account data is retained for the duration of your relationship with STEMONEF and for a period of 3 years thereafter, in accordance with legal obligations. Program participation records are retained for 7 years for accountability reporting purposes. You may request earlier deletion subject to applicable law.",
      },
      {
        heading: "Security",
        body: "STEMONEF applies institutional-grade security practices to protect personal data, including encryption at rest and in transit, access controls, and regular security review. Our platform is built on the Internet Computer Protocol — a decentralised architecture that provides structural resistance to centralised data breaches.",
      },
      {
        heading: "Contact",
        body: "For privacy enquiries, data subject requests, or to exercise your rights, contact the STEMONEF Data Governance Office. We respond to all requests within 30 days in accordance with applicable data protection law.",
      },
    ],
  },
};

// ─── Main component ────────────────────────────────────────────────────────────
export default function InstitutionalPage({
  page,
  onBack,
}: InstitutionalPageProps) {
  const config = PAGE_CONFIGS[page];
  const [visible, setVisible] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run on page change to scroll to top and reset fade-in
  useEffect(() => {
    window.scrollTo(0, 0);
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, [page]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#04050e",
        fontFamily: "Sora, sans-serif",
        opacity: visible ? 1 : 0,
        transition: "opacity 400ms ease",
      }}
    >
      <style>{`
        @keyframes inst-scan {
          0% { left: -100%; }
          100% { left: 110%; }
        }
        @keyframes inst-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes inst-border-glow {
          0%, 100% { box-shadow: 0 0 0 rgba(212,160,23,0); }
          50% { box-shadow: 0 0 18px rgba(212,160,23,0.08); }
        }
      `}</style>

      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{
          minHeight: "320px",
          background:
            "linear-gradient(135deg, rgba(4,5,14,1) 0%, rgba(4,5,14,0.92) 60%, rgba(4,5,14,1) 100%)",
          borderBottom: `1px solid ${config.color}30`,
        }}
      >
        <InstitutionalCanvas color={config.color} />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "200px",
            background: `radial-gradient(ellipse 70% 100% at 30% -20%, ${config.color}12, transparent)`,
            pointerEvents: "none",
          }}
        />

        {/* Scan line */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: "80px",
              background: `linear-gradient(90deg, transparent, ${config.color}15, transparent)`,
              animation: "inst-scan 4s linear infinite",
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
          {/* Back button */}
          <button
            type="button"
            data-ocid="institutional.back.button"
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: `1px solid ${config.color}35`,
              borderRadius: "2px",
              padding: "6px 14px",
              color: config.color,
              fontFamily: "Geist Mono, monospace",
              fontSize: "9px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              cursor: "pointer",
              marginBottom: "32px",
              transition: "all 200ms",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                `${config.color}12`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "none";
            }}
          >
            ← STEMONEF HOME
          </button>

          {/* Eyebrow */}
          <div
            style={{
              fontFamily: "Geist Mono, monospace",
              fontSize: "9px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: config.color,
              opacity: 0.7,
              marginBottom: "16px",
              animation: "inst-fade-up 500ms ease 100ms both",
            }}
          >
            {config.eyebrow}
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: "clamp(2.2rem, 6vw, 4rem)",
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: "0.02em",
              color: "rgba(255,255,255,0.95)",
              marginBottom: "20px",
              animation: "inst-fade-up 500ms ease 200ms both",
            }}
          >
            {config.title}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "0.95rem",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.45)",
              maxWidth: "600px",
              animation: "inst-fade-up 500ms ease 300ms both",
            }}
          >
            {config.subtitle}
          </p>

          {/* Decorative line */}
          <div
            style={{
              marginTop: "28px",
              height: "1px",
              width: "120px",
              background: `linear-gradient(90deg, ${config.color}, transparent)`,
              animation: "inst-fade-up 500ms ease 400ms both",
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="space-y-10">
          {config.sections.map((section, idx) => (
            <Section
              key={section.heading}
              heading={section.heading}
              body={section.body}
              color={config.color}
              idx={idx}
            />
          ))}
        </div>

        {/* Back to home CTA */}
        <div
          className="mt-20 pt-10"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            type="button"
            data-ocid="institutional.back.secondary.button"
            onClick={onBack}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: `${config.color}12`,
              border: `1px solid ${config.color}35`,
              borderRadius: "2px",
              padding: "12px 24px",
              color: config.color,
              fontFamily: "Geist Mono, monospace",
              fontSize: "10px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 200ms",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                `${config.color}20`;
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                `0 0 16px ${config.color}20`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                `${config.color}12`;
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            ← Return to STEMONEF
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Section component ─────────────────────────────────────────────────────────
function Section({
  heading,
  body,
  color,
  idx,
}: {
  heading: string;
  body: string | string[];
  color: string;
  idx: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVis(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 500ms ease ${idx * 60}ms, transform 500ms ease ${idx * 60}ms`,
        background: "rgba(255,255,255,0.015)",
        border: "1px solid rgba(255,255,255,0.055)",
        borderLeft: `2px solid ${color}50`,
        borderRadius: "2px",
        padding: "28px 32px",
        animation: vis ? "inst-border-glow 4s ease-in-out infinite" : "none",
      }}
    >
      {/* Heading */}
      <div
        style={{
          fontFamily: "Geist Mono, monospace",
          fontSize: "9px",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color,
          marginBottom: "14px",
          opacity: 0.85,
        }}
      >
        {heading}
      </div>

      {/* Body */}
      {typeof body === "string" ? (
        <p
          style={{
            fontSize: "0.875rem",
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.55)",
            fontFamily: "Sora, sans-serif",
          }}
        >
          {body}
        </p>
      ) : (
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {body.map((item) => (
            <li
              key={item.slice(0, 40)}
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
                fontSize: "0.875rem",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.5)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              <span
                style={{
                  color,
                  fontFamily: "Geist Mono, monospace",
                  fontSize: "9px",
                  marginTop: "4px",
                  flexShrink: 0,
                }}
              >
                ▸
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
