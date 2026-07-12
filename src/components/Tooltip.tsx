"use client";

import { useEffect, useState } from "react";

interface TooltipProps {
  text: string;
  isVisible: boolean;
}

export default function Tooltip({ text, isVisible }: TooltipProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMouse = (event: MouseEvent) => setPosition({ x: event.clientX + 20, y: event.clientY + 20 });
    window.addEventListener("mousemove", updateMouse, { passive: true });
    return () => window.removeEventListener("mousemove", updateMouse);
  }, []);

  return (
    <div
      aria-hidden={!isVisible}
      style={{ left: position.x, top: position.y, zIndex: 9999 }}
      className={`fixed pointer-events-none whitespace-nowrap text-white text-sm font-semibold tracking-wide bg-black/40 px-2 py-1 rounded-md backdrop-blur-md border border-white/10 transition-[opacity,transform] duration-150 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-80"}`}
    >
      {text}
    </div>
  );
}
