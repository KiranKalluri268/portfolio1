"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const projects = [
  {
    id: 1,
    title: "CertiSafet (Certificate Management System)",
    description: "A web app built with React, Node.js, Express, DynamoDB, and Cloudinary that allows students to securely upload and manage their certificates while enabling institutes to access them directly and generate Excel reports.",
    image: "/images/project1.png",
    github: "https://github.com/KiranKalluri268/CMS_PRO",
    live: "https://cms-pro-kiran-kalluris-projects.vercel.app/",
  },
  {
    id: 2,
    title: "IPL Score Predictor AI",
    description: "A Deep Neural Network model built with Keras to predict the final score of ongoing IPL matches using live inputs such as current runs, wickets, overs, recent performance, and team info. Provides real-time insights to broadcasters, fans, and analysts.",
    image: "/images/project2.png",
    github: "https://github.com/KiranKalluri268/MS_AI_IPL-Score-Predictor",
  },
  {
    id: 3,
    title: "ResumeByAI (₹10 ATS Resume Generator)",
    description: "A Next.js web app integrated with GPT-4 turbo and Razorpay that generates ATS-friendly resumes for users at a low cost, providing an easy way to create professional resumes tailored for applicant tracking systems.",
    image: "/images/project4.webp",
    github: "https://github.com/KiranKalluri268",
  },
  {
    id: 4,
    title: "MindPlan",
    description: "A Flutter-based productivity app that helps users manage short-term and long-term goals, prioritize tasks using the Eisenhower Matrix, and track daily productivity by classifying days as good, bad, or awesome.",
    image: "/images/project4.webp",
    github: "https://github.com/KiranKalluri268",
  },
]
;

const ProjectsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const [prevScroll, setPrevScroll] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const prevInViewRef = useRef(false);
  const autoScrolledRef = useRef(false);

  const getItemStyle = useCallback(
    (index: number) => {
      const distance = index - activeIndex;
      const absDistance = Math.abs(distance);
      return {
        x: `${distance * 100}%`,
        opacity: 1 - absDistance * 0.5,
        scale: 1 - absDistance * 0.1,
        zIndex: projects.length + 2 - absDistance,
      };
    },
    [activeIndex]
  );

  const checkIfInView = useCallback(() => {
    if (!containerRef.current) return false;
    const rect = containerRef.current.getBoundingClientRect();
    const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    const containerHeight = rect.height;
    return visibleHeight / containerHeight > 0.2;
  }, []);

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (isAnimating || !isInView) return;

      // SCROLLING DOWN
      if (event.deltaY > 0) {
        if (activeIndex < projects.length) {
          setIsAnimating(true);
          setActiveIndex((prev) => prev + 1);
          setTimeout(() => setIsAnimating(false), 700);
        } else {
          // Reached end, scroll to next section
          window.scrollTo({ top: window.scrollY + window.innerHeight, behavior: "smooth" });
        }
      }

      // SCROLLING UP
      else if (event.deltaY < 0) {
        if (activeIndex > -1) {
          setIsAnimating(true);
          setActiveIndex((prev) => prev - 1);
          setTimeout(() => setIsAnimating(false), 700);
        } else {
          // Reached top, scroll to previous section
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    },
    [activeIndex, isAnimating, isInView]
  );

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const onScroll = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        const currentScroll = window.scrollY;
        const currentInView = checkIfInView();

        setScrollDirection(currentScroll > prevScroll ? "down" : "up");
        setPrevScroll(currentScroll);
        setIsInView(currentInView);

        // Auto scroll into Projects section if entering it for the first time
        // if (
        //   currentInView &&
        //   !prevInViewRef.current &&
        //   containerRef.current &&
        //   !autoScrolledRef.current
        // ) {
        //   autoScrolledRef.current = true;
        //   containerRef.current.scrollIntoView({
        //     behavior: "smooth",
        //     block: "start",
        //   });
        // }

        if (!currentInView) {
          autoScrolledRef.current = false;
        }

        prevInViewRef.current = currentInView;
      }, 50);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [prevScroll, checkIfInView]);

  useEffect(() => {
    const shouldLock =
      isInView

    document.body.style.overflow = shouldLock ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [activeIndex, scrollDirection, isInView]);

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  return (
    <section
      ref={containerRef}
      id="projects"
      className="relative text-silver h-[110vh] overflow-hidden"
    >
      {/* Animated Title */}
      <motion.h1
  initial={{ y: "100%", opacity: 0 }}
  animate={{
    y: activeIndex >= 0 ? "-300%" : "0%",
    x: activeIndex === projects.length
      ? "-600%" // move completely off screen when at "See All"
      : activeIndex >= 0
        ? "-40vw" // move to left for project view
        : "0%",   // center when no project is active
    opacity: 1,
  }}
  transition={{ duration: 0.7, ease: "easeInOut" }}
  className="text-6xl font-bold tracking-tight text-center absolute top-3/8 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap z-[999]"
>
  Projects
</motion.h1>

      {/* Animated See All */}
      <motion.h1
        initial={{ x: "100%", opacity: 0 }}
        animate={{
          x: activeIndex === projects.length ? "0%" : "100%",
          opacity: activeIndex === projects.length ? 1 : 0,
        }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="text-5xl font-bold tracking-tight text-center absolute top-3/8 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap z-[999]"
      >
        See all projects
      </motion.h1>

      {/* Projects Carousel */}
      <div className="flex items-center justify-center h-full w-full">
        <div className="relative w-full h-full">
          {projects.map((project, index: number) => (
            <motion.div
              key={index}
              className="absolute w-full h-full p-12 flex flex-col justify-center items-center text-center"
              animate={getItemStyle(index)}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            >
              <div className="text-3xl font-semibold mb-4">{project.title}</div>
              <div className="relative w-full h-[300px] max-w-3xl mb-4">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover rounded-xl shadow-lg"
                  quality={90}
                  priority={index === activeIndex}
                />
              </div>
              <p className="text-lg max-w-xl mb-6">{project.description}</p>
              <div className="space-x-4">
                {project.github && (
                  <>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                      aria-label={`Visit ${project.title} GitHub`}
                    >
                      GitHub
                    </a>
                    <a
                      href={project.live ? project.live : project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                      aria-label={`Visit ${project.title} live site`}
                    >
                      Live Demo
                    </a>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;