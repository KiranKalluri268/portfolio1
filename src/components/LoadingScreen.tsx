"use client";
import React, { useEffect, useRef, useState } from "react";

interface ParticleProps {
  radius: number;        // particle radius (circle size)
  size: number;          // line thickness for trail
  angle: number;         // current angle position
  speed: number;         // speed of rotation (radians/frame)
  orbitRadius: number;   // orbit circle radius
  centerX: number;       // center x of orbit
  centerY: number;       // center y of orbit
}

class LoadingParticle {
  radius: number;
  size: number;
  angle: number;
  speed: number;
  orbitRadius: number;
  centerX: number;
  centerY: number;
  tailLength: number;  // <-- add this

  trail: { x: number; y: number }[] = [];

  constructor(props: ParticleProps & { tailLength: number }) {
    this.radius = props.radius;
    this.size = props.size;
    this.angle = props.angle;
    this.speed = props.speed;
    this.orbitRadius = props.orbitRadius;
    this.centerX = props.centerX;
    this.centerY = props.centerY;
    this.tailLength = props.tailLength; // <--- store tail length
  }

  update() {
    this.angle += this.speed;
    if (this.angle > Math.PI * 2) this.angle -= Math.PI * 2;

    const x = this.centerX + this.orbitRadius * Math.cos(this.angle);
    const y = this.centerY + this.orbitRadius * Math.sin(this.angle);

    this.trail.push({ x, y });

    // Use tailLength instead of fixed 30:
    if (this.trail.length > this.tailLength) this.trail.shift();

    return { x, y };
  }
}

interface LoadingScreenProps {
  tailLength?: number;         // max length of tail (default 30)
  thickness?: number;          // trail thickness multiplier (default 1.2)
  speed?: number;              // rotation speed (default 0.04)
  numParticles?: number;       // number of particles (default 2)
  color?: string;              // particle color (default white)
  orbitRadii?: number[];       // array of orbit radii (default [50,80])
  particleRadius?: number;     // radius of each particle (default 7)
}

export default function LoadingScreen({
  tailLength = 60,
  thickness = 1.5,
  speed = 0.08,
  numParticles = 2,
  color = "white",
  orbitRadii = [20, 40],
  particleRadius = 1,
}: LoadingScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<LoadingParticle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // To handle responsive canvas size
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 300 });

  // Helper: Convert hex color to rgba
  function hexToRgb(hex: string) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }
  function colorToRgba(color: string, alpha: number) {
    const rgb = hexToRgb(color);
    if (rgb) {
      return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
    }
    // fallback for named colors or invalid hex — use white with alpha
    return `rgba(255,255,255,${alpha})`;
  }

  useEffect(() => {
    function updateCanvasSize() {
      if (!canvasRef.current) return;
      const parent = canvasRef.current.parentElement;
      if (!parent) return;

      const style = getComputedStyle(parent);
      const width = parent.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const height = parent.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);

      setCanvasSize({ width, height });
    }
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Adjust for device pixel ratio for crispness
    const dpr = window.devicePixelRatio || 1;

    canvas.width = canvasSize.width * dpr;
    canvas.height = canvasSize.height * dpr;
    canvas.style.width = `${canvasSize.width}px`;
    canvas.style.height = `${canvasSize.height}px`;
    ctx.scale(dpr, dpr);

    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2;

    // Initialize particles with evenly spread angles
    particlesRef.current = Array(numParticles)
  .fill(null)
  .map((_, i) => {
    return new LoadingParticle({
      radius: particleRadius,
      size: particleRadius,
      angle: (2 * Math.PI * i) / numParticles,
      speed,
      orbitRadius: orbitRadii[i % orbitRadii.length] || 50,
      centerX,
      centerY,
      tailLength,     // <-- pass the tailLength here
    });
  });

    function draw() {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

      particlesRef.current.forEach((p) => {
        const pos = p.update();

        // Draw trail — segment by segment with fading alpha
for (let i = 1; i < p.trail.length; i++) {
  const prev = p.trail[i - 1];
  const curr = p.trail[i];

  const t = i / p.trail.length; // 0 to 1
  ctx.beginPath();
  ctx.strokeStyle = colorToRgba(color, t * 0.7); // fade based on segment age
  ctx.lineWidth = p.size * thickness;
  ctx.moveTo(prev.x, prev.y);
  ctx.lineTo(curr.x, curr.y);
  ctx.stroke();
}


        // Draw particle
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.arc(pos.x, pos.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [canvasSize, color, thickness, speed, numParticles, orbitRadii, particleRadius]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(0,0,0,0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          borderRadius: "50%",
          backgroundColor: "transparent",
          width: "100vw",
          height: "100vh",
        }}
      />
    </div>
  );
}
