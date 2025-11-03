"use client";
import { useEffect, useRef, useCallback } from "react";
import { useAudio } from "@/context/AudioContextProvider";

class Particle {
  trail: { x: number; y: number }[] = [];
  private playSound: () => void;

  constructor(
    public x: number,
    public y: number,
    public size: number,
    public speedX: number,
    public speedY: number,
    public z: number,
    public canvasWidth: number,
    public canvasHeight: number,
    playSound: () => void
  ) {
    this.playSound = playSound;
  }

  update(center: { x: number; y: number }, blackholeRadius: number) {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 10) this.trail.shift();

    const zSpeedMultiplier = 0.5 + this.z * 3;
    this.x += this.speedX * zSpeedMultiplier;
    this.y += this.speedY * zSpeedMultiplier;

    const dx = center.x - this.x;
    const dy = center.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < blackholeRadius * 8) {
  const pull = 1 / (dist + 0.01);
  const gravityStrength = pull * 0.05;

  const normDx = dx / dist;
  const normDy = dy / dist;
  const tangentX = -normDy;
  const tangentY = normDx;

  this.speedX += dx * gravityStrength * 0.2 + tangentX * gravityStrength * 0.1;
  this.speedY += dy * gravityStrength * 0.2 + tangentY * gravityStrength * 0.1;
}

if (dist < blackholeRadius * 5) {
  const pullStrength = (1 / (dist + 0.01)) * 2;
  this.speedX += dx * pullStrength * 0.002;
  this.speedY += dy * pullStrength * 0.002;
}

if (dist < blackholeRadius * 4) {
  const pullStrength = (1 / (dist + 0.01)) * 3.5;
  this.speedX += dx * pullStrength * 0.004;
  this.speedY += dy * pullStrength * 0.004;
}

if (dist < blackholeRadius * 3) {
  const pullStrength = (1 / (dist + 0.01)) * 5;
  this.speedX += dx * pullStrength * 0.006;
  this.speedY += dy * pullStrength * 0.006;
}

if (dist < blackholeRadius * 2) {
  const pullStrength = (1 / (dist + 0.01)) * 6.5;
  this.speedX += dx * pullStrength * 0.008;
  this.speedY += dy * pullStrength * 0.008;
}

if (dist < blackholeRadius * 1.2) {
  const pullStrength = (1 / (dist + 0.01)) * 8;
  this.speedX += dx * pullStrength * 0.01;
  this.speedY += dy * pullStrength * 0.01;
}

if (dist < blackholeRadius * 1) {
  this.playSound(); // 🔊 Particle is absorbed
  this.reset();
  return;
}


    const buffer = 100;
    if (
      this.x < -buffer || this.x > this.canvasWidth + buffer ||
      this.y < -buffer || this.y > this.canvasHeight + buffer
    ) {
      this.reset();
    }
  }

  reset() {
    const side = Math.floor(Math.random() * 4);
    switch (side) {
      case 0:
        this.x = Math.random() * this.canvasWidth;
        this.y = -50;
        break;
      case 1:
        this.x = this.canvasWidth + 50;
        this.y = Math.random() * this.canvasHeight;
        break;
      case 2:
        this.x = Math.random() * this.canvasWidth;
        this.y = this.canvasHeight + 50;
        break;
      default:
        this.x = -50;
        this.y = Math.random() * this.canvasHeight;
    }

    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.trail = [];
  }
}

export default function CometsInBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { audioEnabled } = useAudio();

  const playSound = () => {
    if (audioEnabled && audioRef.current) { 
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        // Silently handle audio play errors (e.g., autoplay restrictions)
        if (process.env.NODE_ENV === "development") {
          console.error("Error playing audio:", error);
        }
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const particleCount = Math.min(120, Math.floor(width / 60));

    for (let i = 0; i < particleCount; i++) {
      const z = Math.random() * 0.9 + 0.1;
      particles.push(
        new Particle(
          Math.random() * width,
          Math.random() * height,
          z,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          z,
          width,
          height,
          playSound // Pass sound handler
        )
      );
    }

    particlesRef.current = particles;
  }, []);

  const drawParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const center = { x: (canvas.width * 4) / 5, y: canvas.height / 2 };
    const blackholeRadius = 50;

    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.arc(center.x, center.y, blackholeRadius, 0, Math.PI * 2);
    ctx.fill();

    particlesRef.current.forEach((p) => {
      p.update(center, blackholeRadius);

      const zFactor = p.z;

      if (p.trail.length > 1) {
        const start = p.trail[0];
        ctx.beginPath();
        ctx.lineWidth = p.size * (1 + zFactor * 1.5);

        const gradientTrail = ctx.createLinearGradient(start.x, start.y, p.x, p.y);
        gradientTrail.addColorStop(0, `rgba(255, 255, 255, 0)`);
        gradientTrail.addColorStop(1, `rgba(255, 255, 255, ${0.3 + 0.4 * zFactor})`);
        ctx.strokeStyle = gradientTrail;

        ctx.moveTo(start.x, start.y);
        for (let i = 1; i < p.trail.length - 1; i++) {
          const midX = (p.trail[i].x + p.trail[i + 1].x) / 2;
          const midY = (p.trail[i].y + p.trail[i + 1].y) / 2;
          ctx.quadraticCurveTo(p.trail[i].x, p.trail[i].y, midX, midY);
        }
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.arc(p.x, p.y, p.size * (0.5 + zFactor), 0, Math.PI * 2);
      ctx.fill();
    });

    animationFrameRef.current = requestAnimationFrame(drawParticles);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    resize();
    drawParticles();
    window.addEventListener("resize", resize);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [drawParticles, initParticles]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full -z-20 pointer-events-none"
      />
      <audio ref={audioRef} src="/sounds/absorbtion.mp3" preload="auto" />
    </>
  );
}
