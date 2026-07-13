"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number; y: number; size: number; speed: number; direction: number;
  isStatic: boolean; twinkleOffset: number; color: string; rgb: string; spikes: number;
};

type Comet = {
  x: number; y: number; size: number; speedX: number; speedY: number; z: number;
  trail: Array<{ x: number; y: number }>;
};

const STAR_COUNT = 200;
const FPS = 30;
const PULL_BANDS = [
  { range: 5, strength: 2, factor: 0.002 },
  { range: 4, strength: 3.5, factor: 0.004 },
  { range: 3, strength: 5, factor: 0.006 },
  { range: 2, strength: 6.5, factor: 0.008 },
  { range: 1.2, strength: 8, factor: 0.01 },
];

const rgb = (hex: string) => {
  const value = Number.parseInt(hex.slice(1), 16);
  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
};

function drawStar(ctx: CanvasRenderingContext2D, star: Star, twinkle: number) {
  const outer = star.size * 3;
  const inner = star.size * 0.2;
  const step = Math.PI / star.spikes;
  let rotation = Math.PI * 1.5;
  ctx.beginPath();
  ctx.moveTo(star.x, star.y - outer);
  for (let index = 0; index < star.spikes; index++) {
    ctx.lineTo(star.x + Math.cos(rotation) * outer, star.y + Math.sin(rotation) * outer);
    rotation += step;
    ctx.lineTo(star.x + Math.cos(rotation) * inner, star.y + Math.sin(rotation) * inner);
    rotation += step;
  }
  ctx.closePath();
  ctx.fillStyle = `rgba(${star.rgb}, ${twinkle})`;
  ctx.shadowColor = star.color;
  ctx.shadowBlur = star.size * 3 * twinkle;
  ctx.fill();
}

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const cometsRef = useRef<Comet[]>([]);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = document.documentElement.clientWidth;
    let height = document.documentElement.clientHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let lastFrame = 0;
    const desktopQuery = window.matchMedia("(min-width: 640px)");
    const getBlackHoleCenter = () => desktopQuery.matches
      ? { x: width * 0.8, y: height * 0.5 }
      : { x: width * 0.5, y: height * 0.75 };

    const resetComet = (comet: Comet) => {
      const side = Math.floor(Math.random() * 4);
      if (side === 0) { comet.x = Math.random() * width; comet.y = -50; }
      else if (side === 1) { comet.x = width + 50; comet.y = Math.random() * height; }
      else if (side === 2) { comet.x = Math.random() * width; comet.y = height + 50; }
      else { comet.x = -50; comet.y = Math.random() * height; }
      comet.speedX = Math.random() * 2 - 1;
      comet.speedY = Math.random() * 2 - 1;
      comet.trail = [];
    };

    const buildGlow = () => {
      const glow = document.createElement("canvas");
      glow.width = width * dpr;
      glow.height = height * dpr;
      const glowCtx = glow.getContext("2d");
      if (!glowCtx) return;
      glowCtx.scale(dpr, dpr);
      const center = getBlackHoleCenter();
      const radius = desktopQuery.matches ? 60 : 31;
      const glowRadius = radius * 4;
      const radial = glowCtx.createRadialGradient(center.x, center.y, radius * 0.2, center.x, center.y, glowRadius);
      radial.addColorStop(0, "rgba(0,0,0,0)");
      radial.addColorStop(0.25, "rgba(126,38,9,.6)");
      radial.addColorStop(1, "rgba(0,0,0,0)");
      glowCtx.fillStyle = radial;
      glowCtx.beginPath();
      glowCtx.arc(center.x, center.y, glowRadius, 0, Math.PI * 2);
      glowCtx.fill();
      glowCtx.save();
      glowCtx.translate(center.x, center.y);
      glowCtx.rotate(-20 * Math.PI / 180);
      glowCtx.scale(1, 0.4);
      const ellipse = glowCtx.createRadialGradient(0, 0, radius, 0, 0, glowRadius * 1.15);
      ellipse.addColorStop(0, "rgba(0,0,0,0)");
      ellipse.addColorStop(0.25, "rgba(126,38,9,.6)");
      ellipse.addColorStop(1, "rgba(0,0,0,0)");
      glowCtx.fillStyle = ellipse;
      glowCtx.beginPath();
      glowCtx.arc(0, 0, glowRadius, 0, Math.PI * 2);
      glowCtx.fill();
      glowCtx.restore();
      glowCtx.fillStyle = "black";
      glowCtx.beginPath();
      glowCtx.arc(center.x, center.y, radius, 0, Math.PI * 2);
      glowCtx.fill();
      glowRef.current = glow;
    };

    const resize = () => {
      width = document.documentElement.clientWidth;
      height = document.documentElement.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.style.removeProperty("width");
      canvas.style.removeProperty("height");
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const colors = ["#ffffff", "#ffe9c4", "#d4fbff"];
      starsRef.current = Array.from({ length: STAR_COUNT }, (_, index) => {
        const isStatic = Math.random() < 0.3;
        const direction = index < 150 ? 1 : -1;
        const roll = Math.random();
        const size = roll < 0.8 ? Math.random() * 1.5 + 0.5 : roll < 0.95 ? Math.random() * 1.5 + 1 : Math.random() * 2 + 1.5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        return { x: Math.random() * width, y: Math.random() * height, size, direction, isStatic,
          speed: isStatic ? 0 : (Math.random() * 0.5 + 0.2) * (direction === 1 ? 0.2 : 0.1),
          twinkleOffset: Math.random() * Math.PI * 2, color, rgb: rgb(color), spikes: [4, 6, 8][Math.floor(Math.random() * 3)] };
      });
      const cometCount = Math.min(120, Math.floor(width / 60));
      cometsRef.current = Array.from({ length: cometCount }, () => {
        const z = Math.random() * 0.9 + 0.1;
        return { x: Math.random() * width, y: Math.random() * height, size: z, speedX: Math.random() * 2 - 1,
          speedY: Math.random() * 2 - 1, z, trail: [] };
      });
      buildGlow();
    };

    const render = (time: number) => {
      frameRef.current = requestAnimationFrame(render);
      if (document.hidden || time - lastFrame < 1000 / FPS) return;
      lastFrame = time;
      ctx.clearRect(0, 0, width, height);
      ctx.shadowBlur = 0;
      const now = time * 0.003;
      starsRef.current.forEach((star) => {
        if (!star.isStatic) {
          star.y += star.speed * star.direction;
          if (star.y > height) star.y = 0;
          if (star.y < 0) star.y = height;
        }
        drawStar(ctx, star, star.isStatic ? Math.sin(now + star.twinkleOffset) * 0.5 + 0.5 : 1);
      });
      ctx.shadowBlur = 0;
      const center = getBlackHoleCenter();
      const radius = 50;
      cometsRef.current.forEach((comet) => {
        comet.trail.push({ x: comet.x, y: comet.y });
        if (comet.trail.length > 10) comet.trail.shift();
        const speed = 0.5 + comet.z * 3;
        comet.x += comet.speedX * speed;
        comet.y += comet.speedY * speed;
        const dx = center.x - comet.x;
        const dy = center.y - comet.y;
        const distance = Math.hypot(dx, dy) || 0.01;
        if (distance < radius * 8) {
          const gravity = 0.05 / distance;
          comet.speedX += dx * gravity * 0.2 + (-dy / distance) * gravity * 0.1;
          comet.speedY += dy * gravity * 0.2 + (dx / distance) * gravity * 0.1;
        }
        PULL_BANDS.forEach(({ range, strength, factor }) => {
          if (distance >= radius * range) return;
          const pull = strength / distance;
          comet.speedX += dx * pull * factor;
          comet.speedY += dy * pull * factor;
        });
        if (distance < radius || comet.x < -100 || comet.x > width + 100 || comet.y < -100 || comet.y > height + 100) resetComet(comet);
        if (comet.trail.length > 1) {
          const first = comet.trail[0];
          const gradient = ctx.createLinearGradient(first.x, first.y, comet.x, comet.y);
          gradient.addColorStop(0, "rgba(255,255,255,0)");
          gradient.addColorStop(1, `rgba(255,255,255,${0.3 + 0.4 * comet.z})`);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = comet.size * (1 + comet.z * 1.5);
          ctx.beginPath();
          ctx.moveTo(first.x, first.y);
          comet.trail.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
          ctx.stroke();
        }
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, comet.size * (0.5 + comet.z), 0, Math.PI * 2);
        ctx.fill();
      });
      if (glowRef.current) ctx.drawImage(glowRef.current, 0, 0, width, height);
    };

    let resizeFrame = 0;
    const handleResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(resize);
    };
    resize();
    frameRef.current = requestAnimationFrame(render);
    window.addEventListener("resize", handleResize);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 h-full w-full -z-20 pointer-events-none" />;
}
