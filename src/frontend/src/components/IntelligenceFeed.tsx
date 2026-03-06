import { useEffect, useMemo, useRef, useState } from "react";
import type { FeedEntry } from "../backend.d";
import { useBookmarks } from "../hooks/useBookmarks";
import { useGetFeaturedFeeds, useGetPublicFeeds } from "../hooks/useQueries";

// ─── Design tokens ────────────────────────────────────────────────────────────
const DOMAIN_STYLES: Record<
  string,
  { color: string; bg: string; label: string; source: string; category: string }
> = {
  AI: {
    color: "#4a7ef7",
    bg: "rgba(74,126,247,0.1)",
    label: "Artificial Intelligence",
    source: "STEAMI Intelligence",
    category: "AI",
  },
  Climate: {
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    label: "Climate Systems",
    source: "EPOCHS / TERRA Research",
    category: "Climate",
  },
  Technology: {
    color: "#22d3ee",
    bg: "rgba(34,211,238,0.1)",
    label: "Technology",
    source: "NOVA Technology Unit",
    category: "Technology",
  },
  Policy: {
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.1)",
    label: "Policy & Governance",
    source: "STEAMI Policy Synthesis",
    category: "Policy",
  },
  Research: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    label: "Research",
    source: "EPOCHS Research Network",
    category: "Research",
  },
  "Global Systems": {
    color: "#d4a017",
    bg: "rgba(212,160,23,0.1)",
    label: "Global Systems",
    source: "STEAMI Global Intelligence",
    category: "Global Systems",
  },
};

function getDomainStyle(domain: string) {
  return (
    DOMAIN_STYLES[domain] || {
      color: "#94a3b8",
      bg: "rgba(148,163,184,0.1)",
      label: domain,
      source: "STEMONEF Intelligence Hub",
      category: domain,
    }
  );
}

// ─── Signal strength derivation (pure frontend) ────────────────────────────
function deriveSignalStrength(entry: FeedEntry): number {
  if (entry.isFeatured) return 5;
  const age = Date.now() - Number(entry.timestamp);
  if (age < 86400000) return 4;
  if (age < 259200000) return 3;
  if (age < 604800000) return 2;
  return 1;
}

// ─── Fallback feeds ───────────────────────────────────────────────────────────
export const FALLBACK_FEEDS: FeedEntry[] = [
  {
    id: 1n,
    title: "AI Governance Landscape",
    domain: "AI",
    summary:
      "Emerging global regulatory frameworks are shaping the future of ethical AI deployment across institutional systems.",
    isFeatured: true,
    timestamp: BigInt(Date.now() - 7200000),
    isPublic: true,
  },
  {
    id: 2n,
    title: "Planetary Tipping Cascades — 2026 Assessment",
    domain: "Climate",
    summary:
      "TERRA synthesis maps active planetary tipping points with critical intervention windows closing faster than prior models predicted.",
    isFeatured: true,
    timestamp: BigInt(Date.now() - 3600000),
    isPublic: true,
  },
  {
    id: 3n,
    title: "Post-Growth Economic Frameworks",
    domain: "Research",
    summary:
      "Strategic foresight brief examining ten emerging post-growth economic models compatible with STEMONEF equity mandates.",
    isFeatured: false,
    timestamp: BigInt(Date.now() - 86400000),
    isPublic: true,
  },
  {
    id: 4n,
    title: "Neural Interface Ethics & Consent",
    domain: "Policy",
    summary:
      "Foundational review of cognitive sovereignty, consent protocols, and institutional accountability as neural interfaces approach clinical scale.",
    isFeatured: true,
    timestamp: BigInt(Date.now() - 172800000),
    isPublic: true,
  },
  {
    id: 5n,
    title: "Distributed Intelligence Infrastructure",
    domain: "Technology",
    summary:
      "NOVA analysis of decentralised compute architectures enabling resilient, sovereignty-preserving intelligence networks globally.",
    isFeatured: false,
    timestamp: BigInt(Date.now() - 259200000),
    isPublic: true,
  },
  {
    id: 6n,
    title: "Global Health Equity Signal — Q1 2026",
    domain: "Global Systems",
    summary:
      "Cross-domain intelligence brief examining healthcare access disparities, policy gaps, and intervention models across 47 monitored zones.",
    isFeatured: false,
    timestamp: BigInt(Date.now() - 345600000),
    isPublic: true,
  },
  {
    id: 7n,
    title: "Regenerative Agriculture Intelligence",
    domain: "Climate",
    summary:
      "EPOCHS field research synthesis on regenerative soil practices showing significant carbon sequestration improvement in monitored pilot zones.",
    isFeatured: true,
    timestamp: BigInt(Date.now() - 432000000),
    isPublic: true,
  },
  {
    id: 8n,
    title: "Institutional AI Adoption Patterns",
    domain: "AI",
    summary:
      "Longitudinal study of AI integration across research institutions reveals significant variance in ethical governance frameworks.",
    isFeatured: false,
    timestamp: BigInt(Date.now() - 518400000),
    isPublic: true,
  },
];

// ─── Detailed insights ────────────────────────────────────────────────────────
const DETAIL_INSIGHTS: Record<
  string,
  { full: string; implications: string[] }
