import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Check, Loader2, LogOut, Pencil, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { FeedEntry, Pillar } from "../backend.d";
import { useBookmarks } from "../hooks/useBookmarks";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetAllPillars,
  useGetCallerUserProfile,
  useGetFeaturedFeeds,
  useGetPublicFeeds,
  useLogPathwayInterest,
  useSaveCallerUserProfile,
} from "../hooks/useQueries";

interface UserDashboardProps {
  onGoHome: () => void;
}

const PATHWAYS = [
  { label: "Research & Innovation", color: "rgba(74,126,247,0.9)" },
  { label: "Talent & Field Growth", color: "rgba(212,160,23,0.9)" },
  { label: "Intelligence & Policy", color: "rgba(74,126,247,0.9)" },
  { label: "Climate & Sustainability", color: "rgba(52,211,153,0.9)" },
  { label: "Media & Storytelling", color: "rgba(212,160,23,0.9)" },
  { label: "Equity & Support", color: "rgba(52,211,153,0.9)" },
] as const;

const DOMAIN_COLORS: Record<string, { bg: string; text: string }> = {
  Climate: {
    bg: "rgba(52,211,153,0.1)",
    text: "rgba(52,211,153,0.9)",
  },
  AI: { bg: "rgba(74,126,247,0.1)", text: "rgba(74,126,247,0.9)" },
  Research: {
    bg: "rgba(212,160,23,0.1)",
    text: "rgba(212,160,23,0.9)",
  },
  Health: { bg: "rgba(248,113,113,0.1)", text: "rgba(248,113,113,0.8)" },
  Ethics: { bg: "rgba(167,139,250,0.1)", text: "rgba(167,139,250,0.9)" },
};

function getDomainColors(domain: string) {
  return (
    DOMAIN_COLORS[domain] ?? {
      bg: "rgba(74,126,247,0.08)",
      text: "rgba(74,126,247,0.8)",
    }
  );
}

