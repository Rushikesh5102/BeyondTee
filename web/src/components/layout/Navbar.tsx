"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, User, Menu } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useState, useEffect } from "react";
import { clsx } from "clsx";
import ThemeToggle from "./ThemeToggle";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const { items } = useCartStore();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Men", href: "/shop?category=Men" },
        { name: "Women", href: "/shop?category=Women" },
        { name: "Hoodies", href: "/shop?category=Hoodies" },
        { name: "Customize", href: "/customize" },
        { name: "Track Order", href: "/track" },
    ];

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={clsx(
                "fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 px-6 py-4",
                scrolled ? "pt-4" : "pt-6"
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo - Icon + Text */}
                <Link
                    href="/"
                    className={clsx(
                        "relative z-50 flex items-center gap-3 group transition-all duration-300",
                        pathname === "/" ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"
                    )}
                >
                    <img src="/logo.png?v=2" alt="Beyondtee" className="h-10 w-auto invert dark:invert-0" />
                    <span className="text-2xl md:text-3xl font-bold font-outfit tracking-tighter text-foreground">
                        BEYOND<span className="text-muted">TEE</span>
                    </span>
                </Link>

                <div
                    className={clsx(
                        "rounded-full flex items-center gap-8 px-6 py-2 transition-all duration-500",
                        scrolled
                            ? "bg-glass backdrop-blur-xl border border-border/50 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                            : "bg-transparent border border-transparent"
                    )}
                >
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={clsx(
                                    "text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:text-accent relative group",
                                    pathname === link.href ? "text-foreground" : "text-muted"
                                )}
                            >
                                {link.name}
                                <span className={clsx(
                                    "absolute -bottom-1 left-0 w-full h-0.5 bg-accent transform origin-left transition-transform duration-300",
                                    pathname === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                )} />
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        <Link href="/cart" className="relative group p-2 hover:bg-foreground/5 rounded-full transition-all">
                            <ShoppingBag className="w-5 h-5 text-muted group-hover:text-foreground group-hover:scale-110 transition-all" />
                            {items.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-[9px] font-black text-black flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(204,255,0,0.5)]">
                                    {items.length}
                                </span>
                            )}
                        </Link>

                        <Link href={session ? "/profile" : "/auth/signin"} className="p-2 hover:bg-foreground/5 rounded-full transition-all hidden md:block group">
                            <User className={clsx("w-5 h-5 transition-all", session ? "text-accent" : "text-muted group-hover:text-foreground group-hover:scale-110")} />
                        </Link>

                        {session && (
                            <button
                                onClick={() => signOut()}
                                className="hidden md:block text-[9px] font-black uppercase tracking-[0.2em] text-muted hover:text-accent transition-all active:scale-95"
                            >
                                Logout
                            </button>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 hover:bg-foreground/5 rounded-full text-foreground transition-all"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-6 right-6 mt-2 bg-background/90 backdrop-blur-xl border border-border rounded-2xl p-6 flex flex-col gap-4 md:hidden">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-lg font-medium text-muted hover:text-foreground transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link href={session ? "/profile" : "/auth/signin"} className="text-lg font-medium text-muted hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>
                        {session ? "Profile" : "Sign In"}
                    </Link>
                    {session && (
                        <button
                            onClick={() => {
                                signOut();
                                setMobileMenuOpen(false);
                            }}
                            className="text-lg font-black text-red-500 text-left hover:text-red-400 Transition-all"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
        </motion.header>
    );
}
