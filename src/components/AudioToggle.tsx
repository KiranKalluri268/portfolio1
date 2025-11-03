'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

const AudioToggle = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(true);
  const [isIndicatorActive, setIsIndicatorActive] = useState(true);

  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  useEffect(() => {
    if (!audioElementRef.current) return;
    if (isAudioPlaying) {
      audioElementRef.current.play().catch((err) => console.error("Audio error:", err));
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

  return (
    <button
      onClick={toggleAudioIndicator}
      className="ml-6 flex items-center space-x-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1"
      aria-label={isAudioPlaying ? "Pause audio playback" : "Play audio playback"}
      aria-pressed={isAudioPlaying}
      type="button"
    >
      <audio
        ref={audioElementRef}
        className="hidden"
        src="/audio/final.mp3"
        loop
      />
      {[1, 2, 3, 4].map((bar) => (
        <div
          key={bar}
          className={clsx("indicator-line", {
            active: isIndicatorActive,
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
