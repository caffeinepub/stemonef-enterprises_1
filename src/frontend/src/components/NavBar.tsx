import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type NavigablePillar = "epochs" | "humanon" | "steami" | "elpis";

interface NavBarProps {
  onCompanionToggle: () => void;
  companionOpen: boolean;
  onScrollTo: (id: string) => void;
  onDashboard?: () => void;
  onNavigatePillar?: (page: NavigablePillar) => void;
}

// Pillars that navigate to dedicated pages vs those that scroll to section
const PILLAR_NAV: Array<{ label: string; navigateTo: NavigablePillar | null }> =
  [
    { label: "EPOCHS", navigateTo: "epochs" },
    { label: "HUMANON", navigateTo: "humanon" },
    { label: "STEAMI", navigateTo: "steami" },
    { label: "NOVA", navigateTo: null },
    { label: "TERRA", navigateTo: null },
    { label: "EQUIS", navigateTo: null },
    { label: "ETHOS", navigateTo: null },
    { label: "E.L.P.I.S", navigateTo: "elpis" },
  ];

export default function NavBar({
  onCompanionToggle,
  companionOpen,
  onScrollTo,
  onDashboard,
  onNavigatePillar,
}: NavBarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { login, clear, identity, isInitializing } = useInternetIdentity();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLoggedIn = !!identity;

  return (
    <header
      data-ocid="nav.panel"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(4,5,14,0.92)" : "rgba(4,5,14,0.6)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Wordmark */}
        <button
          type="button"
          data-ocid="nav.link"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3 group"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <div className="relative">
            <span
              className="font-display text-xl font-light tracking-[0.2em]"
              style={{
                background: "linear-gradient(135deg, #8ab4ff 0%, #ffffff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              STEMONEF
            </span>
            <div
              className="absolute -bottom-0.5 left-0 right-0 h-px transition-all duration-300"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #d4a017, transparent)",
                opacity: 0.7,
              }}
            />
          </div>
          <div
            className="hidden sm:block text-[9px] tracking-[0.3em] uppercase"
            style={{ color: "rgba(212,160,23,0.6)" }}
          >
            ENTERPRISES
          </div>
        </button>

        {/* Desktop Pillar Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {PILLAR_NAV.map((item) => (
            <button
              type="button"
              key={item.label}
              data-ocid="nav.link"
              onClick={() => {
                if (item.navigateTo && onNavigatePillar) {
                  onNavigatePillar(item.navigateTo);
                } else {
                  onScrollTo("pillars");
                }
              }}
              className="px-3 py-1.5 text-xs tracking-widest uppercase transition-all duration-200 rounded"
              style={{
                color: item.navigateTo
                  ? "rgba(255,255,255,0.6)"
                  : "rgba(255,255,255,0.45)",
                fontFamily: "Geist Mono, monospace",
                letterSpacing: "0.12em",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(212,160,23,0.9)";
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(212,160,23,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  item.navigateTo
                    ? "rgba(255,255,255,0.6)"
                    : "rgba(255,255,255,0.45)";
                (e.currentTarget as HTMLButtonElement).style.background =
                  "none";
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* AI Companion Toggle */}
          <button
            type="button"
            data-ocid="companion.toggle"
            onClick={onCompanionToggle}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-widest uppercase transition-all duration-300"
            style={{
              background: companionOpen
                ? "rgba(212,160,23,0.15)"
                : "rgba(255,255,255,0.04)",
              border: `1px solid ${companionOpen ? "rgba(212,160,23,0.5)" : "rgba(255,255,255,0.1)"}`,
              color: companionOpen ? "#d4a017" : "rgba(255,255,255,0.7)",
              boxShadow: companionOpen
                ? "0 0 15px rgba(212,160,23,0.2)"
                : "none",
              fontFamily: "Geist Mono, monospace",
              letterSpacing: "0.15em",
              cursor: "pointer",
            }}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${companionOpen ? "animate-pulse-glow" : ""}`}
              style={{
                background: companionOpen ? "#d4a017" : "rgba(255,255,255,0.4)",
              }}
            />
            AI
          </button>

          {/* Login / Dashboard + Sign Out */}
          {!isInitializing &&
            (isLoggedIn ? (
              <div className="flex items-center gap-2">
                {onDashboard && (
                  <button
                    type="button"
                    data-ocid="nav.link"
                    onClick={onDashboard}
                    className="px-4 py-2 rounded-sm text-xs tracking-widest uppercase transition-all duration-200"
                    style={{
                      background: "none",
                      border: "1px solid rgba(74,126,247,0.4)",
                      color: "rgba(74,126,247,0.9)",
                      fontFamily: "Geist Mono, monospace",
                      letterSpacing: "0.15em",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(74,126,247,0.1)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "rgba(74,126,247,0.7)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "none";
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "rgba(74,126,247,0.4)";
                    }}
                  >
                    PORTAL
                  </button>
                )}
                <button
                  type="button"
                  data-ocid="nav.link"
                  onClick={clear}
                  className="px-4 py-2 rounded-sm text-xs tracking-widest uppercase transition-all duration-200"
                  style={{
                    background: "none",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.35)",
                    fontFamily: "Geist Mono, monospace",
                    letterSpacing: "0.15em",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(255,255,255,0.65)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(255,255,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(255,255,255,0.35)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(255,255,255,0.1)";
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                data-ocid="nav.link"
                onClick={login}
                className="px-4 py-2 rounded-sm text-xs tracking-widest uppercase transition-all duration-200"
                style={{
                  background: "none",
                  border: "1px solid rgba(74,126,247,0.4)",
                  color: "rgba(74,126,247,0.9)",
                  fontFamily: "Geist Mono, monospace",
                  letterSpacing: "0.15em",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(74,126,247,0.1)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(74,126,247,0.7)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "none";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(74,126,247,0.4)";
                }}
              >
                Sign In
              </button>
            ))}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="lg:hidden flex flex-col gap-1 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-5 h-px transition-all duration-300"
                style={{ background: "rgba(255,255,255,0.7)" }}
              />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t"
          style={{
            background: "rgba(4,5,14,0.98)",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          <div className="px-6 py-4 flex flex-col gap-3">
            {PILLAR_NAV.map((item) => (
              <button
                type="button"
                key={item.label}
                data-ocid="nav.link"
                onClick={() => {
                  if (item.navigateTo && onNavigatePillar) {
                    onNavigatePillar(item.navigateTo);
                  } else {
                    onScrollTo("pillars");
                  }
                  setMobileOpen(false);
                }}
                className="text-left text-xs tracking-widest uppercase py-2"
                style={{
                  color: item.navigateTo
                    ? "rgba(255,255,255,0.65)"
                    : "rgba(255,255,255,0.5)",
                  fontFamily: "Geist Mono, monospace",
                  letterSpacing: "0.12em",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              data-ocid="companion.toggle"
              onClick={() => {
                onCompanionToggle();
                setMobileOpen(false);
              }}
              className="text-left text-xs tracking-widest uppercase py-2"
              style={{
                color: "rgba(212,160,23,0.8)",
                fontFamily: "Geist Mono, monospace",
                letterSpacing: "0.15em",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              AI COMPANION
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
