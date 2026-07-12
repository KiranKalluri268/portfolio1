"use client";
import { useRef, useEffect, useCallback } from "react";

export default function Blackhole() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const centerRef = useRef({ x: 0, y: 0 });
  const blackholeRadiusRef = useRef(60);


  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const center = centerRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const glowRadius = blackholeRadiusRef.current * 4;
    const grad = ctx.createRadialGradient(center.x, center.y, blackholeRadiusRef.current * 0.2, center.x, center.y, glowRadius);
    grad.addColorStop(0, "rgba(0, 0, 0, 0)");
    grad.addColorStop(0.25, "rgba(126, 38, 9, 0.6)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.save();

    // Move to center and compensate for Y scaling
    ctx.translate(center.x, center.y);

    // Rotate -20 degrees around Z (in radians)
    ctx.rotate((-20 * Math.PI) / 180);

    // Scale Y to squash vertically into an ellipse
    ctx.scale(1, 0.4);

    // Create elliptical radial gradient centered at (0, 0)
    const ellipseGrad = ctx.createRadialGradient(
      0, 0, blackholeRadiusRef.current * 1,
      0, 0, glowRadius * 1.15
    );

    ellipseGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
    ellipseGrad.addColorStop(0.25, "rgba(126, 38, 9, 0.6)");
    ellipseGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = ellipseGrad;
    ctx.beginPath();
    ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();


    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.arc(center.x, center.y, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.arc(center.x, center.y, blackholeRadiusRef.current, 0, Math.PI * 2);
    ctx.fill();

  }, [blackholeRadiusRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (window.innerWidth < 640) {
        // Mobile: center X, lower Y
        blackholeRadiusRef.current = 31;
        centerRef.current.x = canvas.width / 2;
        centerRef.current.y = (canvas.height * 3) / 4;
      } else {
        // Desktop/tablet: right-ish X, middle Y
        blackholeRadiusRef.current = 60;
        centerRef.current.x = (canvas.width * 4) / 5;
        centerRef.current.y = canvas.height / 2;
      }
    };

    resize();
    draw();
    let resizeFrame = 0;
    const handleResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        resize();
        draw();
      });
    };
    const handleVisibility = () => {
      const video = videoRef.current;
      if (!video) return;
      if (document.hidden) video.pause();
      else video.play().catch(() => {});
    };
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [draw]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full -z-18 pointer-events-none"
      />
      <video
        ref={videoRef}
        src="/images/blackhole.webm"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="fixed top-3/4 left-1/2 sm:top-1/2 sm:left-[80%] w-210 h-210 object-contain -z-10 transform -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]"
        style={{
          transform: 'rotateX(0deg) rotateY(0deg) rotateZ(-20deg)',
        }}
      />
    </div>
  );
}
