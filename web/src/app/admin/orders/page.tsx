/* eslint-disable */

"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api-config";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Search, Filter, Eye } from "lucide-react";
import { IOrder } from "@/models/Order";

export default function AdminOrdersPage() {
    const { data: session, status } = useSession();
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            fetchOrders();
        } else if (status === "unauthenticated") {
            setLoading(false);
        }
    }, [session, status]);

    const fetchOrders = async () => {
        try {
            // @ts-ignore
            const token = session?.user?.accessToken;
            const res = await fetch(`${API_URL}/orders`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setOrders(data);
            } else if (data.data) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        if (!status) return 'bg-gray-100 text-gray-700 border-gray-200';
        switch (status.toUpperCase()) {
            case 'DELIVERED': return 'bg-green-100 text-green-700 border-green-200';
            case 'SHIPPED': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'PROCESSING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const filteredOrders = orders.filter(order => {
        const orderId = order.id || order._id || '';
        const email = order.customerEmail || (order as any).user?.email || '';
        return orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="min-h-screen bg-transparent">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black font-outfit text-foreground uppercase tracking-tighter leading-none mb-2">Orders</h1>
                    <p className="text-xs text-muted font-bold uppercase tracking-[0.2em]">Live customer transactions</p>
                </div>
            </div>

            <div className="bg-bg-secondary/30 border border-border rounded-2xl overflow-hidden backdrop-blur-sm transition-colors">
                <div className="p-6 border-b border-border/50 flex gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by Order ID or Email..."
                            className="w-full bg-background/50 pl-12 pr-4 py-3 border border-border/50 rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all text-sm text-foreground placeholder-muted"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-foreground/5 text-muted text-[10px] uppercase font-black tracking-[0.2em] border-b border-border/50">
                        <tr>
                            <th className="p-6">Order ID</th>
                            <th className="p-6">Customer</th>
                            <th className="p-6">Date</th>
                            <th className="p-6">Total</th>
                            <th className="p-6">Status</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading...</td></tr>
                        ) : filteredOrders.map((order) => {
                            const orderId = order.id || order._id;
                            const email = order.customerEmail || (order as any).user?.email || "No Email";
                            const name = order.customerName || (order as any).user?.name || "Guest";

                            return (
                                <tr key={orderId} className="hover:bg-foreground/[0.02] border-b border-border/30 last:border-0 transition-colors group text-sm">
                                    <td className="p-6 font-mono text-accent">#{orderId.substring(0, 8)}</td>
                                    <td className="p-6">
                                        <div className="font-bold text-foreground">{name}</div>
                                        <div className="text-[10px] text-muted uppercase tracking-widest">{email}</div>
                                    </td>
                                    <td className="p-6 text-muted">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-6 font-bold text-foreground">₹{order.totalAmount}</td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <Link href={`/admin/orders/${orderId}`} className="text-accent hover:text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-end gap-2 group/btn">
                                            View <Eye size={14} className="group-hover/btn:scale-110 transition-transform" />
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
