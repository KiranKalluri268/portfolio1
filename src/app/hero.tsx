"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Hero() {
  const staticText = "NAMASTE ! I'M"; // First line (Static)
  const words = ["SAIKIRAN..", "MERN FULL STACK DEVELOPER...", "PYTHON DEVELOPER...."]; // Words for second line
  const typingSpeed = 50; // Typing speed in ms
  const deleteSpeed = 100; // Deleting speed in ms
  const delayBeforeDeletingCurrent = 2000; // How long a word stays before deleting
  const delayBetweenLines = 500; // Delay before second line starts

  const [displayText, setDisplayText] = useState(""); // First line
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [secondLine, setSecondLine] = useState(""); // Second line
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFirstLineDone, setIsFirstLineDone] = useState(false);
  const [showSecondCursor, setShowSecondCursor] = useState(false);

  useEffect(() => {
    if (displayText.length < staticText.length) {
      let timeout: NodeJS.Timeout;

      if (displayText === "NAMASTE !") {
        // Wait for 2 seconds before typing "I'M"
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
    if (!isFirstLineDone) return; // Wait for first line to finish

    let timeout: NodeJS.Timeout;
    if (!isDeleting && secondLine.length < words[currentWordIndex].length) {
      // Typing second line
      timeout = setTimeout(() => {
        setSecondLine(words[currentWordIndex].slice(0, secondLine.length + 1));
      }, typingSpeed);
    } else if (!isDeleting) {
      // Wait before deleting
      timeout = setTimeout(() => setIsDeleting(true), delayBeforeDeletingCurrent);
    } else if (isDeleting && secondLine.length > 0) {
      // Deleting second line
      timeout = setTimeout(() => {
        setSecondLine((prev) => prev.slice(0, prev.length - 1));
      }, deleteSpeed);
    } else {
      // Move to next word and start typing
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timeout);
  }, [secondLine, isDeleting, isFirstLineDone]);

  return (
    <motion.section
      className="h-screen flex flex-col justify-center items-center px-6 sm:px-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-4xl w-full text-left">
        {/* First Line - Static after typing */}
        <h2 className="text-5xl sm:text-6xl md:text-9xl font-bold font-[Foldit]">
          {displayText}
          {displayText.length < staticText.length && <span className="text-blue-500 animate-blink">|</span>}
        </h2>

        {/* Second Line - Apply color to the entire text */}
        <h2 className="text-4xl sm:text-5xl md:text-9xl font-bold mt-4 font-[Foldit]">
          <span className="text-blue-500">{secondLine}</span>
          {showSecondCursor && <span className="text-red-500 animate-blink">|</span>}
        </h2>
      </div>
    </motion.section>
  );
}
