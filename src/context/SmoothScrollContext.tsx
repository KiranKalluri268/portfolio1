"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export const SECTION_IDS = ["hero", "projects", "experience", "skills", "contact"] as const;
export type SectionId = (typeof SECTION_IDS)[number];

interface SmoothScrollContextValue {
  activeSection: SectionId;
  lenis: Lenis | null;
  scrollToSection: (section: SectionId) => void;
  scrollNext: () => void;
  scrollPrev: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue | undefined>(undefined);

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const instance = new Lenis({
      autoRaf: false,
      anchors: true,
      smoothWheel: !reduceMotion,
      lerp: reduceMotion ? 1 : 0.09,
      syncTouch: false,
      wheelMultiplier: 0.9,
    });
    lenisRef.current = instance;
    setLenis(instance);

    const updateScrollTrigger = () => ScrollTrigger.update();
    const updateLenis = (time: number) => instance.raf(time * 1000);
    instance.on("scroll", updateScrollTrigger);
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    let sectionTriggers: ScrollTrigger[] = [];
    const createSectionTriggers = () => {
      sectionTriggers.forEach((trigger) => trigger.kill());
      sectionTriggers = SECTION_IDS.flatMap((id) => {
        const element = document.getElementById(id);
        if (!element) return [];
        return [ScrollTrigger.create({
          id: `section-${id}`,
          trigger: element,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) setActiveSection(id);
          },
        })];
      });
      ScrollTrigger.refresh();
    };

    createSectionTriggers();
    const observer = new MutationObserver(() => {
      if (SECTION_IDS.some((id) => !document.getElementById(id))) return;
      createSectionTriggers();
      observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      sectionTriggers.forEach((trigger) => trigger.kill());
      gsap.ticker.remove(updateLenis);
      instance.off("scroll", updateScrollTrigger);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  const scrollToSection = useCallback((section: SectionId) => {
    const element = document.getElementById(section);
    if (!element) return;
    if (lenisRef.current) lenisRef.current.scrollTo(element, { duration: 1.15 });
    else element.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const scrollNext = useCallback(() => {
    const index = SECTION_IDS.indexOf(activeSection);
    scrollToSection(SECTION_IDS[Math.min(index + 1, SECTION_IDS.length - 1)]);
  }, [activeSection, scrollToSection]);

  const scrollPrev = useCallback(() => {
    const index = SECTION_IDS.indexOf(activeSection);
    scrollToSection(SECTION_IDS[Math.max(index - 1, 0)]);
  }, [activeSection, scrollToSection]);

  const value = useMemo(() => ({ activeSection, lenis, scrollToSection, scrollNext, scrollPrev }),
    [activeSection, lenis, scrollToSection, scrollNext, scrollPrev]);

  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>;
}

export function useSmoothScroll() {
  const context = useContext(SmoothScrollContext);
  if (!context) throw new Error("useSmoothScroll must be used within SmoothScrollProvider");
  return context;
}
