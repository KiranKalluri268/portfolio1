"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useUnifiedScroll } from "@/context/UnifiedScrollManager";
import type { SceneIndex } from "@/types";

interface SceneInfo {
  index: SceneIndex;
  name: string;
}

const scenes: SceneInfo[] = [
  { index: 0, name: "Hero" },
  { index: 1, name: "Projects" },
  { index: 2, name: "Experience" },
  { index: 3, name: "Skills" },
  { index: 4, name: "Contact" },
];

export default function SceneIndicator() {
  const { currentScene, navigateToScene, isTransitioning } = useUnifiedScroll();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleDotClick = (sceneIndex: SceneIndex) => {
    if (sceneIndex !== currentScene && !isTransitioning) {
      // navigateToScene will handle sequential transitions automatically
      navigateToScene(sceneIndex);
    }
  };

  return (
    <nav
      className="fixed left-4 top-1/2 -translate-y-1/2 z-50"
      aria-label="Scene navigation indicator"
      role="navigation"
    >
      <div className="relative flex flex-col items-center h-[400px] justify-between">
        {/* Vertical line connecting all dots */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-white/30 pointer-events-none" />
        
        {/* Dots */}
        {scenes.map((scene) => {
          const isActive = currentScene === scene.index;
          const isHovered = hoveredIndex === scene.index;
          
          // Size calculation: active > hovered > normal
          const baseSize = isActive ? 14 : 8;
          const hoverSize = isActive ? 14 : 10; // Hovered inactive dots become 10px, still smaller than active (14px)
          const dotSize = isHovered && !isActive ? hoverSize : baseSize;

          return (
            <motion.button
              key={scene.index}
              className="relative z-10 flex items-center justify-center bg-transparent border-none p-2 cursor-pointer outline-none"
              aria-label={`Go to ${scene.name} section${isActive ? " (current)" : ""}`}
              aria-current={isActive ? "page" : undefined}
              onClick={() => handleDotClick(scene.index)}
              onMouseEnter={() => setHoveredIndex(scene.index)}
              onMouseLeave={() => setHoveredIndex(null)}
              type="button"
            >
              {/* Dot */}
              <motion.div
                className="relative rounded-full bg-white shadow-lg transition-all duration-150"
                animate={{
                  width: dotSize,
                  height: dotSize,
                  scale: isActive ? 1.3 : isHovered ? 1.15 : 1,
                }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                style={{
                  boxShadow: isActive
                    ? "0 0 12px rgba(255, 255, 255, 0.9), 0 0 24px rgba(59, 130, 246, 0.6)"
                    : isHovered
                    ? "0 0 8px rgba(255, 255, 255, 0.7), 0 0 16px rgba(59, 130, 246, 0.4)"
                    : "0 0 4px rgba(255, 255, 255, 0.4)",
                }}
              >
                {/* Inner dot glow for active state */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-blue-400"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.6, scale: 1 }}
                    transition={{ duration: 0.15 }}
                  />
                )}
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}

