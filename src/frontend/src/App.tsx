import { Toaster } from "@/components/ui/sonner";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import AICompanion from "./components/AICompanion";
import AmbientSoundControl from "./components/AmbientSoundControl";
import BootScreen from "./components/BootScreen";
import CTASection from "./components/CTASection";
import EnterpriseEngine from "./components/EnterpriseEngine";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import HumanonSection from "./components/HumanonSection";
import IntelligenceFeed from "./components/IntelligenceFeed";
import { FALLBACK_FEEDS } from "./components/IntelligenceFeed";
import LibraryDrawer from "./components/LibraryDrawer";
import NavBar from "./components/NavBar";
import PathwaySection from "./components/PathwaySection";
import PillarsSection from "./components/PillarsSection";
import SuggestionToast from "./components/SuggestionToast";
import { useBookmarks } from "./hooks/useBookmarks";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetFeaturedFeeds, useGetPublicFeeds } from "./hooks/useQueries";
import AdminDashboard from "./pages/AdminDashboard";
import ElpisPage from "./pages/ElpisPage";
import EpochsPage from "./pages/EpochsPage";
import EquisPage from "./pages/EquisPage";
import HumanonPage from "./pages/HumanonPage";
import NovaPage from "./pages/NovaPage";
import SteamiPage from "./pages/SteamiPage";
import TerraPage from "./pages/TerraPage";
import UserDashboard from "./pages/UserDashboard";

type AppView =
  | "home"
  | "admin"
  | "dashboard"
  | "epochs"
  | "humanon"
  | "steami"
  | "elpis"
  | "nova"
  | "terra"
  | "equis";

const SECTION_IDS = [
  "hero",
  "pillars",
  "mission",
  "feed",
  "pathway",
  "humanon",
  "cta",
];

