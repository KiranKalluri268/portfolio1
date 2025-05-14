"use client";
import { useRef, useEffect } from "react";

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<{
    x: number;
    y: number;
    size: number;
    speed: number;
    direction: number;
    isStatic: boolean;
    twinkleOffset: number;
    color: string;
    shape: "circle" | "spike"
  }[]>([]);  
  const animationRef = useRef<number | null>(null);
  const hexToRgb = (hex: string): string => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  };
  
  // function drawSpikyStar(
  //   ctx: CanvasRenderingContext2D,
  //   x: number,
  //   y: number,
  //   spikes: number,
  //   innerRadius: number,
  //   outerRadius: number
  // ) {
  //   let rot = (Math.PI / 2) * 3;
  //   let step = Math.PI / spikes;
  
  //   ctx.moveTo(x, y - outerRadius);
  //   for (let i = 0; i < spikes; i++) {
  //     ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
  //     rot += step;
  
  //     ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
  //     rot += step;
  //   }
  //   ctx.lineTo(x, y - outerRadius);
  //   ctx.closePath();
  //   ctx.fill();
  // }
  
  const initStars = (w: number, h: number) => {
    starsRef.current = Array.from({ length: 200 }).map((_, index) => {
      const isStatic = Math.random() < 0.3; // 10% of the stars will be static
      const direction = index < 150 ? 1 : -1; // Half move down, half move up
      const size = (() => {
        const rand = Math.random();
        if (rand < 0.8) {
          return Math.random() * 1.5 + 0.5; // Small stars (60%)
        } else if (rand < 0.95) {
          return Math.random() * 2 + 1;   // Medium stars (30%)
        } else {
          return Math.random() * 3 + 2;     // Big stars (10%)
        }
      })();
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        size,
        speed: isStatic ? 0 : (Math.random() * 0.5 + 0.2) * (direction === 1 ? 0.2 : 0.1),
        direction,
        isStatic,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: ["#ffffff", "#ffe9c4", "#d4fbff"][Math.floor(Math.random() * 3)], // white, warm yellow, cool blue
        shape: Math.random() < 0.15 ? "spike" : "circle",
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
        star.y += star.speed * star.direction;
        if (star.y > canvas.height) star.y = 0;
        if (star.y < 0) star.y = canvas.height;
      }
    
      // Twinkling opacity for static stars
      const twinkle = star.isStatic
        ? Math.sin(Date.now() * 0.005 + star.twinkleOffset) * 0.4 + 0.6
        : 0.8;
    
      ctx.fillStyle = `rgba(${hexToRgb(star.color)}, ${twinkle})`;
      ctx.shadowBlur = star.shape === "spike" ? star.size * 3 : star.size * 1.5;
      ctx.shadowColor = star.color;
    
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
  }, [drawStars]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-10 pointer-events-none" />;
}