> = {
  "AI Governance Landscape": {
    full: "Regulatory bodies across the EU, UK, US, and Asia-Pacific are accelerating the development of binding AI governance frameworks. The convergence of these frameworks signals a structural shift from voluntary codes of conduct toward legally enforceable standards. STEAMI's policy translation unit identifies three critical implementation gaps: enforcement capacity, cross-border jurisdiction alignment, and algorithmic audit standards. Institutions operating AI systems must begin preparing governance documentation aligned to the emerging ISO/IEC 42001 standard. STEMONEF's STEAMI pillar is monitoring 14 active legislative processes across 9 jurisdictions, with the EU AI Act entering enforcement phase in 2026.",
    implications: [
      "ISO/IEC 42001 compliance preparation window is now active across all AI-operating institutions",
      "Cross-border enforcement gaps present systemic risk for multinational research deployments",
      "Algorithmic audit standards will become mandatory within 18–24 months across G7 nations",
    ],
  },
  "Planetary Tipping Cascades — 2026 Assessment": {
    full: "TERRA's comprehensive 2026 assessment identifies seven primary planetary tipping cascades now in active progression: West Antarctic Ice Sheet destabilisation, Amazon dieback acceleration, Atlantic Meridional Overturning Circulation (AMOC) weakening, permafrost carbon release, boreal forest transition, coral reef ecosystem collapse, and monsoon system disruption. The cascade interaction modelling — cross-referencing 23 climate datasets — reveals that tipping point interactions can amplify individual cascades by 40-60% beyond single-system projections. Critical intervention windows for four of the seven cascades are closing within the next 36 months.",
    implications: [
      "Four primary tipping systems have intervention windows closing by Q4 2028",
      "Cascade interactions amplify individual tipping risks by 40–60% — current models underestimate compound risk",
      "Immediate deployment of nature-based solutions and emissions reduction frameworks required at institutional level",
    ],
  },
  "Post-Growth Economic Frameworks": {
    full: "EPOCHS economic foresight team has catalogued ten emerging post-growth economic frameworks gaining institutional traction globally: Doughnut Economics, Degrowth Policy Integration, Wellbeing Economy, Circular Value Systems, Commons-Based Resource Management, Regenerative Business Models, Digital Sufficiency Frameworks, Universal Basic Services Architecture, Equity-Adjusted GDP Alternatives, and Planetary Boundary Accounting.",
    implications: [
      "Seven of ten frameworks offer direct structural compatibility with STEMONEF equity mandates",
      "Doughnut Economics and Wellbeing Economy models are gaining fastest policy traction in OECD nations",
      "Institutional adoption of post-growth frameworks is accelerating — EQUIS investment strategies should reflect this transition",
    ],
  },
  "Neural Interface Ethics & Consent": {
    full: "As neural interface technologies — including BCIs, neural prosthetics, and cognitive enhancement devices — approach clinical deployment at scale, STEAMI's ethics synthesis unit has produced a foundational framework for institutional accountability. The review examines cognitive sovereignty as a new category of fundamental right, the inadequacy of existing medical consent frameworks for persistent neural access, the institutional liability structures required for neural data governance, and the emerging concept of 'mental privacy' as a legally protected domain.",
    implications: [
      "Cognitive sovereignty requires recognition as a distinct fundamental right at the international governance level",
      "Existing medical consent frameworks are structurally inadequate for persistent neural data access — redesign required",
      "Institutional liability for neural interface data breaches needs new legal architecture by 2027",
    ],
  },
  "Distributed Intelligence Infrastructure": {
    full: "NOVA's infrastructure intelligence unit presents a comprehensive analysis of distributed and decentralised compute architectures as enabling infrastructure for resilient, sovereignty-preserving intelligence networks. The report examines federated learning architectures, edge computing deployments, sovereign data enclaves, peer-to-peer intelligence distribution protocols, and the emerging category of 'air-gapped intelligence' for high-security research contexts.",
    implications: [
      "Centralised cloud AI infrastructure creates material sovereignty risk as regulatory fragmentation increases",
      "Federated learning architectures provide viable path to 65–80% reduction in cross-border jurisdictional exposure",
      "Sovereign data enclaves are emerging as the preferred architecture for high-security institutional research contexts",
    ],
  },
  "Global Health Equity Signal — Q1 2026": {
    full: "STEAMI's cross-domain intelligence synthesis has produced the Q1 2026 Global Health Equity Signal, integrating data from 47 monitored zones across 6 continents. Key findings: healthcare access disparities have widened in 31 of 47 monitored zones since Q1 2025; digital health infrastructure rollout has created new equity gaps for populations without reliable connectivity.",
    implications: [
      "Healthcare access disparities widened in 31/47 monitored zones — intervention urgency is elevated",
      "Digital health infrastructure is creating new equity gaps requiring connectivity-independent health delivery models",
      "12 intervention models with demonstrated efficacy are ready for deployment through HUMANON partnership structures",
    ],
  },
  "Regenerative Agriculture Intelligence": {
    full: "EPOCHS field research has completed an 18-month synthesis of regenerative soil practices across 23 pilot zones in 11 countries. Headline finding: monitored regenerative practice adoption shows meaningful carbon sequestration improvement over conventional agriculture in comparable zones. Additional findings: soil biodiversity improved in all monitored regenerative sites; water retention capacity increased significantly.",
    implications: [
      "Regenerative soil practices demonstrate scalable carbon sequestration benefits with verifiable field data",
      "Soil biodiversity and water retention improvements provide compounding ecological benefits beyond carbon metrics",
      "140 additional pilot zones identified — TERRA's replication framework ready for institutional deployment",
    ],
  },
  "Institutional AI Adoption Patterns": {
    full: "A three-year longitudinal study conducted by STEAMI across 84 research institutions in 19 countries reveals dramatic variance in ethical AI governance frameworks at the institutional level. Only 23% of studied institutions have formal AI ethics review processes; 41% have ad-hoc review processes; and 36% have no systematic governance framework.",
    implications: [
      "Only 23% of research institutions have formal AI ethics review — 77% face material governance risk",
      "Structured AI governance frameworks correlate with 60% lower compliance incident rates",
      "STEMONEF's STEAMI unit is developing an institutional AI governance certification framework for partner institutions",
    ],
  },
};

