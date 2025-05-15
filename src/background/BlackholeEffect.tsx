"use client";
import { useRef, useEffect, useCallback } from "react";

export default function Blackhole() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const centerRef = useRef({ x: 0, y: 0 });
  const blackholeRadius = 30;


  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const center = centerRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const glowRadius = blackholeRadius * 4;
    const grad = ctx.createRadialGradient(center.x, center.y, blackholeRadius * 0.2, center.x, center.y, glowRadius);
    grad.addColorStop(0, "rgba(126, 38, 9, 0.6)");
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
    <div>
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-18 pointer-events-none"
    />
    <img
  src="/images/blackhole.png"
  alt="Black Hole"
  className="fixed top-1/2 left-[80%] w-60 h-37.5 object-contain -z-10 transform -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]"
  style={{
    transform: 'rotateX(0deg) rotateY(0deg) rotateZ(-20deg)',
  }}
/>
    </div>
  );
}
