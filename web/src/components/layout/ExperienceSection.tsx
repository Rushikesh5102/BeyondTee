"use client";
/* eslint-disable */

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function ExperienceSection() {
    return (
        <section className="py-24 bg-background transition-colors relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <ScrollReveal
                        delay={0.2}
                        yOffset={50}
                        blur="10px"
                        className="flex-1"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-bg-secondary rounded-full border border-border mb-8">
                            <Sparkles className="w-4 h-4 text-accent" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Next-Gen Customization</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold font-outfit uppercase tracking-tighter mb-8 leading-none">
                            Your Mind. <br /> <span className="text-muted">Our Canvas.</span>
                        </h2>
                        <p className="text-lg text-muted mb-10 max-w-xl font-medium leading-relaxed">
                            Step into the Beyondtee Studio. Our real-time 3D engine allows you to manipulate layers, upload artwork, and see your creation from every angle before it even touches the press.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link href="/customize" className="btn-primary px-10 py-5 flex items-center justify-center">
                                Open Studio
                            </Link>
                            <Link href="/about" className="px-10 py-5 rounded-md border border-border hover:bg-foreground/5 flex items-center justify-center font-bold uppercase tracking-widest text-xs transition-all">
                                How it works
                            </Link>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal
                        delay={0.4}
                        yOffset={0}
                        blur="20px"
                        className="flex-1 relative"
                    >
                        <div className="aspect-square bg-bg-secondary rounded-[40px] border border-border overflow-hidden relative shadow-2xl group">
                            <img
                                src="https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop"
                                alt="Studio Preview"
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                            />
                            {/* Mock UI Overlay */}
                            <div className="absolute top-6 left-6 p-4 bg-background/60 backdrop-blur-md rounded-2xl border border-border pointer-events-none">
                                <div className="flex gap-2 mb-3">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                </div>
                                <div className="space-y-2">
                                    <div className="w-32 h-2 bg-accent/20 rounded-full" />
                                    <div className="w-24 h-2 bg-muted/20 rounded-full" />
                                </div>
                            </div>

                            <div className="absolute bottom-6 right-6 p-4 bg-accent text-black rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg animate-bounce">
                                Live Interactive 3D
                            </div>
                        </div>
                        {/* Decorative background shadow */}
                        <div className="absolute -z-10 -bottom-10 -right-10 w-full h-full bg-accent/10 rounded-[40px] blur-3xl" />
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
