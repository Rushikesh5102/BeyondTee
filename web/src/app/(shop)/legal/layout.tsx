
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background text-foreground pt-24 pb-12 font-inter transition-colors">
            <div className="container max-w-4xl mx-auto px-6">
                <div className="mb-8">
                    <Link href="/" className="text-muted hover:text-foreground flex items-center gap-2 text-sm transition-colors">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                </div>
                <div className="grid md:grid-cols-[200px_1fr] gap-12">
                    <aside className="space-y-4">
                        <h3 className="font-bold text-muted uppercase tracking-widest text-xs mb-4">Legal</h3>
                        <nav className="flex flex-col gap-2">
                            <Link href="/legal/terms" className="text-sm hover:text-accent transition-colors">Terms of Service</Link>
                            <Link href="/legal/privacy" className="text-sm hover:text-accent transition-colors">Privacy Policy</Link>
                            <Link href="/legal/shipping" className="text-sm hover:text-accent transition-colors">Shipping & Returns</Link>
                        </nav>
                    </aside>
                    <main className="prose dark:prose-invert prose-zinc max-w-none text-foreground">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
