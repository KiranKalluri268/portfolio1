"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useScrollActions } from "@/context/SmoothScrollContext";

export default function Hero() {
  const { scrollNext } = useScrollActions();
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
          timeout = setTimeout(() => setH1State('typing_name'), 0);
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
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }, 0);
    }

    return () => clearTimeout(timeout);
  }, [secondLine, isDeleting, isFirstLineDone, currentWordIndex, words]);

  return (
    <section
      ref={heroRef}
      className="relative h-[100dvh] min-h-[100svh] w-full overflow-hidden"
      id="hero"
      aria-label="Hero section - Introduction"
      style={{ zIndex: 10 }}
    >
      <div className="relative w-full h-full text-white">
        <div
          className={`hero-copy absolute left-1/2 w-full max-w-5xl -translate-x-1/2 px-[clamp(1.25rem,7vw,4.5rem)] pt-8 text-left transition-all duration-1000 ease-in-out sm:px-8 sm:pt-0 lg:px-0 ${h1State === 'done' ? 'top-[20dvh] translate-y-0' : 'top-1/2 -translate-y-1/2'
            }`}
        >
          <h1
            className="font-bold font-[family-name:var(--font-foldit)] whitespace-pre-line leading-none"
            style={{
              textShadow:
                "0.1rem 0 0.3rem rgba(255, 255, 255, 0.8), 0 0 0.6rem rgba(18, 33, 163, 0.5)",
            }}
          >
            {displayText.split('\n').map((part, index) => (
              <span
                key={index}
                className={`transition-all duration-1000 ease-in-out ${index === 0
                  ? h1State === 'done'
                    ? "text-[clamp(2.1rem,9vw,4.5rem)]"
                    : "text-[clamp(3rem,13vw,8rem)]"
                  : h1State === 'done'
                    ? "text-[clamp(2.7rem,11vw,6rem)]"
                    : "text-[clamp(3rem,13vw,8rem)]"
                  }`}
              >
                {part}
                {index === 0 && displayText.includes('\n') && '\n'}
              </span>
            ))}
            {h1State !== 'done' && (
              <span
                className="animate-blink text-[clamp(2.5rem,13vw,8rem)] text-blue-500"
                aria-hidden="true"
              >
                |
              </span>
            )}
          </h1>

          <h2
            className="hero-role mt-4 max-w-full break-words text-[clamp(2.15rem,10vw,7.5rem)] font-bold font-[family-name:var(--font-foldit)] leading-none"
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
      <div
        className="scroll-hint absolute bottom-1 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-0 cursor-pointer z-20"
        onClick={scrollNext}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") scrollNext();
        }}
        tabIndex={0}
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
      </div>
    </section >
  );
}
