"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useCallback } from "react";
import { useGlobalContext } from "@/context/GlobalContext";

const experiences = [
  {
    title: "AI Intern",
    company: "Edunet Foundation",
    date: "April 2025 - May 2025",
    description:
      "Gained foundational understanding of AI principles including machine learning, neural networks, and real-world applications. Collaborated in a Microsoft-led initiative implemented by Edunet Foundation and AICTE.",
  },
  {
    title: "MERN Full Stack Developer",
    company: "Edunet Foundation",
    date: "Dec 2024 - Jan 2025",
    description:
      "Learned and applied full-stack development using the MERN stack. Built basic web applications with user interfaces in React, backend services in Node/Express, and data storage in MongoDB.",
  },
  {
    title: "AWS Cloud Virtual Internship",
    company: "Eduskills Foundation",
    date: "April 2024 - June 2024",
    description:
      "Completed a 3-month virtual internship focused on AWS Cloud technologies in collaboration with Eduskills and AWS Academy.",
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
  const { setCurrentScene } = useGlobalContext();

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const inView = rect.top <= window.innerHeight && rect.bottom >= 0;

      if (!inView) return;

      if (e.deltaY > 0) {
        // Scroll Down
        setCurrentScene(3);
      } else if (e.deltaY < 0) {
        // Scroll Up
        setCurrentScene(1);
      }
    },
    [setCurrentScene]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const inView = rect.top <= window.innerHeight && rect.bottom >= 0;

      if (!inView) return;

      if (e.key === "ArrowDown") {
        setCurrentScene(3);
      } else if (e.key === "ArrowUp") {
        setCurrentScene(1);
      }
    },
    [setCurrentScene]
  );

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleWheel, handleKeyDown]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-4 text-white"
    >
      <div className="w-full max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-16">Experience Timeline</h2>
        <div className="relative border-l-4 border-blue-500 max-w-3xl mx-auto">
          {experiences.map((exp, index) => (
            <TimelineItem key={index} experience={exp} />
          ))}
        </div>
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
