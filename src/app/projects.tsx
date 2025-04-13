"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';

const projects = [
  {
    id: 1,
    title: "Project 1",
    description: "A brief description of Project 1.",
    image: "/images/project1.png",
    github: "https://cms-pro-kiran-kalluris-projects.vercel.app/",
  },
  {
    id: 2,
    title: "Project 2",
    description: "A brief description of Project 2.",
    image: "/images/project2.jpg",
  },
  {
    id: 3,
    title: "Project 3",
    description: "A brief description of Project 3.",
    image: "/images/project3.jpg",
    github: "https://github.com/yourusername/project3",
  },
  {
    id: 4,
    title: "Project 4",
    description: "A brief description of Project 4.",
    image: "/images/project4.jpg",
  },
];

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSectionActive, setIsSectionActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const { top, height } = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const sectionStart = viewportHeight / 2;
      const sectionEnd = viewportHeight / 2 + height;

      setIsSectionActive(top <= sectionStart && top + height >= sectionStart);

      if (top <= sectionStart && top + height >= sectionStart) {
        const progress = (sectionStart - top) / height;
        const newIndex = Math.min(
          projects.length - 1,
          Math.floor(progress * projects.length)
        );
        setActiveIndex(newIndex);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getProjectStyle = (index: number) => {
    const distance = index - activeIndex;
    const absDistance = Math.abs(distance);
    
    return {
      x: `${distance * 100}%`,
      scale: 1 - absDistance * 0.2,
      opacity: 1 - absDistance * 0.3, // Reduced opacity fade
      zIndex: projects.length - absDistance,
    };
  };

  return (
    <section 
      ref={containerRef} 
      id="projects" 
      className="relative h-[400vh] bg-black"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        <motion.h2 
          className="text-5xl font-bold text-center absolute top-20 left-0 right-0 z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: isSectionActive ? 1 : 0.5,
            y: isSectionActive ? 0 : -20
          }}
          transition={{ duration: 0.5 }}
        >
          Projects
        </motion.h2>

        <div className="relative w-full h-[70vh] mx-auto">
          <AnimatePresence>
            {projects.map((project, index) => {
              const style = getProjectStyle(index);
              const isActive = index === activeIndex;
              
              return (
                <motion.div
                  key={project.id}
                  className={`absolute top-0 left-0 right-0 mx-auto w-full max-w-4xl h-full ${
                    isActive ? "cursor-default" : "cursor-pointer"
                  }`}
                  initial={{ x: "0%", opacity: 0 }}
                  animate={{
                    x: style.x,
                    scale: style.scale,
                    opacity: style.opacity,
                  }}
                  transition={{
                    type: "spring",
                    damping: 30,
                    stiffness: 100
                  }}
                  style={{ zIndex: style.zIndex }}
                  onClick={() => !isActive && setActiveIndex(index)}
                >
                  <a
                    href={project.github || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    <div className="w-full h-full rounded-2xl shadow-2xl overflow-hidden relative">
                      {/* Image with optimized loading */}
                      {project.image ? (
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                          quality={80}
                          priority={index < 2} // Prioritize first two images
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                          <span className="text-gray-400">No image available</span>
                        </div>
                      )}
                      
                      {/* Text overlay with reduced opacity */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                        <motion.div
                          className="bg-black bg-opacity-60 p-6 rounded-xl"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ 
                            y: isActive ? 0 : 20,
                            opacity: isActive ? 1 : 0.8
                          }}
                        >
                          <h3 className="text-3xl font-semibold">{project.title}</h3>
                          <p className="mt-2 text-gray-300">{project.description}</p>
                          {project.github && (
                            <p className="mt-4 text-blue-400 hover:text-blue-300 transition-colors">
                              View on GitHub →
                            </p>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  </a>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <motion.div 
          className="absolute bottom-10 left-0 right-0 text-center text-gray-400 text-sm"
          animate={{ opacity: isSectionActive ? 1 : 0 }}
        >
          Scroll vertically to navigate projects
        </motion.div>
      </div>
    </section>
  );
}