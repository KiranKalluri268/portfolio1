"use client";

import { useEffect, useState } from "react";
import Tooltip from "./Tooltip";
import { SECTION_IDS, useSmoothScroll } from "@/context/SmoothScrollContext";

export default function NavigationControls() {
    const { activeSection, scrollNext, scrollPrev } = useSmoothScroll();
    const activeIndex = SECTION_IDS.indexOf(activeSection);
    const [mounted, setMounted] = useState(false);
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Track physical key presses
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent default scrolling for arrow keys if needed, but here we just visualize
            let key = e.key;

            // Map WASD to Arrow keys
            if (key === "w" || key === "W") key = "ArrowUp";
            if (key === "s" || key === "S") key = "ArrowDown";
            if (key === "a" || key === "A") key = "ArrowLeft";
            if (key === "d" || key === "D") key = "ArrowRight";

            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
                setPressedKeys((prev) => new Set(prev).add(key));
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            let key = e.key;

            // Map WASD to Arrow keys
            if (key === "w" || key === "W") key = "ArrowUp";
            if (key === "s" || key === "S") key = "ArrowDown";
            if (key === "a" || key === "A") key = "ArrowLeft";
            if (key === "d" || key === "D") key = "ArrowRight";

            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
                setPressedKeys((prev) => {
                    const next = new Set(prev);
                    next.delete(key);
                    return next;
                });
            }
        };

        window.addEventListener("keydown", handleKeyDown, { capture: true });
        window.addEventListener("keyup", handleKeyUp, { capture: true });
        return () => {
            window.removeEventListener("keydown", handleKeyDown, { capture: true });
            window.removeEventListener("keyup", handleKeyUp, { capture: true });
        };
    }, []);

    // Define allowed keys per scene
    const isUpEnabled = activeIndex > 0;
    const isDownEnabled = activeIndex < SECTION_IDS.length - 1;

    // Left/Right only fully enabled in Projects (Scene 1)
    // In other scenes, we disable them to avoid confusion, or map them to Up/Down?
    // Requirements: "Ex: on Hero only arrow-down works, In projects all four arrows work, in other section up&down works"
    const isLeftEnabled = activeSection === "projects";
    const isRightEnabled = activeSection === "projects";

    const handlePress = (key: string) => {
        const forward = key === "ArrowDown" || key === "ArrowRight";
        if (activeSection === "projects") {
            window.scrollBy({ top: (forward ? 1 : -1) * window.innerHeight, behavior: "smooth" });
        } else if (key === "ArrowDown") {
            scrollNext();
        } else if (key === "ArrowUp") {
            scrollPrev();
        }

        // Dispatch a global keydown event
        // Dispatch key events to preserve the pressed-key visual feedback.
        window.dispatchEvent(
            new KeyboardEvent("keydown", {
                key: key,
                code: key,
                bubbles: true,
                cancelable: true,
                view: window,
            })
        );

        // Dispatch keyup after a short delay to simulate a tap and clear the highlight
        setTimeout(() => {
            window.dispatchEvent(
                new KeyboardEvent("keyup", {
                    key: key,
                    code: key,
                    bubbles: true,
                    cancelable: true,
                    view: window,
                })
            );
        }, 150);
    };

    if (!mounted) return null;

    return (
        <>
            <div
                className="animate-delayed-fade fixed bottom-8 right-8 w-[180px] h-[90px] z-50 hidden sm:block"
            >
                {/* Up */}
                <ArrowButton
                    direction="ArrowUp"
                    enabled={isUpEnabled}
                    iconPath="M5 10l7-7m0 0l7 7m-7-7v18"
                    className="top-0 left-1/2 -translate-x-1/2" // Top center
                    isPressed={pressedKeys.has("ArrowUp")}
                    onPress={handlePress}
                    onMouseEnter={() => setHoveredButton("Up/Previous")}
                    onMouseLeave={() => setHoveredButton(null)}
                />

                {/* Left */}
                <ArrowButton
                    direction="ArrowLeft"
                    enabled={isLeftEnabled}
                    iconPath="M10 19l-7-7m0 0l7-7m-7 7h18"
                    className="bottom-0 left-0" // Bottom left
                    isPressed={pressedKeys.has("ArrowLeft")}
                    onPress={handlePress}
                    onMouseEnter={() => setHoveredButton("Left/Previous")}
                    onMouseLeave={() => setHoveredButton(null)}
                />

                {/* Down */}
                <ArrowButton
                    direction="ArrowDown"
                    enabled={isDownEnabled}
                    iconPath="M19 14l-7 7m0 0l-7-7m7 7V3"
                    className="bottom-0 left-1/2 -translate-x-1/2" // Bottom center
                    isPressed={pressedKeys.has("ArrowDown")}
                    onPress={handlePress}
                    onMouseEnter={() => setHoveredButton("Down/Next")}
                    onMouseLeave={() => setHoveredButton(null)}
                />

                {/* Right */}
                <ArrowButton
                    direction="ArrowRight"
                    enabled={isRightEnabled}
                    iconPath="M14 5l7 7m0 0l-7 7m7-7H3"
                    className="bottom-0 right-0" // Bottom right
                    isPressed={pressedKeys.has("ArrowRight")}
                    onPress={handlePress}
                    onMouseEnter={() => setHoveredButton("Right/Next")}
                    onMouseLeave={() => setHoveredButton(null)}
                />
            </div>
            <Tooltip text={hoveredButton || ""} isVisible={!!hoveredButton} />
        </>
    );
}

interface ArrowButtonProps {
    direction: string;
    enabled: boolean;
    iconPath: string;
    className?: string;
    isPressed: boolean;
    onPress: (direction: string) => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

const ArrowButton = ({
    direction,
    enabled,
    iconPath,
    className = "",
    isPressed,
    onPress,
    onMouseEnter,
    onMouseLeave,
}: ArrowButtonProps) => {
    return (
        <button
            className={`absolute w-14 h-10 backdrop-blur-md rounded-md flex items-center justify-center border transition-all duration-100 ${enabled
                ? "cursor-pointer pointer-events-auto"
                : "opacity-30 cursor-not-allowed pointer-events-none"
                } ${isPressed
                    ? "bg-white border-white shadow-[0_0_15px_rgba(255,255,255,0.8)] scale-90"
                    : "bg-white/20 border-white/30 shadow-lg hover:bg-white/30 active:bg-white/30"
                } ${className}`}
            onClick={() => enabled && onPress(direction)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            aria-label={`Navigate ${direction.replace("Arrow", "")}`}
            disabled={!enabled}
        >
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={iconPath}
                />
            </svg>
        </button>
    );
};
