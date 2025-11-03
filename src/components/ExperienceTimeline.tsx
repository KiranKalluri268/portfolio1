"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { Experience } from "@/types";

const experiences: Experience[] = [
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

  // Scene lifecycle: No special handlers needed - UnifiedScrollManager handles navigation

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-4 text-white"
      aria-label="Experience timeline section"
    >
      <div className="w-full max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-16">Experience Timeline</h2>
        <ol className="relative border-l-4 border-blue-500 max-w-3xl mx-auto" aria-label="Professional experience timeline">
          {experiences.map((exp, index) => (
            <TimelineItem key={index} experience={exp} index={index} />
          ))}
        </ol>
      </div>
    </section>
  );
};

interface TimelineItemProps {
  experience: Experience;
  index: number;
}

const TimelineItem = ({ experience, index }: TimelineItemProps) => {
  const ref = useRef<HTMLLIElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-300px" });

  return (
    <motion.li
      ref={ref}
      variants={fadeInUpVariant}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="mb-12 ml-6 relative list-none"
      role="listitem"
      aria-label={`Experience ${index + 1}: ${experience.title} at ${experience.company}`}
    >
      <span 
        className="absolute -left-4 top-1.5 w-4 h-4 bg-gray-500 rounded-full shadow-md" 
        aria-hidden="true"
      />
      <article className="bg-gray-550 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold">{experience.title}</h3>
        <p className="text-sm text-gray-400">{experience.company}</p>
        <time className="text-sm text-gray-500 mb-2" dateTime={experience.date}>
          {experience.date}
        </time>
        <p className="text-gray-300">{experience.description}</p>
      </article>
    </motion.li>
  );
};

export default ExperienceTimeline;
