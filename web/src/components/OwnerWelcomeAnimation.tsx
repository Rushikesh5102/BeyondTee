"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export function OwnerWelcomeAnimation() {
    const { data: session, status } = useSession();
    const [showAnimation, setShowAnimation] = useState(false);

    useEffect(() => {
        // Check if user is authenticated and is the owner
        const ownerEmail = "Pattiwarrushikesh5102@gmail.com";
        const isOwner = status === "authenticated" &&
            (session?.user?.email === ownerEmail ||
                (session?.user as any).role === "ADMIN");

        if (isOwner) {
            setShowAnimation(true);
        }
    }, [status, session]);

    useEffect(() => {
        if (showAnimation) {
            // Auto-hide animation after 6 seconds as a fallback
            const timer = setTimeout(() => {
                setShowAnimation(false);
            }, 6000); // 6s fallback

            return () => clearTimeout(timer);
        }
    }, [showAnimation]);

    const dismiss = () => setShowAnimation(false);

    return (
        <AnimatePresence>
            {showAnimation && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8 } }}
                    onClick={dismiss}
                    className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-md cursor-pointer"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />

                    <motion.div
                        initial={{ scale: 0.8, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 20,
                            delay: 0.2
                        }}
                        className="relative z-10 flex flex-col items-center text-center"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", duration: 1.5, bounce: 0.5 }}
                            className="bg-white text-black p-4 rounded-full mb-8 shadow-[0_0_50px_rgba(255,255,255,0.3)]"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="text-5xl md:text-7xl font-black font-outfit uppercase tracking-tighter text-white mb-4"
                        >
                            Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 to-white">Owner</span>
                        </motion.h1>

                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 1.2, duration: 0.8, ease: "easeInOut" }}
                            className="h-px bg-gradient-to-r from-transparent via-white to-transparent w-full mb-6"
                        />

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                            className="text-zinc-500 font-mono text-sm uppercase tracking-[0.3em]"
                        >
                            Beyondtee Central Intelligence System Initialized
                        </motion.p>
                    </motion.div>

                    <div className="absolute bottom-12 text-white/30 font-mono text-[8px] uppercase tracking-[0.5em] animate-pulse">
                        Click anywhere to dismiss
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
