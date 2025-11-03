"use client";

import { useRef } from "react";
import { useUnifiedScroll } from "@/context/UnifiedScrollManager";

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

// Map section IDs to scene numbers
const SECTION_TO_SCENE: Record<string, number> = {
  "main-content": 0, // Hero
  "hero": 0,
  "projects": 1,
  "experience": 2,
  "skills": 3,
  "contact": 4,
};

export default function SkipLink({ href, children }: SkipLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const { currentScene, navigateToScene, isTransitioning } = useUnifiedScroll();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isTransitioning) return; // Ignore if already transitioning
    
    const targetId = href.replace("#", "");
    
    // Determine which scene to navigate to
    const targetScene = SECTION_TO_SCENE[targetId];
    
    if (targetScene === undefined) {
      // Unknown target, try to scroll to element anyway
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        if (!targetElement.hasAttribute("tabindex")) {
          targetElement.setAttribute("tabindex", "-1");
        }
        requestAnimationFrame(() => {
          targetElement.focus();
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
      return;
    }
    
    // Navigate to scene - UnifiedScrollManager will handle sequential transitions
    if (targetScene !== currentScene) {
      navigateToScene(targetScene);
      
      // After transition completes, scroll to element
      // Calculate total transition time (number of scenes * duration)
      const scenesToTransition = Math.abs(targetScene - currentScene);
      const totalTransitionTime = scenesToTransition * 800; // TRANSITION_DURATION from UnifiedScrollManager
      
      setTimeout(() => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          if (!targetElement.hasAttribute("tabindex")) {
            targetElement.setAttribute("tabindex", "-1");
          }
          requestAnimationFrame(() => {
            targetElement.focus();
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        }
      }, totalTransitionTime + 100); // Wait for all transitions + buffer
    } else {
      // Scene is already active, scroll immediately
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        if (!targetElement.hasAttribute("tabindex")) {
          targetElement.setAttribute("tabindex", "-1");
        }
        requestAnimationFrame(() => {
          targetElement.focus();
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    }
  };

  return (
    <a
      ref={linkRef}
      href={href}
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={`Skip to ${children}`}
    >
      {children}
    </a>
  );
}

