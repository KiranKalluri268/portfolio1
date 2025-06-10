// src/context/ScrollContext.tsx
"use client";

import { createContext, useContext, useState } from "react";

type ScrollContextType = {
  isScrolling: boolean;
  isAnimating: boolean;
  setIsScrolling: (value: boolean) => void;
  setIsAnimating: (value: boolean) => void;
};

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <ScrollContext.Provider value={{ isScrolling, isAnimating, setIsScrolling, setIsAnimating }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScrollContext must be used within a ScrollProvider");
  }
  return context;
};
