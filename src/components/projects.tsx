"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useProjectView } from "@/context/ProjectViewContext";
import { useGlobalContext } from "@/context/GlobalContext";
import { useUnifiedScroll } from "@/context/UnifiedScrollManager";
import type { Project, AnimationDirection } from "@/types";

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
    image: "/images/KS Logo.png",
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
  const { currentScene, setCurrentScene, prevScene, setPrevScene } = useGlobalContext();
  const [activeIndex, setActiveIndex] = useState(() => {
  return prevScene === 2 ? projects.length : -1;
});
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const { setCurrentView } = useProjectView();
  const [prevIndex, setPrevIndex] = useState(() => {
  return prevScene === 2 ? projects.length : -1;
});
  const checkIfInView = useCallback(() => {
    if (!containerRef.current) return false;
    const rect = containerRef.current.getBoundingClientRect();
    const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    const containerHeight = rect.height;
    return visibleHeight / containerHeight > 0.2;
  }, []);

  // Import UnifiedScrollManager for scene navigation
  const { navigateToScene, setScrollEnabled, registerNavigationGuard, unregisterNavigationGuard, registerCarouselAdvance, unregisterCarouselAdvance } = useUnifiedScroll();

  // Handle internal carousel navigation (projects within scene)
  const navigateCarousel = useCallback(
    (direction: AnimationDirection) => {
      if (isAnimating) return;

      if (direction === "down" && activeIndex < projects.length) {
        setIsAnimating(true);
        setPrevIndex(activeIndex);
        setActiveIndex((prev) => prev + 1);
        setTimeout(() => setIsAnimating(false), 700);
      } else if (direction === "up" && activeIndex > -1) {
        setIsAnimating(true);
        setPrevIndex(activeIndex);
        setActiveIndex((prev) => prev - 1);
        setTimeout(() => setIsAnimating(false), 700);
      }
    },
    [activeIndex, isAnimating, projects.length]
  );

  // Accumulated delta for projects carousel (similar to UnifiedScrollManager)
  const projectsDeltaRef = useRef(0);
  const projectsLastScrollTimeRef = useRef(Date.now());
  const PROJECTS_SCROLL_THRESHOLD = 80;

  // Handle wheel events for internal carousel (when not at boundaries)
  const handleProjectsWheel = useCallback(
    (event: WheelEvent) => {
      if (currentScene !== 1 || isAnimating || !isInView) return;

      const isScrollingDown = event.deltaY > 0;
      const isScrollingUp = event.deltaY < 0;

      // Check if at boundaries
      const atTopBoundary = activeIndex === -1 && isScrollingUp;
      const atBottomBoundary = activeIndex === projects.length && isScrollingDown;

      // If at boundary, check if guard allows navigation
      if (atTopBoundary || atBottomBoundary) {
        // Check guard before letting UnifiedScrollManager handle it
        const guard = (direction: "forward" | "backward") => {
          if (direction === "forward") {
            return activeIndex >= projects.length;
          } else {
            return activeIndex <= -1;
          }
        };

        const canNavigate = atTopBoundary ? guard("backward") : guard("forward");
        
        if (canNavigate) {
          // Guard allows navigation - let UnifiedScrollManager handle scene transition
          setScrollEnabled(true);
          return; // Let event pass through to UnifiedScrollManager
        } else {
          // Guard blocks navigation - prevent scene transition
          event.preventDefault();
          event.stopPropagation();
          return;
        }
      }

      // Not at boundary - handle carousel navigation internally
      event.preventDefault();
      event.stopPropagation();
      setScrollEnabled(false); // Temporarily disable UnifiedScrollManager

      const now = Date.now();
      const timeDelta = now - projectsLastScrollTimeRef.current;

      // Reset if too much time passed
      if (timeDelta > 150) {
        projectsDeltaRef.current = 0;
      }

      projectsDeltaRef.current += event.deltaY;
      projectsLastScrollTimeRef.current = now;

      // Check threshold
      if (Math.abs(projectsDeltaRef.current) >= PROJECTS_SCROLL_THRESHOLD) {
        const direction: AnimationDirection = projectsDeltaRef.current > 0 ? "down" : "up";
        navigateCarousel(direction);
        projectsDeltaRef.current = 0;
      }

      // Re-enable UnifiedScrollManager after a delay
      setTimeout(() => {
        setScrollEnabled(true);
        projectsDeltaRef.current = 0; // Reset accumulator
      }, 200);
    },
    [currentScene, isAnimating, isInView, activeIndex, projects.length, navigateCarousel, setScrollEnabled]
  );

  // Register wheel handler for projects carousel
  useEffect(() => {
    if (currentScene === 1) {
      // Use capture phase to run before UnifiedScrollManager
      window.addEventListener("wheel", handleProjectsWheel, { passive: false, capture: true });
      return () => {
        window.removeEventListener("wheel", handleProjectsWheel, { capture: true });
        setScrollEnabled(true); // Re-enable on unmount
        projectsDeltaRef.current = 0; // Reset
      };
    } else {
      // Reset when leaving scene
      projectsDeltaRef.current = 0;
      setScrollEnabled(true);
    }
  }, [currentScene, handleProjectsWheel, setScrollEnabled]);

  useEffect(() => {
    setCurrentView(
      activeIndex === -1 ? "title" : activeIndex === projects.length ? "seeAll" : "project"
    );
  }, [activeIndex, setCurrentView]);

  // Scene lifecycle: Handle scene enter - initialize based on entry direction
  useEffect(() => {
    if (currentScene === 1 && prevScene !== 1) {
      // Entering Scene 1 from another scene
      let initialIndex: number;
      if (prevScene === 2) {
        // Entering from Scene 2 (backward) - start at "See All" (last state)
        initialIndex = projects.length;
      } else {
        // Entering from Scene 0 (forward) - start at title (-1)
        initialIndex = -1;
      }
      setActiveIndex(initialIndex);
      // Immediately sync ref so guard checks work correctly
      activeIndexRef.current = initialIndex;
    }
  }, [currentScene, prevScene, projects.length]);

  // Handle boundary conditions - route to UnifiedScrollManager
  useEffect(() => {
    // When at boundary and user wants to navigate to another scene
    // This is handled by UnifiedScrollManager, but we need to track carousel state
    if (currentScene === 1 && activeIndex === -1 && prevScene === 0) {
      // User scrolled up from scene 0 to scene 1, already handled
    }
    if (currentScene === 1 && activeIndex === projects.length && prevScene === 2) {
      // User scrolled down from scene 2 to scene 1, already handled
    }
  }, [currentScene, activeIndex, prevScene, projects.length]);

  // Internal carousel keyboard shortcuts (for left/right arrows within projects)
  useEffect(() => {
    const handleInternalKeys = (event: KeyboardEvent) => {
      if (currentScene !== 1 || isAnimating) return;
      
      if (event.key === "ArrowRight") {
        navigateCarousel("down");
      } else if (event.key === "ArrowLeft") {
        navigateCarousel("up");
      }
    };

    window.addEventListener("keydown", handleInternalKeys);
    return () => window.removeEventListener("keydown", handleInternalKeys);
  }, [currentScene, isAnimating, navigateCarousel]);

  // Track if section is in view for display purposes
  useEffect(() => {
    setIsInView(checkIfInView());
    const handleScroll = () => setIsInView(checkIfInView());
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [checkIfInView]);

  // Use refs to store current state so guard/advance functions always read latest values
  const activeIndexRef = useRef(activeIndex);
  const isAnimatingRef = useRef(isAnimating);
  
  // Sync refs immediately whenever state changes (use layout effect to ensure it happens before other effects)
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);
  
  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  // Register navigation guard: Block navigation until carousel is at appropriate boundary
  useEffect(() => {
    const PROJECTS_SCENE = 1; // Projects is scene 1
    
    // Bidirectional guard function:
    // Forward: Allow navigation to Scene 2 only when at "See All" (activeIndex >= projects.length)
    // Backward: Allow navigation to Scene 0 only when at title (activeIndex <= -1)
    // Uses ref to always read the latest activeIndex value
    const navigationGuard = (direction: "forward" | "backward") => {
      if (direction === "forward") {
        // Forward navigation: must be at "See All" (all projects viewed)
        return activeIndexRef.current >= projects.length;
      } else {
        // Backward navigation: must be at title (first state)
        return activeIndexRef.current <= -1;
      }
    };

    // Carousel advance function: Automatically advances carousel when navigation is blocked
    const carouselAdvance = async (direction: "forward" | "backward"): Promise<void> => {
      return new Promise((resolve) => {
        // Wait for current animation to finish if one is in progress
        const waitForAnimation = () => {
          if (isAnimatingRef.current) {
            setTimeout(waitForAnimation, 50);
            return;
          }

          // Determine target index
          let targetIndex: number;
          if (direction === "forward") {
            // Advance forward: -1 → 0 → 1 → 2 → 3 → 4
            targetIndex = Math.min(activeIndexRef.current + 1, projects.length);
          } else {
            // Advance backward: 4 → 3 → 2 → 1 → 0 → -1
            targetIndex = Math.max(activeIndexRef.current - 1, -1);
          }

          // If already at boundary, resolve immediately
          if (targetIndex === activeIndexRef.current) {
            resolve();
            return;
          }

          // Advance carousel
          setIsAnimating(true);
          setPrevIndex(activeIndexRef.current);
          setActiveIndex(targetIndex);

          // Wait for animation to complete
          setTimeout(() => {
            setIsAnimating(false);
            resolve();
          }, 700); // Match carousel animation duration
        };

        waitForAnimation();
      });
    };

    // Register guard and advance callback immediately when component mounts or scene becomes active
    // Note: This runs on every render when currentScene === 1, but registration is idempotent
    registerNavigationGuard(PROJECTS_SCENE, navigationGuard);
    registerCarouselAdvance(PROJECTS_SCENE, carouselAdvance);

    // Cleanup: Unregister when component unmounts or scene becomes inactive
    return () => {
      unregisterNavigationGuard(PROJECTS_SCENE);
      unregisterCarouselAdvance(PROJECTS_SCENE);
    };
  }, [projects.length, registerNavigationGuard, unregisterNavigationGuard, registerCarouselAdvance, unregisterCarouselAdvance, currentScene]);

  return (
    <section
      ref={containerRef}
      id="projects"
      className="relative text-white h-[110vh] overflow-hidden"
      aria-label="Projects section"
    >
      {/* Animated Title */}
      <motion.h2
        initial={{ y: "600%", opacity: 0 }}
        animate={{
          y: activeIndex >= 0 ? "-300%" : "0%",
          x: activeIndex === projects.length ? "-600%" : activeIndex >= 0 ? "-40vw" : "0%",
          opacity: 1,
        }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="text-6xl font-bold tracking-tight text-center absolute top-3/8 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap z-[999]"
        onAnimationComplete={() => {
          if(activeIndex===-1){
    setIsAnimating(false);
        }}}
      >
        Projects
      </motion.h2>

      {/* Animated See All */}
      <AnimatePresence mode="wait">
  {activeIndex === projects.length && (
    <motion.h2
      initial={
  prevScene === 0
    ? { x: "500%" }                          // From Hero → enter from right
  : prevScene === 2 && prevIndex === 3
    ? { x: "500%" }                          // From Experience → back to See All → enter from right
  : prevScene === 2
    ? { y: "-500%" }                         // From Experience → fresh scroll to See All → enter from top
  : prevIndex === projects.length - 1
    ? { x: "500%" }                          // Forward scroll from last project → enter from right
  : { opacity: 0 }                           // Fallback
}
      animate={
        // Land in center
        { x: "0%", y: "0%" }
      }
      exit={
  (prevScene === 2 && activeIndex === projects.length)
    ? { x: "500%" }         // Coming *to* See All from Experience → slide right
  : (prevScene === 2)
    ? { y: "-500%" }        // Going *to* Experience → move up
  : (prevScene === 0 || activeIndex === projects.length - 1)
    ? { x: "500%" }         // To Hero or back to last project → move right
  : { opacity: 0 }
}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="text-5xl font-bold tracking-tight text-center absolute top-3/8 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap z-[999]"
      onAnimationComplete={() => {
        if(activeIndex===projects.length){
    setIsAnimating(false);
        }}}
    >
      See all projects
    </motion.h2>
  )}
</AnimatePresence>

      {/* Projects Carousel */}
      <div className="flex items-center justify-center h-full w-full">
        <div className="relative w-full h-full">
          {projects.map((project, index: number) => {
            const distance = index - activeIndex;
            const absDistance = Math.abs(distance);
            const isVisible = absDistance <= 1; // Only render current + adjacent

            return (
              isVisible && (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    x: `${distance * 100}%`,
                    scale: 1 - absDistance * 0.1,
                  }}
                  animate={{
                    x: `${distance * 100}%`,
                    opacity: 1 - absDistance * 0.5,
                    scale: 1 - absDistance * 0.1,
                    zIndex: projects.length + 2 - absDistance,
                  }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="absolute w-full h-full p-12 flex flex-col justify-center items-center text-center"
                  onAnimationComplete={() => {
          if(activeIndex>-1 && activeIndex<projects.length){
    setIsAnimating(false);
        }}}
                >
                  <h3 className="text-3xl font-semibold mb-4">{project.title}</h3>
                  <div className="relative w-full h-[300px] max-w-3xl mb-4" role="img" aria-label={`Screenshot of ${project.title}`}>
                    <Image
                      src={project.image}
                      alt={`Screenshot of ${project.title} project`}
                      fill
                      className="object-cover rounded-xl shadow-lg"
                      quality={90}
                      priority={index === activeIndex}
                    />
                  </div>
                  <p className="text-lg max-w-xl mb-6">{project.description}</p>
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
                </motion.div>
              )
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
