"use client";

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
}

function SkillRow({ category }: SkillRowProps) {
  return (
    <div className="relative w-full">
      <div
        className="relative"
        aria-label={category.title}
      >
        <div className="flex flex-wrap justify-center gap-0 sm:gap-8 items-center">
          {category.skills.map((skill) => (
            <div
              key={`${category.title}-${skill.name}`}
              className="flex flex-col items-center justify-center text-gray-300
                focus:outline-none focus:ring-2 focus:ring-orange rounded"
              style={{ width: 80, minWidth: 80, height: 100 }}
              title={skill.name}
              role="img"
              aria-label={skill.name}
              tabIndex={0}
            >
              <div className="text-2xl sm:text-4xl select-none">{skill.icon}</div>
              <span className="text-xs mt-1 select-none">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SkillsCarousel() {
  return (
    <section
      id="skills"
      className="min-h-screen flex items-center justify-start px-4 text-white overflow-hidden relative"
      aria-label="Technical skills section"
      style={{ zIndex: 10 }}
    >
      <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[70%] space-y-6 sm:space-y-12 py-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-20">Tech Stack</h1>
        {skillCategories.map((category) => (
          <SkillRow key={category.title} category={category} />
        ))}
      </div>
    </section>
  );
}
