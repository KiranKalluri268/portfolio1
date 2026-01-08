"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo, useRef } from "react";
import { useGlobalContext } from "@/context/GlobalContext";

export default function Hero() {
  const words = useMemo(
    () => [
      "MERN FULL STACK DEVELOPER..",
      "PYTHON DEVELOPER....",
      "AWS ENGINEER...",
      "C++ DEVELOPER...",
    ],
    []
  );

  const typingSpeed = 100;
  const deleteSpeed = 100;
  const delayBeforeDeletingCurrent = 2000;
  const delayBetweenLines = 500;

  // Animation States
  const [displayText, setDisplayText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [secondLine, setSecondLine] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFirstLineDone, setIsFirstLineDone] = useState(false);
  const [showSecondCursor, setShowSecondCursor] = useState(false);

  // New state for H1 intro sequence
  const [h1State, setH1State] = useState<'typing_intro' | 'deleting_intro' | 'typing_name' | 'done'>('typing_intro');

  const heroRef = useRef<HTMLDivElement>(null);
  const { currentScene, prevScene } = useGlobalContext();

  // Determine navigation direction
  const isForward = prevScene <= currentScene;

  const introText = "NAMASTE!";
  const mainText = "I'M,\nSAIKIRAN KALLURI";

  // H1 Animation Sequence
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    switch (h1State) {
      case 'typing_intro':
        if (displayText.length < introText.length) {
          timeout = setTimeout(() => {
            setDisplayText(introText.slice(0, displayText.length + 1));
          }, typingSpeed);
        } else {
          // Wait before deleting
          timeout = setTimeout(() => setH1State('deleting_intro'), 1000);
        }
        break;

      case 'deleting_intro':
        if (displayText.length > 0) {
          timeout = setTimeout(() => {
            setDisplayText(displayText.slice(0, -1));
          }, deleteSpeed / 2); // Delete slightly faster
        } else {
          setH1State('typing_name');
        }
        break;

      case 'typing_name':
        if (displayText.length < mainText.length) {
          timeout = setTimeout(() => {
            setDisplayText(mainText.slice(0, displayText.length + 1));
          }, typingSpeed);
        } else {
          // Wait 1 second before starting H2
          timeout = setTimeout(() => {
            setH1State('done');
            setIsFirstLineDone(true);
            setShowSecondCursor(true);
          }, 1000);
        }
        break;

      case 'done':
        // H1 animation complete
        break;
    }

    return () => clearTimeout(timeout);
  }, [displayText, h1State, introText, mainText]);

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

  // Z-index: active scene on top, exiting scene below
  const zIndex = currentScene === 0 ? 10 : 1;

  return (
    <section
      ref={heroRef}
      className="h-screen w-full relative overflow-hidden"
      id="hero"
      aria-label="Hero section - Introduction"
      style={{ zIndex }}
    >
      <div className="relative w-full h-full text-white">
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-full max-w-5xl px-18 pt-8 sm:pt-0 sm:px-0 text-left transition-all duration-1000 ease-in-out ${h1State === 'done' ? 'top-[20vh] translate-y-0' : 'top-1/2 -translate-y-1/2'
            }`}
        >
          <h1
            className="font-bold font-['Foldit'] whitespace-pre-line leading-none"
            style={{
              textShadow:
                "0.1rem 0 0.3rem rgba(255, 255, 255, 0.8), 0 0 0.6rem rgba(18, 33, 163, 0.5)",
            }}
          >
            {displayText.split('\n').map((part, index) => (
              <span
                key={index}
                className={`transition-all duration-1000 ease-in-out ${index === 0
                  ? `sm:text-[3rem] ${h1State === 'done' ? 'text-[2.3rem] md:text-[4.5rem]' : 'text-[3rem] md:text-[8rem]'}`
                  : `text-[3rem] sm:text-[3rem] ${h1State === 'done' ? 'md:text-[6rem]' : 'md:text-[8rem]'}`
                  }`}
              >
                {part}
                {index === 0 && displayText.includes('\n') && '\n'}
              </span>
            ))}
            {h1State !== 'done' && (
              <span
                className="text-blue-500 animate-blink text-[2.5rem] sm:text-[3rem] md:text-[8rem]"
                aria-hidden="true"
              >
                |
              </span>
            )}
          </h1>

          <h2
            className="text-[3.1rem] sm:text-[3rem] md:text-[7.5rem] font-bold mt-4 font-['Foldit'] leading-none"
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
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-1 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-0 cursor-pointer z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { delay: 1, duration: 1 },
          y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
        }}
        onClick={() => {
          // Trigger scroll via UnifiedScrollManager if available, or just visual hint
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
        }}
        aria-label="Scroll down"
        role="button"
      >
        <span className="text-sm font-light tracking-widest">Scroll Down or</span>
        <span className="text-sm font-light tracking-widest">Press Arrow Down</span>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </section >
  );
}
