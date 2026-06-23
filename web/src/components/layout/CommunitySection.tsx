"use client";
/* eslint-disable */

import { motion } from "framer-motion";
import { Instagram, Mail, Heart } from "lucide-react";

const FEED_IMAGES = [
    { type: 'image', url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop', likes: '1.2k' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop', likes: '850' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop', likes: '2.1k' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1562157873-13838ab84617?q=80&w=1000&auto=format&fit=crop', likes: '560' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=1000&auto=format&fit=crop', likes: '3.4k' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop', likes: '920' },
];

export default function CommunitySection() {
    return (
        <section className="py-24 bg-bg-secondary transition-colors overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-black uppercase tracking-[0.4em] text-accent mb-6">Built by You</h2>
                    <h3 className="text-4xl md:text-7xl font-bold font-outfit uppercase tracking-tighter leading-[0.8] mb-8">
                        The <br /> <span className="text-muted">Manifesto</span>
                    </h3>
                    <div className="flex justify-center gap-6">
                        <a href="https://www.instagram.com/beyondtee_" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors font-bold uppercase tracking-widest text-[10px]">
                            <Instagram size={16} /> @beyondtee_
                        </a>
                        <a href="mailto:info@beyondtee.in" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors font-bold uppercase tracking-widest text-[10px]">
                            <Mail size={16} /> Contact Us
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {FEED_IMAGES.map((media, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="group relative aspect-square bg-background rounded-xl overflow-hidden border border-border transition-all hover:border-accent/50"
                        >
                            <img
                                src={media.url}
                                alt={`Community Feed ${i}`}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-80 group-hover:opacity-100 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                <Heart className="text-accent fill-accent" size={24} />
                                <span className="font-mono text-xs font-bold">{media.likes}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-muted text-sm max-w-lg mx-auto leading-relaxed font-medium">
                        Join 10,000+ creators worldwide who are redefining fashion. <br />
                        Tag us to get featured in our seasonal manifesto.
                    </p>
                </div>
            </div>
        </section>
    );
}

