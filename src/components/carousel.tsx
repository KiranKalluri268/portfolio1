"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

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
  {
    id: 5,
    title: "Project 5",
    description: "A brief description of Project 5.",
    image: "/images/project5.jpg",
    github: "https://github.com/yourusername/project5",
  },
];

export default function Carousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [allowScroll, setAllowScroll] = useState(false);

  // Convert vertical scroll to horizontal
  useEffect(() => {
    const container = containerRef.current;
    const scrollArea = scrollRef.current;
    if (!container || !scrollArea) return;

    const handleWheel = (e: WheelEvent) => {
      if (allowScroll) return; // allow normal scroll after full horizontal scroll
      e.preventDefault();
      scrollArea.scrollBy({ left: e.deltaY, behavior: "smooth" });

      // if reached end of horizontal scroll, unlock vertical scroll
      const atEnd =
        Math.round(scrollArea.scrollLeft + scrollArea.clientWidth) >=
        scrollArea.scrollWidth;

      if (atEnd) {
        setAllowScroll(true);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => container.removeEventListener("wheel", handleWheel);
  }, [allowScroll]);

  return (
    <motion.section
      ref={containerRef}
      className={`h-screen w-full sticky top-0 bg-black text-white z-10 ${
        allowScroll ? "overflow-y-auto" : "overflow-hidden"
      }`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h2 className="text-5xl font-bold text-center pt-16">Projects</h2>

      <div
        ref={scrollRef}
        className="flex h-[calc(100vh-6rem)] mt-6 space-x-10 overflow-x-auto overflow-y-hidden scroll-smooth px-10"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {projects.map((project) => (
          <a
            key={project.id}
            href={project.github || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-[80vw] h-[70vh] snap-center rounded-xl bg-gray-900 text-white p-8 shadow-xl"
            style={{
              backgroundImage: `url(${project.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="relative z-10 p-5 bg-black bg-opacity-50 rounded-xl h-full flex flex-col justify-end">
              <h3 className="text-3xl font-bold">{project.title}</h3>
              <p className="mt-2">{project.description}</p>
            </div>
          </a>
        ))}
      </div>
    </motion.section>
  );
}
