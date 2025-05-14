"use client";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import Hero from "../components/hero";
import ProjectsSection from "../components/projects";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import SkillsCarousel from "@/components/SkillsCarousel";

export default function Home() {
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = projectsRef.current;
    if (!container) return;
  
    const handleWheel = (e: WheelEvent) => {
      const rect = container.getBoundingClientRect();
      const fullyInView = rect.top <= 0 && Math.abs(rect.top) < rect.height;
  
      if (fullyInView) {
        const atStart = container.scrollLeft === 0;
        const atEnd =
          container.scrollLeft + container.clientWidth >= container.scrollWidth;
  
        // Allow vertical scroll if already at start or end
        if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) {
          return; // Let page scroll
        }
  
        // Prevent default vertical scroll, scroll horizontally
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };
  
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);  

  return (
    <div className=" text-white flex flex-col min-h-screen">
      {/* Header */}
      <motion.header
        className="w-full text-white pt-6 pb-0 px-6 flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-lg"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-3xl font-bold">KS</h1>
        <nav>
          <ul className="flex space-x-6 text-lg">
            <motion.li whileHover={{ scale: 1.1 }}>
              <a href="#about" className="hover:text-gray-400">
                About
              </a>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }}>
              <a href="#projects" className="hover:text-gray-400">
                Projects
              </a>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }}>
              <a href="#contact" className="hover:text-gray-400">
                Contact
              </a>
            </motion.li>
          </ul>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <Hero />

      

      {/* Projects Section */}
<div id="projects">
  <ProjectsSection />
</div>


      {/* Scroll buffer after horizontal scroll */}
      <div style={{ height: "10vh" }}></div>
      
      <ExperienceTimeline />
      <SkillsCarousel />
      {/* Contact Section */}
      <motion.section
        id="contact"
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold">Contact Me</h2>
        <p className="text-gray-400 mt-4">Feel free to reach out!</p>
        <motion.a
          href="mailto:kirankalluri888@gmail.com"
          className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          whileHover={{ scale: 1.1 }}
        >
          Say Hello 👋
        </motion.a>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="w-full bg-black text-gray-500 text-sm py-4 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        © {new Date().getFullYear()} Kiran. All Rights Reserved.
      </motion.footer>
    </div>
  );
}
