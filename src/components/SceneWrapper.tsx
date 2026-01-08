"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import { useUnifiedScroll } from "@/context/UnifiedScrollManager";

interface SceneWrapperProps {
    children: ReactNode;
    index: number;
}

export default function SceneWrapper({ children, index }: SceneWrapperProps) {
    const { prevScene, currentScene } = useGlobalContext();
    const { unlockScroll } = useUnifiedScroll();

    // Determine direction based on history
    const isForward = prevScene < currentScene;

    // If this wrapper matches the current scene, we handle the ENTER animation
    // If this wrapper matches the prev scene (during exit), we handle the EXIT animation

    // Note: AnimatePresence in page.tsx will mount/unmount this component.
    // We rely on Framer Motion's initial/animate/exit props.

    return (
        <motion.div
            className="fixed inset-0 w-full h-full will-change-transform" // Enforce fixed positioning for slide-over effect
            initial={{
                // Enter from bottom if moving forward, from top if moving backward
                y: isForward ? "100%" : "-100%",
                zIndex: 10, // Active scene on top
            }}
            animate={{
                y: "0%",
                zIndex: 10,
            }}
            exit={{
                // Exit to top if moving forward, to bottom if moving backward
                y: isForward ? "-100%" : "100%",
                zIndex: 0, // Exiting scene below
                transition: {
                    duration: 0.8, // Slightly slower exit for parallax feel? Or sync?
                    ease: "easeInOut"
                }
            }}
            transition={{
                duration: 0.8,
                ease: [0.6, 0.05, -0.01, 0.9], // Custom bezier for premium feel
            }}
            onAnimationComplete={(definition) => {
                // Only unlock if we finished the "animate" phase (entering)
                // We checking if we are the current scene
                if (index === currentScene) {
                    console.log(`Scene ${index} animation complete. Unlocking scroll.`);
                    unlockScroll();
                }
            }}
        >
            {children}
        </motion.div>
    );
}
