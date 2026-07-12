"use client";

import { useEffect, useRef } from "react";

interface TooltipProps {
  text: string;
  isVisible: boolean;
}

export default function Tooltip({ text, isVisible }: TooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) return;
    const updateMouse = (event: PointerEvent) => {
      if (!tooltipRef.current) return;
      tooltipRef.current.style.transform = `translate3d(${event.clientX + 20}px, ${event.clientY + 20}px, 0)`;
    };
    window.addEventListener("pointermove", updateMouse, { passive: true });
    return () => window.removeEventListener("pointermove", updateMouse);
  }, [isVisible]);

  return (
    <div
      ref={tooltipRef}
      aria-hidden={!isVisible}
      style={{ left: 0, top: 0, zIndex: 9999 }}
      className={`fixed pointer-events-none whitespace-nowrap text-white text-sm font-semibold tracking-wide bg-black/40 px-2 py-1 rounded-md backdrop-blur-md border border-white/10 transition-[opacity,transform] duration-150 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-80"}`}
    >
      {text}
    </div>
  );
}
