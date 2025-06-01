"use client";
import { useRef, useEffect, useCallback } from "react";

export default function StarfieldBackground({ starCount = 200 }: { starCount?: number }) {
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
    shape: "circle" | "spike";
    spikes?: number;
    lengths?: number[];
  }[]>([]);  

  const animationRef = useRef<number | null>(null);

  const hexToRgb = (hex: string): string => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  };

  const initStars = useCallback((w: number, h: number) => {
  const possibleSpikes = [4, 6, 8];

  starsRef.current = Array.from({ length: starCount }).map((_, index) => {
    const isStatic = Math.random() < 0.3;
    const direction = index < 150 ? 1 : -1;

    const size = (() => {
      const rand = Math.random();
      if (rand < 0.8) return Math.random() * 1.5 + 0.5;
      if (rand < 0.95) return Math.random() * 1.5 + 1;
      return Math.random() * 2 + 1.5;
    })();

    const shape = "spike";

    let spikes = 0;
    let lengths: number[] = [];

    if (shape === "spike") {
      spikes = possibleSpikes[Math.floor(Math.random() * possibleSpikes.length)];
      const half = Math.floor(spikes / 2);
      const variation = () => Math.random() * 0.5 + 1;
      lengths = Array.from({ length: half }, variation);
      lengths = lengths.concat(lengths.slice().reverse()); // mirror symmetry
      if (spikes % 2 !== 0) lengths.splice(half, 0, variation());
    }

    return {
      x: Math.random() * w,
      y: Math.random() * h,
      size,
      speed: isStatic ? 0 : (Math.random() * 0.5 + 0.2) * (direction === 1 ? 0.2 : 0.1),
      direction,
      isStatic,
      twinkleOffset: Math.random() * Math.PI * 2,
      color: ["#ffffff", "#ffe9c4", "#d4fbff"][Math.floor(Math.random() * 3)],
      shape,
      spikes,
      lengths,
    };
  });
}, [starCount]);

  function drawSpikyStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  spikes: number,
  innerRadius: number,
  outerRadius: number
) {
  let rot = Math.PI / 2 * 3;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(x, y - outerRadius);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
    rot += step;

    ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
    rot += step;
  }
  ctx.closePath();
  ctx.fill();
}


  const drawStars = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastFrameTime = 0;
    const desiredFPS = 30;
    const frameDuration = 1000 / desiredFPS;

    const render = (time: number) => {
      if (time - lastFrameTime >= frameDuration) {
        lastFrameTime = time;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const star of starsRef.current) {
          if (!star.isStatic) {
            star.y += star.speed * star.direction;
            if (star.y > canvas.height) star.y = 0;
            if (star.y < 0) star.y = canvas.height;
          }

          const twinkle = star.isStatic
            ? Math.sin(Date.now() * 0.003 + star.twinkleOffset) * 0.5 + 0.5
            : 1;

          ctx.fillStyle = `rgba(${hexToRgb(star.color)}, ${twinkle})`;
          ctx.shadowColor = star.color;
          ctx.shadowBlur = star.shape === "spike"
            ? star.size * 3 * twinkle
            : star.size * 1.5 * twinkle;

          if (star.shape === "circle") {
  ctx.beginPath();
  ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
  ctx.fill();
} else {
  // Calculate inner and outer spike lengths
  const spikes = star.spikes ?? 6;
  const innerRadius = star.size * 0.2;
  const outerRadius = star.size * 3; // long spike effect

  drawSpikyStar(ctx, star.x, star.y, spikes, innerRadius, outerRadius);
}

        }
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.scale(dpr, dpr);
      initStars(canvas.width / dpr, canvas.height / dpr);
    };

    resize();
    drawStars();
    window.addEventListener("resize", resize);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [drawStars, initStars]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-19 pointer-events-none" />;
}
