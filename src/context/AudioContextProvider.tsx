"use client";
import React, { createContext, useContext, useState } from "react";

interface AudioContextValue {
  audioEnabled: boolean;
  hasEntered: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  enterPortfolio: () => void;
}

const AudioContext = createContext<AudioContextValue>({
  audioEnabled: false,
  hasEntered: false,
  setAudioEnabled: () => {},
  enterPortfolio: () => {},
});

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  const enterPortfolio = () => {
    setHasEntered(true);
    setAudioEnabled(true);
  };

  return (
    <AudioContext.Provider value={{ audioEnabled, hasEntered, setAudioEnabled, enterPortfolio }}>
      {children}
    </AudioContext.Provider>
  );
};
