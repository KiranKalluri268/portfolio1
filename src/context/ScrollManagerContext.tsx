// context/ScrollManagerContext.tsx
"use client";

import { createContext, useContext, useState } from "react";

type ScrollManagerContextType = {
  currentSectionIndex: number;
  setCurrentSectionIndex: (index: number) => void;
};

const ScrollManagerContext = createContext<ScrollManagerContextType | undefined>(undefined);

export const ScrollManagerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  return (
    <ScrollManagerContext.Provider value={{ currentSectionIndex, setCurrentSectionIndex }}>
      {children}
    </ScrollManagerContext.Provider>
  );
};

export const useScrollManager = () => {
  const context = useContext(ScrollManagerContext);
  if (!context) throw new Error("useScrollManager must be used within ScrollManagerProvider");
  return context;
};
