"use client";
/* eslint-disable */
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import ScrollReveal from "@/components/ui/ScrollReveal";
import PopularSection from "@/components/layout/PopularSection";
import ExperienceSection from "@/components/layout/ExperienceSection";
import CommunitySection from "@/components/layout/CommunitySection";

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Hero Section */}
      <main className="h-screen flex flex-col items-center justify-between bg-background text-foreground relative overflow-hidden font-inter transition-colors">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-aurora opacity-40 animate-pulse pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none z-0" />

        {/* Hero Content */}
        <div className="container relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-20">

          <ScrollReveal delay={0.1} blur="8px" yOffset={20}>
            <h2 className="text-sm md:text-base text-accent font-black uppercase tracking-[0.4em] mb-4">
              The Future of Apparel
            </h2>
          </ScrollReveal>

          <div className="relative mb-6">
            <ScrollReveal delay={0.2} blur="20px" yOffset={60} duration={1}>
              <h1 className="text-5xl md:text-7xl lg:text-[8rem] font-bold tracking-tighter font-outfit leading-[0.9] flex flex-col items-center">
                <div className="mb-4">
                  <img src="/logo-black.png" alt="Beyondtee" className="h-12 md:h-16 lg:h-20 w-auto block dark:hidden" />
                  <img src="/logo-white.png" alt="Beyondtee" className="h-12 md:h-16 lg:h-20 w-auto hidden dark:block" />
                </div>
                <span>
                  BEYOND<span className="text-accent tracking-tighter">TEE</span>
                </span>
              </h1>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.6} blur="10px" className="max-w-2xl mb-16">
            <p className="text-lg md:text-2xl text-muted font-medium leading-relaxed">
              Design your reality. Wear your imagination. <br className="hidden md:block" />
              Premium, sustainable, and uniquely yours.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.9} blur="0px" yOffset={10} className="flex flex-col md:flex-row gap-6 items-center">
            <Link href="/customize" className="group relative btn-primary overflow-hidden flex items-center gap-3 px-10 py-5">
              <span className="relative z-10 font-bold uppercase tracking-widest text-xs">Start Creating</span>
              <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </Link>

            <Link href="/shop" className="group px-10 py-5 rounded-md border border-border hover:border-accent hover:text-accent hover:bg-accent/5 transition-all flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
              Shop Collections
            </Link>
          </ScrollReveal>
        </div>

        {/* Footer / Status */}
        <ScrollReveal delay={1.2} blur="4px" yOffset={0} className="w-full flex justify-center items-center gap-2 text-[8px] text-muted font-black uppercase tracking-[0.4em] z-20 pb-4">
          <span className="opacity-50">System Status</span>
          <div className="flex items-center gap-2">
            <span className="text-accent">Active</span>
            <span className="w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_10px_rgba(204,255,0,0.8)] animate-pulse" />
          </div>
        </ScrollReveal>
      </main>

      {/* Additional Sections */}
      <PopularSection />
      <ExperienceSection />
      <CommunitySection />
    </div>
  );
}
