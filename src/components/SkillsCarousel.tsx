"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { useGlobalContext } from "@/context/GlobalContext";
import type { SkillCategory } from "@/types";
import {
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaPython,
  FaJava,
  FaDatabase,
  FaGitAlt,
  FaJs,
  FaCode,
  FaLaptopCode,
} from "react-icons/fa";
import {
  SiTailwindcss,
  SiMongodb,
  SiMysql,
  SiTypescript,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
} from "react-icons/si";
import { TbBrandVscode } from "react-icons/tb";
import { DiPostgresql } from "react-icons/di";
import { BsFiletypeSql } from "react-icons/bs";

const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    skills: [
      { name: "React", icon: <FaReact /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss /> },
      { name: "HTML5", icon: <FaHtml5 /> },
      { name: "CSS3", icon: <FaCss3Alt /> },
      { name: "JavaScript", icon: <FaJs /> },
      { name: "TypeScript", icon: <SiTypescript /> },
      { name: "Next.js", icon: <SiNextdotjs /> },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", icon: <SiNodedotjs /> },
      { name: "Express", icon: <SiExpress /> },
      { name: "Git", icon: <FaGitAlt /> },
      { name: "VS Code", icon: <TbBrandVscode /> },
    ],
  },
  {
    title: "Database",
    skills: [
      { name: "MongoDB", icon: <SiMongodb /> },
      { name: "MySQL", icon: <SiMysql /> },
      { name: "PostgreSQL", icon: <DiPostgresql /> },
      { name: "SQL", icon: <BsFiletypeSql /> },
      { name: "General DB", icon: <FaDatabase /> },
    ],
  },
  {
    title: "Programming Languages",
    skills: [
      { name: "Python", icon: <FaPython /> },
      { name: "Java", icon: <FaJava /> },
      { name: "C/C++", icon: <FaCode /> },
      { name: "General Dev", icon: <FaLaptopCode /> },
    ],
  },
];

interface SkillRowProps {
  category: SkillCategory;
  speed: number;
  direction: 1 | -1;
}

function SkillRow({ category, speed, direction }: SkillRowProps) {
  const repeatedSkills = Array(5).fill(category.skills).flat();
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const width = container.scrollWidth / 5;
      x.set(direction === 1 ? -width : -width * 3);
    }
  }, [x, direction]);

  useAnimationFrame((_, delta) => {
    if (!isHovered && containerRef.current) {
      const moveBy = (direction * speed * delta) / 1000;
      const currentX = x.get();
      const fullWidth = containerRef.current.scrollWidth / 5;

      if (direction === 1 && currentX >= 0) {
        x.set(-fullWidth);
      } else if (direction === -1 && currentX <= -2 * fullWidth) {
        x.set(-fullWidth);
      } else {
        x.set(currentX + moveBy);
      }
    }
  });

  return (
    <div
      className="relative w-full"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
      }}
    >
      <div
        className="relative overflow-hidden"
        aria-label={category.title}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="inline-flex gap-8 items-center whitespace-nowrap"
          ref={containerRef}
          style={{ x }}
        >
          {repeatedSkills.map((skill, i) => (
            <div
              key={`${category.title}-${skill.name}-${i}`}
              className="flex flex-col items-center justify-center text-gray-300
                hover:text-orange hover:scale-120 transition-transform duration-300
                focus:outline-none focus:ring-2 focus:ring-orange rounded"
              style={{ width: 80, minWidth: 80, height: 100 }}
              title={skill.name}
              role="img"
              aria-label={skill.name}
              tabIndex={0}
            >
              <div className="text-3xl md:text-4xl select-none">{skill.icon}</div>
              <span className="text-xs mt-1 select-none">{skill.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default function SkillsCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { currentScene, prevScene } = useGlobalContext();
  
  // Determine navigation direction
  // Forward: prevScene < currentScene (moving down, e.g., 2→3 or 0→3)
  // Backward: prevScene > currentScene (moving up, e.g., 4→3 or 2→3 backward)
  const isForward = prevScene < currentScene;

  // Z-index: active scene on top, exiting scene below
  const zIndex = currentScene === 3 ? 10 : 1;

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-start px-4 text-white overflow-hidden relative"
      aria-label="Technical skills section"
      style={{ zIndex }}
    >
      <motion.div
        className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[70%] space-y-12 py-20"
        initial={{
          // Forward navigation (top→bottom): entry from bottom
          // Backward navigation (bottom→top): entry from top
          y: isForward ? "100%" : "-100%",
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        exit={{
          // Forward navigation: exit to top (moving up in viewport)
          // Backward navigation: exit to bottom (moving down in viewport)
          y: isForward ? "-100%" : "100%",
          opacity: 0,
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
        <h1 className="text-4xl font-bold text-center mb-20">Tech Stack</h1>
        {skillCategories.map((category, idx) => {
          const direction = idx % 2 === 0 ? 1 : -1;
          const speed = 40 - idx * 5;
          return (
            <SkillRow
              key={category.title}
              category={category}
              speed={speed}
              direction={direction}
            />
          );
        })}
      </motion.div>
    </section>
  );
}
