import type { FeedEntry } from "../backend.d";
import { useGetFeaturedFeeds, useGetPublicFeeds } from "../hooks/useQueries";

const FALLBACK_FEEDS: FeedEntry[] = [
  {
    id: 1n,
    title: "Global Ecological Tipping Points — 2026 Analysis",
    domain: "Climate",
    summary:
      "TERRA's latest synthesis maps seventeen active planetary tipping cascades with unprecedented resolution, revealing critical intervention windows closing faster than prior models predicted.",
    isFeatured: true,
    timestamp: BigInt(Date.now() - 3600000),
    isPublic: true,
  },
  {
    id: 2n,
    title: "Ethical AI Governance: Beyond Principles to Enforcement",
    domain: "AI",
    summary:
      "STEAMI's policy translation unit presents a structural framework for binding ethical AI standards, moving from aspirational principles toward enforceable institutional mechanisms.",
    isFeatured: true,
    timestamp: BigInt(Date.now() - 7200000),
    isPublic: true,
  },
  {
    id: 3n,
    title: "HUMANON Fellows Cohort IV — Field Deployment Report",
    domain: "Research",
    summary:
      "Forty-two new fellows deployed across nineteen countries, focusing on health system resilience, agricultural adaptation, and community-led climate response.",
    isFeatured: false,
    timestamp: BigInt(Date.now() - 86400000),
    isPublic: true,
  },
  {
    id: 4n,
    title: "Strategic Foresight: Post-Growth Economic Models",
    domain: "Research",
    summary:
      "Intelligence brief examining ten emerging post-growth economic frameworks and their structural compatibility with STEMONEF's equity and sustainability mandates.",
    isFeatured: true,
    timestamp: BigInt(Date.now() - 172800000),
    isPublic: true,
  },
  {
    id: 5n,
    title: "EQUIS Impact Fund — Q1 2026 Portfolio Review",
    domain: "Research",
    summary:
      "First quarter review of impact-weighted investments across deep technology, ethical media, and sustainable agriculture sectors. 23% above impact benchmark targets.",
    isFeatured: false,
    timestamp: BigInt(Date.now() - 259200000),
    isPublic: true,
  },
  {
    id: 6n,
    title: "Bioethics in the Age of Neural Interfaces",
    domain: "Ethics",
    summary:
      "ETHOS publishes a foundational review of consent, cognitive sovereignty, and institutional accountability as neural interface technologies approach clinical deployment scale.",
    isFeatured: false,
    timestamp: BigInt(Date.now() - 345600000),
    isPublic: true,
  },
];

const DOMAIN_STYLES: Record<
  string,
  { color: string; bg: string; label: string }
> = {
  Climate: {
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    label: "Climate",
  },
  AI: {
    color: "#4a7ef7",
    bg: "rgba(74,126,247,0.1)",
    label: "Artificial Intelligence",
  },
  Health: {
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
    label: "Health",
  },
  Education: {
    color: "#d4a017",
    bg: "rgba(212,160,23,0.1)",
    label: "Education",
  },
  Ethics: {
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.1)",
    label: "Ethics",
  },
  Research: {
    color: "#22d3ee",
    bg: "rgba(34,211,238,0.1)",
    label: "Research",
  },
};

function getDomainStyle(domain: string) {
  return (
    DOMAIN_STYLES[domain] || {
      color: "#94a3b8",
      bg: "rgba(148,163,184,0.1)",
      label: domain,
    }
  );
}

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts);
  if (ms > 1e12) {
    const date = new Date(ms);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  return "Recent";
}

function FeedCard({
  entry,
  index,
}: {
  entry: FeedEntry;
  index: number;
}) {
  const domainStyle = getDomainStyle(entry.domain);

  return (
    <article
      data-ocid={`feed.item.${index + 1}`}
      className="group p-6 rounded-sm transition-all duration-300 cursor-pointer h-full flex flex-col"
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: entry.isFeatured
          ? "1px solid rgba(212,160,23,0.2)"
          : "1px solid rgba(255,255,255,0.06)",
        boxShadow: entry.isFeatured ? "0 0 20px rgba(212,160,23,0.08)" : "none",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "rgba(255,255,255,0.05)";
        el.style.borderColor = entry.isFeatured
          ? "rgba(212,160,23,0.4)"
          : "rgba(255,255,255,0.1)";
        el.style.boxShadow = entry.isFeatured
          ? "0 0 30px rgba(212,160,23,0.15)"
          : `0 0 20px ${domainStyle.bg}`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "rgba(255,255,255,0.03)";
        el.style.borderColor = entry.isFeatured
          ? "rgba(212,160,23,0.2)"
          : "rgba(255,255,255,0.06)";
        el.style.boxShadow = entry.isFeatured
          ? "0 0 20px rgba(212,160,23,0.08)"
          : "none";
      }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-[9px] tracking-[0.25em] uppercase px-2 py-0.5 rounded-sm"
          style={{
            color: domainStyle.color,
            background: domainStyle.bg,
            fontFamily: "Geist Mono, monospace",
          }}
        >
          {entry.domain}
        </span>
        <div className="flex items-center gap-2">
          {entry.isFeatured && (
            <span
              className="text-[8px] tracking-[0.2em] uppercase"
              style={{
                color: "rgba(212,160,23,0.8)",
                fontFamily: "Geist Mono, monospace",
              }}
            >
              ◆ FEATURED
            </span>
          )}
          <span
            className="text-[9px]"
            style={{
              color: "rgba(255,255,255,0.25)",
              fontFamily: "Geist Mono, monospace",
            }}
          >
            {formatTimestamp(entry.timestamp)}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3
        className="font-serif-instrument text-base leading-snug mb-3 transition-colors duration-200"
        style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.4 }}
      >
        {entry.title}
      </h3>

      {/* Summary */}
      <p
        className="text-xs leading-relaxed flex-1 line-clamp-3"
        style={{
          color: "rgba(255,255,255,0.4)",
          fontFamily: "Sora, sans-serif",
        }}
      >
        {entry.summary}
      </p>

      {/* Footer */}
      <div
        className="mt-4 pt-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <span
          className="text-[10px] tracking-widest uppercase transition-colors duration-200"
          style={{
            color: domainStyle.color,
            opacity: 0.7,
            fontFamily: "Geist Mono, monospace",
          }}
        >
          Read Intelligence Brief →
        </span>
      </div>
    </article>
  );
}

