"use client";
import { useRef, useEffect } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  orbiting: boolean;
}

export default function Blackhole() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const center = { x: 0, y: 0 };
  const blackholeRadius = 40;

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // No background color fill, keep it transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears the canvas to transparent

    const glowRadius = blackholeRadius * 4;
    const grad = ctx.createRadialGradient(center.x, center.y, blackholeRadius * 0.2, center.x, center.y, glowRadius);
    grad.addColorStop(0, "rgba(255, 80, 20, 0.6)");
    grad.addColorStop(0.1, "rgba(255, 140, 30, 0.4)");
    grad.addColorStop(0.2, "rgba(255, 113, 30, 0.58)");
    grad.addColorStop(0.5, "rgba(0, 0, 0, 0.2)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    

    // Draw the glow effect
    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.arc(center.x, center.y, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw the black hole itself (black center)
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.arc(center.x, center.y, blackholeRadius, 0, Math.PI * 2);
    ctx.fill();

    animationRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      center.x = (canvas.width * 4) / 5;
      center.y = canvas.height / 2;
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-50 pointer-events-none" />;
}
