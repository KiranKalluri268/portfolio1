"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo, useRef } from "react";
import { useGlobalContext } from "@/context/GlobalContext";

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

  const heroRef = useRef<HTMLDivElement>(null);
  const { currentScene, prevScene } = useGlobalContext();
  
  // Determine navigation direction
  // Forward: prevScene < currentScene (moving down, e.g., initial load or 0→1)
  // Backward: prevScene > currentScene (moving up, e.g., 1→0)
  const isForward = prevScene <= currentScene;

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

  return (
    <section 
      ref={heroRef} 
      className="h-screen w-full relative overflow-hidden" 
      id="hero"
      aria-label="Hero section - Introduction"
    >
      <motion.div
        className="fixed top-0 left-0 w-full h-screen flex items-center justify-center text-white z-[-2]"
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
        <div className="max-w-4xl w-full text-left">
          <h1
            className="text-4xl sm:text-5xl md:text-9xl font-bold font-['Foldit']"
            style={{
              textShadow:
                "0.1rem 0 0.3rem rgba(255, 255, 255, 0.8), 0 0 0.6rem rgba(18, 33, 163, 0.5)",
            }}
          >
            {displayText}
            {displayText.length < staticText.length && (
              <span className="text-blue-500 animate-blink" aria-hidden="true">|</span>
            )}
          </h1>

          <h2
            className="text-4xl sm:text-5xl md:text-9xl font-bold mt-4 font-['Foldit']"
            style={{
              textShadow:
                "0.1rem 0 0.3rem rgba(255, 255, 255, 0.8), 0 0 0.6rem rgba(18, 33, 163, 0.5)",
            }}
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="text-blue-500">{secondLine}</span>
            {showSecondCursor && <span className="text-red-500 animate-blink" aria-hidden="true">|</span>}
          </h2>
        </div>
      </motion.div>
    </section>
  );
}
