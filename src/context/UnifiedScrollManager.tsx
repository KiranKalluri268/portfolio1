"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from "react";

// Constants for scroll behavior
const SCROLL_THRESHOLD = 1000; // Accumulated delta needed to trigger transition (lowered for better responsiveness)
const SCROLL_RESET_TIME = 50; // Reset accumulator after this many ms of inactivity
const TRANSITION_DURATION = 800; // Milliseconds to wait at each scene before transitioning (allows time to see scene content)
const SCENE_DISPLAY_TIME = 500; // Minimum time to display each scene before allowing transition
const TOTAL_SCENES = 5; // 0-4 scenes

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
}

const UnifiedScrollManagerContext = createContext<UnifiedScrollManagerType | undefined>(undefined);

export function UnifiedScrollProvider({ children }: { children: ReactNode }) {
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [targetScene, setTargetScene] = useState<number>(0);
  const [transitionQueue, setTransitionQueue] = useState<number[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Scroll accumulation
  const accumulatedDeltaRef = useRef(0);
  const lastScrollTimeRef = useRef(Date.now());
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollEnabledRef = useRef(true); // Allow components to disable scroll handling

  // Touch handling
  const touchStartYRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const TOUCH_THRESHOLD = 50; // Minimum distance for swipe


  // Animation blocking: tracks when we're in the middle of a visual animation
  // This extends beyond isTransitioning to cover the full animation duration
  const animationBlockUntilRef = useRef<number>(0); // Timestamp when animation blocking ends

  // Navigation guards: Map<sceneNumber, guardFunction>
  // Guard function takes direction ("forward" | "backward") and returns false to block, true to allow
  const navigationGuardsRef = useRef<Map<number, (direction: "forward" | "backward") => boolean>>(new Map());

  // Carousel advance callbacks: Map<sceneNumber, advanceFunction>
  // Advance function takes direction and advances internal carousel state
  // Returns Promise that resolves when advance animation completes
  const carouselAdvanceRef = useRef<Map<number, (direction: "forward" | "backward") => Promise<void>>>(new Map());

  // Track navigation source for conditional delay application
  // 'indicator' = SceneIndicator clicks (needs delay), 'input' = scroll/keyboard/touch (no delay)
  const transitionSourceRef = useRef<NavigationSource>('input');

  /**
   * Builds a sequential path from current scene to target scene
   * Example: buildPath(0, 3) returns [1, 2, 3]
   * Example: buildPath(3, 0) returns [2, 1, 0]
   */
  const buildPath = useCallback((from: number, to: number): number[] => {
    if (from === to) return [];

    const path: number[] = [];
    const step = from < to ? 1 : -1;

    // Include all intermediate scenes
    for (let i = from; i !== to; i += step) {
      path.push(i + step);
    }

    return path;
  }, []);

  /**
   * Navigate to a target scene with sequential transitions
   * If jumping multiple scenes, it will animate through all intermediate ones
   * @param target - Target scene index
   * @param source - Navigation source: 'indicator' for SceneIndicator clicks, 'input' for scroll/keyboard/touch (default)
   */
  const navigateToScene = useCallback((target: number, source: NavigationSource = 'input') => {
    // Validate target
    if (target < 0 || target >= TOTAL_SCENES) return;

    // If already transitioning, ignore
    if (isTransitioning && target === targetScene) return;

    // If already at target, ignore
    if (!isTransitioning && target === currentScene) return;

    // Build the path
    const path = buildPath(currentScene, target);

    if (path.length === 0) return;

    // Store navigation source for this transition
    transitionSourceRef.current = source;

    // Set target and start transition queue
    setTargetScene(target);
    setTransitionQueue(path);
    setIsTransitioning(true);
  }, [currentScene, targetScene, isTransitioning, buildPath]);

  /**
   * Navigate to next scene
   * Checks navigation guards before allowing transition
   */
  const navigateNext = useCallback(() => {
    if (currentScene < TOTAL_SCENES - 1) {
      // Check if there's a navigation guard for the current scene
      const guard = navigationGuardsRef.current.get(currentScene);
      if (guard && !guard("forward")) {
        // Guard blocked forward navigation
        return;
      }
      navigateToScene(currentScene + 1);
    }
  }, [currentScene, navigateToScene]);

  /**
   * Navigate to previous scene
   * Checks navigation guards before allowing transition
   */
  const navigatePrev = useCallback(() => {
    if (currentScene > 0) {
      // Check if there's a navigation guard for the current scene
      const guard = navigationGuardsRef.current.get(currentScene);
      if (guard && !guard("backward")) {
        // Guard blocked backward navigation
        return;
      }
      navigateToScene(currentScene - 1);
    }
  }, [currentScene, navigateToScene]);

  /**
   * Helper function to attempt transition with auto-advance retry
   */
  const attemptTransitionWithAutoAdvance = useCallback(async (
    nextScene: number,
    direction: "forward" | "backward",
    maxRetries: number = 20 // Prevent infinite loops
  ): Promise<boolean> => {
    const guard = navigationGuardsRef.current.get(currentScene);
    const isBlocked = guard && !guard(direction);

    if (!isBlocked) {
      // Guard allows - we're at a boundary state, wait to show it before transitioning
      // This ensures users see "Projects" title and "See all projects" states
      const isAtBoundary = true; // Guard allows means we're at boundary

      if (isAtBoundary) {
        // Wait to display the boundary state before transitioning
        // This applies especially to Projects scene (Scene 1)
        await new Promise(resolve => setTimeout(resolve, SCENE_DISPLAY_TIME));
      }

      // Guard allows - proceed with transition
      // Set animation blocking period
      animationBlockUntilRef.current = Date.now() + TRANSITION_DURATION;

      setCurrentScene(nextScene);
      setTransitionQueue(prev => {
        const newQueue = prev.slice(1);
        // If this was the last item in queue, transition is complete
        if (prev.length === 1) {
          setIsTransitioning(false);
        }
        return newQueue;
      });
      return true; // Success
    }

    // Guard blocks - try to advance carousel
    const advance = carouselAdvanceRef.current.get(currentScene);

    if (!advance || maxRetries <= 0) {
      // No advance callback or too many retries - skip this transition
      setTransitionQueue(prev => {
        const newQueue = prev.slice(1);
        if (prev.length === 1) {
          setIsTransitioning(false);
        }
        return newQueue;
      });
      return false;
    }

    // Advance carousel
    try {
      await advance(direction);
      // Small delay for state to update after advance
      await new Promise(resolve => setTimeout(resolve, 100));

      // Recursively retry (will check guard again and wait at boundary if guard allows)
      return await attemptTransitionWithAutoAdvance(nextScene, direction, maxRetries - 1);
    } catch {
      // If advance fails, skip
      setTransitionQueue(prev => {
        const newQueue = prev.slice(1);
        if (prev.length === 1) {
          setIsTransitioning(false);
        }
        return newQueue;
      });
      return false;
    }
  }, [currentScene]);

  /**
   * Execute transitions sequentially from the queue
   * Automatically advances internal carousels when guards block navigation
   */
  useEffect(() => {
    if (transitionQueue.length === 0 || !isTransitioning) return;

    const nextScene = transitionQueue[0];
    const direction: "forward" | "backward" = nextScene > currentScene ? "forward" : "backward";

    // Small delay to ensure component has mounted and registered guards/callbacks
    // This is especially important when entering a scene from outside
    const checkAndTransition = () => {
      // Check guard before transitioning
      const guard = navigationGuardsRef.current.get(currentScene);
      const isBlocked = guard && !guard(direction);

      if (isBlocked) {
        // Use auto-advance mechanism (handles its own timing)
        attemptTransitionWithAutoAdvance(nextScene, direction);
        return; // Don't proceed with normal transition
      }

      // No guard blocking - proceed with transition
      // Only apply TRANSITION_DURATION delay for SceneIndicator clicks
      // For scroll/keyboard/touch input, transition immediately
      const source = transitionSourceRef.current;
      const delay = source === 'indicator' ? TRANSITION_DURATION : 0;

      // Set animation blocking period (only for indicator, otherwise minimal)
      animationBlockUntilRef.current = Date.now() + delay;

      const transitionTimer = setTimeout(() => {
        setCurrentScene(nextScene);
        setTransitionQueue(prev => prev.slice(1));

        if (transitionQueue.length === 1) {
          setIsTransitioning(false);
        }
      }, delay);

      return transitionTimer;
    };

    // With AnimatePresence mode="sync", components mount immediately
    // Guards register right away, so we only need a tiny delay for React's render cycle
    // Use requestAnimationFrame to ensure guards are registered after component mounts
    let innerFrameId: number | null = null;
    const registrationFrame = requestAnimationFrame(() => {
      // Double RAF to ensure useEffect hooks have run
      innerFrameId = requestAnimationFrame(() => {
        const transitionTimer = checkAndTransition();
        // Store timer for cleanup if needed (though attemptTransitionWithAutoAdvance handles its own timing)
        if (!transitionTimer) {
          // Guard blocked - auto-advance will handle timing
        }
      });
    });

    return () => {
      cancelAnimationFrame(registrationFrame);
      if (innerFrameId !== null) {
        cancelAnimationFrame(innerFrameId);
      }
    };
  }, [transitionQueue, isTransitioning, currentScene, attemptTransitionWithAutoAdvance]);

  /**
   * Allow components to enable/disable scroll handling
   */
  const setScrollEnabled = useCallback((enabled: boolean) => {
    scrollEnabledRef.current = enabled;
  }, []);

  /**
   * Register a navigation guard for a specific scene
   * Guard function receives direction ("forward" | "backward") and should return false to block, true to allow
   */
  const registerNavigationGuard = useCallback((scene: number, guard: (direction: "forward" | "backward") => boolean) => {
    navigationGuardsRef.current.set(scene, guard);
  }, []);

  /**
   * Unregister a navigation guard for a specific scene
   */
  const unregisterNavigationGuard = useCallback((scene: number) => {
    navigationGuardsRef.current.delete(scene);
  }, []);

  /**
   * Register a carousel advance callback for a specific scene
   * Called automatically when navigation is blocked by a guard
   */
  const registerCarouselAdvance = useCallback((scene: number, advance: (direction: "forward" | "backward") => Promise<void>) => {
    carouselAdvanceRef.current.set(scene, advance);
  }, []);

  /**
   * Unregister a carousel advance callback for a specific scene
   */
  const unregisterCarouselAdvance = useCallback((scene: number) => {
    carouselAdvanceRef.current.delete(scene);
  }, []);

  /**
   * Unified scroll handler for both mouse wheel and touchpad
   * Accumulates small deltas and triggers transition when threshold is reached
   * Blocks all input during scene animations to ensure visible transitions
   */
  const handleScroll = useCallback((e: WheelEvent) => {
    // If scroll is disabled by a component (e.g., projects carousel), let it through
    if (!scrollEnabledRef.current) {
      return; // Don't prevent default, let component handle it
    }

    // Check if we're in animation blocking period (visual animations still playing)
    const now = Date.now();
    if (animationBlockUntilRef.current > now) {
      e.preventDefault();
      return; // Block all input during animation
    }

    // If currently transitioning, prevent default and ignore
    if (isTransitioning) {
      e.preventDefault();
      return;
    }

    // Use the now variable we already checked
    const timeDelta = now - lastScrollTimeRef.current;

    // Reset accumulator if too much time passed (new gesture started)
    if (timeDelta > SCROLL_RESET_TIME) {
      accumulatedDeltaRef.current = 0;
    }

    // Accumulate scroll delta
    accumulatedDeltaRef.current += e.deltaY;
    lastScrollTimeRef.current = now;

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Check if threshold is reached
    if (Math.abs(accumulatedDeltaRef.current) >= SCROLL_THRESHOLD) {
      const direction = accumulatedDeltaRef.current > 0 ? 1 : -1;
      const nextScene = currentScene + direction;

      // Validate bounds
      if (nextScene >= 0 && nextScene < TOTAL_SCENES) {
        // Immediately reset accumulator and block input for this transition
        // This ensures only ONE transition happens per scroll gesture
        accumulatedDeltaRef.current = 0;
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
          scrollTimeoutRef.current = null;
        }

        // Trigger navigation (will set isTransitioning and animation blocking)
        if (direction > 0) {
          navigateNext();
        } else {
          navigatePrev();
        }
      } else {
        // Out of bounds - just reset accumulator
        accumulatedDeltaRef.current = 0;
      }

      e.preventDefault();
    } else {
      // Set timeout to reset accumulator after inactivity
      scrollTimeoutRef.current = setTimeout(() => {
        accumulatedDeltaRef.current = 0;
      }, SCROLL_RESET_TIME);
    }
  }, [isTransitioning, currentScene, navigateNext, navigatePrev]);

  /**
   * Keyboard navigation handler
   * Also respects animation blocking period
   */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Check if we're in animation blocking period
    const now = Date.now();
    if (animationBlockUntilRef.current > now) {
      e.preventDefault();
      return; // Block keyboard input during animation
    }

    if (isTransitioning) {
      e.preventDefault();
      return;
    }

    // ArrowDown / PageDown / s / S -> Next Scene
    if (["ArrowDown", "PageDown", "s", "S"].includes(e.key)) {
      e.preventDefault();
      navigateNext();
    }
    // ArrowUp / PageUp / w / W -> Previous Scene
    else if (["ArrowUp", "PageUp", "w", "W"].includes(e.key)) {
      e.preventDefault();
      navigatePrev();
    }
  }, [isTransitioning, navigateNext, navigatePrev]);

  /**
   * Touch navigation handler
   */
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
    touchStartXRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback(() => {
    // Optional: prevent default if we want to block native scrolling completely
    // but usually better to let native scroll happen and just detect swipe
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!scrollEnabledRef.current || isTransitioning || touchStartYRef.current === null || touchStartXRef.current === null) {
      return;
    }

    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;

    const deltaY = touchStartYRef.current - touchEndY;
    const deltaX = touchStartXRef.current - touchEndX;

    // Check if swipe is vertical dominant
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (Math.abs(deltaY) > TOUCH_THRESHOLD) {
        if (deltaY > 0) {
          // Swipe Up -> Next Scene
          navigateNext();
        } else {
          // Swipe Down -> Prev Scene
          navigatePrev();
        }
      }
    }

    // Reset
    touchStartYRef.current = null;
    touchStartXRef.current = null;
  }, [isTransitioning, navigateNext, navigatePrev]);

  /**
   * Register global event listeners
   */
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
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
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

