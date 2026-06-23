"use client";
/* eslint-disable */

import { API_URL } from '@/lib/api-config';

import { useEffect, useState } from "react";
import Link from "next/link";
import { IOrder } from "@/models/Order";
import { Loader2, Package, TrendingUp, Users } from "lucide-react";
import { useSession } from "next-auth/react";

export default function AdminDashboard() {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);

    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            // @ts-ignore
            const token = session.user.accessToken;

            fetch(`${API_URL}/orders`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
                .then(res => {
                    if (res.status === 401 || res.status === 403) {
                        // Unauthorized
                        return { success: false, data: [] };
                    }
                    return res.json();
                })
                .then(data => {
                    if (Array.isArray(data)) {
                        setOrders(data);
                    } else if (data.success && Array.isArray(data.data)) {
                        setOrders(data.data);
                    } else if (data.length === undefined) {
                        setOrders([]); // Handle empty or error response gracefully
                    }
                })
                .catch(err => console.error("Failed to fetch orders", err))
                .finally(() => setLoading(false));
        } else if (status === "unauthenticated") {
            setLoading(false);
        }
    }, [status, session]);

    return (
        <div className="min-h-screen bg-transparent">
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black font-outfit text-foreground uppercase tracking-tighter leading-none mb-2">Command Center</h1>
                    <p className="text-xs text-muted font-bold uppercase tracking-[0.2em]">Beyondtee Central Intelligence</p>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {[
                    { label: 'Total Orders', value: orders.length, icon: <Package size={20} />, color: 'blue' },
                    { label: 'Revenue', value: `₹${(orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0)).toFixed(2)}`, icon: <TrendingUp size={20} />, color: 'accent' },
                    { label: 'Active Customers', value: new Set(orders.map(o => o.customerEmail || (o as any).user?.email)).size, icon: <Users size={20} />, color: 'purple' }
                ].map((stat, i) => (
                    <div key={i} className="p-8 bg-bg-secondary/30 border border-border/50 rounded-2xl backdrop-blur-sm group hover:border-accent/30 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`p-3 rounded-xl bg-foreground/5 text-foreground group-hover:text-accent group-hover:bg-accent/10 transition-all`}>
                                {stat.icon}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted group-hover:text-foreground transition-colors">{stat.label}</span>
                        </div>
                        <div className="text-4xl font-black font-outfit text-foreground tracking-tighter">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Orders Table */}
            <div className="bg-bg-secondary/30 border border-border rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="p-8 border-b border-border/50">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">Recent Intelligence</h2>
                </div>

                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4 text-muted">
                        <Loader2 className="animate-spin text-accent" size={32} />
                        <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Scanning Nexus...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left min-w-[700px]">
                            <thead className="bg-foreground/5 text-muted text-[10px] uppercase font-black tracking-[0.2em] border-b border-border/50">
                                <tr>
                                    <th className="p-6">Order ID</th>
                                    <th className="p-6">Customer</th>
                                    <th className="p-6">Status</th>
                                    <th className="p-6">Amount</th>
                                    <th className="p-6">Date</th>
                                    <th className="p-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {orders.map((order) => {
                                    const orderId = order.id || order._id;
                                    const name = order.customerName || (order as any).user?.name || "Guest";
                                    const email = order.customerEmail || (order as any).user?.email || "No Email";

                                    return (
                                        <tr key={String(orderId)} className="hover:bg-foreground/[0.02] transition-colors group">
                                            <td className="p-6 font-mono text-xs text-accent">#{String(orderId).substring(0, 8)}</td>
                                            <td className="p-6">
                                                <div className="font-bold text-foreground transition-colors">{name}</div>
                                                <div className="text-[10px] text-muted uppercase tracking-widest">{email}</div>
                                            </td>
                                            <td className="p-6">
                                                <span className="px-3 py-1 bg-accent/5 text-accent rounded-full text-[10px] font-black uppercase tracking-widest border border-accent/20">
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-6 font-bold text-foreground font-mono">₹{order.totalAmount}</td>
                                            <td className="p-6 text-muted text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="p-6 text-right">
                                                <Link href={`/admin/orders/${orderId}`} className="text-foreground hover:text-accent text-[10px] font-black uppercase tracking-[0.2em] transition-all">Details</Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
