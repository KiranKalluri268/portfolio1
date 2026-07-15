"use client";

import type { ReactNode } from "react";

interface SceneWrapperProps {
  children: ReactNode;
  index: number;
}

export default function SceneWrapper({ children, index }: SceneWrapperProps) {
  return (
    <div className="relative min-h-[100svh] w-full" data-scene={index}>
      {children}
    </div>
  );
}
