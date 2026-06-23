"use client";
/* eslint-disable */

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api-config";
import { IProduct } from "@/models/Product";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function PopularSection() {
    const [products, setProducts] = useState<IProduct[]>([]);

    useEffect(() => {
        fetch(`${API_URL}/products`)
            .then(res => res.json())
            .then(data => {
                const all = Array.isArray(data) ? data : (data.success ? data.data : []);
                setProducts(all.slice(0, 4));
            })
            .catch(err => console.error(err));
    }, []);

    if (products.length === 0) return null;

    return (
        <section className="py-24 bg-background transition-colors overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-accent mb-4">Trending Now</h2>
                        <h3 className="text-4xl md:text-6xl font-bold font-outfit uppercase leading-none tracking-tighter">
                            Popular <br /> <span className="text-muted">Creations</span>
                        </h3>
                    </div>
                    <Link href="/shop" className="text-xs font-bold uppercase tracking-widest border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-all">
                        View All Products
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product, i) => (
                        <ScrollReveal
                            key={product.id || (product as any)._id}
                            delay={i * 0.1}
                            blur="6px"
                            yOffset={30}

                        >
                            <Link href={product.stock === 0 ? '#' : `/customize?id=${product.id || (product as any)._id}`} className={`group block ${product.stock === 0 ? 'cursor-not-allowed opacity-80' : ''}`}>
                                <div className="aspect-[3/4] bg-bg-secondary rounded-2xl overflow-hidden mb-6 border border-border group-hover:border-accent/40 transition-all relative">
                                    {/* Image placeholder logic */}
                                    <div className="w-full h-full flex items-center justify-center bg-bg-secondary p-8">
                                        <img
                                            src={(() => {
                                                const imgs = product.images as unknown as string | string[];
                                                if (Array.isArray(imgs)) return imgs[0];
                                                if (typeof imgs === 'string' && imgs.startsWith('[')) return JSON.parse(imgs)[0];
                                                return (imgs as string) || "/placeholder.png";
                                            })()}
                                            alt={product.name}
                                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                        />
                                    </div>
                                    <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full border border-border">
                                        <span className="text-[10px] font-bold uppercase tracking-widest">₹{product.price}</span>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform bg-gradient-to-t from-background to-transparent">
                                        <button className="w-full bg-foreground text-background py-3 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                                            {product.stock === 0 ? "It's beyond your reach." : "Customize Now"}
                                        </button>
                                    </div>
                                </div>
                                <h4 className="font-bold uppercase tracking-tighter text-xl group-hover:text-accent transition-colors">{product.name}</h4>
                                <p className="text-xs text-muted uppercase tracking-widest mt-1">{product.collection || 'Limited Series'}</p>
                            </Link>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