function getDetailInsight(title: string, summary: string) {
  return (
    DETAIL_INSIGHTS[title] || {
      full: `${summary} This intelligence signal is part of STEMONEF's ongoing synthesis programme, drawing on cross-domain research networks, external monitoring systems, and internal analysis units.`,
      implications: [
        "Cross-domain synthesis identifies structural patterns not visible in single-domain analysis",
        "STEAMI intelligence signals feed directly into STEMONEF's adaptive strategy framework",
        "Institutional partners receive priority access to expanded briefing documentation",
      ],
    }
  );
}

// ─── Timestamp ─────────────────────────────────────────────────────────────────
function formatTimestamp(ts: bigint): string {
  const ms = Number(ts);
  if (ms <= 0) return "—";
  if (ms < 1e12) return "—";
  const diff = Date.now() - ms;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (diff < 60000) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function formatFullDate(ts: bigint): string {
  const ms = Number(ts);
  if (ms < 1e12) return "—";
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Sparkline bars ───────────────────────────────────────────────────────────
function SparklineBars({ color, id }: { color: string; id: string }) {
  const heights = useMemo(
    () =>
      Array.from(
        { length: 8 },
        (_, i) => 25 + ((Number(id.charCodeAt(0)) * (i + 3)) % 75),
      ),
    [id],
  );

  return (
    <div className="flex items-end gap-[2px] h-8">
      {heights.map((h, i) => {
        const barKey = `sparkbar-${id}-${i}`;
        return (
          <div
            key={barKey}
            className="w-[4px] rounded-[1px]"
            style={{
              height: `${h}%`,
              background: color,
              opacity: 0.6,
              animation: `signal-bar-breathe ${1.5 + (i % 4) * 0.25}s ease-in-out ${i * 0.15}s infinite alternate`,
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Signal strength bars ─────────────────────────────────────────────────────
function SignalStrength({
  color,
  strength,
}: { color: string; strength: number }) {
  const barDefs = [
    { h: 6, pos: 0 },
    { h: 8, pos: 1 },
    { h: 11, pos: 2 },
    { h: 14, pos: 3 },
    { h: 16, pos: 4 },
  ];
  return (
    <div className="flex items-end gap-[2px]">
      {barDefs.map(({ h, pos }) => (
        <div
          key={`strength-bar-${pos}`}
          style={{
            width: "4px",
            height: `${h}px`,
            background: color,
            opacity: pos < strength ? 1 : 0.15,
            borderRadius: "1px",
            transition: "opacity 0.3s",
          }}
        />
      ))}
    </div>
  );
}

// ─── Signal pulse ring ────────────────────────────────────────────────────────
function PulseRing({ color, fast }: { color: string; fast: boolean }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: 28, height: 28 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `1.5px solid ${color}`,
          animation: `signal-ring-pulse ${fast ? "1.2s" : "2.5s"} ease-out infinite`,
          opacity: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 3,
          borderRadius: "50%",
          border: `1px solid ${color}`,
          animation: `signal-ring-pulse ${fast ? "1.2s" : "2.5s"} ease-out ${fast ? "0.4s" : "0.8s"} infinite`,
          opacity: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "50%",
          transform: "translate(-50%,-50%)",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 6px ${color}`,
        }}
      />
    </div>
  );
}

// ─── Bookmark Button ──────────────────────────────────────────────────────────
function BookmarkButton({
  id,
  isBookmarked,
  onToggle,
}: {
  id: string;
  isBookmarked: boolean;
  onToggle: (id: string) => void;
}) {
  const [bouncing, setBouncing] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBouncing(true);
    setTimeout(() => setBouncing(false), 400);
    onToggle(id);
  };

  return (
    <button
      type="button"
      data-ocid="feed.bookmark.toggle"
      onClick={handleClick}
      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark signal"}
      title={isBookmarked ? "Remove from library" : "Save to library"}
      style={{
        position: "absolute",
        top: "8px",
        right: "8px",
        zIndex: 3,
        background: isBookmarked
          ? "rgba(212,160,23,0.12)"
          : "rgba(255,255,255,0.04)",
        border: `1px solid ${isBookmarked ? "rgba(212,160,23,0.4)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: "3px",
        width: "28px",
        height: "28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 250ms",
        boxShadow: isBookmarked ? "0 0 12px rgba(212,160,23,0.2)" : "none",
        animation: bouncing ? "bookmark-bounce 400ms ease-out" : "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = isBookmarked
          ? "rgba(212,160,23,0.18)"
          : "rgba(255,255,255,0.1)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = isBookmarked
          ? "rgba(212,160,23,0.6)"
          : "rgba(255,255,255,0.25)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = isBookmarked
          ? "rgba(212,160,23,0.12)"
          : "rgba(255,255,255,0.04)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = isBookmarked
          ? "rgba(212,160,23,0.4)"
          : "rgba(255,255,255,0.1)";
      }}
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill={isBookmarked ? "#d4a017" : "none"}
        stroke={isBookmarked ? "#d4a017" : "rgba(255,255,255,0.45)"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}

// ─── Rank badge ───────────────────────────────────────────────────────────────
function RankBadge({ rank, visible }: { rank: number; visible: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "8px",
        left: "12px",
        zIndex: 3,
        fontFamily: "Geist Mono, monospace",
        fontSize: "7px",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        padding: "1px 5px",
        borderRadius: "1px",
        background: "rgba(212,160,23,0.12)",
        border: "1px solid rgba(212,160,23,0.3)",
        color: "#d4a017",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-8px)",
        animation: visible
          ? `rank-badge-enter 150ms ease-out ${rank * 30}ms both`
          : "none",
        transition: "opacity 200ms, transform 200ms",
      }}
    >
      RANK {String(rank).padStart(2, "0")}
    </div>
  );
}

// ─── Signal card ──────────────────────────────────────────────────────────────
function SignalCard({
  entry,
  index,
  visible,
  rank,
  showRank,
  onOpenLibrary,
}: {
  entry: FeedEntry;
  index: number;
  visible: boolean;
  rank?: number;
  showRank: boolean;
  onOpenLibrary?: () => void;
}) {
  const domainStyle = getDomainStyle(entry.domain);
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const detail = getDetailInsight(entry.title, entry.summary);
  const signalId = String(entry.id).padStart(4, "0");
  const strength = deriveSignalStrength(entry);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(String(entry.id));

  const handleBookmarkToggle = (id: string) => {
    toggleBookmark(id);
    // If just bookmarked and library open handler provided, briefly hint
    if (!bookmarked && onOpenLibrary) {
      // No auto-open; user manually opens library
    }
  };

  return (
    <div
      data-ocid={`feed.item.${index + 1}`}
      className="relative flex flex-col rounded-[2px] overflow-hidden cursor-pointer"
      style={{
        background: "rgba(4,5,14,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: bookmarked
          ? "1px solid rgba(212,160,23,0.4)"
          : entry.isFeatured
            ? "1px solid rgba(212,160,23,0.25)"
            : "1px solid rgba(255,255,255,0.07)",
        boxShadow: bookmarked
          ? "0 0 24px rgba(212,160,23,0.12)"
          : hovered
            ? `0 0 32px ${domainStyle.color}30, 0 8px 32px rgba(0,0,0,0.4)`
            : entry.isFeatured
              ? "0 0 16px rgba(212,160,23,0.08)"
              : "none",
        transition: "box-shadow 250ms ease, border-color 250ms ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transitionProperty: "opacity, transform, box-shadow, border-color",
        transitionDuration: "400ms, 400ms, 250ms, 250ms",
        transitionDelay: `${index * 60}ms`,
        alignSelf: "stretch",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setExpanded((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setExpanded((v) => !v);
        }
      }}
    >
      {/* Scan-line sweep on hover */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 1,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: "2px",
              background: `linear-gradient(90deg, transparent, ${domainStyle.color}60, transparent)`,
              animation: "card-scan-sweep 0.8s linear infinite",
            }}
          />
        </div>
      )}

      {/* Left accent line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "2px",
          background: bookmarked
            ? "linear-gradient(180deg, #d4a017, rgba(212,160,23,0.3))"
            : `linear-gradient(180deg, ${domainStyle.color}, transparent)`,
          opacity: hovered ? 1 : bookmarked ? 1 : 0.4,
          transition: "opacity 250ms, background 300ms",
        }}
      />

      {/* Rank badge (only when sort = SIGNAL STRENGTH) */}
      {showRank && rank !== undefined && (
        <RankBadge rank={rank} visible={visible} />
      )}

      {/* Bookmark button */}
      <BookmarkButton
        id={String(entry.id)}
        isBookmarked={bookmarked}
        onToggle={handleBookmarkToggle}
      />

      <div
        className="p-5 flex flex-col gap-4 flex-1"
        style={{ paddingLeft: "18px", paddingTop: showRank ? "32px" : "20px" }}
      >
        {/* Row 1: Pulse + Domain + Signal Strength */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <PulseRing color={domainStyle.color} fast={hovered} />
            <div className="flex flex-col gap-0.5">
              <span
                className="text-[8px] tracking-[0.3em] uppercase"
                style={{
                  color: domainStyle.color,
                  fontFamily: "Geist Mono, monospace",
                }}
              >
                {domainStyle.label}
              </span>
              <span
                className="text-[8px] tracking-[0.2em]"
                style={{
                  color: "rgba(255,255,255,0.2)",
                  fontFamily: "Geist Mono, monospace",
                }}
              >
                SIGNAL #{signalId}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <SignalStrength color={domainStyle.color} strength={strength} />
            <div className="flex items-center gap-2">
              {entry.isFeatured && (
                <span
                  className="text-[7px] tracking-[0.2em] uppercase"
                  style={{
                    color: "#d4a017",
                    fontFamily: "Geist Mono, monospace",
                  }}
                >
                  ◆ PRIORITY
                </span>
              )}
              {bookmarked && (
                <span
                  className="text-[7px] tracking-[0.15em] uppercase"
                  style={{
                    color: "rgba(212,160,23,0.7)",
                    fontFamily: "Geist Mono, monospace",
                  }}
                >
                  SAVED
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3
          className="text-sm leading-snug"
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            color: hovered ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.88)",
            lineHeight: 1.45,
            fontWeight: 400,
            transition: "color 200ms",
            paddingRight: "24px",
          }}
        >
          {entry.title}
        </h3>

        {/* Summary */}
        <p
          className="text-[11px] leading-relaxed line-clamp-3"
          style={{
            color: "rgba(255,255,255,0.45)",
            fontFamily: "Sora, sans-serif",
            flex: 1,
          }}
        >
          {entry.summary}
        </p>

        {/* Sparkline */}
        <div
          className="py-2"
          style={{
            borderTop: `1px solid ${domainStyle.color}20`,
            borderBottom: `1px solid ${domainStyle.color}20`,
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="text-[7px] tracking-[0.25em] uppercase"
              style={{
                color: "rgba(255,255,255,0.2)",
                fontFamily: "Geist Mono, monospace",
                whiteSpace: "nowrap",
              }}
            >
              SIGNAL DATA
            </span>
            <SparklineBars color={domainStyle.color} id={String(entry.id)} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <span
              className="text-[9px] tracking-[0.15em] uppercase"
              style={{
                color: "rgba(255,255,255,0.25)",
                fontFamily: "Geist Mono, monospace",
              }}
            >
              SOURCE: {domainStyle.source}
            </span>
            <span
              className="text-[9px]"
              style={{
                color: "rgba(255,255,255,0.2)",
                fontFamily: "Geist Mono, monospace",
              }}
            >
              ◷ {formatTimestamp(entry.timestamp)}
            </span>
          </div>
          <button
            type="button"
            data-ocid={`feed.item.${index + 1}.button`}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
            className="text-[8px] tracking-[0.2em] uppercase px-2 py-1 rounded-[1px] transition-all duration-200"
            style={{
              fontFamily: "Geist Mono, monospace",
              background: expanded ? `${domainStyle.color}20` : "transparent",
              border: `1px solid ${domainStyle.color}40`,
              color: domainStyle.color,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {expanded ? "CLOSE SIGNAL ▲" : "EXPAND SIGNAL ▾"}
          </button>
        </div>
      </div>

      {/* Expanded detail panel */}
      <div
        style={{
          maxHeight: expanded ? "600px" : "0",
          overflow: "hidden",
          transition: "max-height 350ms ease-out",
        }}
      >
        <div
          className="px-5 pb-5"
          style={{
            paddingLeft: "18px",
            borderTop: `1px solid ${domainStyle.color}25`,
            background: "rgba(255,255,255,0.02)",
          }}
        >
          {/* Detail header */}
          <div
            className="pt-4 mb-4 text-[8px] tracking-[0.3em] uppercase flex items-center gap-2"
            style={{
              color: domainStyle.color,
              fontFamily: "Geist Mono, monospace",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: domainStyle.color,
                display: "inline-block",
              }}
            />
            SIGNAL DETAIL
          </div>

          {/* Full insight */}
          <p
            className="text-[11px] leading-relaxed mb-4"
            style={{
              color: "rgba(255,255,255,0.55)",
              fontFamily: "Sora, sans-serif",
            }}
          >
            {detail.full}
          </p>

          {/* Implications */}
          <div className="mb-4 space-y-2">
            {detail.implications.map((imp) => (
              <div key={imp.slice(0, 30)} className="flex items-start gap-2">
                <span
                  style={{
                    color: domainStyle.color,
                    fontFamily: "Geist Mono, monospace",
                    fontSize: "9px",
                    marginTop: "2px",
                    flexShrink: 0,
                  }}
                >
                  ▸
                </span>
                <p
                  className="text-[10px] leading-relaxed"
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "Sora, sans-serif",
                  }}
                >
                  {imp}
                </p>
              </div>
            ))}
          </div>

          {/* Metadata grid */}
          <div
            className="grid grid-cols-2 gap-x-4 gap-y-2 pt-3 pb-1"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            {[
              { label: "SIGNAL CLASSIFICATION", value: domainStyle.label },
              { label: "INTELLIGENCE UNIT", value: domainStyle.source },
              { label: "PUBLISHED", value: formatFullDate(entry.timestamp) },
              {
                label: "STATUS",
                value: entry.isPublic ? "ACTIVE / PUBLISHED" : "INTERNAL DRAFT",
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <div
                  className="text-[7px] tracking-[0.2em] uppercase mb-0.5"
                  style={{
                    color: "rgba(255,255,255,0.2)",
                    fontFamily: "Geist Mono, monospace",
                  }}
                >
                  {label}
                </div>
                <div
                  className="text-[9px] tracking-[0.05em]"
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    fontFamily: "Geist Mono, monospace",
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Confidence bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span
                className="text-[7px] tracking-[0.2em] uppercase"
                style={{
                  color: "rgba(255,255,255,0.2)",
                  fontFamily: "Geist Mono, monospace",
                }}
              >
                CONFIDENCE LEVEL
              </span>
              <span
                className="text-[7px] tracking-[0.15em]"
                style={{
                  color: domainStyle.color,
                  fontFamily: "Geist Mono, monospace",
                }}
              >
                {entry.isFeatured ? "HIGH" : "CONFIRMED"}
              </span>
            </div>
            <div
              className="h-[3px] rounded-full"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: entry.isFeatured ? "85%" : "70%",
                  background: `linear-gradient(90deg, ${domainStyle.color}, ${domainStyle.color}60)`,
                  transition: "width 600ms ease 200ms",
                }}
              />
            </div>
          </div>

          {/* Signal strength detail row */}
          <div className="mt-3 flex items-center justify-between">
            <span
              className="text-[7px] tracking-[0.2em] uppercase"
              style={{
                color: "rgba(255,255,255,0.2)",
                fontFamily: "Geist Mono, monospace",
              }}
            >
              SIGNAL STRENGTH
            </span>
            <div className="flex items-center gap-2">
              <SignalStrength color={domainStyle.color} strength={strength} />
              <span
                style={{
                  fontFamily: "Geist Mono, monospace",
                  fontSize: "8px",
                  color: domainStyle.color,
                  letterSpacing: "0.1em",
                }}
              >
                {strength}/5
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sort mode selector ────────────────────────────────────────────────────────
type SortMode = "LATEST" | "SIGNAL STRENGTH" | "DOMAIN";

const SORT_MODES: SortMode[] = ["LATEST", "SIGNAL STRENGTH", "DOMAIN"];

function SortSelector({
  active,
  onChange,
}: {
  active: SortMode;
  onChange: (m: SortMode) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "4px",
        padding: "4px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "2px",
        width: "fit-content",
        position: "relative",
      }}
    >
      {SORT_MODES.map((mode) => {
        const isActive = active === mode;
        return (
          <button
            key={mode}
            type="button"
            data-ocid="feed.sort.tab"
            onClick={() => onChange(mode)}
            style={{
              position: "relative",
              padding: "4px 10px",
              borderRadius: "1px",
              fontFamily: "Geist Mono, monospace",
              fontSize: "9px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              cursor: "pointer",
              background: isActive ? "rgba(212,160,23,0.1)" : "transparent",
              border: `1px solid ${isActive ? "rgba(212,160,23,0.35)" : "transparent"}`,
              color: isActive ? "#d4a017" : "rgba(255,255,255,0.3)",
              transition: "all 200ms",
              boxShadow: isActive ? "0 0 8px rgba(212,160,23,0.1)" : "none",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(255,255,255,0.6)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(255,255,255,0.3)";
              }
            }}
          >
            {mode}
            {isActive && (
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "60%",
                  height: "2px",
                  background: "#d4a017",
                  boxShadow: "0 0 6px rgba(212,160,23,0.5)",
                  transition:
                    "left 250ms cubic-bezier(0.16, 1, 0.3, 1), width 250ms",
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Animated count-up display ─────────────────────────────────────────────────
function AnimatedCount({
  target,
  visible,
}: { target: number; visible: boolean }) {
  const [displayed, setDisplayed] = useState(0);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!visible) return;
    const duration = 1200;
    const steps = 30;
    const step = target / steps;
    let current = 0;
    let i = 0;

    animRef.current = setInterval(() => {
      i++;
      current = Math.min(Math.round(step * i), target);
      setDisplayed(current);
      if (current >= target && animRef.current) {
        clearInterval(animRef.current);
        animRef.current = null;
      }
    }, duration / steps);

    return () => {
      if (animRef.current) clearInterval(animRef.current);
    };
  }, [target, visible]);

  return (
    <span
      style={{
        animation: visible
          ? "count-up-glow 2s ease-in-out 1.2s infinite"
          : "none",
      }}
    >
      {displayed}
    </span>
  );
}

// ─── Category filter ──────────────────────────────────────────────────────────
const CATEGORIES = [
  "ALL",
  "AI",
  "Climate",
  "Technology",
  "Policy",
  "Research",
  "Global Systems",
];

function CategoryFilter({
  active,
  onChange,
  counts,
}: {
  active: string;
  onChange: (c: string) => void;
  counts: Record<string, number>;
}) {
  return (
    <div
      className="flex items-center gap-2 overflow-x-auto pb-1"
      style={{ scrollbarWidth: "none" }}
    >
      {CATEGORIES.map((cat) => {
        const style =
          cat === "ALL"
            ? {
                color: "#d4a017",
                bg: "rgba(212,160,23,0.1)",
                border: "rgba(212,160,23,0.4)",
              }
            : (() => {
                const ds = getDomainStyle(cat);
                return { color: ds.color, bg: ds.bg, border: ds.color };
              })();
        const isActive = active === cat;
        const count = counts[cat] ?? 0;
        return (
          <button
            key={cat}
            type="button"
            data-ocid={`feed.${cat.toLowerCase().replace(/\s/g, "_")}.tab`}
            onClick={() => onChange(cat)}
            className="flex-shrink-0 px-3 py-1 rounded-[2px] transition-all duration-200"
            style={{
              fontFamily: "Geist Mono, monospace",
              fontSize: "9px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              background: isActive ? style.bg : "transparent",
              border: `1px solid ${isActive ? style.border : "rgba(255,255,255,0.1)"}`,
              color: isActive ? style.color : "rgba(255,255,255,0.3)",
              cursor: "pointer",
            }}
          >
            {cat}
            {cat !== "ALL" && count > 0 && (
              <span style={{ marginLeft: "4px", opacity: 0.6 }}>({count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
interface IntelligenceFeedProps {
  onOpenLibrary?: () => void;
}

export default function IntelligenceFeed({
  onOpenLibrary,
}: IntelligenceFeedProps) {
  const { data: featured, isLoading: featuredLoading } = useGetFeaturedFeeds();
  const { data: publicFeeds, isLoading: publicLoading } = useGetPublicFeeds();
  const isLoading = featuredLoading || publicLoading;
  const { count: bookmarkCount } = useBookmarks();

  const [activeCategory, setActiveCategory] = useState("ALL");
  const [sortMode, setSortMode] = useState<SortMode>("LATEST");
  const [sectionVisible, setSectionVisible] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll activation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Simulate periodic sync
  useEffect(() => {
    const t = setInterval(() => setLastSync(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const allFeeds: FeedEntry[] = useMemo(() => {
    if (!featured && !publicFeeds) return FALLBACK_FEEDS;
    const merged = [...(featured || []), ...(publicFeeds || [])];
    const seen = new Set<string>();
    const unique = merged.filter((f) => {
      const key = String(f.id);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return unique.length > 0 ? unique : FALLBACK_FEEDS;
  }, [featured, publicFeeds]);

  // Apply category filter then sort
  const filteredAndSorted = useMemo(() => {
    let feeds =
      activeCategory === "ALL"
        ? [...allFeeds]
        : allFeeds.filter((f) => f.domain === activeCategory);

    if (sortMode === "LATEST") {
      feeds.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
    } else if (sortMode === "SIGNAL STRENGTH") {
      feeds.sort((a, b) => {
        const sa = deriveSignalStrength(a);
        const sb = deriveSignalStrength(b);
        if (sb !== sa) return sb - sa;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
    } else if (sortMode === "DOMAIN") {
      feeds.sort((a, b) => {
        const dc = a.domain.localeCompare(b.domain);
        if (dc !== 0) return dc;
        return a.title.localeCompare(b.title);
      });
    }

    return feeds;
  }, [allFeeds, activeCategory, sortMode]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const f of allFeeds) {
      map[f.domain] = (map[f.domain] || 0) + 1;
    }
    return map;
  }, [allFeeds]);

  const syncTime = `${lastSync.getHours().toString().padStart(2, "0")}:${lastSync.getMinutes().toString().padStart(2, "0")} UTC`;

  return (
    <>
      {/* Keyframes */}
      <style>{`
        @keyframes signal-ring-pulse {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes signal-bar-breathe {
          0% { transform: scaleY(1); }
          100% { transform: scaleY(1.3); }
        }
        @keyframes card-scan-sweep {
          0% { top: -2px; }
          100% { top: calc(100% + 2px); }
        }
        @keyframes header-scan {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes status-dot-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
        @keyframes live-dot-pulse {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 8px rgba(52,211,153,0.6); }
          50% { opacity: 0.6; transform: scale(0.7); box-shadow: 0 0 4px rgba(52,211,153,0.3); }
        }
        @keyframes grid-slide-in {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes bookmark-bounce {
          0% { transform: scale(1); }
          40% { transform: scale(0.8); }
          70% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes rank-badge-enter {
          0% { opacity: 0; transform: translateX(-8px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes count-up-glow {
          0%, 100% { text-shadow: 0 0 8px rgba(74,126,247,0.4); }
          50% { text-shadow: 0 0 16px rgba(74,126,247,0.8); }
        }
        @keyframes signal-count-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>

      <section
        data-ocid="feed.section"
        id="feed"
        ref={sectionRef}
        className="relative py-24 px-6"
        style={{ background: "rgba(4,5,14,0.98)" }}
      >
        {/* Ambient background grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(74,126,247,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(74,126,247,0.025) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(74,126,247,0.04) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-7xl mx-auto relative">
          {/* ── TELEMETRY COMMAND BOARD HEADER ── */}
          <div
            className="mb-10"
            style={{
              opacity: sectionVisible ? 1 : 0,
              transition: "opacity 500ms ease",
            }}
          >
            {/* Top rule */}
            <div
              style={{
                height: "1px",
                background:
                  "linear-gradient(90deg, rgba(212,160,23,0.5), rgba(74,126,247,0.3), transparent)",
                marginBottom: "16px",
              }}
            />

            {/* Command header bar */}
            <div
              className="relative overflow-hidden rounded-[2px] px-5 py-4 mb-6"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Animated scan line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  width: "60px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(74,126,247,0.1), transparent)",
                  animation: "header-scan 3s linear infinite",
                  pointerEvents: "none",
                }}
              />

              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Left: Title + LIVE dot */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#34d399",
                        boxShadow: "0 0 8px rgba(52,211,153,0.6)",
                        animation: "live-dot-pulse 2s ease-in-out infinite",
                      }}
                    />
                    <span
                      className="text-[9px] tracking-[0.35em] uppercase"
                      style={{
                        color: "rgba(212,160,23,0.8)",
                        fontFamily: "Geist Mono, monospace",
                      }}
                    >
                      ◆ LIVE INTELLIGENCE FEED SIGNALS
                    </span>
                    <span
                      style={{
                        fontFamily: "Geist Mono, monospace",
                        fontSize: "9px",
                        color: "rgba(255,255,255,0.5)",
                        animation: "blink-cursor 1s step-end infinite",
                      }}
                    >
                      ▌
                    </span>
                  </div>
                </div>

                {/* Right: animated signal count + view library */}
                <div className="flex items-center gap-3">
                  {isLoading ? (
                    <span
                      data-ocid="feed.loading_state"
                      className="text-[9px]"
                      style={{
                        color: "rgba(255,255,255,0.3)",
                        fontFamily: "Geist Mono, monospace",
                      }}
                    >
                      RETRIEVING...
                    </span>
                  ) : (
                    <span
                      className="px-2 py-0.5 rounded-[1px] text-[9px] tracking-[0.2em] uppercase"
                      style={{
                        background: "rgba(74,126,247,0.1)",
                        border: "1px solid rgba(74,126,247,0.25)",
                        color: "#4a7ef7",
                        fontFamily: "Geist Mono, monospace",
                      }}
                    >
                      <AnimatedCount
                        target={allFeeds.length}
                        visible={sectionVisible}
                      />{" "}
                      SIGNALS ACTIVE
                    </span>
                  )}

                  {/* View Library button */}
                  {bookmarkCount > 0 && onOpenLibrary && (
                    <button
                      type="button"
                      data-ocid="feed.library.button"
                      onClick={onOpenLibrary}
                      style={{
                        fontFamily: "Geist Mono, monospace",
                        fontSize: "8px",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        padding: "3px 8px",
                        borderRadius: "1px",
                        background: "rgba(212,160,23,0.08)",
                        border: "1px solid rgba(212,160,23,0.35)",
                        color: "#d4a017",
                        cursor: "pointer",
                        transition: "all 200ms",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "rgba(212,160,23,0.15)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                          "0 0 12px rgba(212,160,23,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "rgba(212,160,23,0.08)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                          "none";
                      }}
                    >
                      ◆ VIEW LIBRARY ({bookmarkCount})
                    </button>
                  )}
                </div>
              </div>

              {/* Status bar — 4 items including BOOKMARKED count */}
              <div
                className="mt-3 pt-3 flex flex-wrap items-center gap-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
              >
                {[
                  {
                    label: "SIGNAL NETWORK",
                    value: "ACTIVE",
                    color: "#34d399",
                  },
                  {
                    label: "LAST SYNC",
                    value: syncTime,
                    color: "rgba(255,255,255,0.4)",
                  },
                  {
                    label: "INTELLIGENCE HUB",
                    value: "STEAMI",
                    color: "#d4a017",
                  },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span
                      className="text-[8px] tracking-[0.2em] uppercase"
                      style={{
                        color: "rgba(255,255,255,0.25)",
                        fontFamily: "Geist Mono, monospace",
                      }}
                    >
                      {label}:
                    </span>
                    <span
                      className="text-[8px] tracking-[0.15em]"
                      style={{ color, fontFamily: "Geist Mono, monospace" }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
                {/* Bookmarked count — live */}
                <div className="flex items-center gap-2">
                  <span
                    className="text-[8px] tracking-[0.2em] uppercase"
                    style={{
                      color: "rgba(255,255,255,0.25)",
                      fontFamily: "Geist Mono, monospace",
                    }}
                  >
                    BOOKMARKED:
                  </span>
                  <span
                    className="text-[8px] tracking-[0.15em]"
                    style={{
                      color:
                        bookmarkCount > 0 ? "#d4a017" : "rgba(255,255,255,0.2)",
                      fontFamily: "Geist Mono, monospace",
                      transition: "color 300ms",
                    }}
                  >
                    {bookmarkCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Title block */}
            <div className="mb-8">
              <h2
                className="font-display font-light leading-none mb-2"
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  letterSpacing: "0.04em",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Signal Intelligence
              </h2>
              <p
                className="text-xs"
                style={{
                  color: "rgba(255,255,255,0.3)",
                  fontFamily: "Sora, sans-serif",
                  maxWidth: "520px",
                  lineHeight: 1.7,
                }}
              >
                Real-time intelligence synthesis from STEAMI's global monitoring
                network. Each signal represents a synthesised insight from
                cross-domain research, policy analysis, and institutional
                intelligence tracking.
              </p>
            </div>

            {/* Sort mode + Category filter row */}
            <div
              className="flex flex-col gap-3"
              style={{
                opacity: sectionVisible ? 1 : 0,
                transform: sectionVisible ? "translateY(0)" : "translateY(8px)",
                transition:
                  "opacity 500ms ease 200ms, transform 500ms ease 200ms",
              }}
            >
              {/* Sort mode selector */}
              <div className="flex items-center gap-3">
                <span
                  style={{
                    fontFamily: "Geist Mono, monospace",
                    fontSize: "8px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.2)",
                    whiteSpace: "nowrap",
                  }}
                >
                  SORT BY
                </span>
                <SortSelector active={sortMode} onChange={setSortMode} />
              </div>

              {/* Category filter */}
              <CategoryFilter
                active={activeCategory}
                onChange={setActiveCategory}
                counts={counts}
              />
            </div>
          </div>

          {/* ── SIGNAL GRID ── */}
          {isLoading ? (
            <div
              data-ocid="feed.loading_state"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {([0, 0.15, 0.3, 0.45, 0.6, 0.75] as const).map((delay) => (
                <div
                  key={`skel-delay-${delay}`}
                  className="h-64 rounded-[2px]"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    animation: `status-dot-pulse 1.5s ease-in-out ${delay}s infinite`,
                  }}
                />
              ))}
            </div>
          ) : filteredAndSorted.length === 0 ? (
            <div data-ocid="feed.empty_state" className="py-16 text-center">
              <div
                className="text-[10px] tracking-[0.3em] uppercase"
                style={{
                  color: "rgba(255,255,255,0.2)",
                  fontFamily: "Geist Mono, monospace",
                }}
              >
                NO SIGNALS IN THIS CATEGORY
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
              {filteredAndSorted.map((entry, i) => (
                <SignalCard
                  key={String(entry.id)}
                  entry={entry}
                  index={i}
                  visible={sectionVisible}
                  rank={sortMode === "SIGNAL STRENGTH" ? i + 1 : undefined}
                  showRank={sortMode === "SIGNAL STRENGTH"}
                  onOpenLibrary={onOpenLibrary}
                />
              ))}
            </div>
          )}

          {/* Bottom attribution line */}
          <div
            className="mt-12 pt-6 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
          >
            <span
              className="text-[8px] tracking-[0.25em] uppercase"
              style={{
                color: "rgba(255,255,255,0.15)",
                fontFamily: "Geist Mono, monospace",
              }}
            >
              STEAMI INTELLIGENCE HUB — STEMONEF ENTERPRISES
            </span>
            <span
              className="text-[8px] tracking-[0.15em]"
              style={{
                color: "rgba(74,126,247,0.3)",
                fontFamily: "Geist Mono, monospace",
              }}
            >
              SIGNAL NETWORK ACTIVE
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
