"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";
import type { Project } from "@/types";

const projects: Project[] = [
  {
    id: 1,
    title: "CertiSafe (A Certificate Management System)",
    description:
      "A web app built with React, Node.js, Express, DynamoDB, and Cloudinary that allows students to securely upload and manage their certificates while enabling institutes to access them directly and generate Excel reports.",
    image: "/images/project1.png",
    github: "https://github.com/KiranKalluri268/CMS_PRO",
    live: "https://cms-pro-kiran-kalluris-projects.vercel.app/",
  },
  {
    id: 2,
    title: "IPL Score Predictor AI",
    description:
      "A Deep Neural Network model built with Keras to predict the final score of ongoing IPL matches using live inputs such as current runs, wickets, overs, recent performance, and team info.",
    image: "/images/project2.png",
    github: "https://github.com/KiranKalluri268/MS_AI_IPL-Score-Predictor",
  },
  {
    id: 3,
    title: "ResumeByAI",
    description:
      "A Next.js web app integrated with GPT-4 turbo and Razorpay that generates ATS-friendly resumes for users at a low cost.",
    image: "/images/KS Logo.webp",
    github: "https://github.com/KiranKalluri268",
  },
  {
    id: 4,
    title: "MindPlan",
    description:
      "A Flutter-based productivity app to manage goals, prioritize tasks using the Eisenhower Matrix, and track daily productivity.",
    image: "/images/project4.webp",
    github: "https://github.com/KiranKalluri268",
  },
];

const ProjectsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const seeAllRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const title = titleRef.current;
    const seeAll = seeAllRef.current;
    if (!container || !title || !seeAll) return;

    gsap.registerPlugin(ScrollTrigger);
    const steps = projects.length + 1;
    const context = gsap.context(() => {
      gsap.set(title, { xPercent: -50, yPercent: -50, autoAlpha: 1 });
      gsap.set(seeAll, { xPercent: -50, yPercent: -50, x: "110vw", autoAlpha: 0 });
      gsap.set(".project-card", { xPercent: 110, autoAlpha: 0, scale: 0.9 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${window.innerHeight * steps}`,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: ({ progress }) => {
            const cardProgress = gsap.utils.mapRange(0.13, 0.87, 0, projects.length - 1, progress);
            gsap.utils.toArray<HTMLElement>(".project-card").forEach((card, index) => {
              const distance = index - cardProgress;
              gsap.set(card, {
                xPercent: distance * 100,
                autoAlpha: Math.max(0, 1 - Math.abs(distance)),
                scale: Math.max(0.9, 1 - Math.abs(distance) * 0.1),
                zIndex: projects.length - Math.round(Math.abs(distance)),
              });
            });
          },
        },
      });

      timeline
        .to(title, { x: () => window.innerWidth < 640 ? "-20vw" : "-40vw", y: () => window.innerWidth < 640 ? "-28vh" : "-24vh", scale: () => window.innerWidth < 640 ? 0.7 : 1, duration: 0.16, ease: "power2.inOut" }, 0.04)
        .to(title, { x: "-110vw", autoAlpha: 0, duration: 0.12, ease: "power2.in" }, 0.82)
        .to(seeAll, { x: 0, autoAlpha: 1, duration: 0.14, ease: "power2.out" }, 0.84);
    }, container);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="projects"
      className="relative text-white h-screen overflow-hidden"
      aria-label="Projects section"
      style={{ zIndex: 10 }}
    >
      {/* Animated Title */}
      <h2
        ref={titleRef}
        className="text-5xl sm:text-6xl font-bold tracking-tight text-center absolute top-3/8 left-1/2 whitespace-nowrap z-[999]"
      >
        Projects
      </h2>

      {/* Animated See All */}
      <h2
        ref={seeAllRef}
        className="text-4xl sm:text-5xl font-bold tracking-tight text-center absolute top-3/8 left-1/2 whitespace-nowrap z-[999]"
      >
        See all projects
      </h2>

      {/* Projects Carousel */}
      <div className="flex items-center justify-center h-full w-full">
        <div className="relative w-full h-full">
          {projects.map((project, index: number) => {
            return (
                <div
                  key={index}
                  className="project-card invisible absolute w-full h-full p-12 flex flex-col justify-center items-center text-center will-change-transform"
                >
                  <h3 className="text-lg sm:text-3xl font-semibold mb-4">{project.title}</h3>
                  <div className="relative w-full sm:h-[300px] h-[200px] max-w-3xl mb-4" role="img" aria-label={`Screenshot of ${project.title}`}>
                    <Image
                      src={project.image}
                      alt={`Screenshot of ${project.title} project`}
                      fill
                      className="object-cover rounded-xl shadow-lg"
                      quality={90}
                      priority={index === 0}
                    />
                  </div>
                  <p className="text-base sm:text-lg max-w-xl mb-6">{project.description}</p>
                  <nav className="space-x-4" aria-label={`Links for ${project.title}`}>
                    {project.github && (
                      <>
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1"
                          aria-label={`Visit ${project.title} on GitHub (opens in new tab)`}
                        >
                          GitHub
                        </a>
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1"
                            aria-label={`Visit ${project.title} live demo (opens in new tab)`}
                          >
                            Live Demo
                          </a>
                        )}
                      </>
                    )}
                  </nav>
                </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
