"use client";
/* eslint-disable */

import { API_URL } from '@/lib/api-config';

import { useEffect, useState } from "react";
import { IOrder } from "@/models/Order";
import { Loader2, Package } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ProfilePage() {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);

    const { data: session } = useSession();
    const [guestOrders, setGuestOrders] = useState<string[]>([]);

    useEffect(() => {
        // 1. Authenticated User Flow
        if (session?.user?.accessToken) {
            fetch(`${API_URL}/orders/my-orders`, {
                headers: {
                    Authorization: `Bearer ${session.user.accessToken}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setOrders(data);
                    }
                })
                .catch(err => console.error("Failed to fetch orders:", err))
                .finally(() => setLoading(false));
            return;
        }

        // 2. Guest User Flow
        // Check for newly created order passed via URL or investigate LocalStorage
        // Ideally, Checkout should save 'recent_order_id' to LS.
        // For now, let's try to fetch if we have stored IDs (Implementation needed in Checkout first)
        const storedOrderIds = JSON.parse(localStorage.getItem('guest_order_ids') || '[]');
        if (storedOrderIds.length > 0) {
            Promise.all(storedOrderIds.map((id: string) =>
                fetch(`${API_URL}/orders/${id}`).then(res => {
                    if (res.ok) return res.json();
                    return null;
                })
            )).then((results) => {
                const validOrders = results.filter(o => o !== null);
                setOrders(validOrders);
            }).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [session]);

    return (
        <div className="min-h-screen bg-background text-foreground p-8 pt-24 font-inter transition-colors">
            <div className="container max-w-4xl mx-auto">
                <header className="mb-12 border-b border-border pb-8">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/50 rounded-2xl flex items-center justify-center text-background font-black text-3xl shadow-lg">
                            {session?.user?.name?.[0] || "U"}
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold font-outfit uppercase tracking-tight">{session?.user?.name || "User Profile"}</h1>
                            <p className="text-muted font-medium">{session?.user?.email}</p>
                        </div>
                    </div>
                </header>

                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 font-outfit uppercase tracking-tight">
                    <Package className="text-accent" /> Order History
                </h2>

                {loading ? (
                    <div className="flex justify-center p-12"><Loader2 className="animate-spin text-accent" /></div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 bg-bg-secondary/20 rounded-2xl border border-border transition-colors">
                        <p className="text-muted">No orders found.</p>
                        <Link href="/shop" className="text-accent hover:underline mt-2 inline-block">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={String(order.id)} className="p-6 bg-bg-secondary border border-border rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all hover:border-accent/40">
                                <div>
                                    <div className="text-[10px] text-muted uppercase tracking-[0.2em] mb-2 font-bold">
                                        {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                    </div>
                                    <div className="font-bold text-xl font-outfit mb-1">Order #{String(order.id).substring(0, 8).toUpperCase()}</div>
                                    <div className="text-sm text-muted font-medium">
                                        {order.items.length} items · Total Amount: ₹{order.totalAmount}
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-border transition-colors">
                                    <span className="px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-xs font-bold uppercase tracking-widest text-accent">
                                        {order.status}
                                    </span>
                                    <Link href={`/cart`} className="text-foreground hover:text-accent font-bold uppercase tracking-widest text-xs transition-colors ml-auto md:ml-0">
                                        Buy Again
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
