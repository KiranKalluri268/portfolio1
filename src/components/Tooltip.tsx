"use client";

import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { useEffect } from "react";

interface TooltipProps {
    text: string;
    isVisible: boolean;
}

export default function Tooltip({ text, isVisible }: TooltipProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const updateMouse = (e: MouseEvent) => {
            mouseX.set(e.clientX + 20); // Offset to not cover cursor
            mouseY.set(e.clientY + 20);
        };
        window.addEventListener("mousemove", updateMouse);
        return () => window.removeEventListener("mousemove", updateMouse);
    }, [mouseX, mouseY]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    style={{
                        position: "fixed",
                        left: -20,
                        top: 10,
                        x: mouseX,
                        y: mouseY,
                        pointerEvents: "none",
                        zIndex: 9999, // Ensure it's on top of everything
                    }}
                    className="whitespace-nowrap text-white text-sm font-semibold tracking-wide bg-black/40 px-2 py-1 rounded-md backdrop-blur-md border border-white/10"
                >
                    {text}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
