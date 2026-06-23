"use client";
/* eslint-disable */


import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Moon, Sun, LogOut } from "lucide-react";
import { OwnerWelcomeAnimation } from "@/components/OwnerWelcomeAnimation";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { signOut } from "next-auth/react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [systemStatus, setSystemStatus] = useState<'LOADING' | 'ACTIVE' | 'OFFLINE'>('LOADING');

    // Live System Check
    useEffect(() => {
        const checkStatus = async () => {
            try {
                // Fetch to products as a lightweight health check to the backend
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/products`, { method: 'GET' });
                if (res.ok) setSystemStatus('ACTIVE');
                else setSystemStatus('OFFLINE');
            } catch (error) {
                setSystemStatus('OFFLINE');
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        } else if (status === "authenticated" && (session?.user as any).role !== "ADMIN") {
            router.push("/");
        }
    }, [status, session, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-white" size={40} />
                <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.3em]">Authenticating Admin...</p>
            </div>
        );
    }

    if (!session || (session?.user as any).role !== "ADMIN") {
        return null; // Prevents flashing content while redirecting
    }

    return (
        <div className="flex min-h-screen bg-bg-secondary text-foreground transition-colors">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-background text-foreground p-6 fixed h-full z-50 shadow-xl border-r border-border transition-colors">
                <div className="flex items-center gap-2 mb-8 group">
                    <img src="/logo.png?v=2" alt="Beyondtee" className="h-6 w-auto invert dark:invert-0 opacity-80" />
                    <h2 className="text-xl font-bold tracking-tighter uppercase font-outfit">
                        BEYOND<span className="text-muted tracking-tighter">TEE</span>
                        <span className="text-accent text-[10px] uppercase align-top ml-1 font-mono tracking-normal">Admin</span>
                    </h2>
                </div>

                <nav className="flex flex-col gap-2 font-medium">
                    {[
                        { name: 'Dashboard', href: '/admin' },
                        { name: 'Inventory', href: '/admin/products' },
                        { name: 'Orders', href: '/admin/orders' },
                        { name: 'Marketing', href: '/admin/marketing' },
                        { name: 'Analytics', href: '/admin/analytics' },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${item.href === '/admin' ? 'bg-accent text-black shadow-lg shadow-accent/20' : 'text-muted hover:text-foreground hover:bg-foreground/5'}`}
                        >
                            {item.name}
                        </Link>
                    ))}

                    <div className="h-px bg-border my-8" />

                    <div className="px-4 py-2 flex items-center justify-between mb-4 bg-foreground/5 rounded-xl border border-border/50">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Appearance</span>
                        <ThemeToggle />
                    </div>

                    <Link href="/" className="px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-muted hover:text-accent hover:bg-accent/5 transition-all flex items-center justify-between group">
                        Storefront
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    </Link>

                    <button
                        onClick={() => signOut()}
                        className="w-full mt-4 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-red-500 hover:bg-red-500/5 transition-all flex items-center gap-3 group"
                    >
                        <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Log Out
                    </button>

                    {/* Live System Status */}
                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between px-4 py-3 bg-foreground/5 rounded-xl border border-border/50">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted">System</span>
                        <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-bold uppercase tracking-[0.1em] ${systemStatus === 'ACTIVE' ? 'text-green-500' : systemStatus === 'LOADING' ? 'text-yellow-500' : 'text-red-500'}`}>
                                {systemStatus}
                            </span>
                            <span className={`w-1.5 h-1.5 rounded-full ${systemStatus === 'ACTIVE' ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]' : systemStatus === 'LOADING' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`} />
                        </div>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="ml-64 w-full p-8">
                <div className="max-w-7xl mx-auto">
                    <OwnerWelcomeAnimation />
                    {children}
                </div>
            </main>
        </div>
    );
}
