"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useMemo, useRef } from "react";

export default function Hero() {
  const staticText = "NAMASTE ! I'M";
  const words = useMemo(
    () => [
      "SAIKIRAN..",
      "MERN FULL STACK DEVELOPER...",
      "PYTHON DEVELOPER....",
      "WORKING ON THIS....",
    ],
    []
  );

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
  const heroRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(true);

  // Typing effect for first line
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

  // Typing effect for second line
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

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.02, 0.04, 1], [1, 0.5, 0, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.02, 0.04, 1], [1, 0.9, 0.7, 0]);

  useEffect(() => {
  const unsubscribe = scrollYProgress.on("change", (latest) => {
    if (latest >= 0.04) {
      setShouldRender(false);
    } else {
      setShouldRender(true);
    }
  });

  return () => unsubscribe();
}, [scrollYProgress]);

  // Scroll detection + auto-scroll to next section
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      const currentY = window.scrollY;
      const scrollingDown = e.deltaY > 0;

      if (scrollingDown && heroRef.current) {
        const heroHeight = heroRef.current.clientHeight;
        if (currentY < heroHeight - 100) {
          window.scrollTo({
            top: heroHeight,
            behavior: "smooth",
          });
        }
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: false });
    return () => window.removeEventListener("wheel", handleScroll);
  }, []);

  // Disable scroll when hero in view
  useEffect(() => {
  const element = heroRef.current;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    },
    {
      root: null,
      threshold: 0.9,
    }
  );

  if (element) {
    observer.observe(element);
  }

  return () => {
    if (element) {
      observer.unobserve(element);
    }
    document.body.style.overflow = "auto";
  };
}, []);

  return (
    <div ref={heroRef} className="h-screen w-full relative">
      {shouldRender && (
      <motion.section
        className="fixed top-0 left-[-180] w-full h-screen flex items-center justify-center text-white z-[-2]"
        style={{ opacity, scale }}
      >
        <div className="max-w-4xl w-full text-left">
          <h2
            className="text-5xl sm:text-6xl md:text-9xl font-bold font-['Foldit']"
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