export default function IntelligenceFeed() {
  const { data: featured, isLoading: featuredLoading } = useGetFeaturedFeeds();
  const { data: publicFeeds, isLoading: publicLoading } = useGetPublicFeeds();

  const isLoading = featuredLoading || publicLoading;

  // Merge and deduplicate by id
  const allFeeds: FeedEntry[] = (() => {
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
  })();

  return (
    <section data-ocid="feed.section" id="feed" className="relative py-28 px-6">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(74,126,247,0.03) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Editorial masthead — newspaper intelligence brief layout */}
        <div className="mb-14">
          {/* Top rule with metadata */}
          <div
            className="flex items-center gap-4 mb-6"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: "20px",
            }}
          >
            <span
              className="font-mono-geist text-[9px] tracking-[0.4em] uppercase"
              style={{ color: "rgba(212,160,23,0.7)", whiteSpace: "nowrap" }}
            >
              ◆ LIVE INTELLIGENCE
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
            <span
              className="font-mono-geist text-[9px]"
              style={{
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.08em",
                whiteSpace: "nowrap",
              }}
            >
              {isLoading ? (
                <span data-ocid="feed.loading_state">RETRIEVING...</span>
              ) : (
                <span>{allFeeds.length} SIGNALS ACTIVE</span>
              )}
            </span>
          </div>

          {/* Masthead row: vertical rotated label + headline */}
          <div className="flex items-end gap-6">
            {/* Vertical "INTELLIGENCE" label — editorial signature */}
            <div
              className="hidden md:flex flex-col items-center gap-1 flex-shrink-0 pb-1"
              style={{ height: "100px" }}
            >
              <div
                className="font-mono-geist text-[8px] tracking-[0.4em] uppercase"
                style={{
                  color: "rgba(255,255,255,0.12)",
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  transform: "rotate(180deg)",
                  letterSpacing: "0.35em",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                INTELLIGENCE
              </div>
              <div
                className="w-px flex-1"
                style={{ background: "rgba(74,126,247,0.3)" }}
              />
            </div>

            {/* Main headline block */}
            <div className="flex-1">
              <h2
                className="font-display font-light"
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 5rem)",
                  letterSpacing: "0.06em",
                  lineHeight: 0.9,
                  background:
                    "linear-gradient(135deg, #4a7ef7 0%, #8ab4ff 40%, #ffffff 70%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Intelligence
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontStyle: "italic",
                  }}
                >
                  Feed
                </span>
              </h2>
            </div>

            {/* Right column: dateline block */}
            <div
              className="hidden lg:flex flex-col gap-1 text-right pb-1"
              style={{ flexShrink: 0, minWidth: "160px" }}
            >
              <div
                className="font-mono-geist text-[9px] tracking-[0.2em] uppercase"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                STEMONEF / STEAMI
              </div>
              <div
                className="font-mono-geist text-[9px] tracking-[0.2em] uppercase"
                style={{ color: "rgba(255,255,255,0.15)" }}
              >
                {new Date()
                  .toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                  .toUpperCase()}
              </div>
              <div
                className="mt-1 h-px w-full"
                style={{ background: "rgba(212,160,23,0.25)" }}
              />
              <div
                className="font-mono-geist text-[9px] tracking-[0.2em] uppercase mt-1"
                style={{ color: "rgba(212,160,23,0.5)" }}
              >
                PUBLIC EDITION
              </div>
            </div>
          </div>

          {/* Bottom rule */}
          <div
            className="mt-6"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          />
        </div>

        {/* Feed grid */}
        {isLoading ? (
          <div
            data-ocid="feed.loading_state"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {Array.from({ length: 6 }).map((_item, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders with no stable ID
                key={i}
                className="h-48 rounded-sm"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  animation: `node-pulse 1.5s ease-in-out ${i * 0.1}s infinite`,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allFeeds.slice(0, 9).map((entry, i) => (
              <FeedCard key={String(entry.id)} entry={entry} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
