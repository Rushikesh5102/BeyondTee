"use client";
/* eslint-disable */


import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { clsx } from "clsx";

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    blur?: string;    // e.g., "10px"
    yOffset?: number; // e.g., 50
    threshold?: number;
    once?: boolean;
}

export default function ScrollReveal({
    children,
    className,
    delay = 0,
    duration = 0.8,
    blur = "12px",
    yOffset = 40,
    threshold = 0.1,
    once = true,
}: ScrollRevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { amount: threshold, once });

    const variants = {
        hidden: {
            opacity: 0,
            y: yOffset,
            filter: `blur(${blur})`
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration: duration,
                delay: delay,
                 
                ease: "easeOut" as any,
            }
        },
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
            className={clsx(className)}
        >
            {children}
        </motion.div>
    );
}
