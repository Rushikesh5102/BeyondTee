"use client";
/* eslint-disable */


import { useCartStore } from "@/lib/store/cartStore";
import Link from "next/link";
import { Trash2, ArrowRight } from "lucide-react";
import { CartSkeleton } from "@/components/ui/Skeleton";
import { useState, useEffect } from "react";

export default function CartPage() {
    const { items, removeItem, total } = useCartStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground p-8 pt-24 font-inter transition-colors">
            <div className="container max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 font-outfit uppercase tracking-tighter">Your Bag</h1>

                {loading ? (
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="md:col-span-2 space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <CartSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-24 bg-bg-secondary/30 rounded-3xl border border-border backdrop-blur-sm">
                        <p className="text-xl text-muted mb-8 font-medium">Your collection is empty.</p>
                        <Link href="/shop" className="bg-foreground text-background px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all">Browse Collections</Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="md:col-span-2 space-y-4">
                            {items.map(item => (
                                <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-6 bg-bg-secondary/50 border border-border rounded-2xl items-center transition-all hover:bg-bg-secondary/80 group">
                                    <div className="w-28 h-28 bg-background rounded-xl flex-shrink-0 relative overflow-hidden border border-border p-2">
                                        {item.previewImage ? (
                                             
                                            <img src={item.previewImage} alt="Design Preview" className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="absolute inset-0 bg-foreground/5 flex items-center justify-center text-xs text-muted">
                                                {item.color}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="font-bold text-lg">{item.name}</h3>
                                        <p className="text-sm text-muted">Size: {item.size}</p>
                                        <div className="flex items-center justify-center sm:justify-start gap-4 mt-2">
                                            <p className="text-accent font-mono">₹{item.price * item.quantity}</p>

                                            <div className="flex items-center bg-bg-secondary rounded-md border border-border">
                                                <button
                                                    onClick={() => useCartStore.getState().updateQuantity(item.id, item.quantity - 1)}
                                                    className="px-2 py-1 text-muted hover:text-foreground transition-colors"
                                                    disabled={item.quantity <= 1}
                                                >-</button>
                                                <span className="px-2 text-sm font-mono">{item.quantity}</span>
                                                <button
                                                    onClick={() => useCartStore.getState().updateQuantity(item.id, item.quantity + 1)}
                                                    className="px-2 py-1 text-muted hover:text-foreground transition-colors"
                                                >+</button>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="p-2 text-muted hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="h-fit p-6 bg-bg-secondary/50 border border-border rounded-xl space-y-6 transition-colors">
                            <h3 className="font-bold text-xl font-outfit">Summary</h3>
                            <div className="space-y-2 text-sm text-muted">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{total().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-border flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="text-accent">₹{total().toFixed(2)}</span>
                            </div>

                            <Link href="/checkout" className="btn-primary w-full flex justify-center items-center gap-2">
                                Checkout <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
