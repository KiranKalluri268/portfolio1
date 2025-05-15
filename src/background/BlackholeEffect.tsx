"use client";
import { useRef, useEffect, useCallback } from "react";

export default function Blackhole() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const centerRef = useRef({ x: 0, y: 0 });
  const blackholeRadius = 40;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const center = centerRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const glowRadius = blackholeRadius * 4;
    const grad = ctx.createRadialGradient(center.x, center.y, blackholeRadius * 0.2, center.x, center.y, glowRadius);
    grad.addColorStop(0, "rgba(255, 80, 20, 0.6)");
    grad.addColorStop(0.001, "rgba(255, 140, 30, 0.4)");
    grad.addColorStop(0.01, "rgb(255, 255, 255)");
    grad.addColorStop(0.02, "rgba(223, 63, 14, 0.4)");
    grad.addColorStop(0.03, "rgb(255, 255, 255)");
    grad.addColorStop(0.1, "rgba(255, 140, 30, 0.4)");
    grad.addColorStop(0.2, "rgba(255, 113, 30, 0.58)");
    grad.addColorStop(0.21, "rgb(197, 80, 13)");
    grad.addColorStop(0.22, "rgba(255, 113, 30, 0.58)");
    grad.addColorStop(0.23, "rgb(184, 37, 0)");
    grad.addColorStop(0.24, "rgba(230, 46, 0, 0.4)");
    grad.addColorStop(0.25, "rgba(255, 113, 30, 0.58)");
    grad.addColorStop(0.26, "rgb(197, 80, 13)");
    grad.addColorStop(0.27, "rgba(255, 113, 30, 0.58)");
    grad.addColorStop(0.28, "rgb(184, 37, 0)");
    grad.addColorStop(0.29, "rgba(230, 46, 0, 0.4)");
    grad.addColorStop(0.3, "rgba(0, 0, 0, 0)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.arc(center.x, center.y, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.arc(center.x, center.y, blackholeRadius, 0, Math.PI * 2);
    ctx.fill();

    animationRef.current = requestAnimationFrame(draw);
  }, [blackholeRadius]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      centerRef.current.x = (canvas.width * 4) / 5;
      centerRef.current.y = canvas.height / 2;
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-18 pointer-events-none"
    />
  );
}
