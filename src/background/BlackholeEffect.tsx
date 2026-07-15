"use client";
import { useRef, useEffect } from "react";

export default function Blackhole() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleVisibility = () => {
      const video = videoRef.current;
      if (!video) return;
      if (document.hidden) video.pause();
      else video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="fixed top-3/4 left-1/2 -z-10 aspect-square w-[min(220vw,52.5rem)] -translate-x-1/2 -translate-y-1/2 transform object-contain [transform-style:preserve-3d] sm:top-1/2 sm:left-[80%] sm:w-[52.5rem]"
        style={{
          background: 'transparent',
          transform: 'rotateX(0deg) rotateY(0deg) rotateZ(-20deg)',
        }}
      >
        <source src="/images/optimized_safari.mov" type="video/quicktime" />
        <source src="/images/optimized.webm" type="video/webm" />
        Your browser does not support transparent video.
      </video>
    </div>
  );
}
