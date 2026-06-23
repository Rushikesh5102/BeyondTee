"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground pt-24 font-inter transition-colors">
            {/* Hero Section */}
            <div className="container mx-auto px-6 mb-24 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-bold font-outfit mb-6 tracking-tight"
                >
                    WE ARE <span className="text-accent">BEYOND</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-muted max-w-2xl mx-auto"
                >
                    Redefining custom apparel through technology and self-expression.
                    We don't just sell clothes; we provide a canvas for your digital identity.
                </motion.p>
            </div>

            {/* Values Grid */}
            <div className="container mx-auto px-6 mb-24">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: "Innovation First", desc: "Born in the metaverse, tailored for reality. Our designs leverage 3D tech for perfect customization." },
                        { title: "Sustainable", desc: "Print-on-demand means zero waste. We only produce what you create." },
                        { title: "Premium Quality", desc: "Heavyweight cotton, precise stitching, and prints that last." }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-bg-secondary/50 border border-border p-8 rounded-2xl hover:border-accent transition-colors"
                        >
                            <h3 className="text-xl font-bold mb-4 font-outfit">{item.title}</h3>
                            <p className="text-muted">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Team / Story */}
            <div className="bg-bg-secondary py-24 transition-colors">
                <div className="container mx-auto px-6 flex flex-col md:flex-row gap-16 items-center">
                    <div className="flex-1">
                        <h2 className="text-4xl font-bold mb-6 font-outfit text-foreground">The Story</h2>
                        <div className="space-y-4 text-muted text-lg leading-relaxed">
                            <p>
                                Founded by <strong>Saad Shaikh</strong> and <strong>Nabeel Shaikh</strong>, Beyondtee started with a simple question: Why do we have to choose between quality and customization?
                            </p>
                            <p>
                                Existing custom apparel was often generic and uninspired. We wanted to bring the quality of premium luxury brands to a platform where <strong>you</strong> are the designer.
                            </p>
                            <p>
                                By combining advanced WebGL 3D previews with high-end manufacturing, we've bridged the gap. What you see is exactly what you get.
                            </p>
                        </div>
                    </div>
                    <div className="flex-1 bg-background border border-border aspect-square rounded-2xl flex items-center justify-center transition-colors">
                        <span className="text-muted font-bold text-xl uppercase tracking-widest opacity-50">Studio Shot</span>
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className="container mx-auto px-6 py-24">
                <h2 className="text-4xl font-bold mb-16 text-center font-outfit text-foreground">Community</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { name: "Alex K.", role: "Artist", quote: "Finally a platform that respects my designs. The print quality is insane." },
                        { name: "Sarah M.", role: "Developer", quote: "The 3D editor is smoother than most games I play. Love the UX." },
                        { name: "Jordan P.", role: "Hypebeast", quote: "Copped a hoodie with my own NFT on it. Fits perfectly oversized." }
                    ].map((t, i) => (
                        <div key={i} className="bg-bg-secondary border border-border p-8 rounded-2xl relative transition-colors">
                            <div className="text-4xl text-muted/30 font-serif absolute top-4 left-6">"</div>
                            <p className="text-foreground relative z-10 mb-6 italic opacity-80">{t.quote}</p>
                            <div>
                                <div className="font-bold text-foreground">{t.name}</div>
                                <div className="text-xs text-muted uppercase tracking-widest">{t.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Final CTA */}
            <div className="container mx-auto px-6 py-32 text-center border-t border-border">
                <h2 className="text-4xl md:text-6xl font-bold font-outfit mb-12 uppercase tracking-tighter">Ready to <span className="text-accent underline underline-offset-8">Beyond</span>?</h2>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <button
                        onClick={() => window.location.href = '/shop'}
                        className="px-12 py-5 bg-foreground text-background font-bold uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all rounded-full"
                    >
                        Visit Catalog
                    </button>
                    <button
                        onClick={() => window.location.href = '/customize'}
                        className="px-12 py-5 border border-border text-foreground font-bold uppercase tracking-widest text-xs hover:bg-foreground/5 active:scale-95 transition-all rounded-full"
                    >
                        Start Customizing
                    </button>
                </div>
            </div>
        </div>
    );
}
