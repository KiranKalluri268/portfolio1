"use client";
import { useEffect, useRef, useCallback } from "react";

class Particle {
  constructor(
    public x: number,
    public y: number,
    public size: number,
    public speedX: number,
    public speedY: number,
    public z: number,
    public canvasWidth: number,
    public canvasHeight: number
  ) {}

  update() {
    // Scale speed based on z-depth (closer = faster)
    const zSpeedMultiplier = 0.5 + this.z * 4; // range from 0.5 to 2.5

    this.x += this.speedX * zSpeedMultiplier;
    this.y += this.speedY * zSpeedMultiplier;

    // If off-screen, respawn from random side
    const buffer = 50;
    const outOfBounds = (
      this.x < -buffer || this.x > this.canvasWidth + buffer ||
      this.y < -buffer || this.y > this.canvasHeight + buffer
    );

    if (outOfBounds) {
      const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
      if (side === 0) {
        this.x = Math.random() * this.canvasWidth;
        this.y = -buffer;
      } else if (side === 1) {
        this.x = this.canvasWidth + buffer;
        this.y = Math.random() * this.canvasHeight;
      } else if (side === 2) {
        this.x = Math.random() * this.canvasWidth;
        this.y = this.canvasHeight + buffer;
      } else {
        this.x = -buffer;
        this.y = Math.random() * this.canvasHeight;
      }

      // new random direction
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
    }
  }
}


export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const particleCount = Math.min(80, Math.floor(width / 50));

    for (let i = 0; i < particleCount; i++) {
      const z = Math.random() * 0.9 + 0.1;
      particles.push(
        new Particle(
          Math.random() * width,
          Math.random() * height,
          z,
          (1.5 - z) * 2, // bigger when z is close to 1 (closer)
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          width,
          height
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
  
    // Slightly darken the canvas instead of clearing it, to create a motion trail effect
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    particlesRef.current.forEach((particle) => {
      particle.update();
  
      const speed = Math.sqrt(particle.speedX ** 2 + particle.speedY ** 2);
      const zFactor = particle.z; // 0 (far) to 1 (close)
  
      const tailLength = 20 + 60 * zFactor; // longer for near particles
      const tailEndX = particle.x - particle.speedX * tailLength;
      const tailEndY = particle.y - particle.speedY * tailLength;
  
      const alpha = 0.3 + 0.5 * zFactor;
  
      // Draw tail as a soft line
      const gradient = ctx.createLinearGradient(particle.x, particle.y, tailEndX, tailEndY);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
  
      ctx.strokeStyle = gradient;
      ctx.lineWidth = particle.size * (1 + zFactor * 2); // fatter tail for closer particles
      ctx.beginPath();
      ctx.moveTo(particle.x, particle.y);
      ctx.lineTo(tailEndX, tailEndY);
      ctx.stroke();
  
      // Draw particle head
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, 1)`;
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
  
    animationFrameRef.current = requestAnimationFrame(drawParticles);
  }, []);  

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.style.backgroundColor = "#000";

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    drawParticles();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [drawParticles, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  );
}
