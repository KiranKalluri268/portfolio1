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

interface ScrollActionsContextValue {
  lenis: Lenis | null;
  scrollToSection: (section: SectionId) => void;
  scrollNext: () => void;
  scrollPrev: () => void;
}

const ScrollActionsContext = createContext<ScrollActionsContextValue | undefined>(undefined);
const ActiveSectionContext = createContext<SectionId | undefined>(undefined);

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const activeSectionRef = useRef<SectionId>("hero");
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
            if (self.isActive && activeSectionRef.current !== id) {
              activeSectionRef.current = id;
              setActiveSection(id);
            }
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
    const index = SECTION_IDS.indexOf(activeSectionRef.current);
    scrollToSection(SECTION_IDS[Math.min(index + 1, SECTION_IDS.length - 1)]);
  }, [scrollToSection]);

  const scrollPrev = useCallback(() => {
    const index = SECTION_IDS.indexOf(activeSectionRef.current);
    scrollToSection(SECTION_IDS[Math.max(index - 1, 0)]);
  }, [scrollToSection]);

  const actions = useMemo(() => ({ lenis, scrollToSection, scrollNext, scrollPrev }),
    [lenis, scrollToSection, scrollNext, scrollPrev]);

  return (
    <ScrollActionsContext.Provider value={actions}>
      <ActiveSectionContext.Provider value={activeSection}>
        {children}
      </ActiveSectionContext.Provider>
    </ScrollActionsContext.Provider>
  );
}

export function useScrollActions() {
  const context = useContext(ScrollActionsContext);
  if (!context) throw new Error("useScrollActions must be used within SmoothScrollProvider");
  return context;
}

export function useActiveSection() {
  const context = useContext(ActiveSectionContext);
  if (!context) throw new Error("useActiveSection must be used within SmoothScrollProvider");
  return context;
}

export function useSmoothScroll() {
  return { activeSection: useActiveSection(), ...useScrollActions() };
}
