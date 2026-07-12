"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
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
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const width = container.scrollWidth / 5;
    const start = direction === 1 ? -width : -width * 2;
    const end = direction === 1 ? 0 : -width;
    gsap.set(container, { x: start });
    const tween = gsap.to(container, {
      x: end,
      duration: width / speed,
      ease: "none",
      repeat: -1,
      paused: false,
    });
    const pause = () => tween.pause();
    const resume = () => tween.resume();
    container.addEventListener("mouseenter", pause);
    container.addEventListener("mouseleave", resume);
    return () => {
      container.removeEventListener("mouseenter", pause);
      container.removeEventListener("mouseleave", resume);
      tween.kill();
    };
  }, [direction, speed]);

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
      >
        <div
          className="inline-flex gap-0 sm:gap-8 items-center whitespace-nowrap"
          ref={containerRef}
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const tween = gsap.fromTo(contentRef.current, { y: 40, autoAlpha: 0 }, {
      yPercent: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
    });
    return () => { tween.kill(); };
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-start px-4 text-white overflow-hidden relative"
      aria-label="Technical skills section"
      style={{ zIndex: 10 }}
    >
      <div ref={contentRef} className="invisible w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[70%] space-y-6 sm:space-y-12 py-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-20">Tech Stack</h1>
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
      </div>
    </section>
  );
}
