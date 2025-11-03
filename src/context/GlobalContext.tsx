// context/GlobalContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUnifiedScroll } from "./UnifiedScrollManager";

type GlobalContextType = {
  currentScene: number;
  setCurrentScene: React.Dispatch<React.SetStateAction<number>>; // Deprecated - use navigateToScene from UnifiedScrollManager
  prevScene: number;
  setPrevScene: React.Dispatch<React.SetStateAction<number>>;
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  // Sync with UnifiedScrollManager
  const { currentScene: unifiedScene, isTransitioning, navigateToScene } = useUnifiedScroll();
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [prevScene, setPrevScene] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sync currentScene with UnifiedScrollManager
  useEffect(() => {
    if (unifiedScene !== currentScene) {
      setPrevScene(currentScene);
      setCurrentScene(unifiedScene);
    }
  }, [unifiedScene, currentScene]);

  // Sync isAnimating with UnifiedScrollManager's isTransitioning
  useEffect(() => {
    setIsAnimating(isTransitioning);
  }, [isTransitioning]);

  // Wrapper for setCurrentScene that routes through UnifiedScrollManager
  // This maintains backward compatibility during migration
  const setCurrentSceneWithUnified = (value: number | ((prev: number) => number)) => {
    const target = typeof value === 'function' ? value(currentScene) : value;
    navigateToScene(target);
  };

  return (
    <GlobalContext.Provider
      value={{ 
        currentScene, 
        setCurrentScene: setCurrentSceneWithUnified, 
        isAnimating, 
        setIsAnimating, 
        prevScene, 
        setPrevScene
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
}
