"use client";

import { motion } from "framer-motion";

export const Skeleton = ({ className }: { className?: string }) => {
    return (
        <motion.div
            animate={{
                opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            className={`bg-zinc-800 rounded-lg ${className}`}
        />
    );
};

export const ProductSkeleton = () => {
    return (
        <div className="space-y-4">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/4" />
            </div>
        </div>
    );
};

export const CartSkeleton = () => {
    return (
        <div className="flex gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl items-center">
            <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/5" />
            </div>
            <Skeleton className="w-10 h-10 rounded-lg" />
        </div>
    );
};
