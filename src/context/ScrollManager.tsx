// src/context/ScrollManager.tsx
"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";

type ScrollManagerContextType = {
  currentSection: number;
  scrollToSection: (index: number) => void;
  registerSection: (ref: React.RefObject<HTMLElement>) => number;
  isScrolling: boolean;
  isAnimating: boolean;
  setIsScrolling: (value: boolean) => void;
  setIsAnimating: (value: boolean) => void;
};

const ScrollManagerContext = createContext<ScrollManagerContextType | undefined>(undefined);

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const sectionRefs = useRef<React.RefObject<HTMLElement>[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const scrollToSection = useCallback(
    (index: number) => {
      const section = sectionRefs.current[index]?.current;
      if (section && !isScrolling && !isAnimating) {
        setIsScrolling(true);
        setIsAnimating(true);
        section.scrollIntoView({ behavior: "smooth" });

        setTimeout(() => {
          setCurrentSection(index);
          setIsScrolling(false);
          setIsAnimating(false);
        }, 1000); // adjust as needed
      }
    },
    [isScrolling, isAnimating]
  );

  const registerSection = (ref: React.RefObject<HTMLElement>) => {
    sectionRefs.current.push(ref);
    return sectionRefs.current.length - 1;
  };

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (isScrolling || isAnimating) return;
      e.preventDefault();

      if (e.deltaY > 0 && currentSection < sectionRefs.current.length - 1) {
        scrollToSection(currentSection + 1);
      } else if (e.deltaY < 0 && currentSection > 0) {
        scrollToSection(currentSection - 1);
      }
    },
    [currentSection, isScrolling, isAnimating, scrollToSection]
  );

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (isScrolling || isAnimating) return;

      if (
        ["ArrowDown", "PageDown"].includes(e.key) &&
        currentSection < sectionRefs.current.length - 1
      ) {
        e.preventDefault();
        scrollToSection(currentSection + 1);
      } else if (
        ["ArrowUp", "PageUp"].includes(e.key) &&
        currentSection > 0
      ) {
        e.preventDefault();
        scrollToSection(currentSection - 1);
      }
    },
    [currentSection, isScrolling, isAnimating, scrollToSection]
  );

  const handleTouch = useCallback((e: TouchEvent) => {
    e.preventDefault();
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKey);
    window.addEventListener("touchmove", handleTouch, { passive: false });

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("touchmove", handleTouch);
    };
  }, [handleWheel, handleKey, handleTouch]);

  return (
    <ScrollManagerContext.Provider
      value={{
        currentSection,
        scrollToSection,
        registerSection,
        isScrolling,
        isAnimating,
        setIsScrolling,
        setIsAnimating,
      }}
    >
      {children}
    </ScrollManagerContext.Provider>
  );
};

export const useScrollManager = () => {
  const context = useContext(ScrollManagerContext);
  if (!context) {
    throw new Error("useScrollManager must be used within a ScrollProvider");
  }
  return context;
};
