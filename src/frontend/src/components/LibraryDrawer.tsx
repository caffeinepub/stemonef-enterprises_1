import { useEffect, useRef, useState } from "react";
import type { FeedEntry } from "../backend.d";
import { useBookmarks } from "../hooks/useBookmarks";

// ─── Domain styles (mirrors IntelligenceFeed) ─────────────────────────────────
const DOMAIN_COLORS: Record<string, { color: string; bg: string }> = {
  AI: { color: "#4a7ef7", bg: "rgba(74,126,247,0.12)" },
  Climate: { color: "#34d399", bg: "rgba(52,211,153,0.12)" },
  Technology: { color: "#22d3ee", bg: "rgba(34,211,238,0.12)" },
  Policy: { color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  Research: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  "Global Systems": { color: "#d4a017", bg: "rgba(212,160,23,0.12)" },
};

function getDomainColor(domain: string) {
  return (
    DOMAIN_COLORS[domain] ?? {
      color: "#94a3b8",
      bg: "rgba(148,163,184,0.1)",
    }
  );
}

function deriveStrength(entry: FeedEntry): number {
  if (entry.isFeatured) return 5;
  const age = Date.now() - Number(entry.timestamp);
  if (age < 86400000) return 4;
  if (age < 259200000) return 3;
  if (age < 604800000) return 2;
  return 1;
}

function formatTimestamp(ts: bigint): string {
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

// ─── Signal strength mini bars ────────────────────────────────────────────────
function StrengthBars({
  strength,
  color,
}: { strength: number; color: string }) {
  const bars = [6, 9, 12, 15, 18] as const;
  return (
    <div className="flex items-end gap-[2px]">
      {bars.map((h) => (
        <div
          key={`lb-${h}`}
          style={{
            width: "3px",
            height: `${h}px`,
            background: color,
            opacity: bars.indexOf(h) < strength ? 0.9 : 0.12,
            borderRadius: "1px",
            transition: "opacity 0.3s",
          }}
        />
      ))}
    </div>
  );
}

// ─── Individual bookmark card ─────────────────────────────────────────────────
function BookmarkCard({
  entry,
  onRemove,
  removing,
}: {
  entry: FeedEntry;
  onRemove: (id: string) => void;
  removing: boolean;
}) {
  const dc = getDomainColor(entry.domain);
  const strength = deriveStrength(entry);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        maxHeight: removing ? "0" : "200px",
        opacity: removing ? 0 : 1,
        overflow: "hidden",
        transition:
          "max-height 300ms ease-out, opacity 250ms ease-out, margin-bottom 300ms ease-out",
        marginBottom: removing ? "0" : "10px",
      }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          background: "rgba(255,255,255,0.025)",
          border: `1px solid ${hovered ? "rgba(74,126,247,0.3)" : "rgba(255,255,255,0.06)"}`,
          borderLeft: `2px solid ${dc.color}`,
          borderRadius: "2px",
          padding: "12px 14px 10px 12px",
          transition: "border-color 200ms, box-shadow 200ms",
          boxShadow: hovered ? "0 0 16px rgba(74,126,247,0.1)" : "none",
        }}
      >
        {/* Domain badge */}
        <div className="flex items-center justify-between mb-2">
          <span
            style={{
              fontFamily: "Geist Mono, monospace",
              fontSize: "8px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              padding: "2px 6px",
              borderRadius: "1px",
              background: dc.bg,
              color: dc.color,
            }}
          >
            {entry.domain}
          </span>
          <button
            type="button"
            data-ocid="library.card.delete_button"
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
              color: "rgba(248,113,113,0.4)",
              cursor: "pointer",
              transition: "all 200ms",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(248,113,113,0.85)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(248,113,113,0.5)";
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(248,113,113,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(248,113,113,0.4)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(248,113,113,0.2)";
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
            }}
          >
            REMOVE
          </button>
        </div>

        {/* Title */}
        <h4
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontSize: "12px",
            fontWeight: 400,
            color: "rgba(255,255,255,0.88)",
            marginBottom: "6px",
            lineHeight: 1.4,
          }}
        >
          {entry.title}
        </h4>

        {/* Summary clipped */}
        <p
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: "10px",
            color: "rgba(255,255,255,0.38)",
            lineHeight: 1.55,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            marginBottom: "10px",
          }}
        >
          {entry.summary}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span
              style={{
                fontFamily: "Geist Mono, monospace",
                fontSize: "8px",
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              STEAMI · ◷ {formatTimestamp(entry.timestamp)}
            </span>
          </div>
          <StrengthBars strength={strength} color={dc.color} />
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyLibraryState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: "360px",
        padding: "40px 24px",
        textAlign: "center",
      }}
    >
      {/* Bookmark icon with pulse ring */}
      <div
        style={{
          position: "relative",
          width: "64px",
          height: "64px",
          marginBottom: "28px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "-12px",
            borderRadius: "50%",
            border: "1px solid rgba(212,160,23,0.2)",
            animation: "lib-pulse-ring 2.5s ease-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "-6px",
            borderRadius: "50%",
            border: "1px solid rgba(212,160,23,0.12)",
            animation: "lib-pulse-ring 2.5s ease-out 0.7s infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(212,160,23,0.06)",
            borderRadius: "50%",
            border: "1px solid rgba(212,160,23,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(212,160,23,0.4)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-label="Empty library"
            role="img"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </div>
      </div>

      <h3
        style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontSize: "15px",
          fontWeight: 400,
          color: "rgba(255,255,255,0.55)",
          marginBottom: "10px",
          letterSpacing: "0.02em",
        }}
      >
        Your Library Is Empty
      </h3>
      <p
        style={{
          fontFamily: "Sora, sans-serif",
          fontSize: "11px",
          color: "rgba(255,255,255,0.25)",
          lineHeight: 1.7,
          maxWidth: "240px",
        }}
      >
        Bookmark intelligence signals to build your personal research library.
        Saved signals are available across sessions.
      </p>

      {/* Hint */}
      <div
        style={{
          marginTop: "24px",
          padding: "8px 14px",
          background: "rgba(212,160,23,0.05)",
          border: "1px solid rgba(212,160,23,0.12)",
          borderRadius: "2px",
        }}
      >
        <span
          style={{
            fontFamily: "Geist Mono, monospace",
            fontSize: "8px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(212,160,23,0.45)",
          }}
        >
          ◆ Click the bookmark icon on any signal card
        </span>
      </div>
    </div>
  );
}

