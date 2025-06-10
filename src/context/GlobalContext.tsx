// context/GlobalContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type GlobalContextType = {
  currentScene: number;
  setCurrentScene: React.Dispatch<React.SetStateAction<number>>;
  prevScene: number;
  setPrevScene: React.Dispatch<React.SetStateAction<number>>;
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
  audioEnabled: boolean;
  setAudioEnabled: (audio: boolean) => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [prevScene, setPrevScene] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // ✅ Log values when they change
  useEffect(() => {
    console.log("▶ currentScene:", currentScene);
  }, [currentScene]);

  useEffect(() => {
    console.log("▶ isAnimating:", isAnimating);
  }, [isAnimating]);

  return (
    <GlobalContext.Provider
      value={{ currentScene, setCurrentScene, isAnimating, setIsAnimating, audioEnabled, setAudioEnabled ,prevScene, setPrevScene}}
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
