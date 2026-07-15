'use client';

import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useAudio } from '@/context/AudioContextProvider';

const AudioToggle = () => {
  const { audioEnabled, setAudioEnabled } = useAudio();

  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudioIndicator = () => {
    setAudioEnabled(!audioEnabled);
  };

  useEffect(() => {
    if (!audioElementRef.current) return;
    if (audioEnabled) {
      audioElementRef.current.play().catch((err) => console.error("Audio error:", err));
    } else {
      audioElementRef.current.pause();
    }
  }, [audioEnabled]);

  return (
    <button
      onClick={toggleAudioIndicator}
      className="ml-6 flex items-center space-x-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1"
      aria-label={audioEnabled ? "Pause audio playback" : "Play audio playback"}
      aria-pressed={audioEnabled}
      type="button"
    >
      <audio
        ref={audioElementRef}
        className="hidden"
        src="/audio/final.mp3"
        loop
        preload="none"
      />
      {[1, 2, 3, 4].map((bar) => (
        <div
          key={bar}
          className={clsx("indicator-line", {
            active: audioEnabled,
          })}
          style={{
            animationDelay: `${bar * 0.1}s`,
          }}
          aria-hidden="true"
        />
      ))}
    </button>
  );
};

export default AudioToggle;
