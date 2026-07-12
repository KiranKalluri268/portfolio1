import { useState, useEffect, useRef } from "react";
import { useSmoothScroll, type SectionId } from "@/context/SmoothScrollContext";
import type { SceneIndex } from "@/types";

interface SceneInfo {
  index: SceneIndex;
  id: SectionId;
  name: string;
}

const scenes: SceneInfo[] = [
  { index: 0, id: "hero", name: "Hero" },
  { index: 1, id: "projects", name: "Projects" },
  { index: 2, id: "experience", name: "Experience" },
  { index: 3, id: "skills", name: "Tech Stack" },
  { index: 4, id: "contact", name: "Contact" },
];

export default function SceneIndicator() {
  const { activeSection, scrollToSection } = useSmoothScroll();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hoveredIndex === null) return;
    const updateMouse = (event: PointerEvent) => {
      if (!tooltipRef.current) return;
      tooltipRef.current.style.transform = `translate3d(${event.clientX + 20}px, ${event.clientY + 20}px, 0)`;
    };
    window.addEventListener("pointermove", updateMouse, { passive: true });
    return () => window.removeEventListener("pointermove", updateMouse);
  }, [hoveredIndex]);

  const handleDotClick = (section: SectionId) => {
    if (section !== activeSection) scrollToSection(section);
  };

  return (
    <>
      <nav
        className="fixed sm:left-6/16 left-1/5 sm:top-1/20 top-1/9 z-50"
        aria-label="Scene navigation indicator"
        role="navigation"
      >
        <div className="relative flex flex-row justify-between items-center ">

          {/* Dots */}
          {scenes.map((scene) => {
            const isActive = activeSection === scene.id;
            const isHovered = hoveredIndex === scene.index;

            // Size calculation: active > hovered > normal
            const dotSize = 4; // Smaller consistent size

            return (
              <div key={scene.index} className="relative flex flex-col items-center">
                <button
                  className="relative z-10 flex items-center justify-center bg-transparent border-none sm:p-9 p-6 cursor-pointer outline-none"
                  aria-label={`Go to ${scene.name} section${isActive ? " (current)" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => handleDotClick(scene.id)}
                  onMouseEnter={() => setHoveredIndex(scene.index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  type="button"
                >
                  {/* Dot */}
                  <div
                    className="relative rounded-full shadow-lg transition-all duration-150"
                    style={{
                      width: dotSize,
                      height: dotSize,
                      backgroundColor: isActive ? "#ef4444" : "white", // Red-500 if active, else white
                      boxShadow: isActive
                        ? "0 0 5px rgba(250, 3, 3, 1),0 0 5px rgba(250, 3, 3, 1),0 0 5px rgba(250, 3, 3, 1),0 0 5px rgba(250, 3, 3, 1), 0 0 10px rgba(250, 3, 3, 1), 0 0 10px rgba(250, 3, 3, 1), 0 0 10px rgba(250, 3, 3, 1), 0 0 10px rgba(250, 3, 3, 1), 0 0 15px rgba(250, 3, 3, 1), 0 0 15px rgba(250, 3, 3, 1), 0 0 15px rgba(250, 3, 3, 1), 0 0 15px rgba(250, 3, 3, 1), 0 0 20px rgba(250, 3, 3, 1), 0 0 20px rgba(250, 3, 3, 1), 0 0 20px rgba(250, 3, 3, 1), 0 0 20px rgba(250, 3, 3, 1), 0 0 30px rgba(250, 3, 3, 1), 0 0 30px rgba(250, 3, 3, 1), 0 0 30px rgba(250, 3, 3, 1), 0 0 40px rgba(250, 3, 3, 1), 0 0 40px rgba(250, 3, 3, 1), 0 0 50px rgba(250, 3, 3, 1), 0 0 50px rgba(250, 3, 3, 1), 0 0 60px rgba(250, 3, 3, 1), 0 0 60px rgba(250, 3, 3, 1), 0 0 80px rgba(250, 3, 3, 1)" // Intense Red shine
                        : isHovered
                          ? "0 0 10px rgba(255, 255, 255, 1),0 0 10px rgba(255, 255, 255, 1),0 0 10px rgba(255, 255, 255, 1),0 0 10px rgba(255, 255, 255, 1),0 0 10px rgba(255, 255, 255, 1),0 0 15px rgba(255, 255, 255, 1),0 0 15px rgba(255, 255, 255, 1),0 0 15px rgba(255, 255, 255, 1),0 0 15px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 1)" // Intense White shine
                          : "0 0 10px rgba(255, 255, 255, 0.3)", // Subtle shine
                    }}
                  >
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Floating Cursor Tooltip */}
        {hoveredIndex !== null && (
          <div
            ref={tooltipRef}
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              pointerEvents: "none",
              zIndex: 9999, // Ensure it's on top of everything
            }}
            className="whitespace-nowrap text-white text-sm font-semibold tracking-wide bg-black/40 px-3 py-1 rounded-md backdrop-blur-md border border-white/10"
          >
            {scenes[hoveredIndex].name}
          </div>
        )}
    </>
  );
}
