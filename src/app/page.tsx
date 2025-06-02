"use client";

import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import Hero from "../components/hero";
import ProjectsSection from "../components/projects";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import SkillsCarousel from "@/components/SkillsCarousel";
import AudioPermissionPrompt from "@/components/AudioPermissionPrompt";
import ContactSection from "../components/Contact";

export default function Home() {
  // Create refs for each section
  const sectionsRefs = [
    useRef<HTMLDivElement>(null), // Projects container div
    useRef<HTMLElement>(null), // ExperienceTimeline
    useRef<HTMLElement>(null), // SkillsCarousel
    useRef<HTMLElement>(null), // Contact
  ];

  const isScrolling = useRef(false);
  
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling.current) return;

      // Find which section is currently mostly visible (middle of viewport)
      const currentIndex = sectionsRefs.findIndex((ref) => {
        if (!ref.current) return false;
        const rect = ref.current.getBoundingClientRect();
        return rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;
      });

      if (currentIndex === -1) return;

      const currentSection = sectionsRefs[currentIndex].current!;
      const rect = currentSection.getBoundingClientRect();

      // Special case for ProjectsSection horizontal scroll container
      if (currentIndex === 0 && currentSection instanceof HTMLDivElement) {
        // Horizontal scroll logic:
        // If inside the projects container, prevent vertical scroll and scroll horizontally
        const container = currentSection;

        // Check if the Projects section is mostly in view vertically
        const fullyInView = rect.top <= 0 && Math.abs(rect.top) < rect.height;

        if (fullyInView) {
          const atStart = container.scrollLeft === 0;
          const atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth;

          // Allow vertical scroll if at start or end and user tries to scroll beyond
          if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) {
            // Let page scroll normally
            return;
          }

          // Prevent vertical scroll, scroll horizontally instead
          e.preventDefault();
          container.scrollLeft += e.deltaY;
          return;
        }
      }

      // Otherwise, for normal vertical sections:

      // Calculate how far user has scrolled inside current section:
      const scrollableHeight = currentSection.scrollHeight - window.innerHeight;

      // Relative scroll top inside the section (pageYOffset - section's offsetTop)
      const scrollTopRelative = window.pageYOffset - (currentSection.offsetTop || 0);
      const scrollTop = Math.max(0, scrollTopRelative);

      const scrollingDown = e.deltaY > 0;
      const atBottom = scrollTop >= scrollableHeight - 5; // 5px epsilon
      const atTop = scrollTop <= 5;

      if (scrollingDown) {
        if (!atBottom) {
          // Let native scroll happen inside the section
          return;
        }

        // Scroll to next section if exists
        if (currentIndex + 1 < sectionsRefs.length) {
          e.preventDefault();
          isScrolling.current = true;
          sectionsRefs[currentIndex + 1].current?.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => (isScrolling.current = false), 1000);
        }
      } else {
        // scrolling up

        if (!atTop) {
          // Let native scroll happen inside the section
          return;
        }

        // Scroll to previous section if exists
        if (currentIndex - 1 >= 0) {
          e.preventDefault();
          isScrolling.current = true;
          sectionsRefs[currentIndex - 1].current?.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => (isScrolling.current = false), 1000);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="text-white flex flex-col min-h-screen">
      {/* 🔊 Sound permission prompt */}
      <AudioPermissionPrompt />

      {/* Header */}
      <motion.header
        className="w-full text-white pt-15 pb-0 px-20 flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-lg"
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
      <section ref={sectionsRefs[0]} id="projects">
        <ProjectsSection />
      </section>

      {/* Experience Timeline */}
      <section ref={sectionsRefs[1]} id="experience">
        <ExperienceTimeline />
      </section>

      {/* Skills Carousel */}
      <section ref={sectionsRefs[2]} id="skills">
        <SkillsCarousel />
      </section>

      {/* Contact Section */}
      <section ref={sectionsRefs[3]} id="contact">
        <ContactSection />
      </section>

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
