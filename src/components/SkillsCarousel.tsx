"use client";

import { motion } from "framer-motion";
import {
  FaReact, FaHtml5, FaCss3Alt, FaPython, FaJava,
  FaDatabase, FaGitAlt, FaJs, FaCode, FaLaptopCode,
} from "react-icons/fa";
import {
  SiTailwindcss, SiMongodb, SiMysql, SiTypescript, SiNextdotjs, SiNodedotjs, SiExpress,
} from "react-icons/si";
import { TbBrandVscode } from "react-icons/tb";
import { DiPostgresql } from "react-icons/di";
import { BsFiletypeSql } from "react-icons/bs";

const skillCategories = [
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

const BASE_DURATION = 20;

export default function SkillsCarousel() {
  return (
    <section
  id="skills"
  className="min-h-screen flex items-center justify-start px-4 text-white"
>
      <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[70%] space-y-12 overflow-hidden py-20">
        <h1 className="text-4xl font-bold text-center mb-20">Tech Stack</h1>

        {skillCategories.map((category, idx) => {
  const duration = BASE_DURATION - idx * 3;
  const repeatedSkills = Array(4).fill(category.skills).flat();

  return (
    <div
      key={category.title}
      className="relative w-full"
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
      }}
    >
      <div
        className="relative overflow-hidden"
        aria-label={category.title}
      >
        <motion.div
          className="inline-flex gap-8 items-center whitespace-nowrap"
          animate={{ x: ["0%", "-25%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration,
          }}
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
              <div className="text-3xl md:text-4xl select-none">
                {skill.icon}
              </div>
              <span className="text-xs mt-1 select-none">{skill.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
})}
      </div>
    </section>
  );
}