// ─── Main LibraryDrawer ───────────────────────────────────────────────────────
interface LibraryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  allFeeds: FeedEntry[];
}

export default function LibraryDrawer({
  isOpen,
  onClose,
  allFeeds,
}: LibraryDrawerProps) {
  const { bookmarks, removeBookmark, clearAll, count } = useBookmarks();
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  // Trap focus and handle ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleRemove = (id: string) => {
    setRemovingIds((prev) => new Set([...prev, id]));
    setTimeout(() => {
      removeBookmark(id);
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 310);
  };

  const handleClearAll = () => {
    // Animate all out first
    const ids = new Set(bookmarks);
    setRemovingIds(ids);
    setTimeout(() => {
      clearAll();
      setRemovingIds(new Set());
    }, 350);
  };

  // Resolve bookmarked entries
  const bookmarkedEntries = allFeeds.filter((f) =>
    bookmarks.includes(String(f.id)),
  );

  return (
    <>
      {/* Keyframes */}
      <style>{`
        @keyframes lib-pulse-ring {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes lib-scan-line {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        @keyframes lib-slide-in {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      {/* Backdrop */}
      <div
        data-ocid="library.modal"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClose();
        }}
        role="button"
        tabIndex={isOpen ? 0 : -1}
        aria-label="Close library"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 9998,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 350ms cubic-bezier(0.16, 1, 0.3, 1)",
          cursor: "default",
        }}
      />

      {/* Drawer panel */}
      <aside
        data-ocid="library.panel"
        aria-label="Signal Intelligence Library"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "400px",
          maxWidth: "100vw",
          zIndex: 9999,
          background: "rgba(4,5,14,0.97)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderLeft: "1px solid rgba(212,160,23,0.25)",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.6)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 350ms cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Animated gold top-border scan line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 0%, #d4a017 50%, transparent 100%)",
            zIndex: 10,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: "80px",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
              animation: "lib-scan-line 3s linear infinite",
            }}
          />
        </div>

        {/* Header */}
        <div
          style={{
            padding: "20px 20px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            flexShrink: 0,
            position: "relative",
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              fontFamily: "Geist Mono, monospace",
              fontSize: "8px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(212,160,23,0.7)",
              marginBottom: "8px",
            }}
          >
            ◆ SIGNAL INTELLIGENCE LIBRARY
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Count badge */}
              <span
                style={{
                  fontFamily: "Geist Mono, monospace",
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "3px 8px",
                  borderRadius: "1px",
                  background:
                    count > 0
                      ? "rgba(212,160,23,0.12)"
                      : "rgba(255,255,255,0.04)",
                  border: `1px solid ${count > 0 ? "rgba(212,160,23,0.3)" : "rgba(255,255,255,0.08)"}`,
                  color: count > 0 ? "#d4a017" : "rgba(255,255,255,0.25)",
                  transition: "all 300ms",
                }}
              >
                {count} SIGNAL{count !== 1 ? "S" : ""} SAVED
              </span>

              {/* Clear all */}
              {count > 0 && (
                <button
                  type="button"
                  data-ocid="library.clear_button"
                  onClick={handleClearAll}
                  style={{
                    fontFamily: "Geist Mono, monospace",
                    fontSize: "7px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    padding: "3px 6px",
                    borderRadius: "1px",
                    background: "transparent",
                    border: "1px solid rgba(248,113,113,0.2)",
                    color: "rgba(248,113,113,0.35)",
                    cursor: "pointer",
                    transition: "all 200ms",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(248,113,113,0.8)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(248,113,113,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(248,113,113,0.35)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(248,113,113,0.2)";
                  }}
                >
                  CLEAR ALL
                </button>
              )}
            </div>

            {/* Close */}
            <button
              type="button"
              data-ocid="library.close_button"
              onClick={onClose}
              aria-label="Close library"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.4)",
                borderRadius: "2px",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "14px",
                transition: "all 200ms",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(255,255,255,0.8)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(255,255,255,0.4)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(255,255,255,0.08)";
              }}
            >
              ×
            </button>
          </div>

          {/* Status line */}
          {count > 0 && (
            <div
              style={{
                marginTop: "12px",
                paddingTop: "10px",
                borderTop: "1px solid rgba(255,255,255,0.04)",
                fontFamily: "Geist Mono, monospace",
                fontSize: "8px",
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.15em",
              }}
            >
              PERSONAL RESEARCH LIBRARY · SESSION PERSISTENT
            </div>
          )}
        </div>

        {/* Scrollable signal list */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: count > 0 ? "16px 16px 24px" : "0",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(212,160,23,0.15) transparent",
          }}
        >
          {count === 0 ? (
            <EmptyLibraryState />
          ) : (
            <div>
              {bookmarkedEntries.map((entry) => (
                <BookmarkCard
                  key={String(entry.id)}
                  entry={entry}
                  onRemove={handleRemove}
                  removing={removingIds.has(String(entry.id))}
                />
              ))}
              {/* Also show bookmarks for IDs not in allFeeds (orphans) */}
              {bookmarks
                .filter(
                  (bid) => !bookmarkedEntries.find((e) => String(e.id) === bid),
                )
                .map((bid) => (
                  <div
                    key={bid}
                    style={{
                      maxHeight: removingIds.has(bid) ? "0" : "60px",
                      opacity: removingIds.has(bid) ? 0 : 0.5,
                      overflow: "hidden",
                      transition: "all 300ms",
                      marginBottom: "8px",
                    }}
                  >
                    <div
                      style={{
                        padding: "10px 12px",
                        background: "rgba(255,255,255,0.015)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: "2px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "Geist Mono, monospace",
                          fontSize: "9px",
                          color: "rgba(255,255,255,0.25)",
                          letterSpacing: "0.1em",
                        }}
                      >
                        SIGNAL #{bid} · OFFLINE
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemove(bid)}
                        style={{
                          fontFamily: "Geist Mono, monospace",
                          fontSize: "7px",
                          background: "transparent",
                          border: "1px solid rgba(248,113,113,0.2)",
                          color: "rgba(248,113,113,0.4)",
                          padding: "2px 5px",
                          borderRadius: "1px",
                          cursor: "pointer",
                        }}
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid rgba(255,255,255,0.04)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontFamily: "Geist Mono, monospace",
              fontSize: "7px",
              color: "rgba(255,255,255,0.12)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            STEMONEF · SIGNAL INTELLIGENCE LIBRARY · SESSION PERSISTENT
          </div>
        </div>
      </aside>
    </>
  );
}
