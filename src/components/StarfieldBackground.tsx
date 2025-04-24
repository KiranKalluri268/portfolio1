"use client";
import { useRef, useEffect } from "react";

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<{ x: number; y: number; size: number; speed: number; direction: number; isStatic: boolean }[]>([]);
  const animationRef = useRef<number | null>(null);

  const initStars = (w: number, h: number) => {
    starsRef.current = Array.from({ length: 250 }).map((_, index) => {
      const isStatic = Math.random() < 0.1; // 10% of the stars will be static
      const direction = index < 200 ? 1 : -1; // Half move down, half move up
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.5 + 0.5,
        speed: isStatic ? 0 : (Math.random() * 0.5 + 0.2) * (direction === 1 ? 1 : 0.5), // Static stars have no speed, moving stars adjust speed based on direction
        direction, // 1 = down, -1 = up
        isStatic,
      };
    });
  };

  const drawStars = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const star of starsRef.current) {
      if (!star.isStatic) {
        star.y += star.speed * star.direction; // Move stars based on their direction
        if (star.y > canvas.height) star.y = 0; // Reset stars that move downward
        if (star.y < 0) star.y = canvas.height; // Reset stars that move upward
      }

      // Twinkling effect for static stars
      if (star.isStatic) {
        const twinkle = Math.sin(Date.now() * 0.005 + star.x * 0.5) * 0.5 + 2; // This creates a twinkling effect
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
      } else {
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }

    animationRef.current = requestAnimationFrame(drawStars);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars(canvas.width, canvas.height);
    };

    resize();
    drawStars();
    window.addEventListener("resize", resize);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-10 pointer-events-none" />;
}
