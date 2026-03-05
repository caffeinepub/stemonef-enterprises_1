export type FieldMode = "default" | "epochs" | "humanon" | "steami" | "cosmic";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  targetOpacity: number;
  baseVy: number;
}

interface Connection {
  a: number;
  b: number;
}

const MAX_CONNECTION_DIST = 120;
const FPS = 30;
const FRAME_INTERVAL = 1000 / FPS;

export class LivingFieldEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private connections: Connection[] = [];
  private mode: FieldMode = "default";
  private animFrame = 0;
  private lastTime = 0;
  private running = false;
  private mouseX = -1000;
  private mouseY = -1000;
  private modeTransitionProgress = 1;
  private pulseTime = 0;

  private tier: number;
  private particleCount: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    this.ctx = ctx;
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    this.tier = w < 768 ? 0 : w < 1024 ? 1 : 2;
    const counts = [32, 60, 100];
    this.particleCount = counts[this.tier];
    this.initParticles();
  }

  private initParticles() {
    this.particles = [];
    const dpr =
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const w = this.canvas.width / dpr;
    const h = this.canvas.height / dpr;
    for (let i = 0; i < this.particleCount; i++) {
      const baseVy = (Math.random() - 0.5) * 0.3;
      this.particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: baseVy,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.35 + 0.05,
        targetOpacity: Math.random() * 0.35 + 0.05,
        baseVy,
      });
    }
  }

  resize(w: number, h: number) {
    const dpr =
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.ctx.scale(dpr, dpr);
    this.initParticles();
  }

  setMode(mode: FieldMode) {
    if (this.mode !== mode) {
      this.mode = mode;
      this.modeTransitionProgress = 0;
    }
  }

  setMouse(x: number, y: number) {
    this.mouseX = x;
    this.mouseY = y;
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    this.loop();
  }

  stop() {
    this.running = false;
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  }

  private loop() {
    if (!this.running) return;
    this.animFrame = requestAnimationFrame((t) => {
      if (t - this.lastTime >= FRAME_INTERVAL) {
        this.update(t - this.lastTime);
        this.render();
        this.lastTime = t;
      }
      this.loop();
    });
  }

  private update(dt: number) {
    const dpr =
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const w = this.canvas.width / dpr;
    const h = this.canvas.height / dpr;

    if (this.modeTransitionProgress < 1) {
      this.modeTransitionProgress = Math.min(
        1,
        this.modeTransitionProgress + 0.02,
      );
    }

    this.pulseTime += dt * 0.001;

    for (const p of this.particles) {
      if (this.mode === "humanon") {
        p.vy = p.vy * 0.98 + -0.5 * 0.02;
      } else if (this.mode === "epochs") {
        p.vx *= 0.99;
        p.vy *= 0.99;
      } else if (this.mode === "steami") {
        const cx = w / 2;
        const cy = h / 2;
        const dx = cx - p.x;
        const dy = cy - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        p.vx += (dx / dist) * 0.01;
        p.vy += (dy / dist) * 0.01;
        p.vx *= 0.99;
        p.vy *= 0.99;
      } else if (this.mode === "cosmic") {
        p.vx *= 0.998;
        p.vy *= 0.998;
      } else {
        p.vx += (Math.random() - 0.5) * 0.01;
        p.vy += (Math.random() - 0.5) * 0.01;
        p.vx = Math.max(-0.6, Math.min(0.6, p.vx));
        p.vy = Math.max(-0.6, Math.min(0.6, p.vy));
      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      const mdx = p.x - this.mouseX;
      const mdy = p.y - this.mouseY;
      const mouseDist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mouseDist < 80) {
        p.targetOpacity = Math.min(0.85, p.targetOpacity + 0.05);
      } else {
        p.targetOpacity = p.opacity * 0.5 + 0.05;
      }
      p.opacity += (p.targetOpacity - p.opacity) * 0.1;
    }

    if (this.mode !== "cosmic") {
      this.connections = [];
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const dx = this.particles[i].x - this.particles[j].x;
          const dy = this.particles[i].y - this.particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_CONNECTION_DIST) {
            this.connections.push({ a: i, b: j });
          }
        }
      }
    } else {
      this.connections = [];
    }
  }

  private render() {
    const dpr =
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const w = this.canvas.width / dpr;
    const h = this.canvas.height / dpr;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, w, h);

    const isCosmic = this.mode === "cosmic";

    for (const c of this.connections) {
      const pa = this.particles[c.a];
      const pb = this.particles[c.b];
      const dx = pa.x - pb.x;
      const dy = pa.y - pb.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const alpha = (1 - dist / MAX_CONNECTION_DIST) * 0.18;

      let lineColor = `rgba(74,126,247,${alpha})`;
      if (this.mode === "epochs") lineColor = `rgba(74,126,247,${alpha * 1.4})`;
      if (this.mode === "humanon") lineColor = `rgba(100,200,247,${alpha})`;
      if (this.mode === "steami") lineColor = `rgba(212,160,23,${alpha * 0.8})`;

      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    for (const p of this.particles) {
      let color = "74,126,247";
      if (this.mode === "humanon") color = "100,200,247";
      if (this.mode === "steami") color = "212,160,23";
      if (isCosmic) color = "200,220,255";

      let extraGlow = 0;
      if (this.mode === "steami") {
        extraGlow =
          (Math.sin(this.pulseTime * 3 + p.x * 0.05) * 0.5 + 0.5) * 0.15;
      }

      const opacity = Math.min(0.9, p.opacity + extraGlow);

      const grad = ctx.createRadialGradient(
        p.x,
        p.y,
        0,
        p.x,
        p.y,
        p.radius * 4,
      );
      grad.addColorStop(0, `rgba(${color},${opacity})`);
      grad.addColorStop(1, `rgba(${color},0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${opacity})`;
      ctx.fill();
    }
  }
}
