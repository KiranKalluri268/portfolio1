"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import type { Experience } from "@/types";

const experiences: Experience[] = [

  {
    title: "Software Engineer Intern",
    company: "Aude.ai",
    date: "January 2026 - Present",
    description:
      "Working on building a AI-powered platform that can help people to learn new things.",
  },
  {
    title: "Forward Deployed Engineer",
    company: "AarogyalinQ Pvt. Ltd.",
    date: "July 2025 - January 2026",
    description:
      "Learned and applied full-stack development using the MERN stack. Built basic web applications with user interfaces in React, backend services in Node/Express, and data storage in MongoDB.",
  },
  {
    title: "AWS Cloud Virtual Internship",
    company: "Eduskills Foundation",
    date: "April 2024 - June 2024",
    description:
      "Completed a 3-month virtual internship focused on AWS Cloud technologies in collaboration with Eduskills and AWS Academy.",
  }
];

const ExperienceTimeline = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo(".experience-content", { y: 40, autoAlpha: 0 }, {
        yPercent: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
      });
      gsap.fromTo(".timeline-item", { y: 40, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: 0.65, stagger: 0.1, ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 65%", once: true },
      });
    }, sectionRef);
    return () => context.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-4 text-white overflow-hidden relative"
      aria-label="Experience timeline section"
      style={{ zIndex: 10 }}
    >
      <div className="experience-content invisible w-full max-w-4xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">Experience Timeline</h2>
        <div
          className="relative max-w-3xl mx-auto"
          aria-label="Professional experience timeline"
        >
          {/* Glowing timeline line */}
          <div className="absolute left-4 top-[26px] bottom-10 w-[2px] bg-gradient-to-b from-blue-500 via-purple-500 to-transparent shadow-[0_0_10px_rgba(59,130,246,0.5)] z-0" />

          <ul className="flex flex-col gap-6 sm:gap-8 relative z-10 w-full">
            {experiences.map((exp, index) => (
              <TimelineItem key={index} experience={exp} index={index} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

interface TimelineItemProps {
  experience: Experience;
  index: number;
}

const TimelineItem = ({ experience, index }: TimelineItemProps) => {
  return (
    <li
      className="timeline-item relative pl-12 sm:pl-16 list-none group"
      role="listitem"
      aria-label={`Experience ${index + 1}: ${experience.title} at ${experience.company}`}
    >
      {/* Glowing Dot */}
      <span
        className="absolute left-[10px] top-[26px] w-[14px] h-[14px] bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] border border-white/40 z-10 
                   group-hover:scale-150 group-hover:bg-blue-400 group-hover:shadow-[0_0_20px_rgba(59,130,246,1)] group-hover:border-white transition-all duration-300"
        aria-hidden="true"
      />
      {/* Card */}
      <article className="bg-transparent backdrop-blur-sm border border-white/5 p-5 sm:p-6 rounded-2xl shadow-xl 
                        hover:-translate-y-1 hover:bg-white/5 hover:border-white/10 hover:shadow-2xl hover:shadow-blue-500/20 
                        transition-all duration-500 ease-out cursor-default relative overflow-hidden">
        {/* Subtle inner gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-wide relative z-10">{experience.title}</h3>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 relative z-10">
          <p className="text-sm sm:text-base font-medium text-blue-400">{experience.company}</p>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-gray-600" />
          <time className="inline-flex items-center px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium rounded-full" dateTime={experience.date}>
            {experience.date}
          </time>
        </div>

        <p className="text-sm sm:text-base text-gray-300 leading-relaxed relative z-10">{experience.description}</p>
      </article>
    </li>
  );
};

export default ExperienceTimeline;
