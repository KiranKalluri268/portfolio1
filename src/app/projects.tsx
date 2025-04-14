"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
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
  const [activeIndex, setActiveIndex] = useState(-1); // -1 for title, 0+ for projects, projects.length for "See all"
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down');
  const [prevScroll, setPrevScroll] = useState(0);
  const sectionHeight = `${(projects.length + 2) * 100}vh`;

  // Scroll progress tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Track scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollDirection(currentScroll > prevScroll ? 'down' : 'up');
      setPrevScroll(currentScroll);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScroll]);

  // Update active index based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      const totalSteps = projects.length + 2;
      const step = Math.min(
        totalSteps - 1,
        Math.floor(progress * totalSteps)
      );
      setActiveIndex(step - 1);
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  // Get style for each item
  const getItemStyle = (index: number) => {
    const distance = index - activeIndex;
    const absDistance = Math.abs(distance);

    return {
      x: `${distance * 100}%`,
      opacity: 1 - absDistance * 0.5,
      scale: 1 - absDistance * 0.1,
      zIndex: projects.length + 2 - absDistance,
    };
  };

  // Special animation for title when scrolling back up
  const getTitleAnimation = () => {
    if (scrollDirection === 'up' && activeIndex === -1) {
      return {
        x: '0%',
        opacity: 1,
        scale: 1,
        transition: { 
          type: "spring", 
          damping: 30, 
          stiffness: 100 
        }
      };
    }
    return getItemStyle(-1);
  };

  return (
    <section 
      ref={containerRef}
      id="projects"
      className="relative bg-black text-white"
      style={{ height: sectionHeight }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <AnimatePresence>
          {/* Title Screen - now with custom scroll-back behavior */}
          {activeIndex === -1 && (
            <motion.div
              className="absolute w-full text-center"
              initial={{ 
                x: scrollDirection === 'down' ? "100%" : "-100%",
                opacity: 0,
                scale: 0.8 
              }}
              animate={getTitleAnimation()}
              exit={{ 
                x: scrollDirection === 'down' ? "-100%" : "100%",
                opacity: 0 
              }}
              transition={{ type: "spring", damping: 30, stiffness: 100 }}
              key="title"
            >
              <h2 className="text-8xl font-bold mb-8">Projects</h2>
              <p className="text-xl text-gray-400">Scroll to view my work</p>
            </motion.div>
          )}

          {/* Projects (unchanged) */}
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="absolute w-full h-full flex items-center justify-center"
              initial={{ x: "100%", opacity: 0 }}
              animate={getItemStyle(index)}
              transition={{ type: "spring", damping: 30, stiffness: 100 }}
            >
              <a
                href={project.github || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full max-w-4xl h-[60vh]"
              >
                <div className="relative w-full h-full rounded-2xl shadow-2xl overflow-hidden">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      quality={90}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-8">
                    <div className="bg-black/60 p-6 rounded-xl backdrop-blur-sm">
                      <h3 className="text-3xl font-bold">{project.title}</h3>
                      <p className="mt-3 text-gray-300">{project.description}</p>
                      {project.github && (
                        <p className="mt-4 text-blue-400">View on GitHub →</p>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
          
          {/* See All Projects (unchanged) */}
          {activeIndex >= projects.length - 1 && (
            <motion.div
              className="absolute w-full text-center"
              initial={{ x: "100%", opacity: 0 }}
              animate={getItemStyle(projects.length)}
              transition={{ type: "spring", damping: 30, stiffness: 100 }}
              key="see-all"
            >
              <h2 className="text-7xl font-bold mb-8">See All Projects</h2>
              <a
                href="#projects"
                className="text-xl text-blue-400 hover:text-blue-300 transition-colors"
              >
                Explore more →
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}