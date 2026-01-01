import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { useState, useEffect } from "react";
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
  { index: 3, name: "Tech Stack" },
  { index: 4, name: "Contact" },
];

export default function SceneIndicator() {
  const { currentScene, navigateToScene, isTransitioning } = useUnifiedScroll();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const updateMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX + 20); // Offset to not cover cursor
      mouseY.set(e.clientY + 20);
    };
    window.addEventListener("mousemove", updateMouse);
    return () => window.removeEventListener("mousemove", updateMouse);
  }, [mouseX, mouseY]);

  const handleDotClick = (sceneIndex: SceneIndex) => {
    if (sceneIndex !== currentScene && !isTransitioning) {
      // navigateToScene will handle sequential transitions automatically
      // Pass 'indicator' source to apply TRANSITION_DURATION delay
      navigateToScene(sceneIndex, 'indicator');
    }
  };

  return (
    <>
      <nav
        className="fixed left-6/16 top-1/20 z-50"
        aria-label="Scene navigation indicator"
        role="navigation"
      >
        <div className="relative flex flex-row justify-between items-center ">

          {/* Dots */}
          {scenes.map((scene) => {
            const isActive = currentScene === scene.index;
            const isHovered = hoveredIndex === scene.index;

            // Size calculation: active > hovered > normal
            const dotSize = 4; // Smaller consistent size

            return (
              <div key={scene.index} className="relative flex flex-col items-center">
                <motion.button
                  className="relative z-10 flex items-center justify-center bg-transparent border-none p-9 cursor-pointer outline-none"
                  aria-label={`Go to ${scene.name} section${isActive ? " (current)" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => handleDotClick(scene.index)}
                  onMouseEnter={() => setHoveredIndex(scene.index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  type="button"
                >
                  {/* Dot */}
                  <motion.div
                    className="relative rounded-full shadow-lg transition-all duration-150"
                    animate={{
                      width: dotSize,
                      height: dotSize,
                      scale: 1, // No size change
                    }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                    style={{
                      backgroundColor: isActive ? "#ef4444" : "white", // Red-500 if active, else white
                      boxShadow: isActive
                        ? "0 0 5px rgba(250, 3, 3, 1),0 0 5px rgba(250, 3, 3, 1),0 0 5px rgba(250, 3, 3, 1),0 0 5px rgba(250, 3, 3, 1), 0 0 10px rgba(250, 3, 3, 1), 0 0 10px rgba(250, 3, 3, 1), 0 0 10px rgba(250, 3, 3, 1), 0 0 10px rgba(250, 3, 3, 1), 0 0 15px rgba(250, 3, 3, 1), 0 0 15px rgba(250, 3, 3, 1), 0 0 15px rgba(250, 3, 3, 1), 0 0 15px rgba(250, 3, 3, 1), 0 0 20px rgba(250, 3, 3, 1), 0 0 20px rgba(250, 3, 3, 1), 0 0 20px rgba(250, 3, 3, 1), 0 0 20px rgba(250, 3, 3, 1), 0 0 30px rgba(250, 3, 3, 1), 0 0 30px rgba(250, 3, 3, 1), 0 0 30px rgba(250, 3, 3, 1), 0 0 40px rgba(250, 3, 3, 1), 0 0 40px rgba(250, 3, 3, 1), 0 0 50px rgba(250, 3, 3, 1), 0 0 50px rgba(250, 3, 3, 1), 0 0 60px rgba(250, 3, 3, 1), 0 0 60px rgba(250, 3, 3, 1), 0 0 80px rgba(250, 3, 3, 1)" // Intense Red shine
                        : isHovered
                          ? "0 0 10px rgba(255, 255, 255, 1),0 0 10px rgba(255, 255, 255, 1),0 0 10px rgba(255, 255, 255, 1),0 0 10px rgba(255, 255, 255, 1),0 0 10px rgba(255, 255, 255, 1),0 0 15px rgba(255, 255, 255, 1),0 0 15px rgba(255, 255, 255, 1),0 0 15px rgba(255, 255, 255, 1),0 0 15px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 1)" // Intense White shine
                          : "0 0 10px rgba(255, 255, 255, 0.3)", // Subtle shine
                    }}
                  >
                  </motion.div>
                </motion.button>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Floating Cursor Tooltip */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              x: mouseX,
              y: mouseY,
              pointerEvents: "none",
              zIndex: 9999, // Ensure it's on top of everything
            }}
            className="whitespace-nowrap text-white text-sm font-semibold tracking-wide bg-black/40 px-3 py-1 rounded-md backdrop-blur-md border border-white/10"
          >
            {scenes[hoveredIndex].name}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

