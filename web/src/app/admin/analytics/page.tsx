/* eslint-disable */

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { API_URL } from "@/lib/api-config";
import { BarChart, IndianRupee, Package, ShoppingBag, TrendingUp, AlertTriangle } from "lucide-react";

interface IStats {
    totalOrders: number;
    totalRevenue: number;
    recentOrders: any[];
    lowStockProducts: any[];
}

export default function AnalyticsPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<IStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user) {
            fetchStats();
        }
    }, [session]);

    const fetchStats = async () => {
        try {
            // @ts-ignore
            const token = session?.user?.accessToken;
            const res = await fetch(`${API_URL}/orders/stats`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading analytics...</div>;
    if (!stats) return <div className="p-8 text-center text-red-500">Failed to load data.</div>;

    return (
        <div className="min-h-screen bg-white">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-outfit text-black">Analytics</h1>
                    <p className="text-gray-500">Business performance overview</p>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{stats.totalRevenue.toLocaleString()}</h3>
                    </div>
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                        <IndianRupee size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Orders</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders}</h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                        <ShoppingBag size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Avg. Order Value</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">
                            ₹{stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString() : 0}
                        </h3>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                        <TrendingUp size={24} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">Recent Orders</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {stats.recentOrders.map((order: any) => (
                            <div key={order.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                <div>
                                    <div className="font-medium text-gray-900 text-sm">#{order.id.substring(0, 8)}</div>
                                    <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium text-gray-900 text-sm">₹{order.totalAmount}</div>
                                    <div className="text-xs text-gray-500">{order.status}</div>
                                </div>
                            </div>
                        ))}
                        {stats.recentOrders.length === 0 && (
                            <div className="p-8 text-center text-gray-400 text-sm">No recent activity</div>
                        )}
                    </div>
                </div>

                {/* Inventory Alerts */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <AlertTriangle size={16} className="text-amber-500" />
                            Low Stock Alert
                        </h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {stats.lowStockProducts.map((product: any) => (
                            <div key={product.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                                <div className={`text-sm font-bold ${product.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                                    {product.stock} units
                                </div>
                            </div>
                        ))}
                        {stats.lowStockProducts.length === 0 && (
                            <div className="p-8 text-center text-gray-400 text-sm">Inventory looks good!</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
