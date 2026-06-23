/* eslint-disable */

"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/lib/api-config";
import { Loader2, Package, Search, MapPin, CheckCircle, Info } from "lucide-react";
import { IOrder } from "@/models/Order";
import { useSession } from "next-auth/react";

export default function TrackOrderPage() {
    const { data: session } = useSession();
    const [orderId, setOrderId] = useState("");
    const [order, setOrder] = useState<IOrder | null>(null);
    const [userOrders, setUserOrders] = useState<IOrder[]>([]);

    // Status states
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState("");

    // Auto-fetch orders if logged in
    useEffect(() => {
        if (session?.user?.accessToken) {
            setInitialLoading(true);
            fetch(`${API_URL}/orders/my-orders`, {
                headers: {
                    Authorization: `Bearer ${session.user.accessToken}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        // Sort to bring active orders (not delivered) or newest first
                        const sorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                        setUserOrders(sorted);
                        if (sorted.length > 0) {
                            setOrder(sorted[0]);
                            setOrderId(String(sorted[0].id));
                        }
                    }
                })
                .catch(err => console.error("Failed to fetch user orders:", err))
                .finally(() => setInitialLoading(false));
        } else {
            setInitialLoading(false);
        }
    }, [session]);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId.trim()) return;

        setLoading(true);
        setError("");

        // If order is already in our userOrders, just select it to save a network request
        const existingOrder = userOrders.find(o => String(o.id) === orderId.trim());
        if (existingOrder) {
            setOrder(existingOrder);
            setLoading(false);
            return;
        }

        setOrder(null);

        try {
            const res = await fetch(`${API_URL}/orders/${orderId}`);
            if (!res.ok) {
                if (res.status === 404) throw new Error("Order not found");
                throw new Error("Failed to fetch order");
            }
            const data = await res.json();
            setOrder(data);
        } catch (err: any) {
            setError(err.message || "Something went wrong tracking this order");
        } finally {
            setLoading(false);
        }
    };

    const getStatusStep = (status: string) => {
        const steps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
        return steps.indexOf(status?.toUpperCase() || 'PENDING');
    };

    return (
        <div className="min-h-screen bg-background text-foreground pt-24 pb-12 px-4 font-inter transition-colors">
            <div className="container max-w-3xl mx-auto">

                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold font-outfit mb-4 uppercase tracking-tight">
                        {session ? "Live Order Tracking" : "Track Order"}
                    </h1>
                    <p className="text-muted font-medium">
                        {session ? "Automatically tracking your recent purchases" : "Enter your order ID to see the current status"}
                    </p>
                </div>

                {initialLoading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="animate-spin text-accent" size={32} />
                    </div>
                ) : (
                    <>
                        {/* Auto-tracker context for logged in users */}
                        {session && userOrders.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-3 px-1">Your Active Orders</h3>
                                <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar">
                                    {userOrders.map(o => {
                                        const isSelected = order?.id === o.id;
                                        return (
                                            <button
                                                key={String(o.id)}
                                                onClick={() => { setOrder(o); setOrderId(String(o.id)); setError(""); }}
                                                className={`flex-shrink-0 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border ${isSelected ? 'bg-accent text-background border-accent shadow-md shadow-accent/20' : 'bg-bg-secondary/40 text-muted hover:text-foreground border-border hover:border-border/80'}`}
                                            >
                                                #{String(o.id).substring(0, 8)}
                                                <span className="ml-2 opacity-75 hidden sm:inline-block">({o.status})</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Search Input Box */}
                        <div className="bg-bg-secondary/40 p-6 rounded-2xl mb-8 border border-border shadow-sm transition-colors">
                            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    placeholder="Enter Order ID (e.g. 123-abc)"
                                    className="flex-1 bg-background border border-border rounded-xl px-5 py-3.5 focus:outline-none focus:border-accent font-mono text-sm text-foreground transition-all"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !orderId}
                                    className="btn-primary flex items-center justify-center min-h-[50px] min-w-[140px] gap-2 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                                    <span>Track</span>
                                </button>
                            </form>
                            {error && <p className="text-red-500 text-xs mt-3 text-center font-bold px-4">{error}</p>}
                        </div>

                        {/* Tracking Results Area */}
                        {order && !loading ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 transition-all pb-12">

                                <div className="flex justify-between items-center px-2 mb-2">
                                    <h2 className="text-xl font-bold font-outfit uppercase tracking-tight">Order #{String(order.id).substring(0, 8)}</h2>
                                    <span className="text-xs font-bold text-muted uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>

                                {/* Status Bar */}
                                <div className="bg-bg-secondary/40 p-10 py-12 rounded-2xl border border-border relative overflow-hidden transition-colors shadow-sm">
                                    <div className="flex justify-between relative z-10 max-w-2xl mx-auto">
                                        {['Confirmed', 'Processing', 'Shipped', 'Delivered'].map((label, index) => {
                                            const currentStep = getStatusStep(order.status);
                                            const active = index <= currentStep;
                                            return (
                                                <div key={label} className="flex flex-col items-center gap-4 relative">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10 ${active ? 'bg-accent border-accent text-background scale-110 shadow-[0_0_15px_rgba(var(--accent-secondary-rgb),0.5)]' : 'bg-background border-border text-muted opacity-50'}`}>
                                                        {active ? <CheckCircle size={22} /> : <div className="w-2.5 h-2.5 rounded-full bg-border" />}
                                                    </div>
                                                    <span className={`text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-colors ${active ? 'text-foreground' : 'text-muted opacity-50'}`}>{label}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    {/* Progress Line */}
                                    <div className="absolute top-[70px] left-[10%] right-[10%] sm:left-[15%] sm:right-[15%] h-1 bg-border/50 -z-0 rounded-full">
                                        <div
                                            className="h-full bg-accent transition-all duration-1000 rounded-full shadow-[0_0_10px_rgba(var(--accent-secondary-rgb),0.5)]"
                                            style={{ width: `${(getStatusStep(order.status) / 3) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Information Update Box */}
                                <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex gap-4 items-start">
                                    <div className="p-2 bg-accent/10 rounded-lg shrink-0">
                                        <Info size={18} className="text-accent" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-foreground mb-1 uppercase tracking-wider">Automated Updates</h4>
                                        <p className="text-xs text-muted leading-relaxed">
                                            This page is automatically tracking your order. We are preparing it for shipment. We will also send live updates directly to {session?.user?.email ? session.user.email : 'your registered email address'}.
                                        </p>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-bg-secondary/40 p-6 rounded-2xl border border-border transition-colors shadow-sm">
                                        <h3 className="text-muted uppercase tracking-[0.2em] text-[10px] font-black mb-6 flex items-center gap-2">
                                            <MapPin size={14} className="text-accent" /> Shipping To
                                        </h3>
                                        <div className="text-sm space-y-2">
                                            {order.shippingAddress ? (
                                                <>
                                                    <p className="font-bold text-lg mb-3">{order.customerName || session?.user?.name || "Customer"}</p>
                                                    <p className="text-muted font-medium">{order.shippingAddress.street}</p>
                                                    <p className="text-muted font-medium">{order.shippingAddress.city}, {order.shippingAddress.zip || order.shippingAddress.city}</p>
                                                    <p className="text-muted font-medium uppercase tracking-widest text-xs">{order.shippingAddress.country}</p>
                                                </>
                                            ) : (
                                                <p className="text-muted italic opacity-50">Address information unavailable.</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-bg-secondary/40 p-6 rounded-2xl border border-border transition-colors shadow-sm">
                                        <h3 className="text-muted uppercase tracking-[0.2em] text-[10px] font-black mb-6 flex items-center gap-2">
                                            <Package size={14} className="text-accent" /> Order Items ({order.items.length})
                                        </h3>
                                        <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                            {order.items.map((item, i) => (
                                                <div key={i} className="flex gap-4 p-3 rounded-xl bg-background border border-border/50">
                                                    <div className="w-14 h-14 bg-bg-secondary rounded-lg flex-shrink-0 overflow-hidden border border-border">
                                                        {item.customizationData ? (
                                                            <img src={(typeof item.customizationData === 'string' ? JSON.parse(item.customizationData)[0]?.preview : item.customizationData[0]?.preview) || item.previewImage || "/placeholder.png"} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-muted">IMG</div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col justify-center">
                                                        <div className="text-sm font-bold uppercase tracking-tight">{item.product?.name || "Premium Item"}</div>
                                                        <div className="text-[10px] text-muted uppercase font-bold tracking-widest mt-1">
                                                            {item.size} • {item.color} • Qty: {item.quantity}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            !order && !loading && session && userOrders.length === 0 && (
                                <div className="text-center p-12 bg-bg-secondary/20 rounded-2xl border border-border">
                                    <p className="text-muted mb-4">You don't have any active orders right now.</p>
                                    <a href="/shop" className="text-accent hover:underline font-bold text-sm">Start Shopping</a>
                                </div>
                            )
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
