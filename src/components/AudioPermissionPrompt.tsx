"use client";
import { useEffect, useState } from "react";
import { useAudio } from "./AudioContextProvider";

export default function AudioPermissionPrompt() {
  const { audioEnabled, setAudioEnabled } = useAudio();
  const [visible, setVisible] = useState(!audioEnabled);

  const handleEnableAudio = () => {
    setAudioEnabled(true);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] backdrop-blur-md bg-black bg-opacity-60 flex flex-col items-center justify-center text-white p-6">
      <h2 className="text-2xl font-bold mb-4">Enter</h2>
      <button
        onClick={handleEnableAudio}
        className="text-4xl font-bold px-6 py-3 bg-white text-black rounded-full hover:bg-gray-200"
        aria-label="Enable Audio"
      >
        ▶️
      </button>
    </div>
  );
}
