"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import type { VirtualScrollData } from "lenis";
import type { Project } from "@/types";
import { useScrollActions } from "@/context/SmoothScrollContext";

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

const PANEL_COUNT = projects.length + 2;
const LAST_PANEL_INDEX = PANEL_COUNT - 1;
const SNAP_THRESHOLD = 0.4;

export default function ProjectsSection() {
  const { lenis } = useScrollActions();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const title = titleRef.current;
    if (!section || !track || !title) return;

    gsap.registerPlugin(ScrollTrigger);
    let cleanupSnap: (() => void) | undefined;

    const context = gsap.context(() => {
      gsap.set(track, { x: 0, force3D: true, willChange: "transform" });
      gsap.set(title, {
        xPercent: -50,
        yPercent: -50,
        autoAlpha: 1,
        willChange: "transform,opacity",
      });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: "projects-horizontal-pin",
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * LAST_PANEL_INDEX}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(track, {
          x: () => -(track.scrollWidth - section.clientWidth),
          duration: 1,
        }, 0)
        .to(title, {
          x: () => window.innerWidth < 640 ? "-20vw" : "-40vw",
          y: () => window.innerWidth < 640 ? "-28vh" : "-24vh",
          duration: 0.14,
        }, 0.02)
        .to(title, {
          x: "-110vw",
          autoAlpha: 0,
          duration: 0.12,
          ease: "sine.inOut",
        }, 0.84);

      if (!lenis || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const trigger = timeline.scrollTrigger;
      if (!trigger) return;

      const anchors = Array.from(
        { length: PANEL_COUNT },
        (_, index) => index / LAST_PANEL_INDEX,
      );
      const nearestAnchorIndex = (progress: number) => Math.round(
        gsap.utils.clamp(0, 1, progress) * LAST_PANEL_INDEX,
      );

      let settleTimer: ReturnType<typeof setTimeout> | undefined;
      let gestureStartIndex: number | null = null;
      let gestureDelta = 0;
      let touchStartY = 0;
      let isTouchGesture = false;

      const resetGesture = () => {
        gestureStartIndex = null;
        gestureDelta = 0;
        isTouchGesture = false;
      };

      const settle = () => {
        settleTimer = undefined;
        if (!trigger.isActive || gestureStartIndex === null || gestureDelta === 0) {
          resetGesture();
          return;
        }

        const currentIndex = gestureStartIndex;
        if (
          (gestureDelta < 0 && currentIndex === 0) ||
          (gestureDelta > 0 && currentIndex === LAST_PANEL_INDEX)
        ) {
          resetGesture();
          return;
        }

        const range = trigger.end - trigger.start;
        const intendedScroll = isTouchGesture ? window.scrollY : lenis.targetScroll;
        const intendedProgress = gsap.utils.clamp(
          0,
          1,
          (intendedScroll - trigger.start) / range,
        );
        let destinationIndex = currentIndex;

        if (gestureDelta > 0) {
          const nextIndex = currentIndex + 1;
          const threshold = gsap.utils.interpolate(
            anchors[currentIndex],
            anchors[nextIndex],
            SNAP_THRESHOLD,
          );
          if (intendedProgress >= threshold) destinationIndex = nextIndex;
        } else {
          const previousIndex = currentIndex - 1;
          const threshold = gsap.utils.interpolate(
            anchors[currentIndex],
            anchors[previousIndex],
            SNAP_THRESHOLD,
          );
          if (intendedProgress <= threshold) destinationIndex = previousIndex;
        }

        const destination = trigger.start + anchors[destinationIndex] * range;
        const dampingEnd = 1 - 9 * Math.exp(-8);
        lenis.scrollTo(destination, {
          duration: 0.45,
          easing: (progress) =>
            (1 - (1 + 8 * progress) * Math.exp(-8 * progress)) / dampingEnd,
        });
        resetGesture();
      };

      const handleVirtualScroll = ({ deltaX, deltaY, event }: VirtualScrollData) => {
        if (!trigger.isActive || event.type === "touchmove") return;
        const delta = Math.abs(deltaY) >= Math.abs(deltaX) ? deltaY : deltaX;
        if (delta === 0) return;
        if (gestureStartIndex === null) {
          gestureStartIndex = nearestAnchorIndex(trigger.progress);
        }
        gestureDelta += delta;
        if (settleTimer) clearTimeout(settleTimer);
        settleTimer = setTimeout(settle, 100);
      };

      const handleTouchStart = (event: TouchEvent) => {
        if (!trigger.isActive || event.touches.length !== 1) return;
        isTouchGesture = true;
        touchStartY = event.touches[0].clientY;
        gestureStartIndex = nearestAnchorIndex(trigger.progress);
        gestureDelta = 0;
      };

      const handleTouchMove = (event: TouchEvent) => {
        if (!isTouchGesture || event.touches.length !== 1) return;
        gestureDelta = touchStartY - event.touches[0].clientY;
      };

      const handleTouchEnd = () => {
        if (!isTouchGesture) return;
        settle();
      };

      lenis.on("virtual-scroll", handleVirtualScroll);
      section.addEventListener("touchstart", handleTouchStart, { passive: true });
      section.addEventListener("touchmove", handleTouchMove, { passive: true });
      section.addEventListener("touchend", handleTouchEnd, { passive: true });
      cleanupSnap = () => {
        if (settleTimer) clearTimeout(settleTimer);
        lenis.off("virtual-scroll", handleVirtualScroll);
        section.removeEventListener("touchstart", handleTouchStart);
        section.removeEventListener("touchmove", handleTouchMove);
        section.removeEventListener("touchend", handleTouchEnd);
      };
    }, section);

    return () => {
      cleanupSnap?.();
      context.revert();
    };
  }, [lenis]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative h-[100dvh] min-h-[100svh] overflow-hidden text-white"
      aria-label="Projects section"
      style={{ zIndex: 10 }}
    >
      <h2
        ref={titleRef}
        className="absolute top-3/8 left-1/2 z-20 whitespace-nowrap text-center text-5xl font-bold tracking-tight sm:text-6xl"
      >
        Projects
      </h2>

      <div ref={trackRef} className="flex h-full w-max">
        <div className="h-[100dvh] min-h-[100svh] w-screen shrink-0" aria-hidden="true" />

        {projects.map((project) => (
          <article
            key={project.id}
            className="flex h-[100dvh] min-h-[100svh] w-screen shrink-0 flex-col items-center justify-center px-4 py-16 text-center sm:px-8 lg:p-12"
          >
            <h3 className="mb-[clamp(0.5rem,2dvh,1rem)] max-w-3xl text-base font-semibold sm:text-2xl lg:text-3xl">{project.title}</h3>
            <div
              className="relative mb-[clamp(0.5rem,2dvh,1rem)] h-[clamp(7.5rem,30dvh,18.75rem)] w-full max-w-3xl"
              role="img"
              aria-label={`Screenshot of ${project.title}`}
            >
              <Image
                src={project.image}
                alt={`Screenshot of ${project.title} project`}
                fill
                className="rounded-xl object-cover shadow-lg"
                quality={90}
                sizes="(max-width: 640px) calc(100vw - 2rem), 768px"
                loading={project.id === 1 ? "eager" : "lazy"}
              />
            </div>
            <p className="mb-[clamp(0.75rem,2.5dvh,1.5rem)] max-w-xl text-sm leading-relaxed sm:text-base lg:text-lg">{project.description}</p>
            <nav className="space-x-4" aria-label={`Links for ${project.title}`}>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded px-2 py-1 underline"
                  aria-label={`Visit ${project.title} on GitHub (opens in new tab)`}
                >
                  GitHub
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded px-2 py-1 underline"
                  aria-label={`Visit ${project.title} live demo (opens in new tab)`}
                >
                  Live Demo
                </a>
              )}
            </nav>
          </article>
        ))}

        <div className="flex h-[100dvh] min-h-[100svh] w-screen shrink-0 items-center justify-center px-4">
          <h2 className="whitespace-nowrap text-center text-4xl font-bold tracking-tight sm:text-5xl">
            <Link href="/projects" className="rounded underline underline-offset-8">
              See all projects
            </Link>
          </h2>
        </div>
      </div>
    </section>
  );
}
