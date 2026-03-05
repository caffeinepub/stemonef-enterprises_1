/**
 * AmbientSoundControl — minimal glass button for toggling ambient audio.
 * Positioned bottom-right, above the AI companion button.
 * Uses existing glass/glow styles; introduces no new design tokens.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { AudioEngine, getAudioPreference } from "../audio/AmbientAudioEngine";

interface Props {
  pageTheme?: "default" | "research" | "march9";
}

export default function AmbientSoundControl({ pageTheme = "default" }: Props) {
  const [active, setActive] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [volume, setVolume] = useState(0.25);
  const [expanded, setExpanded] = useState(false);
  const promptShownRef = useRef(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // One-time browser-side init
  useEffect(() => {
    if (typeof window === "undefined") return;

    AudioEngine.init();

    const hadPreference = getAudioPreference();
    if (hadPreference) {
      setActive(true);
    } else if (!promptShownRef.current) {
      promptShownRef.current = true;
      // Show prompt after a short delay so the page can settle
      const t = setTimeout(() => setShowPrompt(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  // Switch theme when navigating to research pages
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (active && pageTheme) {
      AudioEngine.setTheme(pageTheme).catch(() => {});
    }
  }, [pageTheme, active]);

  const handleEnable = useCallback(async () => {
    setShowPrompt(false);
    await AudioEngine.play();
    setActive(AudioEngine.isEnabled());
  }, []);

  const handleDismiss = useCallback(() => {
    setShowPrompt(false);
  }, []);

  const handleToggle = useCallback(async () => {
    if (active) {
      AudioEngine.pause();
      setActive(false);
    } else {
      await AudioEngine.play();
      setActive(AudioEngine.isEnabled());
    }
    setExpanded(false);
  }, [active]);

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Number.parseFloat(e.target.value);
      setVolume(v);
      AudioEngine.setVolume(v);
    },
    [],
  );

  const handleLongPressStart = useCallback(() => {
    longPressTimer.current = setTimeout(() => setExpanded((p) => !p), 600);
  }, []);

  const handleLongPressEnd = useCallback(() => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  }, []);

  return (
    <>
      {/* Activation prompt */}
      {showPrompt && (
        <div
          className="fixed bottom-32 right-8 z-50 reveal visible"
          style={{
            background: "rgba(4,5,14,0.92)",
            border: "1px solid rgba(74,126,247,0.3)",
            borderRadius: "10px",
            padding: "14px 18px",
            backdropFilter: "blur(16px)",
            boxShadow: "0 0 30px rgba(74,126,247,0.12)",
            maxWidth: "220px",
          }}
        >
          <p
            style={{
              fontFamily: "Geist Mono, monospace",
              fontSize: "10px",
              color: "rgba(255,255,255,0.65)",
              letterSpacing: "0.08em",
              marginBottom: "10px",
              lineHeight: 1.5,
            }}
          >
            Enable Ambient Experience?
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              data-ocid="audio.primary_button"
              onClick={handleEnable}
              style={{
                fontFamily: "Geist Mono, monospace",
                fontSize: "9px",
                letterSpacing: "0.12em",
                padding: "5px 10px",
                background: "rgba(74,126,247,0.18)",
                border: "1px solid rgba(74,126,247,0.45)",
                color: "rgba(74,126,247,0.95)",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              ENABLE
            </button>
            <button
              type="button"
              data-ocid="audio.cancel_button"
              onClick={handleDismiss}
              style={{
                fontFamily: "Geist Mono, monospace",
                fontSize: "9px",
                letterSpacing: "0.12em",
                padding: "5px 10px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.35)",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              SKIP
            </button>
          </div>
        </div>
      )}

      {/* Expanded volume/theme panel */}
      {expanded && (
        <div
          className="fixed z-50"
          style={{
            bottom: "90px",
            right: "8px",
            background: "rgba(4,5,14,0.92)",
            border: "1px solid rgba(74,126,247,0.25)",
            borderRadius: "10px",
            padding: "12px 14px",
            backdropFilter: "blur(16px)",
            boxShadow: "0 0 24px rgba(74,126,247,0.1)",
            minWidth: "160px",
          }}
        >
          <p
            style={{
              fontFamily: "Geist Mono, monospace",
              fontSize: "8px",
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.35)",
              marginBottom: "8px",
              textTransform: "uppercase",
            }}
          >
            Volume
          </p>
          <input
            data-ocid="audio.input"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={handleVolumeChange}
            style={{
              width: "100%",
              accentColor: "rgba(74,126,247,0.85)",
              cursor: "pointer",
            }}
          />
          <p
            style={{
              fontFamily: "Geist Mono, monospace",
              fontSize: "8px",
              letterSpacing: "0.12em",
              color: "rgba(212,160,23,0.55)",
              marginTop: "10px",
              textTransform: "uppercase",
            }}
          >
            Theme: {pageTheme}
          </p>
        </div>
      )}

      {/* Glass toggle button — sits just above the AI companion (bottom-28) */}
      <button
        type="button"
        data-ocid="audio.toggle"
        onClick={handleToggle}
        onMouseDown={handleLongPressStart}
        onMouseUp={handleLongPressEnd}
        onTouchStart={handleLongPressStart}
        onTouchEnd={handleLongPressEnd}
        aria-label={active ? "Mute ambient audio" : "Unmute ambient audio"}
        className="fixed z-50"
        style={{
          bottom: "88px",
          right: "8px",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(4,5,14,0.90)",
          border: active
            ? "1px solid rgba(74,126,247,0.55)"
            : "1px solid rgba(255,255,255,0.1)",
          boxShadow: active ? "0 0 14px rgba(74,126,247,0.22)" : "none",
          cursor: "pointer",
          transition: "border 0.3s, box-shadow 0.3s",
          backdropFilter: "blur(10px)",
        }}
      >
        {active ? (
          /* Soundwave icon */
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(74,126,247,0.9)"
            strokeWidth="1.8"
            strokeLinecap="round"
            role="img"
            aria-label="Ambient audio active"
          >
            <title>Ambient audio active</title>
            <line x1="4" y1="12" x2="4" y2="12" />
            <line x1="8" y1="8" x2="8" y2="16" />
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="16" y1="8" x2="16" y2="16" />
            <line x1="20" y1="12" x2="20" y2="12" />
          </svg>
        ) : (
          /* Muted icon */
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.8"
            strokeLinecap="round"
            role="img"
            aria-label="Ambient audio muted"
          >
            <title>Ambient audio muted</title>
            <line x1="4" y1="12" x2="4" y2="12" />
            <line x1="8" y1="11" x2="8" y2="13" />
            <line x1="12" y1="10" x2="12" y2="14" />
            <line x1="16" y1="11" x2="16" y2="13" />
            <line x1="20" y1="12" x2="20" y2="12" />
          </svg>
        )}
      </button>
    </>
  );
}
