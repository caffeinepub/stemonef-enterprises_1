import { useEffect, useRef, useState } from "react";

export default function FoundersSignal() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mount fade-in
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  // Liquid-glass canvas animation inside the modal
  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      alpha: number;
      hue: number;
    }[] = Array.from({ length: 28 }, () => ({
      x: Math.random() * (canvas?.width ?? 600),
      y: Math.random() * (canvas?.height ?? 400),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 1 + Math.random() * 2.5,
      alpha: 0.08 + Math.random() * 0.18,
      hue: Math.random() > 0.5 ? 220 : 45,
    }));

    let lastTime = 0;
    function draw(ts: number) {
      if (!canvas || !ctx) return;
      if (ts - lastTime < 40) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }
      lastTime = ts;
      frame++;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Flowing gradient orbs
      const t = frame * 0.008;
      const g1 = ctx.createRadialGradient(
        canvas.width * (0.3 + 0.15 * Math.sin(t)),
        canvas.height * (0.3 + 0.1 * Math.cos(t * 0.7)),
        0,
        canvas.width * (0.3 + 0.15 * Math.sin(t)),
        canvas.height * (0.3 + 0.1 * Math.cos(t * 0.7)),
        canvas.width * 0.4,
      );
      g1.addColorStop(0, "rgba(74,126,247,0.06)");
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const g2 = ctx.createRadialGradient(
        canvas.width * (0.7 + 0.12 * Math.cos(t * 0.9)),
        canvas.height * (0.7 + 0.1 * Math.sin(t * 1.1)),
        0,
        canvas.width * (0.7 + 0.12 * Math.cos(t * 0.9)),
        canvas.height * (0.7 + 0.1 * Math.sin(t * 1.1)),
        canvas.width * 0.35,
      );
      g2.addColorStop(0, "rgba(212,160,23,0.05)");
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.alpha})`;
        ctx.fill();
      }

      // Horizontal scan lines (very subtle)
      for (let i = 0; i < canvas.height; i += 6) {
        ctx.fillStyle = "rgba(0,0,0,0.012)";
        ctx.fillRect(0, i, canvas.width, 1);
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [open]);

  function handleOpen() {
    setOpen(true);
    setClosing(false);
  }

  function handleClose() {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 380);
  }

  return (
    <>
      {/* ── Floating indicator ── */}
      <div
        style={{
          position: "fixed",
          bottom: "120px",
          right: "32px",
          zIndex: 50,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        <button
          type="button"
          data-ocid="founders_signal.open_modal_button"
          onClick={handleOpen}
          aria-label="Open Founder's Signal"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            background: "rgba(4,5,14,0.88)",
            border: "1px solid rgba(212,160,23,0.35)",
            borderRadius: "6px",
            padding: "10px 14px",
            cursor: "pointer",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow:
              "0 0 18px rgba(212,160,23,0.12), inset 0 0 12px rgba(212,160,23,0.04)",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 32px rgba(212,160,23,0.28), inset 0 0 18px rgba(212,160,23,0.08)";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "rgba(212,160,23,0.6)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 18px rgba(212,160,23,0.12), inset 0 0 12px rgba(212,160,23,0.04)";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "rgba(212,160,23,0.35)";
          }}
        >
          {/* Pulse dot */}
          <span
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#d4a017",
              animation: "fs-dot-pulse 2.4s ease-in-out infinite",
            }}
          />
          {/* Signal icon — SVG waveform */}
          <svg
            width="22"
            height="16"
            viewBox="0 0 22 16"
            fill="none"
            role="img"
            aria-label="Signal waveform"
            style={{ opacity: 0.85 }}
          >
            <path
              d="M1 8 Q3.5 2 6 8 Q8.5 14 11 8 Q13.5 2 16 8 Q18.5 14 21 8"
              stroke="#d4a017"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              style={{ animation: "fs-wave-draw 3s ease-in-out infinite" }}
            />
          </svg>
          <span
            style={{
              fontFamily: "Geist Mono, monospace",
              fontSize: "8px",
              letterSpacing: "0.18em",
              color: "rgba(212,160,23,0.85)",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            Founder's Signal
          </span>
        </button>
      </div>

      {/* ── Backdrop ── */}
      {open && (
        <div
          data-ocid="founders_signal.modal"
          onClick={handleClose}
          onKeyDown={(e) => e.key === "Escape" && handleClose()}
          role="presentation"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            background: "rgba(4,5,14,0.72)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            animation: closing
              ? "fs-fade-out 0.38s ease forwards"
              : "fs-fade-in 0.38s ease forwards",
          }}
        />
      )}

      {/* ── Liquid-glass modal panel ── */}
      {open && (
        // biome-ignore lint/a11y/useSemanticElements: custom styled dialog
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Founder's Signal"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: closing
              ? "translate(-50%,-50%) scale(0.96)"
              : "translate(-50%,-50%) scale(1)",
            zIndex: 9999,
            width: "min(680px, 92vw)",
            maxHeight: "85vh",
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid rgba(212,160,23,0.22)",
            boxShadow:
              "0 40px 120px rgba(0,0,0,0.7), 0 0 60px rgba(212,160,23,0.1), inset 0 0 40px rgba(74,126,247,0.04)",
            animation: closing
              ? "fs-panel-out 0.38s ease forwards"
              : "fs-panel-in 0.42s cubic-bezier(0.34,1.56,0.64,1) forwards",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Animated canvas background */}
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 0,
              background:
                "linear-gradient(135deg, rgba(4,5,14,0.97) 0%, rgba(8,10,24,0.97) 100%)",
            }}
          />

          {/* Top accent bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(212,160,23,0.6) 40%, rgba(74,126,247,0.4) 70%, transparent)",
              zIndex: 2,
            }}
          />

          {/* Scan-line sweep */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 1,
              overflow: "hidden",
              borderRadius: "16px",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: "2px",
                background:
                  "linear-gradient(90deg, transparent, rgba(212,160,23,0.18), transparent)",
                animation: "fs-scan-sweep 4s linear infinite",
              }}
            />
          </div>

          {/* Content */}
          <div
            ref={scrollRef}
            style={{
              position: "relative",
              zIndex: 3,
              overflowY: "auto",
              padding: "32px 36px 36px",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(212,160,23,0.2) transparent",
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: "28px",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "Geist Mono, monospace",
                    fontSize: "9px",
                    letterSpacing: "0.22em",
                    color: "rgba(212,160,23,0.6)",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: "#d4a017",
                      animation: "fs-dot-pulse 2.4s ease-in-out infinite",
                    }}
                  />
                  Founder's Signal · Leadership Note
                </div>
                <h2
                  style={{
                    fontFamily: "Fraunces, serif",
                    fontSize: "clamp(20px, 3vw, 26px)",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.95)",
                    margin: 0,
                    lineHeight: 1.25,
                  }}
                >
                  A Note from the Leadership
                </h2>
              </div>

              {/* Close button */}
              <button
                type="button"
                data-ocid="founders_signal.close_button"
                onClick={handleClose}
                aria-label="Close Founder's Signal"
                style={{
                  flexShrink: 0,
                  marginLeft: "16px",
                  marginTop: "2px",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "16px",
                  lineHeight: 1,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(212,160,23,0.12)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(212,160,23,0.4)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "rgba(212,160,23,0.9)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.04)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(255,255,255,0.12)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "rgba(255,255,255,0.5)";
                }}
              >
                ✕
              </button>
            </div>

            {/* Divider */}
            <div
              style={{
                height: "1px",
                background:
                  "linear-gradient(90deg, rgba(212,160,23,0.25), rgba(74,126,247,0.15), transparent)",
                marginBottom: "28px",
              }}
            />

            {/* Letter body */}
            <div
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: "clamp(13px, 1.6vw, 15px)",
                lineHeight: 1.85,
                color: "rgba(255,255,255,0.78)",
              }}
            >
              <p style={{ margin: "0 0 18px" }}>
                When people first explore{" "}
                <strong
                  style={{
                    color: "rgba(255,255,255,0.95)",
                    fontFamily: "Fraunces, serif",
                  }}
                >
                  THE STEMONEF ENTERPRISES
                </strong>
                , a natural question often arises:
              </p>

              <blockquote
                style={{
                  margin: "0 0 20px",
                  padding: "14px 20px",
                  borderLeft: "2px solid rgba(212,160,23,0.4)",
                  background: "rgba(212,160,23,0.04)",
                  borderRadius: "0 6px 6px 0",
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.72)",
                  fontSize: "clamp(13px, 1.5vw, 14.5px)",
                }}
              >
                How can one organization attempt so many things at once? Is this
                vision truly practical?
              </blockquote>

              <p style={{ margin: "0 0 18px" }}>
                To be honest, we asked ourselves the same question when this
                journey began.
              </p>

              <p style={{ margin: "0 0 18px" }}>
                THE STEMONEF ENTERPRISES was not built around a single idea. It
                emerged from a conviction that the challenges facing our world —
                climate instability, fragmented knowledge systems, unequal
                access to opportunity, and the growing complexity of technology
                — cannot be addressed in isolation. They require interconnected
                systems of research, intelligence, talent development, ethical
                governance, and collaboration.
              </p>

              <p style={{ margin: "0 0 18px" }}>
                What you see on this platform represents the foundation of such
                a system.
              </p>

              <p style={{ margin: "0 0 18px" }}>
                Some initiatives are already active. Others are in careful
                stages of development. Over time, new research programs,
                intelligence outputs, partnerships, and impact initiatives will
                continue to emerge. Not every idea will unfold exactly as
                imagined, but every step will remain guided by one principle:{" "}
                <strong
                  style={{ color: "rgba(212,160,23,0.95)", fontWeight: 600 }}
                >
                  to act responsibly, ethically, and in service of people and
                  the natural systems that sustain us.
                </strong>
              </p>

              <p style={{ margin: "0 0 18px" }}>
                This enterprise is not driven by hype or short-term attention.
                At its core, it is driven by people — curious minds, thoughtful
                collaborators, and individuals who believe that knowledge, when
                applied with integrity, can still shape a better future.
              </p>

              <p style={{ margin: "0 0 18px" }}>
                If the ideas here resonate with you, we invite you to keep
                observing our work as it unfolds. You will see research
                initiatives develop, collaborations expand, and tangible impact
                begin to take shape.
              </p>

              <p style={{ margin: "0 0 18px" }}>
                If you feel aligned with the mission, you are welcome to
                contribute and support the journey. If not, we sincerely wish
                you the very best in your own path.
              </p>

              <p style={{ margin: "0 0 32px" }}>
                Either way, thank you for taking the time to explore what we are
                building.
              </p>
            </div>

            {/* Divider */}
            <div
              style={{
                height: "1px",
                background:
                  "linear-gradient(90deg, rgba(212,160,23,0.2), rgba(74,126,247,0.1), transparent)",
                marginBottom: "28px",
              }}
            />

            {/* Signatures */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              {[
                {
                  name: "Kajal Jha",
                  role: "Chief Executive Officer & Chair",
                },
                {
                  name: "Vikas Choudhary",
                  role: "Founder & Chair",
                },
              ].map((sig) => (
                <div
                  key={sig.name}
                  style={{
                    padding: "18px",
                    border: "1px solid rgba(212,160,23,0.14)",
                    borderRadius: "8px",
                    background: "rgba(212,160,23,0.03)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "Fraunces, serif",
                      fontSize: "clamp(14px, 1.8vw, 16px)",
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.92)",
                      marginBottom: "4px",
                    }}
                  >
                    {sig.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "Geist Mono, monospace",
                      fontSize: "10px",
                      letterSpacing: "0.08em",
                      color: "rgba(212,160,23,0.65)",
                      marginBottom: "4px",
                    }}
                  >
                    {sig.role}
                  </div>
                  <div
                    style={{
                      fontFamily: "Geist Mono, monospace",
                      fontSize: "9px",
                      letterSpacing: "0.12em",
                      color: "rgba(255,255,255,0.3)",
                      textTransform: "uppercase",
                    }}
                  >
                    THE STEMONEF ENTERPRISES
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom close cue */}
            <div
              style={{
                marginTop: "28px",
                textAlign: "center",
              }}
            >
              <button
                type="button"
                data-ocid="founders_signal.cancel_button"
                onClick={handleClose}
                style={{
                  fontFamily: "Geist Mono, monospace",
                  fontSize: "10px",
                  letterSpacing: "0.18em",
                  color: "rgba(255,255,255,0.3)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  padding: "6px 12px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "rgba(212,160,23,0.6)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "rgba(255,255,255,0.3)";
                }}
              >
                Close Signal ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyframes injected once */}
      <style>{`
        @keyframes fs-dot-pulse {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(212,160,23,0.4); }
          50% { opacity: 0.6; transform: scale(1.3); box-shadow: 0 0 0 5px rgba(212,160,23,0); }
        }
        @keyframes fs-wave-draw {
          0%   { stroke-dashoffset: 60; stroke-dasharray: 60 200; }
          50%  { stroke-dashoffset: 0;  stroke-dasharray: 100 200; }
          100% { stroke-dashoffset: -60; stroke-dasharray: 60 200; }
        }
        @keyframes fs-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fs-fade-out {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes fs-panel-in {
          from { opacity: 0; transform: translate(-50%,-50%) scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: translate(-50%,-50%) scale(1)    translateY(0); }
        }
        @keyframes fs-panel-out {
          from { opacity: 1; transform: translate(-50%,-50%) scale(1)    translateY(0); }
          to   { opacity: 0; transform: translate(-50%,-50%) scale(0.94) translateY(8px); }
        }
        @keyframes fs-scan-sweep {
          0%   { top: -2px; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </>
  );
}
