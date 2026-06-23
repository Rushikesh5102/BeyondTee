/* eslint-disable */
"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-foreground/10 transition-colors text-muted hover:text-foreground active:scale-95"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? <Sun className="w-5 h-5 shadow-[0_0_10px_rgba(255,255,255,0.2)]" /> : <Moon className="w-5 h-5" />}
        </button>
    );
}
