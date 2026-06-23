import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: ["class"],
    theme: {
        extend: {
            colors: {
                background: "var(--bg-primary)",
                "bg-secondary": "var(--bg-secondary)",
                foreground: "var(--text-primary)",
                muted: "var(--text-secondary)",
                accent: "var(--accent-secondary)",
                border: "var(--border-color)",
                glass: "var(--glass-bg)",
            },
            fontFamily: {
                outfit: ["var(--font-outfit)", "sans-serif"],
                inter: ["var(--font-inter)", "sans-serif"],
            },
        },
    },
    plugins: [],
};
export default config;
