"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Home() {
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
    <div className="bg-black text-white flex flex-col min-h-screen">
      {/* Header */}
      <motion.header
        className="w-full bg-black text-white py-6 px-6 flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-lg"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-3xl font-bold">KS</h1>
        <nav>
          <ul className="flex space-x-6 text-lg">
            <motion.li whileHover={{ scale: 1.1 }}>
              <a href="#about" className="hover:text-gray-400">About</a>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }}>
              <a href="#projects" className="hover:text-gray-400">Projects</a>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }}>
              <a href="#contact" className="hover:text-gray-400">Contact</a>
            </motion.li>
          </ul>
        </nav>
      </motion.header>

      {/* Hero Section */}
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

      {/* Projects Section */}
      <motion.section
        id="projects"
        className="mt-16 w-full px-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold text-center">Projects</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <motion.div
              key={num}
              className="p-6 bg-gray-900 rounded-xl"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-xl font-semibold">Project {num}</h3>
              <p className="text-gray-400 mt-2">A brief description of your project.</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id="contact"
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold">Contact Me</h2>
        <p className="text-gray-400 mt-4">Feel free to reach out!</p>
        <motion.a
          href="mailto:your.email@example.com"
          className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          whileHover={{ scale: 1.1 }}
        >
          Say Hello 👋
        </motion.a>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="w-full bg-black text-gray-500 text-sm py-4 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        © {new Date().getFullYear()} Kiran. All Rights Reserved.
      </motion.footer>
    </div>
  );
}
