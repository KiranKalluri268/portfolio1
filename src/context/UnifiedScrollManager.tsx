"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from "react";

// Constants for scroll behavior
const SCROLL_THRESHOLD = 100; // Accumulated delta needed to trigger transition
const SCROLL_RESET_TIME = 150; // Reset accumulator after this many ms of inactivity
const TRANSITION_DURATION = 500; // Milliseconds for each scene transition
const TOTAL_SCENES = 5; // 0-4 scenes

interface UnifiedScrollManagerType {
  currentScene: number;
  targetScene: number;
  isTransitioning: boolean;
  navigateToScene: (target: number) => void;
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
  
  // Navigation guards: Map<sceneNumber, guardFunction>
  // Guard function takes direction ("forward" | "backward") and returns false to block, true to allow
  const navigationGuardsRef = useRef<Map<number, (direction: "forward" | "backward") => boolean>>(new Map());
  
  // Carousel advance callbacks: Map<sceneNumber, advanceFunction>
  // Advance function takes direction and advances internal carousel state
  // Returns Promise that resolves when advance animation completes
  const carouselAdvanceRef = useRef<Map<number, (direction: "forward" | "backward") => Promise<void>>>(new Map());

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
   */
  const navigateToScene = useCallback((target: number) => {
    // Validate target
    if (target < 0 || target >= TOTAL_SCENES) return;
    
    // If already transitioning, ignore
    if (isTransitioning && target === targetScene) return;
    
    // If already at target, ignore
    if (!isTransitioning && target === currentScene) return;
    
    // Build the path
    const path = buildPath(currentScene, target);
    
    if (path.length === 0) return;
    
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
      // Guard allows - proceed with transition
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
      // Wait for state to update
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Recursively retry
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
      
      // No guard blocking - proceed with transition after transition duration
      const transitionTimer = setTimeout(() => {
        setCurrentScene(nextScene);
        setTransitionQueue(prev => prev.slice(1));
        
        if (transitionQueue.length === 1) {
          setIsTransitioning(false);
        }
      }, TRANSITION_DURATION);
      
      return transitionTimer;
    };

    // Always wait a small amount to give components time to register guards/callbacks
    // This is especially important when entering a scene from outside
    const registrationTimer = setTimeout(() => {
      const transitionTimer = checkAndTransition();
      // Store timer for cleanup if needed (though attemptTransitionWithAutoAdvance handles its own timing)
      if (!transitionTimer) {
        // Guard blocked - auto-advance will handle timing
      }
    }, 150); // Give components time to mount and register
    
    return () => clearTimeout(registrationTimer);
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
   */
  const handleScroll = useCallback((e: WheelEvent) => {
    // If scroll is disabled by a component (e.g., projects carousel), let it through
    if (!scrollEnabledRef.current) {
      return; // Don't prevent default, let component handle it
    }

    // If currently transitioning, prevent default and ignore
    if (isTransitioning) {
      e.preventDefault();
      return;
    }

    const now = Date.now();
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
        if (direction > 0) {
          navigateNext();
        } else {
          navigatePrev();
        }
      }

      // Reset accumulator
      accumulatedDeltaRef.current = 0;
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
   */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isTransitioning) {
      e.preventDefault();
      return;
    }

    if (["ArrowDown", "PageDown"].includes(e.key)) {
      e.preventDefault();
      navigateNext();
    } else if (["ArrowUp", "PageUp"].includes(e.key)) {
      e.preventDefault();
      navigatePrev();
    }
  }, [isTransitioning, navigateNext, navigatePrev]);

  /**
   * Register global event listeners
   */
  useEffect(() => {
    window.addEventListener("wheel", handleScroll, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll, handleKeyDown]);

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

