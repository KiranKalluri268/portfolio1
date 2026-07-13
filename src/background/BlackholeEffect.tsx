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
        src="/images/blackhole.webm"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="fixed top-3/4 left-1/2 sm:top-1/2 sm:left-[80%] w-210 h-210 object-contain -z-10 transform -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]"
        style={{
          transform: 'rotateX(0deg) rotateY(0deg) rotateZ(-20deg)',
        }}
      />
    </div>
  );
}
