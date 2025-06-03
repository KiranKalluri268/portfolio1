"use client";

import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import Hero from "../components/hero";
import ProjectsSection from "../components/projects";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import SkillsCarousel from "@/components/SkillsCarousel";
import AudioPermissionPrompt from "@/components/AudioPermissionPrompt";
import { useAudio } from "@/components//AudioContextProvider";
import ContactSection from "../components/Contact";

export default function Home() {
  // Section refs
  const projectsRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const sectionsRefs = [projectsRef, experienceRef, skillsRef, contactRef];

  const isScrolling = useRef(false);
  const { audioEnabled } = useAudio();

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling.current) return;

      const currentIndex = sectionsRefs.findIndex((ref) => {
        if (!ref.current) return false;
        const rect = ref.current.getBoundingClientRect();
        return rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;
      });

      if (currentIndex === -1) return;

      const currentSection = sectionsRefs[currentIndex].current!;
      const rect = currentSection.getBoundingClientRect();

      const scrollableHeight = currentSection.scrollHeight - window.innerHeight;
      const scrollTopRelative = window.pageYOffset - (currentSection.offsetTop || 0);
      const scrollTop = Math.max(0, scrollTopRelative);

      const scrollingDown = e.deltaY > 0;
      const atBottom = scrollTop >= scrollableHeight - 5;
      const atTop = scrollTop <= 5;

      if (scrollingDown) {
        if (!atBottom) return;
        if (currentIndex + 1 < sectionsRefs.length) {
          e.preventDefault();
          isScrolling.current = true;
          sectionsRefs[currentIndex + 1].current?.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => (isScrolling.current = false), 600);
        }
      } else {
        if (!atTop) return;
        if (currentIndex - 1 >= 0) {
          e.preventDefault();
          isScrolling.current = true;
          sectionsRefs[currentIndex - 1].current?.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => (isScrolling.current = false), 600);
        }
      }
    };

     const handleKeyDown = (e: KeyboardEvent) => {
  if (isScrolling.current) return;
  if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;

  const currentIndex = sectionsRefs.findIndex((ref) => {
    if (!ref?.current) return false;
    const rect = ref.current.getBoundingClientRect();
    return rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;
  });

  if (currentIndex === -1) return;

  // ✅ Completely block keyboard navigation when in Projects section
  if (currentIndex === 0) {
    e.preventDefault();
    return;
  }

  // Default vertical keyboard scroll behavior
  if (e.key === "ArrowDown" && currentIndex + 1 < sectionsRefs.length) {
    e.preventDefault();
    isScrolling.current = true;
    sectionsRefs[currentIndex + 1]?.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => (isScrolling.current = false), 600);
  }

  if (e.key === "ArrowUp" && currentIndex - 1 >= 0) {
    e.preventDefault();
    isScrolling.current = true;
    sectionsRefs[currentIndex - 1]?.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => (isScrolling.current = false), 600);
  }
};
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
    <AudioPermissionPrompt />
    {audioEnabled && (
      <motion.main
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
  >
    <div className="text-white flex flex-col min-h-screen">
      

      {/* Header */}
      <motion.header
        className="w-full text-white pt-15 pb-0 px-20 flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-lg"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-3xl font-bold">KS</h1>
        <nav aria-label="Main navigation">
          <ul className="flex space-x-6 text-lg">
            <motion.li whileHover={{ scale: 1.1 }}>
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-gray-400"
              >
                About
              </a>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }}>
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  projectsRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="hover:text-gray-400"
              >
                Projects
              </a>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }}>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  contactRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="hover:text-gray-400"
              >
                Contact
              </a>
            </motion.li>
          </ul>
        </nav>
      </motion.header>

      {/* Hero Section */}
        <Hero />

      {/* Projects Section */}
      <section ref={projectsRef} id="projects" aria-label="Projects Section">
        <ProjectsSection />
      </section>

      {/* Experience Timeline */}
      <section ref={experienceRef} id="experience" aria-label="Experience Timeline">
        <ExperienceTimeline />
      </section>

      {/* Skills Carousel */}
      <section ref={skillsRef} id="skills" aria-label="Skills Carousel">
        <SkillsCarousel />
      </section>

      {/* Contact Section */}
      <section ref={contactRef} id="contact" aria-label="Contact Section">
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
    </motion.main>
    )}
    </>
  );
}
