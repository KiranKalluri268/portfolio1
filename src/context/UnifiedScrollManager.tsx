"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from "react";

// Constants for scroll behavior
const TRANSITION_DURATION = 800; // Milliseconds to wait at each scene before transitioning
const SCENE_DISPLAY_TIME = 500; // Minimum time to display each scene before allowing transition
const TOTAL_SCENES = 5; // 0-4 scenes
const MOUSE_SCROLL_THRESHOLD = 50; // Vastly reduced threshold for instant trigger
const LOCK_SAFETY_TIMEOUT = 2000; // Auto-unlock after 2 seconds if no signal received

type NavigationSource = 'indicator' | 'input';

interface UnifiedScrollManagerType {
  currentScene: number;
  targetScene: number;
  isTransitioning: boolean;
  navigateToScene: (target: number, source?: NavigationSource) => void;
  navigateNext: () => void;
  navigatePrev: () => void;
  // Allow components to temporarily disable scroll handling (e.g., for internal carousels)
  setScrollEnabled: (enabled: boolean) => void;
  // Allow components to register navigation guards (return false to block navigation)
  // Guard receives direction ("forward" | "backward") to allow different logic for each direction
  registerNavigationGuard: (scene: number, guard: (direction: "forward" | "backward") => boolean) => void;
  unregisterNavigationGuard: (scene: number) => void;
  // Register carousel advance callback - called automatically when navigation is blocked
  registerCarouselAdvance: (scene: number, advance: (direction: "forward" | "backward") => Promise<void>) => void;
  unregisterCarouselAdvance: (scene: number) => void;
  // Signal that animation is complete and scroll can be unlocked
  unlockScroll: () => void;
}

const UnifiedScrollManagerContext = createContext<UnifiedScrollManagerType | undefined>(undefined);

