"use client";
import React, { useEffect, useRef, useState } from "react";
import { useAudio } from "../context/AudioContextProvider"; // <-- import your context hook

interface ParticleProps {
  radius: number;
  size: number;
  angle: number;
  speed: number;
  orbitRadius: number;
  centerX: number;
  centerY: number;
}

class LoadingParticle {
  radius: number;
  size: number;
  angle: number;
  speed: number;
  orbitRadius: number;
  centerX: number;
  centerY: number;
  tailLength: number;
  trail: { x: number; y: number }[] = [];

  constructor(props: ParticleProps & { tailLength: number }) {
    this.radius = props.radius;
    this.size = props.size;
    this.angle = props.angle;
    this.speed = props.speed;
    this.orbitRadius = props.orbitRadius;
    this.centerX = props.centerX;
    this.centerY = props.centerY;
    this.tailLength = props.tailLength;
  }

  update() {
    this.angle += this.speed;
    if (this.angle > Math.PI * 2) this.angle -= Math.PI * 2;

    const x = this.centerX + this.orbitRadius * Math.cos(this.angle);
    const y = this.centerY + this.orbitRadius * Math.sin(this.angle);

    this.trail.push({ x, y });

    if (this.trail.length > this.tailLength) this.trail.shift();

    return { x, y };
  }
}

interface LoadingScreenProps {
  tailLength?: number;
  thickness?: number;
  speed?: number;
  numParticles?: number;
  color?: string;
  orbitRadii?: number[];
  particleRadius?: number;
}

export default function AudioPermissionPrompt({
  tailLength = 100,
  thickness = 2.2,
  speed = 0.05,
  numParticles = 2,
  color = "white",
  orbitRadii = [80, 90],
  particleRadius = 1.8,
}: LoadingScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<LoadingParticle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Audio context from your old component
  const { audioEnabled, setAudioEnabled } = useAudio();

  // Show prompt if audio is not enabled
  const [visible, setVisible] = useState(!audioEnabled);

  // Responsive canvas size
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 300 });

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
    return `rgba(255,255,255,${alpha})`;
  }

  useEffect(() => {
    function updateCanvasSize() {
      if (!canvasRef.current) return;
      const parent = canvasRef.current.parentElement;
      if (!parent) return;

      const style = getComputedStyle(parent);
      const width =
        parent.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const height =
        parent.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);

      setCanvasSize({ width, height });
    }
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  useEffect(() => {
    if (!visible) return; // don't run animation if hidden

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = canvasSize.width * dpr;
    canvas.height = canvasSize.height * dpr;
    canvas.style.width = `${canvasSize.width}px`;
    canvas.style.height = `${canvasSize.height}px`;
    ctx.scale(dpr, dpr);

    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2;

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
          tailLength,
        });
      });

    function draw() {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

      particlesRef.current.forEach((p) => {
        const pos = p.update();

        for (let i = 1; i < p.trail.length; i++) {
          const prev = p.trail[i - 1];
          const curr = p.trail[i];

          const t = i / p.trail.length;
          ctx.beginPath();
          ctx.strokeStyle = colorToRgba(color, t * 0.7);
          ctx.lineWidth = p.size * thickness;
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(curr.x, curr.y);
          ctx.stroke();
        }

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
  }, [canvasSize, color, thickness, speed, numParticles, orbitRadii, particleRadius, tailLength, visible]);

  useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && visible && buttonRef.current) {
      buttonRef.current.click(); // triggers the full click lifecycle
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [visible]);

  const handleEnableAudio = () => {
    setAudioEnabled(true);
    setVisible(false);
  };

  if (!visible) return null;

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
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      />
      <button
        ref={buttonRef}
        onClick={handleEnableAudio}
        style={{
          position: "relative",
          fontSize: "1.5rem",
          fontWeight: "bold",
          cursor: "pointer",
          color: color,
          background: "transparent",
          userSelect: "none",
          transition: "transform 0.2s ease",
          zIndex: 10,
        }}
        onMouseEnter={(e) =>
          ((e.target as HTMLButtonElement).style.transform = "scale(1.2)")
        }
        onMouseLeave={(e) =>
          ((e.target as HTMLButtonElement).style.transform = "scale(1.0)")
        }
        aria-label="Enable Audio and Enter"
      >
        Enter
      </button>
    </div>
  );
}
