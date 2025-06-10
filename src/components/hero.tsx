"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import { useState, useEffect, useMemo, useRef } from "react";
import { useGlobalContext } from "@/context/GlobalContext";

const ANIMATION_DURATION_MS = 300;

export default function Hero() {
  const staticText = "NAMASTE ! I'M";
  const words = useMemo(
    () => [
      "SAIKIRAN..",
      "MERN FULL STACK DEVELOPER...",
      "PYTHON DEVELOPER....",
      "CURRENTLY WORKING ON THIS....",
    ],
    []
  );

  const typingSpeed = 100;
  const deleteSpeed = 100;
  const delayBeforeDeletingCurrent = 2000;
  const delayBetweenLines = 500;

  const [displayText, setDisplayText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [secondLine, setSecondLine] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFirstLineDone, setIsFirstLineDone] = useState(false);
  const [showSecondCursor, setShowSecondCursor] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  const heroRef = useRef<HTMLDivElement>(null);
  const opacity = useMotionValue(1);
  const scale = useMotionValue(1);

  const {
    currentScene,
    setCurrentScene,
    prevScene,
    isAnimating,
    setIsAnimating,
  } = useGlobalContext();

  // First line typing
  useEffect(() => {
    if (displayText.length < staticText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(staticText.slice(0, displayText.length + 1));
      }, displayText === "NAMASTE !" ? 2000 : typingSpeed);
      return () => clearTimeout(timeout);
    } else if (!isFirstLineDone) {
      setIsFirstLineDone(true);
      const cursorTimeout = setTimeout(() => setShowSecondCursor(true), delayBetweenLines);
      return () => clearTimeout(cursorTimeout);
    }
  }, [displayText, isFirstLineDone, staticText]);

  // Second line typing
  useEffect(() => {
    if (!isFirstLineDone) return;
    let timeout: NodeJS.Timeout;

    if (!isDeleting && secondLine.length < words[currentWordIndex].length) {
      timeout = setTimeout(() => {
        setSecondLine(words[currentWordIndex].slice(0, secondLine.length + 1));
      }, typingSpeed);
    } else if (!isDeleting) {
      timeout = setTimeout(() => setIsDeleting(true), delayBeforeDeletingCurrent);
    } else if (isDeleting && secondLine.length > 0) {
      timeout = setTimeout(() => {
        setSecondLine((prev) => prev.slice(0, prev.length - 1));
      }, deleteSpeed);
    } else {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timeout);
  }, [secondLine, isDeleting, isFirstLineDone, currentWordIndex, words]);

  const handleTransition = (direction: "up" | "down") => {
    if (!heroRef.current) return;

    const heroHeight = heroRef.current.clientHeight;
    const targetY = direction === "down" ? heroHeight : 0;
    const startY = window.scrollY;
    const startTime = performance.now();

    setIsAnimating(true);
    document.body.style.overflow = "hidden";

    animate(opacity, direction === "down" ? 0 : 1, {
      duration: ANIMATION_DURATION_MS / 1000,
    });
    animate(scale, direction === "down" ? 0.7 : 1, {
      duration: ANIMATION_DURATION_MS / 1000,
    });

    if (direction === "up") setShouldRender(true);

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION_MS, 1);
      window.scrollTo(0, startY + (targetY - startY) * progress);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        setIsAnimating(false);
        document.body.style.overflow = "auto";

        if (direction === "down") {
          setCurrentScene(1);
          setShouldRender(false);
        } else {
          setShouldRender(true);
        }
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // Wheel + arrow key events
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isAnimating || currentScene !== 0) return;
      const scrollingDown = e.deltaY > 0;
      if (scrollingDown) {
        e.preventDefault();
        handleTransition("down");
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (isAnimating || currentScene !== 0) return;
      if (["ArrowDown", "PageDown"].includes(e.key)) {
        e.preventDefault();
        handleTransition("down");
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKey);
    };
  }, [isAnimating, currentScene]);

  // Reverse animation when returning from Scene 1
  useEffect(() => {
    if (prevScene === 1 && currentScene === 0 && !isAnimating) {
      handleTransition("up");
    }
  }, [currentScene, prevScene, isAnimating]);

  return (
    <div ref={heroRef} className="h-screen w-full relative">
      {shouldRender && (
        <motion.section
          className="fixed top-0 left-0 w-full h-screen flex items-center justify-center text-white z-[-2]"
          style={{ opacity, scale }}
        >
          <div className="max-w-4xl w-full text-left">
            <h2
              className="text-4xl sm:text-5xl md:text-9xl font-bold font-['Foldit']"
              style={{
                textShadow:
                  "0.1rem 0 0.3rem rgba(255, 255, 255, 0.8), 0 0 0.6rem rgba(18, 33, 163, 0.5)",
              }}
            >
              {displayText}
              {displayText.length < staticText.length && (
                <span className="text-blue-500 animate-blink">|</span>
              )}
            </h2>

            <h2
              className="text-4xl sm:text-5xl md:text-9xl font-bold mt-4 font-['Foldit']"
              style={{
                textShadow:
                  "0.1rem 0 0.3rem rgba(255, 255, 255, 0.8), 0 0 0.6rem rgba(18, 33, 163, 0.5)",
              }}
            >
              <span className="text-blue-500">{secondLine}</span>
              {showSecondCursor && <span className="text-red-500 animate-blink">|</span>}
            </h2>
          </div>
        </motion.section>
      )}
    </div>
  );
}
