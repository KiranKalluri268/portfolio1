"use client";
import { useEffect, useRef, useState } from "react";
import { useAudio } from "../context/AudioContextProvider";

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

export default function LoadingScreen({
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

  // Audio context
  const { audioEnabled, setAudioEnabled } = useAudio();

  // Show prompt if audio is not enabled
  const [visible, setVisible] = useState(!audioEnabled);

  // Loading progress state
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Responsive canvas size
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 300 });

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

  // Actual loading progress tracking
  useEffect(() => {
    if (!visible) return;

    let fontsReady = false;

    // Helper to calculate progress based on images loaded
    const checkProgress = () => {
      // If document is already complete, we're at 100% (but check fonts!)
      if (document.readyState === "complete" && fontsReady) {
        return 100;
      }

      const images = document.images;
      const total = images.length;

      if (total === 0) return 0;

      let loaded = 0;
      for (let i = 0; i < total; i++) {
        if (images[i].complete) {
          loaded++;
        }
      }

      return Math.floor((loaded / total) * 100);
    };

    // Track fonts separately
    document.fonts.ready.then(() => {
      fontsReady = true;
    });

    // 0. Initial check: might already be done if came from another page
    // or if the browser cached everything instantly.
    if (document.readyState === "complete") {
      // We still want to verify fonts if possible.
    }

    // 1. Listen for window load event (absolute 100%)
    const handleLoad = () => {
      // Window loaded
    };
    window.addEventListener("load", handleLoad);

    // 2. Poll for image loading progress + drift
    let currentDrift = 0;
    const interval = setInterval(() => {
      const realProgress = checkProgress();

      // Add a small "drift" so it doesn't look frozen if waiting for one big asset
      if (currentDrift < 90) {
        currentDrift += 0.5; // slow automated tick
      }

      // Use the higher of the two values to ensure we never go backwards
      // but favor real progress if it jumps ahead.
      // We cap drift at 99 so it never hits 100 purely by drifting.
      let displayProgress = Math.min(
        99,
        Math.max(Math.floor(currentDrift), realProgress)
      );

      // CAP at 90% if fonts are not ready yet
      if (!fontsReady && displayProgress > 90) {
        displayProgress = 90;
      }

      setLoadingProgress((prev) => {
        // If we hit 100, stay there
        if (prev >= 100) return 100;
        // Never go backwards
        return Math.max(prev, displayProgress);
      });

      // If we confirm real progress reaches 100 via check (includes fonts), finish early
      if (realProgress === 100 && fontsReady) {
        setLoadingProgress(100);
        setIsLoaded(true);
        clearInterval(interval);
      }
    }, 200);

    return () => {
      window.removeEventListener("load", handleLoad);
      clearInterval(interval);
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return; // don't run animation if hidden

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

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

    let lastFrame = 0;
    function draw(time = 0) {
      if (!canvas) return;
      if (document.hidden || time - lastFrame < 1000 / 30) {
        animationFrameRef.current = requestAnimationFrame(draw);
        return;
      }
      lastFrame = time;
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

    animationFrameRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [canvasSize, color, thickness, speed, numParticles, orbitRadii, particleRadius, tailLength, visible]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && visible && isLoaded && buttonRef.current) {
        buttonRef.current.click(); // triggers the full click lifecycle
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, isLoaded]);

  const handleEnableAudio = () => {
    setAudioEnabled(true);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex justify-center items-center z-[9999]">
      <canvas
        ref={canvasRef}
        className="rounded-full bg-transparent w-screen h-screen absolute top-0 left-0 pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-[60px]">
          {!isLoaded ? (
            <p
              key="loading-text"
              className="animate-fade-in text-2xl md:text-3xl font-bold font-mono"
              style={{ color: color }}
            >
              {loadingProgress}%
            </p>
          ) : (
            <button
              ref={buttonRef}
              key="enter-button"
              onClick={handleEnableAudio}
              className="animate-pop-in text-2xl md:text-3xl font-bold cursor-pointer bg-transparent border-none select-none transition-transform duration-200 hover:scale-115 active:scale-95 p-4"
              style={{ color: color }}
              aria-label="Enable Audio and Enter"
            >
              Enter
            </button>
          )}
      </div>

      <p
        className="absolute bottom-8 left-0 w-full text-center text-sm md:text-base font-light tracking-wider select-none px-4 pb-safe"
        style={{ color: colorToRgba(color, 0.7) }}
      >
        NOTE: You can also use arrow keys (or WASD keys like in Games) for navigation, Clicking &quot;ENTER&quot; will turn on audio
      </p>
    </div>
  );
}
