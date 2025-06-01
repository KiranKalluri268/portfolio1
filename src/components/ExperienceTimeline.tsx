"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";

const experiences = [
  {
    title: "Frontend Intern",
    company: "XYZ Tech",
    date: "Jan 2024 - Mar 2024",
    description: "Built responsive dashboards using React, Tailwind, and Chart.js.",
  },
  {
    title: "Bachelor of Computer Science",
    company: "ABC University",
    date: "2021 - 2025",
    description: "Pursuing B.Tech in Computer Science with a focus on full-stack development.",
  },
  {
    title: "Web Dev Trainee",
    company: "CodeCamp",
    date: "Summer 2023",
    description: "Completed a 6-week bootcamp on web technologies and REST APIs.",
  },
];

const fadeInUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 20, stiffness: 100 },
  },
};

const ExperienceTimeline = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  // Use framer-motion's useInView to detect if section is in viewport
  const isInView = useInView(sectionRef, { margin: "-100px" }); 

  useEffect(() => {
    if (!sectionRef.current) return;

    const handleWheel = (e: WheelEvent) => {
  if (!isInView || isScrolling.current) return;

  const sections = Array.from(document.querySelectorAll("section"));
  const currentIndex = sections.findIndex((s) => s === sectionRef.current);
  const scrollingDown = e.deltaY > 0;
  const scrollingUp = !scrollingDown;

  const scrollToSection = (index: number) => {
    const target = sections[index];
    if (target) {
      isScrolling.current = true;
      target.scrollIntoView({ behavior: "smooth" });
      e.preventDefault();
      setTimeout(() => {
        isScrolling.current = false;
      }, 700);
    }
  };

  if (scrollingUp && currentIndex > 0) {
    scrollToSection(currentIndex - 1);
  }

  if (scrollingDown && currentIndex < sections.length - 1) {
    scrollToSection(currentIndex + 1);
  }
};


    window.addEventListener("wheel", handleWheel, { passive: false });

    // Cleanup listener
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [isInView]); // re-run effect when isInView changes

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-20 px-4 text-white"
    >
      <h2 className="text-4xl font-bold text-center mb-16">Experience Timeline</h2>
      <div className="relative border-l-4 border-blue-500 max-w-3xl mx-auto">
        {experiences.map((exp, index) => (
          <TimelineItem key={index} experience={exp} />
        ))}
      </div>
    </section>
  );
};

const TimelineItem = ({ experience }: { experience: typeof experiences[number] }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-300px" });

  return (
    <motion.div
      ref={ref}
      variants={fadeInUpVariant}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="mb-12 ml-6 relative"
    >
      <span className="absolute -left-4 top-1.5 w-4 h-4 bg-gray-500 rounded-full shadow-md" />
      <div className="bg-gray-550 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold">{experience.title}</h3>
        <p className="text-sm text-gray-400">{experience.company}</p>
        <p className="text-sm text-gray-500 mb-2">{experience.date}</p>
        <p className="text-gray-300">{experience.description}</p>
      </div>
    </motion.div>
  );
};

export default ExperienceTimeline;
