"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

export default function Hero() {
  const staticText = "NAMASTE ! I'M";
  const words = ["SAIKIRAN..", "MERN FULL STACK DEVELOPER...", "PYTHON DEVELOPER...."];
  const typingSpeed = 50;
  const deleteSpeed = 100;
  const delayBeforeDeletingCurrent = 2000;
  const delayBetweenLines = 500;

  const [displayText, setDisplayText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [secondLine, setSecondLine] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFirstLineDone, setIsFirstLineDone] = useState(false);
  const [showSecondCursor, setShowSecondCursor] = useState(false);

  useEffect(() => {
    if (displayText.length < staticText.length) {
      let timeout: NodeJS.Timeout;

      if (displayText === "NAMASTE !") {
        timeout = setTimeout(() => {
          setDisplayText(staticText.slice(0, displayText.length + 1));
        }, 2000);
      } else {
        timeout = setTimeout(() => {
          setDisplayText(staticText.slice(0, displayText.length + 1));
        }, typingSpeed);
      }

      return () => clearTimeout(timeout);
    } else {
      setIsFirstLineDone(true);
      setTimeout(() => setShowSecondCursor(true), delayBetweenLines);
    }
  }, [displayText]);

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
  }, [secondLine, isDeleting, isFirstLineDone, currentWordIndex, words]); // ✅ Added missing dependencies  

  // 📌 Add scroll animation
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.5, 1], [1, 0.9, 0, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.5, 1], [1, 0.95, 0.7, 0.6]);

  return (
    <>
      {/* 🚀 Spacer to push projects down */}
      <div className="h-screen w-full"></div>

      {/* 🚀 Hero Section */}
      <motion.section
        className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black text-white z-10"
        style={{ opacity, scale }}
      >
        <div className="max-w-4xl w-full text-left">
          <h2 className="text-5xl sm:text-6xl md:text-9xl font-bold font-['Foldit']">
            {displayText}
            {displayText.length < staticText.length && <span className="text-blue-500 animate-blink">|</span>}
          </h2>

          <h2 className="text-4xl sm:text-5xl md:text-9xl font-bold mt-4 font-['Foldit']">
            <span className="text-blue-500">{secondLine}</span>
            {showSecondCursor && <span className="text-red-500 animate-blink">|</span>}
          </h2>
        </div>
      </motion.section>
    </>
  );
}
