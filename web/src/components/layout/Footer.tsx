/* eslint-disable */
import Link from 'next/link';
import { Instagram, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-background border-t border-border text-muted py-24 transition-colors">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3 mb-2 group">
                            <img src="/logo-black.png" alt="Beyondtee" className="h-10 w-auto block dark:hidden opacity-80 group-hover:opacity-100 transition-all" />
                            <img src="/logo-white.png" alt="Beyondtee" className="h-10 w-auto hidden dark:block opacity-80 group-hover:opacity-100 transition-all" />
                            <span className="text-2xl font-bold font-outfit text-foreground tracking-tighter">
                                BEYOND<span className="text-muted">TEE</span>
                            </span>
                        </Link>
                        <p className="text-xs font-medium leading-relaxed max-w-xs uppercase tracking-widest opacity-60">
                            The future of customized apparel. Design your reality, wear your imagination. <br />
                            <span className="text-accent mt-2 block">Powered by High-End Technology.</span>
                        </p>
                    </div>

                    <div>
                        <h3 className="text-foreground font-black mb-8 uppercase tracking-[0.3em] text-[10px]">Studio</h3>
                        <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest">
                            <li><Link href="/shop?category=Men" className="hover:text-accent transition-colors">Men's Apparel</Link></li>
                            <li><Link href="/shop?category=Women" className="hover:text-accent transition-colors">Women's Apparel</Link></li>
                            <li><Link href="/shop?category=Hoodies" className="hover:text-accent transition-colors">Hoodies</Link></li>
                            <li><Link href="/customize" className="hover:text-accent transition-colors">Customizer</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-foreground font-black mb-8 uppercase tracking-[0.3em] text-[10px]">Support</h3>
                        <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest">
                            <li><Link href="/about" className="hover:text-accent transition-colors">Our Story (About Us)</Link></li>
                            <li><Link href="/contact" className="hover:text-accent transition-colors">Contact & Feedback</Link></li>
                            <li><Link href="/legal/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
                            <li><Link href="/legal/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/legal/shipping" className="hover:text-accent transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="/track" className="hover:text-accent transition-colors">Track Your Order</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-foreground font-black mb-8 uppercase tracking-[0.3em] text-[10px]">Society</h3>
                        <div className="flex gap-6">
                            <a href="https://share.google/jLAreOkjY5pVkwr9k" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-all hover:scale-110"><Instagram className="w-5 h-5" /></a>
                            <a href="mailto:info@beyondtee.in" className="text-muted hover:text-accent transition-all hover:scale-110"><Mail className="w-5 h-5" /></a>
                        </div>
                        <div className="mt-8">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-2">Join the Collective</p>
                            <div className="flex bg-bg-secondary border border-border rounded-full p-1 pl-4">
                                <input type="email" placeholder="ENCRYPTED EMAIL" className="bg-transparent text-[10px] font-bold outline-none flex-1 uppercase" />
                                <button className="bg-foreground text-background text-[9px] font-black uppercase px-4 py-2 rounded-full hover:bg-accent hover:text-black transition-colors">Join</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border/50 pt-12 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted/50">
                    <p>&copy; 2025 Beyondtee. Digital Architecture by Beyond Studio.</p>
                    <div className="mt-6 md:mt-0 flex gap-8">
                        <span className="flex items-center gap-2"><div className="w-1 h-1 bg-accent rounded-full" /> Secure Payment</span>
                        <span className="flex items-center gap-2"><div className="w-1 h-1 bg-accent rounded-full" /> Global Logistics</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
