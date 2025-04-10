"use client";
import { useEffect, useRef } from "react";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const scrollContent = scrollRef.current;
  
    if (!container || !scrollContent) return;
  
    const handleResizeAndScroll = () => {
      const totalScrollWidth = scrollContent.scrollWidth;
      const viewportWidth = window.innerWidth;
  
      // Set the container height dynamically
      const requiredHeight =
        (totalScrollWidth - viewportWidth) + window.innerHeight;
      container.style.height = `${requiredHeight}px`;
  
      const scrollTop = window.scrollY;
      const sectionTop = container.offsetTop;
      const sectionBottom = sectionTop + container.offsetHeight;
  
      const inSection = scrollTop >= sectionTop && scrollTop <= sectionBottom;
  
      if (inSection) {
        const translateX = Math.min(
          scrollTop - sectionTop,
          totalScrollWidth - viewportWidth
        );
        scrollContent.style.transform = `translateX(-${translateX}px)`;
      }
    };
  
    handleResizeAndScroll();
    window.addEventListener("scroll", handleResizeAndScroll);
    window.addEventListener("resize", handleResizeAndScroll);
  
    return () => {
      window.removeEventListener("scroll", handleResizeAndScroll);
      window.removeEventListener("resize", handleResizeAndScroll);
    };
  }, []);
  

  return (
    <section
      ref={containerRef}
      className="relative h-[500vh] bg-black text-white"
    >
      <h2 className="text-5xl font-bold text-center pt-20 pb-12 sticky top-0 bg-black z-10">
        Projects
      </h2>

      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          ref={scrollRef}
          className="flex transition-transform duration-200 ease-out"
          style={{ willChange: "transform" }}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="min-w-full h-screen flex-shrink-0 p-8 snap-center"
            >
              <div
                className="w-full h-full bg-cover bg-center rounded-xl shadow-lg p-6 flex flex-col justify-end"
                style={{ backgroundImage: `url(${project.image})` }}
              >
                <div className="bg-black bg-opacity-60 p-4 rounded-xl">
                  <h3 className="text-3xl font-semibold">{project.title}</h3>
                  <p className="mt-2">{project.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
