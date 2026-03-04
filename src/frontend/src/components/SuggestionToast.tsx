interface SuggestionToastProps {
  onDismiss: () => void;
  onChoosePath: () => void;
}

export default function SuggestionToast({
  onDismiss,
  onChoosePath,
}: SuggestionToastProps) {
  return (
    <div
      data-ocid="suggestion.toast"
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-slide-in-bottom"
      style={{ maxWidth: "min(480px, calc(100vw - 48px))" }}
    >
      <div
        className="p-5 rounded-sm flex flex-col sm:flex-row items-center gap-4"
        style={{
          background: "rgba(4,6,18,0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(212,160,23,0.25)",
          boxShadow:
            "0 0 30px rgba(212,160,23,0.1), 0 16px 40px rgba(0,0,0,0.7)",
        }}
      >
        {/* Icon */}
        <div
          className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center animate-pulse-glow"
          style={{
            background: "rgba(212,160,23,0.1)",
            border: "1px solid rgba(212,160,23,0.4)",
          }}
        >
          <span style={{ color: "#d4a017", fontSize: "12px" }}>◆</span>
        </div>

        {/* Text */}
        <div className="flex-1 text-center sm:text-left">
          <p
            className="text-xs leading-relaxed"
            style={{
              color: "rgba(255,255,255,0.65)",
              fontFamily: "Sora, sans-serif",
            }}
          >
            Explore how STEMONEF aligns with your sector.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            data-ocid="suggestion.primary_button"
            onClick={onChoosePath}
            className="px-4 py-2 text-[10px] tracking-widest uppercase transition-all duration-200"
            style={{
              background: "rgba(212,160,23,0.12)",
              border: "1px solid rgba(212,160,23,0.4)",
              color: "#d4a017",
              fontFamily: "Geist Mono, monospace",
              letterSpacing: "0.15em",
              cursor: "pointer",
              borderRadius: "2px",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(212,160,23,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(212,160,23,0.12)";
            }}
          >
            Choose Path
          </button>

          <button
            type="button"
            data-ocid="suggestion.close_button"
            onClick={onDismiss}
            className="p-2 transition-all duration-200"
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.3)",
              cursor: "pointer",
              fontSize: "16px",
              lineHeight: 1,
            }}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
