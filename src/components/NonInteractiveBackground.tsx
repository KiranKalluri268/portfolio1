"use client";
import { useEffect, useRef, useCallback } from 'react';

class Particle {
  constructor(
    public x: number,
    public y: number,
    public size: number,
    public speedX: number,
    public speedY: number,
    public depth: number, // Simulates z-index (0 = close, 1 = far)
    public canvasWidth: number,
    public canvasHeight: number
  ) {}

  update() {
    this.x += this.speedX * this.depth;
    this.y += this.speedY * this.depth;

    if (this.x < 0 || this.x > this.canvasWidth) this.speedX *= -1;
    if (this.y < 0 || this.y > this.canvasHeight) this.speedY *= -1;
  }
}

export default function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const particleCount = Math.min(80, Math.floor(width / 15));

    for (let i = 0; i < particleCount; i++) {
      const depth = Math.random() * 0.8 + 0.2; // Depth between 0.2 and 1
      particles.push(
        new Particle(
          Math.random() * width,
          Math.random() * height,
          (Math.random() * 1.5 + 0.5) * depth, // Smaller when farther
          (Math.random() * 2 - 1),
          (Math.random() * 2 - 1),
          depth,
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

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach(particle => {
      particle.update();

      // Glow effect based on depth
      const alpha = 0.3 + 0.5 * particle.depth; // More depth = brighter
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });

    animationFrameRef.current = requestAnimationFrame(drawParticles);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    drawParticles();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drawParticles, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none bg-black"
    />
  );
}
