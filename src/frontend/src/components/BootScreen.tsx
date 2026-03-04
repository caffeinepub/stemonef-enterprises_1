import { useEffect, useRef, useState } from "react";

interface BootScreenProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  "STEMONEF INTELLIGENCE SYSTEM v2.1.0",
  "Initializing neural architecture...",
  "Loading pillar constellation...",
  "Activating intelligence feed...",
  "Calibrating ethical framework...",
  "SYSTEM READY",
];

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [nodePositions] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      y: 10 + Math.random() * 80,
      delay: Math.random() * 1.5,
      size: 2 + Math.random() * 3,
    })),
  );
  const completedRef = useRef(false);

  useEffect(() => {
    let idx = 0;
    const timer = setInterval(() => {
      if (idx < BOOT_LINES.length) {
        setLines((prev) => [...prev, BOOT_LINES[idx]]);
        idx++;
      } else {
        clearInterval(timer);
      }
    }, 280);

    const exitTimer = setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }, 2400);

    return () => {
      clearInterval(timer);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <div
      className="boot-screen"
      style={{
        background:
          "linear-gradient(135deg, #020309 0%, #030512 50%, #020309 100%)",
      }}
    >
      {/* Neural network SVG background */}
      <svg
        role="img"
        aria-label="Neural network background"
        className="absolute inset-0 w-full h-full opacity-20"
        style={{ pointerEvents: "none" }}
      >
        <defs>
          <radialGradient id="nodeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4a7ef7" stopOpacity="1" />
            <stop offset="100%" stopColor="#4a7ef7" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Connection lines */}
        {nodePositions.map((node, i) => {
          const next = nodePositions[(i + 1) % nodePositions.length];
          const skip = nodePositions[(i + 4) % nodePositions.length];
          return (
            <g key={`lines-${node.id}`}>
              <line
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${next.x}%`}
                y2={`${next.y}%`}
                stroke="rgba(74,126,247,0.3)"
                strokeWidth="0.5"
                strokeDasharray="4 4"
                style={{
                  animation: `line-draw 1s ease ${node.delay}s forwards`,
                  strokeDashoffset: 200,
                }}
              />
              {i % 3 === 0 && (
                <line
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${skip.x}%`}
                  y2={`${skip.y}%`}
                  stroke="rgba(212,160,23,0.2)"
                  strokeWidth="0.5"
                  strokeDasharray="3 6"
                  style={{
                    animation: `line-draw 1.2s ease ${node.delay + 0.3}s forwards`,
                    strokeDashoffset: 200,
                  }}
                />
              )}
            </g>
          );
        })}
        {/* Nodes */}
        {nodePositions.map((node) => (
          <circle
            key={`node-${node.id}`}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r={node.size}
            fill={
              node.id % 4 === 0
                ? "rgba(212,160,23,0.8)"
                : "rgba(74,126,247,0.8)"
            }
            style={{
              animation: `node-pulse 2s ease-in-out ${node.delay}s infinite`,
            }}
          />
        ))}
      </svg>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Wordmark */}
        <div className="text-center">
          <div
            className="font-display text-4xl md:text-6xl font-light tracking-[0.3em] text-gradient-hero mb-2"
            style={{ letterSpacing: "0.35em" }}
          >
            STEMONEF
          </div>
          <div
            className="text-xs tracking-[0.5em] uppercase"
            style={{ color: "rgba(212,160,23,0.7)" }}
          >
            INTELLIGENCE SYSTEM
          </div>
        </div>

        {/* Yellow accent line */}
        <div className="progress-flow-line h-px" style={{ width: "200px" }} />

        {/* Boot text */}
        <div
          className="font-mono-geist text-xs space-y-1 min-h-[120px]"
          style={{ width: "320px", color: "rgba(74,126,247,0.85)" }}
        >
          {lines.map((line, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: boot lines are ordered by index intentionally
              key={i}
              className="animate-fade-in-up"
              style={{
                animationDelay: `${i * 0.1}s`,
                color:
                  i === lines.length - 1 && line === "SYSTEM READY"
                    ? "rgba(212,160,23,1)"
                    : i === lines.length - 1
                      ? "rgba(74,126,247,1)"
                      : "rgba(74,126,247,0.6)",
              }}
            >
              <span style={{ color: "rgba(212,160,23,0.5)" }}>›</span> {line}
            </div>
          ))}
          {lines.length < BOOT_LINES.length && (
            <span
              className="inline-block w-1.5 h-3 ml-4"
              style={{
                background: "rgba(74,126,247,0.8)",
                animation: "node-pulse 0.8s ease-in-out infinite",
              }}
            />
          )}
        </div>

        {/* Loading indicator */}
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "rgba(74,126,247,0.6)",
                animation: `node-pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