export default function App() {
  const [view, setView] = useState<AppView>("home");
  const [bootDone, setBootDone] = useState(false);
  const [companionOpen, setCompanionOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("hero");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const suggestionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interactedRef = useRef(false);
  const { isLoginSuccess, identity } = useInternetIdentity();
  const { count: bookmarkCount } = useBookmarks();

  // Feeds for LibraryDrawer
  const { data: featuredFeeds } = useGetFeaturedFeeds();
  const { data: publicFeedsData } = useGetPublicFeeds();
  const allFeedsForDrawer = useMemo(() => {
    const merged = [...(featuredFeeds || []), ...(publicFeedsData || [])];
    const seen = new Set<string>();
    const unique = merged.filter((f) => {
      const key = String(f.id);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return unique.length > 0 ? unique : FALLBACK_FEEDS;
  }, [featuredFeeds, publicFeedsData]);

  // Detect admin route from URL or hash
  useEffect(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path === "/admin" || hash === "#admin") {
      setView("admin");
      setBootDone(true);
    }
  }, []);

  // Redirect to user dashboard on successful login
  useEffect(() => {
    if (isLoginSuccess && identity && view === "home") {
      setView("dashboard");
    }
  }, [isLoginSuccess, identity, view]);

  // Reveal animations using IntersectionObserver
  useEffect(() => {
    if (!bootDone) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    const revealEls = document.querySelectorAll(".reveal");
    for (const el of revealEls) observer.observe(el);

    return () => observer.disconnect();
  }, [bootDone]);

  // Section tracking for AI Companion context
  useEffect(() => {
    if (!bootDone) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            setCurrentSection(entry.target.id);
          }
        }
      },
      { threshold: 0.3 },
    );

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [bootDone]);

  // 40-second suggestion timer
  useEffect(() => {
    if (!bootDone || view !== "home") return;

    const handleInteraction = () => {
      interactedRef.current = true;
    };

    document.addEventListener("click", handleInteraction, { once: true });

    suggestionTimerRef.current = setTimeout(() => {
      if (!interactedRef.current) {
        setShowSuggestion(true);
      }
    }, 40000);

    return () => {
      if (suggestionTimerRef.current) clearTimeout(suggestionTimerRef.current);
      document.removeEventListener("click", handleInteraction);
    };
  }, [bootDone, view]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleBootComplete = useCallback(() => {
    setBootDone(true);
  }, []);

  const handleSuggestionChoosePath = useCallback(() => {
    setShowSuggestion(false);
    scrollTo("pathway");
  }, [scrollTo]);

  if (view === "admin") {
    return (
      <>
        <AdminDashboard onGoHome={() => setView("home")} />
        <Toaster
          toastOptions={{
            style: {
              background: "rgba(4,6,18,0.97)",
              border: "1px solid rgba(212,160,23,0.3)",
              color: "rgba(255,255,255,0.8)",
              fontFamily: "Geist Mono, monospace",
              fontSize: "11px",
            },
          }}
        />
      </>
    );
  }

  if (view === "dashboard") {
    return (
      <>
        <UserDashboard onGoHome={() => setView("home")} />
        <Toaster
          toastOptions={{
            style: {
              background: "rgba(4,6,18,0.97)",
              border: "1px solid rgba(212,160,23,0.3)",
              color: "rgba(255,255,255,0.8)",
              fontFamily: "Geist Mono, monospace",
              fontSize: "11px",
            },
          }}
        />
      </>
    );
  }

  // ── Pillar pages ───────────────────────────────────────────────────────────
  const PILLAR_TOASTER = (
    <Toaster
      toastOptions={{
        style: {
          background: "rgba(4,6,18,0.97)",
          border: "1px solid rgba(212,160,23,0.3)",
          color: "rgba(255,255,255,0.8)",
          fontFamily: "Geist Mono, monospace",
          fontSize: "11px",
        },
      }}
    />
  );

  if (
    view === "epochs" ||
    view === "humanon" ||
    view === "steami" ||
    view === "elpis" ||
    view === "nova" ||
    view === "terra" ||
    view === "equis"
  ) {
    return (
      <>
        <div style={{ background: "var(--neural-bg)", minHeight: "100vh" }}>
          {/* NavBar stays on pillar pages */}
          <NavBar
            onCompanionToggle={() => setCompanionOpen((p) => !p)}
            companionOpen={companionOpen}
            onScrollTo={(id) => {
              setView("home");
              // allow home to mount, then scroll
              setTimeout(() => {
                const el = document.getElementById(id);
                if (el)
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
              }, 300);
            }}
            onDashboard={() => setView("dashboard")}
            onNavigatePillar={(page) => setView(page)}
            onOpenLibrary={() => setLibraryOpen(true)}
            libraryCount={bookmarkCount}
          />

          {view === "epochs" && <EpochsPage onBack={() => setView("home")} />}
          {view === "humanon" && <HumanonPage onBack={() => setView("home")} />}
          {view === "steami" && <SteamiPage onBack={() => setView("home")} />}
          {view === "elpis" && <ElpisPage onBack={() => setView("home")} />}
          {view === "nova" && <NovaPage onBack={() => setView("home")} />}
          {view === "terra" && <TerraPage onBack={() => setView("home")} />}
          {view === "equis" && <EquisPage onBack={() => setView("home")} />}

          <Footer />
        </div>
        {/* Ambient audio — research theme on knowledge pages */}
        <AmbientSoundControl
          pageTheme={
            view === "epochs" || view === "steami" ? "research" : "default"
          }
        />
        {/* Library Drawer available on pillar pages too */}
        <LibraryDrawer
          isOpen={libraryOpen}
          onClose={() => setLibraryOpen(false)}
          allFeeds={allFeedsForDrawer}
        />
        {PILLAR_TOASTER}
      </>
    );
  }

  return (
    <>
      {/* Boot Screen */}
      {!bootDone && <BootScreen onComplete={handleBootComplete} />}

      {/* Main app — rendered in background, shown after boot */}
      <div
        style={{
          opacity: bootDone ? 1 : 0,
          transition: "opacity 0.6s ease",
          background: "var(--neural-bg)",
          minHeight: "100vh",
        }}
      >
        <NavBar
          onCompanionToggle={() => setCompanionOpen((p) => !p)}
          companionOpen={companionOpen}
          onScrollTo={scrollTo}
          onDashboard={() => setView("dashboard")}
          onNavigatePillar={(page) => setView(page)}
          onOpenLibrary={() => setLibraryOpen(true)}
          libraryCount={bookmarkCount}
        />

        <main>
          <HeroSection onScrollTo={scrollTo} />
          <PillarsSection onNavigate={(page) => setView(page)} />
          <EnterpriseEngine />
          <IntelligenceFeed onOpenLibrary={() => setLibraryOpen(true)} />
          <PathwaySection
            onPathwaySelect={() => {
              /* adaptive highlighting */
            }}
            onNavigate={(page) => setView(page as AppView)}
          />
          <HumanonSection />
          <CTASection onNavigate={(page) => setView(page as AppView)} />
        </main>

        <Footer />

        {/* AI Companion */}
        {bootDone && (
          <>
            {/* Floating AI button */}
            {!companionOpen && (
              <button
                type="button"
                data-ocid="companion.toggle"
                onClick={() => setCompanionOpen(true)}
                className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 animate-pulse-glow"
                style={{
                  background: "rgba(4,5,14,0.95)",
                  border: "1px solid rgba(74,126,247,0.5)",
                  boxShadow: "0 0 20px rgba(74,126,247,0.25)",
                  cursor: "pointer",
                }}
                aria-label="Open AI Companion"
              >
                <span
                  className="font-mono-geist text-xs font-bold"
                  style={{
                    color: "rgba(74,126,247,0.95)",
                    letterSpacing: "0.05em",
                  }}
                >
                  AI
                </span>
              </button>
            )}

            <AICompanion
              isOpen={companionOpen}
              onClose={() => setCompanionOpen(false)}
              currentSection={currentSection}
            />
          </>
        )}

        {/* 40-second suggestion toast */}
        {showSuggestion && (
          <SuggestionToast
            onDismiss={() => setShowSuggestion(false)}
            onChoosePath={handleSuggestionChoosePath}
          />
        )}

        {/* Ambient audio control */}
        {bootDone && <AmbientSoundControl pageTheme="default" />}
      </div>

      {/* Library Drawer — always rendered at app level */}
      <LibraryDrawer
        isOpen={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        allFeeds={allFeedsForDrawer}
      />

      {/* Admin navigation shortcut — always rendered, never inside opacity wrapper */}
      <div className="fixed bottom-8 left-8 z-50">
        <button
          type="button"
          data-ocid="nav.link"
          onClick={() => setView("admin")}
          className="px-4 py-2 text-[9px] tracking-[0.3em] uppercase transition-all duration-200 opacity-20 hover:opacity-70"
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.5)",
            fontFamily: "Geist Mono, monospace",
            cursor: "pointer",
            borderRadius: "2px",
          }}
        >
          ADMIN
        </button>
      </div>

      <Toaster
        toastOptions={{
          style: {
            background: "rgba(4,6,18,0.97)",
            border: "1px solid rgba(212,160,23,0.3)",
            color: "rgba(255,255,255,0.8)",
            fontFamily: "Geist Mono, monospace",
            fontSize: "11px",
          },
        }}
      />
    </>
  );
}
