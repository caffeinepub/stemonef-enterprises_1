import { useCallback, useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

interface NeuralCanvasProps {
  className?: string;
  interactive?: boolean;
}

export default function NeuralCanvas({
  className = "",
  interactive = true,
}: NeuralCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const initParticles = useCallback((width: number, height: number) => {
    const count = Math.floor((width * height) / 14000);
    particlesRef.current = Array.from({ length: Math.min(count, 80) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles(canvas.width, canvas.height);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    if (interactive) {
      canvas.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mousemove", handleMouseMove);
    }

    // Cap to ~30 FPS and pause when tab is hidden
    let lastFrame = 0;
    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    const draw = (timestamp: number) => {
      if (document.hidden) {
        animFrameRef.current = requestAnimationFrame(draw);
        return;
      }
      if (timestamp - lastFrame < FRAME_INTERVAL) {
        animFrameRef.current = requestAnimationFrame(draw);
        return;
      }
      lastFrame = timestamp;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Draw grid
      ctx.strokeStyle = "rgba(42, 92, 246, 0.04)";
      ctx.lineWidth = 0.5;
      const gridSize = 60;
      for (let x = 0; x <= w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const connectionDist = 140;
      const mouseInfluence = 120;

      // Update and draw particles
      for (const p of particles) {
        // Mouse repulsion/attraction
        if (interactive) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseInfluence) {
            const force = (mouseInfluence - dist) / mouseInfluence;
            p.vx += (dx / dist) * force * 0.02;
            p.vy += (dy / dist) * force * 0.02;
          }
        }

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Clamp velocity
        const maxV = 0.8;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > maxV) {
          p.vx = (p.vx / speed) * maxV;
          p.vy = (p.vy / speed) * maxV;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));

        // Draw node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74, 126, 247, ${p.opacity})`;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.25;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(74, 126, 247, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Yellow accent node near mouse
      if (interactive) {
        const mx = mouse.x;
        const my = mouse.y;
        if (mx > 0 && my > 0 && mx < w && my < h) {
          const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 60);
          grad.addColorStop(0, "rgba(212, 160, 23, 0.08)");
          grad.addColorStop(1, "rgba(212, 160, 23, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(mx, my, 60, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      ro.disconnect();
      if (interactive) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [interactive, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ display: "block" }}
    />
  );
}
