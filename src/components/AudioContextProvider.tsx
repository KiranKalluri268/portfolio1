"use client";
import React, { createContext, useContext, useState } from "react";

const AudioContext = createContext({
  audioEnabled: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setAudioEnabled: (_: boolean) => {},
});

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [audioEnabled, setAudioEnabled] = useState(false);

  return (
    <AudioContext.Provider value={{ audioEnabled, setAudioEnabled }}>
      {children}
    </AudioContext.Provider>
  );
};
