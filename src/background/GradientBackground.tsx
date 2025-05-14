"use client";
import { useEffect, useRef } from 'react';

export default function GradientBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const { clientX, clientY } = e;
      const { width, height, left, top } = ref.current.getBoundingClientRect();
      
      const x = clientX - left;
      const y = clientY - top;
      
      ref.current.style.setProperty('--x', `${x / width * 100}%`);
      ref.current.style.setProperty('--y', `${y / height * 100}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={ref}
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{
        background: `
          radial-gradient(
            /* Smaller size (30px) with sharp falloff */
            400px circle at var(--x, 50%) var(--y, 50%),
            rgba(185, 123, 7, 0.32) 10%,
            transparent 100%
          ),
          /* Base black background */
          linear-gradient(
            rgba(0, 0, 0, 1),
            rgba(0, 0, 0, 1)
        `
      }}
    >
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
    </div>
  );
}