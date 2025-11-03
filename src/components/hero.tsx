"use client";

import { motion, useMotionValue, animate } from "framer-motion";
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
  const [shouldRender, setShouldRender] = useState(true);

  const heroRef = useRef<HTMLDivElement>(null);
  const opacity = useMotionValue(1);
  const scale = useMotionValue(1);

  const { currentScene, prevScene } = useGlobalContext();

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

  // Scene lifecycle: Handle scene enter/exit animations
  useEffect(() => {
    if (currentScene === 0) {
      // Scene is active - ensure it's rendered and animate in
      setShouldRender(true);
      animate(opacity, 1, { duration: 0.3 });
      animate(scale, 1, { duration: 0.3 });
    } else if (prevScene === 0 && currentScene !== 0) {
      // Scene is leaving - animate out
      setShouldRender(true); // Keep rendered during exit animation
      animate(opacity, 0, { duration: 0.3 });
      animate(scale, 0.7, { duration: 0.3 }).then(() => {
        setShouldRender(false);
      });
    }
  }, [currentScene, prevScene, opacity, scale]);

  return (
    <section 
      ref={heroRef} 
      className="h-screen w-full relative" 
      id="hero"
      aria-label="Hero section - Introduction"
    >
      {shouldRender && (
        <motion.div
          className="fixed top-0 left-0 w-full h-screen flex items-center justify-center text-white z-[-2]"
          style={{ opacity, scale }}
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
      )}
    </section>
  );
}