export function UnifiedScrollProvider({ children }: { children: ReactNode }) {
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [targetScene, setTargetScene] = useState<number>(0);
  const [transitionQueue, setTransitionQueue] = useState<number[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Lock state: When true, ALL input is ignored.
  // This is separate from isTransitioning to handle the "input -> reaction" gap instantly
  const isLockedRef = useRef(false);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollEnabledRef = useRef(true); // Allow components to disable scroll handling

  // Touch handling
  const touchStartYRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const TOUCH_THRESHOLD = 50; // Minimum distance for swipe

  // Navigation guards: Map<sceneNumber, guardFunction>
  const navigationGuardsRef = useRef<Map<number, (direction: "forward" | "backward") => boolean>>(new Map());

  // Carousel advance callbacks: Map<sceneNumber, advanceFunction>
  const carouselAdvanceRef = useRef<Map<number, (direction: "forward" | "backward") => Promise<void>>>(new Map());

  const transitionSourceRef = useRef<NavigationSource>('input');

  /**
   * Unlocks the scroll manager, allowing new inputs.
   * Should be called by the SceneWrapper when enter animation completes.
   */
  const unlockScroll = useCallback(() => {
    isLockedRef.current = false;
    setIsTransitioning(false);
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
  }, []);

  /**
   * INTERNAL: Locks scroll and sets a safety timeout
   */
  const lockScroll = useCallback(() => {
    isLockedRef.current = true;
    setIsTransitioning(true);

    // Safety net: Auto-unlock if animation hangs or signal is missed
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    safetyTimeoutRef.current = setTimeout(() => {
      console.warn("UnifiedScrollManager: Safety timeout triggered (no unlock signal received)");
      unlockScroll();
    }, LOCK_SAFETY_TIMEOUT);
  }, [unlockScroll]);

  /**
   * Builds a sequential path from current scene to target scene
   */
  const buildPath = useCallback((from: number, to: number): number[] => {
    if (from === to) return [];
    const path: number[] = [];
    const step = from < to ? 1 : -1;
    for (let i = from; i !== to; i += step) {
      path.push(i + step);
    }
    return path;
  }, []);

  /**
   * Navigate to a target scene
   */
  const navigateToScene = useCallback((target: number, source: NavigationSource = 'input') => {
    // Validate target
    if (target < 0 || target >= TOTAL_SCENES) return;

    // If locked or transitioning, ignore
    if (isLockedRef.current && target !== targetScene) return;

    // If already at target, ignore
    if (target === currentScene) return;

    // Build the path
    const path = buildPath(currentScene, target);
    if (path.length === 0) return;

    // LOCK IMMEDIATELY
    lockScroll();

    transitionSourceRef.current = source;
    setTargetScene(target);
    setTransitionQueue(path);
  }, [currentScene, targetScene, buildPath, lockScroll]);

  /**
   * Navigate to next scene
   */
  const navigateNext = useCallback(() => {
    if (currentScene < TOTAL_SCENES - 1) {
      const guard = navigationGuardsRef.current.get(currentScene);
      if (guard && !guard("forward")) {
        return;
      }
      navigateToScene(currentScene + 1);
    }
  }, [currentScene, navigateToScene]);

  /**
   * Navigate to previous scene
   */
  const navigatePrev = useCallback(() => {
    if (currentScene > 0) {
      const guard = navigationGuardsRef.current.get(currentScene);
      if (guard && !guard("backward")) {
        return;
      }
      navigateToScene(currentScene - 1);
    }
  }, [currentScene, navigateToScene]);

  /**
   * Attempt transition with auto-advance retry (for internal carousels)
   */
  const attemptTransitionWithAutoAdvance = useCallback(async (
    nextScene: number,
    direction: "forward" | "backward",
    maxRetries: number = 20
  ): Promise<boolean> => {
    const guard = navigationGuardsRef.current.get(currentScene);
    const isBlocked = guard && !guard(direction);

    if (!isBlocked) {
      // Guard allows - proceed with transition
      lockScroll();
      setCurrentScene(nextScene);
      setTransitionQueue(prev => {
        const newQueue = prev.slice(1);
        // If queue empty, we wait for visual component to call unlockScroll
        return newQueue;
      });
      return true;
    }

    // Guard blocks - try to advance carousel
    const advance = carouselAdvanceRef.current.get(currentScene);

    if (!advance || maxRetries <= 0) {
      setTransitionQueue(prev => prev.slice(1));
      if (transitionQueue.length <= 1) unlockScroll();
      return false;
    }

    try {
      await advance(direction);
      await new Promise(resolve => setTimeout(resolve, 100));
      return await attemptTransitionWithAutoAdvance(nextScene, direction, maxRetries - 1);
    } catch {
      setTransitionQueue(prev => prev.slice(1));
      if (transitionQueue.length <= 1) unlockScroll();
      return false;
    }
  }, [currentScene, transitionQueue.length, unlockScroll, lockScroll]);

  /**
   * Execute transitions sequentially from the queue
   */
  useEffect(() => {
    if (transitionQueue.length === 0) return;

    const nextScene = transitionQueue[0];
    const direction: "forward" | "backward" = nextScene > currentScene ? "forward" : "backward";

    const checkAndTransition = () => {
      const guard = navigationGuardsRef.current.get(currentScene);
      const isBlocked = guard && !guard(direction);

      if (isBlocked) {
        attemptTransitionWithAutoAdvance(nextScene, direction);
        return;
      }

      // Proceed with transition
      // We do NOT wait for delay here anymore. We update state immediately.
      // The visual component will animate and then call unlockScroll().
      setCurrentScene(nextScene);
      setTransitionQueue(prev => prev.slice(1));

      // Note: isTransitioning/isLocked remains true until unlockScroll is called
    };

    // Use requestAnimationFrame to ensure guards are registered (React render cycle)
    requestAnimationFrame(() => {
      checkAndTransition();
    });

  }, [transitionQueue, currentScene, attemptTransitionWithAutoAdvance]);

  const setScrollEnabled = useCallback((enabled: boolean) => {
    scrollEnabledRef.current = enabled;
  }, []);

  const registerNavigationGuard = useCallback((scene: number, guard: (direction: "forward" | "backward") => boolean) => {
    navigationGuardsRef.current.set(scene, guard);
  }, []);

  const unregisterNavigationGuard = useCallback((scene: number) => {
    navigationGuardsRef.current.delete(scene);
  }, []);

  const registerCarouselAdvance = useCallback((scene: number, advance: (direction: "forward" | "backward") => Promise<void>) => {
    carouselAdvanceRef.current.set(scene, advance);
  }, []);

  const unregisterCarouselAdvance = useCallback((scene: number) => {
    carouselAdvanceRef.current.delete(scene);
  }, []);

  /**
   * LOCK-AWARE SCROLL HANDLER
   */
  const handleScroll = useCallback((e: WheelEvent) => {
    if (!scrollEnabledRef.current) return;

    // 1. Check Global Lock
    if (isLockedRef.current) {
      e.preventDefault();
      return;
    }

    // 2. Filter Jitter (Tiny unintended movements)
    if (Math.abs(e.deltaY) < MOUSE_SCROLL_THRESHOLD) {
      // Allow default or ignore? 
      // Better to prevent default to avoid 'native' scroll feel mixed with custom
      // unless it's horizontal?
      return;
    }

    // 3. Determine Direction
    const direction = e.deltaY > 0 ? 1 : -1;
    const nextScene = currentScene + direction;

    // 4. Validate Bounds
    if (nextScene >= 0 && nextScene < TOTAL_SCENES) {
      // 5. TRIGGER LOCK & NAVIGATE
      e.preventDefault();
      if (direction > 0) navigateNext();
      else navigatePrev();
    } else {
      // Out of bounds, but still prevent default to stop rubber-banding
      // e.preventDefault(); 
      // Actually, rubber-banding might be nice? Let's prevent to keep "app" feel.
      if (Math.abs(e.deltaY) > MOUSE_SCROLL_THRESHOLD) {
        // Reset lock just in case? No, we didn't lock.
      }
    }
  }, [currentScene, navigateNext, navigatePrev]);

  /**
   * LOCK-AWARE KEYBOARD HANDLER
   */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isLockedRef.current) {
      e.preventDefault();
      return;
    }

    if (["ArrowDown", "PageDown", "s", "S"].includes(e.key)) {
      e.preventDefault();
      navigateNext();
    }
    else if (["ArrowUp", "PageUp", "w", "W"].includes(e.key)) {
      e.preventDefault();
      navigatePrev();
    }
  }, [navigateNext, navigatePrev]);

  /**
   * LOCK-AWARE TOUCH HANDLER
   */
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
    touchStartXRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback(() => { }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!scrollEnabledRef.current || isLockedRef.current || touchStartYRef.current === null || touchStartXRef.current === null) {
      return;
    }

    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaY = touchStartYRef.current - touchEndY;
    const deltaX = touchStartXRef.current - touchEndX;

    // Vertical dominance check
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (Math.abs(deltaY) > TOUCH_THRESHOLD) {
        if (deltaY > 0) navigateNext();
        else navigatePrev();
      }
    }
    touchStartYRef.current = null;
    touchStartXRef.current = null;
  }, [navigateNext, navigatePrev]);

  useEffect(() => {
    window.addEventListener("wheel", handleScroll, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    };
  }, [handleScroll, handleKeyDown, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <UnifiedScrollManagerContext.Provider
      value={{
        currentScene,
        targetScene,
        isTransitioning,
        navigateToScene,
        navigateNext,
        navigatePrev,
        setScrollEnabled,
        registerNavigationGuard,
        unregisterNavigationGuard,
        registerCarouselAdvance,
        unregisterCarouselAdvance,
        unlockScroll, // Exported for SceneWrapper
      }}
    >
      {children}
    </UnifiedScrollManagerContext.Provider>
  );
}

export function useUnifiedScroll() {
  const context = useContext(UnifiedScrollManagerContext);
  if (!context) {
    throw new Error("useUnifiedScroll must be used within UnifiedScrollProvider");
  }
  return context;
}
