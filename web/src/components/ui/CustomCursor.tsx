"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });

            const target = e.target as HTMLElement;
            const isClickable = target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') !== null ||
                target.closest('button') !== null ||
                getComputedStyle(target).cursor === 'pointer';

            setIsHovering(isClickable);
        };

        const handleMouseDown = () => setIsMouseDown(true);
        const handleMouseUp = () => setIsMouseDown(false);

        window.addEventListener("mousemove", updateMousePosition);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    // Hide on devices that don't support hover (touch devices)
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
        return null;
    }

    return (
        <motion.div
            className="fixed top-0 left-0 w-6 h-6 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
            animate={{
                x: mousePosition.x - 12, // Center the 24px (w-6) dot
                y: mousePosition.y - 12,
                scale: isMouseDown ? 0.8 : isHovering ? 2.5 : 1,
            }}
            transition={{
                type: "spring",
                damping: 25,     // Fluid drag
                stiffness: 150,  // Responsiveness
                mass: 0.5        // Weight of the cursor
            }}
        />
    );
}