function ProfileCard() {
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const displayName = profile?.name || "MEMBER";

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleEdit = () => {
    setNameInput(profile?.name ?? "");
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setNameInput("");
  };

  const handleSave = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      toast.error("Name cannot be empty");
      return;
    }
    try {
      await saveProfile.mutateAsync({ name: trimmed });
      setEditing(false);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div
      className="rounded-sm p-6 relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Ambient glow accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(212,160,23,0.5), transparent)",
        }}
      />

      <div
        className="font-mono-geist text-[9px] tracking-[0.4em] uppercase mb-4"
        style={{ color: "rgba(212,160,23,0.55)" }}
      >
        ◆ MEMBER PROFILE
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton
            className="h-6 w-48"
            style={{ background: "rgba(255,255,255,0.05)" }}
          />
          <Skeleton
            className="h-4 w-32"
            style={{ background: "rgba(255,255,255,0.03)" }}
          />
        </div>
      ) : (
        <div className="flex items-center gap-4">
          {/* Avatar monogram */}
          <div
            className="flex-shrink-0 w-12 h-12 rounded-sm flex items-center justify-center text-lg font-display"
            style={{
              background: "rgba(74,126,247,0.12)",
              border: "1px solid rgba(74,126,247,0.25)",
              color: "rgba(74,126,247,0.9)",
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {editing ? (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    data-ocid="dashboard.profile.input"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void handleSave();
                      if (e.key === "Escape") handleCancel();
                    }}
                    placeholder="Your name"
                    className="flex-1 px-3 py-1.5 text-sm rounded-sm font-mono-geist"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(74,126,247,0.4)",
                      color: "rgba(255,255,255,0.9)",
                      outline: "none",
                      maxWidth: "240px",
                    }}
                  />
                  <button
                    type="button"
                    data-ocid="dashboard.profile.save_button"
                    onClick={() => void handleSave()}
                    disabled={saveProfile.isPending}
                    className="p-1.5 rounded-sm transition-all duration-200 flex items-center gap-1.5"
                    style={{
                      background: "rgba(52,211,153,0.1)",
                      border: "1px solid rgba(52,211,153,0.3)",
                      color: "rgba(52,211,153,0.9)",
                      cursor: saveProfile.isPending ? "not-allowed" : "pointer",
                    }}
                    title="Save"
                  >
                    {saveProfile.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    data-ocid="dashboard.profile.cancel_button"
                    onClick={handleCancel}
                    className="p-1.5 rounded-sm transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.4)",
                      cursor: "pointer",
                    }}
                    title="Cancel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="display"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex items-center gap-3"
                >
                  <span
                    className="font-display text-xl font-light tracking-wide"
                    style={{ color: "rgba(255,255,255,0.9)" }}
                  >
                    {displayName}
                  </span>
                  <button
                    type="button"
                    data-ocid="dashboard.profile.edit_button"
                    onClick={handleEdit}
                    className="p-1.5 rounded-sm transition-all duration-200 opacity-40 hover:opacity-90"
                    style={{
                      background: "none",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.8)",
                      cursor: "pointer",
                    }}
                    title="Edit name"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {!editing && (
              <div
                className="font-mono-geist text-[9px] tracking-[0.25em] uppercase mt-1"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                STEMONEF MEMBER
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FeedCard({ entry, index }: { entry: FeedEntry; index: number }) {
  const colors = getDomainColors(entry.domain);
  return (
    <motion.div
      data-ocid={`dashboard.feeds.item.${index}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="rounded-sm p-5 flex flex-col gap-3 group transition-all duration-300 h-full"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background =
          "rgba(255,255,255,0.05)";
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(74,126,247,0.2)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 0 20px rgba(74,126,247,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background =
          "rgba(255,255,255,0.03)";
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(255,255,255,0.06)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Domain badge */}
      <span
        className="self-start font-mono-geist text-[9px] tracking-[0.25em] uppercase px-2 py-0.5 rounded-sm"
        style={{ background: colors.bg, color: colors.text }}
      >
        {entry.domain}
      </span>

      {/* Title */}
      <h3
        className="font-display text-base font-light leading-snug line-clamp-2"
        style={{ color: "rgba(255,255,255,0.88)" }}
      >
        {entry.title}
      </h3>

      {/* Summary */}
      <p
        className="font-sans text-xs leading-relaxed line-clamp-3 flex-1"
        style={{ color: "rgba(255,255,255,0.45)" }}
      >
        {entry.summary}
      </p>

      {/* Subtle featured indicator */}
      {entry.isFeatured && (
        <div
          className="font-mono-geist text-[8px] tracking-[0.3em] uppercase"
          style={{ color: "rgba(212,160,23,0.55)" }}
        >
          ◆ FEATURED SIGNAL
        </div>
      )}
    </motion.div>
  );
}

function PillarCard({ pillar, index }: { pillar: Pillar; index: number }) {
  return (
    <motion.div
      data-ocid={`dashboard.pillars.item.${index}`}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.08 + index * 0.05, duration: 0.35 }}
      className="rounded-sm p-4 flex flex-col gap-2 transition-all duration-300 cursor-default"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background =
          "rgba(74,126,247,0.06)";
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(74,126,247,0.22)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 0 18px rgba(74,126,247,0.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background =
          "rgba(255,255,255,0.025)";
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(255,255,255,0.06)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      <div
        className="font-mono-geist text-[9px] tracking-[0.3em] uppercase"
        style={{ color: "rgba(74,126,247,0.7)" }}
      >
        {String(index).padStart(2, "0")}
      </div>
      <div
        className="font-display text-sm font-light tracking-wider"
        style={{ color: "rgba(255,255,255,0.85)" }}
      >
        {pillar.name}
      </div>
      <p
        className="font-sans text-[11px] leading-relaxed line-clamp-2"
        style={{ color: "rgba(255,255,255,0.38)" }}
      >
        {pillar.mandate}
      </p>
    </motion.div>
  );
}

function IntelligenceSection() {
  const { data: feeds, isLoading } = useGetFeaturedFeeds();
  const hasFeeds = (feeds ?? []).length > 0;

  return (
    <section data-ocid="dashboard.feeds.section">
      <SectionHeader label="INTELLIGENCE HIGHLIGHTS" accent="blue" />

      {isLoading ? (
        <div
          data-ocid="dashboard.feeds.loading_state"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5"
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-sm p-5 space-y-3"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <Skeleton
                className="h-5 w-20"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
              <Skeleton
                className="h-12 w-full"
                style={{ background: "rgba(255,255,255,0.04)" }}
              />
              <Skeleton
                className="h-16 w-full"
                style={{ background: "rgba(255,255,255,0.03)" }}
              />
            </div>
          ))}
        </div>
      ) : !hasFeeds ? (
        <div
          data-ocid="dashboard.feeds.empty_state"
          className="mt-5 rounded-sm py-12 text-center"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            className="font-mono-geist text-[10px] tracking-[0.3em] uppercase mb-2"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            NO INTELLIGENCE SIGNALS PUBLISHED
          </div>
          <div
            className="font-sans text-xs"
            style={{ color: "rgba(255,255,255,0.15)" }}
          >
            Check back soon for curated intelligence briefs.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {(feeds ?? []).slice(0, 6).map((entry, i) => (
            <FeedCard key={String(entry.id)} entry={entry} index={i + 1} />
          ))}
        </div>
      )}
    </section>
  );
}

function PillarsSection() {
  const { data: pillars, isLoading } = useGetAllPillars();

  return (
    <section data-ocid="dashboard.pillars.section">
      <SectionHeader label="ENTERPRISE PILLARS" accent="gold" />

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-5">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="rounded-sm p-4 space-y-2"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <Skeleton
                className="h-3 w-6"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
              <Skeleton
                className="h-4 w-24"
                style={{ background: "rgba(255,255,255,0.04)" }}
              />
              <Skeleton
                className="h-8 w-full"
                style={{ background: "rgba(255,255,255,0.03)" }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-5">
          {(pillars ?? []).map((pillar, i) => (
            <PillarCard key={String(pillar.id)} pillar={pillar} index={i + 1} />
          ))}
        </div>
      )}
    </section>
  );
}

function PathwaySection() {
  const logPathway = useLogPathwayInterest();
  const [activePathway, setActivePathway] = useState<string | null>(null);

  const handlePathwayClick = (label: string) => {
    setActivePathway(label);
    void logPathway.mutateAsync(label);
    toast.success(`Pathway selected: ${label}`, {
      description: "Your interest has been recorded.",
    });
  };

  return (
    <section>
      <SectionHeader label="MY ENGAGEMENT PATHWAYS" accent="gold" />
      <p
        className="font-sans text-xs mt-2 mb-5"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        Select a pathway to signal your area of interest within STEMONEF.
      </p>
      <div className="flex flex-wrap gap-3">
        {PATHWAYS.map((pw, i) => {
          const isActive = activePathway === pw.label;
          return (
            <button
              key={pw.label}
              type="button"
              data-ocid={`dashboard.pathway.button.${i + 1}`}
              onClick={() => handlePathwayClick(pw.label)}
              className="px-4 py-2.5 rounded-sm text-xs tracking-wider uppercase transition-all duration-250 font-mono-geist"
              style={{
                background: isActive
                  ? "rgba(74,126,247,0.12)"
                  : "rgba(255,255,255,0.03)",
                border: isActive
                  ? "1px solid rgba(74,126,247,0.45)"
                  : "1px solid rgba(255,255,255,0.08)",
                color: isActive ? pw.color : "rgba(255,255,255,0.5)",
                boxShadow: isActive ? "0 0 14px rgba(74,126,247,0.15)" : "none",
                cursor: "pointer",
                letterSpacing: "0.12em",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(255,255,255,0.15)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "rgba(255,255,255,0.75)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.03)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "rgba(255,255,255,0.5)";
                }
              }}
            >
              {pw.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

// ─── Domain color helper for library ──────────────────────────────────────────
const FEED_DOMAIN_COLORS_LIB: Record<string, { color: string; bg: string }> = {
  AI: { color: "#4a7ef7", bg: "rgba(74,126,247,0.1)" },
  Climate: { color: "#34d399", bg: "rgba(52,211,153,0.1)" },
  Technology: { color: "#22d3ee", bg: "rgba(34,211,238,0.1)" },
  Policy: { color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
  Research: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  "Global Systems": { color: "#d4a017", bg: "rgba(212,160,23,0.1)" },
};

function getLibDomainColor(domain: string) {
  return (
    FEED_DOMAIN_COLORS_LIB[domain] ?? {
      color: "#94a3b8",
      bg: "rgba(148,163,184,0.1)",
    }
  );
}

function deriveSignalStrengthLib(entry: FeedEntry): number {
  if (entry.isFeatured) return 5;
  const age = Date.now() - Number(entry.timestamp);
  if (age < 86400000) return 4;
  if (age < 259200000) return 3;
  if (age < 604800000) return 2;
  return 1;
}

function formatTimestampLib(ts: bigint): string {
  const ms = Number(ts);
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

function LibraryStrengthBars({
  strength,
  color,
}: { strength: number; color: string }) {
  return (
    <div className="flex items-end gap-[2px]">
      {([6, 8, 11, 14, 16] as const).map((h) => (
        <div
          key={`ls-${h}`}
          style={{
            width: "3px",
            height: `${h}px`,
            background: color,
            opacity: [6, 8, 11, 14, 16].indexOf(h) < strength ? 0.9 : 0.12,
            borderRadius: "1px",
          }}
        />
      ))}
    </div>
  );
}

function LibrarySignalCard({
  entry,
  index,
  onRemove,
}: { entry: FeedEntry; index: number; onRemove: (id: string) => void }) {
  const dc = getLibDomainColor(entry.domain);
  const strength = deriveSignalStrengthLib(entry);

  return (
    <motion.div
      data-ocid={`dashboard.library.item.${index + 1}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="relative rounded-[2px] overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderLeft: `2px solid ${dc.color}`,
      }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              style={{
                fontFamily: "Geist Mono, monospace",
                fontSize: "8px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "2px 6px",
                borderRadius: "1px",
                background: dc.bg,
                color: dc.color,
              }}
            >
              {entry.domain}
            </span>
            {entry.isFeatured && (
              <span
                style={{
                  fontFamily: "Geist Mono, monospace",
                  fontSize: "7px",
                  letterSpacing: "0.2em",
                  color: "#d4a017",
                }}
              >
                ◆ PRIORITY
              </span>
            )}
          </div>
          <button
            type="button"
            data-ocid={`dashboard.library.delete_button.${index + 1}`}
            onClick={() => onRemove(String(entry.id))}
            style={{
              fontFamily: "Geist Mono, monospace",
              fontSize: "7px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "2px 6px",
              borderRadius: "1px",
              background: "transparent",
              border: "1px solid rgba(248,113,113,0.2)",
              color: "rgba(248,113,113,0.45)",
              cursor: "pointer",
              flexShrink: 0,
              transition: "all 200ms",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(248,113,113,0.85)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(248,113,113,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(248,113,113,0.45)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(248,113,113,0.2)";
            }}
          >
            REMOVE
          </button>
        </div>

        <h3
          className="font-display text-sm font-light leading-snug mb-2"
          style={{ color: "rgba(255,255,255,0.88)" }}
        >
          {entry.title}
        </h3>

        <p
          className="font-sans text-[11px] leading-relaxed mb-3"
          style={{ color: "rgba(255,255,255,0.42)" }}
        >
          {entry.summary}
        </p>

        <div className="flex items-center justify-between">
          <span
            style={{
              fontFamily: "Geist Mono, monospace",
              fontSize: "8px",
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.1em",
            }}
          >
            ◷ {formatTimestampLib(entry.timestamp)} · STEAMI
          </span>
          <LibraryStrengthBars strength={strength} color={dc.color} />
        </div>
      </div>
    </motion.div>
  );
}

function LibrarySection({ allFeeds }: { allFeeds: FeedEntry[] }) {
  const { bookmarks, removeBookmark, clearAll, count } = useBookmarks();

  const bookmarkedEntries = allFeeds.filter((f) =>
    bookmarks.includes(String(f.id)),
  );

  return (
    <section data-ocid="dashboard.library.section">
      <div className="flex items-center justify-between mb-1">
        <SectionHeader label="MY SIGNAL LIBRARY" accent="gold" />
        {count > 0 && (
          <button
            type="button"
            data-ocid="dashboard.library.clear_button"
            onClick={clearAll}
            style={{
              fontFamily: "Geist Mono, monospace",
              fontSize: "7px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "3px 8px",
              borderRadius: "1px",
              background: "transparent",
              border: "1px solid rgba(248,113,113,0.2)",
              color: "rgba(248,113,113,0.35)",
              cursor: "pointer",
              marginBottom: "4px",
            }}
          >
            CLEAR ALL ({count})
          </button>
        )}
      </div>

      {count === 0 ? (
        <div
          data-ocid="dashboard.library.empty_state"
          className="mt-5 rounded-sm py-12 text-center"
          style={{
            background: "rgba(255,255,255,0.015)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div className="flex flex-col items-center gap-3">
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(212,160,23,0.05)",
                border: "1px solid rgba(212,160,23,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(212,160,23,0.4)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-label="Bookmark"
                role="img"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div
              className="font-mono-geist text-[10px] tracking-[0.3em] uppercase"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              YOUR LIBRARY IS EMPTY
            </div>
            <div
              className="font-sans text-xs max-w-xs"
              style={{ color: "rgba(255,255,255,0.15)", lineHeight: 1.7 }}
            >
              Bookmark signals from the Intelligence Feed to save them to your
              personal research library.
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          <AnimatePresence>
            {bookmarkedEntries.map((entry, i) => (
              <LibrarySignalCard
                key={String(entry.id)}
                entry={entry}
                index={i}
                onRemove={removeBookmark}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}

function SectionHeader({
  label,
  accent,
}: {
  label: string;
  accent: "blue" | "gold";
}) {
  return (
    <div className="flex items-center gap-4 mb-1">
      <div
        className="font-mono-geist text-[9px] tracking-[0.4em] uppercase"
        style={{
          color:
            accent === "gold"
              ? "rgba(212,160,23,0.6)"
              : "rgba(74,126,247,0.65)",
        }}
      >
        {label}
      </div>
      <div
        className="flex-1 h-px"
        style={{
          background:
            accent === "gold"
              ? "linear-gradient(90deg, rgba(212,160,23,0.25), transparent)"
              : "linear-gradient(90deg, rgba(74,126,247,0.2), transparent)",
        }}
      />
    </div>
  );
}

export default function UserDashboard({ onGoHome }: UserDashboardProps) {
  const { clear, identity } = useInternetIdentity();
  const { count: bookmarkCount } = useBookmarks();
  const { data: featuredFeeds } = useGetFeaturedFeeds();
  const { data: publicFeedsData } = useGetPublicFeeds();

  // Merge all feeds for library resolution
  const allFeedsForLib = (() => {
    const merged = [...(featuredFeeds || []), ...(publicFeedsData || [])];
    const seen = new Set<string>();
    return merged.filter((f) => {
      const key = String(f.id);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  })();

  const principalText = identity?.getPrincipal().toText() ?? "";
  const truncatedPrincipal =
    principalText.length > 24
      ? `${principalText.slice(0, 10)}...${principalText.slice(-6)}`
      : principalText;

  return (
    <div
      data-ocid="dashboard.panel"
      className="min-h-screen neural-grid-bg"
      style={{ background: "var(--neural-bg)" }}
    >
      {/* Top header bar */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(4,5,14,0.94)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Left: portal label */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            data-ocid="dashboard.home.button"
            onClick={onGoHome}
            className="flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs tracking-widest uppercase transition-all duration-200 font-mono-geist"
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.45)",
              cursor: "pointer",
              letterSpacing: "0.15em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(255,255,255,0.75)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(255,255,255,0.45)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(255,255,255,0.1)";
            }}
          >
            <ArrowLeft className="w-3 h-3" />
            HOMEPAGE
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <div
              className="w-1 h-1 rounded-full"
              style={{ background: "rgba(74,126,247,0.7)" }}
            />
            <span
              className="font-mono-geist text-[10px] tracking-[0.35em] uppercase"
              style={{ color: "rgba(74,126,247,0.7)" }}
            >
              USER PORTAL
            </span>
          </div>
        </div>

        {/* Right: user name + sign out */}
        <div className="flex items-center gap-4">
          <ProfileCard />
          <button
            type="button"
            data-ocid="dashboard.signout.button"
            onClick={clear}
            className="flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs tracking-widest uppercase transition-all duration-200 font-mono-geist"
            style={{
              background: "none",
              border: "1px solid rgba(248,113,113,0.2)",
              color: "rgba(248,113,113,0.55)",
              cursor: "pointer",
              letterSpacing: "0.15em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(248,113,113,0.85)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(248,113,113,0.45)";
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(248,113,113,0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(248,113,113,0.55)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(248,113,113,0.2)";
              (e.currentTarget as HTMLButtonElement).style.background = "none";
            }}
          >
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">SIGN OUT</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 pt-10 pb-16 space-y-12">
        {/* Welcome heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="font-mono-geist text-[9px] tracking-[0.45em] uppercase mb-3"
            style={{ color: "rgba(212,160,23,0.55)" }}
          >
            ◆ STEMONEF MEMBER ACCESS
          </div>
          <h1
            className="font-display text-4xl md:text-5xl font-light"
            style={{
              background:
                "linear-gradient(135deg, #4a7ef7 0%, #8ab4ff 45%, #ffffff 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "0.08em",
            }}
          >
            Welcome to the Portal
          </h1>
          <p
            className="font-sans text-sm mt-3 max-w-lg"
            style={{ color: "rgba(255,255,255,0.4)", lineHeight: "1.7" }}
          >
            Access curated intelligence, explore enterprise pillars, and signal
            your engagement pathway within the STEMONEF ecosystem.
          </p>
        </motion.div>

        {/* Profile + quick stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          <div className="lg:col-span-1">
            <ProfileCard />
          </div>

          {/* Status indicators */}
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "ACCESS LEVEL",
                value: "MEMBER",
                accent: "rgba(74,126,247,0.8)",
              },
              {
                label: "NETWORK STATUS",
                value: "ACTIVE",
                accent: "rgba(52,211,153,0.8)",
              },
              {
                label: "CLEARANCE",
                value: "PUBLIC",
                accent: "rgba(212,160,23,0.8)",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-sm p-5 flex flex-col gap-2"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="font-mono-geist text-[8px] tracking-[0.35em] uppercase"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {stat.label}
                </div>
                <div
                  className="font-mono-geist text-sm tracking-widest font-medium"
                  style={{ color: stat.accent }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
            {/* Bookmarks stat */}
            <div
              className="rounded-sm p-5 flex flex-col gap-2"
              style={{
                background:
                  bookmarkCount > 0
                    ? "rgba(212,160,23,0.04)"
                    : "rgba(255,255,255,0.025)",
                border: `1px solid ${bookmarkCount > 0 ? "rgba(212,160,23,0.15)" : "rgba(255,255,255,0.06)"}`,
                transition: "all 300ms",
              }}
            >
              <div
                className="font-mono-geist text-[8px] tracking-[0.35em] uppercase"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                BOOKMARKS
              </div>
              <div
                className="font-mono-geist text-sm tracking-widest font-medium"
                style={{
                  color:
                    bookmarkCount > 0 ? "#d4a017" : "rgba(255,255,255,0.25)",
                  transition: "color 300ms",
                }}
              >
                {bookmarkCount > 0 ? `${bookmarkCount} SAVED` : "NONE"}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Intelligence highlights */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18 }}
        >
          <IntelligenceSection />
        </motion.div>

        {/* Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
        >
          <PillarsSection />
        </motion.div>

        {/* My Signal Library */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
        >
          <LibrarySection allFeeds={allFeedsForLib} />
        </motion.div>

        {/* Pathways */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.38 }}
        >
          <PathwaySection />
        </motion.div>
      </main>

      {/* Footer bar */}
      <footer
        className="border-t py-5 px-6"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: "rgba(4,5,14,0.8)",
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div
            className="font-mono-geist text-[9px] tracking-[0.3em] uppercase"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            STEMONEF ENTERPRISES — MEMBER ACCESS
          </div>
          {truncatedPrincipal && (
            <div
              className="font-mono-geist text-[9px] tracking-wider"
              style={{ color: "rgba(255,255,255,0.15)" }}
              title={principalText}
            >
              ID: {truncatedPrincipal}
            </div>
          )}
          <div
            className="font-mono-geist text-[9px]"
            style={{ color: "rgba(255,255,255,0.12)" }}
          >
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              Built with caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
